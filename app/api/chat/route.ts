import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { messages, systemInstruction } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });

    // Format messages for OpenAI/DeepSeek
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map((m: any) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: formattedMessages,
      temperature: 0.8,
      stream: true,
    });

    // Create a ReadableStream from the OpenAI stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('DeepSeek API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
