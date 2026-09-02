import { GenerationInput, SlideData } from '../types';
import { StrategyBrief } from './strategist';

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
    const topic = input.topic || 'Como parar de perder margem de lucro no delivery';
    const slides: SlideData[] = [];

    // SLIDE 1: HOOK MAGNETICO
    slides.push({
      id: 'slide-1',
      slideNumber: 1,
      totalSlides: slideCount,
      type: 'hook',
      badge: 'ALERTA PARA DONOS DE DELIVERY 🚨',
      headline: this.generateHeadline(topic, brief),
      highlightWord: 'margem de lucro',
      subtitle: 'Se você vende comida e quer ver dinheiro de verdade no caixa no fim do mês, arraste para o lado.',
      ctaButtonText: 'Arraste para entender ➔',
    });

    // SLIDE 2: IDENTIFICAÇÃO DA DOR VISCERAL
    slides.push({
      id: 'slide-2',
      slideNumber: 2,
      totalSlides: slideCount,
      type: 'problem',
      badge: 'O CENÁRIO REAL 📉',
      headline: 'Você trabalha 14 horas por dia, mas o lucro parece não sobrar.',
      subtitle: brief.corePain,
      bodyText: [
        'A cozinha não para, o motoboy corre a noite toda, os comprovantes acumulam na impressora...',
        'Mas quando fecha o caixa no dia 30, você descobre que trabalhou mais para os outros do que para você mesmo.',
      ],
      points: [
        'Taxas que devoram de 23% a 30% do faturamento',
        'Clientes que nunca mais compram se não tiver cupom',
        'Dias de semana vazios pagando funcionário parado',
      ],
    });

    // SLIDE 3: O GRANDE ERRO DO MERCADO
    slides.push({
      id: 'slide-3',
      slideNumber: 3,
      totalSlides: slideCount,
      type: 'problem',
      badge: 'A ARMADILHA ⚠️',
      headline: 'Achar que "apenas postar foto de comida bonita" vai encher seu salão ou delivery.',
      subtitle: brief.culprit,
      bodyText: [
        'O alcance orgânico do Instagram entrega suas postagens para apenas 3% a 5% dos seus seguidores.',
        'E quando você aperta o botão "Impulsionar", o algoritmo queima sua verba com pessoas fora do seu raio de entrega.',
      ],
      customNote: 'Curtida e seguidor não pagam boleto de fornecedor nem conta de energia da câmara fria.',
    });

    // SLIDE 4: A METODOLOGIA INNOVARY MÍDIA
    slides.push({
      id: 'slide-4',
      slideNumber: 4,
      totalSlides: slideCount,
      type: 'solution',
      badge: 'O MÉTODO INNOVARY 🚀',
      headline: 'Tráfego Hiperlocal: O sistema que coloca seus pedidos no piloto estratégico.',
      subtitle: brief.solutionAngle,
      bodyText: [
        'Não anunciamos para o Brasil inteiro. Mapeamos um raio milimétrico de 3km a 6km ao redor do seu ponto.',
        'Seus pratos aparecem no feed e nos Stories das pessoas exatamente no horário de maior apetite (18h às 21h).',
      ],
      points: [
        'Anúncios programados por horário de fome',
        'Exclusão de bairros fora da sua taxa de entrega',
        'Direcionamento direto para o seu WhatsApp ou cardápio próprio',
      ],
    });

    // SLIDES ADICIONAIS CONFORME A QUANTIDADE SOLICITADA
    if (slideCount >= 6) {
      slides.push({
        id: 'slide-5',
        slideNumber: 5,
        totalSlides: slideCount,
        type: 'proof',
        badge: 'A MATEMÁTICA DO LUCRO 💰',
        headline: 'A diferença entre ser refém do app e ter seu próprio ecossistema.',
        bodyText: [
          'No Marketplace de terceiros: Você vende R$ 30.000 e deixa R$ 8.100 em comissão todo mês.',
          'Com Tráfego Próprio da Innovary: Você investe R$ 1.500 em anúncios e os 100% do valor do pedido entram no seu bolso.',
        ],
        metricNumber: '100%',
        metricLabel: 'Do valor do pedido no seu canal próprio, sem comissões abusivas',
      });
    }

    if (slideCount === 7) {
      slides.push({
        id: 'slide-6',
        slideNumber: 6,
        totalSlides: slideCount,
        type: 'content',
        badge: 'O PLANO DE AÇÃO 📋',
        headline: 'O que fazemos para o seu delivery vender todos os dias da semana:',
        points: [
          '1. Criamos campanhas de ofertas de meio de semana para lotar a terça e quarta',
          '2. Remarketing agressivo para quem já pediu uma vez pedir de novo',
          '3. Anúncios com fotos e vídeos reais que ativam o desejo imediato de comer',
          '4. Relatórios claros de quantos pedidos foram gerados por cada centavo investido',
        ],
      });
    }

    // ÚLTIMO SLIDE: CALL TO ACTION MATADOR
    slides.push({
      id: `slide-${slideCount}`,
      slideNumber: slideCount,
      totalSlides: slideCount,
      type: 'cta',
      badge: 'PRÓXIMO PASSO 🤝',
      headline: 'Pronto para parar de perder margem e lotar sua impressora de pedidos?',
      subtitle: 'Não deixe sua cozinha operando abaixo da capacidade. A Innovary Mídia cuida de todo o tráfego pago do seu delivery.',
      bodyText: [
        'Analisamos sua região e montamos a estratégia perfeita para o seu cardápio.',
        'Mande uma mensagem direta no nosso perfil agora.',
      ],
      ctaButtonText: 'Envie "DELIVERY" no direct da @innovarymidia',
      customNote: 'Salve este post para consultar quando for planejar a meta do mês!',
    });

    const caption = this.generateCaption(topic, brief);
    const hashtags = [
      '#marketingparadelivery',
      '#gestaodetrafego',
      '#trafegopagodelivery',
      '#hamburgueriaartesanal',
      '#pizzariadelivery',
      '#foodservicebrasil',
      '#restaurantesp',
      '#deliveryproprio',
      '#innovarymidia',
    ];

    return { slides, caption, hashtags };
  }

  private generateHeadline(topic: string, brief: StrategyBrief): string {
    if (topic.length > 10 && topic.length < 75) {
      return topic;
    }
    return 'Por que seu delivery fatura alto no mês, mas o lucro não sobra no bolso?';
  }

  private generateCaption(topic: string, brief: StrategyBrief): string {
    return `Se você é dono de restaurante, hamburgueria, pizzaria ou sushi, responda com sinceridade:

Quantas vezes você fechou o mês com a sensação de que a cozinha trabalhou sem parar, mas o lucro líquido sumiu?

A verdade nua e crua:
1️⃣ Ficar refém das taxas de 27% a 30% dos aplicativos corrói o coração financeiro da sua operação.
2️⃣ Contratar cardápio digital próprio e não investir em tráfego é igual abrir uma loja no meio do deserto.
3️⃣ Apertar o botão "Impulsionar" só serve para atrair curtidas de quem mora longe da sua entrega.

Aqui na @innovarymidia, nós implementamos um Sistema de Tráfego Hiperlocal para food service:
🎯 Anúncios segmentados por raio de entrega em km.
⏰ Disparados nos horários exatos de pico de fome da sua cidade.
🚀 Foco total em canal próprio (WhatsApp e Cardápio Digital) para você reter 100% da sua margem.

Quer que a gente faça um diagnóstico gratuito da presença digital do seu delivery?

👇 Comente "DELIVERY" aqui embaixo ou mande uma mensagem na nossa DM (@innovarymidia).

---
Salva esse carrossel para revisar com sua equipe de gestão!`;
  }
}
