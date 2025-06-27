'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AccessMethodSettings {
  method: 'proxy' | 'byok';
  cohereApiKey?: string;
  webhookUrl?: string;
  usageLimit?: number;
}

interface AccessMethodSettingsProps {
  onSettingsChange: (settings: AccessMethodSettings) => void;
  currentSettings?: AccessMethodSettings;
}

export default function AccessMethodSettings({ onSettingsChange, currentSettings }: AccessMethodSettingsProps) {
  const [settings, setSettings] = useState<AccessMethodSettings>({
    method: 'proxy',
    usageLimit: 1000,
    ...currentSettings
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'none' | 'valid' | 'invalid'>('none');

  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const handleMethodChange = (method: 'proxy' | 'byok') => {
    setSettings(prev => ({ ...prev, method }));
    setValidationStatus('none');
  };

  const handleApiKeyChange = (cohereApiKey: string) => {
    setSettings(prev => ({ ...prev, cohereApiKey }));
    setValidationStatus('none');
  };

  const validateApiKey = async () => {
    if (!settings.cohereApiKey) return;
    
    setIsValidating(true);
    try {
      // Basic validation - check if it looks like a Cohere API key
      if (settings.cohereApiKey.startsWith('co-') && settings.cohereApiKey.length > 20) {
        // In a real app, you'd make a test API call to Cohere
        await new Promise(resolve => setTimeout(resolve, 1000));
        setValidationStatus('valid');
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-6">Model Access Settings</h3>
      
      {/* Method Selection */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg text-gray-300 mb-3">Choose Access Method</h4>
        
        {/* API Gateway Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            settings.method === 'proxy'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }`}
          onClick={() => handleMethodChange('proxy')}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
              settings.method === 'proxy' ? 'border-blue-500' : 'border-gray-500'
            }`}>
              {settings.method === 'proxy' && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <span className="text-white font-medium">API Gateway</span>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Simple and secure. Access your models through our managed API gateway.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">No API keys needed</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Built-in analytics</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Automatic scaling</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BYOK Option */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            settings.method === 'byok'
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }`}
          onClick={() => handleMethodChange('byok')}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
              settings.method === 'byok' ? 'border-orange-500' : 'border-gray-500'
            }`}>
              {settings.method === 'byok' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🔑</span>
                <span className="text-white font-medium">Bring Your Own Key (BYOK)</span>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Advanced</span>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Use your own Cohere API credentials for direct access and full control.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Direct access</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Lower latency</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Your costs</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BYOK Configuration */}
      {settings.method === 'byok' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 border-t border-gray-700 pt-6"
        >
          <h4 className="text-lg text-gray-300 mb-3">BYOK Configuration</h4>
          
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cohere API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.cohereApiKey || ''}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="co-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
            {settings.cohereApiKey && (
              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={validateApiKey}
                  disabled={isValidating}
                  className="text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-colors duration-200"
                >
                  {isValidating ? '🔄 Validating...' : '✓ Validate Key'}
                </button>
                {validationStatus === 'valid' && (
                  <span className="text-green-400 text-sm">✅ Valid API key</span>
                )}
                {validationStatus === 'invalid' && (
                  <span className="text-red-400 text-sm">❌ Invalid API key</span>
                )}
              </div>
            )}
          </div>

          {/* Webhook URL (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Webhook URL (Optional)
            </label>
            <input
              type="url"
              value={settings.webhookUrl || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://your-app.com/webhooks/cohere"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Get notified when fine-tuning jobs complete
            </p>
          </div>
        </motion.div>
      )}

      {/* API Gateway Configuration */}
      {settings.method === 'proxy' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 border-t border-gray-700 pt-6"
        >
          <h4 className="text-lg text-gray-300 mb-3">API Gateway Settings</h4>
          
          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monthly Usage Limit (API calls)
            </label>
            <select
              value={settings.usageLimit}
              onChange={(e) => setSettings(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1000}>1,000 calls - Free ($0/month)</option>
              <option value={10000}>10,000 calls - Starter ($29/month)</option>
              <option value={100000}>100,000 calls - Pro ($149/month)</option>
              <option value={-1}>Unlimited - Enterprise (Contact sales)</option>
            </select>
          </div>

          {/* Current Usage */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Current Usage</span>
              <span className="text-sm text-white">247 / {settings.usageLimit === -1 ? '∞' : settings.usageLimit?.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: settings.usageLimit === -1 ? '0%' : `${Math.min((247 / (settings.usageLimit || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Information Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-400 text-xl">💡</span>
          <div>
            <h5 className="text-blue-400 font-medium mb-1">Need Help Choosing?</h5>
            <p className="text-gray-300 text-sm">
              {settings.method === 'proxy' 
                ? "API Gateway is perfect for getting started quickly. No technical setup required, and you can focus on building your application."
                : "BYOK gives you full control and can be more cost-effective for high-volume usage. Requires a Cohere account and API key management."
              }
            </p>
            <a 
              href="/model-access" 
              className="text-blue-400 hover:text-blue-300 text-sm underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about access methods →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 