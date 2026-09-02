import React, { useState, useRef } from 'react';
import { CarouselProject, ThemeStyle } from '../lib/types';
import { THEME_CONFIGS } from '../lib/presets';
import { SlideCanvas } from './SlideCanvas';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Palette, 
  Eye, 
  Sparkles,
  Layers,
  Edit3
} from 'lucide-react';

interface CarouselViewerProps {
  project: CarouselProject;
  onSelectSlide: (index: number) => void;
  selectedSlideIndex: number;
  onThemeChange: (theme: ThemeStyle) => void;
  onDownloadSingle: (index: number) => void;
  isDownloading?: boolean;
}

export const CarouselViewer: React.FC<CarouselViewerProps> = ({
  project,
  onSelectSlide,
  selectedSlideIndex,
  onThemeChange,
  onDownloadSingle,
  isDownloading = false,
}) => {
  const currentSlide = project.slides[selectedSlideIndex] || project.slides[0];
  const totalSlides = project.slides.length;

  const handlePrev = () => {
    if (selectedSlideIndex > 0) {
      onSelectSlide(selectedSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedSlideIndex < totalSlides - 1) {
      onSelectSlide(selectedSlideIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-card border border-brand-border rounded-2xl p-4 md:p-6 shadow-xl relative">
      {/* =================================================================== */}
      {/* BARRA SUPERIOR DE CONTROLE E TEMAS                                 */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            Lâmina {selectedSlideIndex + 1} de {totalSlides}
          </span>
          <span className="text-xs text-brand-muted hidden sm:inline">
            Formato 4:5 Vertical (1080x1350)
          </span>
        </div>

        {/* Seletor Rápido dos 6 Temas */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          <Palette className="w-3.5 h-3.5 text-brand-muted shrink-0 mr-1" />
          {(Object.keys(THEME_CONFIGS) as ThemeStyle[]).map((thKey) => {
            const conf = THEME_CONFIGS[thKey];
            const isSelected = project.themeStyle === thKey;
            return (
              <button
                key={thKey}
                onClick={() => onThemeChange(thKey)}
                title={conf.description}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-orange text-white shadow-glowSm scale-105'
                    : 'bg-brand-bg text-brand-muted hover:text-white hover:bg-brand-cardHover border border-brand-border'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: conf.accent }}
                />
                {conf.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* ÁREA DO CANVAS COM MOLDURA DO INSTAGRAM FEED                       */}
      {/* =================================================================== */}
      <div className="relative flex-1 flex items-center justify-center min-h-[480px] p-2 sm:p-4">
        {/* Botão Anterior */}
        <button
          onClick={handlePrev}
          disabled={selectedSlideIndex === 0}
          aria-label="Slide anterior"
          className="absolute left-2 sm:left-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Card do Slide */}
        <div className="w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-300">
          <SlideCanvas
            slide={currentSlide}
            themeStyle={project.themeStyle}
            authorHandle={project.authorHandle}
          />
        </div>

        {/* Botão Próximo */}
        <button
          onClick={handleNext}
          disabled={selectedSlideIndex === totalSlides - 1}
          aria-label="Próximo slide"
          className="absolute right-2 sm:right-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* MINIATURAS (THUMBNAILS) INFERIORES                                 */}
      {/* =================================================================== */}
      <div className="pt-4 border-t border-brand-border mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-muted flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Sequência de Lâminas do Carrossel
          </span>
          <button
            onClick={() => onDownloadSingle(selectedSlideIndex)}
            disabled={isDownloading}
            className="text-xs font-semibold text-brand-orange hover:text-white flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3" />
            Baixar esta lâmina (.PNG)
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {project.slides.map((s, idx) => {
            const isCurrent = idx === selectedSlideIndex;
            return (
              <button
                key={s.id || idx}
                onClick={() => onSelectSlide(idx)}
                className={`relative shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all p-1 flex flex-col justify-between text-left ${
                  isCurrent
                    ? 'border-brand-orange shadow-glowSm scale-105 bg-brand-orange/10'
                    : 'border-brand-border bg-brand-bg opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-brand-muted">
                    #{idx + 1}
                  </span>
                  {s.type === 'hook' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  )}
                  {s.type === 'cta' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <p className="text-[8px] font-semibold line-clamp-3 leading-tight text-white">
                  {s.headline}
                </p>
                <span className="text-[7px] uppercase font-bold text-brand-muted">
                  {s.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
