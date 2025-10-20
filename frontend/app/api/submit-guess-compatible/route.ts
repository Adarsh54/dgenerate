import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { comparePrompts } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { walletId, imageId, guessText } = await request.json();

    if (!walletId || !imageId || !guessText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: walletId, imageId, guessText' },
        { status: 400 }
      );
    }

    // Get the image details
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select('prompt')
      .eq('id', imageId)
      .single();

    if (imageError || !image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Compare texts using vector embeddings
    const embeddingResult = await comparePrompts(guessText, image.prompt);
    
    // Determine if the guess is correct (75% similarity threshold)
    const isCorrect = embeddingResult.isSimilar;
    const similarityScore = Math.round(embeddingResult.similarity * 100); // Convert to 0-100 scale
    const tokensEarned = isCorrect ? 1 : 0; // 1 SORA token for correct guess

    // Submit the guess (the trigger will automatically update user stats)
    const { data: guess, error: guessError } = await supabase
      .from('guesses')
      .insert({
        image_id: imageId,
        wallet_id: walletId,
        guess_text: guessText,
        is_correct: isCorrect,
        similarity_score: similarityScore,
        tokens_earned: tokensEarned
      })
      .select()
      .single();

    if (guessError) {
      return NextResponse.json(
        { success: false, error: guessError.message },
        { status: 500 }
      );
    }

    // Get updated user stats
    const { data: userStats } = await supabase
      .from('users')
      .select('total_tokens_earned, correct_guesses, total_guesses')
      .eq('wallet_id', walletId)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        guessId: guess.id,
        isCorrect,
        similarity: embeddingResult.similarity,
        similarityScore,
        soraEarned: tokensEarned,
        totalSoraBalance: userStats?.total_tokens_earned || 0,
        userStats: userStats
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
