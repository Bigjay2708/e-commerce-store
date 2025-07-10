import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Navbar from "@/components/ui/Navbar";
import ThemeProvider from '@/components/ThemeProvider';
import PageTransition from '@/components/ui/PageTransition';
import ComparisonFloatingButton from '@/components/products/ComparisonFloatingButton';

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen transition-colors duration-300`}>
        <ThemeProvider>
          <SessionProvider>
            <Toaster position="top-center" />
            <Navbar />
            <PageTransition>
              <main className="min-h-screen pt-4 pb-12">
                {children}
              </main>
            </PageTransition>
            <ComparisonFloatingButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
