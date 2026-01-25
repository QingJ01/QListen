// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
}

// =============================================================================
// Song & Music Types
// =============================================================================

export interface SongInfo {
    name: string;
    artist: string;
    album: string;
    url: string;
    pic: string;
    lrc: string;
}

export interface SearchResult {
    id: string;
    name: string;
    artist: string;
    album?: string;
    url?: string;
    platform: MusicPlatform;
}

export interface SearchResponse {
    keyword: string;
    total?: number;
    results: SearchResult[];
}

// =============================================================================
// Playlist & TopList Types
// =============================================================================

export interface PlaylistSong {
    id: string;
    name: string;
    artist?: string;
    types?: string[];
}

export interface PlaylistInfo {
    name: string;
    author?: string;
}

export interface PlaylistResponse {
    list: PlaylistSong[];
    info: PlaylistInfo;
}

export interface TopListItem {
    id: string;
    name: string;
    pic?: string;
    updateFrequency?: string;
}

export interface TopListsResponse {
    list: TopListItem[];
}

export interface TopListSongsResponse {
    list: PlaylistSong[];
    source: MusicPlatform;
}

// =============================================================================
// Platform & Quality Types
// =============================================================================

export type MusicPlatform = 'netease' | 'kuwo' | 'kugou' | 'migu' | 'qq';

export type AudioQuality = '128k' | '320k' | 'flac' | 'flac24bit';

export type PlayMode = 'sequential' | 'loop' | 'loopOne' | 'shuffle';

// =============================================================================
// Player State Types
// =============================================================================

export interface Track {
    id: string;
    name: string;
    artist: string;
    album?: string;
    platform: MusicPlatform;
    cover?: string;
    duration?: number;
}

export interface PlayerState {
    isPlaying: boolean;
    currentTrack: Track | null;
    playlist: Track[];
    currentIndex: number;
    volume: number;
    currentTime: number;
    duration: number;
    isLoading: boolean;
}

// =============================================================================
// System Types
// =============================================================================

export interface SystemStatus {
    service: string;
    version: string;
    status: string;
    uptime: number;
    platforms: {
        name: string;
        enabled: boolean;
    }[];
}

export interface HealthCheck {
    status: 'healthy' | 'unhealthy';
}

// =============================================================================
// TuneHub API Types
// =============================================================================

export interface MethodConfig {
    type: string;
    method: 'GET' | 'POST';
    url: string;
    params?: Record<string, string>;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    transform?: string;
}

export interface ParsedSongInfo {
    name: string;
    artist: string;
    album?: string;
    duration?: number;
}

export interface ParsedSongData {
    id: string;
    success: boolean;
    url: string;
    info?: ParsedSongInfo;
    cover?: string;
    lyrics?: string;
    requestedQuality?: string;
    actualQuality?: string;
    qualityMatch?: boolean;
    wasDowngraded?: boolean;
    fileSize?: number;
    responseTime?: number;
    expire?: number;
    fromCache?: boolean;
}

export interface ParseResponse {
    data: ParsedSongData[];
    total: number;
    success_count: number;
    fail_count: number;
    cache_hit_count?: number;
    cost?: number;
}
