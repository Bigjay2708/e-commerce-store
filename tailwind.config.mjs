import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',   // blue-800
          light: '#3b82f6',  // blue-500
        },
        secondary: {
          DEFAULT: '#f59e42', // orange-400
          dark: '#b45309',   // orange-800
          light: '#fbbf24',  // orange-300
        },
        accent: '#10b981', // emerald-500
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: '#f3f4f6', // gray-100
        border: '#e5e7eb', // gray-200
        card: '#fff',
        cardDark: '#18181b',
        error: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'Arial', 'sans-serif'],
        mono: ['Geist Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.08)',
        navbar: '0 2px 8px 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms').then(m => m.default),
    import('@tailwindcss/typography').then(m => m.default),
  ],
};

export default config;
