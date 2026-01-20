'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/auth';

export function FloatingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check authentication status
    setIsLoggedIn(auth.isAuthenticated());

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    router.push('/');
  };

  const navItems = isLoggedIn
    ? [
        { name: 'Dashboard', href: '/tasks' },
        { name: 'New Task', href: '/tasks/new' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/#features' },
      ];

  return (
    <motion.nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'scale-90 opacity-80' : 'scale-100 opacity-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => router.push('/')}
            className="text-xl font-bold text-white hover:text-indigo-300 transition-colors"
          >
            TaskFlow Elite
          </button>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-indigo-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}