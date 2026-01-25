'use client';

import {
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react';
import type { Track, PlayerState, AudioQuality, PlayMode, SongInfo } from '@/lib/types';
import { getSongInfo } from '@/lib/api';
import { storage, shuffle } from '@/lib/utils';

// =============================================================================
// Context Types
// =============================================================================

interface PlayerContextValue extends PlayerState {
    // Actions
    play: (track?: Track | null) => void;
    pause: () => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    // Queue management
    setPlaylist: (tracks: Track[], startIndex?: number) => void;
    addToQueue: (track: Track) => void;
    clearQueue: () => void;
    // Audio quality
    audioQuality: AudioQuality;
    setAudioQuality: (quality: AudioQuality) => void;
    // Play mode
    playMode: PlayMode;
    setPlayMode: (mode: PlayMode) => void;
    cyclePlayMode: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

// =============================================================================
// Storage Keys
// =============================================================================

const STORAGE_KEYS = {
    VOLUME: 'player_volume',
    QUALITY: 'player_quality',
    LAST_TRACK: 'player_last_track',
    PLAYLIST: 'player_playlist',
    CURRENT_INDEX: 'player_current_index',
    PLAY_MODE: 'player_play_mode',
};

// =============================================================================
// Provider Component
// =============================================================================

interface PlayerProviderProps {
    children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylistState] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [audioQuality, setAudioQualityState] = useState<AudioQuality>('320k');
    const [playMode, setPlayModeState] = useState<PlayMode>('sequential');

    // Initialize audio element and restore settings
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.preload = 'metadata';

        // Restore saved settings
        const savedVolume = storage.get<number>(STORAGE_KEYS.VOLUME, 1);
        const savedQuality = storage.get<AudioQuality>(STORAGE_KEYS.QUALITY, '320k');
        const savedPlaylist = storage.get<Track[]>(STORAGE_KEYS.PLAYLIST, []);
        const savedIndex = storage.get<number>(STORAGE_KEYS.CURRENT_INDEX, 0);
        const savedPlayMode = storage.get<PlayMode>(STORAGE_KEYS.PLAY_MODE, 'sequential');

        setVolumeState(savedVolume);
        setAudioQualityState(savedQuality);
        setPlayModeState(savedPlayMode);

        // Restore playlist
        if (savedPlaylist.length > 0) {
            setPlaylistState(savedPlaylist);
            setCurrentIndex(Math.min(savedIndex, savedPlaylist.length - 1));
        }

        if (audioRef.current) {
            audioRef.current.volume = savedVolume;
        }

        return () => {
            // Cleanup
        };
    }, []);

    // Setup audio event listeners (separate effect to avoid re-binding on playlist change)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const handleEnded = () => {
            // Handle based on play mode
            setPlayModeState((currentMode) => {
                if (currentMode === 'loopOne') {
                    // Replay current track
                    audio.currentTime = 0;
                    audio.play().catch(console.error);
                } else if (currentMode === 'shuffle') {
                    // Random next
                    setCurrentIndex((prev) => {
                        setPlaylistState((pl) => {
                            if (pl.length <= 1) return pl;
                            let nextIndex = Math.floor(Math.random() * pl.length);
                            while (nextIndex === prev && pl.length > 1) {
                                nextIndex = Math.floor(Math.random() * pl.length);
                            }
                            // Use setTimeout to avoid state update conflict
                            setTimeout(() => setCurrentIndex(nextIndex), 0);
                            return pl;
                        });
                        return prev;
                    });
                } else if (currentMode === 'loop') {
                    // Loop to beginning
                    setCurrentIndex((prev) => {
                        setPlaylistState((pl) => {
                            const nextIndex = prev + 1;
                            if (nextIndex < pl.length) {
                                setTimeout(() => setCurrentIndex(nextIndex), 0);
                            } else {
                                setTimeout(() => setCurrentIndex(0), 0);
                            }
                            return pl;
                        });
                        return prev;
                    });
                } else {
                    // Sequential: stop at end
                    setCurrentIndex((prev) => {
                        setPlaylistState((pl) => {
                            const nextIndex = prev + 1;
                            if (nextIndex < pl.length) {
                                setTimeout(() => setCurrentIndex(nextIndex), 0);
                            } else {
                                setIsPlaying(false);
                            }
                            return pl;
                        });
                        return prev;
                    });
                }
                return currentMode;
            });
        };

        const handleError = () => {
            setIsLoading(false);
            // Try next song on error
            setCurrentIndex((prev) => {
                setPlaylistState((pl) => {
                    const nextIndex = prev + 1;
                    if (nextIndex < pl.length) {
                        setTimeout(() => setCurrentIndex(nextIndex), 0);
                    } else {
                        setIsPlaying(false);
                    }
                    return pl;
                });
                return prev;
            });
        };

        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, []);

    // Persist playlist changes
    useEffect(() => {
        storage.set(STORAGE_KEYS.PLAYLIST, playlist);
    }, [playlist]);

    // Persist current index
    useEffect(() => {
        storage.set(STORAGE_KEYS.CURRENT_INDEX, currentIndex);
    }, [currentIndex]);

    // Load track when currentIndex changes
    useEffect(() => {
        const track = playlist[currentIndex];
        if (!track || !audioRef.current) return;

        let cancelled = false;

        setCurrentTrack(track);
        setIsLoading(true);
        setCurrentTime(0);
        setDuration(0);

        // Fetch full song info (includes URL, cover, lyrics)
        getSongInfo(track.id, track.platform, audioQuality)
            .then((info) => {
                if (cancelled || !audioRef.current) return;

                // Enrich current track with cover from parse response
                const enrichedTrack = {
                    ...track,
                    cover: info.pic,
                    album: info.album || track.album,
                };
                setCurrentTrack(enrichedTrack);

                audioRef.current.crossOrigin = 'anonymous';
                audioRef.current.src = info.url;
                audioRef.current.load();

                if (isPlaying) {
                    audioRef.current.play().catch(console.error);
                }
            })
            .catch((error) => {
                console.error('Failed to get song info:', error);
                setIsLoading(false);
                // Try next song on error
                if (!cancelled) {
                    const nextIndex = currentIndex + 1;
                    if (nextIndex < playlist.length) {
                        setCurrentIndex(nextIndex);
                    }
                }
            });

        storage.set(STORAGE_KEYS.LAST_TRACK, track);

        return () => {
            cancelled = true;
        };
    }, [currentIndex, playlist, audioQuality]);

    // Play/Pause control
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        if (isPlaying) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    // Volume control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        storage.set(STORAGE_KEYS.VOLUME, volume);
    }, [volume]);

    // =========================================================================
    // Actions
    // =========================================================================

    const play = useCallback((track?: Track | null) => {
        if (track) {
            const existingIndex = playlist.findIndex(
                (t) => t.id === track.id && t.platform === track.platform
            );

            if (existingIndex >= 0) {
                setCurrentIndex(existingIndex);
            } else {
                setPlaylistState((prev) => [...prev, track]);
                setCurrentIndex(playlist.length);
            }
        }
        setIsPlaying(true);
    }, [playlist]);

    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const togglePlay = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const next = useCallback(() => {
        if (playMode === 'shuffle') {
            const nextIndex = Math.floor(Math.random() * playlist.length);
            setCurrentIndex(nextIndex);
        } else if (currentIndex < playlist.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else if (playMode === 'loop') {
            setCurrentIndex(0);
        }
    }, [currentIndex, playlist.length, playMode]);

    const prev = useCallback(() => {
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else if (playMode === 'loop') {
            setCurrentIndex(playlist.length - 1);
        }
    }, [currentIndex, playMode, playlist.length]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const setVolume = useCallback((vol: number) => {
        setVolumeState(Math.max(0, Math.min(1, vol)));
    }, []);

    const setPlaylist = useCallback((tracks: Track[], startIndex = 0) => {
        setPlaylistState(tracks);
        setCurrentIndex(startIndex);
        setIsPlaying(true);
    }, []);

    const addToQueue = useCallback((track: Track) => {
        setPlaylistState((prev) => [...prev, track]);
    }, []);

    const clearQueue = useCallback(() => {
        setPlaylistState([]);
        setCurrentIndex(0);
        setCurrentTrack(null);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
    }, []);

    const setAudioQuality = useCallback((quality: AudioQuality) => {
        setAudioQualityState(quality);
        storage.set(STORAGE_KEYS.QUALITY, quality);
    }, []);

    const setPlayMode = useCallback((mode: PlayMode) => {
        setPlayModeState(mode);
        storage.set(STORAGE_KEYS.PLAY_MODE, mode);
    }, []);

    const cyclePlayMode = useCallback(() => {
        const modes: PlayMode[] = ['sequential', 'loop', 'loopOne', 'shuffle'];
        setPlayModeState((prev) => {
            const currentIdx = modes.indexOf(prev);
            const nextMode = modes[(currentIdx + 1) % modes.length];
            storage.set(STORAGE_KEYS.PLAY_MODE, nextMode);
            return nextMode;
        });
    }, []);

    // =========================================================================
    // Context Value
    // =========================================================================

    const value: PlayerContextValue = {
        // State
        isPlaying,
        currentTrack,
        playlist,
        currentIndex,
        volume,
        currentTime,
        duration,
        isLoading,
        audioQuality,
        playMode,
        // Actions
        play,
        pause,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        setPlaylist,
        addToQueue,
        clearQueue,
        setAudioQuality,
        setPlayMode,
        cyclePlayMode,
    };

    return (
        <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
