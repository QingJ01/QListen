import type {
    ApiResponse,
    SongInfo,
    SearchResponse,
    PlaylistResponse,
    TopListsResponse,
    TopListSongsResponse,
    MusicPlatform,
    AudioQuality,
    SystemStatus,
} from './types';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = 'https://music-dl.sayqz.com';

// =============================================================================
// Generic Fetch Helper
// =============================================================================

async function fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// =============================================================================
// Song APIs
// =============================================================================

/**
 * 获取歌曲基本信息
 */
export async function getSongInfo(
    id: string,
    source: MusicPlatform = 'netease'
): Promise<SongInfo> {
    const res = await fetchApi<ApiResponse<SongInfo>>(
        `/api/?source=${source}&id=${id}&type=info`
    );
    return res.data;
}

/**
 * 获取音乐播放 URL
 * 注意：实际接口返回 302 重定向，这里返回构造的 URL
 */
export function getSongUrl(
    id: string,
    source: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): string {
    return `${API_BASE_URL}/api/?source=${source}&id=${id}&type=url&br=${quality}`;
}

/**
 * 获取专辑封面 URL
 */
export function getCoverUrl(id: string, source: MusicPlatform = 'netease'): string {
    return `${API_BASE_URL}/api/?source=${source}&id=${id}&type=pic`;
}

/**
 * 获取歌词 (LRC 格式文本)
 */
export async function getLyrics(
    id: string,
    source: MusicPlatform = 'netease'
): Promise<string> {
    const response = await fetch(
        `${API_BASE_URL}/api/?source=${source}&id=${id}&type=lrc`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch lyrics: ${response.status}`);
    }

    return response.text();
}

// =============================================================================
// Search APIs
// =============================================================================

/**
 * 单平台搜索
 */
export async function search(
    keyword: string,
    source: MusicPlatform = 'netease',
    limit: number = 20
): Promise<SearchResponse> {
    const res = await fetchApi<ApiResponse<SearchResponse>>(
        `/api/?source=${source}&type=search&keyword=${encodeURIComponent(keyword)}&limit=${limit}`
    );
    return res.data;
}

/**
 * 聚合搜索 (多平台)
 */
export async function aggregateSearch(keyword: string): Promise<SearchResponse> {
    const res = await fetchApi<ApiResponse<SearchResponse>>(
        `/api/?type=aggregateSearch&keyword=${encodeURIComponent(keyword)}`
    );
    return res.data;
}

// =============================================================================
// Playlist & TopList APIs
// =============================================================================

/**
 * 获取歌单详情
 */
export async function getPlaylistDetails(
    id: string,
    source: MusicPlatform = 'netease'
): Promise<PlaylistResponse> {
    const res = await fetchApi<ApiResponse<PlaylistResponse>>(
        `/api/?source=${source}&id=${id}&type=playlist`
    );
    return res.data;
}

/**
 * 获取排行榜列表
 */
export async function getTopLists(
    source: MusicPlatform = 'netease'
): Promise<TopListsResponse> {
    const res = await fetchApi<ApiResponse<TopListsResponse>>(
        `/api/?source=${source}&type=toplists`
    );
    return res.data;
}

/**
 * 获取排行榜歌曲
 */
export async function getTopListSongs(
    id: string,
    source: MusicPlatform = 'netease'
): Promise<TopListSongsResponse> {
    const res = await fetchApi<ApiResponse<TopListSongsResponse>>(
        `/api/?source=${source}&id=${id}&type=toplist`
    );
    return res.data;
}
// =============================================================================
// System APIs
// =============================================================================

/**
 * 获取系统状态
 */
export async function getSystemStatus(): Promise<SystemStatus> {
    const res = await fetchApi<ApiResponse<SystemStatus>>('/status');
    return res.data;
}
