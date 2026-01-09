'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Circle, 
  Clock, 
  MapPin,
  Plus,
  CheckCircle,
  FolderOpen,
  PieChart,
  User,
  LogOut,
  Edit,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Flag,
  ListTodo
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getTasks, createTask, updateTask, deleteTask, getProjects } from '@/lib/api';
import { Task, Project } from '@/lib/types';
import { TaskForm } from '@/components/TaskForm';

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

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

  // Fetch tasks and projects
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
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle task creation
  const handleCreateTask = async () => {
    setShowCreateModal(false);
    await fetchData(); // Refresh the data
  };

  // Handle task update
  const handleUpdateTask = async () => {
    setShowEditModal(false);
    setEditingTask(null);
    await fetchData(); // Refresh the data
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: number) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      setDeletingTaskId(taskId);
      await deleteTask(userId, taskId);
      await fetchData(); // Refresh the data
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task. Please try again later.');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time difference
  const formatTimeDifference = (dueDate: Date) => {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    
    // If task is overdue
    if (diffMs < 0) {
      const overdueMs = Math.abs(diffMs);
      const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
      const overdueMinutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (overdueHours > 0) {
        return `Overdue ${overdueHours}h ${overdueMinutes}m`;
      } else {
        return `Overdue ${overdueMinutes}m`;
      }
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return 'Due now';
    }
  };

  // Get time difference style
  const getTimeDifferenceStyle = (dueDate: Date) => {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    
    // If task is overdue
    if (diffMs < 0) {
      return 'overdue';
    }
    
    // If due in less than 1 hour
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
      return 'urgent';
    }
    
    // If due in less than 3 hours
    if (diffMinutes < 180) {
      return 'warning';
    }
    
    return 'normal';
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = prevMonthDays - firstDayOfMonth + 1; i <= prevMonthDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      try {
        // Parse the due_date string to a Date object
        const dueDate = new Date(task.due_date);
        // Compare only the date parts (ignore time)
        return dueDate.getFullYear() === date.getFullYear() &&
               dueDate.getMonth() === date.getMonth() &&
               dueDate.getDate() === date.getDate();
      } catch (e) {
        console.error('Error parsing due_date:', task.due_date, e);
        return false;
      }
    });
  };

  // Get project by ID
  const getProjectById = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  // Get tasks for the selected date
  const selectedDateTasks = getTasksForDate(selectedDate);

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
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
                <Link href="/calendar" className="text-indigo-400 font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Calendar
                </Link>
                <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <PieChart className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/profile')}
               className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
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
        {/* Header */}
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
                Calendar
              </motion.h1>
              <motion.p 
                className="mt-2 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Plan and organize your schedule
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all flex items-center group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Event
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:w-2/3"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-xl font-semibold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {monthName}
                  </motion.h2>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={prevMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </motion.button>
                    <motion.button 
                      onClick={() => {
                        // Reset to current month
                        setCurrentDate(new Date());
                        setSelectedDate(new Date());
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Today
                    </motion.button>
                    <motion.button 
                      onClick={nextMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isSelected = day.date.toDateString() === selectedDate.toDateString();
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    const dayTasks = getTasksForDate(day.date);
                    const hasTasks = dayTasks.length > 0;

                    // Group tasks by project
                    const tasksByProject: Record<string, Task[]> = {};
                    dayTasks.forEach(task => {
                      const projectId = task.project_id || 'no-project';
                      if (!tasksByProject[projectId]) {
                        tasksByProject[projectId] = [];
                      }
                      tasksByProject[projectId].push(task);
                    });

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          min-h-24 p-2 rounded-lg border cursor-pointer transition-all
                          ${isSelected 
                            ? 'bg-indigo-500/20 border-indigo-500' 
                            : isToday
                              ? 'bg-indigo-500/10 border-indigo-500/50'
                              : day.isCurrentMonth
                                ? 'border-gray-800 hover:bg-gray-800/50'
                                : 'border-gray-800/50 text-gray-600 hover:bg-gray-800/30'
                          }
                        `}
                      >
                        <div className="flex justify-between">
                          <span className={`
                            text-sm font-medium
                            ${isToday ? 'text-indigo-400' : 'text-gray-300'}
                          `}>
                            {day.day}
                          </span>
                          {hasTasks && (
                            <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              {dayTasks.length}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {Object.entries(tasksByProject).slice(0, 2).map(([projectId, projectTasks]) => {
                            const project = projectId !== 'no-project' ? getProjectById(projectId) : null;
                            return (
                              <div key={projectId} className="flex items-center">
                                {project && (
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1" 
                                    style={{ backgroundColor: project.color || '#3b82f6' }}
                                  />
                                )}
                                <div 
                                  className={`${projectTasks[0].completed ? 'bg-green-500' : project ? 'bg-blue-500' : 'bg-gray-500'} text-white text-xs rounded px-1 py-0.5 truncate flex-1`}
                                >
                                  {projectTasks[0].title}
                                </div>
                              </div>
                            );
                          })}
                          {Object.keys(tasksByProject).length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{Object.keys(tasksByProject).length - 2} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Events Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-1/3"
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 sticky top-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </h3>
                    <p className="text-3xl font-light text-gray-300 mt-1">
                      {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </motion.div>
                  <motion.div 
                    className="text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Current Time</div>
                    <div className="text-2xl font-mono font-light text-white">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                </div>
                
                {selectedDateTasks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateTasks.map((task, index) => {
                      const project = task.project_id ? getProjectById(task.project_id) : null;
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className={`rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
                            task.due_date && isToday(new Date(task.due_date)) && new Date(task.due_date).getTime() < new Date().getTime()
                              ? 'bg-gradient-to-r from-red-900/30 to-red-900/10 border-red-700/50'
                              : 'bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-gray-700/50'
                          }`}
                        >
                          {/* Task header with status indicator */}
                          <div className="flex items-start p-4 pb-3">
                            <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                              task.completed 
                                ? 'bg-green-500' 
                                : task.due_date && isToday(new Date(task.due_date)) && new Date(task.due_date).getTime() < new Date().getTime()
                                  ? 'bg-red-500 animate-pulse'
                                  : 'bg-blue-500'
                            }`} />
                            
                            <div className="flex-1 ml-3">
                              <h4 className={`font-semibold text-base ${
                                task.due_date && isToday(new Date(task.due_date)) && new Date(task.due_date).getTime() < new Date().getTime()
                                  ? 'text-red-300'
                                  : task.completed
                                    ? 'text-gray-400 line-through'
                                    : 'text-white'
                              }`}>
                                {task.title}
                              </h4>
                              
                              {task.description && (
                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{task.description}</p>
                              )}
                            </div>
                            
                            <div className="flex space-x-1 ml-2">
                              <motion.button 
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowEditModal(true);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30 rounded-full transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this task?')) {
                                    handleDeleteTask(task.id);
                                  }
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={deletingTaskId === task.id}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-full transition-colors disabled:opacity-50"
                              >
                                {deletingTaskId === task.id ? (
                                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Task details footer */}
                          <div className="px-4 pb-4 pt-2 border-t border-gray-700/30">
                            <div className="flex flex-wrap items-center gap-3">
                              {project && (
                                <div className="flex items-center text-sm text-gray-400">
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full mr-1.5" 
                                    style={{ backgroundColor: project.color || '#3b82f6' }}
                                  />
                                  <span className="truncate max-w-[120px]">{project.name}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="h-4 w-4 mr-1.5" />
                                <span>
                                  {task.due_date 
                                    ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'No time set'}
                                </span>
                              </div>
                              
                              {task.due_date && isToday(new Date(task.due_date)) && (
                                <div className="flex items-center">
                                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${{
                                    overdue: 'bg-red-900/50 text-red-300 animate-pulse',
                                    urgent: 'bg-orange-900/50 text-orange-300',
                                    warning: 'bg-yellow-900/50 text-yellow-300',
                                    normal: 'bg-indigo-900/50 text-indigo-300'
                                  }[getTimeDifferenceStyle(new Date(task.due_date))]}`}>
                                    {formatTimeDifference(new Date(task.due_date))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Circle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No tasks scheduled</p>
                    <p className="text-sm text-gray-500 mt-1">Enjoy your free day!</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Create Task
                    </motion.button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Create Task Modal */}
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
                <h3 className="text-lg font-semibold text-white">Create New Task</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <TaskForm
                  onCancel={() => setShowCreateModal(false)}
                  onSuccess={handleCreateTask}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {showEditModal && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">Edit Task</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <TaskForm
                  initialTask={editingTask}
                  isEditing={true}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                  }}
                  onSuccess={handleUpdateTask}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}