import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');

    if (!walletId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: walletId' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('total_tokens_earned, correct_guesses, total_guesses')
      .eq('wallet_id', walletId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        soraBalance: user?.total_tokens_earned || 0,
        correctGuesses: user?.correct_guesses || 0,
        totalGuesses: user?.total_guesses || 0
      }
    });

  } catch (error: any) {
    console.error('Error fetching SORA balance:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch SORA balance' 
      },
      { status: 500 }
    );
  }
}
