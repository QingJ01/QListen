'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, ListMusic, Info } from 'lucide-react';
import styles from './MobileNav.module.css';

const navItems = [
    { label: '首页', href: '/', icon: Home },
    { label: '搜索', href: '/search', icon: Search },
    { label: '收藏', href: '/favorites', icon: Heart },
    { label: '队列', href: '/queue', icon: ListMusic },
    { label: '关于', href: '/about', icon: Info },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.mobileNav}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                        <Icon size={24} className={styles.icon} />
                        <span className={styles.label}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
