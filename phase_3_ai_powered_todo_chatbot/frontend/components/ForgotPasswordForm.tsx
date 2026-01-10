'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Mail, ChevronRight, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Invalid identity mail provided.');
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
      showToast.success('Recovery Signal Dispatched');
    } catch (err: any) {
      setError(err.message || 'Dispatch failed. Verification error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[32px] bg-indigo-500/10 border border-indigo-500/20 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto border border-indigo-500/30">
              <CheckCircle className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Signal Sent</h3>
              <p className="text-sm text-slate-400 font-medium">Verify your mail to override the existing cipher.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/reset-password')}
              className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-[10px]"
            >
              Enter Reset Protocol
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!success && (
        <>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Identity Mail</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all font-bold"
                placeholder="operator@matrix.net"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group uppercase tracking-widest text-xs"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Dispatch Reset Signal
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </>
      )}
    </form>
  );
}
