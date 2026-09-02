import React, { useState } from 'react';
import { Copy, Check, FileText, Hash, Send } from 'lucide-react';
import { sanitizeText } from '../lib/sanitizer';

interface CaptionBoxProps {
  caption: string;
  hashtags: string[];
  onUpdateCaption?: (newCaption: string) => void;
}

export const CaptionBox: React.FC<CaptionBoxProps> = ({ caption, hashtags, onUpdateCaption }) => {
  const [copied, setCopied] = useState(false);

  const cleanCaption = sanitizeText(caption);
  const fullText = `${cleanCaption}\n\n${hashtags.join(' ')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Falha ao copiar', e);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-orange" />
          <h3 className="font-bold text-sm text-white">
            Legenda Otimizada para o Instagram
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-orange text-white hover:bg-brand-orangeDark shadow-glowSm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copiado com Sucesso!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Legenda
            </>
          )}
        </button>
      </div>

      {/* Caixa de Texto da Legenda */}
      <textarea
        rows={7}
        value={cleanCaption}
        onChange={(e) => onUpdateCaption && onUpdateCaption(sanitizeText(e.target.value))}
        placeholder="Texto da legenda..."
        className="w-full bg-brand-bg border border-brand-border rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-brand-orange transition-colors resize-none font-sans"
      />

      {/* Hashtags Estratégicas */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted mb-2">
          <Hash className="w-3.5 h-3.5 text-brand-orange" />
          Hashtags Segmentadas para Food Service e Tráfego:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-brand-bg text-brand-orange border border-brand-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
