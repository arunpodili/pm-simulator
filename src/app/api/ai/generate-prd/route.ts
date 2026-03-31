import { NextRequest, NextResponse } from 'next/server';

const AI_SERVICE_URL = process.env.AI_AGENTS_API_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${AI_SERVICE_URL}/api/ai/generate-prd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to generate PRD' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('AI PRD Generation error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 503 }
    );
  }
}
