import { NextRequest, NextResponse } from 'next/server';

const TUNEHUB_API_URL = 'https://tunehub.sayqz.com/api';

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.TUNEHUB_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { code: -1, message: 'API Key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        console.log('[Parse API] Request body:', JSON.stringify(body));

        const response = await fetch(`${TUNEHUB_API_URL}/v1/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log('[Parse API] Response status:', response.status);
        console.log('[Parse API] Response data:', JSON.stringify(data));

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Parse API error:', error);
        return NextResponse.json(
            { code: -1, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
