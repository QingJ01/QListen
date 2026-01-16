'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Music,
    Search,
    ListMusic,
    Heart,
    Clock,
    Home,
    Info
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const mainNav: NavItem[] = [
    { label: '现在就听', href: '/', icon: Home },
    { label: '最近播放', href: '/recent', icon: Clock },
    { label: '我喜欢', href: '/favorites', icon: Heart },
];

const libraryNav: NavItem[] = [
    { label: '搜索', href: '/search', icon: Search },
    { label: '播放列表', href: '/queue', icon: ListMusic },
    { label: '关于', href: '/about', icon: Info },
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src="/logo.svg" alt="Logo" className={styles.logoIcon} />
                <span className={styles.logoText}>轻听音乐</span>
            </div>

            <nav className={styles.nav}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>发现</div>
                    <ul className={styles.navList}>
                        {mainNav.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                >
                                    <item.icon className={styles.navIcon} strokeWidth={1.5} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>资料库</div>
                    <ul className={styles.navList}>
                        {libraryNav.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                >
                                    <item.icon className={styles.navIcon} strokeWidth={1.5} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside >
    );
}
