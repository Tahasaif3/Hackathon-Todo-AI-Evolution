'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface BentoItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  background?: string;
}

interface BentoGridProps {
  items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`${item.className || ''}`}
        >
          <Card 
            className={`h-full bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group overflow-hidden relative ${item.background || ''}`}
          >
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                  {item.icon}
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: ['0%', '70%', '30%', '65%'] }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
                
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <span>Live update</span>
                  <div className="ml-2 flex space-x-1">
                    <motion.div 
                      className="w-1 h-1 bg-green-400 rounded-full"
                      animate={{ 
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity 
                      }}
                    />
                    <motion.div 
                      className="w-1 h-1 bg-green-400 rounded-full"
                      animate={{ 
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.3
                      }}
                    />
                    <motion.div 
                      className="w-1 h-1 bg-green-400 rounded-full"
                      animate={{ 
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.6
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Animated background elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}