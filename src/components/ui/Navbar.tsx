"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSession, signOut } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaHeart, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { useThemeStore } from '@/store/theme';
import { useState } from 'react';

const Navbar = () => {
  const { cart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary hover:bg-accent/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/" 
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Products
            </Link>
            <Link 
              href="/comparison" 
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Compare Products
            </Link>
            <Link 
              href="/wishlist" 
              className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              <FaHeart size={18} />
              Wishlist {wishlistItems.length > 0 && <span className="bg-error text-white text-xs px-2 py-1 rounded-full">{wishlistItems.length}</span>}
            </Link>
            <Link 
              href="/about" 
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  <FaUser size={18} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-3 text-lg font-medium hover:text-error transition-colors py-2 text-left"
                >
                  <FaSignOutAlt size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                <FaSignInAlt size={18} />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
