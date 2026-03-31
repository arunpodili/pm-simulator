"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  teamSize: string;
}

interface UserContextType {
  profile: UserProfile | null;
  isOnboarded: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'pm_simulator_user_profile';

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load profile from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates } as UserProfile;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const completeOnboarding = (fullProfile: UserProfile) => {
    setProfile(fullProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        isOnboarded: !!profile,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
