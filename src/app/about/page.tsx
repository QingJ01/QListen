'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Code2, Heart, Github, Activity, Users, Send, MessageCircle } from 'lucide-react';
import { getSystemStatus } from '@/lib/api';
import type { SystemStatus } from '@/lib/types';

export default function AboutPage() {
    const [status, setStatus] = useState<SystemStatus | null>(null);

    useEffect(() => {
        getSystemStatus().then(setStatus).catch(console.error);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <img src="/logo.svg" alt="Logo" className={styles.logoIcon} />
            </div>

            <h1 className={styles.title}>轻听音乐</h1>
            <div className={styles.version}>
                Version 1.0.0
                {status && (
                    <span className={styles.apiInfo}>
                        {' • Based on '}
                        <a
                            href="https://api.tunefree.fun/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.apiLink}
                        >
                            TuneHub API
                        </a>
                        {' v' + status.version}
                    </span>
                )}
            </div>

            <p className={styles.description}>
                一个极简、优雅的在线音乐播放器。
                <br />
                专注于纯粹的听歌体验，为您带来身临其境的视听享受。
            </p>

            {status && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Activity size={24} />
                        服务状态
                    </h2>
                    <div className={styles.statusGrid}>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>运行状态</div>
                            <div className={styles.statusValue}>
                                <span className={styles.statusDot} style={{ background: '#10b981' }} />
                                {status.status}
                            </div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>已运行</div>
                            <div className={styles.statusValue}>{Math.floor(status.uptime / 3600)} 小时</div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={styles.statusLabel}>支持平台</div>
                            <div className={styles.platformTags}>
                                {status.platforms.filter((p: any) => p.enabled).map((p: any) => (
                                    <span key={p.name} className={styles.platformTag}>{p.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Users size={24} />
                    加入社群
                </h2>
                <div className={styles.communityList}>
                    <a href="https://t.me/QingJG" target="_blank" rel="noopener noreferrer" className={styles.communityItem}>
                        <Send size={24} className={styles.communityIcon} style={{ color: '#0088cc' }} />
                        <div className={styles.communityInfo}>
                            <div className={styles.communityName}>Telegram 频道</div>
                            <div className={styles.communityDesc}>@QingJG</div>
                        </div>
                    </a>
                    <a href="https://qm.qq.com/cgi-bin/qm/qr?k=S7aiwtH0mCFgzKRiAph-caj4pzpC0QJU&jump_from=webapi" target="_blank" rel="noopener noreferrer" className={styles.communityItem}>
                        <MessageCircle size={24} className={styles.communityIcon} style={{ color: '#12b7f5' }} />
                        <div className={styles.communityInfo}>
                            <div className={styles.communityName}>QQ 交流群</div>
                            <div className={styles.communityDesc}>点击加入</div>
                        </div>
                    </a>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Code2 size={24} />
                    技术栈
                </h2>
                <div className={styles.stackList}>
                    <div className={styles.stackItem}>Next.js 14</div>
                    <div className={styles.stackItem}>TypeScript</div>
                    <div className={styles.stackItem}>Tailwind CSS</div>
                    <div className={styles.stackItem}>CSS Modules</div>
                </div>
            </div>

            <div className={styles.footer}>
                <p>Designed & Built with <Heart size={14} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px', color: 'var(--color-accent)' }} /> by QingJ & Claude & Gemini</p>
                <div style={{ marginTop: 8 }}>
                    <a href="https://github.com/QingJ01/QListen" target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <Github size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    );
}
