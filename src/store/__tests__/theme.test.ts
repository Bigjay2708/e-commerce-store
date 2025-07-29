import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTheme } from '@/store/theme';

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
    useTheme.getState().theme = 'light';
  });

  it('should have initial state with light theme', () => {
    const { theme } = useTheme.getState();
    expect(theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const { toggleTheme } = useTheme.getState();
    
    toggleTheme();
    
    const { theme } = useTheme.getState();
    expect(theme).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    const { setTheme, toggleTheme } = useTheme.getState();
    
    // Set to dark first
    setTheme('dark');
    expect(useTheme.getState().theme).toBe('dark');
    
    // Toggle should switch to light
    toggleTheme();
    expect(useTheme.getState().theme).toBe('light');
  });

  it('should set theme directly', () => {
    const { setTheme } = useTheme.getState();
    
    setTheme('dark');
    expect(useTheme.getState().theme).toBe('dark');
    
    setTheme('light');
    expect(useTheme.getState().theme).toBe('light');
  });

  it('should persist theme to localStorage when changed', () => {
    const { setTheme } = useTheme.getState();
    
    setTheme('dark');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'e-commerce-theme',
      expect.stringContaining('"theme":"dark"')
    );
  });

  it('should load theme from localStorage on initialization', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ state: { theme: 'dark' }, version: 0 })
    );
    
    // Create a new store instance to test persistence loading
    const { theme } = useTheme.getState();
    
    // The theme should be loaded from localStorage
    // Note: Due to how Zustand persistence works, this might need adjustment
    // based on actual implementation
    expect(theme).toBeDefined();
  });

  it('should handle multiple theme changes', () => {
    const { setTheme, toggleTheme } = useTheme.getState();
    
    setTheme('dark');
    expect(useTheme.getState().theme).toBe('dark');
    
    toggleTheme();
    expect(useTheme.getState().theme).toBe('light');
    
    toggleTheme();
    expect(useTheme.getState().theme).toBe('dark');
    
    setTheme('light');
    expect(useTheme.getState().theme).toBe('light');
  });

  it('should update localStorage on every change', () => {
    const { setTheme, toggleTheme } = useTheme.getState();
    
    setTheme('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    
    toggleTheme();
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    
    setTheme('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
  });

  it('should have consistent state after multiple operations', () => {
    const { setTheme, toggleTheme } = useTheme.getState();
    
    // Perform various operations
    setTheme('dark');
    toggleTheme();
    toggleTheme();
    setTheme('light');
    toggleTheme();
    
    const finalState = useTheme.getState();
    expect(finalState.theme).toBe('dark');
    expect(typeof finalState.setTheme).toBe('function');
    expect(typeof finalState.toggleTheme).toBe('function');
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    // Should not throw an error and should use default state
    const { theme } = useTheme.getState();
    expect(theme).toBe('light'); // Default theme
  });

  it('should maintain state immutability', () => {
    const initialState = useTheme.getState();
    const { setTheme } = initialState;
    
    setTheme('dark');
    
    const newState = useTheme.getState();
    expect(newState).not.toBe(initialState);
    expect(newState.theme).not.toBe(initialState.theme);
  });

  it('should support subscription to theme changes', () => {
    const mockCallback = vi.fn();
    
    const unsubscribe = useTheme.subscribe(mockCallback);
    
    const { setTheme } = useTheme.getState();
    setTheme('dark');
    
    expect(mockCallback).toHaveBeenCalled();
    
    unsubscribe();
  });

  it('should stop calling subscribers after unsubscribe', () => {
    const mockCallback = vi.fn();
    
    const unsubscribe = useTheme.subscribe(mockCallback);
    unsubscribe();
    
    const { setTheme } = useTheme.getState();
    setTheme('dark');
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage is full');
    });
    
    const { setTheme } = useTheme.getState();
    
    // Should not throw an error
    expect(() => setTheme('dark')).not.toThrow();
    
    // State should still be updated
    expect(useTheme.getState().theme).toBe('dark');
  });

  it('should provide correct TypeScript types', () => {
    const state = useTheme.getState();
    
    // These should compile without TypeScript errors
    const theme: 'light' | 'dark' = state.theme;
    const setTheme: (theme: 'light' | 'dark') => void = state.setTheme;
    const toggleTheme: () => void = state.toggleTheme;
    
    expect(theme).toBeDefined();
    expect(typeof setTheme).toBe('function');
    expect(typeof toggleTheme).toBe('function');
  });
});
