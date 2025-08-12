'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              NEYALA.AI
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${
                isActive('/about') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              } transition-colors`}
            >
              About
            </Link>
            <Link
              href="/plan"
              className={`${
                isActive('/plan') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              } transition-colors`}
            >
              Plan Trip
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Welcome, {user.firstName || 'User'}
                </span>
                <SignOutButton>
                  <button className="text-gray-600 hover:text-red-600 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 