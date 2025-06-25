'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: '📁',
    title: 'File Upload & Validation',
    description: 'Upload datasets in JSONL, CSV, and other formats. Automatic validation and format checking.',
    details: ['Multiple file formats', 'Data validation', 'Format conversion'],
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    icon: '🤖',
    title: 'Cohere API Integration',
    description: 'Real integration with Cohere API for fine-tuning. Upload data and create custom models.',
    details: ['Cohere fine-tuning', 'Real API calls', 'Model creation'],
    gradient: 'from-orange-400 to-orange-500'
  },
  {
    icon: '📊',
    title: 'Dashboard Interface',
    description: 'Simple dashboard to manage your datasets and monitor training progress.',
    details: ['Dataset management', 'Training status', 'Model overview'],
    gradient: 'from-orange-600 to-orange-700'
  },
  {
    icon: '🧪',
    title: 'Model Testing',
    description: 'Basic interface to test your trained models and see how they perform.',
    details: ['Model testing', 'Simple interface', 'Result display'],
    gradient: 'from-orange-300 to-orange-400'
  },
  {
    icon: '⚙️',
    title: 'Demo Authentication',
    description: 'Simple authentication system for demonstration purposes. No real user management.',
    details: ['Demo login', 'Guest access', 'Basic sessions'],
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    icon: '🎨',
    title: 'Modern Interface',
    description: 'Clean, responsive UI built with Next.js, TypeScript, and Tailwind CSS.',
    details: ['Responsive design', 'Modern tech stack', 'Smooth animations'],
    gradient: 'from-orange-400 to-orange-500'
  }
];

const useCases = [
  {
    title: 'Customer Support',
    description: 'Train AI assistants that understand your business context and provide accurate support.',
    icon: '🎧',
    example: 'Reduce response time by 80% with context-aware chatbots'
  },
  {
    title: 'Content Generation',
    description: 'Create AI writers that match your brand voice and style guidelines.',
    icon: '✍️',
    example: 'Generate blog posts, emails, and marketing copy at scale'
  },
  {
    title: 'Code Assistant',
    description: 'Build programming assistants trained on your codebase and documentation.',
    icon: '💻',
    example: 'Automate code reviews and generate documentation'
  },
  {
    title: 'Data Analysis',
    description: 'Train models to extract insights and patterns from your business data.',
    icon: '📈',
    example: 'Analyze customer feedback and predict trends'
  }
];

const stats = [
  { value: '10x', label: 'Faster Training' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50+', label: 'Model Types' },
  { value: '24/7', label: 'Support' }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0">
        {/* Central Orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl"
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
        {[...Array(20)].map((_, i) => (
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
              What you can
              <span className="text-orange-400"> build</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
              An honest look at the features and capabilities of this AI fine-tuning demonstration platform.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-orange-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Built for Modern AI Development
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Comprehensive tools and features designed to streamline your AI workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-medium text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 font-light">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-orange-200 max-w-2xl mx-auto font-light">
              See how businesses are using FineAI to solve complex challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div className="text-4xl">{useCase.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-white mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-300 mb-4 font-light">
                        {useCase.description}
                      </p>
                      <p className="text-orange-400 text-sm italic">
                        {useCase.example}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Seamless Integration
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light">
              Connect with your existing tools and workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'REST API', desc: 'Full API access for custom integrations', icon: '🔌' },
              { name: 'Python SDK', desc: 'Native Python library for data scientists', icon: '🐍' },
              { name: 'Webhooks', desc: 'Real-time notifications and updates', icon: '🔔' },
              { name: 'Cloud Storage', desc: 'Connect to AWS, GCP, and Azure', icon: '☁️' },
              { name: 'CI/CD Pipeline', desc: 'Automated model training and deployment', icon: '⚙️' },
              { name: 'Monitoring', desc: 'Integration with DataDog, New Relic', icon: '📊' }
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 shadow-lg text-center hover:shadow-orange-500/20 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{integration.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {integration.name}
                </h3>
                <p className="text-gray-300 text-sm font-light">
                  {integration.desc}
                </p>
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
              Ready to craft intelligence?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Start building your AI models today with our comprehensive platform.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-colors duration-200"
              >
                Start Building →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 