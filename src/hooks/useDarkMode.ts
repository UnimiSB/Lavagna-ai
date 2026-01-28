import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'prompting-theme';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, isLoaded]);

  const toggle = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const setDark = useCallback((value: boolean) => {
    setIsDark(value);
  }, []);

  return {
    isDark,
    toggle,
    setDark,
    isLoaded
  };
}
