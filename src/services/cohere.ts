import { CohereClient } from 'cohere-ai';
import { Dataset, Model, FineTuneJob, CohereResponse } from '@/types/cohere';

class CohereService {
  private client: CohereClient;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY || '';
    this.client = new CohereClient({
      token: apiKey,
    });
  }

  async createDataset(name: string, file: File): Promise<CohereResponse<Dataset>> {
    try {
      console.log('Starting dataset upload:', { name, size: file.size, type: file.type });
      
      if (file.size === 0) {
        throw new Error('File is empty. Please select a valid file with content.');
      }
      
      const formData = new FormData();
      formData.append('data', file); // Cohere expects 'data' not 'file'

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for larger files

      console.log('Sending request to Cohere API...');

      // According to Cohere API docs, name and type should be query parameters
      const url = new URL('https://api.cohere.ai/v1/datasets');
      url.searchParams.append('name', name);
      url.searchParams.append('type', 'chat-finetune-input'); // For prompt/completion conversational data

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dataset upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        let errorMessage = `Upload failed: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = `Upload failed: ${errorJson.message}`;
          }
        } catch (e) {
          // If not JSON, use the raw text
          if (errorText) {
            errorMessage = `Upload failed: ${errorText}`;
          }
        }
        
        if (response.status === 401) {
          throw new Error('Invalid Cohere API key. Please check your API key configuration.');
        } else if (response.status === 422) {
          throw new Error('Invalid file format. Please ensure your file has "prompt" and "completion" fields and is properly formatted.');
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('Dataset upload successful:', data);
      return { data };
    } catch (error: any) {
      console.error('Error creating dataset:', error);
      
      if (error.name === 'AbortError') {
        return {
          data: null as unknown as Dataset,
          error: {
            message: 'Upload timeout - the file might be too large or the connection is slow. Try a smaller file.',
            status: 408,
          },
        };
      }
      
      return {
        data: null as unknown as Dataset,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred during upload',
          status: 500,
        },
      };
    }
  }

  async listDatasets(): Promise<CohereResponse<Dataset[]>> {
    try {
      console.log('Fetching datasets...');
      
      const response = await fetch('https://api.cohere.ai/v1/datasets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('List datasets failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to list datasets: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datasets fetched successfully:', data);
      return { data: data.datasets || [] };
    } catch (error) {
      console.error('Error listing datasets:', error);
      return {
        data: [],
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async createModel(datasetId: string, name: string, baseModel: string): Promise<CohereResponse<Model>> {
    try {
      console.log('Creating model:', { datasetId, name, baseModel });
      
      const requestBody = {
        name,
        settings: {
          base_model: {
            base_type: 'BASE_TYPE_CHAT',
          },
          dataset_id: datasetId,
          hyperparameters: {
            early_stopping_patience: 10,
            early_stopping_threshold: 0.001,
            train_batch_size: 16,
            train_epochs: 1,
            learning_rate: 0.01,
          },
        },
      };

      const response = await fetch('https://api.cohere.ai/v1/finetuning/finetuned-models', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Model creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to create model: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Model created successfully:', data);
      return { data };
    } catch (error) {
      console.error('Error creating model:', error);
      return {
        data: null as unknown as Model,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async deleteDataset(datasetId: string): Promise<CohereResponse<boolean>> {
    try {
      console.log('Deleting dataset:', datasetId);
      
      const response = await fetch(`https://api.cohere.ai/v1/datasets/${datasetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dataset deletion failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to delete dataset: ${response.statusText}`);
      }

      console.log('Dataset deleted successfully');
      return { data: true };
    } catch (error) {
      console.error('Error deleting dataset:', error);
      return {
        data: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async listModels(): Promise<CohereResponse<Model[]>> {
    try {
      console.log('Fetching models...');
      
      const response = await fetch('https://api.cohere.ai/v1/finetuning/finetuned-models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('List models failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to list models: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Models fetched successfully:', data);
      return { data: data.finetuned_models || [] };
    } catch (error) {
      console.error('Error listing models:', error);
      return {
        data: [],
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async getModel(modelId: string): Promise<CohereResponse<Model>> {
    try {
      const response = await fetch(`https://api.cohere.ai/v1/finetuning/finetuned-models/${modelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY || process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get model failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to get model: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error getting model:', error);
      return {
        data: null as unknown as Model,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async testModel(modelId: string, prompt: string): Promise<CohereResponse<string>> {
    try {
      const response = await this.client.chat({
        model: modelId,
        message: prompt,
      });

      return { data: response.text };
    } catch (error) {
      console.error('Error testing model:', error);
      return {
        data: '',
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  // For demo purposes - simulate successful upload
  async createDatasetDemo(name: string, file: File): Promise<CohereResponse<Dataset>> {
    try {
      console.log('Demo dataset upload:', { name, size: file.size, type: file.type });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDataset: Dataset = {
        id: `demo-dataset-${Date.now()}`,
        name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'fine-tune-input',
        validation_status: 'passed',
        examples_count: 100, // Mock count
      };
      
      // Store in localStorage for demo
      const existingDatasets = JSON.parse(localStorage.getItem('demo_datasets') || '[]');
      existingDatasets.push(mockDataset);
      localStorage.setItem('demo_datasets', JSON.stringify(existingDatasets));
      
      console.log('Demo dataset created:', mockDataset);
      return { data: mockDataset };
    } catch (error) {
      console.error('Error in demo dataset creation:', error);
      return {
        data: null as unknown as Dataset,
        error: {
          message: 'Demo upload failed',
          status: 500,
        },
      };
    }
  }

  async listDatasetsDemo(): Promise<CohereResponse<Dataset[]>> {
    try {
      const datasets = JSON.parse(localStorage.getItem('demo_datasets') || '[]');
      return { data: datasets };
    } catch (error) {
      return { data: [] };
    }
  }
}

export const cohereService = new CohereService(); 