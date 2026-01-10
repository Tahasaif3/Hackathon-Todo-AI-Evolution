'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreate, ProjectUpdate } from '@/lib/types';
import { createProject, updateProject } from '@/lib/api';
import { motion } from 'framer-motion';
import { Type, AlignLeft, Palette, Calendar, CheckCircle2 } from 'lucide-react';

interface ProjectFormProps {
  initialProject?: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSuccess?: (project: any) => void;
}

export function ProjectForm({ initialProject, isEditing = false, onCancel, onSuccess }: ProjectFormProps) {
  const [name, setName] = useState(initialProject?.name || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [color, setColor] = useState(initialProject?.color || '#3b82f6');
  const [deadline, setDeadline] = useState(initialProject?.deadline || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Cluster designation required');
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      let project;
      if (isEditing && initialProject) {
        const projectData: ProjectUpdate = {
          name: name.trim(),
          description: description.trim() || undefined,
          color: color || undefined,
          deadline: deadline || undefined
        };
        project = await updateProject(userId, initialProject.id, projectData);
      } else {
        const projectData: ProjectCreate = {
          name: name.trim(),
          description: description.trim() || undefined,
          color: color || undefined
        };
        project = await createProject(userId, projectData);
      }
      if (onSuccess) onSuccess(project);
    } catch (err: any) {
      setError(err.message || 'Operational failure');
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#ef4444' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Fuchsia', value: '#d946ef' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <Type className="w-3 h-3" /> Cluster Label
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Assign name..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <AlignLeft className="w-3 h-3" /> Project Matrix
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe cluster parameters..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-medium h-32 resize-none"
          />
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <Palette className="w-3 h-3" /> Visual Signature
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`w-10 h-10 rounded-xl transition-all relative overflow-hidden group ${color === option.value ? 'ring-2 ring-white ring-offset-4 ring-offset-black scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                style={{ backgroundColor: option.value }}
              >
                {color === option.value && (
                  <motion.div layoutId="color-check" className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <Calendar className="w-3 h-3" /> Operational Deadline
          </label>
          <input
            type="date"
            value={deadline ? deadline.split('T')[0] : ''}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
        >
          Abort
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-4 bg-white text-black hover:bg-slate-200 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
        >
          {loading ? 'Processing...' : isEditing ? 'Update Cluster' : 'Initialize Cluster'}
        </button>
      </div>
    </form>
  );
}