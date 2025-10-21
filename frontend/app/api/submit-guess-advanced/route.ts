import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { comparePrompts } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId, guessText } = await request.json();

    if (!userId || !challengeId || !guessText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, challengeId, guessText' },
        { status: 400 }
      );
    }

    // Get the challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('image_challenges')
      .select('actual_prompt, prompt_embedding')
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Compare texts using vector embeddings
    const embeddingResult = await comparePrompts(guessText, challenge.actual_prompt);
    
    // Determine if the guess is correct (75% similarity threshold)
    const isCorrect = embeddingResult.isSimilar;
    const soraReward = isCorrect ? 1 : 0; // 1 SORA token for correct guess

    // Submit the guess with embedding
    const { data: guess, error: guessError } = await supabase.rpc('submit_guess_with_embedding', {
      user_uuid: userId,
      challenge_uuid: challengeId,
      guess_text: guessText,
      similarity_score: embeddingResult.similarity,
      is_correct: isCorrect,
      tokens_earned: soraReward,
      guess_embedding: embeddingResult.embeddings
    });

    if (guessError) {
      return NextResponse.json(
        { success: false, error: guessError.message },
        { status: 500 }
      );
    }

    // Get updated user balance
    const { data: balance } = await supabase.rpc('get_sora_balance', {
      user_uuid: userId
    });

    return NextResponse.json({
      success: true,
      data: {
        guessId: guess,
        isCorrect,
        similarity: embeddingResult.similarity,
        soraEarned: soraReward,
        totalSoraBalance: balance || 0
      }
    });

  } catch (error: any) {
    console.error('Error submitting guess:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to submit guess' 
      },
      { status: 500 }
    );
  }
}
