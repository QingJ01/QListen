'use client';

import { Play, Music } from 'lucide-react';
import styles from './MediaCard.module.css';

interface MediaCardProps {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    onClick?: () => void;
    onPlay?: () => void;
}

export function MediaCard({
    title,
    subtitle,
    imageUrl,
    onClick,
    onPlay,
}: MediaCardProps) {
    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPlay?.();
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageWrapper}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.image}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <Music size={48} />
                    </div>
                )}
                <div className={styles.overlay}>
                    <button
                        className={styles.playButton}
                        onClick={handlePlayClick}
                        aria-label={`播放 ${title}`}
                    >
                        <Play size={24} style={{ marginLeft: 2 }} />
                    </button>
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
        </div>
    );
}

// Grid wrapper component
interface MediaGridProps {
    children: React.ReactNode;
}

export function MediaGrid({ children }: MediaGridProps) {
    return <div className={styles.grid}>{children}</div>;
}
