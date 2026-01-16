'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/utils';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'app-theme';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Load saved theme or specific preference
        const savedTheme = storage.get<Theme>(STORAGE_KEY, 'dark');
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Optional: Handle system preference changes if needed
        // but explicit toggle is often preferred
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            storage.set(STORAGE_KEY, newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
