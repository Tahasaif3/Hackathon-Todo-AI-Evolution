'use client';

import { useState, useEffect } from 'react';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { Task } from '@/lib/types';
import { getTasks } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Get user ID from localStorage (in a real app, this would come from auth context)
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const userId = getUserId();
    console.log('Fetching tasks for user ID:', userId);
    
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tasksData = await getTasks(userId);
      console.log('Tasks fetched successfully:', tasksData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search term and filter status
  const filteredTasks = tasks.filter(task => {
    // Apply search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply status filter
    let matchesFilter = true;
    if (filter === 'active') {
      matchesFilter = !task.completed;
    } else if (filter === 'completed') {
      matchesFilter = task.completed;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Separate completed and incomplete tasks
  const completedTasks = filteredTasks.filter(task => task.completed);
  const incompleteTasks = filteredTasks.filter(task => !task.completed);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded"></div>
              <div className="h-3 bg-gray-800 rounded w-5/6"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState onTaskCreated={fetchTasks} />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</span>
        <div className="flex gap-4">
          <span>{incompleteTasks.length} pending</span>
          <span>{completedTasks.length} completed</span>
        </div>
      </div>

      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && filter !== 'completed' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Pending Tasks
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {incompleteTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TaskItem
                    task={task}
                    onTaskUpdated={fetchTasks}
                    onTaskDeleted={fetchTasks}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && filter !== 'active' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Completed Tasks
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TaskItem
                    task={task}
                    onTaskUpdated={fetchTasks}
                    onTaskDeleted={fetchTasks}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* No tasks message when filters return empty results */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-800">
            <Search className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">No tasks found</h3>
          <p className="mt-2 text-sm text-gray-400">
            {searchTerm ? 'Try adjusting your search terms.' : 'Try selecting a different filter.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}