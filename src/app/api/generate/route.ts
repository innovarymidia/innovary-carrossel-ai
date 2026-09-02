import { NextRequest, NextResponse } from 'next/server';
import { MultiAgentOrchestrator } from '@/lib/agents/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orchestrator = new MultiAgentOrchestrator();

    const project = await orchestrator.run({
      topic: body.topic || 'Como parar de depender das taxas abusivas do iFood',
      slideCount: body.slideCount || 6,
      themeStyle: body.themeStyle || 'dark_fire',
      apiKey: body.apiKey,
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('ERRO EM /api/generate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno na geração' },
      { status: 500 }
    );
  }
}
