'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, Loader2, ArrowDown, Calendar, Layers, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  userId?: string;
  conversationId?: number;
  compact?: boolean;
}

export default function ChatInterface({ userId, conversationId, compact = false }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: "Welcome to **TaskFlow Elite**. I'm your high-fidelity coordination agent.\n\nI can now manage your **Projects**, **Tasks**, and **Calendar** with geometric precision. \n\n### Quick Capabilities:\n* **Projects**: \"Create a new project called 'Hackathon'\"\n* **Coordination**: \"Add 'Update UI' to my Hackathon project\"\n* **Calendar**: \"What's on my schedule for this week?\"",
          role: 'assistant',
          timestamp: new Date(),
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const storedToken = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/api/${userId}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          conversation_id: conversationId || null
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `resp-${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: "**System Overload.** I couldn't process that request. Please try again or check your connection.",
        role: 'assistant',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col relative h-full bg-[#050505]/60 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-[0_22px_70px_-15px_rgba(0,0,0,0.8)] transition-all duration-500`}>
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Refinement Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent z-10" />

      {/* Messages Feed */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide selection:bg-indigo-500/30"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar with Glow */}
                <div className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${message.role === 'user'
                    ? 'bg-gradient-to-tr from-indigo-500 to-blue-600 shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]'
                    : 'bg-white/5 border border-white/10 ring-1 ring-white/5'
                  }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-indigo-400" />
                  )}
                  {message.role === 'assistant' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-black animate-pulse" />
                  )}
                </div>

                {/* Message Content Container */}
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    className={`rounded-[22px] px-5 py-3.5 shadow-2xl transition-all duration-300 ${message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-600/90 to-blue-700/90 text-white rounded-tr-none border border-white/10'
                        : 'bg-white/[0.03] backdrop-blur-xl border border-white/10 text-gray-200 rounded-tl-none ring-1 ring-white/5'
                      }`}
                  >
                    <div className="text-[14px] leading-relaxed prose prose-invert prose-sm max-w-none 
                      prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
                      prose-strong:text-indigo-300 prose-strong:font-semibold
                      prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-ul:my-2 prose-li:my-1
                    ">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </motion.div>
                  <span className="text-[11px] font-medium text-gray-500 tracking-tight px-1 flex items-center gap-2">
                    {message.role === 'assistant' && <Sparkles className="w-3 h-3 text-indigo-500/50" />}
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Advanced Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-4 items-center bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none px-5 py-3.5 ring-1 ring-white/5 shadow-xl">
              <div className="flex gap-1.5 item-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 1, 0.3],
                      backgroundColor: ['#6366f1', '#a855f7', '#6366f1']
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[13px] text-gray-400 font-medium tracking-wide italic">Synthesizing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Scroll Hub */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-28 right-8 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl z-20 group transition-all"
          >
            <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Futuristic Input Control */}
      <div className="px-6 py-6 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/5 relative">
        <div className="relative group max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex items-center gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Architect your day..."
              className="h-14 pl-6 pr-14 bg-[#0a0a0a] border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white placeholder:text-gray-600 rounded-2xl transition-all duration-300 text-[15px] font-medium"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="absolute right-2.5 top-2.5 w-10 h-10 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-center gap-6 mt-5 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Calendar Sync</span>
          </div>
          <div className="w-[1px] h-3 bg-white/20" />
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Projects Node</span>
          </div>
          <div className="w-[1px] h-3 bg-white/20" />
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">v2.1 Elite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
