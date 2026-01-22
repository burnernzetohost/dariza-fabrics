'use client';

import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useCart } from '../context/CartContext';

// Load the font
const lushFont = localFont({
  src: '../app/fonts/LushRefinementREGULAR.ttf',
  display: 'swap',
});

export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);

  // Handle delayed unmount to preserve exit animation
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuRendered(true);
    } else {
      const timer = setTimeout(() => {
        setIsMenuRendered(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">

          {/* Left Side: Desktop Links & Mobile Logo */}
          <div className="flex items-center">
            {/* Desktop Nav Links */}
            <div className="hidden sm:flex space-x-8 text-xs font-medium tracking-widest uppercase text-gray-600">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <Link href="/about" className="hover:text-black transition-colors">About</Link>
            </div>

            {/* Mobile Logo */}
            <Link
              href="/"
              className={`${lushFont.className} sm:hidden text-3xl text-black mt-1`}
              style={{ fontWeight: 'normal' }}
              onClick={() => setIsMenuOpen(false)}
            >
              DARZIA FABRICS
            </Link>
          </div>

          {/* Center: Desktop Logo */}
          <div className="hidden sm:flex flex-shrink-0 items-center justify-center absolute left-1/2 transform -translate-x-1/2 tracking-wide mt-1">
            <Link
              href="/"
              className={`${lushFont.className} text-3xl text-black`}
              style={{ fontWeight: 'normal' }}
            >
              DARZIA FABRICS
            </Link>
          </div>

          {/* Right Side: Icons & Mobile Menu */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Search className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer transition-colors" />

            <User className="h-5 w-5 text-gray-500 hover:text-black cursor-pointer transition-colors hidden sm:block" />

            <Link href="/cart" className="relative group">
              <ShoppingBag className="h-5 w-5 text-gray-500 group-hover:text-black cursor-pointer transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#012d20] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in fade-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-black focus:outline-none z-50 relative"
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
      {isMenuRendered && (
        <div
          className={`fixed inset-0 z-40 bg-white transform transition-all duration-300 ease-in-out sm:hidden ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
            }`}
          style={{ top: '80px', height: 'calc(100vh - 80px)' }} // Explicit height and top
        >
          <div className="flex flex-col p-8 space-y-6 text-center h-full bg-white">
            <Link
              href="/"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="#"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In / Sign Up
            </Link>
            <Link
              href="/about"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-xl font-medium uppercase tracking-widest text-gray-800 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}