'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export function ThemeManager() {
    const { currentUser } = useApp();

    useEffect(() => {
        // Theme Mode
        const theme = currentUser?.preferences?.theme || 'system';
        const root = document.documentElement;

        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            applyTheme(theme === 'dark');
        }
    }, [currentUser?.preferences?.theme]);

    // Apply Branding Colors
    const { platformSettings } = useApp();
    useEffect(() => {
        if (platformSettings?.branding?.primaryColor) {
            document.documentElement.style.setProperty('--primary', platformSettings.branding.primaryColor);
        }
    }, [platformSettings?.branding?.primaryColor]);

    return null;
}
