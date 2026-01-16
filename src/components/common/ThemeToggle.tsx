'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            title={theme === 'dark' ? '浅色模式' : '深色模式'}
        >
            <div className={styles.iconWrapper}>
                {theme === 'dark' ? (
                    <Sun size={20} strokeWidth={1.5} />
                ) : (
                    <Moon size={20} strokeWidth={1.5} />
                )}
            </div>
        </button>
    );
}
