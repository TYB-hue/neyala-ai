'use client';

import React, { useState, useRef, useEffect } from 'react'
import { MenuIcon, X as CloseIcon, Globe2Icon, UserIcon, HotelIcon, SettingsIcon, ClockIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/plan', label: 'Plan Trip' },
    { href: '/about', label: 'About' }
  ]

  const profileLinks = [
    { href: '/profile', label: 'Your profile', icon: UserIcon },
    { href: '/profile/hotels', label: 'Manage hotels', icon: HotelIcon },
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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Globe2Icon className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-2xl font-bold text-blue-600">NEYALA.AI</span>
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
        <div className="hidden md:block relative" ref={profileDropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-semibold">A</span>
            </div>
            <span className="text-gray-700">Admin</span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 transform opacity-100 scale-100 transition-all duration-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-medium">Admin</p>
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
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setIsProfileOpen(false)
                    // Add logout logic here
                  }}
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>

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
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-sm text-gray-500 mb-1">Signed in as</p>
              <p className="font-medium mb-3">Admin</p>
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
                className="flex items-center py-2 text-gray-700 hover:text-blue-600 w-full mt-2"
                onClick={() => {
                  setIsMenuOpen(false)
                  // Add logout logic here
                }}
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Log out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
} 