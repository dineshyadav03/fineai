'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cohereService } from '@/services/cohere';
import { Dataset } from '@/types/cohere';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
      setSuccess(null);
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await cohereService.createDataset(file.name, file);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setSuccess('Dataset uploaded successfully!');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload dataset');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="space-y-4">
            <p className="text-gray-600">Selected file: {file.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a CSV or JSON file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: CSV, JSON
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}
    </div>
  );
} 