'use client';

import { motion } from 'framer-motion';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { ListTodo, Lock, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Cinematic Backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", damping: 20 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Branding Hub */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center group mb-8">
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">
              Cipher <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Recovery</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg opacity-60 tracking-tight">Regain access to your secure environment.</p>
          </motion.div>
        </div>

        {/* Content Matrix */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-3xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Lock className="w-24 h-24 text-indigo-500" />
            </div>

            <div className="relative z-10">
              <ForgotPasswordForm />

              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Remembered your cipher?{' '}
                  <Link
                    href="/login"
                    className="text-white hover:text-indigo-400 transition-colors font-black uppercase tracking-widest text-[10px] ml-2 underline decoration-indigo-500/30 underline-offset-8"
                  >
                    Establish Link
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-6 opacity-40">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Secured by TaskFlow Core</span>
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </motion.div>
    </div>
  );
}
