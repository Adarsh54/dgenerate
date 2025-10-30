import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const challengeId = searchParams.get('challengeId');

    if (challengeId) {
      // Get specific challenge
      const challenge = await SupabaseService.getChallengeById(challengeId);
      return NextResponse.json({ 
        success: true, 
        data: challenge 
      });
    } else {
      // Get active challenges
      const challenges = await SupabaseService.getActiveChallenges(limit);
      return NextResponse.json({ 
        success: true, 
        data: challenges 
      });
    }

  } catch (error: any) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch challenges' 
      },
      { status: 500 }
    );
  }
}
