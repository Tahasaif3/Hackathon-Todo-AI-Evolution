'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Calendar, Clock, Edit } from 'lucide-react';
import { Task } from '@/lib/types';
import { toggleTaskCompletion, deleteTask } from '@/lib/api';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

// Custom circular checkbox component with animation
const CircularCheckbox = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative"
    >
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent shadow-lg'
            : 'border-gray-600 hover:border-green-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      </button>
    </motion.div>
  );
};

export function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localTask, setLocalTask] = useState(task);

  // Get user ID from localStorage or context (in a real app, this would come from auth context)
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

  const handleToggleCompletion = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const updatedTask = await toggleTaskCompletion(userId, localTask.id);
      setLocalTask(updatedTask);
      onTaskUpdated();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTask(userId, localTask.id);
      onTaskDeleted();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <>
      <Card
        className={`bg-gray-900/50 backdrop-blur-xl border-gray-800 p-4 hover:border-gray-700 transition-all duration-300 ${
          localTask.completed ? 'opacity-70' : 'hover:shadow-lg hover:shadow-indigo-500/10'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <CircularCheckbox
              checked={localTask.completed}
              onChange={handleToggleCompletion}
            />
            <div className="min-w-0 flex-1">
              <p
                className={`text-base font-medium ${
                  localTask.completed
                    ? 'text-gray-400 line-through'
                    : 'text-white'
                }`}
              >
                {localTask.title}
              </p>
              {localTask.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {localTask.description}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500 mt-3 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(localTask.created_at).toLocaleDateString()}</span>
                </div>
                {localTask.updated_at !== localTask.created_at && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Edited</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-1 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Card>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={localTask.title}
        loading={isDeleting}
      />
    </>
  );
}
