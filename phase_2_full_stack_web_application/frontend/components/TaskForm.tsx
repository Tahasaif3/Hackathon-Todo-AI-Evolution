'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCreate, TaskUpdate, Project } from '@/lib/types';
import { createTask, updateTask, getProjects } from '@/lib/api';

interface TaskFormProps {
  initialTask?: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSuccess?: (task: any) => void;
}

export function TaskForm({ initialTask, isEditing = false, onCancel, onSuccess }: TaskFormProps = {}) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [completed, setCompleted] = useState(initialTask?.completed || false);
  const [projectId, setProjectId] = useState(initialTask?.project_id || '');
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = getUserId();
        if (!userId) return;
        
        const projectsData = await getProjects(userId);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (title.length > 200) {
      setError('Task title must be 200 characters or less');
      return;
    }

    if (description && description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      let task;
      if (isEditing && initialTask) {
        // Update existing task
        const taskData: TaskUpdate = {
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          completed: completed !== initialTask.completed ? completed : undefined,
          project_id: projectId || undefined,
          due_date: dueDate || undefined
        };
        
        task = await updateTask(userId, initialTask.id, taskData);
      } else {
        // Create new task
        const taskData: TaskCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          completed: completed || false,
          project_id: projectId || undefined,
          due_date: dueDate || undefined
        };
        
        task = await createTask(userId, taskData);
      }

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(task);
      }
    } catch (err: any) {
      setError(err.message || (isEditing ? 'Failed to update task. Please try again.' : 'Failed to create task. Please try again.'));
      console.error('Task form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-900/30 p-4 border border-red-700/50">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <div className="mt-1">
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Task title"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">1-200 characters</p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Task description (optional)"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">Optional, up to 1000 characters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-300 mb-1">
              Project
            </label>
            <select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              disabled={loading}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              disabled={loading}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center">
            <input
              id="completed"
              name="completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-800"
              disabled={loading}
            />
            <label htmlFor="completed" className="ml-2 block text-sm text-gray-300">
              Mark as completed
            </label>
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? (isEditing ? 'Updating...' : 'Create Task') : isEditing ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel || (() => router.back())}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}