import { NextRequest, NextResponse } from 'next/server';

const AI_SERVICE_URL = process.env.AI_AGENTS_API_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.file_paths || !Array.isArray(body.file_paths)) {
      return NextResponse.json(
        { error: 'No file paths provided' },
        { status: 400 }
      );
    }

    const response = await fetch(`${AI_SERVICE_URL}/api/ai/security-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to run security scan' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Security Scan error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 503 }
    );
  }
}
