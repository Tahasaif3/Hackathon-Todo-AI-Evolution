'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { register as registerAPI } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Eye, EyeOff, Loader2, Check, X, AlertCircle, Mail, Lock, User, ChevronRight } from 'lucide-react';

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

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('Neural Protocol agreement required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Cipher mismatch detected');
      return;
    }

    setLoading(true);

    try {
      await registerAPI({ email, password });
      showToast.success('Entity Identity Registered');
      router.push('/tasks');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-emerald-400 transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold"
              placeholder="operator@matrix.net"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Password</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-emerald-400 transition-colors">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1 pt-2 grid grid-cols-3 gap-2">
              <div className={`h-1 rounded-full transition-colors ${hasMinLength ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <div className={`h-1 rounded-full transition-colors ${hasNumber ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <div className={`h-1 rounded-full transition-colors ${hasSpecialChar ? 'bg-emerald-500' : 'bg-white/10'}`} />
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-emerald-400 transition-colors">
              <Check className="h-4 w-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-white/[0.03] border ${confirmPassword ? (passwordsMatch ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-white/5'} rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/10 focus:outline-none focus:bg-white/[0.05] transition-all font-bold`}
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <div
        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.04] transition-all"
        onClick={() => setAcceptedTerms(!acceptedTerms)}
      >
        <div className="flex gap-3">
          <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${acceptedTerms ? 'bg-emerald-500 border-emerald-500' : 'bg-white/5 border-white/10'}`}>
            {acceptedTerms && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
            I accept the <span className="text-white hover:text-emerald-400 cursor-pointer">Terms & Conditions</span> and <span className="text-white hover:text-emerald-400 cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: acceptedTerms ? 1.02 : 1 }}
        whileTap={{ scale: acceptedTerms ? 0.98 : 1 }}
        disabled={loading || !acceptedTerms}
        className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 disabled:opacity-20 group uppercase tracking-widest text-xs"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Register
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
}