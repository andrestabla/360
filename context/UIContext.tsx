'use client';
import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '@/lib/data';

interface UIContextType {
    isSlideOpen: boolean;
    slideType: 'doc' | 'case' | 'post' | null;
    slideData: { id: string; title: string } | null;
    openSlide: (type: 'doc' | 'case' | 'post', id: string, title: string) => void;
    closeSlide: () => void;

    isViewerOpen: boolean;
    viewerTitle: string | null;
    openViewer: (title: string) => void;
    closeViewer: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSlideOpen, setSlideOpen] = useState(false);
    const [slideType, setSlideType] = useState<'doc' | 'case' | 'post' | null>(null);
    const [slideData, setSlideData] = useState<{ id: string; title: string } | null>(null);

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [viewerTitle, setViewerTitle] = useState<string | null>(null);

    const openSlide = (type: 'doc' | 'case' | 'post', id: string, title: string) => {
        setSlideType(type);
        setSlideData({ id, title });
        setSlideOpen(true);
    };

    const closeSlide = () => {
        setSlideOpen(false);
        setTimeout(() => {
            setSlideType(null);
            setSlideData(null);
        }, 300);
    };

    const openViewer = (title: string) => {
        setViewerTitle(title);
        setViewerOpen(true);
    };

    const closeViewer = () => {
        setViewerOpen(false);
        setViewerTitle(null);
    };

    return (
        <UIContext.Provider value={{ isSlideOpen, slideType, slideData, openSlide, closeSlide, isViewerOpen, viewerTitle, openViewer, closeViewer }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
