'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cohereService } from '@/services/cohere';
import { Dataset } from '@/types/cohere';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onSuccess?: () => void;
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.jsonl'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB limit
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File size must be less than 10MB');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload CSV, JSON, or JSONL files.');
        } else {
          setError('File rejected. Please check the file format and size.');
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        
        // Additional validation
        if (selectedFile.size === 0) {
          setError('File is empty. Please select a file with content.');
          return;
        }
        
        if (selectedFile.size < 10) { // Less than 10 bytes is likely empty/corrupted
          setError('File appears to be empty or corrupted. Please select a valid file.');
          return;
        }
        
        console.log('File selected:', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        
        setFile(selectedFile);
        setError(null);
        setSuccess(null);
      }
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Starting upload process for file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create a descriptive dataset name
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const baseName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const datasetName = `${baseName}-${timestamp}`;

      console.log('Using dataset name:', datasetName);

      // Use real Cohere API for production fine-tuning
      const response = await cohereService.createDataset(datasetName, file);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      const successMessage = `Dataset "${datasetName}" uploaded successfully!`;
      setSuccess(successMessage);
      toast.success(successMessage);
      setFile(null);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload dataset';
      console.error('Upload error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isDragActive 
            ? 'border-orange-500 bg-orange-500/20' 
            : 'border-white/20 hover:border-orange-500'
          }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <motion.div 
            key="file-selected"
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-3 bg-white/10 border border-white/20 rounded-md">
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-gray-300">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="no-file"
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-orange-400 mb-4">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-white font-light">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a file here, or click to select'}
            </p>
            <p className="text-sm text-gray-300 font-light">
              Supported formats: CSV, JSON, JSONL (max 10MB)
            </p>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-200">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div 
          className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-green-200">{success}</p>
        </motion.div>
      )}

      <div className="mt-4 text-sm text-gray-300 font-light">
        <p><strong className="text-white">Data Format Requirements:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong className="text-white">JSONL (Chat):</strong> Each line: {"{"}"messages": [{"{"}"role": "User", "content": "question"{"}"}, {"{"}"role": "Chatbot", "content": "answer"{"}"}]{"}"}</li>
          <li><strong className="text-white">CSV (Classification):</strong> Columns: 'text' and 'label'</li>
          <li><strong className="text-white">Legacy format (prompt/completion):</strong> Will be auto-converted to chat format</li>
        </ul>
      </div>
    </div>
  );
} 