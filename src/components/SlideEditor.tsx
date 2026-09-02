import React from 'react';
import { SlideData } from '../lib/types';
import { sanitizeText } from '../lib/sanitizer';
import { Edit3, Type, Tag, AlignLeft, CheckSquare, Send, Sparkles } from 'lucide-react';

interface SlideEditorProps {
  slide: SlideData;
  onUpdateSlide: (updated: SlideData) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onUpdateSlide }) => {
  const handleChange = (field: keyof SlideData, value: any) => {
    const cleanValue = typeof value === 'string' ? sanitizeText(value) : value;
    onUpdateSlide({
      ...slide,
      [field]: cleanValue,
    });
  };

  const handlePointChange = (index: number, val: string) => {
    const currentPoints = [...(slide.points || [])];
    currentPoints[index] = sanitizeText(val);
    handleChange('points', currentPoints);
  };

  const handleAddPoint = () => {
    const currentPoints = [...(slide.points || [])];
    currentPoints.push('Novo tópico estratégico');
    handleChange('points', currentPoints);
  };

  const handleRemovePoint = (index: number) => {
    const currentPoints = (slide.points || []).filter((_, i) => i !== index);
    handleChange('points', currentPoints);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-brand-orange" />
          <h3 className="font-bold text-sm text-white">
            Editar Lâmina #{slide.slideNumber} ({slide.type.toUpperCase()})
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-brand-bg text-brand-muted border border-brand-border">
          Edição em Tempo Real
        </span>
      </div>

      {/* Badge / Etiqueta */}
      <div>
        <label className="block text-xs font-semibold text-brand-muted mb-1 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-brand-orange" />
          Badge / Etiqueta Superior
        </label>
        <input
          type="text"
          value={slide.badge || ''}
          onChange={(e) => handleChange('badge', e.target.value)}
          placeholder="Ex: O GRANDE ERRO ⚠️"
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors"
        />
      </div>

      {/* Título Principal (Headline) */}
      <div>
        <label className="block text-xs font-semibold text-brand-muted mb-1 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-brand-orange" />
          Título Principal (Headline)
        </label>
        <textarea
          rows={2}
          value={slide.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="Título instigante e direto..."
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors resize-none font-medium"
        />
      </div>

      {/* Subtítulo */}
      <div>
        <label className="block text-xs font-semibold text-brand-muted mb-1 flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-brand-orange" />
          Subtítulo / Contexto
        </label>
        <input
          type="text"
          value={slide.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Explicação complementar..."
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors"
        />
      </div>

      {/* Corpo de texto em parágrafos */}
      {slide.bodyText && slide.bodyText.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">
            Texto Explicativo (Card de Destaque)
          </label>
          <textarea
            rows={3}
            value={slide.bodyText.join('\n')}
            onChange={(e) => handleChange('bodyText', e.target.value.split('\n'))}
            placeholder="Linhas de texto explicativo..."
            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors font-sans"
          />
        </div>
      )}

      {/* Lista de Tópicos (Points) */}
      {slide.points && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-muted flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-brand-orange" />
              Tópicos / Benefícios
            </label>
            <button
              onClick={handleAddPoint}
              className="text-[11px] text-brand-orange hover:text-white transition-colors"
            >
              + Adicionar item
            </button>
          </div>
          {slide.points.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={pt}
                onChange={(e) => handlePointChange(idx, e.target.value)}
                className="flex-1 bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
              />
              <button
                onClick={() => handleRemovePoint(idx)}
                className="text-zinc-500 hover:text-red-400 text-xs px-2"
                title="Remover tópico"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chamada para Ação no Slide Final */}
      {slide.ctaButtonText && (
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-brand-orange" />
            Texto do Botão de Chamada para Ação
          </label>
          <input
            type="text"
            value={slide.ctaButtonText}
            onChange={(e) => handleChange('ctaButtonText', e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors font-bold"
          />
        </div>
      )}
    </div>
  );
};
