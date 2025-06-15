'use client';

import { useEffect, useState } from 'react';
import FileUpload from '@/components/upload/FileUpload';
import { cohereService } from '@/services/cohere';
import { Dataset, Model } from '@/types/cohere';

export default function Dashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState<string>('');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [selectedBaseModel, setSelectedBaseModel] = useState<string>('command');
  const [creatingModel, setCreatingModel] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [datasetsResponse, modelsResponse] = await Promise.all([
        cohereService.listDatasets(),
        cohereService.listModels(),
      ]);

      if (datasetsResponse.error) {
        throw new Error(datasetsResponse.error.message);
      }

      if (modelsResponse.error) {
        throw new Error(modelsResponse.error.message);
      }

      setDatasets(datasetsResponse.data);
      setModels(modelsResponse.data);

      if (datasetsResponse.data.length > 0) {
        setSelectedDatasetId(datasetsResponse.data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async () => {
    if (!newModelName || !selectedDatasetId || !selectedBaseModel) {
      setError('Please fill all model creation fields.');
      return;
    }

    setCreatingModel(true);
    setError(null);

    try {
      const response = await cohereService.createModel(
        selectedDatasetId,
        newModelName,
        selectedBaseModel
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      setNewModelName('');
      await loadData(); // Refresh datasets and models after creating a new model
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create model');
    } finally {
      setCreatingModel(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fine-tune Your Models</h1>
          <p className="mt-2 text-gray-600">
            Upload your dataset and create custom fine-tuned models
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Dataset</h2>
          <FileUpload />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Model</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
                Model Name
              </label>
              <input
                type="text"
                id="modelName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="My Custom Model"
              />
            </div>
            <div>
              <label htmlFor="datasetSelect" className="block text-sm font-medium text-gray-700">
                Select Dataset
              </label>
              <select
                id="datasetSelect"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                disabled={datasets.length === 0}
              >
                {datasets.length === 0 ? (
                  <option value="">No datasets available</option>
                ) : (
                  datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label htmlFor="baseModelSelect" className="block text-sm font-medium text-gray-700">
                Select Base Model
              </label>
              <select
                id="baseModelSelect"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedBaseModel}
                onChange={(e) => setSelectedBaseModel(e.target.value)}
              >
                <option value="command">Command</option>
                <option value="command-light">Command Light</option>
                <option value="command-r-plus">Command R+</option>
              </select>
            </div>
            <button
              onClick={handleCreateModel}
              disabled={creatingModel || datasets.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {creatingModel ? 'Creating Model...' : 'Create Model'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Datasets</h2>
            {datasets.length === 0 ? (
              <p className="text-gray-500">No datasets uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(dataset.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Examples: {dataset.examples_count}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Models</h2>
            {models.length === 0 ? (
              <p className="text-gray-500">No models created yet</p>
            ) : (
              <div className="space-y-4">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-500">
                      Status: {model.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(model.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 