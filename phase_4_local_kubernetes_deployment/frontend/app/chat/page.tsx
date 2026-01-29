'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Target,
  CheckCircle,
  Calendar,
  TrendingUp,
  User,
  ListTodo,
  Bell,
  BarChart3,
  FolderOpen,
  PieChart,
  Cpu,
  Zap,
  Shield,
  Activity,
  X,
  ChevronRight,
  Terminal,
  Code
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';
import ChatInterface from '@/components/ChatInterface';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCurrentUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
        {/* Cinematic Backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <DesignerHeader />

        <main className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Neural Interface</h1>
                <p className="text-slate-400 text-lg font-medium opacity-60">Direct neural-link to the TaskFlow central processing unit.</p>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Sync Level: Maximum</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Interface - Primary Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[40px] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight">Cortex Assistant</h2>
                          <p className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready for Input
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">
                          v2.5.0-Flash
                        </div>
                      </div>
                    </div>

                    <div className="min-h-[600px]">
                      {userId && <ChatInterface userId={userId} compact={false} />}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar - Contextual Column */}
              <div className="space-y-6">
                {/* Protocol Guidelines */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[40px] p-8"
                >
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" /> Interaction Protocols
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Sparkles, text: "Natural language cluster creation", color: "text-indigo-400" },
                      { icon: Code, text: "Direct task vector modification", color: "text-purple-400" },
                      { icon: Target, text: "Strategic goal alignment", color: "text-emerald-400" },
                      { icon: Zap, text: "Instant status reporting", color: "text-yellow-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-colors">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-xs font-bold text-slate-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Example Commands */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8"
                >
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" /> Command Samples
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Initialize design cluster for Project Obsidian.",
                      "Fetch all pending nodes for current cycle.",
                      "Synchronize task 4 across project matrix.",
                      "Abort project with ID 874 immediately."
                    ].map((cmd, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl font-mono text-[11px] text-white/50 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all flex items-center justify-between">
                          <span>{cmd}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Neural Status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-8 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Shield className="w-32 h-32" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 uppercase tracking-[0.2em]">Cortex Status</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-black text-white tracking-tighter">98.4</span>
                    <span className="text-sm font-bold text-white/40 mb-1">% ACCURACY</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "98.4%" }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Model: Gemini 1.5 Flash</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
