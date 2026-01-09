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
  Target,
  Award,
  Zap,
  Flame,
  Trophy,
  Star,
  X,
  FolderOpen,
  PieChart,
  ListTodo,
  LogOut
} from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
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

  // Fetch real stats data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Get user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('User not found in localStorage');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.id;

        // Fetch task stats for the user
        const statsData = await getUserTaskStats(userId);
        
        setStats(statsData);
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
      color: "bg-blue-500/20",
      change: "+2 this week"
    },
    {
      title: "Completed",
      value: loading ? '--' : stats.completed,
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      color: "bg-green-500/20",
      change: "85% on track"
    },
    {
      title: "Pending",
      value: loading ? '--' : stats.pending,
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
      color: "bg-yellow-500/20",
      change: "Due soon"
    },
    {
      title: "Completion Rate",
      value: loading ? '--' : `${stats.completionRate}%`,
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      color: "bg-purple-500/20",
      change: "+5% from last week"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900/80 to-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 flex items-center">
                 <div className=" w-8 h-8 rounded-lg flex items-center justify-center">
                    <ListTodo className="h-5 w-5 text-white" />
                </div>
                  <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
                </div>
                <nav className="hidden md:flex space-x-1">
                  <Link href="/tasks" className="px-4 py-2 text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link href="/projects" className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Projects
                  </Link>
                  <Link href="/calendar" className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Link>
                  <Link href="/analytics" className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30">
                    <PieChart className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push('/profile')}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
                >
                  <User className="h-5 w-5 text-gray-300" />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
                  <p className="text-gray-400 max-w-2xl">Here's what's happening with your tasks today. Stay productive and keep track of your progress.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all flex items-center group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  New Task
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                          <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                          <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.color} shadow-lg`}>
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Overview Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Productivity Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Productivity Score Card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-gray-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Productivity Score</h3>
                      <Flame className="h-7 w-7 text-orange-400" />
                    </div>
                    
                    <div className="flex items-center justify-center my-8">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-full border-8 border-gray-800 flex items-center justify-center shadow-inner">
                          <span className="text-4xl font-bold text-white">{loading ? '--' : stats.completionRate}%</span>
                        </div>
                        <div 
                          className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin-slow"
                          style={{ animationDuration: '3s' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-300 text-base mb-3">Keep up the great work!</p>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-gray-600" />
                        <Star className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Achievements */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-green-900/50 to-teal-900/50 border border-gray-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Recent Achievements</h3>
                      <Trophy className="h-7 w-7 text-yellow-400" />
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="mt-1 w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium">First Task Completed</p>
                          <p className="text-gray-400 text-sm">Today</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium">5 Tasks Completed</p>
                          <p className="text-gray-400 text-sm">This Week</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="mt-1 w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium">Streak: 3 Days</p>
                          <p className="text-gray-400 text-sm">Current</p>
                        </div>
                      </div>
                    </div>
                    
                    <button className="mt-6 w-full py-3 text-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors rounded-lg border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800/30">
                      View All Achievements
                    </button>
                  </CardContent>
                </Card>
                
                {/* Focus Insights */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-gray-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Focus Insights</h3>
                      <Zap className="h-7 w-7 text-yellow-400" />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-800/30 p-4 rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Morning Peak</span>
                          <span className="text-white font-medium">9:00 AM - 11:00 AM</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 p-4 rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Evening Focus</span>
                          <span className="text-white font-medium">7:00 PM - 9:00 PM</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div className="bg-orange-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-xl border border-gray-700/50">
                        <p className="text-gray-300 text-sm mb-1">Recommended Focus Time</p>
                        <p className="text-white font-bold">Tomorrow: 9:30 AM - 10:30 AM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Task List Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
              </div>
              
              <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <TaskList />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        {/* Task Creation Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white">Create New Task</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                <div className="p-6">
                  <TaskForm
                    onCancel={() => setShowCreateModal(false)}
                    onSuccess={() => {
                      setShowCreateModal(false);
                      // Refresh the task list and stats
                      window.location.reload();
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}