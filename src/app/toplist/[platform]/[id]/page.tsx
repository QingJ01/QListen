'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Loader2, Music } from 'lucide-react';
import { getTopListSongs } from '@/lib/api';
import type { MusicPlatform, PlaylistSong, Track } from '@/lib/types';
import { SongList } from '@/components/business';
import { usePlayer } from '@/context/PlayerContext';
import styles from './page.module.css';

interface TopListPageProps {
    params: Promise<{
        platform: MusicPlatform;
        id: string;
    }>;
}

export default function TopListPage({ params }: TopListPageProps) {
    const { platform, id } = use(params);
    const { setPlaylist } = usePlayer();

    const [songs, setSongs] = useState<PlaylistSong[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSongs() {
            setLoading(true);
            setError(null);
            try {
                const data = await getTopListSongs(id, platform);
                setSongs(data.list || []);
            } catch (err) {
                setError('加载歌曲列表失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchSongs();
    }, [id, platform]);

    const handlePlayAll = () => {
        if (songs.length === 0) return;

        const tracks: Track[] = songs.map((song) => ({
            id: song.id,
            name: song.name,
            artist: song.artist || '未知艺术家',
            platform: platform,
        }));
        setPlaylist(tracks, 0);
    };

    const platformNames: Record<MusicPlatform, string> = {
        netease: '网易云音乐',
        qq: 'QQ音乐',
        kugou: '酷狗音乐',
        kuwo: '酷我音乐',
        migu: '咪咕音乐',
    };

    return (
        <div className={styles.page}>
            <Link href="/" className={styles.backLink}>
                <ChevronLeft size={16} />
                <span>返回</span>
            </Link>

            <header className={styles.header}>
                <div className={styles.cover}>
                    <div className={styles.coverPlaceholder}>
                        <Music size={64} />
                    </div>
                </div>
                <div className={styles.info}>
                    <h1 className={styles.title}>排行榜</h1>
                    <div className={styles.meta}>
                        {platformNames[platform]} • {songs.length} 首歌曲
                    </div>
                    <div className={styles.actions}>
                        <button
                            className={styles.playAllBtn}
                            onClick={handlePlayAll}
                            disabled={songs.length === 0}
                        >
                            <Play size={16} />
                            <span>播放全部</span>
                        </button>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>
                    <Loader2 size={32} className="animate-spin" />
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            ) : (
                <SongList
                    songs={songs.map((song) => ({
                        id: song.id,
                        name: song.name,
                        artist: song.artist,
                        platform: platform,
                    }))}
                    showAlbum={false}
                />
            )}
        </div>
    );
}
