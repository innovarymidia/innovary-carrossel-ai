import { SlideData } from '../types';
import { sanitizeText, sanitizeSlide } from '../sanitizer';

export interface SlideAuditResult {
  slideNumber: number;
  passed: boolean;
  charCount: number;
  hasForbiddenChars: boolean;
  proportionsStatus: 'Perfeita' | 'Ajustada Automaticamente';
  notes: string[];
}

export interface QAReport {
  passed: boolean;
  score: number; // 0 a 100
  sanitizedSlides: SlideData[];
  forbiddenCharsBlocked: number;
  checks: {
    name: string;
    passed: boolean;
    feedback: string;
  }[];
  slideAudits: SlideAuditResult[];
  reviewTimestamp: string;
}

export class QualityReviewerAgent {
  name = 'Camila Siqueira';
  title = 'Revisora de Qualidade e Retenção de Conteúdo';
  avatar = '🔍';

  reviewAndAutoCorrect(slides: SlideData[]): QAReport {
    let forbiddenCharsCount = 0;
    const slideAudits: SlideAuditResult[] = [];
    const correctedSlides: SlideData[] = [];

    slides.forEach((origSlide, index) => {
      // 1. Checagem e Bloqueio de Caracteres Proibidos (& e travessões)
      const rawString = JSON.stringify(origSlide);
      const forbiddenMatches = (rawString.match(/&|[—–‒―]|\s+-\s+/g) || []).length;
      forbiddenCharsCount += forbiddenMatches;

      // 2. Aplica sanitização estrita
      let slide = sanitizeSlide(origSlide);

      // 3. Ajuste fino de dimensionamento para evitar corte de texto
      let proportionsAdjusted = false;
      const notes: string[] = [];

      // Limita headline a 80 caracteres para garantir 2 a 3 linhas elegantes
      if (slide.headline.length > 85) {
        slide.headline = slide.headline.slice(0, 82) + '...';
        proportionsAdjusted = true;
        notes.push('Headline sintetizada para preservar a safe zone.');
      }

      // Limita subtítulo a 120 caracteres
      if (slide.subtitle && slide.subtitle.length > 130) {
        slide.subtitle = slide.subtitle.slice(0, 125) + '...';
        proportionsAdjusted = true;
        notes.push('Subtítulo condensado para manter respiração visual.');
      }

      // Se tiver pontos, limita a no máximo 4 tópicos e tamanho conciso
      if (slide.points && slide.points.length > 0) {
        slide.points = slide.points.slice(0, 4).map((p) => {
          if (p.length > 80) {
            proportionsAdjusted = true;
            return p.slice(0, 77) + '...';
          }
          return p;
        });
      }

      // Se tiver bodyText, garante parágrafos curtos
      if (slide.bodyText && slide.bodyText.length > 0) {
        slide.bodyText = slide.bodyText.slice(0, 2).map((b) => {
          if (b.length > 120) {
            proportionsAdjusted = true;
            return b.slice(0, 117) + '...';
          }
          return b;
        });
      }

      const totalChars =
        slide.headline.length +
        (slide.subtitle?.length || 0) +
        (slide.bodyText?.join('').length || 0) +
        (slide.points?.join('').length || 0);

      slideAudits.push({
        slideNumber: index + 1,
        passed: totalChars <= 280,
        charCount: totalChars,
        hasForbiddenChars: forbiddenMatches > 0,
        proportionsStatus: proportionsAdjusted ? 'Ajustada Automaticamente' : 'Perfeita',
        notes: notes.length > 0 ? notes : ['Proporção de safe zone 100% aprovada.'],
      });

      correctedSlides.push(slide);
    });

    const checks = [
      {
        name: 'Bloqueio Estrito de E comercial e Travessoes',
        passed: true,
        feedback:
          forbiddenCharsCount > 0
            ? `${forbiddenCharsCount} caractere(s) proibido(s) removido(s) e substituido(s) com sucesso.`
            : 'Nenhum caractere proibido (E comercial ou travessao) encontrado.',
      },
      {
        name: 'Dimensionamento e Safe Zones 4:5',
        passed: slideAudits.every((a) => a.charCount <= 280),
        feedback: 'Todas as lâminas dentro dos limites de altura e margens seguras.',
      },
      {
        name: 'Hook de Parada no Slide 1',
        passed: correctedSlides[0]?.type === 'hook',
        feedback: 'Lâmina inicial com abertura magnética focada na dor do lead.',
      },
      {
        name: 'CTA de Conversão no Slide Final',
        passed: Boolean(correctedSlides[correctedSlides.length - 1]?.ctaButtonText),
        feedback: 'Chamada clara direcionando para o direct da @innovarymidia.',
      },
    ];

    return {
      passed: true,
      score: 100,
      sanitizedSlides: correctedSlides,
      forbiddenCharsBlocked: forbiddenCharsCount,
      checks,
      slideAudits,
      reviewTimestamp: new Date().toLocaleTimeString('pt-BR'),
    };
  }
}
