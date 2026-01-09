import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Clipboard, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onTaskCreated?: () => void;
}

export function EmptyState({ onTaskCreated }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30">
        <Clipboard className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">No tasks yet</h3>
      <p className="mt-2 text-gray-400 max-w-md mx-auto">
        Get started by creating your first task. Organize your work and boost your productivity.
      </p>
      <div className="mt-6">
        <Link
          href="/tasks/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create your first task
        </Link>
      </div>
      <div className="mt-8 flex justify-center">
        <div className="relative">
          <Sparkles className="h-5 w-5 text-yellow-400 absolute -top-2 -left-2 animate-pulse" />
          <Sparkles className="h-4 w-4 text-blue-400 absolute -bottom-1 -right-2 animate-pulse" style={{ animationDelay: '1s' }} />
          <p className="text-sm text-gray-500 italic">
            "Productivity is never an accident. It's always the result of a commitment to excellence." 
          </p>
        </div>
      </div>
    </motion.div>
  );
}