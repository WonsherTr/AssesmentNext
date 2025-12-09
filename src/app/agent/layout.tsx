'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button, ThemeToggle, LoadingOverlay } from '@/components';

interface AgentLayoutProps {
  children: ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'agent') {
        router.push('/client');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      router.push('/login');
    }, 300);
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading..." />;
  }

  if (!isAuthenticated || user?.role !== 'agent') {
    return null;
  }

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Signing out..." />}
      <div className="min-h-screen">
        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-dark-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6">
                <Link href="/agent" className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-primary-500 to-teal-600 p-[2px] shadow-lg shadow-primary-500/30">
                    <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-primary-400/20 to-transparent backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="iconGradientAgent" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#e0f7fa" />
                          </linearGradient>
                        </defs>
                        <circle cx="12" cy="12" r="9" stroke="url(#iconGradientAgent)" strokeWidth="1.5" fill="none" />
                        <circle cx="12" cy="12" r="3.5" stroke="url(#iconGradientAgent)" strokeWidth="1.5" fill="none" />
                        <path stroke="url(#iconGradientAgent)" strokeWidth="1.5" strokeLinecap="round" d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.64 5.64l1.77 1.77M16.59 16.59l1.77 1.77M5.64 18.36l1.77-1.77M16.59 7.41l1.77-1.77" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gradient">HelpDeskPro</span>
                </Link>
                <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold uppercase tracking-wide">
                  Agent Portal
                </span>
                <nav className="hidden md:flex space-x-1">
                  <Link
                    href="/agent"
                    className="text-gray-400 hover:text-primary-400 hover:bg-dark-card/50 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    All Tickets
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card/50 border border-dark-border/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-gray-300">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
