'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Sparkles, LayoutDashboard, Play, BookOpen, Code, User, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/simulate', label: 'New Simulation', icon: Sparkles },
  { href: '/templates', label: 'Templates', icon: BookOpen },
  { href: '/docs', label: 'Docs', icon: Code },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow group-hover:shadow-glow transition-shadow duration-300">
              <span className="text-primary-foreground font-bold text-sm">PM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gradient leading-tight">Simulator</span>
              <span className="text-[10px] text-gray-400 leading-tight">v2.0</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated && navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary-light border border-primary/20'
                      : 'text-gray-300 hover:text-foreground hover:bg-surface-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <>
                <Link
                  href="/demo"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-foreground hover:bg-surface-muted transition-all"
                >
                  <Play className="w-4 h-4" />
                  Demo
                </Link>
                <Link
                  href="/docs"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-foreground hover:bg-surface-muted transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Docs
                </Link>
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-muted">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{user?.name || user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-400 hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="btn-gold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
