'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const supabase = createClientComponentClient();

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      // Check for authenticated user first
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Clear any guest user data when real user is authenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guest_user');
        }
        setUser(user);
        return;
      }

      // Check for guest user as fallback (only on client-side)
      if (typeof window !== 'undefined') {
        const guestUser = localStorage.getItem('guest_user');
        if (guestUser) {
          setUser(JSON.parse(guestUser));
          return;
        }
      }

      setUser(null);
    };
    
    if (mounted) {
      fetchUser();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [supabase, mounted]);

  const handleLogout = async () => {
    // Remove guest user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_user');
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Learn More', href: '/learn-more' },
    ...(user ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
  ];

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
        <motion.nav
          className={`transition-all duration-500 ${
            scrolled 
              ? 'bg-gray-800/95 backdrop-blur-xl border border-orange-500/30 shadow-xl shadow-orange-500/20' 
              : 'bg-gray-800/90 backdrop-blur-md border border-orange-400/30 shadow-lg'
          } rounded-2xl`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <Link 
                href="/" 
                className="text-2xl font-black text-white transition-colors duration-300 hover:text-orange-400"
              >
                FineAI
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-orange-400'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-orange-400"
                        layoutId="navbar-indicator"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Auth Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.isGuest ? 'bg-amber-500' : 'bg-blue-600'}`}>
                        <span className="text-sm font-medium text-white">
                          {user.isGuest ? '👤' : user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {user.isGuest && (
                        <span className="text-xs text-amber-600 font-medium">Guest</span>
                      )}
                    </div>
                    <motion.button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user.isGuest ? 'Exit Guest' : 'Sign Out'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth"
                      className="px-6 py-2 font-medium rounded-full transition-all duration-300 shadow-lg bg-white text-gray-900 hover:bg-gray-100"
                    >
                      Try Today
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden relative w-6 h-6 flex flex-col justify-center items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="block h-0.5 w-6 transition-all duration-300 bg-white"
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 0 : -4,
                }}
              />
              <motion.span
                className="block h-0.5 w-6 transition-all duration-300 bg-white"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
              />
              <motion.span
                className="block h-0.5 w-6 transition-all duration-300 bg-white"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 4,
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-gray-800/95 backdrop-blur-xl border-t border-orange-400/30 rounded-b-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block text-base font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? 'text-orange-400'
                          : 'text-white/80 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Auth */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="pt-4 border-t border-gray-200"
                >
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-gray-700 text-sm">{user.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.nav>
      </div>

      {/* Spacer to prevent content from going under the floating navbar */}
      <div className="h-20"></div>
    </>
  );
} 