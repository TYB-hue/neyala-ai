'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Building2, 
  Settings, 
  History, 
  LogOut 
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Your Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Manage Hotels',
      href: '/profile/hotels',
      icon: Building2,
    },
    {
      title: 'Settings',
      href: '/profile/settings',
      icon: Settings,
    },
    {
      title: 'History',
      href: '/profile/history',
      icon: History,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    {item.title}
                  </Link>
                );
              })}
              <SignOutButton>
                <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Log out
                </button>
              </SignOutButton>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white shadow rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 