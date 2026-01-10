'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskList } from '@/components/TaskList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { logout, getUserTaskStats } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { TaskForm } from '@/components/TaskForm';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
  User,
  BarChart3,
  Award,
  Zap,
  Flame,
  Trophy,
  Star,
  X,
  FolderOpen,
  PieChart,
  ListTodo,
  LogOut,
  MessageSquare,
  ChevronRight,
  Target
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';

export default function TasksPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    streak: 0,
    achievements: [] as any[],
    chartData: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
      router.refresh();
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('User not found in localStorage');
          setLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        const data = await getUserTaskStats(user.id);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Tasks",
      value: loading ? '--' : stats.total,
      icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
      color: "from-blue-600/20 to-indigo-600/20",
      accent: "bg-blue-400",
      description: "Across all projects"
    },
    {
      title: "Completed",
      value: loading ? '--' : stats.completed,
      icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
      color: "from-emerald-600/20 to-teal-600/20",
      accent: "bg-emerald-400",
      description: "Solid progress"
    },
    {
      title: "Current Streak",
      value: loading ? '--' : stats.streak,
      icon: <Flame className="h-6 w-6 text-orange-400" />,
      color: "from-orange-600/20 to-red-600/20",
      accent: "bg-orange-400",
      description: "Days in a row"
    },
    {
      title: "Success Rate",
      value: loading ? '--' : `${Math.round(stats.completionRate)}%`,
      icon: <Target className="h-6 w-6 text-purple-400" />,
      color: "from-purple-600/20 to-fuchsia-600/20",
      accent: "bg-purple-400",
      description: "Efficiency score"
    }
  ];

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Star': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'Zap': return <Zap className="h-5 w-5 text-blue-400" />;
      case 'Trophy': return <Trophy className="h-5 w-5 text-amber-500" />;
      case 'Flame': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'Award': return <Award className="h-5 w-5 text-purple-400" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        </div>

        <DesignerHeader>
          <div className="hidden sm:flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <Flame className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-sm font-bold text-orange-100">{stats.streak} DAY STREAK</span>
          </div>
        </DesignerHeader>

        <main className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Section: Welcome & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Task Dashboard</h1>
                <p className="text-slate-400 text-lg font-medium">Powering your productivity through geometric intelligence.</p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:bg-slate-100 transition-all flex items-center justify-center group"
              >
                <Plus className="h-6 w-6 mr-2 transition-transform group-hover:rotate-90" />
                NEW TASK
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border-white/5 backdrop-blur-3xl group shadow-2xl`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.accent}/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5 backdrop-blur-md">
                          {stat.icon}
                        </div>
                        <div className={`h-1.5 w-12 rounded-full ${stat.accent}/30 overflow-hidden`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`h-full ${stat.accent}`}
                          />
                        </div>
                      </div>
                      <h3 className="text-4xl font-black text-white mb-1 tracking-tighter">{stat.value}</h3>
                      <p className="text-sm font-bold text-white/50 uppercase tracking-widest leading-none mb-1">{stat.title}</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Feed: Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                    TASKS
                  </h2>
                </div>
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl">
                  <CardContent className="p-8">
                    <TaskList />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar: Analytics & Achievements */}
              <div className="space-y-8">
                {/* Productivity Chart Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-white tracking-tight uppercase">Performance</h3>
                        <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black rounded-full border border-green-500/20">LIVE PULSE</div>
                      </div>

                      <div className="flex items-end justify-between h-32 gap-3 mb-6 px-2">
                        {stats.chartData.map((data: any, i: number) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <div className="relative w-full flex flex-col justify-end h-full">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(10, (data.count / (Math.max(...stats.chartData.map((d: any) => d.count)) || 1)) * 100)}%` }}
                                transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.8 + i * 0.05 }}
                                className={`w-full rounded-t-lg transition-all border-t border-white/20 ${data.isToday
                                  ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                                  : 'bg-white/10 group-hover:bg-white/20'
                                  }`}
                              />
                            </div>
                            <span className={`text-[10px] font-black uppercase ${data.isToday ? 'text-indigo-400' : 'text-white/20'}`}>{data.date}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Avg Productivity</span>
                          <span className="text-white font-black">{stats.completionRate}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.completionRate}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Achievements List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-white tracking-tight uppercase">Trophies</h3>
                        <Trophy className="h-5 w-5 text-amber-500" />
                      </div>

                      <div className="space-y-6">
                        {stats.achievements.length > 0 ? (
                          stats.achievements.map((achievement: any, i: number) => (
                            <div key={achievement.id} className="group relative">
                              <div className="flex items-center gap-4 mb-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${achievement.unlocked
                                  ? 'bg-indigo-500/20 border-indigo-500/30 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                  : 'bg-white/5 border-white/5 opacity-40'
                                  }`}>
                                  {getAchievementIcon(achievement.icon)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className={`text-sm font-black tracking-tight ${achievement.unlocked ? 'text-white' : 'text-white/40'}`}>
                                      {achievement.title}
                                    </h4>
                                    {achievement.unlocked && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                                  </div>
                                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter leading-none mt-0.5">{achievement.description}</p>
                                </div>
                              </div>
                              <div className="pl-14">
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${achievement.progress}%` }}
                                    className={`h-full ${achievement.unlocked ? 'bg-indigo-500' : 'bg-white/20'}`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-white/20 font-black uppercase text-xs">No Data Synchronized</div>
                        )}
                      </div>

                      <button className="mt-8 w-full group py-4 hover:bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center gap-2 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Expand Records</span>
                        <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-white group-hover:translate-x-0.5" />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Create Modal Override */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                onClick={() => setShowCreateModal(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-3xl p-1 overflow-hidden"
              >
                <div className="p-8 pb-4 flex justify-between items-center bg-black/40">
                  <h3 className="text-2xl font-black text-white tracking-tight">NEW TASK</h3>
                  <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="h-6 w-6 text-white/40" />
                  </button>
                </div>
                <div className="p-8 pt-4">
                  <TaskForm
                    onCancel={() => setShowCreateModal(false)}
                    onSuccess={() => {
                      setShowCreateModal(false);
                      window.location.reload();
                    }}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}