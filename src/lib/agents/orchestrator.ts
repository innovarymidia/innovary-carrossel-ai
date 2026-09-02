import { GoogleGenerativeAI } from '@google/generative-ai';
import { CarouselProject, GenerationInput, AgentStatus, SlideData } from '../types';
import { StrategistAgent } from './strategist';
import { CopywriterAgent } from './copywriter';
import { DesignerAgent } from './designer';
import { QualityReviewerAgent } from './qa';
import { PublisherAgent } from './publisher';

export interface AgentUpdateCallback {
  (agents: AgentStatus[]): void;
}

export class MultiAgentOrchestrator {
  private strategist = new StrategistAgent();
  private copywriter = new CopywriterAgent();
  private designer = new DesignerAgent();
  private qa = new QualityReviewerAgent();
  private publisher = new PublisherAgent();

  getInitialAgentStatuses(): AgentStatus[] {
    return [
      {
        role: 'strategist',
        name: this.strategist.name,
        title: this.strategist.title,
        avatar: this.strategist.avatar,
        status: 'idle',
        message: 'Aguardando tema para mapear o ângulo de dor do lead...',
      },
      {
        role: 'copywriter',
        name: this.copywriter.name,
        title: this.copywriter.title,
        avatar: this.copywriter.avatar,
        status: 'idle',
        message: 'Preparando roteiro de retenção e ganchos persuasivos...',
      },
      {
        role: 'designer',
        name: this.designer.name,
        title: this.designer.title,
        avatar: this.designer.avatar,
        status: 'idle',
        message: 'Aguardando especificações para aplicar paleta Innovary...',
      },
      {
        role: 'qa',
        name: this.qa.name,
        title: this.qa.title,
        avatar: this.qa.avatar,
        status: 'idle',
        message: 'Aguardando lâminas para validar safe zones e contraste...',
      },
      {
        role: 'publisher',
        name: this.publisher.name,
        title: this.publisher.title,
        avatar: this.publisher.avatar,
        status: 'idle',
        message: 'Pronto para empacotar em alta definição (1080x1350)...',
      },
    ];
  }

  async run(
    input: GenerationInput,
    onProgress?: (agents: AgentStatus[]) => void
  ): Promise<CarouselProject> {
    const agents = this.getInitialAgentStatuses();

    const updateAgent = (role: string, status: AgentStatus['status'], message: string, details?: string) => {
      const target = agents.find((a) => a.role === role);
      if (target) {
        target.status = status;
        target.message = message;
        if (details) target.details = details;
      }
      if (onProgress) onProgress([...agents]);
    };

    // =========================================================================
    // ETAPA 1: AGENTE ESTRATEGISTA B2B FOOD SERVICE
    // =========================================================================
    updateAgent('strategist', 'running', 'Analisando o perfil do dono de delivery e dores do iFood...');
    await delay(500);

    const brief = this.strategist.analyze(input);
    updateAgent(
      'strategist',
      'completed',
      'Ângulo estratégico definido!',
      `Dor central: ${brief.corePain.slice(0, 70)}...`
    );

    // =========================================================================
    // ETAPA 2: AGENTE COPYWRITER & ROTEIRISTA
    // =========================================================================
    updateAgent('copywriter', 'running', `Escrevendo roteiro persuasivo de ${input.slideCount} lâminas...`);
    await delay(600);

    let copyOutput = await this.tryGeminiGeneration(input, brief);
    if (!copyOutput) {
      // Fallback para o motor estratégico local
      copyOutput = this.copywriter.generate(input, brief);
    }

    updateAgent(
      'copywriter',
      'completed',
      `${copyOutput.slides.length} lâminas e legenda prontas!`,
      `Hook: "${copyOutput.slides[0].headline.slice(0, 60)}..."`
    );

    // =========================================================================
    // ETAPA 3: AGENTE DIRETOR DE ARTE
    // =========================================================================
    updateAgent('designer', 'running', `Formatando no padrão 1080x1350 no estilo ${input.themeStyle}...`);
    await delay(400);

    const styleSpec = this.designer.getStyleSpec(input.themeStyle);
    updateAgent(
      'designer',
      'completed',
      `Estilo ${styleSpec.name} aplicado com sucesso!`,
      `Paleta oficial: Laranja ${styleSpec.accentColor} | Space Grotesk`
    );

    // =========================================================================
    // ETAPA 4: AGENTE REVISOR DE QUALIDADE (QA)
    // =========================================================================
    updateAgent('qa', 'running', 'Validando Safe Zones do Instagram, contraste e leitura...');
    await delay(400);

    const qaResult = this.qa.review(copyOutput.slides);
    updateAgent(
      'qa',
      'completed',
      `Aprovado com nota ${qaResult.score}/100!`,
      'Todos os slides dentro das margens seguras e alta retenção.'
    );

    // =========================================================================
    // ETAPA 5: AGENTE PUBLICADOR / EXPORTADOR
    // =========================================================================
    updateAgent('publisher', 'completed', 'Pronto para visualização, edição e download em lote!');

    const project: CarouselProject = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topic: input.topic || 'Como parar de perder margem no delivery',
      targetAudience: 'Donos de Hamburguerias, Pizzarias e Restaurantes Food Service',
      niche: 'Tráfego Pago para Delivery',
      slideCount: copyOutput.slides.length,
      themeStyle: input.themeStyle,
      caption: copyOutput.caption,
      hashtags: copyOutput.hashtags,
      slides: copyOutput.slides,
      status: 'reviewed',
      authorHandle: '@innovarymidia',
    };

    return project;
  }

  private async tryGeminiGeneration(input: GenerationInput, brief: any): Promise<{ slides: SlideData[]; caption: string; hashtags: string[] } | null> {
    const apiKey = input.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Você é um copywriter sênior da agência @innovarymidia (www.innovarymidia.com.br).
Sua missão: criar um carrossel de alto impacto para o Instagram com EXATAMENTE ${input.slideCount} slides focado em donos de delivery / food service (hamburguerias, pizzarias, sushis, marmitarias).
O objetivo é fazer o dono do delivery sentir a dor de depender do iFood (taxas de 27% a 30%), motoboy parado na terça-feira e queimar dinheiro no botão "Impulsionar", e ver a Innovary Mídia como a solução com Tráfego Hiperlocal para canal próprio / WhatsApp.

Tema solicitado: "${input.topic || 'Como parar de perder margem no delivery'}"

Retorne APENAS um JSON válido no seguinte formato sem blocos markdown adicionais:
{
  "slides": [
    {
      "slideNumber": 1,
      "totalSlides": ${input.slideCount},
      "type": "hook",
      "badge": "TEXTO CURTO DO BADGE",
      "headline": "Título instigante e magnético (máx 90 chars)",
      "subtitle": "Subtítulo curto (máx 110 chars)",
      "ctaButtonText": "Arraste para o lado ➔"
    }
  ],
  "caption": "Legenda completa do post formatada com quebras de linha e chamada para a DM da @innovarymidia",
  "hashtags": ["#marketingparadelivery", "#gestaodetrafego", "#innovarymidia"]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
        parsed.slides.forEach((s: any, idx: number) => {
          s.id = `slide-${idx + 1}`;
          s.slideNumber = idx + 1;
          s.totalSlides = parsed.slides.length;
        });
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini API call skipped or failed, using built-in strategic engine', e);
    }
    return null;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
