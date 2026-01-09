'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { register as registerAPI } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Eye, EyeOff, Loader2, Check, X, AlertCircle } from 'lucide-react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Enhanced validation
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!hasNumber) {
      setError('Password must contain at least one number');
      return;
    }

    if (!hasSpecialChar) {
      setError('Password must contain at least one special character');
      return;
    }

    setLoading(true);

    try {
      await registerAPI({ email, password });
      // Registration successful, redirect to tasks page
      showToast.success('Account created successfully! Welcome aboard!');
      router.push('/tasks');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
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
            className="rounded-lg bg-gradient-to-r from-red-900/20 to-orange-800/20 p-4 border border-red-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-sm text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-3">
            <span className="flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
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
              className="w-full px-5 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-gray-800/50 transition-all duration-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
              autoComplete="new-password"
              required
              className="w-full px-5 py-3.5 bg-gray-800/30 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:bg-gray-800/50 transition-all duration-300 pr-12"
              placeholder="Create a strong password"
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
          
          {/* Password strength indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-2"
            >
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${password.length < 4 ? 'bg-red-500' : password.length < 8 ? 'bg-orange-500' : password.length < 12 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((password.length / 16) * 100, 100)}%` }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Contains number</span>
                </div>
                <div className={`flex items-center gap-1 ${hasSpecialChar ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {hasSpecialChar ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Special character</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordsMatch && confirmPassword ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {passwordsMatch && confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-3">
            <span className="flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              Confirm Password
            </span>
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className={`w-full px-5 py-3.5 bg-gray-800/30 border ${
                confirmPassword 
                  ? passwordsMatch 
                    ? 'border-emerald-500/50' 
                    : 'border-red-500/50'
                  : 'border-gray-700/50'
              } rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-gray-800/50 transition-all duration-300 pr-12`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              {confirmPassword && (
                passwordsMatch ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 cursor-pointer group"
        onClick={() => setAcceptedTerms(!acceptedTerms)}
      >
        <div className={`relative flex-shrink-0 w-5 h-5 mt-0.5 border-2 ${acceptedTerms ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'} rounded-md transition-all duration-300 group-hover:border-emerald-400`}>
          {acceptedTerms && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>
        <label className="text-sm text-gray-300 cursor-pointer select-none">
          I agree to the{' '}
          <a href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Privacy Policy
          </a>
          . I understand that my data will be processed according to the privacy policy.
        </label>
      </motion.div>

      <motion.div
        whileHover={{ scale: acceptedTerms && !loading ? 1.02 : 1 }}
        whileTap={{ scale: acceptedTerms && !loading ? 0.98 : 1 }}
        className="relative"
      >
        <button
          type="submit"
          disabled={loading || !acceptedTerms}
          className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-emerald-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating your account...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Start Free Journey
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
        
        {/* Button glow effect */}
        {!loading && acceptedTerms && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </form>
  );
}