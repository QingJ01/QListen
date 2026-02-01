import type {
    ApiResponse,
    SongInfo,
    SearchResponse,
    PlaylistResponse,
    TopListsResponse,
    TopListSongsResponse,
    TopListItem,
    MusicPlatform,
    AudioQuality,
    SystemStatus,
    MethodConfig,
    ParseResponse,
} from './types';

// =============================================================================
// Configuration
// =============================================================================

const TUNEHUB_API_URL = 'https://tunehub.sayqz.com/api';

// =============================================================================
// Method Dispatch Helper
// =============================================================================

/**
 * 获取方法配置并执行请求
 */
async function executeMethod<T>(
    platform: MusicPlatform,
    method: string,
    variables: Record<string, string> = {}
): Promise<T> {
    // 1. 获取方法配置
    const configRes = await fetch(`/api/methods/${platform}/${method}`);
    if (!configRes.ok) {
        throw new Error(`Failed to get method config: ${configRes.status}`);
    }
    const { data: config } = await configRes.json() as { data: MethodConfig };

    // 创建变量上下文，添加别名兼容，并转换为数字类型
    const context: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(variables)) {
        // 尝试转换为数字
        const num = Number(value);
        context[key] = isNaN(num) ? value : num;
    }
    // 添加 limit 作为 pageSize 的别名
    context.limit = context.pageSize || context.limit || 20;
    // 确保 page 存在（从 1 开始）
    context.page = context.page || 1;

    /**
     * 替换模板表达式 {{expr}}
     * 支持简单变量和 JavaScript 表达式
     */
    function replaceTemplate(template: string): string {
        return template.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
            try {
                // 创建一个带有变量上下文的函数来执行表达式
                const fn = new Function(...Object.keys(context), `return ${expr}`);
                const result = fn(...Object.values(context));
                return String(result);
            } catch {
                // 如果表达式执行失败，返回空字符串
                console.warn(`[executeMethod] Failed to evaluate expression: ${expr}`);
                return '';
            }
        });
    }

    /**
     * 递归替换对象中所有字符串的模板
     */
    function replaceObjectTemplates(obj: Record<string, unknown>): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                result[key] = replaceTemplate(value);
            } else if (typeof value === 'object' && value !== null) {
                result[key] = replaceObjectTemplates(value as Record<string, unknown>);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    // 2. 替换 URL params 中的模板变量
    const params: Record<string, string> = {};
    if (config.params) {
        for (const [key, value] of Object.entries(config.params)) {
            params[key] = replaceTemplate(value);
        }
    }

    // 3. 替换 body 中的模板变量（用于 POST 请求）
    console.log(`[executeMethod] ${platform}/${method} - config.body:`, config.body ? 'exists' : 'undefined');
    let processedBody: Record<string, unknown> | undefined;
    if (config.body) {
        processedBody = replaceObjectTemplates(config.body as Record<string, unknown>);
    }

    // 4. 构建请求 URL
    const requestUrl = new URL(config.url);
    for (const [key, value] of Object.entries(params)) {
        requestUrl.searchParams.set(key, value);
    }

    console.log(`[executeMethod] ${platform}/${method} - Final URL:`, requestUrl.toString());
    if (processedBody) {
        console.log(`[executeMethod] ${platform}/${method} - Body:`, JSON.stringify(processedBody).substring(0, 200));
    }

    // 5. 发起请求 (通过代理以绕过 CORS)
    const proxyPayload = {
        url: requestUrl.toString(),
        method: config.method,
        headers: config.headers || {},
        body: processedBody,
    };
    console.log(`[executeMethod] ${platform}/${method} - Proxy payload body exists:`, !!proxyPayload.body);

    const proxyRes = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyPayload),
    });

    if (!proxyRes.ok) {
        throw new Error(`Proxy request failed: ${proxyRes.status}`);
    }

    const rawData = await proxyRes.json();
    console.log(`[executeMethod] ${platform}/${method} - Raw data type:`, typeof rawData);
    console.log(`[executeMethod] ${platform}/${method} - Raw data keys:`, typeof rawData === 'object' && rawData ? Object.keys(rawData) : 'N/A');
    console.log(`[executeMethod] ${platform}/${method} - Raw data (first 400 chars):`, JSON.stringify(rawData).substring(0, 400));
    console.log(`[executeMethod] ${platform}/${method} - Has transform:`, !!config.transform);

    // 5. 应用转换函数（如果有）
    if (config.transform) {
        try {
            // eslint-disable-next-line no-new-func
            const transformFn = new Function('response', `return (${config.transform})(response)`);
            const transformed = transformFn(rawData);
            console.log(`[executeMethod] ${platform}/${method} - Transformed data:`, JSON.stringify(transformed).substring(0, 300));
            return transformed as T;
        } catch (e) {
            console.error(`[executeMethod] Transform failed for ${platform}/${method}:`, e);
            return rawData as T;
        }
    }

    return rawData as T;
}

// =============================================================================
// Song APIs
// =============================================================================

/**
 * 解析歌曲（通过服务端代理，需要 API Key）
 */
