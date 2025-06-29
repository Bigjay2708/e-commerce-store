import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Navbar from "@/components/ui/Navbar";
import { useThemeStore } from '@/store/theme';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopEase - Modern E-Commerce Store",
  description: "A modern e-commerce store built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useThemeStore();
  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen transition-colors duration-300`}>
        <SessionProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="min-h-screen pt-4 pb-12">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
