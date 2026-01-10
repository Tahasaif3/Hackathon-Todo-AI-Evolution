'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCurrentUser, resetPassword, logout } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Edit3,
  Key,
  Bell,
  Save,
  Check,
  Lock,
  AlertTriangle,
  PieChart,
  BarChart3,
  FolderOpen,
  ListTodo,
  TrendingUp,
  Cpu,
  Zap,
  Activity,
  X,
  ChevronRight,
  Fingerprint,
  Globe,
  Settings,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import DesignerHeader from '@/components/DesignerHeader';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: false
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setEditedName(userData.name || '');

          const savedMemberSince = localStorage.getItem('memberSince');
          if (savedMemberSince) {
            setMemberSince(savedMemberSince);
          } else if (userData.created_at) {
            const date = new Date(userData.created_at);
            setMemberSince(date.toLocaleDateString());
            localStorage.setItem('memberSince', date.toLocaleDateString());
          } else {
            setMemberSince('2024-01-01');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);


  const handleSave = () => {
    localStorage.setItem('userName', editedName);
    setIsEditing(false);
  };

  const handleToggleSetting = (setting: 'twoFactor' | 'loginAlerts') => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setPasswordMessageType('error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      setPasswordMessageType('error');
      return;
    }

    try {
      await resetPassword(user.email, passwordData.newPassword);
      setPasswordMessage('Password changed successfully');
      setPasswordMessageType('success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordMessage('');
      }, 3000);
    } catch (error) {
      setPasswordMessage('Failed to change password');
      setPasswordMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
        {/* Cinematic Backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <DesignerHeader />

        <main className="relative py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Profile</h1>
                <p className="text-slate-400 text-lg font-medium opacity-60">Manage your profile data and security protocols.</p>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status: Secure</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden"
                >
                  <div className="p-10 border-b border-white/5 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                      <div className="relative w-32 h-32 rounded-full bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden">
                        <User className="w-16 h-16 text-white/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">ID: {user?.id?.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full md:w-auto"
                          />
                        ) : (
                          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{localStorage.getItem('userName') || user?.name || 'Unknown Subject'}</h2>
                        )}
                        {!isEditing && (
                          <div className="inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest self-center">
                            Elite Tier User
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4 text-white/20" /> {user?.email}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {isEditing ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20"
                        >
                          <Save className="w-6 h-6" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Edit3 className="w-6 h-6" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Temporal Origin</label>
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-bold text-slate-200">{memberSince}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Regional Sector</label>
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-bold text-slate-200">Global / Node-01</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Biometric Sync</label>
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Fingerprint className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-bold text-slate-200">Active / Verified</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Operational Status</label>
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-200">Peak Performance</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Communication Protocols */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                      <Zap className="w-6 h-6 text-yellow-400" /> Communication Protocols
                    </h3>
                    <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                      Neural Broadcast enabled
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        id: 'interfaceAlerts',
                        title: 'Neural Interface Alerts',
                        desc: 'In-app telemetry notifications.',
                        enabled: true,
                        icon: Bell
                      },
                      {
                        id: 'encryptedMail',
                        title: 'Encrypted Pulse Mail',
                        desc: 'Secure email task summaries.',
                        enabled: false,
                        icon: Mail
                      },
                      {
                        id: 'bioMobile',
                        title: 'Bio-Mobile Push',
                        desc: 'Real-time mobile device sync.',
                        enabled: true,
                        icon: Globe
                      },
                      {
                        id: 'neuralDirect',
                        title: 'Neural Direct Feed',
                        desc: 'Primary consciousness alerts.',
                        enabled: true,
                        icon: Cpu
                      }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-yellow-400 transition-colors flex-shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.title}</h4>
                            <p className="text-[10px] font-medium text-white/30 mt-1">{item.desc}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-12 h-7 rounded-full p-1 transition-colors flex-shrink-0 ${item.enabled ? 'bg-yellow-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Security Protocols */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                      <Shield className="w-6 h-6 text-indigo-400" /> Security Protocols
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                    >
                      {showChangePassword ? 'Close Module' : 'Change Key'}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showChangePassword && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-10"
                      >
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[30px] space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">New Password</label>
                              <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Verify Password</label>
                              <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>

                          {passwordMessage && (
                            <div className={`p-4 rounded-2xl text-xs font-bold ${passwordMessageType === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {passwordMessage}
                            </div>
                          )}

                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handlePasswordChange}
                              className="px-8 py-4 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs"
                            >
                              Update Password
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-6">
                    {[
                      {
                        id: 'twoFactor',
                        title: 'Multi-Factor Auth',
                        desc: 'Secure account with secondary temporal token.',
                        enabled: securitySettings.twoFactor,
                        icon: Lock
                      },
                      {
                        id: 'loginAlerts',
                        title: 'Neural Intrusion Alerts',
                        desc: 'Receive immediate telemetry on unauthorized login attempts.',
                        enabled: securitySettings.loginAlerts,
                        icon: Bell
                      }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-indigo-400 transition-colors">
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                            <p className="text-xs font-medium text-white/30">{item.desc}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleSetting(item.id as any)}
                          className={`w-14 h-8 rounded-full p-1 transition-colors ${item.enabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[40px] p-10"
                >
                  <h3 className="text-sm font-black text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Account Progression
                  </h3>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                        <span>Profile Integrity</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                        <span>Security Hardening</span>
                        <span>{securitySettings.twoFactor && securitySettings.loginAlerts ? '100%' : securitySettings.twoFactor || securitySettings.loginAlerts ? '50%' : '0%'}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: securitySettings.twoFactor && securitySettings.loginAlerts ? '100%' : securitySettings.twoFactor || securitySettings.loginAlerts ? '50%' : '0%' }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-10 border-t border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                      Your identity matrix is currently synchronized at maximum efficiency. Maintain current security protocols to ensure nodal stability.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 overflow-hidden relative group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Settings className="w-40 h-40" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em]">Neural Settings</h3>
                  <div className="space-y-3">
                    {['Interface Theme: Dark', 'Neural Language: English', 'Auto-Sync: Enabled', 'Telemetry: Active'].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04]">
                        <span className="text-xs font-bold text-slate-300">{pref}</span>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}