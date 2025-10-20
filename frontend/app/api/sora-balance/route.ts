import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    const { data: balance, error } = await supabase.rpc('get_sora_balance', {
      user_uuid: userId
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
        soraBalance: balance || 0
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
