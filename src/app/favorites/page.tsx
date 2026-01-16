'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { SongList } from '@/components/business';
import styles from './page.module.css';

export default function FavoritesPage() {
    const { favorites } = useFavorites();

    const songs = favorites.map((track) => ({
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
                <h1 className={styles.title}>我喜欢</h1>
                <p className={styles.subtitle}>
                    {favorites.length > 0
                        ? `${favorites.length} 首收藏歌曲`
                        : '你收藏的歌曲'}
                </p>
            </header>

            {favorites.length === 0 ? (
                <div className={styles.empty}>
                    <Heart size={48} className={styles.emptyIcon} />
                    <p>暂无收藏</p>
                    <p className={styles.hint}>
                        点击歌曲旁边的 ♡ 按钮将歌曲添加到收藏
                    </p>
                </div>
            ) : (
                <SongList songs={songs} showAlbum={true} />
            )}
        </div>
    );
}
