'use client';
import { AppProvider } from '@/context/AppContext';
import { UIProvider } from '@/context/UIContext';
import { ThemeManager } from '@/components/ThemeManager';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            {/* ThemeManager removed to lock app to light mode/default styles */}
            <UIProvider>
                {children}
            </UIProvider>
        </AppProvider>
    );
}
