import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const challenge = await SupabaseService.getRandomChallenge();

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: 'No active challenges found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: challenge 
    });

  } catch (error: any) {
    console.error('Error fetching random challenge:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch random challenge' 
      },
      { status: 500 }
    );
  }
}
