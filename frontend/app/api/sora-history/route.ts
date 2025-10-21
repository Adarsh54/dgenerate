import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    const { data: history, error } = await supabase.rpc('get_sora_history', {
      user_uuid: userId,
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
      data: history
    });

  } catch (error: any) {
    console.error('Error fetching SORA history:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch SORA history' 
      },
      { status: 500 }
    );
  }
}
