import type { Metadata } from 'next';
import '../styles/globals-minimal.css';

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
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-lg">PM</span>
                </div>
                <span className="text-xl font-semibold text-black">PM Simulator</span>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  Dashboard
                </a>
                <a href="/simulations" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  Simulations
                </a>
                <a href="/analytics" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  Analytics
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </header>

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
                <a href="/docs" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Documentation
                </a>
                <a href="/help" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
