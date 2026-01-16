'use client';

import { useState, useCallback } from 'react';
import { Search as SearchIcon, Loader2, Music } from 'lucide-react';
import { aggregateSearch } from '@/lib/api';
import type { SearchResult } from '@/lib/types';
import { SongList } from '@/components/business';
import { debounce } from '@/lib/utils';
import styles from './page.module.css';

const SUGGESTIONS = ['周杰伦', '林俊杰', '邓紫棋', '薛之谦', 'Taylor Swift'];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const performSearch = useCallback(
        debounce(async (keyword: string) => {
            if (!keyword.trim()) {
                setResults([]);
                setSearched(false);
                return;
            }

            setLoading(true);
            setSearched(true);

            try {
                const data = await aggregateSearch(keyword);
                setResults(data.results || []);
            } catch (err) {
                console.error('Search failed:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        performSearch(value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        performSearch(suggestion);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>搜索</h1>
                <div className={styles.searchBox}>
                    <SearchIcon className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="搜索歌曲、艺人、专辑"
                        value={query}
                        onChange={handleInputChange}
                        autoFocus
                    />
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>
                    <Loader2 size={32} className="animate-spin" />
                </div>
            ) : searched && results.length === 0 ? (
                <div className={styles.empty}>
                    <Music size={48} className={styles.emptyIcon} />
                    <p>未找到相关结果</p>
                    <p>试试其他关键词？</p>
                </div>
            ) : results.length > 0 ? (
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <h2 className={styles.resultsTitle}>搜索结果</h2>
                        <span className={styles.resultsCount}>{results.length} 首歌曲</span>
                    </div>
                    <SongList
                        songs={results.map((r) => ({
                            id: r.id,
                            name: r.name,
                            artist: r.artist,
                            album: r.album,
                            platform: r.platform,
                        }))}
                        showCover={true}
                        showAlbum={true}
                        showDuration={false}
                    />
                </div>
            ) : (
                <div className={styles.empty}>
                    <Music size={48} className={styles.emptyIcon} />
                    <p>输入关键词开始搜索</p>
                    <div className={styles.hint}>
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                className={styles.hintTag}
                                onClick={() => handleSuggestionClick(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
