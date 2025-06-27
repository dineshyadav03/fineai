'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const accessMethods = [
  {
    id: 'proxy',
    title: 'API Gateway (Recommended)',
    subtitle: 'Simple & Secure',
    icon: '🛡️',
    description: 'Access your models through our secure API gateway. No need to manage API keys or infrastructure.',
    pros: [
      'No API key management required',
      'Built-in usage analytics',
      'Rate limiting & security',
      'Simple integration',
      'Automatic scaling'
    ],
    cons: [
      'Pay-per-use pricing',
      'Dependent on our infrastructure',
      'Slight latency overhead'
    ],
    pricing: 'Pay per API call',
    bestFor: 'Production apps, non-technical users, MVPs',
    gradient: 'from-blue-500 to-purple-600',
    howItWorks: [
      'Your model is hosted on our infrastructure',
      'Make API calls to your-app.com/api/chat',
      'We handle authentication and routing',
      'Responses come back through our gateway'
    ]
  },
  {
    id: 'byok',
    title: 'Bring Your Own Key (BYOK)',
    subtitle: 'Full Control',
    icon: '🔑',
    description: 'Use your own Cohere API credentials. You own and control everything directly.',
    pros: [
      'You own the API costs',
      'Direct access to Cohere',
      'No middleman latency',
      'Full control over usage',
      'Lower long-term costs'
    ],
    cons: [
      'Requires Cohere account',
      'You manage API keys',
      'More complex setup',
      'You handle rate limits'
    ],
    pricing: 'Cohere pricing + platform fee',
    bestFor: 'Developers, high-volume usage, enterprises',
    gradient: 'from-orange-500 to-red-600',
    howItWorks: [
      'Provide your Cohere API key',
      'We fine-tune using your credentials',
      'You get the direct model ID',
      'Make calls directly to Cohere API'
    ]
  }
];

const comparisonFeatures = [
  { feature: 'Setup Complexity', proxy: 'Simple', byok: 'Moderate' },
  { feature: 'API Key Management', proxy: 'None required', byok: 'You manage' },
  { feature: 'Latency', proxy: 'Slight overhead', byok: 'Direct' },
  { feature: 'Cost Structure', proxy: 'Pay-per-call', byok: 'Cohere rates' },
  { feature: 'Usage Analytics', proxy: 'Built-in', byok: 'Basic' },
  { feature: 'Rate Limiting', proxy: 'Managed for you', byok: 'You handle' },
  { feature: 'Best for Scale', proxy: 'Low-Medium', byok: 'High volume' }
];

export default function ModelAccess() {
  const [selectedMethod, setSelectedMethod] = useState('proxy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-radial from-blue-500/20 via-purple-600/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-orange-500/20 via-red-600/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extralight text-white mb-6">
              How to Access
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Your Models</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 font-light">
              Choose the model access method that best fits your needs. We support both managed API gateway 
              and bring-your-own-key approaches for maximum flexibility.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Access Methods */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {accessMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`group cursor-pointer ${selectedMethod === method.id ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-500/20 shadow-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {method.icon}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-medium text-white">
                      {method.title}
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                      {method.subtitle}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {method.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">✅ Pros</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {method.pros.map((pro, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-orange-400 font-medium mb-2">⚠️ Considerations</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {method.cons.map((con, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Pricing:</span>
                        <span className="text-blue-400 font-medium">{method.pricing}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-400">Best for:</span>
                        <span className="text-purple-400 font-medium">{method.bestFor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-500/20 mb-16"
          >
            <h3 className="text-2xl font-medium text-white mb-6 text-center">
              How {accessMethods.find(m => m.id === selectedMethod)?.title} Works
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {accessMethods.find(m => m.id === selectedMethod)?.howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-4 mx-auto">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 text-sm">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-500/20 mb-16"
          >
            <h3 className="text-2xl font-medium text-white mb-6 text-center">
              Side-by-Side Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-300 py-3 px-4">Feature</th>
                    <th className="text-center text-blue-400 py-3 px-4">API Gateway</th>
                    <th className="text-center text-orange-400 py-3 px-4">BYOK</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800/50">
                      <td className="text-gray-300 py-3 px-4 font-medium">{item.feature}</td>
                      <td className="text-center text-gray-300 py-3 px-4">{item.proxy}</td>
                      <td className="text-center text-gray-300 py-3 px-4">{item.byok}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <h3 className="text-2xl font-medium text-white mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose your preferred access method and start using your fine-tuned models today. 
              You can always switch between methods later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Go to Dashboard
              </Link>
              <Link href="/learn-more" className="border border-gray-500 text-gray-300 px-8 py-3 rounded-2xl font-medium hover:bg-white/5 transition-all duration-300">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 