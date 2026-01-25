'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Music, Loader2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { getLyrics } from '@/lib/api';
import { parseLrc, type LyricLine } from '@/lib/utils';
import styles from './Lyrics.module.css';

interface LyricsProps {
    onClose?: () => void;
    isModal?: boolean;
}

export function Lyrics({ onClose, isModal = false }: LyricsProps) {
    const { currentTrack, currentTime, seek } = usePlayer();
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Fetch lyrics when track changes
    useEffect(() => {
        if (!currentTrack) {
            setLyrics([]);
            return;
        }

        async function fetchLyrics() {
            setLoading(true);
            setError(false);
            try {
                const lrcText = await getLyrics(currentTrack!.id, currentTrack!.platform);
                const parsed = parseLrc(lrcText);
                setLyrics(parsed);
            } catch {
                // Lyrics not available is common, don't log to console
                setError(true);
                setLyrics([]);
            } finally {
                setLoading(false);
            }
        }

        fetchLyrics();
    }, [currentTrack?.id, currentTrack?.platform]);

    // Find current active line
    const activeLine = lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && contentRef.current) {
            const container = contentRef.current;
            const element = activeLineRef.current;
            const containerHeight = container.clientHeight;
            const elementTop = element.offsetTop;
            const elementHeight = element.clientHeight;

            container.scrollTo({
                top: elementTop - containerHeight / 2 + elementHeight / 2,
                behavior: 'smooth',
            });
        }
    }, [activeLine]);

    // Click on lyric line to seek
    const handleLineClick = useCallback(
        (time: number) => {
            seek(time);
        },
        [seek]
    );

    const content = (
        <div className={styles.lyrics}>
            <div className={styles.header}>
                <div className={styles.trackInfo}>
                    {currentTrack && (
                        <>
                            <div className={styles.cover}>
                                {currentTrack.cover ? (
                                    <img
                                        src={currentTrack.cover}
                                        alt={currentTrack.name}
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <div className={styles.coverPlaceholder}>
                                        <Music size={24} />
                                    </div>
                                )}
                            </div>
                            <div className={styles.meta}>
                                <div className={styles.title}>{currentTrack.name}</div>
                                <div className={styles.artist}>{currentTrack.artist}</div>
                            </div>
                        </>
                    )}
                </div>
                {onClose && (
                    <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
                        <X size={20} />
                    </button>
                )}
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <Loader2 size={32} className="animate-spin" />
                </div>
            ) : !currentTrack ? (
                <div className={styles.empty}>
                    <Music size={48} className={styles.emptyIcon} />
                    <p>暂无播放内容</p>
                </div>
            ) : lyrics.length === 0 ? (
                <div className={styles.empty}>
                    <Music size={48} className={styles.emptyIcon} />
                    <p>{error ? '歌词加载失败' : '暂无歌词'}</p>
                </div>
            ) : (
                <div ref={contentRef} className={styles.content}>
                    {lyrics.map((line, index) => (
                        <div
                            key={`${line.time}-${index}`}
                            ref={index === activeLine ? activeLineRef : null}
                            className={`${styles.line} ${index === activeLine
                                ? styles.active
                                : index < activeLine
                                    ? styles.passed
                                    : ''
                                }`}
                            onClick={() => handleLineClick(line.time)}
                        >
                            {line.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {content}
                </div>
            </div>
        );
    }

    return content;
}
