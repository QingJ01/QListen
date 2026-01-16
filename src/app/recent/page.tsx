'use client';

import { Clock } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { SongList } from '@/components/business';
import styles from './page.module.css';

export default function RecentPage() {
    const { playlist, clearQueue } = usePlayer();

    // 最近播放就是当前播放列表的历史
    const recentSongs = playlist.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        platform: track.platform,
        cover: track.cover,
    }));

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>最近播放</h1>
                <p className={styles.subtitle}>你最近听过的歌曲</p>
            </header>

            {recentSongs.length === 0 ? (
                <div className={styles.empty}>
                    <Clock size={48} className={styles.emptyIcon} />
                    <p>暂无播放记录</p>
                    <p>开始播放歌曲后，它们将显示在这里</p>
                </div>
            ) : (
                <>
                    <SongList songs={recentSongs} showAlbum={true} showDuration={false} />
                    <button className={styles.clearBtn} onClick={clearQueue}>
                        清空播放记录
                    </button>
                </>
            )}
        </div >
    );
}
