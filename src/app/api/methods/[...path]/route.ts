import { NextRequest, NextResponse } from 'next/server';

const TUNEHUB_API_URL = 'https://tunehub.sayqz.com/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const endpoint = `/v1/methods/${path.join('/')}`;

        const response = await fetch(`${TUNEHUB_API_URL}${endpoint}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Methods API error:', error);
        return NextResponse.json(
            { code: -1, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
