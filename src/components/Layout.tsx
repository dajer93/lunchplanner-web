'use client';

import Navigation from './Navigation';
import AuthCheck from './AuthCheck';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthCheck>
      <Navigation />
      <main className="container p-4">
        {children}
      </main>
    </AuthCheck>
  );
} 