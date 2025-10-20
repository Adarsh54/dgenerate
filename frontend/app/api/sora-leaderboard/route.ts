import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data: leaderboard, error } = await supabase.rpc('get_sora_leaderboard', {
      limit_count: limit
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leaderboard
    });

  } catch (error: any) {
    console.error('Error fetching SORA leaderboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch SORA leaderboard' 
      },
      { status: 500 }
    );
  }
}
