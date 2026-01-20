'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Clock,
  ChevronLeft,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  TrendingUp,
  ListTodo,
  Target
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getProject, getProjectTasks, getProjectProgress, deleteProject } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      if (!userId) {
        router.push('/login');
        return;
      }

      const [projectData, tasksData, progressData] = await Promise.all([
        getProject(userId, projectId),
        getProjectTasks(userId, projectId).catch(err => {
          console.error('Error fetching project tasks:', err);
          return []; // Return empty array if tasks fail to load
        }),
        getProjectProgress(userId, projectId)
      ]);

      setProject(projectData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProgress(progressData);
      
      console.log('Project data loaded:', { project: projectData, tasksCount: tasksData.length, progress: progressData });
    } catch (err: any) {
      console.error('Error fetching project data:', err);
      setError(err.message || 'Failed to load project.');
      if (err.message?.includes('not found')) {
        router.push('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const userId = getUserId();
      if (!userId) return;
      
      await deleteProject(userId, projectId);
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

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

  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#020617] text-slate-200">
          <DesignerHeader />
          <main className="relative py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <h1 className="text-4xl font-black text-white mb-4">Project Not Found</h1>
                <p className="text-slate-400 mb-8">{error || 'The project you are looking for does not exist.'}</p>
                <Link href="/projects" className="inline-flex items-center px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all">
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back to Projects
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const completedTasks = (tasks || []).filter(t => t.completed).length;
  const pendingTasks = (tasks || []).filter(t => !t.completed).length;

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
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <Link 
                href="/projects" 
                className="inline-flex items-center text-white/40 hover:text-white mb-6 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Cluster Grid</span>
              </Link>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}
                    >
                      <FolderOpen className="w-8 h-8" style={{ color: project.color }} />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">{project.name}</h1>
                      <div className="h-1 w-24 rounded-full" style={{ backgroundColor: project.color || '#6366f1' }} />
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-lg text-white/60 font-medium leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteProject}
                    disabled={deleting}
                    className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all flex items-center text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  label: 'Progress', 
                  value: `${progress?.progress || 0}%`, 
                  icon: TrendingUp, 
                  color: 'text-indigo-400', 
                  bg: 'bg-indigo-500/10' 
                },
                { 
                  label: 'Total Tasks', 
                  value: (tasks || []).length, 
                  icon: ListTodo, 
                  color: 'text-emerald-400', 
                  bg: 'bg-emerald-500/10' 
                },
                { 
                  label: 'Completed', 
                  value: completedTasks, 
                  icon: CheckCircle2, 
                  color: 'text-purple-400', 
                  bg: 'bg-purple-500/10' 
                },
                { 
                  label: 'Pending', 
                  value: pendingTasks, 
                  icon: Target, 
                  color: 'text-yellow-400', 
                  bg: 'bg-yellow-500/10' 
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                      <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            {progress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-8 mb-12"
              >
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronization Pulse</span>
                  <span className="text-2xl font-black text-white">{progress.progress}%</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: project.color || '#6366f1' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CalendarIcon className="w-5 h-5 text-white/40" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Deadline</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No deadline set'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-white/40" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Created</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {new Date(project.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </motion.div>
            </div>

            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">Your Tasks</h2>
                <Link
                  href={`/tasks?project=${projectId}`}
                  className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all flex items-center"
                >
                  View All Tasks
                </Link>
              </div>

              {(tasks || []).length === 0 ? (
                <Card className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-12 text-center">
                  <ListTodo className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase">No Data Nodes</h3>
                  <p className="text-white/40 mb-6">This project doesn't have any tasks yet.</p>
                  <Link
                    href={`/tasks?project=${projectId}`}
                    className="inline-flex items-center px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all"
                  >
                    Create First Task
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {(tasks || []).slice(0, 6).map((task, idx) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-3xl p-6 hover:border-white/20 transition-all h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.completed ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                              {task.completed ? (
                                <CheckCircle2 className={`w-5 h-5 ${task.completed ? 'text-emerald-400' : 'text-white/40'}`} />
                              ) : (
                                <Circle className="w-5 h-5 text-white/40" />
                              )}
                            </div>
                          </div>
                          <h3 className={`text-lg font-black text-white mb-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-white/40 mb-4 line-clamp-2">{task.description}</p>
                          )}
                          {task.due_date && (
                            <div className="flex items-center gap-2 text-xs text-white/30">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

