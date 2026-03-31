import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionId, completedSections, userResponses } = body;

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert PM Coach helping a product manager develop their skills through the PM Mastery Lab.

The user is currently working on section: ${sectionId}
Previously completed sections: ${completedSections?.join(', ') || 'None'}

Based on their responses in the current section, provide:

1. **Insight**: A key insight about their approach or thinking pattern
2. **Suggestion**: One specific suggestion to improve their PM skills
3. **Resource**: A recommended resource (book, article, podcast) relevant to their current focus
4. **Next Step**: The next action they should take in this section or the next section to work on

User's Responses:
${JSON.stringify(userResponses, null, 2)}

Be encouraging but honest. Provide actionable, specific advice that a practicing PM can use immediately.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate suggestions');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      suggestion: data.content[0].text,
      sectionId,
    });
  } catch (error) {
    console.error('Mastery Suggestion Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
