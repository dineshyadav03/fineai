import { CohereClient } from 'cohere-ai';
import { Dataset, Model, FineTuneJob, CohereResponse } from '@/types/cohere';

class CohereService {
  private client: CohereClient;

  constructor() {
    this.client = new CohereClient({
      token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
    });
  }

  async createDataset(name: string, file: File): Promise<CohereResponse<Dataset>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      const response = await fetch('https://api.cohere.ai/v1/datasets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create dataset: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error creating dataset:', error);
      return {
        data: null as unknown as Dataset,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          status: 500,
        },
      };
    }
  }

  async listDatasets(): Promise<CohereResponse<Dataset[]>> {
    try {
      const response = await fetch('https://api.cohere.ai/v1/datasets', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list datasets: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data.datasets };
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
      const response = await fetch('https://api.cohere.ai/v1/models', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset_id: datasetId,
          name,
          base_model: {
            base_type: baseModel,
          },
          hyperparameters: {
            train_steps: 1000,
            learning_rate: 0.0001,
            batch_size: 32,
            early_stopping_patience: 5,
            early_stopping_threshold: 0.01,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create model: ${response.statusText}`);
      }

      const data = await response.json();
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

  async listModels(): Promise<CohereResponse<Model[]>> {
    try {
      const response = await fetch('https://api.cohere.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data.models };
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
      const response = await fetch(`https://api.cohere.ai/v1/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
        },
      });

      if (!response.ok) {
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
}

export const cohereService = new CohereService(); 