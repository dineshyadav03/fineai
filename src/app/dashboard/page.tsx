'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Lazy load the FileUpload component to reduce initial bundle size
const FileUpload = dynamic(() => import('@/components/upload/FileUpload'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">Loading upload...</div>
});

// Lazy load the AccessMethodSettings component
const AccessMethodSettings = dynamic(() => import('@/components/dashboard/AccessMethodSettings'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500">Loading settings...</div>
});

interface FinetuneJob {
  id: string;
  name: string;
  status: 'completed' | 'STATUS_READY' | 'training' | 'failed' | 'pending';
  created_at: string;
  dataset_name?: string;
}

interface UploadedDataset {
  id: string;
  name: string;
  uploaded_at: string;
  file_size: number;
  format: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<FinetuneJob[]>([]);
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<UploadedDataset | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [accessSettings, setAccessSettings] = useState({
    method: 'proxy' as 'proxy' | 'byok',
    cohereApiKey: undefined as string | undefined,
    webhookUrl: undefined as string | undefined,
    usageLimit: 1000
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Model training configuration
  const [modelConfig, setModelConfig] = useState({
    modelName: '',
    baseModel: 'command',
    category: 'general',
    description: ''
  });

  const modelCategories = [
    { value: 'general', label: 'General Purpose', description: 'Versatile model for various tasks' },
    { value: 'business', label: 'Business', description: 'Optimized for business communications' },
    { value: 'content', label: 'Content Creator', description: 'Perfect for marketing and content' },
    { value: 'support', label: 'Customer Support', description: 'Specialized for customer service' },
    { value: 'code', label: 'Code Assistant', description: 'Focused on programming tasks' }
  ];

  const baseModels = [
    { value: 'command', label: 'Command', description: 'Best overall performance' },
    { value: 'command-light', label: 'Command Light', description: 'Faster and more cost-effective' }
  ];

  useEffect(() => {
    if (mounted) {
      checkUser();
    }
  }, [mounted]);

  // Auto-refresh models every 30 seconds to sync with Cohere status
  useEffect(() => {
    if (!user || user.isGuest) return;

    // Check if there are any models in training status
    const hasTrainingModels = jobs.some(job => 
      job.status === 'training' || job.status === 'pending'
    );

    if (!hasTrainingModels) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing model status...');
      fetchJobs();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user, jobs]); // Depend on jobs to re-evaluate when status changes

  const checkUser = async () => {
    try {
      // Check for guest user first to prioritize guest mode (only on client-side)
      if (typeof window !== 'undefined') {
        const guestUser = localStorage.getItem('guest_user');
        if (guestUser) {
          const parsedGuestUser = JSON.parse(guestUser);
          if (parsedGuestUser.isGuest) {
            setUser(parsedGuestUser);
            setLoading(false);
            loadGuestData();
            return;
          }
        }
      }

      // Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Clear any guest user data when real user is authenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guest_user');
        }
        setUser(user);
        // Load user's data
        fetchJobs();
        loadUploadedDatasets();
        setLoading(false);
        return;
      }

      // No user found, redirect to landing page
      router.push('/');
      return;
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const loadGuestData = () => {
    // Guest data for exploration
    const guestJobs: FinetuneJob[] = [
      {
        id: 'guest-1',
        name: 'Customer Support Assistant',
        status: 'STATUS_READY',
        created_at: '2024-01-15T10:30:00Z',
        dataset_name: 'support_conversations.jsonl'
      },
      {
        id: 'guest-2', 
        name: 'Content Generator',
        status: 'completed',
        created_at: '2024-01-14T15:45:00Z',
        dataset_name: 'content_examples.jsonl'
      }
    ];
    setJobs(guestJobs);

    // Show some uploaded datasets for demonstration
    const guestDatasets: UploadedDataset[] = [
      {
        id: 'demo-dataset-1',
        name: 'example-cohere-chat-dataset-2025-06-24T10-20-11',
        uploaded_at: new Date().toISOString(),
        file_size: 2048,
        format: 'JSONL'
      }
    ];
    setUploadedDatasets(guestDatasets);
  };

  const loadUploadedDatasets = async () => {
    try {
      // Fetch real datasets from Cohere API
      const response = await fetch('/api/datasets');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.datasets) {
          // Convert Cohere datasets to UploadedDataset format
          // Only include validated datasets for training
          const cohereDatasets: UploadedDataset[] = data.datasets
            .filter((dataset: any) => dataset.validation_status === 'validated')
            .map((dataset: any) => ({
              id: dataset.id,
              name: dataset.name,
              uploaded_at: dataset.created_at || dataset.createdAt || new Date().toISOString(),
              file_size: dataset.size_bytes || 0,
              format: 'JSONL'
            }));
          setUploadedDatasets(cohereDatasets);
          
          // Show info about filtered datasets
          const totalDatasets = data.datasets.length;
          const validatedCount = cohereDatasets.length;
          const failedCount = data.datasets.filter((d: any) => d.validation_status === 'failed').length;
          
          if (failedCount > 0) {
            console.log(`Filtered out ${failedCount} failed datasets. Showing ${validatedCount}/${totalDatasets} validated datasets.`);
          }
        }
      } else {
        console.log('Failed to fetch datasets, using empty list');
        setUploadedDatasets([]);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setUploadedDatasets([]);
    }
  };

  const fetchJobs = async () => {
    try {
      // Fetch real models from Cohere API
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.models) {
          // Convert Cohere models to FinetuneJob format
          const cohereModels: FinetuneJob[] = data.models.map((model: any) => ({
            id: model.id,
            name: model.name,
            status: model.status === 'STATUS_READY' ? 'completed' : 
                   model.status === 'STATUS_QUEUED' ? 'training' :
                   model.status === 'STATUS_TRAINING' ? 'training' :
                   model.status === 'STATUS_FAILED' ? 'failed' : 'pending',
            created_at: model.created_at || new Date().toISOString(),
            dataset_name: model.settings?.dataset_id || 'Unknown Dataset'
          }));
          setJobs(cohereModels);
        }
      } else {
        console.log('Failed to fetch models from API');
        // Keep existing jobs if API fails
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Keep existing jobs if there's an error
    }
  };

