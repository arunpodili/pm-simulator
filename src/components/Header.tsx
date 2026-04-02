'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <span className="text-xl font-semibold text-black">PM Simulator</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/simulate"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Simulate
                </Link>
                <Link
                  href="/demo"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="/api-integration"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  API
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/demo"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="/docs"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Docs
                </Link>
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user?.name}
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
