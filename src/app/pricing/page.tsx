'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const currentAccess = [
  {
    name: 'Demo Access',
    description: 'Full access to all current features',
    price: 'Free',
    period: '',
    popular: true,
    features: [
      'Upload datasets (JSONL, CSV formats)',
      'Real Cohere API integration',
      'Model training with your data',
      'Basic dashboard interface',
      'Guest and demo authentication',
      'Training progress tracking',
      'Simple model testing',
      'Example datasets included'
    ],
    limitations: [
      'Demo purposes only',
      'Requires your own Cohere API key',
      'Basic error handling',
      'No persistent user accounts (demo mode)'
    ],
    cta: 'Try It Now',
    href: '/dashboard',
    gradient: 'from-orange-500 to-orange-600'
  }
];

const potentialFeatures = [
  {
    name: 'Enhanced Version',
    description: 'What a production version might include',
    price: 'Future',
    period: '',
    popular: false,
    features: [
      'Real user management',
      'Persistent data storage',
      'Advanced model testing',
      'Performance analytics',
      'Team collaboration',
      'API key management',
      'Enhanced security',
      'Production deployment'
    ],
    limitations: [
      'Not currently available',
      'Would require development',
      'Conceptual only'
    ],
    cta: 'Not Available',
    href: '#',
    gradient: 'from-gray-400 to-gray-500'
  }
];

const actualCosts = [
  {
    name: 'Cohere API',
    description: 'Real cost for using the Cohere API for fine-tuning',
    details: [
      'Fine-tuning: $1-5 per model (depending on size)',
      'API calls: $0.0015-0.03 per 1K tokens',
      'Storage: Minimal for datasets',
      'See Cohere pricing for exact rates'
    ],
    icon: '🤖'
  },
  {
    name: 'Deployment',
    description: 'If you want to deploy this platform',
    details: [
      'Vercel: Free tier available',
      'Supabase: Free tier for small projects',
      'Domain: $10-15/year',
      'Scaling costs depend on usage'
    ],
    icon: '🚀'
  }
];

const faqs = [
  {
    question: 'Is this really free?',
    answer: 'Yes, this demo platform is completely free to use. However, you need your own Cohere API key, which has its own pricing from Cohere.'
  },
  {
    question: 'Do I need to pay for anything?',
    answer: 'Only for the Cohere API usage. Fine-tuning typically costs $1-5 per model. Check Cohere\'s pricing page for current rates.'
  },
  {
    question: 'Can I use this for my business?',
    answer: 'This is a demonstration platform. You can learn from it and adapt the code, but it\'s not designed for production business use as-is.'
  },
  {
    question: 'What about user accounts?',
    answer: 'Currently uses demo authentication. For real use, you\'d need to implement proper user management and data persistence.'
  },
  {
    question: 'How can I get my own Cohere API key?',
    answer: 'Sign up at dashboard.cohere.ai and get your API key. They offer free trial credits to get started.'
  },
  {
    question: 'Can I modify this platform?',
    answer: 'Yes! The code is designed to be educational. You can fork it and build your own enhanced version.'
  }
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0">
        {/* Central Orb */}
        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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
              Demo Platform
              <span className="text-orange-400"> Access</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
              This is a demonstration platform. Here's what you can access and what the real costs are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Access */}
      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              What You Can Access Now
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Everything currently available in this demonstration platform
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            {currentAccess.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-500/30 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${plan.gradient} mb-4`}>
                      Available Now
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-300 mb-4 font-light">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-light text-white">{plan.price}</span>
                      <span className="text-xl text-gray-400 ml-2">{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="font-medium text-white mb-3">✅ What Works</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-300 font-light">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-3">⚠️ Limitations</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-300 font-light">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href={plan.href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-medium text-lg transition-colors duration-200"
                    >
                      {plan.cta} →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Costs Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Real Costs to Consider
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              While the platform is free, here are the actual costs you might incur
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {actualCosts.map((cost, index) => (
              <motion.div
                key={cost.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{cost.icon}</div>
                    <div>
                      <h3 className="text-2xl font-medium text-white mb-2">{cost.name}</h3>
                      <p className="text-gray-300 font-light">{cost.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {cost.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-300 font-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Everything you need to know about this demo platform
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-orange-500/20 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="text-lg font-medium text-white">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-orange-400 text-xl"
                    >
                      ↓
                    </motion.span>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-300 font-light leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/20"
          >
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to explore?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Start experimenting with AI fine-tuning today. It's completely free to try.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-colors duration-200"
              >
                Try the Platform →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 