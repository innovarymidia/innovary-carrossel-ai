import React, { forwardRef } from 'react';
import { SlideData, ThemeStyle } from '../lib/types';
import { THEME_CONFIGS } from '../lib/presets';
import { sanitizeText } from '../lib/sanitizer';
import { INNOVARY_LOGO_BASE64 } from '../lib/brandLogo';
import { 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Bookmark, 
  Send, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SlideCanvasProps {
  slide: SlideData;
  themeStyle: ThemeStyle;
  authorHandle?: string;
  isExporting?: boolean;
}

export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  ({ slide, themeStyle, authorHandle = '@innovarymidia', isExporting = false }, ref) => {
    const config = THEME_CONFIGS[themeStyle] || THEME_CONFIGS.dark_fire;
    const isFirst = slide.slideNumber === 1;
    const isLast = slide.slideNumber === slide.totalSlides;

    // Sanitização em tempo de renderização
    const headline = sanitizeText(slide.headline);
    const subtitle = sanitizeText(slide.subtitle);
    const badge = sanitizeText(slide.badge);
    const customNote = sanitizeText(slide.customNote);
    const ctaButtonText = sanitizeText(slide.ctaButtonText);

    // Ajuste dinâmico do tamanho da fonte da headline para evitar estouro
    const getHeadlineFontSize = () => {
      if (isFirst) return 'clamp(1.5rem, 3.8vw, 2.1rem)';
      if (headline.length > 70) return 'clamp(1.2rem, 3vw, 1.5rem)';
      if (headline.length > 50) return 'clamp(1.3rem, 3.2vw, 1.65rem)';
      return 'clamp(1.4rem, 3.5vw, 1.8rem)';
    };

    return (
      <div
        ref={ref}
        data-slide-index={slide.slideNumber}
        className="relative select-none overflow-hidden flex flex-col justify-between"
        style={{
          width: isExporting ? '1080px' : '100%',
          height: isExporting ? '1350px' : '100%',
          aspectRatio: '4 / 5',
          background: config.bg,
          color: config.textColor,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          padding: isExporting ? '85px 75px' : '6% 6.5%',
        }}
      >
        {/* =================================================================== */}
        {/* ELEMENTOS DECORATIVOS DE FUNDO                                     */}
        {/* =================================================================== */}
        {themeStyle === 'dark_fire' && (
          <>
            <div 
              className="absolute -top-28 -right-28 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #FF3D00 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #EA580C 0%, transparent 70%)' }}
            />
            <div 
              className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </>
        )}

        {themeStyle === 'alert_loss' && (
          <>
            <div 
              className="absolute top-0 inset-x-0 h-2.5"
              style={{ background: 'repeating-linear-gradient(45deg, #FF2E2E, #FF2E2E 15px, #000 15px, #000 30px)' }}
            />
            <div 
              className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, #FF2E2E 0%, transparent 70%)' }}
            />
          </>
        )}

        {themeStyle === 'data_growth' && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255, 61, 0, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 61, 0, 0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        )}

        {themeStyle === 'sunset_gradient' && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(234, 88, 12, 0.45) 0%, transparent 75%)',
            }}
          />
        )}

        {/* =================================================================== */}
        {/* CABEÇALHO DO SLIDE: MARCA + NUMERAÇÃO                              */}
        {/* =================================================================== */}
        <div 
          className="relative z-10 flex items-center justify-between w-full border-b pb-3 mb-2 shrink-0"
          style={{ borderColor: themeStyle === 'clean_authority' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)' }}
        >
          {/* Perfil Innovary Mídia com Logo Circular Oficial */}
          <div className="flex items-center gap-2.5">
            <div 
              className={`rounded-full overflow-hidden flex items-center justify-center shadow-md shrink-0 border ${
                isExporting ? 'w-14 h-14 border-2' : 'w-8 h-8 border'
              }`}
              style={{ borderColor: config.accent, background: '#0d0b0b' }}
            >
              <img 
                src={INNOVARY_LOGO_BASE64} 
                alt="Innovary Mídia" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span 
                className={`font-bold tracking-tight leading-none ${isExporting ? 'text-2xl' : 'text-xs'}`} 
                style={{ color: config.textColor }}
              >
                Innovary Mídia
              </span>
              <span 
                className={`font-medium tracking-wide mt-0.5 ${isExporting ? 'text-lg' : 'text-[10px]'}`} 
                style={{ color: config.textMuted }}
              >
                {authorHandle}
              </span>
            </div>
          </div>

          {/* Numeração de Páginas */}
          <div 
            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider"
            style={{ 
              background: config.badgeBg, 
              color: config.badgeText,
              border: `1px solid ${config.badgeBorder}` 
            }}
          >
            {String(slide.slideNumber).padStart(2, '0')} / {String(slide.totalSlides).padStart(2, '0')}
          </div>
        </div>

        {/* Barra de Progresso Fina */}
        <div className="relative z-10 w-full h-1 rounded-full overflow-hidden mb-3 shrink-0" style={{ background: 'rgba(128, 128, 128, 0.18)' }}>
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${(slide.slideNumber / slide.totalSlides) * 100}%`,
              background: config.accentGradient 
            }}
          />
        </div>

        {/* =================================================================== */}
        {/* ÁREA CENTRAL DO CONTEÚDO (PROPORCIONAL E RESPIRADA)                 */}
        {/* =================================================================== */}
        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0 py-2">
          {/* Badge de Destaque */}
          {badge && (
            <div className="mb-2 shrink-0">
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm"
                style={{
                  background: config.badgeBg,
                  color: config.badgeText,
                  border: `1px solid ${config.badgeBorder}`,
                }}
              >
                {themeStyle === 'alert_loss' && <AlertTriangle className="w-3 h-3" />}
                {themeStyle === 'data_growth' && <TrendingUp className="w-3 h-3" />}
                {themeStyle === 'dark_fire' && <Sparkles className="w-3 h-3" />}
                {badge}
              </span>
            </div>
          )}

          {/* TÍTULO PRINCIPAL (HEADLINE) */}
          <h1 
            className="font-extrabold tracking-tight leading-[1.2] mb-3 text-left"
            style={{
              fontSize: getHeadlineFontSize(),
              color: config.textColor,
            }}
          >
            {headline}
          </h1>

          {/* SUBTÍTULO OU COMPLEMENTO */}
          {subtitle && (
            <p 
              className="text-xs sm:text-sm font-medium leading-relaxed mb-3 line-clamp-3"
              style={{ color: config.textMuted }}
            >
              {subtitle}
            </p>
          )}

          {/* PARÁGRAFOS EXPLICATIVOS CONCISOS */}
          {slide.bodyText && slide.bodyText.length > 0 && !slide.points && (
            <div 
              className="p-3.5 rounded-xl mb-3 border space-y-2 backdrop-blur-sm shadow-sm"
              style={{
                background: config.cardBg,
                borderColor: config.cardBorder,
              }}
            >
              {slide.bodyText.map((paragraph, idx) => (
                <p key={idx} className="text-xs sm:text-sm leading-relaxed" style={{ color: config.textColor }}>
                  {sanitizeText(paragraph)}
                </p>
              ))}
            </div>
          )}

          {/* LISTA DE TÓPICOS (COM ESPAÇAMENTO E ALTURA CALIBRADOS) */}
          {slide.points && slide.points.length > 0 && (
            <div className="space-y-2 my-2">
              {slide.points.slice(0, 4).map((pt, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 p-2 rounded-lg border text-xs sm:text-sm"
                  style={{
                    background: config.cardBg,
                    borderColor: config.cardBorder,
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: config.badgeBg, color: config.badgeText }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="font-medium leading-snug" style={{ color: config.textColor }}>
                    {sanitizeText(pt)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* MÉTRICA DE DESTAQUE */}
          {slide.metricNumber && (
            <div 
              className="p-4 rounded-xl border text-center my-2 relative overflow-hidden"
              style={{
                background: config.cardBg,
                borderColor: config.accent,
                boxShadow: `0 0 20px -5px ${config.accent}30`,
              }}
            >
              <div 
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-0.5"
                style={{ color: config.accent }}
              >
                {slide.metricNumber}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: config.textMuted }}>
                {sanitizeText(slide.metricLabel)}
              </div>
            </div>
          )}

          {/* NOTA DE DESTAQUE */}
          {customNote && (
            <div 
              className="p-2.5 rounded-lg border-l-4 text-[11px] font-semibold mt-1"
              style={{
                background: config.badgeBg,
                borderColor: config.accent,
                color: config.textColor,
              }}
            >
              💡 {customNote}
            </div>
          )}

          {/* BOTÃO DE CTA (SLIDE FINAL) */}
          {isLast && ctaButtonText && (
            <div className="mt-3 pt-1">
              <div 
                className="w-full py-3 px-5 rounded-xl font-bold text-center text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 text-white"
                style={{ 
                  background: config.accentGradient,
                  boxShadow: '0 8px 20px -4px rgba(255, 61, 0, 0.4)' 
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{ctaButtonText}</span>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RODAPÉ DO SLIDE                                                    */}
        {/* =================================================================== */}
        <div 
          className="relative z-10 pt-3 mt-2 border-t flex items-center justify-between text-[11px] shrink-0"
          style={{ 
            borderColor: themeStyle === 'clean_authority' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)',
            color: config.textMuted 
          }}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.accent }} />
            <span>Tráfego Pago para Food Service</span>
          </div>

          <div className="flex items-center gap-1 font-bold" style={{ color: config.accent }}>
            {!isLast ? (
              <>
                <span>Arraste para o lado</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Salvar post</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SlideCanvas.displayName = 'SlideCanvas';
