'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/lib/toast';
import { getCurrentUser } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional fallback while checking auth
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('=== ProtectedRoute: Checking authentication status ===');
        const user = await getCurrentUser();
        console.log('=== ProtectedRoute: Authentication check result ===', user);
        
        if (user) {
          console.log('=== ProtectedRoute: User is authenticated ===');
          setIsAuthenticated(true);
        } else {
          console.log('=== ProtectedRoute: User is not authenticated, redirecting to login ===');
          setIsAuthenticated(false);
          // Add a small delay to avoid race conditions
          setTimeout(() => {
            try {
              router.replace('/login');
            } catch (routerError) {
              console.error('=== ProtectedRoute: Router error ===', routerError);
              // Fallback to window.location
              window.location.href = '/login';
            }
          }, 300); // Increased delay to allow for proper token setup
        }
      } catch (error) {
        console.error('=== ProtectedRoute: Error checking authentication status ===', error);
        
        // Even if there's an error checking auth status, check if we have stored user data
        // This allows the app to work even if the backend API is temporarily unavailable
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('=== ProtectedRoute: Using stored user data as fallback ===');
          setIsAuthenticated(true);
        } else {
          console.log('=== ProtectedRoute: No stored user data, redirecting to login ===');
          setIsAuthenticated(false);
          // Add a small delay to avoid race conditions
          setTimeout(() => {
            try {
              router.replace('/login');
            } catch (routerError) {
              console.error('=== ProtectedRoute: Router error ===', routerError);
              // Fallback to window.location
              window.location.href = '/login';
            }
          }, 300); // Increased delay to allow for proper token setup
        }
      }
    };

    // Add a small initial delay to allow for token to be set after login
    const timer = setTimeout(checkAuthStatus, 200);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Show fallback while checking authentication status
  if (isAuthenticated === null) {
    console.log('=== ProtectedRoute: Still checking authentication status ===');
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the protected content
  if (isAuthenticated) {
    console.log('=== ProtectedRoute: Rendering protected content ===');
    return <>{children}</>;
  }

  // If not authenticated, return nothing (redirect effect will happen via useEffect)
  console.log('=== ProtectedRoute: Not authenticated, rendering nothing ===');
  return null;
}