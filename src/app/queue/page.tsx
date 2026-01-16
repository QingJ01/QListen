'use client';

import { Play, Shuffle, ListMusic, Music } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverUrl } from '@/lib/api';
import { SongList } from '@/components/business';
import { shuffle } from '@/lib/utils';
import type { Track } from '@/lib/types';
import styles from './page.module.css';

export default function QueuePage() {
    const { playlist, currentTrack, currentIndex, isPlaying, setPlaylist, togglePlay } =
        usePlayer();

    const upNext = playlist.slice(currentIndex + 1);

    const handleShuffle = () => {
        if (playlist.length <= 1) return;
        const shuffled = shuffle(playlist);
        setPlaylist(shuffled, 0);
    };

    const handlePlayAll = () => {
        if (playlist.length === 0) return;
        if (isPlaying) {
            togglePlay();
        } else {
            setPlaylist(playlist, 0);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>播放列表</h1>
                    <p className={styles.subtitle}>{playlist.length} 首歌曲</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={handleShuffle}>
                        <Shuffle size={16} />
                        <span>随机播放</span>
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.primary}`}
                        onClick={handlePlayAll}
                    >
                        <Play size={16} />
                        <span>{isPlaying ? '暂停' : '播放'}</span>
                    </button>
                </div>
            </header>

            {currentTrack && (
                <div className={styles.nowPlaying}>
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
                    <div className={styles.trackInfo}>
                        <div className={styles.trackTitle}>{currentTrack.name}</div>
                        <div className={styles.trackArtist}>{currentTrack.artist}</div>
                    </div>
                </div>
            )}

            {playlist.length === 0 ? (
                <div className={styles.empty}>
                    <ListMusic size={48} className={styles.emptyIcon} />
                    <p>播放列表为空</p>
                    <p>从搜索或排行榜中添加歌曲</p>
                </div>
            ) : upNext.length > 0 ? (
                <>
                    <h2 className={styles.sectionTitle}>接下来播放</h2>
                    <SongList
                        songs={upNext.map((track) => ({
                            id: track.id,
                            name: track.name,
                            artist: track.artist,
                            album: track.album,
                            platform: track.platform,
                            cover: track.cover,
                        }))}
                        showAlbum={false}
                    />
                </>
            ) : null}
        </div>
    );
}
