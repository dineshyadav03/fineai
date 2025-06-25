import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_COHERE_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    // Check if Cohere API is accessible
    let cohereStatus = 'unknown';
    try {
      const cohereResponse = await fetch('https://api.cohere.ai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
        },
      });
      cohereStatus = cohereResponse.ok ? 'healthy' : 'error';
    } catch {
      cohereStatus = 'unreachable';
    }

    const health = {
      status: missingEnvVars.length === 0 && cohereStatus === 'healthy' ? 'healthy' : 'warning',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        cohere: cohereStatus,
        supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
      },
      configuration: {
        missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
        hasRequiredEnvVars: missingEnvVars.length === 0,
      },
    };

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 