  const handleDatasetUploaded = async () => {
    // Refresh the uploaded datasets list to get real Cohere datasets
    await loadUploadedDatasets();
    
    // Show success message
    toast.success('Dataset uploaded successfully! You can now train a model with it.');
  };

  const handleStartTraining = async () => {
    if (!selectedDataset || !modelConfig.modelName) {
      toast.error('Please provide a model name');
      return;
    }

    setIsTraining(true);

    try {
      console.log('Current user:', user);
      console.log('Is guest?', user?.isGuest);
      console.log('Selected dataset ID:', selectedDataset.id);
      
      // Check if user is in guest mode OR using a locally created dataset
      // Real Cohere dataset IDs don't start with 'dataset-' or 'demo-dataset-'
      const isLocalDataset = selectedDataset.id.startsWith('dataset-') || selectedDataset.id.startsWith('demo-dataset-');
      const isDemoMode = user?.isGuest || isLocalDataset;
      
      if (isDemoMode) {
        // Demo mode - simulate training (for guests OR local datasets)
        const message = user?.isGuest 
          ? 'Demo: Fine-tuning job started! In a real scenario, this would use your Cohere API key.'
          : 'Demo: Using local dataset. For real training, upload a dataset through Cohere API.';
        
        toast.success(message);
        
        // Add the new job to the list
        const newJob: FinetuneJob = {
          id: `demo-job-${Date.now()}`,
          name: modelConfig.modelName,
          status: 'training',
          created_at: new Date().toISOString(),
          dataset_name: selectedDataset.name
        };
        setJobs(prev => [newJob, ...prev]);
        
        // Simulate training completion after a few seconds
        setTimeout(() => {
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, status: 'completed' as const }
              : job
          ));
          toast.success(`Demo: Model "${modelConfig.modelName}" training completed!`);
        }, 3000);
        
