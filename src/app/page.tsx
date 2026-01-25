'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getTopLists } from '@/lib/api';
import type { TopListItem, MusicPlatform } from '@/lib/types';
import { MediaCard, MediaGrid } from '@/components/business';
import styles from './page.module.css';

const PLATFORMS: { id: MusicPlatform; name: string }[] = [
  { id: 'netease', name: '网易云' },
  { id: 'qq', name: 'QQ音乐' },
  { id: 'kuwo', name: '酷我' },
];

export default function HomePage() {
  const [platform, setPlatform] = useState<MusicPlatform>('netease');
  const [topLists, setTopLists] = useState<TopListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopLists() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopLists(platform);
        setTopLists(data.list || []);
      } catch (err) {
        setError('加载排行榜失败，请稍后重试');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopLists();
  }, [platform]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>现在就听</h1>
        <p className={styles.subtitle}>热门排行榜与精选歌单</p>
      </header>

      {/* Platform Tabs */}
      <div className={styles.platformTabs}>
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            className={`${styles.platformTab} ${platform === p.id ? styles.active : ''}`}
            onClick={() => setPlatform(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Top Lists Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>排行榜</h2>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button
              className={styles.retryBtn}
              onClick={() => setPlatform(platform)}
            >
              重试
            </button>
          </div>
        ) : (
          <MediaGrid>
            {topLists.slice(0, 12).map((list) => (
              <Link
                key={list.id}
                href={`/toplist/${platform}/${list.id}`}
                style={{ textDecoration: 'none' }}
              >
                <MediaCard
                  id={list.id}
                  title={list.name}
                  subtitle={list.updateFrequency}
                  imageUrl={list.pic || ''}
                />
              </Link>
            ))}
          </MediaGrid>
        )}
      </section>
    </div>
  );
}
