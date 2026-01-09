import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import clsx from 'clsx';
import { ToasterProvider } from '@/components/ToasterProvider';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'The most advanced task management platform with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(GeistSans.variable, 'dark')}>
      <body className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-gray-100 antialiased">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}