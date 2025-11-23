'use client';

import React, { useState, useRef, useEffect } from 'react'
import { MenuIcon, X as CloseIcon, Globe2Icon, UserIcon, SettingsIcon, ClockIcon, LogOutIcon, LogInIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLogout } from '@/hooks/useLogout'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { useAuth as useLocalAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const { handleLogout, isLoggingOut } = useLogout()
  const { user: clerkUser, isLoaded } = useUser()
  const { isSignedIn } = useClerkAuth()
  const { isAuthenticated, user: localUser } = useLocalAuth()
  
  // Use Clerk user if available, otherwise use local auth
  const user = clerkUser || localUser
  const isUserSignedIn = isSignedIn || isAuthenticated

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/plan', label: 'Plan Trip' },
    { href: '/about', label: 'About' }
  ]

  const profileLinks = [
    { href: '/profile', label: 'Your profile', icon: UserIcon },
    { href: '/profile/settings', label: 'Settings', icon: SettingsIcon },
    { href: '/profile/history', label: 'History', icon: ClockIcon },
  ]

  const linkClasses = "text-gray-800 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:bg-blue-600 py-1"
  const activeLinkClasses = "text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600 py-1"

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown when user logs out
  useEffect(() => {
    if (!isUserSignedIn) {
      setIsProfileOpen(false)
    }
  }, [isUserSignedIn])

  return (
    <header className="sticky top-0 z-[100] bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="relative flex items-center">
          <img 
            src="/images/neyala-logo.png" 
            alt="Nyala - AI Travel Planner" 
            className="h-12 w-auto"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? activeLinkClasses : linkClasses}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Profile Section - Desktop */}
        {(isLoaded || isAuthenticated) && (
          <div className="hidden md:block relative" ref={profileDropdownRef}>
            {isUserSignedIn && user ? (
              <button 
                onClick={() => {
                  setIsProfileOpen(prev => !prev);
                }}
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-gray-700">
                  {user.firstName || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                </span>
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <LogInIcon className="h-5 w-5" />
                <span className="text-gray-700">Sign In</span>
              </Link>
            )}

            {/* Profile Dropdown */}
            {isProfileOpen && isUserSignedIn && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-[9999]">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-medium">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.emailAddresses?.[0]?.emailAddress || 'User'
                    }
                  </p>
                </div>
                {profileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2">
                  <button 
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50"
                    onClick={() => {
                      setIsProfileOpen(false)
                      handleLogout()
                    }}
                    disabled={isLoggingOut}
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-md">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${pathname === link.href ? activeLinkClasses : linkClasses} w-fit`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isUserSignedIn && user && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-sm text-gray-500 mb-1">Signed in as</p>
                <p className="font-medium mb-3">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.emailAddresses?.[0]?.emailAddress || 'User'
                  }
                </p>
                {profileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                ))}
                <button 
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600 w-full mt-2 disabled:opacity-50"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            )}
            {!isUserSignedIn && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/sign-in"
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogInIcon className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
