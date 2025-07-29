import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}


const getInitialTheme = (): 'light' | 'dark' => {
  // Only run on client
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light', // Always use 'light' for SSR, hydrate on client
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
    set({ theme });
  },
}));

// Call this in a useEffect in your top-level layout or ThemeProvider to sync theme after mount
export const hydrateTheme = (setTheme: (theme: 'light' | 'dark') => void) => {
  if (typeof window !== 'undefined') {
    setTheme(getInitialTheme());
  }
};
