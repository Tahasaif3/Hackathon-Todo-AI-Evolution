'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  FolderOpen,
  PieChart,
  User,
  LogOut,
  Plus,
  X,
  FolderPlus,
  Award,
  Zap,
  Clock,
  ListTodo,
  MessageSquare,
  Bell,
  Search,
  Activity,
  Shield,
  Cpu,
  Unplug
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getTasks, getProjects, getProjectProgress } from '@/lib/api';
import { Task, Project } from '@/lib/types';
import { ProjectForm } from '@/components/ProjectForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AnalyticsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectProgress, setProjectProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      router.push('/login');
    }
  };

  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      if (!userId) return;

      const [tasksData, projectsData] = await Promise.all([
        getTasks(userId),
        getProjects(userId)
      ]);

      setTasks(tasksData);
      setProjects(projectsData);

      const progressData: Record<string, any> = {};
      await Promise.all(projectsData.map(async (project) => {
        try {
          const progress = await getProjectProgress(userId, project.id);
          progressData[project.id] = progress;
        } catch (err) {
          progressData[project.id] = { total_tasks: 0, completed_tasks: 0, pending_tasks: 0, progress: 0 };
        }
      }));
      setProjectProgress(progressData);
    } catch (err: any) {
      setError(err.message || 'Failed to load telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.completed) return false;
    return new Date(task.due_date) < new Date();
  }).length;

  const getWeeklyTrend = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => {
      if (!task.completed || !task.updated_at) return false;
      const completedDate = new Date(task.updated_at);
      return completedDate >= weekAgo && completedDate <= today;
    }).length;
  };

  const weeklyCompleted = getWeeklyTrend();
  const topProjects = [...projects]
    .map(project => ({ ...project, progress: projectProgress[project.id]?.progress || 0 }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  const productivityScore = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100 + (weeklyCompleted / 5))) : 0;

  if (loading && tasks.length === 0) {
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
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <DesignerHeader />

        <main className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">TaskFlow Analytics</h1>
                <p className="text-slate-400 text-lg font-medium opacity-60">System-wide performance metrics and focus trends</p>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Status: Optimized</span>
                </div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'EFFICIENCY RATING', value: `${completionRate}%`, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'COMPLETED TASKS', value: completedTasks, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'PENDING TASKS', value: pendingTasks, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { label: 'OVERDUE TASKS', value: overdueTasks, icon: Unplug, color: 'text-red-400', bg: 'bg-red-400/10' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Massive Productivity Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 relative bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Cpu className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <Award className="w-10 h-10 text-indigo-400" />
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Productivity Score</h2>
                  </div>

                  <div className="flex items-end gap-6 mb-12">
                    <span className="text-8xl font-black text-white tracking-tighter leading-none">{productivityScore}</span>
                    <div className="flex flex-col mb-2">
                      <span className="text-xl font-bold text-white/40">/ 100</span>
                      <span className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Elite Tier
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                      <span>Processing Power</span>
                      <span>{productivityScore}% Allocated</span>
                    </div>
                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${productivityScore}%` }}
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full"
                      />
                    </div>
                    <p className="text-slate-400 text-sm font-medium opacity-60">Your current synchronization rate is {productivityScore}% above the system threshold. Maintain current vector focus for optimal results.</p>
                  </div>
                </div>
              </motion.div>

              {/* Project Cluster Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[40px] p-10"
              >
                <h3 className="text-lg font-black text-white mb-8 tracking-widest uppercase flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-indigo-400" /> TOP CLUSTERS
                </h3>
                <div className="space-y-8">
                  {topProjects.map((p, idx) => (
                    <div key={p.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-white uppercase tracking-tight">{p.name}</span>
                        <span className="text-xs font-bold text-white/40">{p.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                  ))}
                  {topProjects.length === 0 && (
                    <div className="py-20 text-center opacity-20">
                      <Shield className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No active clusters detected</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Weekly Activity Heatmap Placeholder/Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-black text-white mb-4 tracking-widest uppercase">Weekly Pulse</h3>
                  <p className="text-slate-400 text-sm font-medium opacity-60 mb-8">Node completion frequency over the last 7 cycles.</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">High Activity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-white/5 rounded-sm" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Baseline</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 flex items-end justify-between h-48 gap-2">
                  {[4, 7, 2, 8, 5, 10, 6].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 10}%` }}
                        className={`w-full rounded-2xl ${h > 7 ? 'bg-indigo-500' : 'bg-white/5'} border border-white/5 transition-colors`}
                      />
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowCreateModal(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-3xl p-1"
              >
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Cluster Initialization</h3>
                  <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="h-6 w-6 text-white/40" />
                  </button>
                </div>
                <div className="p-8 pt-4">
                  <ProjectForm onCancel={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchData(); }} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div >
    </ProtectedRoute >
  );
}