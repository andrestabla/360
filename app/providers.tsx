'use client';
import { AppProvider } from '@/context/AppContext';
import { UIProvider } from '@/context/UIContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <UIProvider>
                {children}
            </UIProvider>
        </AppProvider>
    );
}
