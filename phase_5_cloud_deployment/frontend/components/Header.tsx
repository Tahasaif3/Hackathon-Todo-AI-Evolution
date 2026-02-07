'use client';

import { useRouter } from 'next/navigation';
import { logout} from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle, FolderOpen, Calendar, MessageSquare, PieChart, User, LogOut, ListTodo } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
      router.refresh();
    }
  };


  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gradient-to-r from-gray-900/80 to-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
            </div>
            <nav className="hidden md:flex space-x-1">
              <Link href="/tasks" className={`px-4 py-2 ${isActive('/tasks') ? 'text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700' : 'text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30'}`}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link href="/projects" className={`px-4 py-2 ${isActive('/projects') ? 'text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700' : 'text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30'}`}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Projects
              </Link>
              <Link href="/calendar" className={`px-4 py-2 ${isActive('/calendar') ? 'text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700' : 'text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30'}`}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Link>
              <Link href="/chat" className={`px-4 py-2 ${isActive('/chat') ? 'text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700' : 'text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30'}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
              <Link href="/analytics" className={`px-4 py-2 ${isActive('/analytics') ? 'text-indigo-400 font-medium rounded-lg flex items-center bg-gray-800/50 border border-gray-700' : 'text-gray-400 hover:text-white transition-colors rounded-lg flex items-center hover:bg-gray-800/30'}`}>
                <PieChart className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/profile')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
            >
              <User className="h-5 w-5 text-gray-300" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}