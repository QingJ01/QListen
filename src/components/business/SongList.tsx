'use client';

import { Play, Music, Volume2, Heart } from 'lucide-react';
import type { Track, MusicPlatform } from '@/lib/types';
import { usePlayer } from '@/context/PlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import styles from './SongList.module.css';

interface SongListItem {
    id: string;
    name: string;
    artist?: string;
    album?: string;
    duration?: number;
    platform: MusicPlatform;
    cover?: string;
}

interface SongListProps {
    songs: SongListItem[];
    showHeader?: boolean;
    showCover?: boolean;
    showAlbum?: boolean;
    showDuration?: boolean;
}

export function SongList({
    songs,
    showHeader = true,
    showCover = true,
    showAlbum = true,
    showDuration = true,
}: SongListProps) {
    const { currentTrack, isPlaying, setPlaylist } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();

    const gridTemplateColumns = [
        '40px',
        '1fr',
        showAlbum ? '200px' : null,
        '60px', // Favorite
        showDuration ? '80px' : null,
    ]
        .filter(Boolean)
        .join(' ');

    const handleSongClick = (index: number) => {
        const tracks: Track[] = songs.map((song) => ({
            id: song.id,
            name: song.name,
            artist: song.artist || '未知艺术家',
            album: song.album,
            platform: song.platform,
            cover: song.cover,
            duration: song.duration,
        }));
        setPlaylist(tracks, index);
    };

    const isCurrentSong = (song: SongListItem) =>
        currentTrack?.id === song.id && currentTrack?.platform === song.platform;

    return (
        <div className={styles.songList}>
            {showHeader && (
                <div
                    className={styles.header}
                    style={{ gridTemplateColumns }}
                >
                    <span>#</span>
                    <span>标题</span>
                    {showAlbum && <span>专辑</span>}
                    <span style={{ textAlign: 'center' }}>收藏</span>
                    {showDuration && <span style={{ textAlign: 'right' }}>时长</span>}
                </div>
            )}

            {songs.map((song, index) => (
                <div
                    key={`${song.platform}-${song.id}`}
                    className={`${styles.songItem} ${isCurrentSong(song) ? styles.active : ''}`}
                    style={{ gridTemplateColumns }}
                    onClick={() => handleSongClick(index)}
                >
                    <div className={styles.indexCell}>
                        {isCurrentSong(song) && isPlaying ? (
                            <div className={styles.playingIndicator}>
                                <Volume2 size={14} />
                            </div>
                        ) : (
                            <>
                                <span className={styles.index}>{index + 1}</span>
                                <div className={styles.playIcon}>
                                    <Play size={14} fill="currentColor" strokeWidth={0} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.titleCell}>
                        {showCover && (
                            <div className={styles.cover}>
                                {song.cover ? (
                                    <img
                                        src={song.cover}
                                        alt={song.name}
                                        className={styles.coverImage}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className={styles.coverPlaceholder}>
                                        <Music size={20} />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.meta}>
                            <div className={styles.title}>{song.name}</div>
                            <div className={styles.artist}>
                                {song.artist || '未知艺术家'}
                                <span className={styles.platformBadge} style={{ marginLeft: 8 }}>
                                    {song.platform}
                                </span>
                            </div>
                        </div>
                    </div>

                    {showAlbum && (
                        <div className={styles.albumCell}>{song.album || '-'}</div>
                    )}

                    <div className={styles.favoriteCell}>
                        <button
                            className={`${styles.favoriteBtn} ${isFavorite(song.id, song.platform) ? styles.favorited : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite({
                                    id: song.id,
                                    name: song.name,
                                    artist: song.artist || '未知艺术家',
                                    album: song.album,
                                    platform: song.platform,
                                    cover: song.cover,
                                });
                            }}
                            aria-label={isFavorite(song.id, song.platform) ? '取消收藏' : '收藏'}
                        >
                            <Heart
                                size={16}
                                strokeWidth={1.5}
                                fill={isFavorite(song.id, song.platform) ? 'currentColor' : 'none'}
                            />
                        </button>
                    </div>

                    {showDuration && (
                        <div className={styles.durationCell}>
                            {song.duration ? formatDuration(song.duration) : '-'}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
