'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '@/lib/api';
import { ShieldCheck, Fingerprint, Globe, Cpu, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();

        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setTimeout(() => {
            try {
              router.replace('/login');
            } catch (error) {
              window.location.href = '/login';
            }
          }, 300);
        }
      } catch (error) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setTimeout(() => {
            try {
              router.replace('/login');
            } catch (error) {
              window.location.href = '/login';
            }
          }, 300);
        }
      }
    };

    const timer = setTimeout(checkAuthStatus, 200);
    return () => clearTimeout(timer);
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Central Logo/Icon Animation */}
          <div className="relative mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-2xl shadow-2xl"
            >
              <motion.div
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              />
              <Fingerprint className="w-12 h-12 text-indigo-400" />
            </motion.div>

            {/* Spinning Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-indigo-500/20 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-purple-500/10 rounded-full border-dashed"
            />
          </div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase mb-4">Neural Handshake</h2>
            <div className="flex items-center gap-3 justify-center">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                      backgroundColor: ["#475569", "#6366f1", "#475569"]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verifying Identity Matrix</span>
            </div>
          </motion.div>

          {/* Feature Grid (Subtle) */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, label: "Secure" },
              { icon: Globe, label: "Global" },
              { icon: Lock, label: "Encrypted" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <item.icon className="w-4 h-4 text-white" />
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Binary Stream Decoration */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 flex flex-col items-center justify-around py-20 pointer-events-none opacity-20 hidden md:flex">
          {[0, 1, 0, 1, 1, 0].map((v, i) => (
            <span key={i} className="text-[10px] font-mono text-indigo-500">{v}</span>
          ))}
        </div>
        <div className="absolute right-10 top-0 bottom-0 w-px bg-white/5 flex flex-col items-center justify-around py-20 pointer-events-none opacity-20 hidden md:flex">
          {[1, 0, 1, 0, 0, 1].map((v, i) => (
            <span key={i} className="text-[10px] font-mono text-purple-500">{v}</span>
          ))}
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}