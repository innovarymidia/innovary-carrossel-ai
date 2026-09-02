import React, { forwardRef } from 'react';
import { SlideData, ThemeStyle } from '../lib/types';
import { THEME_CONFIGS } from '../lib/presets';
import { 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  Bookmark, 
  Send, 
  ChevronRight,
  Sparkles,
  DollarSign
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

    // Dimensões nativas 1080x1350 (4:5 vertical do Instagram)
    // Quando exibido no preview, o container pai define o scale ou tamanho relativo.
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
          padding: isExporting ? '85px 75px' : '7%',
        }}
      >
        {/* =================================================================== */}
        {/* ELEMENTOS DECORATIVOS DE FUNDO CONFORME O TEMA                     */}
        {/* =================================================================== */}
        {themeStyle === 'dark_fire' && (
          <>
            <div 
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #FF3D00 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
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
              className="absolute top-0 inset-x-0 h-3"
              style={{ background: 'repeating-linear-gradient(45deg, #FF2E2E, #FF2E2E 15px, #000 15px, #000 30px)' }}
            />
            <div 
              className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #FF2E2E 0%, transparent 70%)' }}
            />
          </>
        )}

        {themeStyle === 'data_growth' && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255, 61, 0, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 61, 0, 0.15) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        )}

        {themeStyle === 'sunset_gradient' && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(234, 88, 12, 0.45) 0%, transparent 75%)',
            }}
          />
        )}

        {/* =================================================================== */}
        {/* CABEÇALHO DO SLIDE: LOGO / PERFIL + NUMERAÇÃO                      */}
        {/* =================================================================== */}
        <div className="relative z-10 flex items-center justify-between w-full border-b pb-4 mb-4"
          style={{ borderColor: themeStyle === 'clean_authority' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)' }}
        >
          {/* Perfil Innovary Mídia */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-xs"
              style={{ background: 'linear-gradient(135deg, #FF3D00, #EA580C)' }}
            >
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none" style={{ color: config.textColor }}>
                Innovary Mídia
              </span>
              <span className="text-[11px] font-medium tracking-wide mt-0.5" style={{ color: config.textMuted }}>
                {authorHandle}
              </span>
            </div>
          </div>

          {/* Numeração de Páginas */}
          <div className="flex items-center gap-2">
            <div 
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
              style={{ 
                background: config.badgeBg, 
                color: config.badgeText,
                border: `1px solid ${config.badgeBorder}` 
              }}
            >
              {String(slide.slideNumber).padStart(2, '0')} / {String(slide.totalSlides).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Barra de Progresso Fina no Topo */}
        <div className="relative z-10 w-full h-1 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(128, 128, 128, 0.2)' }}>
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${(slide.slideNumber / slide.totalSlides) * 100}%`,
              background: config.accentGradient 
            }}
          />
        </div>

        {/* =================================================================== */}
        {/* CONTEÚDO PRINCIPAL (CORPO DO SLIDE)                                 */}
        {/* =================================================================== */}
        <div className="relative z-10 flex-1 flex flex-col justify-center my-auto">
          {/* Badge Temático de Destaque */}
          {slide.badge && (
            <div className="mb-4">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm"
                style={{
                  background: config.badgeBg,
                  color: config.badgeText,
                  border: `1px solid ${config.badgeBorder}`,
                }}
              >
                {themeStyle === 'alert_loss' && <AlertTriangle className="w-3.5 h-3.5" />}
                {themeStyle === 'data_growth' && <TrendingUp className="w-3.5 h-3.5" />}
                {themeStyle === 'dark_fire' && <Sparkles className="w-3.5 h-3.5" />}
                {slide.badge}
              </span>
            </div>
          )}

          {/* TÍTULO PRINCIPAL (HEADLINE) */}
          <h1 
            className="font-extrabold tracking-tight leading-[1.15] mb-4 text-left"
            style={{
              fontSize: isFirst ? '2rem' : '1.75rem',
              color: config.textColor,
            }}
          >
            {slide.headline}
          </h1>

          {/* SUBTÍTULO OU COMPLEMENTO */}
          {slide.subtitle && (
            <p 
              className="text-sm md:text-base font-medium leading-relaxed mb-5"
              style={{ color: config.textMuted }}
            >
              {slide.subtitle}
            </p>
          )}

          {/* CORPO DE TEXTO / PARÁGRAFOS EM CARD */}
          {slide.bodyText && slide.bodyText.length > 0 && (
            <div 
              className="p-4 rounded-xl mb-4 border space-y-2.5 backdrop-blur-sm shadow-sm"
              style={{
                background: config.cardBg,
                borderColor: config.cardBorder,
              }}
            >
              {slide.bodyText.map((paragraph, idx) => (
                <p key={idx} className="text-xs md:text-sm leading-relaxed" style={{ color: config.textColor }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* BULLET POINTS (LISTA DE BENEFÍCIOS OU DORES) */}
          {slide.points && slide.points.length > 0 && (
            <div className="space-y-2.5 my-3">
              {slide.points.map((pt, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border text-xs md:text-sm"
                  style={{
                    background: config.cardBg,
                    borderColor: config.cardBorder,
                  }}
                >
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: config.badgeBg, color: config.badgeText }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium leading-tight" style={{ color: config.textColor }}>
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* MÉTRICA DE DESTAQUE (PARA SLIDE DE COMPARAÇÃO / LUCRO) */}
          {slide.metricNumber && (
            <div 
              className="p-5 rounded-2xl border text-center my-3 relative overflow-hidden"
              style={{
                background: config.cardBg,
                borderColor: config.accent,
                boxShadow: `0 0 25px -5px ${config.accent}40`,
              }}
            >
              <div 
                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1"
                style={{ color: config.accent }}
              >
                {slide.metricNumber}
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider" style={{ color: config.textMuted }}>
                {slide.metricLabel}
              </div>
            </div>
          )}

          {/* NOTA PERSONALIZADA OU CITAÇÃO */}
          {slide.customNote && (
            <div 
              className="p-3 rounded-lg border-l-4 text-xs font-semibold italic mt-2"
              style={{
                background: config.badgeBg,
                borderColor: config.accent,
                color: config.textColor,
              }}
            >
              💡 {slide.customNote}
            </div>
          )}

          {/* BOTÃO DE CTA (ESPECIAL NO ÚLTIMO SLIDE) */}
          {isLast && slide.ctaButtonText && (
            <div className="mt-4 pt-2">
              <div 
                className="w-full py-3.5 px-6 rounded-xl font-bold text-center text-sm shadow-lg flex items-center justify-center gap-2 text-white"
                style={{ 
                  background: config.accentGradient,
                  boxShadow: '0 10px 25px -5px rgba(255, 61, 0, 0.4)' 
                }}
              >
                <Send className="w-4 h-4" />
                <span>{slide.ctaButtonText}</span>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RODAPÉ DO SLIDE: INDICAÇÃO DE ARRASTE OU CTA                        */}
        {/* =================================================================== */}
        <div 
          className="relative z-10 pt-4 mt-4 border-t flex items-center justify-between text-xs"
          style={{ 
            borderColor: themeStyle === 'clean_authority' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)',
            color: config.textMuted 
          }}
        >
          {/* Lado Esquerdo: Tag da Agência */}
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: config.accent }} />
            <span>Tráfego Pago para Food Service</span>
          </div>

          {/* Lado Direito: Arraste para o lado ou Salvar Post */}
          <div className="flex items-center gap-1.5 font-bold" style={{ color: config.accent }}>
            {!isLast ? (
              <>
                <span>Arraste para o lado</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
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
