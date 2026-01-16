import type { Metadata } from 'next';
import RootLayoutClient from './RootLayoutClient';

export const metadata: Metadata = {
  title: {
    default: '轻听音乐 (QListen) - 极简、优雅的在线音乐播放器',
    template: '%s | 轻听音乐 (QListen)'
  },
  description: '轻听音乐 (QListen) 是一款现代化在线音乐播放器，拥有极简的 Apple Music 交互风格。支持多平台搜索、实时歌词显示、沉浸式播放体验，为您带来身临其境的视听享受。',
  keywords: ['轻听音乐', 'QListen', '在线音乐播放器', 'Apple Music 风格', '网页音乐播放器', '免费音乐', '无损音乐', '音乐搜索', '实时歌词'],
  authors: [{ name: 'QingJ' }],
  creator: 'QingJ',
  publisher: 'QingJ',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://music.byebug.cn',
    title: '轻听音乐 (QListen) - 极简、优雅的在线音乐播放器',
    description: '一个沉浸式在线音乐播放器，支持全网搜索与实时歌词。',
    siteName: '轻听音乐 (QListen)',
    images: [
      {
        url: 'https://music.byebug.cn/logo.svg',
        width: 120,
        height: 120,
        alt: 'QListen Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '轻听音乐 (QListen) - 极简、优雅的在线音乐播放器',
    description: '一个仿 Apple Music 风格的沉浸式在线音乐播放器，支持全网搜索与实时歌词。',
    images: ['https://music.byebug.cn/logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
