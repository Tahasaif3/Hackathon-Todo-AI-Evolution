'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  FolderOpen,
  BarChart3,
  Clock,
  Plus,
  PieChart,
  User,
  LogOut,
  Edit,
  Trash2,
  X,
  TrendingUp,
  Target,
  ListTodo,
  MessageSquare,
  Calendar as CalendarIcon,
  Bell,
  Search,
  LayoutGrid,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import DesignerHeader from '@/components/DesignerHeader';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getProjects, getProjectProgress, deleteProject } from '@/lib/api';
import { Project } from '@/lib/types';
import { ProjectForm } from '@/components/ProjectForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectProgress, setProjectProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      if (!userId) {
        router.push('/login');
        return;
      }

      const projectsData = await getProjects(userId);
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
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const userId = getUserId();
      if (!userId) return;
      setDeletingProjectId(projectId);
      await deleteProject(userId, projectId);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filter === 'all') return matchesSearch;
    const progress = projectProgress[project.id] || { progress: 0 };
    if (filter === 'active') return matchesSearch && progress.progress < 100;
    if (filter === 'completed') return matchesSearch && progress.progress === 100;
    return matchesSearch;
  });

  const totalProjects = projects.length;
  const completedProjects = projects.filter(project => (projectProgress[project.id]?.progress || 0) === 100).length;
  const activeProjects = totalProjects - completedProjects;

  if (loading && projects.length === 0) {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Cluster Grid</h1>
                <p className="text-slate-400 text-lg font-medium opacity-60">Architecting complex project structures.</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-slate-100 transition-all flex items-center group"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                NEW CLUSTER
              </motion.button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'TOTAL NODES', value: totalProjects, icon: FolderOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { label: 'ACTIVE VECTORS', value: activeProjects, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'SYNCHRONIZED', value: completedProjects, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="Scan project registry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                />
              </div>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => {
                  const progress = projectProgress[project.id] || { progress: 0, total_tasks: 0 };
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 rounded-[40px] overflow-hidden transition-all duration-500 h-[420px] shadow-2xl bg-gradient-to-b from-white/[0.03] to-transparent">
                        <div className="p-8 h-full flex flex-col">
                          {/* Accent Line */}
                          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: project.color || '#6366f1' }} />

                          <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}>
                              <FolderOpen className="w-8 h-8" style={{ color: project.color }} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingProject(project); setShowEditModal(true); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => { if (confirm('Purge cluster?')) handleDeleteProject(project.id); }} className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>

                          <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{project.name}</h3>
                          <p className="text-sm text-white/30 font-medium mb-8 flex-1 line-clamp-3 leading-relaxed">{project.description || 'No contextual data provided for this cluster node.'}</p>

                          <div className="mt-auto space-y-6">
                            <div className="space-y-2">
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronization Pulse</span>
                                <span className="text-lg font-black text-white">{progress.progress}%</span>
                              </div>
                              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress.progress}%` }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: project.color || '#6366f1' }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-white/20 uppercase mb-1">DATA NODES</span>
                                  <span className="text-sm font-black text-white">{progress.total_tasks}</span>
                                </div>
                                <div className="flex flex-col border-l border-white/5 pl-4">
                                  <span className="text-[8px] font-black text-white/20 uppercase mb-1">DEADLINE</span>
                                  <span className="text-sm font-black text-white/60">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'INFINITE'}</span>
                                </div>
                              </div>
                              <Link href={`/projects/${project.id}`} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <ChevronRight className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* Initializer Node */}
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full h-[420px] rounded-[40px] border-4 border-dashed border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                      <Plus className="w-10 h-10" />
                    </div>
                    <span className="text-sm font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Initialize New Cluster</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Modals */}
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
                  <ProjectForm onCancel={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchProjects(); }} />
                </div>
              </motion.div>
            </div>
          )}

          {showEditModal && editingProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowEditModal(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-3xl p-1"
              >
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Update Cluster Node</h3>
                  <button onClick={() => setShowEditModal(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <X className="h-6 w-6 text-white/40" />
                  </button>
                </div>
                <div className="p-8 pt-4">
                  <ProjectForm initialProject={editingProject} isEditing={true} onCancel={() => setShowEditModal(false)} onSuccess={() => { setShowEditModal(false); fetchProjects(); }} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
