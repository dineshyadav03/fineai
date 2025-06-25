'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const checkUser = async () => {
      // Check for guest user first (only on client-side)
      if (typeof window !== 'undefined') {
        const guestUser = localStorage.getItem('guest_user');
        if (guestUser) {
          setUser(JSON.parse(guestUser));
          return;
        }
      }

      // Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    if (mounted) {
      checkUser();
    }
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [supabase, mounted]);

  const handleGetStarted = () => {
    if (user) {
      // User is signed in, go to dashboard
      router.push('/dashboard');
    } else {
      // User is not signed in, show auth modal
      setShowAuthModal(true);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleGuestContinue = () => {
    // Set guest user in localStorage (only on client-side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_user', JSON.stringify({ email: 'guest@fineai.com', isGuest: true }));
    }
    setUser({ email: 'guest@fineai.com', isGuest: true });
    toast.success('Welcome! You\'re exploring as a guest.');
    setShowAuthModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Cosmic Circles */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.3) 0%, rgba(255,107,0,0.1) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Outer Ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-orange-500/20 rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-orange-400/30 rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6">
        <div className="flex items-center space-x-8">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/learn-more" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Try Today
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
                     <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white leading-tight tracking-tight">
             Craft intelligence
           </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Transform raw AI into something extraordinary. For visionaries who refuse to settle for generic—where every dataset becomes a masterpiece and every model tells your story.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
          >
            Join the platform
            <svg 
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

                 {/* Bottom text */}
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1.5 }}
           className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
         >
           <p className="text-sm text-white/50">
             Fine-tune AI models with your data using Cohere API
           </p>
         </motion.div>
       </div>

       {/* Features Section */}
       <section className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="text-center mb-16"
           >
             <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
               What you can build
             </h2>
             <p className="text-lg text-white/70 max-w-3xl mx-auto">
               Transform your raw data into intelligent, specialized AI models that understand your unique context and requirements.
             </p>
           </motion.div>

           <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 icon: "🧠",
                 title: "Custom Models",
                 description: "Train AI models specifically for your use case with your own datasets and requirements."
               },
               {
                 icon: "⚡",
                 title: "Real Training",
                 description: "Powered by Cohere's production API infrastructure for reliable, scalable fine-tuning."
               },
               {
                 icon: "🎯",
                 title: "Precise Control",
                 description: "Configure training parameters, base models, and categories to match your exact needs."
               }
             ].map((feature, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: index * 0.2 }}
                 className="bg-gray-800/50 backdrop-blur-sm border border-orange-400/20 rounded-2xl p-8 hover:border-orange-400/40 transition-all duration-300"
               >
                 <div className="text-4xl mb-4">{feature.icon}</div>
                 <h3 className="text-xl font-medium text-white mb-4">{feature.title}</h3>
                 <p className="text-white/70 leading-relaxed">{feature.description}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* How It Works */}
       <section className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="text-center mb-16"
           >
             <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
               Simple process
             </h2>
             <p className="text-lg text-white/70 max-w-3xl mx-auto">
               From raw data to production-ready AI models in three straightforward steps.
             </p>
           </motion.div>

           <div className="space-y-12">
             {[
               {
                 step: "01",
                 title: "Upload your data",
                 description: "Support for JSONL, CSV, and other formats. We validate and prepare your data for training.",
                 details: "Chat conversations, Q&A pairs, classification data, or custom formats"
               },
               {
                 step: "02", 
                 title: "Configure training",
                 description: "Choose your base model, set training parameters, and define your model's purpose and category.",
                 details: "Command or Command Light base models, custom hyperparameters, training objectives"
               },
               {
                 step: "03",
                 title: "Deploy and test",
                 description: "Monitor training progress, test your model, and integrate it into your applications.",
                 details: "Real-time status updates, API access, performance testing tools"
               }
             ].map((step, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: index * 0.2 }}
                 className={`grid md:grid-cols-2 gap-12 items-center ${
                   index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
                 }`}
               >
                 <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                   <div className="text-6xl font-light text-orange-400/30 mb-4">{step.step}</div>
                   <h3 className="text-2xl font-medium text-white mb-4">{step.title}</h3>
                   <p className="text-white/70 text-lg leading-relaxed mb-4">{step.description}</p>
                   <p className="text-white/50 text-sm">{step.details}</p>
                 </div>
                 <div className={`bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl p-8 border border-orange-400/20 ${
                   index % 2 === 1 ? 'md:col-start-1' : ''
                 }`}>
                   <div className="w-full h-32 bg-gray-700/50 rounded-lg flex items-center justify-center">
                     <span className="text-white/40">Visual representation</span>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* CTA Section */}
       <section className="relative z-10 py-24 px-6">
         <div className="max-w-4xl mx-auto text-center">
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
               Ready to craft?
             </h2>
             <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
               Start building custom AI models that understand your specific needs and data.
             </p>
             <button
               onClick={handleGetStarted}
               className="group inline-flex items-center px-12 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 text-lg"
             >
               Join the platform
               <svg 
                 className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </button>
           </motion.div>
         </div>
       </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleAuthModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-light text-white mb-4">Get Started</h3>
              <p className="text-gray-300 mb-6">
                Choose how you'd like to explore FineAI:
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleGuestContinue}
                  className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Continue as Guest
                </button>
                
                <Link
                  href="/auth"
                  className="w-full px-6 py-3 border border-gray-600 text-gray-200 font-medium rounded-lg hover:bg-gray-700 transition-colors text-center block"
                  onClick={handleAuthModalClose}
                >
                  Sign Up / Sign In
                </Link>
              </div>
              
              <button
                onClick={handleAuthModalClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 