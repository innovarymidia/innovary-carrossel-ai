import React from 'react';
import { Flame, Download, Settings, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
  hasProject: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onDownloadZip,
  isDownloadingZip,
  hasProject,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO E IDENTIFICAÇÃO DA MARCA */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-glowSm"
            style={{ background: 'linear-gradient(135deg, #FF3D00 0%, #EA580C 100%)' }}
          >
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg text-white tracking-tight leading-none">
                Innovary Mídia
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                Food Service AI
              </span>
            </div>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5 flex items-center gap-1.5">
              <span>@innovarymidia</span>
              <span>•</span>
              <a
                href="https://www.innovarymidia.com.br"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-orange transition-colors flex items-center gap-0.5"
              >
                innovarymidia.com.br
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        {/* AÇÕES NO TOPO */}
        <div className="flex items-center gap-3">
          {/* Botão de Download Completo em ZIP */}
          <button
            onClick={onDownloadZip}
            disabled={!hasProject || isDownloadingZip}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glowSm flex items-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF3D00 0%, #EA580C 100%)' }}
          >
            <Download className="w-4 h-4" />
            <span>
              {isDownloadingZip ? 'Gerando 1080x1350...' : 'Baixar Carrossel (.ZIP)'}
            </span>
          </button>

          {/* Botão de Configurações */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardHover text-brand-muted hover:text-white border border-brand-border transition-colors"
            title="Configurações e Integrações (Supabase / Gemini / Meta)"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
