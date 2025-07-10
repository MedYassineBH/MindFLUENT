import { NextResponse } from 'next/server';
import { testConnection } from '@/utils/openai';

export async function GET() {
  try {
    const result = await testConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to connect to API' },
      { status: 500 }
    );
  }
} 