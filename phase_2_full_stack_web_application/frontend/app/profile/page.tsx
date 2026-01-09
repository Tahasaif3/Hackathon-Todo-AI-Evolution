'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCurrentUser, resetPassword } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  PieChart
} from 'lucide-react';
import Link from 'next/link';

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
          
          // Get member since from localStorage or set from user data
          const savedMemberSince = localStorage.getItem('memberSince');
          if (savedMemberSince) {
            setMemberSince(savedMemberSince);
          } else if (userData.created_at) {
            const date = new Date(userData.created_at);
            setMemberSince(date.toLocaleDateString());
            localStorage.setItem('memberSince', date.toLocaleDateString());
          } else {
            setMemberSince('Unknown');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userName', editedName);
    localStorage.setItem('memberSince', memberSince);
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

  const handleLogout = async () => {
    try {
      // Clear any client-side storage
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userName');
      localStorage.removeItem('memberSince');
      
      // Redirect to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
      router.refresh();
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
          {/* Header Skeleton */}
          <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-700 animate-pulse"></div>
                    <div className="ml-2 h-6 w-24 rounded bg-gray-700 animate-pulse"></div>
                  </div>
                  <div className="hidden md:flex space-x-8">
                    <div className="h-4 w-20 rounded bg-gray-700 animate-pulse"></div>
                    <div className="h-4 w-20 rounded bg-gray-700 animate-pulse"></div>
                    <div className="h-4 w-20 rounded bg-gray-700 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                  <div className="w-20 h-8 rounded-lg bg-gray-700 animate-pulse"></div>
                </div>
              </div>
            </div>
          </header>

          <main className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="h-8 w-64 rounded bg-gray-700 animate-pulse mb-3"></div>
                <div className="h-4 w-96 rounded bg-gray-700 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-800">
                      <div className="h-6 w-48 rounded bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="space-y-6 py-6 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 pt-4">
                        <div className="h-10 w-32 rounded-lg bg-gray-700 animate-pulse"></div>
                        <div className="h-10 w-40 rounded-lg bg-gray-700 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-800">
                      <div className="h-6 w-48 rounded bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="space-y-6 py-6 px-6">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <div className="h-4 w-32 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-10 rounded-lg bg-gray-800/50 animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 pt-2">
                        <div className="h-10 w-40 rounded-lg bg-gray-700 animate-pulse"></div>
                        <div className="h-10 w-24 rounded-lg bg-gray-700 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="bg-gray-900/30 px-6 py-4 border-b border-gray-800">
                      <div className="h-6 w-32 rounded bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="py-6 px-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-700 animate-pulse mr-3"></div>
                          <div className="h-4 w-full rounded bg-gray-700 animate-pulse"></div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-700 animate-pulse mr-3"></div>
                          <div className="h-4 w-full rounded bg-gray-700 animate-pulse"></div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-700 animate-pulse mr-3"></div>
                          <div className="h-4 w-full rounded bg-gray-700 animate-pulse"></div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-700 animate-pulse mr-3"></div>
                          <div className="h-4 w-full rounded bg-gray-700 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="bg-gray-900/30 px-6 py-4 border-b border-gray-800">
                      <div className="h-6 w-40 rounded bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="py-6 px-6">
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <div className="h-4 w-32 rounded bg-gray-700 animate-pulse"></div>
                          <div className="h-4 w-10 rounded bg-gray-700 animate-pulse"></div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-gray-700 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <div className="h-4 w-full rounded bg-gray-700 animate-pulse mt-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <Link href="/tasks" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link href="/projects" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Projects
                  </Link>
                  <Link href="/calendar" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendar
                  </Link>
                 <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <PieChart className="h-4 w-4 mr-1" />
                    Analytics
                </Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/profile')}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-300" />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              <p className="mt-2 text-gray-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info Card */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-800">
                    <CardTitle className="text-white flex items-center text-xl">
                      <User className="h-5 w-5 mr-3 text-indigo-400" />
                      Personal Information
                    </CardTitle>
                  </div>
                  <CardContent className="space-y-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        ) : (
                          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-white">
                            {localStorage.getItem('userName') || user?.name || 'Not provided'}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Email Address</label>
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-white flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{user?.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Member Since</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={memberSince}
                            onChange={(e) => setMemberSince(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        ) : (
                          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-white flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {localStorage.getItem('memberSince') || memberSince}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Account Status</label>
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-white flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-green-400" />
                          <span className="text-green-400 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-4">
                      {isEditing ? (
                        <Button 
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center px-5 py-2.5 rounded-lg transition-all"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center px-5 py-2.5 rounded-lg transition-all"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                      <Button 
                        onClick={() => setShowChangePassword(true)}
                        className="bg-gray-800 hover:bg-gray-700 text-white flex items-center px-5 py-2.5 rounded-lg border border-gray-700 transition-all"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Change Password Modal */}
                {showChangePassword && (
                  <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in duration-300">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-800">
                      <CardTitle className="text-white flex items-center text-xl">
                        <Lock className="h-5 w-5 mr-3 text-indigo-400" />
                        Change Password
                      </CardTitle>
                    </div>
                    <CardContent className="space-y-6 py-6">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      
                      {passwordMessage && (
                        <div className={`p-4 rounded-lg text-sm flex items-start ${passwordMessageType === 'error' ? 'bg-red-900/20 text-red-300 border border-red-900/30' : 'bg-green-900/20 text-green-300 border border-green-900/30'}`}>
                          {passwordMessageType === 'error' ? 
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> : 
                            <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />}
                          <span>{passwordMessage}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button 
                          onClick={handlePasswordChange}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center px-5 py-2.5 rounded-lg transition-all"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordMessage('');
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg border border-gray-700 transition-all"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Security Settings Card */}
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-800">
                    <CardTitle className="text-white flex items-center text-xl">
                      <Shield className="h-5 w-5 mr-3 text-indigo-400" />
                      Security Settings
                    </CardTitle>
                  </div>
                  <CardContent className="space-y-6 py-6">
                    <div className="flex justify-between items-center pb-5 border-b border-gray-800/50">
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          <Lock className="h-4 w-4 mr-2 text-gray-400" />
                          Two-Factor Authentication
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <Button 
                        onClick={() => handleToggleSetting('twoFactor')}
                        className={`px-4 py-2 rounded-lg transition-all ${securitySettings.twoFactor ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'}`}
                      >
                        {securitySettings.twoFactor ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center pb-5 border-b border-gray-800/50">
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-gray-400" />
                          Login Alerts
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Receive notifications when someone logs in</p>
                      </div>
                      <Button 
                        onClick={() => handleToggleSetting('loginAlerts')}
                        className={`px-4 py-2 rounded-lg transition-all ${securitySettings.loginAlerts ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'}`}
                      >
                        {securitySettings.loginAlerts ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          Active Sessions
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Manage devices connected to your account</p>
                      </div>
                      <Button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-all">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-gray-900/30 px-6 py-4 border-b border-gray-800">
                    <CardTitle className="text-white flex items-center text-xl">
                      <Shield className="h-5 w-5 mr-3 text-indigo-400" />
                      Security Tips
                    </CardTitle>
                  </div>
                  <CardContent className="py-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <p className="text-gray-300 text-sm">Use a strong password with at least 8 characters</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <p className="text-gray-300 text-sm">Enable two-factor authentication for extra security</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <p className="text-gray-300 text-sm">Regularly review your active sessions</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <p className="text-gray-300 text-sm">Log out from shared or public devices</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-gray-900/30 px-6 py-4 border-b border-gray-800">
                    <CardTitle className="text-white flex items-center text-xl">
                      <User className="h-5 w-5 mr-3 text-indigo-400" />
                      Profile Completion
                    </CardTitle>
                  </div>
                  <CardContent className="py-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Profile Information</span>
                        <span className="text-white font-medium">100%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-gray-400 text-sm mt-3">Your profile is complete! Great job keeping your information up to date.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}