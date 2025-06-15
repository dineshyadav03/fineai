'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function SignInForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let authResponse;
      if (isSignIn) {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (authResponse.error) {
        throw new Error(authResponse.error.message);
      }

      if (isSignIn) {
        toast.success('Signed in successfully!');
      } else {
        toast.success('Signed up successfully! Please check your email for confirmation.');
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
      <p className="text-center text-sm text-trainy-text-secondary mt-6">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="text-trainy-accent-blue hover:underline"
        >
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
} 