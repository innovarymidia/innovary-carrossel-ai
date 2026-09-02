import { NextRequest, NextResponse } from 'next/server';
import { PublisherAgent } from '@/lib/agents/publisher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrls, caption, accessToken, instagramAccountId } = body;

    const publisher = new PublisherAgent();
    const result = await publisher.publishToInstagram(imageUrls, caption, {
      accessToken: accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || '',
      instagramAccountId: instagramAccountId || process.env.INSTAGRAM_PAGE_ID || '',
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Falha na publicação' },
      { status: 500 }
    );
  }
}
