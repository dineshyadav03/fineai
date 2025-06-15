'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-soft py-4 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-trainy-accent-blue">
          FineAI
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/" className={`text-trainy-text-primary hover:text-trainy-accent-blue transition-colors duration-200 ${pathname === '/' ? 'font-semibold' : ''}`}>
            Home
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className={`text-trainy-text-primary hover:text-trainy-accent-blue transition-colors duration-200 ${pathname === '/dashboard' ? 'font-semibold' : ''}`}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 