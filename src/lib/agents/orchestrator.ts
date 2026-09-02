import { GoogleGenerativeAI } from '@google/generative-ai';
import { CarouselProject, GenerationInput, AgentStatus, SlideData } from '../types';
import { StrategistAgent } from './strategist';
import { CopywriterAgent } from './copywriter';
import { DesignerAgent } from './designer';
import { QualityReviewerAgent, QAReport } from './qa';
import { PublisherAgent } from './publisher';
import { sanitizeText, sanitizeProject } from '../sanitizer';

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
        message: 'Executará Auto-Análise (Safe Zones, Proporção e Bloqueio de & e travessões)...',
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
    await delay(350);

    const brief = this.strategist.analyze(input);
    updateAgent(
      'strategist',
      'completed',
      'Ângulo estratégico definido!',
      `Dor central: ${brief.corePain.slice(0, 65)}...`
    );

    // =========================================================================
    // ETAPA 2: AGENTE COPYWRITER & ROTEIRISTA
    // =========================================================================
    updateAgent('copywriter', 'running', `Escrevendo roteiro de ${input.slideCount} lâminas com retenção...`);
    await delay(400);

    let copyOutput = await this.tryGeminiGeneration(input, brief);
    if (!copyOutput) {
      // Fallback para o motor estratégico local
      copyOutput = this.copywriter.generate(input, brief);
    }

    updateAgent(
      'copywriter',
      'completed',
      `${copyOutput.slides.length} lâminas geradas!`,
      `Hook: "${copyOutput.slides[0].headline.slice(0, 50)}..."`
    );

    // =========================================================================
    // ETAPA 3: AGENTE DIRETOR DE ARTE
    // =========================================================================
    updateAgent('designer', 'running', `Formatando no padrão 1080x1350 no estilo ${input.themeStyle}...`);
    await delay(300);

    const styleSpec = this.designer.getStyleSpec(input.themeStyle);
    updateAgent(
      'designer',
      'completed',
      `Estilo ${styleSpec.name} aplicado!`,
      `Paleta oficial: Laranja ${styleSpec.accentColor} | Space Grotesk`
    );

    // =========================================================================
    // ETAPA 4: AGENTE REVISOR DE QUALIDADE (QA & AUTO-ANÁLISE OBRIGATÓRIA)
    // =========================================================================
    updateAgent('qa', 'running', 'Executando Auto-Análise prévia: checando Safe Zones, corte e caracteres proibidos...');
    await delay(450);

    // Executa auto-análise e correção automática deSafe Zones e caracteres
    const qaReport: QAReport = this.qa.reviewAndAutoCorrect(copyOutput.slides);

    updateAgent(
      'qa',
      'completed',
      `Auto-Análise concluída com nota ${qaReport.score}/100!`,
      `Safe Zones validadas. Bloqueio de & e travessões 100% ativo.`
    );

    // =========================================================================
    // ETAPA 5: AGENTE PUBLICADOR / EXPORTADOR
    // =========================================================================
    updateAgent('publisher', 'completed', 'Pronto para visualização impecável e download!');

    const baseProject: CarouselProject = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topic: input.topic || 'Como parar de perder margem no delivery',
      targetAudience: 'Donos de Hamburguerias, Pizzarias e Restaurantes Food Service',
      niche: 'Tráfego Pago para Delivery',
      slideCount: qaReport.sanitizedSlides.length,
      themeStyle: input.themeStyle,
      caption: copyOutput.caption,
      hashtags: copyOutput.hashtags,
      slides: qaReport.sanitizedSlides,
      status: 'reviewed',
      authorHandle: '@innovarymidia',
      qaReport,
    };

    // Garante sanitização final em todo o projeto
    return sanitizeProject(baseProject);
  }

  private async tryGeminiGeneration(input: GenerationInput, brief: any): Promise<{ slides: SlideData[]; caption: string; hashtags: string[] } | null> {
    const apiKey = input.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Você é o copywriter da agência @innovarymidia (www.innovarymidia.com.br).
Crie um carrossel para Instagram de EXATAMENTE ${input.slideCount} lâminas para donos de delivery e restaurantes (food service).
Tema: "${input.topic || 'Como parar de perder margem no delivery'}"

REGRAS OBRIGATÓRIAS E CRÍTICAS DE ESTILO:
1. NUNCA use o caractere & em nenhum texto. Use sempre a palavra "e".
2. NUNCA use travessão (— ou –) nem hífens isolados. Use vírgulas ou pontos naturais.
3. DIMENSIONAMENTO PERFEITO: Mantenha os textos curtos e concisos (headline máx 75 caracteres, subtítulo máx 100 caracteres) para caberem com folga e elegância na proporção 4:5 vertical (1080x1350) sem NENHUM corte.
4. O slide 1 deve ser um HOOK forte. O slide final deve ser um CTA direto para a DM da @innovarymidia.

Retorne APENAS um JSON válido:
{
  "slides": [
    {
      "slideNumber": 1,
      "totalSlides": ${input.slideCount},
      "type": "hook",
      "badge": "ALERTA PARA DONOS DE DELIVERY",
      "headline": "Título curto e instigante",
      "subtitle": "Subtítulo conciso",
      "ctaButtonText": "Arraste para entender ➔"
    }
  ],
  "caption": "Legenda completa formatada com chamada para o direct da @innovarymidia",
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
          s.headline = sanitizeText(s.headline);
          s.subtitle = sanitizeText(s.subtitle);
          s.badge = sanitizeText(s.badge);
        });
        return {
          slides: parsed.slides,
          caption: sanitizeText(parsed.caption),
          hashtags: parsed.hashtags || [],
        };
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
