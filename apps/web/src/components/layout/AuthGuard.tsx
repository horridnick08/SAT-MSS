'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialize } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initialize();
    setIsReady(true);
  }, [initialize]);

  useEffect(() => {
    if (!isReady) return;

    const isAuthRoute = pathname.startsWith('/login');

    if (!isAuthenticated && !isAuthRoute) {
      router.push('/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.push('/');
    }
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady || (!isAuthenticated && !pathname.startsWith('/login'))) {
    // Return a dark background loader matching the design system
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#06080D] text-[#E8EAF0]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E88C30] border-t-transparent" />
          <span className="font-display text-xs tracking-widest text-[#8A9BBB]">INITIALIZING SYSTEM</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
