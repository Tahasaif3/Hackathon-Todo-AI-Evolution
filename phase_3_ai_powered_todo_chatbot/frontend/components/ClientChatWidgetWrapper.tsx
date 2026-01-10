'use client';

import { useUser } from '@/components/UserProvider';
import FloatingChatWidget from '@/components/FloatingChatWidget';
import { usePathname } from 'next/navigation';

export default function ClientChatWidgetWrapper() {
  const { userId, loading } = useUser();
  const pathname = usePathname();

  // Routes where the chat widget should be hidden
  const hiddenRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

  if (loading || !userId || hiddenRoutes.includes(pathname)) {
    return null; // Don't show chat widget while loading, if not logged in, or on specific pages
  }

  return <FloatingChatWidget userId={userId} />;
}