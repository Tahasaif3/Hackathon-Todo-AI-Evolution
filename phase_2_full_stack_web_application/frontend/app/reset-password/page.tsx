'use client';

import { motion } from 'framer-motion';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { Card, CardContent } from '@/components/ui/card';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="glass p-0 overflow-hidden bg-gray-800/30 border border-gray-700 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.div 
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 border border-indigo-500/30"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl">🔑</div>
              </motion.div>
              <h2 className="mt-2 text-3xl font-bold text-white">
                Set New Password
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Create a new password for your account
              </p>
            </div>
            <ResetPasswordForm />
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Remember your password?{' '}
                <a
                  href="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-2 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}