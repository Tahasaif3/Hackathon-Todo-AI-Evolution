'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, CheckCircleIcon, CalendarIcon, PlusIcon, SparklesIcon, UserGroupIcon, BellAlertIcon, BoltIcon, ChartBarIcon, LockClosedIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export function EnhancedLandingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const magneticButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Magnetic button effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!magneticButtonRef.current) return;
      
      const button = magneticButtonRef.current;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / 10;
      const deltaY = (y - centerY) / 10;
      
      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animated task card component for the interactive preview
  const AnimatedTaskCard = ({ title, delay }: { title: string; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <CheckCircleIcon className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-xs text-gray-400">2 min ago</div>
      </div>
      <h3 className="font-medium text-white mb-2">{title}</h3>
      <div className="flex items-center text-xs text-gray-400">
        <CalendarIcon className="w-3 h-3 mr-1" />
        Due tomorrow
      </div>
    </motion.div>
  );

  // Feature card component
  const FeatureCard = ({ 
    icon, 
    title, 
    description, 
    delay,
    gradient 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    delay: number;
    gradient: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-2xl"
    >
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${gradient} opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150`}></div>
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section with radial glow and noise texture */}
      <div className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950"></div>
        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          {/* Announcement Banner */}
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-x-2 bg-white/5 backdrop-blur-sm border border-white/10 py-1 px-3 rounded-full transition-all hover:bg-white/10"
            >
              <span className="text-xs font-medium text-gray-300">✨ New: Real-time Collaboration</span>
            </motion.div>
          </div>
          
          {/* Title with floating badge */}
          <div className="mt-8 max-w-4xl text-center mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="block font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              Task Management
              <br />
              <span className="relative inline-block">
                Reimagined
                <span className="floating-badge ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium rotating-border">
                  <span className="px-2 py-1 bg-gray-950 rounded-full">Productivity</span>
                </span>
              </span>
            </motion.h1>
          </div>
          
          {/* Description */}
          <div className="mt-8 max-w-2xl text-center mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Experience the future of productivity with our AI-powered task management platform. 
              Designed for teams who demand precision, speed, and elegance.
            </motion.p>
          </div>
          
          {/* Magnetic CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              ref={magneticButtonRef}
              onClick={() => router.push('/register')}
              className="magnetic relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-full group shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)]"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-b from-white/20 via-white/10 to-transparent group-hover:opacity-100"></span>
              <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/30 to-transparent opacity-30 h-[2px]"></span>
              <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-500 ease-in-out bg-indigo-700 group-hover:w-full group-hover:h-full"></span>
              <span className="absolute inset-0 w-full h-full border border-white/20 rounded-full"></span>
              <span className="relative flex items-center gap-x-2">
                Get Started Free
                <ArrowRightIcon className="flex-shrink-0 size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Interactive Bento Preview */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            See It In Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Our intuitive dashboard helps you organize, prioritize, and accomplish tasks with unprecedented efficiency.
          </motion.p>
        </div>
        
        {/* Tilted 3D Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative max-w-6xl mx-auto"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div 
            className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            style={{
              transform: 'rotateX(5deg) rotateY(-5deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Animated Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AnimatedTaskCard title="Design Homepage" delay={0.7} />
              <AnimatedTaskCard title="Team Meeting" delay={0.8} />
              <AnimatedTaskCard title="Code Review" delay={0.9} />
            </div>
            
            {/* Stats Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-indigo-500/10 mr-4">
                    <CheckCircleIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Tasks Completed</p>
                    <p className="text-2xl font-bold text-white">142</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-500/10 mr-4">
                    <BoltIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Productivity</p>
                    <p className="text-2xl font-bold text-white">+32%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                    <UserGroupIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Team Members</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to stay organized and productive, designed with developers in mind.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<SparklesIcon className="w-6 h-6 text-indigo-400" />}
            title="AI-Powered Organization"
            description="Automatically categorize and prioritize tasks based on context and deadlines."
            delay={0.3}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          
          <FeatureCard 
            icon={<UserGroupIcon className="w-6 h-6 text-blue-400" />}
            title="Real-time Collaboration"
            description="Work seamlessly with your team, with live updates and shared workspaces."
            delay={0.4}
            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          
          <FeatureCard 
            icon={<BellAlertIcon className="w-6 h-6 text-green-400" />}
            title="Smart Notifications"
            description="Stay on top of deadlines with customizable alerts and reminders."
            delay={0.5}
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          
          <FeatureCard 
            icon={<BoltIcon className="w-6 h-6 text-yellow-400" />}
            title="Lightning Fast Performance"
            description="Optimized for speed with instant loading and smooth interactions."
            delay={0.6}
            gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          
          <FeatureCard 
            icon={<ChartBarIcon className="w-6 h-6 text-pink-400" />}
            title="Advanced Analytics"
            description="Gain insights into your productivity with detailed reports and charts."
            delay={0.7}
            gradient="bg-gradient-to-r from-pink-500 to-rose-500"
          />
          
          <FeatureCard 
            icon={<LockClosedIcon className="w-6 h-6 text-red-400" />}
            title="Military-grade Security"
            description="Your data is protected with end-to-end encryption and secure authentication."
            delay={0.8}
            gradient="bg-gradient-to-r from-red-500 to-rose-500"
          />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-[85rem] px-4 py-20 sm:px-6 lg:px-8 mx-auto">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Transform Your Productivity?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10"
            >
              Join thousands of professionals who are already using TaskFlow Elite to achieve more in less time.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all backdrop-blur-sm flex items-center justify-center"
              >
                <span>Sign In</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}