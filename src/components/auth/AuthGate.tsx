'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/provider';

const publicPaths = new Set(['/login', '/signup', '/admin/login', '/admin/signup']);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) return;
    if (!user && !publicPaths.has(pathname || '')) {
      router.replace('/login');
    }
    if (user && publicPaths.has(pathname || '')) {
      router.replace('/');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user && !publicPaths.has(pathname || '')) {
    return null;
  }

  return <>{children}</>;
}
