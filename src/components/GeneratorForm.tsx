import React, { useState } from 'react';
import { GenerationInput, ThemeStyle } from '../lib/types';
import { TOPIC_PRESETS, THEME_CONFIGS } from '../lib/presets';
import { Sparkles, Dices, Flame, Layers, Sliders } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (input: GenerationInput) => void;
  isGenerating: boolean;
  selectedTheme: ThemeStyle;
  onThemeSelect: (theme: ThemeStyle) => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  isGenerating,
  selectedTheme,
  onThemeSelect,
}) => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState<number>(6);
  const [showPresets, setShowPresets] = useState(false);

  const handleRandomPreset = () => {
    const random = TOPIC_PRESETS[Math.floor(Math.random() * TOPIC_PRESETS.length)];
    setTopic(random.title);
    onThemeSelect(random.recommendedTheme);
  };

  const handleSelectPreset = (preset: typeof TOPIC_PRESETS[0]) => {
    setTopic(preset.title);
    onThemeSelect(preset.recommendedTheme);
    setShowPresets(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      topic: topic.trim() || 'Como parar de perder margem de lucro no delivery para taxas de app',
      slideCount,
      themeStyle: selectedTheme,
    });
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xl relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TÍTULO E BOTÃO DE PAUTA ALEATÓRIA */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-brand-orange" />
            Tema ou Dor do Dono do Delivery:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomPreset}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-bg text-brand-orange hover:text-white hover:bg-brand-orange/20 border border-brand-orange/30 flex items-center gap-1.5 transition-all"
            >
              <Dices className="w-3.5 h-3.5" />
              Sortear Pauta Vendedora
            </button>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-bg text-brand-muted hover:text-white border border-brand-border transition-colors"
            >
              {showPresets ? 'Fechar Pautas' : 'Ver Pautas Prontas (8)'}
            </button>
          </div>
        </div>

        {/* LISTA DE PRESETS EXPANSÍVEL */}
        {showPresets && (
          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border space-y-2 max-h-56 overflow-y-auto">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block mb-1">
              Selecione uma pauta validada para atrair donos de restaurantes:
            </span>
            {TOPIC_PRESETS.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="p-2.5 rounded-lg border border-brand-border hover:border-brand-orange/50 hover:bg-brand-card cursor-pointer transition-all flex items-start justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-brand-muted mt-0.5">
                    Foco: {p.targetCategory} | Categoria: {p.category}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange font-semibold whitespace-nowrap">
                  Usar
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CAMPO DE TEXTO DO TEMA */}
        <div>
          <textarea
            rows={2}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: O iFood fica com 27% do seu faturamento bruto? Como vender no canal próprio com tráfego pago..."
            className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange transition-colors resize-none"
          />
        </div>

        {/* SELETORES: QUANTIDADE DE SLIDES E DESIGN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Quantidade de Folhas: 5, 6 ou 7 */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-orange" />
              Quantidade de Folhas (Slides):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSlideCount(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    slideCount === num
                      ? 'bg-brand-orange text-white border-brand-orange shadow-glowSm scale-105'
                      : 'bg-brand-bg text-brand-muted border-brand-border hover:text-white hover:bg-brand-cardHover'
                  }`}
                >
                  {num} Lâminas
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Estilo Visual */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-orange" />
              Estilo Visual da Marca:
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => onThemeSelect(e.target.value as ThemeStyle)}
              className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-orange transition-colors cursor-pointer"
            >
              {(Object.keys(THEME_CONFIGS) as ThemeStyle[]).map((key) => {
                const conf = THEME_CONFIGS[key];
                return (
                  <option key={key} value={key} className="bg-zinc-900 text-white">
                    {conf.name} ({conf.tag})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE GERAÇÃO */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white shadow-glow hover:shadow-orange-600/50 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, #FF3D00 0%, #EA580C 100%)' }}
        >
          <Sparkles className="w-4 h-4 animate-spin text-white" />
          <span>{isGenerating ? 'Equipe de Agentes Trabalhando...' : 'Disparar Agentes e Gerar Carrossel'}</span>
        </button>
      </form>
    </div>
  );
};
