'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    X,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverUrl, getLyrics } from '@/lib/api';
import { parseLrc, type LyricLine, formatTime } from '@/lib/utils';
import styles from './FullScreenPlayer.module.css';

interface FullScreenPlayerProps {
    onClose: () => void;
}

export function FullScreenPlayer({ onClose }: FullScreenPlayerProps) {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        next,
        prev,
        currentTime,
        duration,
        seek,
        isLoading
    } = usePlayer();

    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [lyricLoading, setLyricLoading] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubTime, setScrubTime] = useState(0);

    const activeLineRef = useRef<HTMLDivElement>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Sync scrubTime when not scrubbing
    useEffect(() => {
        if (!isScrubbing) {
            setScrubTime(currentTime);
        }
    }, [currentTime, isScrubbing]);

    // Fetch lyrics
    useEffect(() => {
        if (!currentTrack) return;

        async function fetchLyrics() {
            setLyricLoading(true);
            try {
                const lrcText = await getLyrics(currentTrack!.id, currentTrack!.platform);
                const parsed = parseLrc(lrcText);
                setLyrics(parsed);
            } catch {
                setLyrics([]);
            } finally {
                setLyricLoading(false);
            }
        }

        // Reset lyrics first
        setLyrics([]);
        fetchLyrics();
    }, [currentTrack]);

    // Find active line
    const activeLineIndex = lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    // Auto scroll lyrics
    useEffect(() => {
        if (activeLineRef.current && lyricsContainerRef.current) {
            activeLineRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeLineIndex]);

    // Format helpers
    const coverUrl = currentTrack
        ? (currentTrack.cover || getCoverUrl(currentTrack.id, currentTrack.platform))
        : '';

    const progressPercent = duration > 0 ? ((isScrubbing ? scrubTime : currentTime) / duration) * 100 : 0;

    if (!currentTrack) return null;

    return (
        <div className={styles.container}>
            {/* Background Blur */}
            <div className={styles.background}>
                <img src={coverUrl} alt="" className={styles.blurImage} />
            </div>

            {/* Header */}
            <div className={styles.header}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <ChevronDown size={28} />
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Left: Cover & Info */}
                <div className={styles.leftColumn}>
                    <div className={styles.coverWrapper}>
                        <img
                            src={coverUrl}
                            alt={currentTrack.name}
                            className={styles.coverImage}
                        />
                    </div>
                    <div className={styles.trackInfo}>
                        <div className={styles.songTitle}>{currentTrack.name}</div>
                        <div className={styles.artistName}>{currentTrack.artist}</div>
                        <div className={styles.albumName}>{currentTrack.album || '未知专辑'}</div>
                    </div>
                </div>

                {/* Right: Lyrics */}
                <div className={styles.rightColumn}>
                    <div className={styles.lyricsContainer} ref={lyricsContainerRef}>
                        {lyricLoading ? (
                            <div className={styles.lyricLine}>加载歌词中...</div>
                        ) : lyrics.length === 0 ? (
                            <div className={styles.lyricLine}>暂无歌词</div>
                        ) : (
                            lyrics.map((line, index) => (
                                <div
                                    key={index}
                                    ref={index === activeLineIndex ? activeLineRef : null}
                                    className={`${styles.lyricLine} ${index === activeLineIndex ? styles.active : ''}`}
                                    onClick={() => seek(line.time)}
                                >
                                    {line.text}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer with Controls */}
            <div className={styles.controls}>
                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                    <div className={styles.timeLabels}>
                        <span className={styles.time}>{formatTime(isScrubbing ? scrubTime : currentTime)}</span>
                        <span className={styles.time}>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={isScrubbing ? scrubTime : currentTime}
                        onChange={(e) => {
                            setScrubTime(Number(e.target.value));
                        }}
                        onMouseDown={() => setIsScrubbing(true)}
                        onMouseUp={(e) => {
                            setIsScrubbing(false);
                            seek(Number(e.currentTarget.value));
                        }}
                        onTouchStart={() => setIsScrubbing(true)}
                        onTouchEnd={(e) => {
                            setIsScrubbing(false);
                            seek(Number(e.currentTarget.value));
                        }}
                        className={styles.progressBar}
                        style={{
                            background: `linear-gradient(to right, #fff 0%, #fff ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`
                        }}
                    />
                </div>

                {/* Buttons */}
                <div className={styles.buttons}>
                    <button className={styles.secBtn} onClick={prev} title="上一首">
                        <SkipBack size={36} strokeWidth={1.5} />
                    </button>

                    <button
                        className={styles.mainBtn}
                        onClick={togglePlay}
                    >
                        {isLoading ? (
                            <Loader2 size={32} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={32} fill="currentColor" strokeWidth={0} />
                        ) : (
                            <Play size={32} fill="currentColor" strokeWidth={0} style={{ marginLeft: 4 }} />
                        )}
                    </button>

                    <button className={styles.secBtn} onClick={next} title="下一首">
                        <SkipForward size={36} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
