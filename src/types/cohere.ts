export interface BaseType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Dataset extends BaseType {
  type: string;
  validation_status: string;
  validation_error?: string;
  examples_count: number;
}

export interface Model extends BaseType {
  status: string;
  model_type: string;
  dataset_id: string;
  base_model: string;
  hyperparameters: {
    train_steps: number;
    learning_rate: number;
    batch_size: number;
    early_stopping_patience: number;
    early_stopping_threshold: number;
  };
  metrics?: {
    loss: number;
    accuracy: number;
  };
}

export interface FineTuneJob extends BaseType {
  status: string;
  model_id: string;
  dataset_id: string;
  base_model: string;
  hyperparameters: {
    train_steps: number;
    learning_rate: number;
    batch_size: number;
    early_stopping_patience: number;
    early_stopping_threshold: number;
  };
  metrics?: {
    loss: number;
    accuracy: number;
  };
}

export interface CohereError {
  message: string;
  status: number;
}

export interface CohereResponse<T> {
  data: T;
  error?: CohereError;
}