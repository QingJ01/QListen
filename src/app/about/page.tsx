'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Code2, Heart, Github, Users, Send, MessageCircle, Coffee } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <img src="/logo.svg" alt="Logo" className={styles.logoIcon} />
            </div>

            <h1 className={styles.title}>轻听音乐</h1>
            <div className={styles.version}>
                Version 1.0.1
            </div>

            <p className={styles.description}>
                一个极简、优雅的在线音乐播放器。
                <br />
                专注于纯粹的听歌体验，为您带来身临其境的视听享受。
            </p>

            <div className={styles.quotaNotice}>
                <p>⚠️ 本站每日提供 <strong>1000 首</strong> 解析额度（全站）</p>
                <p>如有更高需求请自行部署项目配置 API</p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Coffee size={24} />
                    赞助支持
                </h2>
                <p className={styles.sponsorText}>如果觉得本项目对您有帮助，欢迎赞助支持（每一元赞助每日多10首歌播放额度） ❤️</p>
                <div className={styles.qrcodeWrapper}>
                    <img
                        src="https://esaimg.cdn1.vip/i/697eef29c5ab8_1769926441.png"
                        alt="赞助二维码"
                        className={styles.qrcode}
                    />
                </div>
            </div>

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
