import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AuthGate from '@/components/auth/AuthGate';

export const metadata: Metadata = {
  title: 'CareMatrix - Your Home-Care Partner',
  description: 'Providing trusted and compassionate home-care services.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen font-body bg-background antialiased')}>
        <FirebaseClientProvider>
          <AuthGate>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthGate>
          <Chatbot />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
