"use client";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/navigation';
import { Toaster } from 'sonner';

function NavigationWithAuth() {
  const { user } = useAuth();
  return user ? <Navigation /> : null;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationWithAuth />
        <main>{children}</main>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
} 