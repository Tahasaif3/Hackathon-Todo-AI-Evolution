'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreate, ProjectUpdate } from '@/lib/types';
import { createProject, updateProject } from '@/lib/api';

interface ProjectFormProps {
  initialProject?: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSuccess?: (project: any) => void;
}

export function ProjectForm({ initialProject, isEditing = false, onCancel, onSuccess }: ProjectFormProps = {}) {
  const [name, setName] = useState(initialProject?.name || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [color, setColor] = useState(initialProject?.color || '#3b82f6');
  const [deadline, setDeadline] = useState(initialProject?.deadline || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (name.length > 200) {
      setError('Project name must be 200 characters or less');
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
      let project;
      if (isEditing && initialProject) {
        // Update existing project
        const projectData: ProjectUpdate = {
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          color: color || undefined,
          deadline: deadline || undefined
        };
        
        project = await updateProject(userId, initialProject.id, projectData);
      } else {
        // Create new project
        const projectData: ProjectCreate = {
          name: name.trim(),
          description: description.trim() || undefined,
          color: color || undefined
        };
        
        project = await createProject(userId, projectData);
      }

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(project);
      }
    } catch (err: any) {
      setError(err.message || (isEditing ? 'Failed to update project. Please try again.' : 'Failed to create project. Please try again.'));
      console.error('Project form error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Predefined color options
  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-900/30 p-4 border border-red-700/50">
          <div className="text-sm text-red-300">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Project Name *
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Project name"
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
              placeholder="Project description (optional)"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">Optional, up to 1000 characters</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`w-8 h-8 rounded-full ${color === option.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                style={{ backgroundColor: option.value }}
                title={option.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? (isEditing ? 'Updating...' : 'Create Project') : isEditing ? 'Update Project' : 'Create Project'}
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