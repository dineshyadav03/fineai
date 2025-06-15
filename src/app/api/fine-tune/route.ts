import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { cohere } from '@/lib/cohere/client';

export async function POST(request: Request) {
  try {
    const { filePath, model, task } = await request.json();

    // Start fine-tuning job
    const response = await cohere.fineTune({
      model,
      task,
      dataset: filePath,
    });

    // Store job information in Supabase
    const { error: dbError } = await supabase
      .from('fine_tuning_jobs')
      .insert({
        job_id: response.id,
        model,
        task,
        dataset_path: filePath,
        status: 'pending',
      });

    if (dbError) {
      throw new Error('Failed to store job information');
    }

    return NextResponse.json({ success: true, jobId: response.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get job status from Cohere
    const response = await cohere.getFineTuneJob(jobId);

    // Update job status in Supabase
    const { error: dbError } = await supabase
      .from('fine_tuning_jobs')
      .update({ status: response.status })
      .eq('job_id', jobId);

    if (dbError) {
      throw new Error('Failed to update job status');
    }

    return NextResponse.json({ success: true, status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 