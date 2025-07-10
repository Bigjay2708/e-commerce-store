"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSession, signOut } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { useThemeStore } from '@/store/theme';

const Navbar = () => {
  const { cart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className={`sticky top-0 z-50 bg-background/80 dark:bg-background/80 shadow-navbar backdrop-blur-xl border-b border-border`}> 
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-primary dark:text-primary-light drop-shadow-sm">
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ShopEase</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-base font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/comparison" className="hover:text-primary transition-colors">Compare</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};

export default Navbar;
