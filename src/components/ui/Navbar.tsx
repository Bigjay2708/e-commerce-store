"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useSession, signOut } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { cart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ShopEase
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
            </nav>            <div className="flex items-center space-x-4">
              <Link 
                href="/wishlist" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FaHeart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              
              <Link 
                href="/cart" 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FaShoppingCart size={20} />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {session ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/profile" 
                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FaUser size={20} />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaSignInAlt size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
