'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { login as loginAPI } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberMe') === 'true';
    }
    return false;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const loginResponse = await loginAPI({ email, password });
      console.log('Login successful', loginResponse);
      
      // Store user information in localStorage
      if (loginResponse.user) {
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
      }
      
      // Also store the auth token if it exists (fallback mechanism)
      if (loginResponse.access_token) {
        localStorage.setItem('auth_token', loginResponse.access_token);
      }
      
      // Login successful, redirect to tasks page
      showToast.success('Welcome back! Redirecting...');
      
      // Use push instead of replace to ensure proper navigation
      console.log('Redirecting to tasks page');
      try {
        // Add a small delay to ensure the token is properly stored
        setTimeout(() => {
          router.push('/tasks');
        }, 100);
      } catch (routerError) {
        console.error('Router error:', routerError);
        // Fallback to window.location
        window.location.href = '/tasks';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-gradient-to-r from-red-900/20 to-red-800/20 p-4 border border-red-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-sm text-red-300">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-3">
            <span className="flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              Email Address
            </span>
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-5 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-gray-800/50 transition-all duration-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
            <span className="flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
              Password
            </span>
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full px-5 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:bg-gray-800/50 transition-all duration-300 pr-12"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center cursor-pointer group"
        >
          <div className="relative">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="sr-only"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors ${rememberMe ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 bg-gray-800/50 group-hover:bg-gray-700/50'}`}>
              {rememberMe && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-400 group-hover:text-gray-300 transition-colors cursor-pointer">
            Remember me
          </label>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <a 
            href="/forgot-password" 
            className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all"
          >
            Forgot password?
          </a>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign in
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
        
        {/* Button glow effect */}
        {!loading && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </form>
  );
}