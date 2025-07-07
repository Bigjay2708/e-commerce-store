module.exports = {
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
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#f59e42',
          dark: '#b45309',
          light: '#fbbf24',
        },
        accent: '#10b981',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: '#f3f4f6',
        border: '#e5e7eb',
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
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
