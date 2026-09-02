import { GenerationInput, SlideData } from '../types';
import { StrategyBrief } from './strategist';
import { sanitizeText } from '../sanitizer';

export interface CopywriterOutput {
  slides: SlideData[];
  caption: string;
  hashtags: string[];
}

export class CopywriterAgent {
  name = 'Helena Brandão';
  title = 'Copywriter Especialista em Carrosséis B2B';
  avatar = '✍️';

  generate(input: GenerationInput, brief: StrategyBrief): CopywriterOutput {
    const slideCount = Math.min(Math.max(input.slideCount || 6, 5), 7);
    const topic = sanitizeText(input.topic) || 'Como parar de perder margem de lucro no delivery';
    const slides: SlideData[] = [];

    // SLIDE 1: HOOK MAGNÉTICO (Proporção e impacto perfeitos)
    slides.push({
      id: 'slide-1',
      slideNumber: 1,
      totalSlides: slideCount,
      type: 'hook',
      badge: 'ALERTA PARA DONOS DE DELIVERY',
      headline: this.generateHeadline(topic, brief),
      highlightWord: 'margem de lucro',
      subtitle: 'Se você vende comida e quer ver dinheiro de verdade no caixa, arraste para o lado.',
      ctaButtonText: 'Arraste para entender ➔',
    });

    // SLIDE 2: IDENTIFICAÇÃO DA DOR VISCERAL (Dimensionamento limpo e focado)
    slides.push({
      id: 'slide-2',
      slideNumber: 2,
      totalSlides: slideCount,
      type: 'problem',
      badge: 'O CENÁRIO REAL',
      headline: 'Você trabalha 14 horas por dia, mas o lucro parece não sobrar.',
      subtitle: sanitizeText(brief.corePain),
      points: [
        'Taxas que devoram de 23% a 30% do seu faturamento bruto',
        'Clientes que só compram quando recebem cupom de desconto',
        'Dias de semana vazios pagando equipe e motoboy ociosos',
      ],
    });

    // SLIDE 3: O GRANDE ERRO DO MERCADO (Card explicativo conciso sem acúmulo excessivo)
    slides.push({
      id: 'slide-3',
      slideNumber: 3,
      totalSlides: slideCount,
      type: 'problem',
      badge: 'A ARMADILHA',
      headline: 'Achar que apenas postar foto de comida bonita vai encher seu delivery.',
      subtitle: sanitizeText(brief.culprit),
      bodyText: [
        'O alcance orgânico entrega seus posts para menos de 5% dos seus seguidores.',
        'E no botão Impulsionar, seu dinheiro vai para pessoas fora da sua área de entrega.',
      ],
      customNote: 'Curtida e seguidor não pagam boleto de fornecedor nem contas fixas.',
    });

    // SLIDE 4: A METODOLOGIA INNOVARY MÍDIA (Focado em pilares escaneáveis)
    slides.push({
      id: 'slide-4',
      slideNumber: 4,
      totalSlides: slideCount,
      type: 'solution',
      badge: 'O MÉTODO INNOVARY',
      headline: 'Tráfego Hiperlocal: O sistema que atrai pedidos no seu canal próprio.',
      subtitle: sanitizeText(brief.solutionAngle),
      points: [
        'Anúncios programados exatamente nos horários de maior fome',
        'Filtro por raio em km, excluindo bairros que você não atende',
        'Direcionamento direto para o seu WhatsApp ou cardápio próprio',
      ],
    });

    // SLIDES ADICIONAIS CONFORME A QUANTIDADE SOLICITADA
    if (slideCount >= 6) {
      // SLIDE 5: A MATEMÁTICA DO LUCRO
      slides.push({
        id: 'slide-5',
        slideNumber: 5,
        totalSlides: slideCount,
        type: 'proof',
        badge: 'A MATEMÁTICA DO LUCRO',
        headline: 'A diferença entre ser refém de aplicativo e ter canal próprio.',
        bodyText: [
          'No Marketplace de terceiros: Você vende R$ 30.000 e deixa R$ 8.100 em comissões.',
          'Com Tráfego Próprio Innovary: Você investe com inteligência e retém a margem no seu bolso.',
        ],
        metricNumber: '100%',
        metricLabel: 'Do valor do pedido no seu canal próprio, sem comissões abusivas',
      });
    }

    if (slideCount === 7) {
      // SLIDE 6: CHECKLIST PRÁTICO
      slides.push({
        id: 'slide-6',
        slideNumber: 6,
        totalSlides: slideCount,
        type: 'content',
        badge: 'O PLANO DE AÇÃO',
        headline: 'O que fazemos para o seu delivery vender todos os dias:',
        points: [
          '1. Campanhas de ofertas para movimentar terça e quarta',
          '2. Remarketing para quem já comprou pedir novamente',
          '3. Criativos magnéticos que despertam o apetite imediato',
          '4. Relatórios claros de faturamento gerado por anúncio',
        ],
      });
    }

    // ÚLTIMO SLIDE: CALL TO ACTION MATADOR
    slides.push({
      id: `slide-${slideCount}`,
      slideNumber: slideCount,
      totalSlides: slideCount,
      type: 'cta',
      badge: 'PRÓXIMO PASSO',
      headline: 'Pronto para parar de perder margem e lotar sua impressora de pedidos?',
      subtitle: 'Não deixe sua cozinha operando abaixo da capacidade. A Innovary Mídia cuida de todo o seu tráfego pago.',
      bodyText: [
        'Analisamos sua região e montamos a estratégia sob medida para o seu cardápio.',
      ],
      ctaButtonText: 'Envie DELIVERY no direct da @innovarymidia',
      customNote: 'Salve este post para planejar a meta do mês com sua equipe!',
    });

    const caption = this.generateCaption(topic, brief);
    const hashtags = [
      '#marketingparadelivery',
      '#gestaodetrafego',
      '#trafegopagodelivery',
      '#hamburgueriaartesanal',
      '#pizzariadelivery',
      '#foodservicebrasil',
      '#deliveryproprio',
      '#innovarymidia',
    ];

    // Sanitiza todas as lâminas e legenda para garantir ausência total de & e travessões
    const sanitizedSlides = slides.map((s) => ({
      ...s,
      headline: sanitizeText(s.headline),
      subtitle: s.subtitle ? sanitizeText(s.subtitle) : undefined,
      badge: s.badge ? sanitizeText(s.badge) : undefined,
      bodyText: s.bodyText?.map(sanitizeText).filter(Boolean),
      points: s.points?.map(sanitizeText).filter(Boolean),
      customNote: s.customNote ? sanitizeText(s.customNote) : undefined,
      ctaButtonText: s.ctaButtonText ? sanitizeText(s.ctaButtonText) : undefined,
    }));

    return { 
      slides: sanitizedSlides, 
      caption: sanitizeText(caption), 
      hashtags 
    };
  }