export async function parseSongs(
    ids: string | string[],
    platform: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): Promise<ParseResponse> {
    const idsStr = Array.isArray(ids) ? ids.join(',') : ids;

    const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            platform,
            ids: idsStr,
            quality,
        }),
    });

    if (!response.ok) {
        throw new Error('API额度不足，请稍后再试');
    }

    const result = await response.json();

    if (result.code !== 0) {
        throw new Error(result.message || 'Parse failed');
    }

    return result.data;
}

/**
 * 获取单曲播放信息
 */
export async function getSongInfo(
    id: string,
    platform: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): Promise<SongInfo> {
    const parsed = await parseSongs(id, platform, quality);
    // TuneHub V3 返回结构: data.data[].info, data.data[].cover, data.data[].lyrics
    const songData = parsed.data?.[0];

    if (!songData || !songData.success) {
        throw new Error('API额度不足，请稍后再试');
    }

    return {
        name: songData.info?.name || '',
        artist: songData.info?.artist || '',
        album: songData.info?.album || '',
        url: songData.url,
        pic: songData.cover || '',
        lrc: songData.lyrics || '',
    };
}

/**
 * 获取音乐播放 URL
 */
export async function getSongUrl(
    id: string,
    platform: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): Promise<string> {
    const info = await getSongInfo(id, platform, quality);
    return info.url;
}

/**
 * 获取专辑封面 URL
 */
export async function getCoverUrl(
    id: string,
    platform: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): Promise<string> {
    const info = await getSongInfo(id, platform, quality);
    return info.pic;
}

/**
 * 获取歌词 (LRC 格式文本)
 */
export async function getLyrics(
    id: string,
    platform: MusicPlatform = 'netease',
    quality: AudioQuality = '320k'
): Promise<string> {
    const info = await getSongInfo(id, platform, quality);
    return info.lrc;
}

// =============================================================================
// Search APIs
// =============================================================================

/**
 * 单平台搜索
 */
export async function search(
    keyword: string,
    platform: MusicPlatform = 'netease',
    page: number = 1,
    pageSize: number = 20
): Promise<SearchResponse> {
    type SearchItem = { id: string; name: string; artist: string; album?: string };
    const result = await executeMethod<SearchItem[] | { list: SearchItem[] }>(
        platform,
        'search',
        {
            keyword: keyword, // 不要 URL 编码，让模板处理
            page: String(page),
            pageSize: String(pageSize),
        }
    );

    // 兼容两种返回格式：数组 或 { list: [...] }
    const list = Array.isArray(result) ? result : (result.list || []);

    return {
        keyword,
        results: list.map(item => ({
            id: item.id,
            name: item.name,
            artist: item.artist,
            album: item.album,
            platform,
        })),
    };
}

/**
 * 聚合搜索 (多平台)
 */
export async function aggregateSearch(keyword: string): Promise<SearchResponse> {
    const platforms: MusicPlatform[] = ['netease', 'qq', 'kuwo'];
    const results = await Promise.allSettled(
        platforms.map(p => search(keyword, p, 1, 10))
    );

    const allResults = results
        .filter((r): r is PromiseFulfilledResult<SearchResponse> => r.status === 'fulfilled')
        .flatMap(r => r.value.results);

    return {
        keyword,
        results: allResults,
    };
}

// =============================================================================
// Playlist & TopList APIs
// =============================================================================

/**
 * 获取歌单详情
 */
export async function getPlaylistDetails(
    id: string,
    platform: MusicPlatform = 'netease'
): Promise<PlaylistResponse> {
    const result = await executeMethod<PlaylistResponse>(
        platform,
        'playlist',
        { id }
    );
    return result;
}

/**
 * 获取排行榜列表
 */
export async function getTopLists(
    platform: MusicPlatform = 'netease'
): Promise<TopListsResponse> {
    // Transform 直接返回数组，需要包装成 { list: [...] }
    const result = await executeMethod<TopListItem[] | TopListsResponse>(
        platform,
        'toplists',
        {}
    );

    // 兼容两种返回格式：数组 或 { list: [...] }
    if (Array.isArray(result)) {
        return { list: result };
    }
    return result;
}

/**
 * 获取排行榜歌曲
 */
export async function getTopListSongs(
    id: string,
    platform: MusicPlatform = 'netease'
): Promise<TopListSongsResponse> {
    type SongItem = { id: string; name: string; artist?: string };
    const result = await executeMethod<SongItem[] | { list: SongItem[] }>(
        platform,
        'toplist',
        { id }
    );

    // 兼容两种返回格式：数组 或 { list: [...] }
    const list = Array.isArray(result) ? result : (result.list || []);

    return {
        list,
        source: platform,
    };
}

// =============================================================================
// System APIs
// =============================================================================

/**
 * 获取系统状态
 */
export async function getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${TUNEHUB_API_URL}/status`);
    if (!response.ok) {
        throw new Error('Failed to fetch system status');
    }
    const res = await response.json() as ApiResponse<SystemStatus>;
    return res.data;
}
