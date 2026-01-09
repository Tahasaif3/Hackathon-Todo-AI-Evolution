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
  ListTodo
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getTasks, getProjects, getProjectProgress, createProject } from '@/lib/api';
import { Task, Project } from '@/lib/types';
import { ProjectForm } from '@/components/ProjectForm';

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
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
      router.refresh();
    }
  };

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id;
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
          return null;
        }
      }
    }
    return null;
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Fetch tasks
      const tasksData = await getTasks(userId);
      setTasks(tasksData);

      // Fetch projects
      const projectsData = await getProjects(userId);
      setProjects(projectsData);

      // Fetch progress for each project
      const progressData: Record<string, any> = {};
      for (const project of projectsData) {
        try {
          const progress = await getProjectProgress(userId, project.id);
          progressData[project.id] = progress;
        } catch (err) {
          console.error(`Error fetching progress for project ${project.id}:`, err);
          progressData[project.id] = { total_tasks: 0, completed_tasks: 0, pending_tasks: 0, progress: 0 };
        }
      }
      setProjectProgress(progressData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle project creation
  const handleCreateProject = async () => {
    setShowCreateModal(false);
    await fetchData(); // Refresh all data
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const activeProjects = projects.length;
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.completed) return false;
    return new Date(task.due_date) < new Date();
  }).length;

  // Calculate weekly task completion trend
  const getWeeklyTrend = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyTasks = tasks.filter(task => {
      if (!task.completed || !task.updated_at) return false;
      const completedDate = new Date(task.updated_at);
      return completedDate >= weekAgo && completedDate <= today;
    });
    
    return weeklyTasks.length;
  };

  const weeklyCompleted = getWeeklyTrend();

  // Get top projects by progress
  const topProjects = [...projects]
    .map(project => ({
      ...project,
      progress: projectProgress[project.id]?.progress || 0
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  // Productivity score calculation
  const productivityScore = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100 + (weeklyCompleted / 10))) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <div className=" w-8 h-8 rounded-lg flex items-center justify-center">
                    <ListTodo className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/tasks" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link href="/projects" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <FolderOpen className="h-4 w-4 mr-1" />
                  Projects
                </Link>
                <Link href="/calendar" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Calendar
                </Link>
                <Link href="/analytics" className="text-indigo-400 font-medium flex items-center">
                  <PieChart className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/profile')} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center">
                <User className="h-5 w-5 text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with enhanced animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analytics Dashboard
              </motion.h1>
              <motion.p 
                className="mt-2 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Track your productivity and project progress
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all flex items-center group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Project
            </motion.button>
          </div>
        </motion.div>

        {/* Productivity Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-3 bg-indigo-500/20 rounded-xl mr-4">
                    <Award className="h-8 w-8 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Productivity Score</h3>
                    <p className="text-sm text-gray-500">Based on your task completion rate</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-bold text-white">{productivityScore}<span className="text-2xl text-gray-400">/100</span></div>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-700 rounded-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${productivityScore}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards with enhanced animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-indigo-500/50 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    >
                      {totalTasks}
                    </motion.p>
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Zap className="h-4 w-4 mr-1 text-indigo-400" />
                  <span>{weeklyCompleted} completed this week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-green-500/50 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Completed</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                    >
                      {completedTasks}
                    </motion.p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Completion Rate</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-yellow-500/50 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Pending</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                    >
                      {pendingTasks}
                    </motion.p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{overdueTasks} overdue tasks</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Projects</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                    >
                      {activeProjects}
                    </motion.p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 mr-1 text-purple-400" />
                  <span>{topProjects.length > 0 ? `${Math.max(...topProjects.map(p => p.progress))}%` : '0%'} max progress</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts and Progress with enhanced animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity with enhanced visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="text-center mb-6">
                    <motion.div 
                      className="text-5xl font-bold text-white mb-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      {weeklyCompleted}
                    </motion.div>
                    <p className="text-gray-400">Tasks completed this week</p>
                  </div>
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>0</span>
                      <span>Goal: 20</span>
                      <span>20+</span>
                    </div>
                    <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (weeklyCompleted / 20) * 100)}%` }}
                        transition={{ duration: 1.5, delay: 1 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    className="mt-6 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {weeklyCompleted >= 20 ? (
                      <span className="text-green-400 flex items-center justify-center">
                        <Award className="h-4 w-4 mr-1" /> Goal achieved! Great job!
                      </span>
                    ) : (
                      <span>
                        {20 - weeklyCompleted} more tasks to reach your weekly goal
                      </span>
                    )}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Projects with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-indigo-400" />
                    Top Projects
                  </span>
                  <span className="text-sm font-normal text-gray-400">
                    {activeProjects} active
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProjects.length > 0 ? (
                    topProjects.map((project, index) => (
                      <motion.div 
                        key={project.id} 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 truncate max-w-[120px]">{project.name}</span>
                          <span className="text-gray-400">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className="h-2 rounded-full"
                            style={{ 
                              background: `linear-gradient(to right, ${project.color || '#3b82f6'}, ${project.color || '#3b82f6'})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <FolderPlus className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No projects yet</p>
                      <motion.button 
                        onClick={() => setShowCreateModal(true)}
                        className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create your first project
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats with enhanced design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-red-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-500/20 rounded-lg mr-4">
                    <Calendar className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Overdue Tasks</p>
                    <motion.p 
                      className="text-2xl font-bold text-white mt-1"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
                    >
                      {overdueTasks}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-blue-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                    <FolderOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Projects</p>
                    <motion.p 
                      className="text-2xl font-bold text-white mt-1"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
                    >
                      {activeProjects}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-green-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Avg. Completion</p>
                    <motion.p 
                      className="text-2xl font-bold text-white mt-1"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.3, type: "spring", stiffness: 300 }}
                    >
                      {completionRate}%
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">Create New Project</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <ProjectForm
                  onCancel={() => setShowCreateModal(false)}
                  onSuccess={handleCreateProject}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}