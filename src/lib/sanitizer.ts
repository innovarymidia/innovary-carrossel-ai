import { SlideData, CarouselProject } from './types';

/**
 * Sanitiza rigorosamente qualquer texto, eliminando & e travessões
 */
export function sanitizeText(text?: string | null): string {
  if (!text) return '';

  return (
    text
      // 1. Bloqueia e substitui & por 'e'
      .replace(/&amp;/gi, ' e ')
      .replace(/&/g, ' e ')
      // 2. Bloqueia e substitui travessões (em-dash, en-dash, barra horizontal)
      .replace(/[—–‒―]/g, ', ')
      // 3. Substitui hífen isolado com espaços antes e depois (usado como travessão)
      .replace(/\s+-\s+/g, ', ')
      // 4. Limpa pontuações duplicadas resultantes de substituições
      .replace(/,\s*,/g, ',')
      .replace(/\.\s*\./g, '.')
      .replace(/,\s*\./g, '.')
      // 5. Remove espaços em excesso
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
}

/**
 * Sanitiza uma lâmina completa
 */
export function sanitizeSlide(slide: SlideData): SlideData {
  return {
    ...slide,
    headline: sanitizeText(slide.headline),
    subtitle: slide.subtitle ? sanitizeText(slide.subtitle) : undefined,
    badge: slide.badge ? sanitizeText(slide.badge) : undefined,
    bodyText: slide.bodyText?.map((t) => sanitizeText(t)).filter(Boolean),
    points: slide.points?.map((p) => sanitizeText(p)).filter(Boolean),
    metricLabel: slide.metricLabel ? sanitizeText(slide.metricLabel) : undefined,
    ctaButtonText: slide.ctaButtonText ? sanitizeText(slide.ctaButtonText) : undefined,
    customNote: slide.customNote ? sanitizeText(slide.customNote) : undefined,
    highlightWord: slide.highlightWord ? sanitizeText(slide.highlightWord) : undefined,
  };
}

/**
 * Sanitiza o projeto de carrossel inteiro
 */
export function sanitizeProject(project: CarouselProject): CarouselProject {
  return {
    ...project,
    topic: sanitizeText(project.topic),
    targetAudience: sanitizeText(project.targetAudience),
    niche: sanitizeText(project.niche),
    caption: sanitizeText(project.caption),
    hashtags: project.hashtags.map((h) => sanitizeText(h).replace(/\s+/g, '')),
    slides: project.slides.map((s) => sanitizeSlide(s)),
  };
}
