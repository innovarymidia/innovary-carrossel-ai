import { ThemeStyle } from '../types';
import { THEME_CONFIGS } from '../presets';

export interface StyleSpec {
  id: ThemeStyle;
  name: string;
  canvasWidth: number;   // 1080px (largura padrão Instagram)
  canvasHeight: number;  // 1350px (formato 4:5 vertical ideal para carrossel)
  safeAreaPadding: number; // 80px (margens para elementos de UI do Instagram)
  backgroundColor: string;
  cardBackground: string;
  cardBorder: string;
  accentColor: string;
  accentGradient: string;
  textColor: string;
  textMuted: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  fontHeadline: string;
  fontBody: string;
}

export class DesignerAgent {
  name = 'Mateus Castro';
  title = 'Diretor de Arte e Identidade Visual Innovary';
  avatar = '🎨';

  getStyleSpec(styleId: ThemeStyle): StyleSpec {
    const config = THEME_CONFIGS[styleId] || THEME_CONFIGS.dark_fire;

    return {
      id: styleId,
      name: config.name,
      canvasWidth: 1080,
      canvasHeight: 1350,
      safeAreaPadding: 90,
      backgroundColor: config.bg,
      cardBackground: config.cardBg,
      cardBorder: config.cardBorder,
      accentColor: config.accent,
      accentGradient: config.accentGradient,
      textColor: config.textColor,
      textMuted: config.textMuted,
      badgeBg: config.badgeBg,
      badgeBorder: config.badgeBorder,
      badgeText: config.badgeText,
      fontHeadline: 'Space Grotesk, sans-serif',
      fontBody: 'Space Grotesk, sans-serif',
    };
  }
}
