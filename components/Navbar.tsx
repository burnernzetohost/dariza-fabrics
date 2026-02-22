'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingBag, Menu, X, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useCart } from '../context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import SearchModal from './SearchModal';

// Load the font
const lushFont = localFont({
  src: '../app/fonts/LushRefinementREGULAR.ttf',
  display: 'swap',
});

export default function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Spacer to preserve layout flow beneath fixed navbar */}
      <div className="h-20 w-full shrink-0" />
      <nav className="fixed w-full top-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">

            {/* Left Side: Desktop Links & Mobile Logo */}
            <div className="flex items-center">
              {/* Desktop Nav Links */}
              <div className="hidden sm:flex space-x-8 text-xs font-medium tracking-widest uppercase text-gray-600">
                <Link href="/" className="hover:text-[#01321F] transition-colors">Home</Link>
                {session && (session.user as any)?.admin ? (
                  <Link href="/admin" className="hover:text-[#01321F] transition-colors">Admin</Link>
                ) : (
                  <>
                    <Link href="/shop" className="hover:text-[#01321F] transition-colors">Shop</Link>
                    <Link href="/about" className="hover:text-[#01321F] transition-colors">About</Link>
                  </>
                )}
              </div>

              {/* Mobile Logo */}
              <Link
                href="/"
                className={`${lushFont.className} sm:hidden text-3xl text-[#01321F] mt-1`}
                style={{ fontWeight: 'normal' }}
                onClick={() => setIsMenuOpen(false)}
              >
                DARIZA FABRICS
              </Link>
            </div>

            {/* Center: Desktop Logo */}
            <div className="hidden sm:flex flex-shrink-0 items-center justify-center absolute left-1/2 transform -translate-x-1/2 tracking-wide mt-1">
              <Link
                href="/"
                className={`${lushFont.className} text-3xl text-[#01321F]`}
                style={{ fontWeight: 'normal' }}
              >
                DARIZA FABRICS
              </Link>
            </div>

            {/* Right Side: Icons & Mobile Menu */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <SearchModal />

              {/* User Menu - Desktop */}
              <div className="relative hidden sm:block" ref={userMenuRef}>
                {session ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-[#01321F] transition-colors"
                    >
                      <User className="h-5 w-5" />
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-[#01321F] truncate">
                            {session.user.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link href="/login">
                    <User className="h-5 w-5 text-gray-500 hover:text-[#01321F] cursor-pointer transition-colors" />
                  </Link>
                )}
              </div>

              <Link href="/cart" className="relative group">
                <ShoppingBag className="h-5 w-5 text-gray-500 group-hover:text-[#01321F] cursor-pointer transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in fade-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="sm:hidden text-[#01321F] focus:outline-none z-50 relative transition-transform duration-300 ease-in-out"
                style={{
                  transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Slide-Over */}
        <div
          className={`fixed inset-0 z-40 bg-white transform transition-all duration-300 ease-in-out sm:hidden ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
            }`}
          style={{ top: '80px', height: 'calc(100vh - 80px)' }}
        >
          <div className="flex flex-col p-8 space-y-6 text-center h-full bg-white">
            <Link
              href="/"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {session && (session.user as any)?.admin ? (
              <Link
                href="/admin"
                className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/shop"
                className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
            )}

            {session ? (
              <>
                <Link
                  href="/profile"
                  className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-xl font-medium uppercase tracking-widest text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In / Sign Up
              </Link>
            )}

            {!((session?.user as any)?.admin) && (
              <>
                <Link
                  href="/about"
                  className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-[#01321F]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
