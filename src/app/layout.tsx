import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'PM Simulator - AI-Powered Product Market Simulation',
  description: 'Simulate, validate, and test your product ideas with 10K+ AI agents before going live',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <UserProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Background Effects */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Top gradient orb */}
                <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                {/* Bottom right orb */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-30" />
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                  }}
                />
              </div>

              {/* Header */}
              <Header />

              {/* Main Content */}
              <main className="relative flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="relative border-t border-border/50 glass mt-auto">
                <div className="container mx-auto px-6 py-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">PM</span>
                      </div>
                      <span className="text-lg font-semibold text-gradient">Simulator</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      © 2026 PM Simulator. Simulate before you build.
                    </p>
                    <div className="flex items-center gap-6">
                      <Link href="/docs" className="text-sm text-gray-400 hover:text-foreground transition-colors">
                        Documentation
                      </Link>
                      <Link href="/help" className="text-sm text-gray-400 hover:text-foreground transition-colors">
                        Help Center
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
