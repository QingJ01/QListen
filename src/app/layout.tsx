import type { Metadata } from 'next';
import RootLayoutClient from './RootLayoutClient';

export const metadata: Metadata = {
  title: 'Music - 在线音乐播放器',
  description: '一个仿 Apple Music 风格的在线音乐播放器',
  keywords: ['音乐', '播放器', 'Apple Music', '在线听歌'],
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
