'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function LearnMore() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tutorials = [
    {
      title: 'Using This Demo Platform',
      description: 'Step-by-step guide to uploading data and training models with this demo',
      duration: '10 min',
      difficulty: 'Beginner',
      image: '🚀',
      topics: ['Dashboard', 'File Upload', 'Model Training'],
      link: '/dashboard'
    },
    {
      title: 'Understanding Cohere API',
      description: 'Learn about the Cohere API used for actual fine-tuning in this platform',
      duration: '15 min',
      difficulty: 'Intermediate',
      image: '🤖',
      topics: ['API Setup', 'Fine-tuning', 'Pricing'],
      link: 'https://dashboard.cohere.ai'
    }
  ];

  const faqs = [
    {
      question: 'What is this platform exactly?',
      answer: 'This is a demonstration platform that shows how AI fine-tuning works using the Cohere API. It\'s built for learning and experimentation, not production use.'
    },
    {
      question: 'Do I need my own API key?',
      answer: 'Yes, you need your own Cohere API key to actually train models. The platform provides the interface, but uses your API key for the real fine-tuning process.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'The platform currently supports JSONL format (required by Cohere) and can help convert CSV files. You can use the example datasets to get started.'
    },
    {
      question: 'How much does fine-tuning cost?',
      answer: 'The platform itself is free. Cohere API charges $1-5 per model for fine-tuning depending on the model size. Check Cohere\'s pricing for current rates.'
    },
    {
      question: 'Can I use this for my business?',
      answer: 'This is a demo platform for learning. While you can experiment with your data, it\'s not designed for production business use without significant enhancements.'
    },
    {
      question: 'Where is my data stored?',
      answer: 'In demo mode, data is temporarily stored for the session. For persistent storage, you\'d need to set up your own database and enhance the platform.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0">
        {/* Central Orb */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl"
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
        {[...Array(12)].map((_, i) => (
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
              Understanding
              <span className="text-orange-400"> AI Fine-tuning</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
              Learn about AI fine-tuning concepts and how to use this demonstration platform effectively.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-500/20">
                <span className="text-orange-400 font-medium">📖 Demo Guide</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-500/20">
                <span className="text-green-400 font-medium">🤖 Cohere Integration</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-500/20">
                <span className="text-purple-400 font-medium">💻 Code Examples</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Tutorials */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Getting Started
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Learn how to use this demo platform and understand AI fine-tuning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-4xl">{tutorial.image}</div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tutorial.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                        tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/20 text-red-400 border border-red-500/20'
                      }`}>
                        {tutorial.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-full text-xs font-medium">
                        {tutorial.duration}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-white mb-3">
                    {tutorial.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 font-light">
                    {tutorial.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tutorial.topics.map((topic, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-sm border border-white/10">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={tutorial.link}
                    className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 transition-colors"
                  >
                    Start Tutorial
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Quick answers to help you get started faster
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-orange-500/20 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="font-medium text-white">{faq.question}</span>
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
              Ready to start experimenting?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Try the demo platform and explore how AI fine-tuning works.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-colors duration-200"
              >
                Explore the Platform →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
