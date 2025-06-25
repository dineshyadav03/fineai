'use client';

import { useState } from 'react';
import { cohereService } from '@/services/cohere';
import { Model } from '@/types/cohere';
import toast from 'react-hot-toast';

interface ModelTesterProps {
  model: Model;
}

export default function ModelTester({ model }: ModelTesterProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to test the model');
      return;
    }

    setTesting(true);
    setResponse('');

    try {
      const result = await cohereService.testModel(model.id, prompt);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      setResponse(result.data);
      toast.success('Model tested successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to test model');
    } finally {
      setTesting(false);
    }
  };

  if (model.status !== 'completed') {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">
          Model must be completed before testing. Current status: {model.status}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-trainy-text-primary mb-4">
        Test Model: {model.name}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="form-label">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            className="form-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to test your fine-tuned model..."
          />
        </div>

        <button
          onClick={handleTest}
          disabled={testing || !prompt.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Model'}
        </button>

        {response && (
          <div>
            <label className="form-label">Model Response:</label>
            <div className="p-4 bg-gray-50 border border-trainy-border rounded-md">
              <p className="text-trainy-text-primary whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 