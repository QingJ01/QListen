'use client';

import { useRef, useState, useCallback } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Music,
    Loader2,
    Download,
    ChevronDown,
    Repeat,
    Repeat1,
    Shuffle,
    ListOrdered,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useLyrics } from '@/context/LyricsContext';
import { formatTime } from '@/lib/utils';
import { getCoverUrl, getSongUrl } from '@/lib/api';
import type { AudioQuality } from '@/lib/types';
import styles from './PlayerBar.module.css';

const QUALITY_OPTIONS: { value: AudioQuality; label: string }[] = [
    { value: '128k', label: '标准 128k' },
    { value: '320k', label: '高品质 320k' },
    { value: 'flac', label: '无损 FLAC' },
];

export function PlayerBar() {
    const {
        isPlaying,
        currentTrack,
        volume,
        currentTime,
        duration,
        isLoading,
        audioQuality,
        playMode,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        setAudioQuality,
        cyclePlayMode,
    } = usePlayer();

    const { toggleFullScreen } = useLyrics();

    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const [prevVolume, setPrevVolume] = useState(1);
    const [showQualityMenu, setShowQualityMenu] = useState(false);

    // Progress bar click handler
    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!progressRef.current || !duration) return;
            const rect = progressRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seek(percent * duration);
        },
        [duration, seek]
    );

    // Volume slider click handler
    const handleVolumeClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!volumeRef.current) return;
            const rect = volumeRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            setVolume(Math.max(0, Math.min(1, percent)));
        },
        [setVolume]
    );

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (volume > 0) {
            setPrevVolume(volume);
            setVolume(0);
        } else {
            setVolume(prevVolume || 0.5);
        }
    }, [volume, prevVolume, setVolume]);

    // Download current track
    const handleDownload = useCallback(() => {
        if (!currentTrack) return;
        const url = getSongUrl(currentTrack.id, currentTrack.platform, audioQuality);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentTrack.name} - ${currentTrack.artist}.mp3`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [currentTrack, audioQuality]);

    // Quality change handler
    const handleQualityChange = useCallback(
        (quality: AudioQuality) => {
            setAudioQuality(quality);
            setShowQualityMenu(false);
        },
        [setAudioQuality]
    );

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={styles.playerBar}>
            {/* Left - Track Info */}
            <div
                className={styles.trackInfo}
                onClick={toggleFullScreen}
                style={{ cursor: 'pointer' }}
                title="进入全屏模式"
            >
                {currentTrack ? (
                    <>
                        <div className={styles.cover}>
                            {currentTrack.cover ? (
                                <img
                                    src={currentTrack.cover}
                                    alt={currentTrack.name}
                                    className={styles.coverImage}
                                />
                            ) : (
                                <img
                                    src={getCoverUrl(currentTrack.id, currentTrack.platform)}
                                    alt={currentTrack.name}
                                    className={styles.coverImage}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <div className={styles.meta}>
                            <div className={styles.title}>{currentTrack.name}</div>
                            <div className={styles.artist}>{currentTrack.artist}</div>
                        </div>
                    </>
                ) : (
                    <div className={styles.cover}>
                        <div className={styles.coverPlaceholder}>
                            <Music size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                )}
            </div>

            {/* Center - Controls */}
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    {/* Play Mode Button Removed from here */}

                    <button
                        className={styles.controlBtn}
                        onClick={prev}
                        disabled={!currentTrack}
                        aria-label="上一首"
                    >
                        <SkipBack size={20} strokeWidth={1.5} />
                    </button>

                    <button
                        className={`${styles.controlBtn} ${styles.playBtn} ${isLoading ? styles.loading : ''}`}
                        onClick={togglePlay}
                        disabled={!currentTrack}
                        aria-label={isPlaying ? '暂停' : '播放'}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={20} fill="currentColor" strokeWidth={0} />
                        ) : (
                            <Play size={20} fill="currentColor" strokeWidth={0} style={{ marginLeft: 2 }} />
                        )}
                    </button>

                    <button
                        className={styles.controlBtn}
                        onClick={next}
                        disabled={!currentTrack}
                        aria-label="下一首"
                    >
                        <SkipForward size={20} strokeWidth={1.5} />
                    </button>
                </div>

                <div className={styles.progressContainer}>
                    <span className={`${styles.time} ${styles.timeStart}`}>
                        {formatTime(currentTime)}
                    </span>
                    <div
                        ref={progressRef}
                        className={styles.progressTrack}
                        onClick={handleProgressClick}
                    >
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={`${styles.time} ${styles.timeEnd}`}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Right - Volume & Actions */}
            <div className={styles.actions}>
                {/* Play Mode Button */}
                <button
                    className={`${styles.modeBtn} ${playMode !== 'sequential' ? styles.active : ''}`}
                    onClick={cyclePlayMode}
                    aria-label="切换播放模式"
                    title={{
                        sequential: '顺序播放',
                        loop: '列表循环',
                        loopOne: '单曲循环',
                        shuffle: '随机播放',
                    }[playMode]}
                >
                    {playMode === 'shuffle' && <Shuffle size={18} />}
                    {playMode === 'loopOne' && <Repeat1 size={18} />}
                    {playMode === 'loop' && <Repeat size={18} />}
                    {playMode === 'sequential' && <ListOrdered size={18} />}
                </button>

                <div className={styles.volumeControl}>
                    <button
                        className={styles.volumeBtn}
                        onClick={toggleMute}
                        aria-label={volume === 0 ? '取消静音' : '静音'}
                    >
                        {volume === 0 ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
                    </button>
                    <div
                        ref={volumeRef}
                        className={styles.volumeSlider}
                        onClick={handleVolumeClick}
                    >
                        <div
                            className={styles.volumeFill}
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>

                {/* Quality Selector */}
                <div className={styles.qualitySelector}>
                    <button
                        className={styles.qualityBtn}
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                    >
                        <span>{audioQuality}</span>
                        <ChevronDown size={14} />
                    </button>
                    {showQualityMenu && (
                        <div className={styles.qualityMenu}>
                            {QUALITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`${styles.qualityOption} ${audioQuality === opt.value ? styles.active : ''}`}
                                    onClick={() => handleQualityChange(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Download Button */}
                <button
                    className={styles.downloadBtn}
                    onClick={handleDownload}
                    disabled={!currentTrack}
                    aria-label="下载"
                >
                    <Download size={18} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}

