"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSession, signOut } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaHeart, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { useThemeStore } from '@/store/theme';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { cart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  // Animated Hamburger Icon Component
  const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
    <div className="relative w-6 h-6 flex flex-col justify-center items-center">
      <span 
        className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
        }`}
      />
      <span 
        className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span 
        className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
          isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
        }`}
      />
    </div>
  );

  return (
    <header className={`sticky top-0 z-50 bg-background/80 dark:bg-background/80 shadow-navbar backdrop-blur-xl border-b border-border`}> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-primary dark:text-primary-light drop-shadow-sm">
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ShopEase</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/comparison" className="hover:text-primary transition-colors">Compare</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border bg-muted text-primary hover:bg-primary hover:text-white transition-colors"
          >
            {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
          <Link href="/wishlist" className="relative group p-2 text-primary hover:bg-accent/10 rounded-full transition">
            <FaHeart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative group p-2 text-primary hover:bg-accent/10 rounded-full transition">
            <FaShoppingCart size={20} />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                {cart.totalItems}
              </span>
            )}
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="p-2 text-primary hover:bg-accent/10 rounded-full transition">
                <FaUser size={20} />
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 text-primary hover:bg-error/10 rounded-full transition"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="p-2 text-primary hover:bg-accent/10 rounded-full transition">
              <FaSignInAlt size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-full text-primary hover:bg-accent/10 transition-colors"
          >
            {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
          <Link href="/cart" className="relative p-2 text-primary hover:bg-accent/10 rounded-full transition">
            <FaShoppingCart size={18} />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center border border-background">
                {cart.totalItems}
              </span>
            )}
          </Link>
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className="p-3 text-primary hover:bg-accent/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <HamburgerIcon isOpen={mobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Window */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full right-4 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 mobile-dropdown-menu transform transition-all duration-200 ease-out origin-top-right ${
          mobileMenuOpen 
            ? 'scale-100 opacity-100 translate-y-2' 
            : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
          <button
            onClick={closeMobileMenu}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="p-4 space-y-1 max-h-[70vh] overflow-y-auto mobile-menu-scroll">
          {/* Navigation Links */}
          <div className="space-y-1">
            <Link 
              href="/" 
              className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
              onClick={closeMobileMenu}
            >
              <span className="w-5 text-center">🏠</span>
              Home
            </Link>
            <Link 
              href="/products" 
              className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
              onClick={closeMobileMenu}
            >
              <span className="w-5 text-center">🛍️</span>
              Products
            </Link>
            <Link 
              href="/comparison" 
              className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
              onClick={closeMobileMenu}
            >
              <span className="w-5 text-center">⚖️</span>
              Compare
            </Link>
            <Link 
              href="/wishlist" 
              className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
              onClick={closeMobileMenu}
            >
              <FaHeart size={16} className="w-5 text-center" />
              <span className="flex-1">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link 
              href="/about" 
              className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
              onClick={closeMobileMenu}
            >
              <span className="w-5 text-center">ℹ️</span>
              About
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

          {/* User Section */}
          <div className="space-y-1">
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="mobile-menu-item flex items-center gap-3 text-base font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 py-2.5 px-3 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  <FaUser size={16} className="w-5 text-center" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="mobile-menu-item w-full flex items-center gap-3 text-base font-medium hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 py-2.5 px-3 rounded-lg text-left"
                >
                  <FaSignOutAlt size={16} className="w-5 text-center" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="mobile-menu-item flex items-center gap-3 text-base font-medium text-white bg-primary hover:bg-primary-dark transition-all duration-200 py-2.5 px-3 rounded-lg"
                onClick={closeMobileMenu}
              >
                <FaSignInAlt size={16} className="w-5 text-center" />
                Sign In
              </Link>
            )}
          </div>

          {/* Cart Summary */}
          {cart.totalItems > 0 && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cart</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Menu Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>ShopEase</span>
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
