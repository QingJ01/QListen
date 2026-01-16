'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import type { Track } from '@/lib/types';
import { storage } from '@/lib/utils';

// =============================================================================
// Context Types
// =============================================================================

interface FavoritesContextValue {
    favorites: Track[];
    addFavorite: (track: Track) => void;
    removeFavorite: (trackId: string, platform: string) => void;
    toggleFavorite: (track: Track) => void;
    isFavorite: (trackId: string, platform: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = 'favorites';

// =============================================================================
// Provider Component
// =============================================================================

interface FavoritesProviderProps {
    children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
    const [favorites, setFavorites] = useState<Track[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const saved = storage.get<Track[]>(STORAGE_KEY, []);
        setFavorites(saved);
    }, []);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        storage.set(STORAGE_KEY, favorites);
    }, [favorites]);

    const addFavorite = useCallback((track: Track) => {
        setFavorites((prev) => {
            const exists = prev.some(
                (t) => t.id === track.id && t.platform === track.platform
            );
            if (exists) return prev;
            return [...prev, track];
        });
    }, []);

    const removeFavorite = useCallback((trackId: string, platform: string) => {
        setFavorites((prev) =>
            prev.filter((t) => !(t.id === trackId && t.platform === platform))
        );
    }, []);

    const isFavorite = useCallback(
        (trackId: string, platform: string) => {
            return favorites.some(
                (t) => t.id === trackId && t.platform === platform
            );
        },
        [favorites]
    );

    const toggleFavorite = useCallback(
        (track: Track) => {
            if (isFavorite(track.id, track.platform)) {
                removeFavorite(track.id, track.platform);
            } else {
                addFavorite(track);
            }
        },
        [isFavorite, removeFavorite, addFavorite]
    );

    const value: FavoritesContextValue = {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
