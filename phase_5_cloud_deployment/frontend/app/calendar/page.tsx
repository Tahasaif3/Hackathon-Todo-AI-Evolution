'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
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
  ListTodo,
  MessageSquare,
  BarChart3,
  Search,
  LayoutGrid,
  Bell,
  MoreVertical
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getTasks, deleteTask, getProjects } from '@/lib/api';
import { Task, Project } from '@/lib/types';
import { TaskForm } from '@/components/TaskForm';
import ProtectedRoute from '@/components/ProtectedRoute';

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
      if (!userId) {
        router.push('/login');
        return;
      }
      const [tasksData, projectsData] = await Promise.all([
        getTasks(userId),
        getProjects(userId)
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDeleteTask = async (taskId: number) => {
    try {
      const userId = getUserId();
      if (!userId) return;
      setDeletingTaskId(taskId);
      await deleteTask(userId, taskId);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const calendarDays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    return days;
  })();

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const d = new Date(task.due_date);
      return d.toDateString() === date.toDateString();
    });
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  const selectedDateTasks = getTasksForDate(selectedDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
        {/* Cinematic Backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <DesignerHeader />

        <main className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">TaskFlow Calendar Interface</h1>
                <p className="text-slate-400 text-lg font-medium opacity-60">Organizing your tasks and projects.</p>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button className="p-2 bg-white/10 rounded-lg text-white"><LayoutGrid className="h-4 w-4" /></button>
                  <button className="p-2 text-slate-500 hover:text-slate-300"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all flex items-center group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  NEW EVENT
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Calendar Grid Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-8"
              >
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl">
                  <CardContent className="p-8">
                    {/* Inner Calendar Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-white tracking-tight">{monthName}</h2>
                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20 tracking-widest uppercase">SYD: UTC+10</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-white/5 rounded-xl border border-white/5 transition-colors"><ChevronLeft className="h-5 w-5 text-white/40" /></button>
                        <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors">Today</button>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-white/5 rounded-xl border border-white/5 transition-colors"><ChevronRight className="h-5 w-5 text-white/40" /></button>
                      </div>
                    </div>

                    {/* Weekdays Label */}
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-white/20 tracking-[0.2em]">{d}</div>
                      ))}
                    </div>

                    {/* Actual Grid */}
                    <div className="grid grid-cols-7 gap-3">
                      {calendarDays.map((day, i) => {
                        const isSelected = day.date.toDateString() === selectedDate.toDateString();
                        const isToday = day.date.toDateString() === new Date().toDateString();
                        const dayTasks = getTasksForDate(day.date);

                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedDate(day.date)}
                            className={`relative aspect-square p-2 rounded-2xl border transition-all cursor-pointer group flex flex-col items-center justify-center ${isSelected
                              ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]'
                              : isToday
                                ? 'bg-white/5 border-indigo-500/50'
                                : day.isCurrentMonth
                                  ? 'bg-white/[0.03] border-white/5 hover:border-white/20'
                                  : 'opacity-10 pointer-events-none'
                              }`}
                          >
                            <span className={`text-lg font-black ${isSelected ? 'text-white' : isToday ? 'text-indigo-400' : 'text-white/60 group-hover:text-white'}`}>
                              {day.day}
                            </span>
                            {dayTasks.length > 0 && !isSelected && (
                              <div className="absolute bottom-3 flex gap-0.5">
                                {dayTasks.slice(0, 3).map((_, idx) => (
                                  <div key={idx} className="w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                                ))}
                                {dayTasks.length > 3 && <div className="w-1 h-1 rounded-full bg-white/20" />}
                              </div>
                            )}
                            {isSelected && (
                              <motion.div layoutId="activeDay" className="absolute inset-0 rounded-2xl border-2 border-white/40 pointer-events-none" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar: Selected Date Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-4"
              >
                <div className="sticky top-28 space-y-8">
                  {/* Digital Clock & Date Card */}
                  <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                    <CardContent className="p-10">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-sm font-black text-indigo-400 tracking-[0.2em] mb-4 uppercase">System Epoch</div>
                        <div className="text-6xl font-black text-white tracking-tighter mb-2">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          <span className="text-2xl text-white/20 ml-2">{currentTime.getSeconds().toString().padStart(2, '0')}</span>
                        </div>
                        <div className="text-xl font-bold text-white/60 mb-8 tracking-tight">
                          {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>

                        <div className="grid grid-cols-2 w-full gap-4">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">ALLOCATED</div>
                            <div className="text-2xl font-black text-white">{selectedDateTasks.length}</div>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase mb-1">PROGRESS</div>
                            <div className="text-2xl font-black text-emerald-400">
                              {selectedDateTasks.length > 0 ? Math.round((selectedDateTasks.filter(t => t.completed).length / selectedDateTasks.length) * 100) : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Operational Feed */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-white/30 tracking-[0.3em] px-4 uppercase">Day Operations</h3>
                    <AnimatePresence mode="popLayout">
                      {selectedDateTasks.length > 0 ? (
                        selectedDateTasks.map((task, idx) => {
                          const project = task.project_id ? getProjectById(task.project_id) : null;
                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-5 transition-all shadow-xl"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {project && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />}
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{project?.name || 'Inert Task'}</span>
                                  </div>
                                  <h4 className={`text-md font-bold leading-tight ${task.completed ? 'text-white/30 line-through' : 'text-white'}`}>{task.title}</h4>
                                  <div className="flex items-center gap-3 mt-3">
                                    <div className="flex items-center text-[10px] font-black text-white/20 group-hover:text-indigo-400 transition-colors">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                                    </div>
                                    {task.completed && <div className="text-[10px] font-black text-emerald-500 uppercase">SYNCHRONIZED</div>}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingTask(task); setShowEditModal(true); }} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
                                  <button onClick={() => { if (confirm('Purge task node?')) handleDeleteTask(task.id); }} className="p-2 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white/[0.01] border border-dashed border-white/5 rounded-3xl p-10 text-center"
                        >
                          <Circle className="h-8 w-8 text-white/10 mx-auto mb-4" />
                          <p className="text-xs font-black text-white/20 uppercase tracking-widest">No Active Vectors Found</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Create Event Modal */}
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
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Event Initialization</h3>
                  <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="h-6 w-6 text-white/40" />
                  </button>
                </div>
                <div className="p-8 pt-4">
                  <TaskForm onCancel={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchData(); }} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Event Modal */}
        <AnimatePresence>
          {showEditModal && editingTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowEditModal(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-3xl p-1"
              >
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Update Chrono-Node</h3>
                  <button onClick={() => setShowEditModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="h-6 w-6 text-white/40" />
                  </button>
                </div>
                <div className="p-8 pt-4">
                  {/* Reusing TaskForm for edit here since it should handle it */}
                  <div className="text-white/40 text-xs italic mb-4">Editing node ID: {editingTask.id}</div>
                  <TaskForm initialTask={editingTask} isEditing={true} onCancel={() => setShowEditModal(false)} onSuccess={() => { setShowEditModal(false); fetchData(); }} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}