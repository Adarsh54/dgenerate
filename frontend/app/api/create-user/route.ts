import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase';
import { CreateUserRequest } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    
    const { walletAddress, username } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: walletAddress' },
        { status: 400 }
      );
    }

    const userId = await SupabaseService.createOrUpdateUser(walletAddress, username);

    return NextResponse.json({ 
      success: true, 
      data: { userId } 
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create user' 
      },
      { status: 500 }
    );
  }
}
