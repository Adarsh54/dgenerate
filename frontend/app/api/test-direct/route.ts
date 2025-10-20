import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing environment variables' });
    }

    // Test direct fetch to Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        error: 'Direct fetch failed',
        status: response.status,
        statusText: response.statusText,
        url: `${supabaseUrl}/rest/v1/`
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Direct fetch successful',
      status: response.status
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Direct fetch error',
      details: error.message,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  }
}
