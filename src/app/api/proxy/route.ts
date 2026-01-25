import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url, method, headers, body } = await request.json();
        console.log('[Proxy] Request:', { url, method });

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 合并请求头，如果有 body 则需要设置 Content-Type
        const requestHeaders: Record<string, string> = { ...headers };
        if (body && !requestHeaders['Content-Type']) {
            requestHeaders['Content-Type'] = 'application/json';
        }

        console.log('[Proxy] Body:', body ? JSON.stringify(body).substring(0, 200) : 'none');

        const response = await fetch(url, {
            method: method || 'GET',
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        // 获取原始文本
        const text = await response.text();

        // 尝试解析为 JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            // 如果解析失败，返回原始文本
            data = text;
        }

        console.log('[Proxy] Response status:', response.status);
        console.log('[Proxy] Response data type:', typeof data);
        console.log('[Proxy] Response data (first 300 chars):', JSON.stringify(data).substring(0, 300));

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Proxy] Error:', error);
        return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 });
    }
}
