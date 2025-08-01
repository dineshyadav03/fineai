import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cohereService } from '@/services/cohere';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { datasetId, modelName, baseModel } = await request.json();

    if (!datasetId || !modelName || !baseModel) {
      return NextResponse.json(
        { error: 'Missing required fields: datasetId, modelName, baseModel' },
        { status: 400 }
      );
    }

    // Create fine-tuned model using the service
    const response = await cohereService.createModel(datasetId, modelName, baseModel);

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    // Store job information in Supabase
    const { error: dbError } = await supabase
      .from('fine_tuning_jobs')
      .insert({
        user_id: user.id,
        job_id: response.data.id,
        model: baseModel,
        task: 'fine-tune',
        dataset_path: datasetId,
        status: response.data.status || 'pending',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB insert fails, just log it
    }

    return NextResponse.json({ 
      success: true, 
      model: response.data 
    });
  } catch (error: any) {
    console.error('Fine-tune API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Get model status from Cohere
    const response = await cohereService.getModel(modelId);

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    // Update job status in Supabase
    const { error: dbError } = await supabase
      .from('fine_tuning_jobs')
      .update({ status: response.data.status })
      .eq('job_id', modelId)
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Database update error:', dbError);
      // Don't fail the request if DB update fails, just log it
    }

    return NextResponse.json({ 
      success: true, 
      model: response.data 
    });
  } catch (error: any) {
    console.error('Get model API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 