'use client';

import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { LyricsProvider, useLyrics } from '@/context/LyricsContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Sidebar, PlayerBar, FullScreenPlayer, MobileNav } from '@/components/layout';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Lyrics } from '@/components/business';

function AppContent({ children }: { children: React.ReactNode }) {
    const { showLyrics, showFullScreen, setShowFullScreen } = useLyrics();

    return (
        <div className={`app-layout ${showLyrics ? 'with-lyrics' : ''}`}>
            <ThemeToggle />
            <Sidebar />
            <main className="main-content">{children}</main>
            {showLyrics && (
                <aside className="lyrics-panel">
                    <Lyrics />
                </aside>
            )}
            <PlayerBar />
            <MobileNav />
            {showFullScreen && <FullScreenPlayer onClose={() => setShowFullScreen(false)} />}
        </div>
    );
}

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <PlayerProvider>
                <FavoritesProvider>
                    <LyricsProvider>
                        <AppContent>{children}</AppContent>
                    </LyricsProvider>
                </FavoritesProvider>
            </PlayerProvider>
        </ThemeProvider>
    );
}
