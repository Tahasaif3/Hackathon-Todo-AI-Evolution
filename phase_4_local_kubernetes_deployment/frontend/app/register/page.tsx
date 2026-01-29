'use client';

import { motion } from 'framer-motion';
import RegisterForm from '@/components/RegisterForm';
import { ListTodo, Shield, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Cinematic Backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", damping: 20 }}
        className="max-w-lg w-full relative z-10"
      >
        {/* Branding Hub */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center group mb-8">
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TaskFlow</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg opacity-60 tracking-tight">Initializing your presence in the TaskFlow ecosystem.</p>
          </motion.div>
        </div>

        {/* Content Matrix */}
        <div className="relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-3xl overflow-hidden">
            {/* Inner Decorative Elements */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity className="w-24 h-24 text-emerald-500" />
            </div>

            <div className="relative z-10">
              <RegisterForm />

              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-white hover:text-emerald-400 transition-colors font-black uppercase tracking-widest text-[10px] ml-2 underline decoration-emerald-500/30 underline-offset-8"
                  >
                    LOGIN
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Protocols */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            { icon: Zap, label: 'Early Access', color: 'text-yellow-400' },
            { icon: Activity, label: 'Realtime', color: 'text-emerald-400' },
            { icon: Shield, label: 'Encrypted', color: 'text-cyan-400' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex flex-col items-center gap-2 group hover:opacity-100 transition-opacity"
            >
              <div className={`p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}