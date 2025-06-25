import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cohereService } from '@/services/cohere';

export async function GET() {
  try {
    // Get real datasets from Cohere
    const response = await cohereService.listDatasets();

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      datasets: response.data 
    });
  } catch (error: any) {
    console.error('List datasets API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Missing file or name' },
        { status: 400 }
      );
    }

    // Upload dataset to Cohere
    const response = await cohereService.createDataset(name, file);

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      dataset: response.data 
    });
  } catch (error: any) {
    console.error('Upload dataset API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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
    const datasetId = searchParams.get('id');

    if (!datasetId) {
      return NextResponse.json(
        { error: 'Dataset ID is required' },
        { status: 400 }
      );
    }

    // Delete dataset from Cohere
    const response = await cohereService.deleteDataset(datasetId);

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status || 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dataset deleted successfully' 
    });
  } catch (error: any) {
    console.error('Delete dataset API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 