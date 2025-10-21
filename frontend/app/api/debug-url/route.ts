import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    supabaseUrl: supabaseUrl,
    supabaseKeyLength: supabaseKey ? supabaseKey.length : 0,
    keyStartsWith: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Missing',
    fullUrl: supabaseUrl ? `${supabaseUrl}/rest/v1/` : 'Missing'
  });
}
