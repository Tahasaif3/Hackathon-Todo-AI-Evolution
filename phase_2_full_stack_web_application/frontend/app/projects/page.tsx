'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, 
  FolderOpen, 
  Calendar, 
  BarChart3, 
  Users, 
  Clock, 
  MoreVertical,
  Search,
  Filter,
  Plus,
  CheckCircle,
  PieChart,
  User,
  LogOut,
  Edit,
  Trash2,
  X,
  TrendingUp,
  Target,
  ListTodo
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getProjects, getProjectProgress, deleteProject, createProject, updateProject } from '@/lib/api';
import { Project } from '@/lib/types';
import { ProjectForm } from '@/components/ProjectForm';

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

  // Fetch projects and their progress
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

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
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle project creation
  const handleCreateProject = async (project: Project) => {
    setShowCreateModal(false);
    await fetchProjects(); // Refresh the project list
  };

  // Handle project update
  const handleUpdateProject = async (project: Project) => {
    setShowEditModal(false);
    setEditingProject(null);
    await fetchProjects(); // Refresh the project list
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      setDeletingProjectId(projectId);
      await deleteProject(userId, projectId);
      await fetchProjects(); // Refresh the project list
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project. Please try again later.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Filter projects based on search term and filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    
    const progress = projectProgress[project.id] || { progress: 0 };
    if (filter === 'active') return matchesSearch && progress.progress < 100;
    if (filter === 'completed') return matchesSearch && progress.progress === 100;
    
    return matchesSearch;
  });

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(project => {
    const progress = projectProgress[project.id] || { progress: 0 };
    return progress.progress === 100;
  }).length;
  const activeProjects = totalProjects - completedProjects;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-10 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
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
                onClick={fetchProjects}
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
                <ListTodo className="w-6 h-6" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/tasks" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link href="/projects" className="text-indigo-400 font-medium flex items-center">
                  <FolderOpen className="h-4 w-4 mr-1" />
                  Projects
                </Link>
                <Link href="/calendar" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Calendar
                </Link>
                <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <PieChart className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/profile')} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <User className="h-5 w-5 text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
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
                Projects
              </motion.h1>
              <motion.p 
                className="mt-2 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Manage and track all your projects in one place
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

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-indigo-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Projects</p>
                    <p className="text-3xl font-bold text-white mt-2">{totalProjects}</p>
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-green-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Projects</p>
                    <p className="text-3xl font-bold text-white mt-2">{activeProjects}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Completed</p>
                    <p className="text-3xl font-bold text-white mt-2">{completedProjects}</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <motion.button 
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setFilter('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            <motion.button 
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setFilter('active')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Active
            </motion.button>
            <motion.button 
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setFilter('completed')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Completed
            </motion.button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => {
            const progress = projectProgress[project.id] || { total_tasks: 0, completed_tasks: 0, pending_tasks: 0, progress: 0 };
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
              >
                <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: project.color || '#3b82f6' }}
                        >
                          <FolderOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <p className="text-xs text-gray-500">
                            {project.deadline 
                              ? `Due ${new Date(project.deadline).toLocaleDateString()}` 
                              : 'No deadline'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                            setShowEditModal(true);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this project?')) {
                              handleDeleteProject(project.id);
                            }
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={deletingProjectId === project.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingProjectId === project.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mt-4 line-clamp-2 flex-1">
                      {project.description || 'No description provided'}
                    </p>
                    
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="h-2 rounded-full"
                          style={{ backgroundColor: project.color || '#3b82f6' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.progress}%` }}
                          transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          <span>{progress.total_tasks} tasks</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>1 team</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {progress.completed_tasks}/{progress.total_tasks}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          
          {/* Add New Project Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ y: -5 }}
            onClick={() => setShowCreateModal(true)}
          >
            <Card className="bg-gray-900/30 backdrop-blur-xl border-2 border-dashed border-gray-700 hover:border-indigo-500 transition-all duration-300 h-full flex flex-col items-center justify-center p-8 cursor-pointer group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FolderPlus className="h-12 w-12 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-400 group-hover:text-white mt-4 transition-colors">Create New Project</h3>
              <p className="text-gray-500 text-center mt-2 text-sm">Start a new project to organize your tasks and collaborate with your team</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
              >
                Get Started
              </motion.button>
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

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && editingProject && (
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
                <h3 className="text-lg font-semibold text-white">Edit Project</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <ProjectForm
                  initialProject={editingProject}
                  isEditing={true}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                  onSuccess={handleUpdateProject}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}