import { SlideData } from '../types';

export interface QAReport {
  passed: boolean;
  score: number; // 0 a 100
  checks: {
    name: string;
    passed: boolean;
    feedback: string;
  }[];
}

export class QualityReviewerAgent {
  name = 'Camila Siqueira';
  title = 'Revisora de Qualidade & Retenção de Conteúdo';
  avatar = '🔍';

  review(slides: SlideData[]): QAReport {
    const checks = [
      {
        name: 'Safe Zone & Limite de Caracteres',
        passed: slides.every((s) => s.headline.length < 120),
        feedback: 'Títulos concisos para máxima legibilidade sem estourar as margens.',
      },
      {
        name: 'Gancho Disruptivo no Slide 1',
        passed: slides[0]?.type === 'hook' && Boolean(slides[0]?.headline),
        feedback: 'Slide 1 formulado com pergunta ou dado provocativo para reter o leitor no feed.',
      },
      {
        name: 'Chamada para Ação Clara no Slide Final',
        passed: Boolean(slides[slides.length - 1]?.ctaButtonText),
        feedback: 'Slide final com direcionamento claro para a DM da @innovarymidia.',
      },
      {
        name: 'Numeração e Sequência Lógica',
        passed: slides.every((s, i) => s.slideNumber === i + 1),
        feedback: 'Todos os slides ordenados cronologicamente com contagem correta.',
      },
      {
        name: 'Hierarquia Visual e Badges',
        passed: slides.some((s) => Boolean(s.badge)),
        feedback: 'Badges temáticas inseridas para escaneabilidade e dinamismo.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      passed: score >= 80,
      score,
      checks,
    };
  }
}
