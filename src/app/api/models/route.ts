import { NextResponse } from 'next/server';
import { cohereService } from '@/services/cohere';

export async function GET() {
  try {
    // Get real models from Cohere
    const response = await cohereService.listModels();

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      models: response.data 
    });
  } catch (error: any) {
    console.error('List models API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 