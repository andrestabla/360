'use client';
import { AppProvider } from '@/context/AppContext';
import { UIProvider } from '@/context/UIContext';
import { ThemeManager } from '@/components/ThemeManager';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <ThemeManager />
            <UIProvider>
                {children}
            </UIProvider>
        </AppProvider>
    );
}
