import { GenerationInput } from '../types';

export interface StrategyBrief {
  corePain: string;
  culprit: string;
  solutionAngle: string;
  hookConcept: string;
  ctaGoal: string;
}

export class StrategistAgent {
  name = 'Lucas Prado';
  title = 'Estrategista de Vendas B2B Food Service';
  avatar = '🎯';

  analyze(input: GenerationInput): StrategyBrief {
    const topic = input.topic || 'Como parar de depender das taxas abusivas do iFood';
    const lower = topic.toLowerCase();

    if (lower.includes('ifood') || lower.includes('taxa') || lower.includes('comiss')) {
      return {
        corePain: 'O restaurante fatura muito mas a margem líquida é devorada por taxas de 27% a 30% dos apps de entrega.',
        culprit: 'Falta de canal próprio ativo e dependência cega do algoritmo do marketplace.',
        solutionAngle: 'Funil de Tráfego Hiperlocal da Innovary Mídia direcionando para cardápio digital próprio ou WhatsApp com margem de 100%.',
        hookConcept: 'Expor o valor real que o dono perde todo mês para o app em dinheiro vivo.',
        ctaGoal: 'Convidar para uma análise gratuita da rota de pedidos na DM da @innovarymidia.',
      };
    }

    if (lower.includes('terça') || lower.includes('quarta') || lower.includes('fraco') || lower.includes('parado') || lower.includes('motoboy')) {
      return {
        corePain: 'Equipe e motoboys ociosos de terça a quinta-feira gerando custo fixo sem entrada de caixa.',
        culprit: 'Esperar a fome do cliente acontecer organicamente sem criar ofertas de meio de semana.',
        solutionAngle: 'Campanhas de tráfego pago geolocalizadas programadas para ligar às 17h30 com ofertas irresistíveis para clientes locais.',
        hookConcept: 'O contraste doloroso entre o sábado lotado e a terça-feira de portas abertas às moscas.',
        ctaGoal: 'Chamar no direct para estruturar o calendário de anúncios para os dias fracos.',
      };
    }

    if (lower.includes('impulsionar') || lower.includes('anúncio') || lower.includes('meta') || lower.includes('curtida')) {
      return {
        corePain: 'Gastar dinheiro no botão azul do Instagram e atrair apenas curtidas vazias de pessoas longe da área de entrega.',
        culprit: 'Anunciar sem segmentação de raio geográfico (km) e sem direcionamento para fechamento de pedido.',
        solutionAngle: 'Gestão Profissional de Tráfego Innovary Mídia com exclusão de regiões inalcançáveis e pixel otimizado para conversão.',
        hookConcept: 'O botão "Impulsionar" é um ralo de dinheiro se você não dominar o Gerenciador de Anúncios.',
        ctaGoal: 'Pedir auditoria de anúncios sem custo via direct.',
      };
    }

    // Default: Tráfego Hiperlocal e Aquisição de Clientes
    return {
      corePain: 'Cozinha com capacidade produtiva ociosa e dificuldade de atrair clientes novos e recorrentes.',
      culprit: 'Achar que postar fotos de prato no feed orgânico é suficiente para fazer o telefone tocar.',
      solutionAngle: 'Estratégia de Tráfego Pago de Alta Conversão focado em raio de 3km a 7km ao redor do restaurante.',
      hookConcept: 'O seu cliente ideal está com o celular na mão com fome agora. Você está aparecendo na tela dele?',
      ctaGoal: 'Enviar mensagem direta na @innovarymidia para receber a estratégia exata.',
    };
  }
}
