// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/constants';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={ROUTES.SEARCH} className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">Content Plus</h1>
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                href={ROUTES.SEARCH}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Search
              </Link>
              <Link
                href={ROUTES.UPLOAD}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Upload
              </Link>
              <Link
                href={ROUTES.DASHBOARD}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
