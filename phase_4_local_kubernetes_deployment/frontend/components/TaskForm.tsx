'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCreate, TaskUpdate, Project } from '@/lib/types';
import { createTask, updateTask, getProjects } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, Tag, Type, AlignLeft, CheckCircle2, X } from 'lucide-react';

interface TaskFormProps {
  initialTask?: any;
  isEditing?: boolean;
  onCancel?: () => void;
  onSuccess?: (task: any) => void;
}

export function TaskForm({ initialTask, isEditing = false, onCancel, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [completed, setCompleted] = useState(initialTask?.completed || false);
  const [projectId, setProjectId] = useState(initialTask?.project_id || '');
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      let task;
      if (isEditing && initialTask) {
        const taskData: TaskUpdate = {
          title: title.trim(),
          description: description.trim() || undefined,
          completed,
          project_id: projectId || undefined,
          due_date: dueDate || undefined
        };
        task = await updateTask(userId, initialTask.id, taskData);
      } else {
        const taskData: any = {
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
          project_id: projectId || undefined,
          due_date: dueDate || undefined,
          is_ai_generated: false
        };
        task = await createTask(userId, taskData);
      }
      if (onSuccess) {
        onSuccess(task);
        const { showToast } = await import('@/lib/toast');
        showToast.success(isEditing ? 'Task updated successfully' : 'Task created successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <Type className="w-3 h-3" /> Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Specify objective..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <AlignLeft className="w-3 h-3" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional parameters (optional)"
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-medium h-32 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Project Choice */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              <Tag className="w-3 h-3" /> Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
            >
              <option value="" className="bg-slate-950">Inert Task</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-950">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              <Calendar className="w-3 h-3" /> Due Date
            </label>
            <input
              type="date"
              value={dueDate ? dueDate.split('T')[0] : ''}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
            />
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={() => setCompleted(!completed)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${completed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/5 text-white/40'
              }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Mark Task as Completed</span>
            <CheckCircle2 className={`w-5 h-5 ${completed ? 'opacity-100' : 'opacity-20'}`} />
          </button>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-4 bg-white text-black hover:bg-slate-200 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
        >
          {loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}