'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface LyricsContextValue {
    showLyrics: boolean;
    toggleLyrics: () => void;
    setShowLyrics: (show: boolean) => void;
    showFullScreen: boolean;
    setShowFullScreen: (show: boolean) => void;
    toggleFullScreen: () => void;
}

const LyricsContext = createContext<LyricsContextValue | null>(null);

export function LyricsProvider({ children }: { children: ReactNode }) {
    const [showLyrics, setShowLyrics] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const toggleLyrics = () => setShowLyrics((prev) => !prev);
    const toggleFullScreen = () => setShowFullScreen((prev) => !prev);

    return (
        <LyricsContext.Provider value={{
            showLyrics,
            toggleLyrics,
            setShowLyrics,
            showFullScreen,
            setShowFullScreen,
            toggleFullScreen
        }}>
            {children}
        </LyricsContext.Provider>
    );
}

export function useLyrics() {
    const context = useContext(LyricsContext);
    if (!context) {
        throw new Error('useLyrics must be used within a LyricsProvider');
    }
    return context;
}
