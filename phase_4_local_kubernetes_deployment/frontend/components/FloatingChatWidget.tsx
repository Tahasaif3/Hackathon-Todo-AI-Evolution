'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, MessageCircle } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatWidgetProps {
  userId?: string;
}

export default function FloatingChatWidget({ userId }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 hover:scale-110 transition-transform duration-300 border border-white/20"
              aria-label="Open chat"
            >
              <MessageCircle className="w-7 h-7 text-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-gray-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[400px] flex flex-col bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    TaskFlow AI
                  </h2>
                  <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="h-[500px]">
              <ChatInterface userId={userId} compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
