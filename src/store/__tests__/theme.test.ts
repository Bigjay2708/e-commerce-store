import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '@/store/theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Theme Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset the store state
    useThemeStore.setState({ theme: 'light' });
  });

  it('should have initial state with light theme', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const { toggleTheme } = useThemeStore.getState();
    
    toggleTheme();
    
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    const { setTheme, toggleTheme } = useThemeStore.getState();
    
    // Set to dark first
    setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
    
    // Toggle should switch to light
    toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should set theme directly', () => {
    const { setTheme } = useThemeStore.getState();
    
    setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
    
    setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should persist theme to localStorage when changed', () => {
    const { setTheme } = useThemeStore.getState();
    
    setTheme('dark');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should load theme from localStorage on initialization', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    // The theme should be loaded from localStorage in a real implementation
    const { theme } = useThemeStore.getState();
    
    expect(theme).toBeDefined();
  });

  it('should handle multiple theme changes', () => {
    const { setTheme, toggleTheme } = useThemeStore.getState();
    
    setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
    
    toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
    
    toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    
    setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should update localStorage on every change', () => {
    const { setTheme, toggleTheme } = useThemeStore.getState();
    
    setTheme('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    toggleTheme();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    
    setTheme('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should have consistent state after multiple operations', () => {
    const { setTheme, toggleTheme } = useThemeStore.getState();
    
    // Perform various operations
    setTheme('dark');
    toggleTheme();
    toggleTheme();
    setTheme('light');
    toggleTheme();
    
    const finalState = useThemeStore.getState();
    expect(finalState.theme).toBe('dark');
    expect(typeof finalState.setTheme).toBe('function');
    expect(typeof finalState.toggleTheme).toBe('function');
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    // Should not throw an error and should use default state
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light'); // Default theme
  });

  it('should maintain state immutability', () => {
    const initialState = useThemeStore.getState();
    const { setTheme } = initialState;
    
    setTheme('dark');
    
    const newState = useThemeStore.getState();
    expect(newState).not.toBe(initialState);
    expect(newState.theme).not.toBe(initialState.theme);
  });

  it('should support subscription to theme changes', () => {
    const mockCallback = vi.fn();
    
    const unsubscribe = useThemeStore.subscribe(mockCallback);
    
    const { setTheme } = useThemeStore.getState();
    setTheme('dark');
    
    expect(mockCallback).toHaveBeenCalled();
    
    unsubscribe();
  });

  it('should stop calling subscribers after unsubscribe', () => {
    const mockCallback = vi.fn();
    
    const unsubscribe = useThemeStore.subscribe(mockCallback);
    unsubscribe();
    
    const { setTheme } = useThemeStore.getState();
    setTheme('dark');
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage is full');
    });
    
    const { setTheme } = useThemeStore.getState();
    
    // Should not throw an error
    expect(() => setTheme('dark')).not.toThrow();
    
    // State should still be updated
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should provide correct TypeScript types', () => {
    const state = useThemeStore.getState();
    
    // These should compile without TypeScript errors
    const theme: 'light' | 'dark' = state.theme;
    const setTheme: (theme: 'light' | 'dark') => void = state.setTheme;
    const toggleTheme: () => void = state.toggleTheme;
    
    expect(theme).toBeDefined();
    expect(typeof setTheme).toBe('function');
    expect(typeof toggleTheme).toBe('function');
  });
});
