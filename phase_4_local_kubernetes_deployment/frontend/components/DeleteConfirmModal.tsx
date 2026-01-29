'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
  loading?: boolean;
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskTitle,
  loading = false
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center bg-gradient-to-r from-red-950/20 to-transparent border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  Delete Task
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6 text-white/40" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              
              <p className="text-center text-gray-300 mb-3 text-lg">
                Are you sure you want to delete this task?
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
                <p className="text-center font-semibold text-white text-base break-words">
                  "{taskTitle}"
                </p>
              </div>
              <p className="text-center text-sm text-gray-400 mb-6">
                This action cannot be undone.
              </p>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg shadow-red-500/20"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}