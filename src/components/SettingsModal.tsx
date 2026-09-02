import React, { useState, useEffect } from 'react';
import { X, Key, Database, Instagram, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [metaToken, setMetaToken] = useState('');
  const [pageId, setPageId] = useState('');
  const [activeTab, setActiveTab] = useState<'apis' | 'sql' | 'instagram'>('apis');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGeminiKey(localStorage.getItem('innovary_gemini_key') || '');
      setSupabaseUrl(localStorage.getItem('innovary_supabase_url') || '');
      setSupabaseKey(localStorage.getItem('innovary_supabase_key') || '');
      setMetaToken(localStorage.getItem('innovary_meta_token') || '');
      setPageId(localStorage.getItem('innovary_page_id') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('innovary_gemini_key', geminiKey.trim());
      localStorage.setItem('innovary_supabase_url', supabaseUrl.trim());
      localStorage.setItem('innovary_supabase_key', supabaseKey.trim());
      localStorage.setItem('innovary_meta_token', metaToken.trim());
      localStorage.setItem('innovary_page_id', pageId.trim());
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSaved();
      onClose();
    }, 1200);
  };

  const sqlSchemaSnippet = `-- Execute este SQL no Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.carousels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    topic TEXT NOT NULL,
    slide_count INT DEFAULT 6,
    theme_style TEXT DEFAULT 'dark_fire',
    caption TEXT,
    hashtags TEXT[]
);

CREATE TABLE IF NOT EXISTS public.slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carousel_id UUID REFERENCES public.carousels(id) ON DELETE CASCADE,
    slide_number INT NOT NULL,
    slide_type TEXT NOT NULL,
    headline TEXT NOT NULL,
    subtitle TEXT,
    body_text TEXT,
    badge TEXT
);`;

  const copySql = async () => {
    await navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-sm">
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Configurações e Integrações</h3>
              <p className="text-xs text-brand-muted">Vercel, Supabase, Gemini e Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-brand-bg flex items-center justify-center text-brand-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-brand-border px-5 gap-4">
          <button
            onClick={() => setActiveTab('apis')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'apis'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-brand-muted hover:text-white'
            }`}
          >
            Chaves de API
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-brand-muted hover:text-white'
            }`}
          >
            Script SQL Supabase
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'instagram'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-brand-muted hover:text-white'
            }`}
          >
            Postagem Automática Meta
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === 'apis' && (
            <div className="space-y-4">
              {/* Google Gemini API */}
              <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-brand-orange" />
                    Google Gemini API Key (Opcional - Gratuito)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand-orange hover:underline flex items-center gap-1"
                  >
                    Obter Chave Grátis
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                />
                <p className="text-[11px] text-brand-muted mt-1.5">
                  Se deixado em branco, o sistema utilizará o motor estratégico integrado com 8 temas validados.
                </p>
              </div>

              {/* Supabase URL e Anon Key */}
              <div className="p-4 rounded-xl bg-brand-bg border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Configuração Supabase (Opcional)
                  </label>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Painel Supabase
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-brand-muted block mb-1">Project URL:</span>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-brand-muted block mb-1">Anon Public Key:</span>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Tabelas para criar no Supabase SQL Editor:
                </span>
                <button
                  onClick={copySql}
                  className="px-2.5 py-1 rounded-lg bg-brand-orange/20 text-brand-orange border border-brand-orange/40 text-xs font-semibold flex items-center gap-1 hover:bg-brand-orange hover:text-white transition-all"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedSql ? 'Copiado!' : 'Copiar SQL'}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-black border border-brand-border text-[11px] font-mono text-zinc-300 overflow-x-auto">
                {sqlSchemaSnippet}
              </pre>
              <p className="text-xs text-brand-muted">
                O arquivo completo com políticas e segurança também está salvo no arquivo <code className="text-brand-orange">supabase_schema.sql</code> na raiz do projeto.
              </p>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-brand-bg border border-brand-border">
                <div className="flex items-center gap-2 mb-2 text-brand-orange font-bold text-xs">
                  <Instagram className="w-4 h-4" />
                  Postagem Automática no Instagram (Fase 2)
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Conforme combinado, a postagem inicial é <strong>100% manual e segura</strong> (você baixa as imagens em alta resolução em 1 clique e publica).
                </p>
                <div className="space-y-2.5 text-xs text-brand-muted">
                  <div className="p-2.5 rounded-lg bg-brand-card border border-brand-border">
                    <strong>Passo para quando quiser ligar o automático:</strong>
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li>Ter uma conta Profissional no Instagram vinculada a uma Página do Facebook.</li>
                      <li>Criar um app gratuito no Meta for Developers com permissão <code className="text-zinc-200">instagram_content_publish</code>.</li>
                      <li>Inserir o Token e o ID da Página abaixo para postar direto da tela sem precisar baixar.</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <span className="text-[11px] text-brand-muted block">Instagram Business Account ID:</span>
                  <input
                    type="text"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    placeholder="Ex: 17841400000000000"
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                  />
                  <span className="text-[11px] text-brand-muted block">Meta Long-Lived Access Token:</span>
                  <input
                    type="password"
                    value={metaToken}
                    onChange={(e) => setMetaToken(e.target.value)}
                    placeholder="EAAB..."
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-5 border-t border-brand-border flex items-center justify-between bg-brand-bg/50">
          <span className="text-xs text-brand-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Dados salvos com segurança no seu navegador.
          </span>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-glowSm flex items-center gap-1.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #FF3D00 0%, #EA580C 100%)' }}
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            {isSaved ? 'Configurações Salvas!' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};
