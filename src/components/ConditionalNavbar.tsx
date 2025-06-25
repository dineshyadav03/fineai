'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on home page (landing page has its own navigation)
  if (pathname === '/') {
    return null;
  }
  
  return <Navbar />;
} 