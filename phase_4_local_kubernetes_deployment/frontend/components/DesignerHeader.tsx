'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '@/lib/api';
import Link from 'next/link';
import {
    LogOut,
    User,
    ListTodo,
    BarChart3,
    FolderOpen,
    Calendar,
    PieChart,
    MessageSquare,
    Zap,
    Shield,
    Bell,
    AlertCircle,
    Clock
} from 'lucide-react';
import { getTasks } from '@/lib/api';
import { showToast } from '@/lib/toast';

interface DesignerHeaderProps {
    children?: React.ReactNode;
}

export default function DesignerHeader({ children }: DesignerHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Welcome to TaskFlow', desc: 'System initialized and ready.', time: 'Now', icon: Bell, color: 'text-indigo-400' },
        { id: 2, title: 'Security Protocol', desc: 'Secure connection established.', time: '1h ago', icon: Shield, color: 'text-emerald-400' },
        { id: 3, title: 'Achievement Unlocked', desc: 'Productivity streak started!', time: '2h ago', icon: Zap, color: 'text-yellow-400' },
    ]);

    useEffect(() => {
        const checkTaskAlerts = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;

            try {
                const user = JSON.parse(userStr);
                const tasks = await getTasks(user.id);
                const today = new Date().toISOString().split('T')[0];

                const dueTodayTasks = tasks.filter(t => !t.completed && t.due_date && t.due_date.startsWith(today));
                const overdueTasks = tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date(today));

                if (dueTodayTasks.length > 0 || overdueTasks.length > 0) {
                    const newAlerts = [
                        ...dueTodayTasks.map(t => ({
                            id: `due-${t.id}`,
                            title: 'Task Due Today',
                            desc: t.title,
                            time: 'Now',
                            icon: Clock,
                            color: 'text-yellow-400'
                        })),
                        ...overdueTasks.map(t => ({
                            id: `overdue-${t.id}`,
                            title: 'Task Overdue',
                            desc: t.title,
                            time: 'Past Due',
                            icon: AlertCircle,
                            color: 'text-red-400'
                        }))
                    ];

                    setNotifications(prev => {
                        // Avoid duplicates
                        const existingIds = new Set(prev.map(n => n.id));
                        const filteredNew = newAlerts.filter(n => !existingIds.has(n.id));
                        return [...filteredNew, ...prev];
                    });

                    if (dueTodayTasks.length > 0) {
                        showToast.warning(`You have ${dueTodayTasks.length} task(s) due today!`);
                    }
                    if (overdueTasks.length > 0) {
                        showToast.error(`You have ${overdueTasks.length} overdue task(s)!`);
                    }
                }
            } catch (err) {
                console.error('Failed to check task alerts:', err);
            }
        };

        checkTaskAlerts();
        // Check every 5 minutes
        const interval = setInterval(checkTaskAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/login');
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/tasks', icon: BarChart3 },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Analytics', href: '/analytics', icon: PieChart },
        { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <ListTodo className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">TaskFlow</span>
                        </Link>
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isActive(item.href)
                                        ? 'bg-white/10 text-white border border-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive(item.href) ? 'text-indigo-400' : ''}`} />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        {children}

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2.5 rounded-xl transition-all relative border ${showNotifications ? 'bg-indigo-500/10 border-indigo-500/50 text-white' : 'text-slate-400 hover:text-white bg-white/5 border-white/10'}`}
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 text-left"
                                    >
                                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Notifications</h3>
                                            <button onClick={() => setNotifications([])} className="text-[10px] font-black text-indigo-400 uppercase hover:text-indigo-300 transition-colors">Clear All</button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? notifications.map((n) => (
                                                <div key={n.id} className="p-5 border-b border-white/5 hover:bg-white/[0.03] transition-all group cursor-pointer">
                                                    <div className="flex gap-4">
                                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-white/10 transition-all ${n.color}`}>
                                                            <n.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{n.title}</h4>
                                                                <span className="text-[9px] font-bold text-white/20 uppercase whitespace-nowrap">{n.time}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{n.desc}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-12 text-center">
                                                    <Bell className="w-6 h-6 text-white/10 mx-auto mb-4" />
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No active signals</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => router.push('/profile')}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isActive('/profile') ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <User className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:block px-5 py-2.5 text-sm font-bold text-white bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
