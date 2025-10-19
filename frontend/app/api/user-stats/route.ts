import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet ID is required' },
        { status: 400 }
      );
    }

    // Fetch user stats
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_id', walletId)
      .single();

    // If user doesn't exist yet, return empty stats
    if (userError && userError.code === 'PGRST116') {
      return NextResponse.json({
        wallet_id: walletId,
        total_guesses: 0,
        correct_guesses: 0,
        total_tokens_earned: 0,
        accuracy: 0,
      });
    }

    if (userError) {
      console.error('Error fetching user stats:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user stats' },
        { status: 500 }
      );
    }

    // Calculate accuracy
    const accuracy = userData.total_guesses > 0
      ? (userData.correct_guesses / userData.total_guesses) * 100
      : 0;

    return NextResponse.json({
      ...userData,
      accuracy: Math.round(accuracy * 100) / 100,
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

