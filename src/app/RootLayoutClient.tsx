'use client';

import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { LyricsProvider, useLyrics } from '@/context/LyricsContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Sidebar, PlayerBar, FullScreenPlayer, MobileNav } from '@/components/layout';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Lyrics } from '@/components/business';
import Modal from '@/components/common/Modal';
import { usePlayer } from '@/context/PlayerContext';
import { useRouter } from 'next/navigation';

function AppContent({ children }: { children: React.ReactNode }) {
    const { showLyrics, showFullScreen, setShowFullScreen } = useLyrics();
    const { isQuotaExhausted, closeQuotaModal } = usePlayer();
    const router = useRouter();

    const handleGoToAbout = () => {
        closeQuotaModal();
        router.push('/about');
    };

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

            <Modal
                isOpen={isQuotaExhausted}
                onClose={closeQuotaModal}
                title="全站今日API额度已用尽"
                footer={
                    <button
                        onClick={handleGoToAbout}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        关于查看详情
                    </button>
                }
            >
                <p>抱歉，今日全站解析额度已耗尽。</p>
                <p>您可以稍后再试，或者进入关于页面查看详情。</p>
            </Modal>
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
