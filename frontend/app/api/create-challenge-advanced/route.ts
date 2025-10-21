import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { embeddingService } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, actualPrompt, imageId, userId, difficultyLevel } = await request.json();

    if (!imageUrl || !actualPrompt || !imageId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: imageUrl, actualPrompt, imageId' },
        { status: 400 }
      );
    }

    // Generate embedding for the actual prompt
    const promptEmbedding = await embeddingService.getEmbeddings(actualPrompt);

    // Create challenge with embedding
    const { data: challengeId, error } = await supabase.rpc('create_challenge_with_embedding', {
      image_url: imageUrl,
      actual_prompt: actualPrompt,
      image_id: imageId,
      created_by: userId || null,
      difficulty_level: difficultyLevel || 1,
      prompt_embedding: promptEmbedding
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        challengeId,
        imageUrl,
        actualPrompt,
        imageId
      }
    });

  } catch (error: any) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create challenge' 
      },
      { status: 500 }
    );
  }
}
