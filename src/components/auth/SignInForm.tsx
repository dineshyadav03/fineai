'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignInForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting authentication process...');
      console.log('Mode:', isSignIn ? 'Sign In' : 'Sign Up');
      console.log('Email:', email);

      // Clear any demo user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_user');
      }

      // Ensure Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
        throw new Error('Authentication service is not properly configured. Please contact support.');
      }

      let authResponse;
      if (isSignIn) {
        console.log('Attempting sign in...');
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        console.log('Attempting sign up...');
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      }

      console.log('Auth Response:', authResponse);

      if (authResponse.error) {
        console.error('Auth Error:', authResponse.error);
        throw new Error(authResponse.error.message);
      }

      if (isSignIn) {
        // Sign In - user should be logged in immediately
        if (authResponse.data?.user) {
          toast.success('Signed in successfully!');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid email or password.');
        }
      } else {
        // Sign Up - different behavior
        if (authResponse.data?.user?.identities?.length === 0) {
          // Email already exists
          toast.error('This email is already registered. Please sign in instead.');
          setIsSignIn(true);
        } else if (authResponse.data?.user) {
          // New user created successfully
          if (authResponse.data.user.email_confirmed_at) {
            // Email was auto-confirmed (unlikely in production)
            toast.success('Account created successfully! You are now signed in.');
            router.push('/dashboard');
          } else {
            // Email confirmation required (normal flow)
            toast.success('Account created! Please check your email to verify your account before signing in.');
            setEmail('');
            setPassword('');
          }
        } else {
          throw new Error('Failed to create account.');
        }
      }
    } catch (error: any) {
      console.error('Authentication Error:', error);
      
      // Provide specific error messages for common issues
      let errorMessage = error.message;
      
      if (isSignIn) {
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        }
      } else {
        if (errorMessage.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (errorMessage.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address.';
        }
      }
      
      toast.error(errorMessage || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign in...');
      
      // Clear any demo user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_user');
      }

      // Ensure Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
        throw new Error('Authentication service is not properly configured. Please contact support.');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google Sign In Error:', error);
        throw error;
      }

      console.log('Google sign in initiated successfully');
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co');

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      
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
        {[...Array(8)].map((_, i) => (
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

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-orange-500/20"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-light text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isSignIn ? 'Welcome back' : 'Create account'}
            </motion.h1>
            <motion.p 
              className="text-gray-300 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isSignIn 
                ? 'Sign in to access your AI models' 
                : 'Join FineAI to start building AI models'
              }
            </motion.p>
            

          </div>

          {/* Toggle Buttons */}
          <motion.div 
            className="flex bg-white/10 rounded-lg p-1 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                isSignIn 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                !isSignIn 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleAuth} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignIn ? 'Enter your password' : 'Create a password (min 6 characters)'}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>
                    {isSignIn ? 'Signing in...' : 'Creating account...'}
                  </span>
                </div>
              ) : (
                isSignIn ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {isSignIn && (
              <a href="#" className="text-sm text-orange-400 hover:text-orange-300">
                Forgot your password?
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 