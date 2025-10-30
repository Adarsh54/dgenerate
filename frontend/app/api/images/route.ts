import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const difficulty = searchParams.get('difficulty');

    // Build query
    let query = supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by difficulty if specified
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching images:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: data || [] });
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST endpoint to add new images (admin/script use)
export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt, difficulty } = await request.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Image URL and prompt are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('images')
      .insert({
        image_url: imageUrl,
        prompt,
        difficulty: difficulty || 'medium',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting image:', error);
      return NextResponse.json(
        { error: 'Failed to insert image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: data });
  } catch (error: any) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add image' },
      { status: 500 }
    );
  }
}


