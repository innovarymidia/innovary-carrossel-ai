export type ThemeStyle = 
  | 'dark_fire'        // 1. Assinatura: Fundo preto espacial, laranja fogo glow, cards escuros
  | 'clean_authority'  // 2. Clean: Fundo branco/off-white, tipografia preta, badges laranjas
  | 'alert_loss'       // 3. Alerta de Prejuízo: Estilo de alto impacto emocional, avisos de perigo
  | 'data_growth'      // 4. Métricas & Growth: Estilo analítico/dashboard, números e ROI
  | 'thread_social'    // 5. Thread / Perfil: Bate-papo de autoridade com avatar da agência
  | 'sunset_gradient'; // 6. Sunset Food Gradient: Gradiente escuro para laranja gastronômico

export type SlideType = 'hook' | 'problem' | 'solution' | 'proof' | 'cta' | 'content';

export interface SlideData {
  id: string;
  slideNumber: number;
  totalSlides: number;
  type: SlideType;
  badge?: string;
  headline: string;
  highlightWord?: string;
  subtitle?: string;
  bodyText?: string[];
  points?: string[];
  metricNumber?: string;
  metricLabel?: string;
  ctaButtonText?: string;
  quoteAuthor?: string;
  customNote?: string;
}

export interface CarouselProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
  targetAudience: string;
  niche: string;
  slideCount: number;
  themeStyle: ThemeStyle;
  caption: string;
  hashtags: string[];
  slides: SlideData[];
  status: 'draft' | 'reviewed' | 'downloaded' | 'published';
  authorHandle: string;
}

export type AgentRole = 
  | 'strategist'  // Estrategista de Vendas Delivery
  | 'copywriter'  // Roteirista de Carrosséis
  | 'designer'    // Diretor de Arte
  | 'qa'          // Revisor de Qualidade
  | 'publisher';  // Exportador / Publicador

export interface AgentStatus {
  role: AgentRole;
  name: string;
  title: string;
  avatar: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  message: string;
  details?: string;
}

export interface GenerationInput {
  topic?: string;
  targetCategory?: string; // Hamburgueria, Pizzaria, Sushi, Marmitaria, Restaurante Geral
  slideCount: number; // 5, 6 ou 7
  themeStyle: ThemeStyle;
  tone?: 'impactante' | 'estrategico' | 'urgencia' | 'educativo';
  apiKey?: string;
}