  private generateHeadline(topic: string, brief: StrategyBrief): string {
    const cleanTopic = sanitizeText(topic);
    if (cleanTopic.length > 10 && cleanTopic.length < 80) {
      return cleanTopic;
    }
    return 'Por que seu delivery fatura alto no mês, mas o lucro não sobra no bolso?';
  }

  private generateCaption(topic: string, brief: StrategyBrief): string {
    const rawCaption = `Se você é dono de restaurante, hamburgueria, pizzaria ou sushi, responda com sinceridade:

Quantas vezes você fechou o mês com a sensação de que a cozinha trabalhou sem parar, mas o lucro líquido sumiu?

A verdade nua e crua:
1. Ficar refém das taxas de 27% a 30% dos aplicativos corrói o coração financeiro da sua operação.
2. Contratar cardápio digital próprio e não investir em tráfego é igual abrir uma loja no meio do deserto.
3. Apertar o botão Impulsionar só serve para atrair curtidas de quem mora longe da sua entrega.

Aqui na @innovarymidia, nós implementamos um Sistema de Tráfego Hiperlocal para food service:
Anúncios segmentados por raio de entrega em km.
Disparados nos horários exatos de pico de fome da sua cidade.
Foco total em canal próprio (WhatsApp e Cardápio Digital) para você reter 100% da sua margem.

Quer que a gente faça um diagnóstico gratuito da presença digital do seu delivery?

Comente DELIVERY aqui embaixo ou mande uma mensagem na nossa DM (@innovarymidia).

Salva esse carrossel para revisar com sua equipe de gestão!`;

    return sanitizeText(rawCaption);
  }
}
