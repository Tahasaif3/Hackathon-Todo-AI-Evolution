'use client';

import { motion } from 'framer-motion';
import RegisterForm from '@/components/RegisterForm';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, -25, 25, -15],
              x: [null, 15, -15, 10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 12 + 12,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/3 left-1/5 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="max-w-lg w-full relative z-10"
      >
        {/* Decorative corner accents */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-teal-500/30 rounded-bl-lg" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg" />
        
        <Card className="glass-effect p-0 overflow-hidden bg-gray-900/40 border border-gray-800/50 backdrop-blur-xl shadow-2xl shadow-black/50">
          <CardContent className="p-10">
            <div className="text-center mb-10">
              {/* Animated logo */}
              <motion.div 
                className="mx-auto w-20 h-20 mb-6 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-30" />
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-dashed border-emerald-500/30 rounded-xl"
                  />
                  <div className="text-3xl relative z-10">✨</div>
                </div>
              </motion.div>
              
              <motion.h2 
                className="mt-4 text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Join Our Community
              </motion.h2>
              
              <motion.p 
                className="mt-3 text-sm text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Start your productivity journey with premium features
              </motion.p>
            </div>
            
            <RegisterForm />
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
            
            </div>
            
                    
            <div className="mt-8 text-center text-sm text-gray-400">
              <p>
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-medium text-white hover:text-gray-200 transition-colors underline-offset-2 hover:underline"
                >
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Sign in
                  </span>
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Features list */}
        
      </motion.div>
    </div>
  );
}