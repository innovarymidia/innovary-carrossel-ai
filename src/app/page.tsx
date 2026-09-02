'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  CarouselProject, 
  GenerationInput, 
  ThemeStyle, 
  SlideData, 
  AgentStatus 
} from '../lib/types';
import { MultiAgentOrchestrator } from '../lib/agents/orchestrator';
import { PublisherAgent } from '../lib/agents/publisher';
import { saveCarousel, getCarousels } from '../lib/supabase';
import { Header } from '../components/Header';
import { GeneratorForm } from '../components/GeneratorForm';
import { AgentTimeline } from '../components/AgentTimeline';
import { AutoAuditPanel } from '../components/AutoAuditPanel';
import { CarouselViewer } from '../components/CarouselViewer';
import { SlideEditor } from '../components/SlideEditor';
import { CaptionBox } from '../components/CaptionBox';
import { SettingsModal } from '../components/SettingsModal';
import { SlideCanvas } from '../components/SlideCanvas';
import { 
  Sparkles, 
  Download, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const [orchestrator] = useState(() => new MultiAgentOrchestrator());
  const [publisher] = useState(() => new PublisherAgent());

  const [project, setProject] = useState<CarouselProject | null>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle>('dark_fire');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(() =>
    orchestrator.getInitialAgentStatuses()
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<CarouselProject[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Container oculto com as lâminas renderizadas em tamanho real para exportação perfeita
  const hiddenCanvasRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Inicialização com um carrossel exemplo matador
  useEffect(() => {
    const initDefault = async () => {
      const saved = await getCarousels();
      setHistory(saved);

      if (saved.length > 0) {
        setProject(saved[0]);
        setSelectedTheme(saved[0].themeStyle);
      } else {
        // Gera o carrossel padrão inicial
        const initial = await orchestrator.run({
          topic: 'O iFood está ficando com 27% a 30% do seu faturamento bruto?',
          slideCount: 6,
          themeStyle: 'dark_fire',
        });
        setProject(initial);
        await saveCarousel(initial);
      }
    };
    initDefault();
  }, []);

  // DISPARO DA GERAÇÃO COM MULTI-AGENTES
  const handleGenerate = async (input: GenerationInput) => {
    setIsGenerating(true);
    setSelectedSlideIndex(0);

    // Recupera chave do Gemini caso salva no LocalStorage
    let geminiKey = '';
    if (typeof window !== 'undefined') {
      geminiKey = localStorage.getItem('innovary_gemini_key') || '';
    }

    try {
      const newProject = await orchestrator.run(
        { ...input, apiKey: geminiKey },
        (updatedAgents) => {
          setAgentStatuses([...updatedAgents]);
        }
      );

      setProject(newProject);
      setSelectedTheme(newProject.themeStyle);
      await saveCarousel(newProject);
      showToast('🎉 Carrossel gerado pela equipe de agentes com sucesso!');

      // Atualiza histórico
      const saved = await getCarousels();
      setHistory(saved);
    } catch (err: any) {
      console.error(err);
      showToast('❌ Erro na geração. Verifique os logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ATUALIZAÇÃO DO TEMA VISUAL EM TEMPO REAL
  const handleThemeChange = async (newTheme: ThemeStyle) => {
    setSelectedTheme(newTheme);
    if (project) {
      const updated = { ...project, themeStyle: newTheme, updatedAt: new Date().toISOString() };
      setProject(updated);
      await saveCarousel(updated);
    }
  };

  // ATUALIZAÇÃO DE CONTEÚDO DE UM SLIDE
  const handleUpdateSlide = async (updatedSlide: SlideData) => {
    if (!project) return;
    const newSlides = [...project.slides];
    const index = newSlides.findIndex((s) => s.id === updatedSlide.id);
    if (index >= 0) {
      newSlides[index] = updatedSlide;
      const updatedProject = { ...project, slides: newSlides, updatedAt: new Date().toISOString() };
      setProject(updatedProject);
      await saveCarousel(updatedProject);
    }
  };

  // ATUALIZAÇÃO DA LEGENDA
  const handleUpdateCaption = async (newCaption: string) => {
    if (!project) return;
    const updated = { ...project, caption: newCaption, updatedAt: new Date().toISOString() };
    setProject(updated);
    await saveCarousel(updated);
  };

  // DOWNLOAD COMPLETO EM .ZIP
  const handleDownloadZip = async () => {
    if (!project) return;
    setIsDownloadingZip(true);
    setDownloadProgress(10);
    showToast('📦 Renderizando todas as lâminas em 1080x1350...');

    try {
      const slideElements: HTMLElement[] = [];
      for (let i = 1; i <= project.slides.length; i++) {
        const el = hiddenCanvasRefs.current[i];
        if (el) slideElements.push(el);
      }

      const zipBlob = await publisher.exportToZip(
        project,
        slideElements,
        (percent) => {
          setDownloadProgress(percent);
        }
      );

      // Trigger download no navegador
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `innovary-carrossel-${project.topic.slice(0, 25).replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('✅ Download do arquivo .ZIP concluído com sucesso!');
    } catch (e) {
      console.error(e);
      showToast('❌ Falha ao exportar o arquivo ZIP.');
    } finally {
      setIsDownloadingZip(false);
      setDownloadProgress(0);
    }
  };

  // DOWNLOAD DE UMA ÚNICA LÂMINA EM .PNG
  const handleDownloadSingle = async (slideIndex: number) => {
    if (!project) return;
    const slideNumber = slideIndex + 1;
    const element = hiddenCanvasRefs.current[slideNumber];
    if (!element) return;

    showToast(`📸 Renderizando lâmina #${slideNumber} em alta definição...`);
    try {
      const blob = await publisher.exportSingleSlide(element, slideNumber);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `innovary-slide-${String(slideNumber).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast(`✅ Lâmina #${slideNumber} baixada em PNG!`);
      }
    } catch (e) {
      console.error(e);
      showToast('❌ Falha ao baixar a lâmina.');
    }
  };

  const currentSlide = project?.slides[selectedSlideIndex];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-white relative selection:bg-brand-orange selection:text-white">
      {/* CABEÇALHO */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
        hasProject={Boolean(project)}
      />

      {/* FEEDBACK TOAST */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-brand-orange/40 text-white text-xs font-bold shadow-glow flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* CORPO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* BANNER INFORMATIVO E INTRODUTÓRIO */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-brand-card via-brand-card to-brand-bg border border-brand-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/30">
              Gerador Estratégico B2B
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-white mt-1">
              Atraia Donos de Delivery com Carrosséis de Alto Impacto
            </h1>
            <p className="text-xs text-brand-muted max-w-2xl mt-0.5">
              Crie carrosséis de 5 a 7 lâminas formatados na paleta da Innovary Mídia. Faça o dono do restaurante entender que precisa do seu tráfego para parar de queimar dinheiro no iFood.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-2 rounded-xl bg-brand-bg hover:bg-brand-card text-brand-muted hover:text-white border border-brand-border text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-brand-orange" />
              Histórico ({history.length})
            </button>
          </div>
        </div>

        {/* HISTÓRICO EXPANSÍVEL */}
        {showHistory && history.length > 0 && (
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-3 animate-in fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Carrosséis Salvos Recentemente:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setProject(h);
                    setSelectedTheme(h.themeStyle);
                    setSelectedSlideIndex(0);
                    setShowHistory(false);
                    showToast('Carrossel carregado do histórico!');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    project?.id === h.id
                      ? 'border-brand-orange bg-brand-orange/10'
                      : 'border-brand-border bg-brand-bg hover:border-brand-border/80'
                  }`}
                >
                  <div className="text-xs font-bold text-white line-clamp-2">
                    {h.topic}
                  </div>
                  <div className="text-[10px] text-brand-muted mt-1 flex items-center justify-between">
                    <span>{h.slideCount} lâminas • {h.themeStyle}</span>
                    <span>{new Date(h.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAINEL DE DISPARO E FORMULÁRIO */}
        <GeneratorForm
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedTheme={selectedTheme}
          onThemeSelect={handleThemeChange}
        />

        {/* STATUS DA EQUIPE MULTI-AGENTE */}
        <AgentTimeline agents={agentStatuses} isGenerating={isGenerating} />

        {/* PAINEL DE AUTO-ANÁLISE DE QUALIDADE PRÉ-APRESENTAÇÃO */}
        {project && project.qaReport && (
          <AutoAuditPanel qaReport={project.qaReport} />
        )}

        {/* ÁREA DE VISUALIZAÇÃO E EDIÇÃO DO PROJETO */}
        {project && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LADO ESQUERDO: VISUALIZADOR INTERATIVO (7 COLUNAS) */}
            <div className="lg:col-span-7">
              <CarouselViewer
                project={project}
                selectedSlideIndex={selectedSlideIndex}
                onSelectSlide={setSelectedSlideIndex}
                onThemeChange={handleThemeChange}
                onDownloadSingle={handleDownloadSingle}
                isDownloading={isDownloadingZip}
              />
            </div>

            {/* LADO DIREITO: EDITOR DO SLIDE ATIVO & LEGENDA (5 COLUNAS) */}
            <div className="lg:col-span-5 space-y-6">
              {currentSlide && (
                <SlideEditor
                  slide={currentSlide}
                  onUpdateSlide={handleUpdateSlide}
                />
              )}

              <CaptionBox
                caption={project.caption}
                hashtags={project.hashtags}
                onUpdateCaption={handleUpdateCaption}
              />
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* ELEMENTOS OCULTOS DE RENDERIZAÇÃO PARA EXPORTAÇÃO EXATA 1080x1350   */}
      {/* =================================================================== */}
      {project && (
        <div 
          aria-hidden="true" 
          className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0 overflow-hidden"
          style={{ width: '1080px' }}
        >
          {project.slides.map((s) => (
            <div
              key={s.id}
              ref={(el) => {
                hiddenCanvasRefs.current[s.slideNumber] = el;
              }}
              style={{ width: '1080px', height: '1350px' }}
            >
              <SlideCanvas
                slide={s}
                themeStyle={project.themeStyle}
                authorHandle={project.authorHandle}
                isExporting={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIGURAÇÕES */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => showToast('Configurações salvas!')}
      />
    </div>
  );
}
