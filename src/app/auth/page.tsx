'use client';

import SignInForm from '@/components/auth/SignInForm';

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-trainy-background">
      <SignInForm />
    </div>
  );
} 