        // Close modal and reset form
        setShowTrainingModal(false);
        setSelectedDataset(null);
        setModelConfig({
          modelName: '',
          baseModel: 'command',
          category: 'general',
          description: ''
        });
        return;
      }

      // Real authenticated user with real Cohere dataset - call actual API
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetId: selectedDataset.id, // Fixed field name
          modelName: modelConfig.modelName, // Fixed field name
          baseModel: modelConfig.baseModel, // Fixed field name
          category: modelConfig.category,
          description: modelConfig.description
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Fine-tuning job started successfully!');
        
        // Close modal and reset form first
        setShowTrainingModal(false);
        setSelectedDataset(null);
        setModelConfig({
          modelName: '',
          baseModel: 'command',
          category: 'general',
          description: ''
        });
        
        // Refresh jobs list to get the latest status including the new job
        await fetchJobs();
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        
        // Provide more specific error messages
        if (response.status === 401) {
          toast.error('Authentication failed. Please sign in again.');
          setShowAuthPrompt(true);
        } else if (response.status === 400) {
          toast.error(`Invalid request: ${error.error || 'Please check your input'}`);
        } else {
          toast.error(error.error || 'Failed to start training');
        }
      }
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Failed to create model: ' + (error as Error).message);
    } finally {
      setIsTraining(false);
    }
  };

  const handleDownload = (modelId: string) => {
    if (!user || user?.isGuest) {
      setShowAuthPrompt(true);
      return;
    }
    // Actual download functionality would be implemented here
    toast.success('Model download started! Check your downloads folder.');
  };

  const handleCopyId = (modelId: string) => {
    if (!user || user?.isGuest) {
      setShowAuthPrompt(true);
      return;
    }
    navigator.clipboard.writeText(modelId);
    toast.success('Model ID copied to clipboard!');
  };

  const handleTestModel = (modelId: string) => {
    if (!user || user?.isGuest) {
      setShowAuthPrompt(true);
      return;
    }
    setSelectedModel(modelId);
    setShowTester(true);
  };

  const handleUploadAttempt = () => {
    if (!user || user?.isGuest) {
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  };

  const handleDeleteDataset = async (datasetId: string, datasetName: string) => {
    if (!user || user?.isGuest) {
      setShowAuthPrompt(true);
      return;
    }

    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete dataset "${datasetName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/datasets?id=${datasetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`Dataset "${datasetName}" deleted successfully!`);
        // Refresh datasets list
        await loadUploadedDatasets();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete dataset');
      }
    } catch (error) {
      console.error('Delete dataset error:', error);
      toast.error('Failed to delete dataset. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'STATUS_READY':
        return 'text-green-300 bg-green-500/20 border border-green-500/30';
      case 'training':
        return 'text-accent-300 bg-accent-500/15 border border-accent-500/20';
      case 'failed':
        return 'text-red-300 bg-red-500/20 border border-red-500/30';
      default:
        return 'text-gray-300 bg-gray-500/20 border border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'STATUS_READY':
        return '✅';
      case 'training':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '⏸️';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-x-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Central Orb */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-accent-500/15 via-accent-600/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
                          animate={{
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
          />
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 min-h-full">
        {/* Header Section */}
        <div className="pt-40 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-extralight text-white mb-4">
                Your AI Workshop
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Build, train, and deploy custom AI models with your data. Welcome back, {user?.email?.split('@')[0]}!
              </p>
              
              {user?.isGuest && (
                <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm text-amber-200 font-medium">
                    👤 Guest Mode - Create an account to save your work
                  </span>
                </div>
              )}
              
              {user && !user?.isGuest && (
                <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-200 font-medium">
                    ✅ Authenticated - Your work is automatically saved
                  </span>
                </div>
              )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid md:grid-cols-4 gap-6 mb-12"
            >
              {[
                { label: 'Datasets', value: uploadedDatasets.length, icon: '📁' },
                { label: 'Total Models', value: jobs.length, icon: '🤖' },
                { label: 'Ready Models', value: jobs.filter(j => j.status === 'completed' || j.status === 'STATUS_READY').length, icon: '✅' },
                { label: 'Training', value: jobs.filter(j => j.status === 'training').length, icon: '⏳' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 25px 50px rgba(255,107,0,0.2)"
                  }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-accent-500/15 shadow-2xl hover:shadow-accent-500/15 transition-all duration-200 hover:border-accent-500/25 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.p 
                        className="text-gray-300 text-sm font-medium"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {stat.label}
                      </motion.p>
                      <motion.p 
                        className="text-3xl font-light text-white mt-1"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div 
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                    >
                      {stat.icon}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10">
                      <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-accent-500/15">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'settings', label: 'Model Access', icon: '⚙️' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
          {activeTab === 'overview' ? (
            <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-accent-500/15 shadow-2xl">
                <h2 className="text-2xl font-medium text-white mb-6">Upload Dataset</h2>
                {user?.isGuest ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👤</div>
                    <h3 className="text-lg font-medium text-white mb-2">Guest Mode</h3>
                    <p className="text-gray-300 mb-4 font-light">Create an account to upload your own datasets and train custom models.</p>
                    <button
                      onClick={() => setShowAuthPrompt(true)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                ) : user && user.email ? (
                  <FileUpload onSuccess={handleDatasetUploaded} />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-medium text-white mb-2">Sign In Required</h3>
                    <p className="text-gray-300 mb-4 font-light">Please sign in to upload datasets and train models.</p>
                    <button
                      onClick={() => setShowAuthPrompt(true)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Uploaded Datasets */}
                {uploadedDatasets.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-4">Ready to Train</h3>
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-200 font-light">
                        <strong>✅ Validated Datasets</strong> - Only showing datasets that passed Cohere's validation.
                        Failed datasets are automatically filtered out.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {uploadedDatasets.map((dataset) => (
                        <div key={dataset.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-white text-sm">{dataset.name}</p>
                              <p className="text-xs text-gray-300 font-light">
                                {dataset.format} • {(dataset.file_size / 1024).toFixed(1)} KB • ✅ Validated
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedDataset(dataset);
                                  setShowTrainingModal(true);
                                }}
                                className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
                              >
                                Train Model
                              </button>
                              <button
                                onClick={() => handleDeleteDataset(dataset.id, dataset.name)}
                                className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded text-sm font-medium hover:bg-red-500/30 transition-colors"
                                title="Delete dataset"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Models List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-accent-500/15 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium text-white">Your Models</h2>
                  {!user?.isGuest && (
                    <button
                      onClick={() => fetchJobs()}
                      className="flex items-center space-x-2 px-3 py-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors duration-200"
                      title="Refresh model status"
                    >
                      <span className="text-sm">🔄</span>
                      <span className="text-sm font-medium">Refresh</span>
                    </button>
                  )}
                </div>
                
                {/* Auto-refresh indicator */}
                {!user?.isGuest && jobs.some(job => job.status === 'training' || job.status === 'pending') && (
                  <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                    <p className="text-sm text-amber-200 font-light">
                      🔄 Auto-refreshing every 30 seconds to sync with Cohere status...
                    </p>
                  </div>
                )}

                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-lg font-medium text-white mb-2">No models yet</h3>
                    <p className="text-gray-300 font-light">Upload your first dataset to start training a model!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -3,
                          boxShadow: "0 20px 40px rgba(255,107,0,0.15)"
                        }}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <motion.h3 
                                className="font-medium text-white"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              >
                                {job.name}
                              </motion.h3>
                              <motion.span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                                animate={{ 
                                  scale: job.status === 'training' ? [1, 1.1, 1] : 1,
                                  opacity: job.status === 'training' ? [0.7, 1, 0.7] : 1
                                }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: job.status === 'training' ? Infinity : 0, 
                                  ease: "easeInOut" 
                                }}
                              >
                                {getStatusIcon(job.status)} {job.status}
                              </motion.span>
                            </div>
                            <motion.p 
                              className="text-sm text-gray-300 mb-1 font-light"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Dataset: {job.dataset_name}
                            </motion.p>
                            <motion.p 
                              className="text-xs text-gray-400 font-light"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              Created: {new Date(job.created_at).toLocaleDateString()}
                            </motion.p>
                          </div>

                          {/* Action Buttons for Ready Models */}
                          {(job.status === 'completed' || job.status === 'STATUS_READY') && (
                            <motion.div 
                              className="flex space-x-2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <motion.button
                                onClick={() => handleTestModel(job.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Test Model
                              </motion.button>
                              <motion.button
                                onClick={() => handleCopyId(job.id)}
                                className="bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Copy ID
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          ) : (
            // Settings Tab Content
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-light text-white mb-4">Model Access Settings</h2>
                  <p className="text-gray-300 font-light">
                    Configure how you want to access your fine-tuned models. Choose between our managed API gateway 
                    or bring your own Cohere API key for direct access.
                  </p>
                </div>

                <AccessMethodSettings
                  onSettingsChange={(settings) => {
                    setAccessSettings({
                      method: settings.method,
                      cohereApiKey: settings.cohereApiKey,
                      webhookUrl: settings.webhookUrl,
                      usageLimit: settings.usageLimit || 1000
                    });
                  }}
                  currentSettings={accessSettings}
                />

                {/* Quick Access to Model Access Info */}
                <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="text-white font-medium mb-2">Need More Information?</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Learn about the differences between API Gateway and BYOK approaches, 
                        including pricing, setup complexity, and use cases.
                      </p>
                      <Link 
                        href="/model-access"
                        className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <span>📖</span>
                        <span>Learn About Model Access</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Model Training Modal */}
        <AnimatePresence>
          {showTrainingModal && selectedDataset && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-medium text-white">
                      Create Fine-tuned Model
                    </h3>
                    <button
                      onClick={() => {
                        setShowTrainingModal(false);
                        setSelectedDataset(null);
                        setModelConfig({
                          modelName: '',
                          baseModel: 'command',
                          category: 'general',
                          description: ''
                        });
                      }}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Dataset Info */}
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                      <h4 className="font-medium text-orange-200 mb-2">📁 Selected Dataset</h4>
                      <p className="text-sm text-orange-100">
                        <strong>{selectedDataset.name}</strong>
                      </p>
                      <p className="text-xs text-orange-200 mt-1">
                        {selectedDataset.format} • {(selectedDataset.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Model Configuration */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Model Name *
                        </label>
                        <input
                          type="text"
                          value={modelConfig.modelName}
                          onChange={(e) => setModelConfig(prev => ({ ...prev, modelName: e.target.value }))}
                          placeholder="e.g. Customer Support Assistant"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Base Model
                        </label>
                        <select
                          value={modelConfig.baseModel}
                          onChange={(e) => setModelConfig(prev => ({ ...prev, baseModel: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {baseModels.map((model) => (
                            <option key={model.value} value={model.value} className="bg-gray-800 text-white">
                              {model.label} - {model.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={modelConfig.category}
                          onChange={(e) => setModelConfig(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {modelCategories.map((category) => (
                            <option key={category.value} value={category.value} className="bg-gray-800 text-white">
                              {category.label} - {category.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={modelConfig.description}
                          onChange={(e) => setModelConfig(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this model will be used for..."
                          rows={3}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Training Info */}
                    {(() => {
                      const isLocalDataset = selectedDataset?.id.startsWith('dataset-') || selectedDataset?.id.startsWith('demo-dataset-');
                      const isDemoMode = user?.isGuest || isLocalDataset;
                      
                      if (isDemoMode) {
                        if (user?.isGuest) {
                          return (
                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                              <h4 className="font-medium text-blue-200 mb-2">🎭 Demo Mode</h4>
                              <p className="text-sm text-blue-100">
                                You're in guest mode. This will simulate the training process to show you how it works. 
                                For real training with the Cohere API, please create an account.
                              </p>
                            </div>
                          );
                        } else {
                          return (
                            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                              <h4 className="font-medium text-purple-200 mb-2">🎯 Demo Dataset</h4>
                              <p className="text-sm text-purple-100">
                                You're using a local demo dataset. This will simulate training. 
                                To use real training, upload datasets through the Cohere API.
                              </p>
                            </div>
                          );
                        }
                      } else {
                        return (
                          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                            <h4 className="font-medium text-amber-200 mb-2">💰 Training Cost</h4>
                            <p className="text-sm text-amber-100">
                              Fine-tuning typically costs $1-5 per model depending on the dataset size and base model.
                              You'll need your own Cohere API key with sufficient credits.
                            </p>
                          </div>
                        );
                      }
                    })()}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setShowTrainingModal(false);
                          setSelectedDataset(null);
                          setModelConfig({
                            modelName: '',
                            baseModel: 'command',
                            category: 'general',
                            description: ''
                          });
                        }}
                        className="px-6 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleStartTraining}
                        disabled={!modelConfig.modelName || isTraining}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTraining ? 'Starting Training...' : 'Start Training'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Model Tester Modal */}
        <AnimatePresence>
          {showTester && selectedModel && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium text-white">
                      Test Model: {selectedModel}
                    </h3>
                    <button
                      onClick={() => {
                        setShowTester(false);
                        setSelectedModel(null);
                      }}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-sm text-orange-100">
                        <strong>Model ID:</strong> <code className="bg-orange-500/30 px-2 py-1 rounded text-orange-200">{selectedModel}</code>
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-white/20 bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">🔗 cURL Example</h4>
                        <pre className="bg-black/30 p-3 rounded text-xs overflow-x-auto text-gray-300">
{`curl -X POST \\
  https://api.cohere.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel}",
    "message": "Hello!"
  }'`}
                        </pre>
                      </div>

                      <div className="border border-white/20 bg-white/10 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">🐍 Python Example</h4>
                        <pre className="bg-black/30 p-3 rounded text-xs overflow-x-auto text-gray-300">
{`import cohere

co = cohere.Client("YOUR_API_KEY")
response = co.chat(
    model="${selectedModel}",
    message="Hello!"
)
print(response.text)`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-medium text-green-200 mb-2">✅ Model Ready</h4>
                      <p className="text-sm text-green-100">
                        Your fine-tuned model is ready to use! Replace "YOUR_API_KEY" with your actual Cohere API key.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Auth Prompt Modal */}
        <AnimatePresence>
          {showAuthPrompt && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-white mb-4">
                    Authentication Required
                  </h3>
                  <p className="text-gray-300 mb-6 font-light">
                    Create an account or sign in to access this feature and save your work.
                  </p>
                  
                  <div className="space-y-4">
                    <Link
                      href="/auth"
                      className="w-full bg-orange-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-200 block"
                      onClick={() => setShowAuthPrompt(false)}
                    >
                      Sign Up / Sign In
                    </Link>
                    
                    <button
                      onClick={() => setShowAuthPrompt(false)}
                      className="w-full border-2 border-white/20 text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 