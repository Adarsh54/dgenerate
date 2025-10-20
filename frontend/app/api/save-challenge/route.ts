import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase';
import { CreateChallengeRequest } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: CreateChallengeRequest = await request.json();
    
    const { imageUrl, actualPrompt, imageId, userId, difficultyLevel } = body;

    if (!imageUrl || !actualPrompt || !imageId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: imageUrl, actualPrompt, imageId' },
        { status: 400 }
      );
    }

    const challenge = await SupabaseService.createChallenge({
      imageUrl,
      actualPrompt,
      imageId,
      createdBy: userId,
      difficultyLevel: difficultyLevel || 1,
    });

    return NextResponse.json({ 
      success: true, 
      data: challenge 
    });

  } catch (error: any) {
    console.error('Error saving challenge:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to save challenge' 
      },
      { status: 500 }
    );
  }
}
