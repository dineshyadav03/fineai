import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { CohereClient } from 'cohere-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      model_id, 
      message, 
      access_method = 'proxy',
      user_api_key,
      stream = false 
    } = body;

    if (!model_id || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: model_id and message' 
      }, { status: 400 });
    }

    // Get user authentication
    const supabase = createServerComponentClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle different access methods
    let cohereClient: CohereClient;
    let actualModelId: string;

    if (access_method === 'byok') {
      // BYOK: Use user's API key
      if (!user_api_key) {
        return NextResponse.json({ 
          error: 'API key required for BYOK access method' 
        }, { status: 400 });
      }

      cohereClient = new CohereClient({
        token: user_api_key,
      });

      // For BYOK, model_id is the direct Cohere model ID
      actualModelId = model_id;

    } else {
      // Proxy: Use platform API key
      if (!process.env.COHERE_API_KEY) {
        return NextResponse.json({ 
          error: 'Platform Cohere API key not configured' 
        }, { status: 500 });
      }

      cohereClient = new CohereClient({
        token: process.env.COHERE_API_KEY,
      });

      // For proxy, look up the model mapping in database
      const { data: modelData, error: modelError } = await supabase
        .from('user_models')
        .select('cohere_model_id, access_method, usage_count, usage_limit')
        .eq('id', model_id)
        .eq('user_id', user.id)
        .single();

      if (modelError || !modelData) {
        return NextResponse.json({ 
          error: 'Model not found or access denied' 
        }, { status: 404 });
      }

      // Check usage limits for proxy models
      if (modelData.usage_limit > 0 && modelData.usage_count >= modelData.usage_limit) {
        return NextResponse.json({ 
          error: 'Usage limit reached for this model' 
        }, { status: 429 });
      }

      actualModelId = modelData.cohere_model_id;
    }

    // Make the chat request to Cohere
    const response = await cohereClient.chat({
      model: actualModelId,
      message,
    });

    // Variables for usage tracking
    let currentModel: any = null;
    let newUsageCount: number = 0;

    // For proxy method, update usage count
    if (access_method === 'proxy') {
      // Get current usage count first
      const { data: modelUsage } = await supabase
        .from('user_models')
        .select('usage_count, usage_limit')
        .eq('id', model_id)
        .eq('user_id', user.id)
        .single();

      currentModel = modelUsage;
      newUsageCount = (currentModel?.usage_count || 0) + 1;
      
      await supabase
        .from('user_models')
        .update({ 
          usage_count: newUsageCount,
          last_used: new Date().toISOString()
        })
        .eq('id', model_id)
        .eq('user_id', user.id);

      // Log usage for analytics
      await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          model_id: model_id,
          access_method: 'proxy',
          tokens_used: response.meta?.billedUnits?.inputTokens || 0,
          timestamp: new Date().toISOString()
        });
    }

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          // In a real implementation, you'd handle the streaming response from Cohere
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(response)}\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    return NextResponse.json({
      response: response.text,
      model_id: actualModelId,
      access_method,
      usage: access_method === 'proxy' ? {
        tokens_used: response.meta?.billedUnits?.inputTokens || 0,
        remaining_calls: access_method === 'proxy' && currentModel ? Math.max(0, (currentModel.usage_limit || 0) - newUsageCount) : null
      } : null
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle specific Cohere API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          error: 'Invalid API key' 
        }, { status: 401 });
      }
      if (error.message.includes('model')) {
        return NextResponse.json({ 
          error: 'Model not found or not accessible' 
        }, { status: 404 });
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded' 
        }, { status: 429 });
      }
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 