import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'PM Simulator - Product Management Simulation',
  description: 'Simulate and validate product decisions before building',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <UserProvider>
            <Header />

            <main className="min-h-screen bg-white">
              {children}
            </main>

            <footer className="border-t border-gray-200 bg-white mt-auto">
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  © 2026 PM Simulator. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="/docs" className="text-sm text-gray-500 hover:text-black transition-colors">
                    Documentation
                  </Link>
                  <Link href="/help" className="text-sm text-gray-500 hover:text-black transition-colors">
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
