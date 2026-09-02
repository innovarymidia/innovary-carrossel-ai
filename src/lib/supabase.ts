import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CarouselProject, SlideData } from './types';

const STORAGE_KEY = 'innovary_carousels_history';

/**
 * Validador e gerador de UUID v4 padrão RFC 4122 compatível com o PostgreSQL
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ensureUUID(id?: string): string {
  if (id && UUID_REGEX.test(id)) {
    return id;
  }
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback seguro de geração de UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtém as credenciais ativas do Supabase tanto de variáveis de ambiente
 * quanto do localStorage configurado no navegador.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('innovary_supabase_url');
    const localKey = localStorage.getItem('innovary_supabase_key');
    if (localUrl && localUrl.trim()) url = localUrl.trim();
    if (localKey && localKey.trim()) anonKey = localKey.trim();
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

/**
 * Retorna uma instância ativa do SupabaseClient
 */
export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedUrl = url;
    cachedKey = anonKey;
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Erro ao inicializar Supabase Client:', err);
    return null;
  }
}

/**
 * Testa a conexão com o Supabase e a presença das tabelas criadas pelo schema
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tables: { carousels: boolean; slides: boolean; system_settings: boolean };
  error?: string;
}> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Credenciais do Supabase não configuradas.',
      tables: { carousels: false, slides: false, system_settings: false },
      error: 'URL ou Chave Anônima ausentes.',
    };
  }

  const tablesStatus = {
    carousels: false,
    slides: false,
    system_settings: false,
  };

  try {
    // 1. Testa tabela system_settings
    const { error: setErr } = await client.from('system_settings').select('key').limit(1);
    if (!setErr) tablesStatus.system_settings = true;

    // 2. Testa tabela carousels
    const { error: carErr } = await client.from('carousels').select('id').limit(1);
    if (!carErr) tablesStatus.carousels = true;

    // 3. Testa tabela slides
    const { error: sliErr } = await client.from('slides').select('id').limit(1);
    if (!sliErr) tablesStatus.slides = true;

    const allOk = tablesStatus.carousels && tablesStatus.slides && tablesStatus.system_settings;

    if (allOk) {
      return {
        success: true,
        message: 'Conectado com sucesso! Todas as 3 tabelas (carousels, slides, system_settings) foram detectadas.',
        tables: tablesStatus,
      };
    } else {
      const missing = Object.entries(tablesStatus)
        .filter(([_, ok]) => !ok)
        .map(([name]) => name)
        .join(', ');
      return {
        success: false,
        message: `Conectou à API, mas as seguintes tabelas não foram encontradas: ${missing}. Execute o supabase_schema.sql no SQL Editor.`,
        tables: tablesStatus,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Falha ao conectar com o Supabase.',
      tables: tablesStatus,
      error: err.message || String(err),
    };
  }
}

/**
 * Salva ou atualiza um projeto de carrossel no Supabase com sincronização automática
 */
export async function saveCarousel(
  project: CarouselProject
): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> {
  // Garante que o projeto tenha um ID no formato UUID
  const validProjectId = ensureUUID(project.id);
  project.id = validProjectId;

  // Garante que cada slide tenha um ID no formato UUID
  project.slides = project.slides.map((s) => ({
    ...s,
    id: ensureUUID(s.id),
  }));

  const client = getSupabase();

  if (client) {
    try {
      // 1. Salva metadados do carrossel
      const { error: carError } = await client.from('carousels').upsert(
        {
          id: validProjectId,
          topic: project.topic,
          target_audience: project.targetAudience || 'Donos de Delivery e Food Service',
          niche: project.niche || 'Food Service / Tráfego Hiperlocal',
          slide_count: project.slideCount || project.slides.length,
          theme_style: project.themeStyle,
          caption: project.caption || '',
          hashtags: project.hashtags || [],
          status: project.status || 'draft',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (carError) {
        console.warn('Aviso ao salvar carrossel no Supabase:', carError);
        throw carError;
      }

      // 2. Salva os slides individuais vinculados ao carrossel
      const slidesToInsert = project.slides.map((s) => ({
        id: s.id,
        carousel_id: validProjectId,
        slide_number: s.slideNumber,
        slide_type: s.type,
        headline: s.headline,
        subtitle: s.subtitle || '',
        body_text: s.bodyText ? s.bodyText.join('\n') : (s.points ? s.points.join('\n') : ''),
        badge: s.badge || '',
        highlight_word: s.highlightWord || '',
        cta_text: s.ctaButtonText || '',
      }));

      const { error: slidesError } = await client
        .from('slides')
        .upsert(slidesToInsert, { onConflict: 'id' });

      if (slidesError) {
        console.warn('Aviso ao salvar slides no Supabase:', slidesError);
        throw slidesError;
      }

      // Salva também localmente como cache offline de resposta rápida
      saveToLocalStorage(project);
      return { success: true, source: 'supabase' };
    } catch (err: any) {
      console.error('Falha no Supabase, mantendo cópia no LocalStorage:', err);
      saveToLocalStorage(project);
      return { success: true, source: 'local', error: err.message };
    }
  }

  // Fallback padrão para LocalStorage se o Supabase não estiver configurado
  saveToLocalStorage(project);
  return { success: true, source: 'local' };
}

/**
 * Carrega a lista completa de projetos salvos (Supabase com fallback LocalStorage)
 */
export async function getCarousels(): Promise<CarouselProject[]> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from('carousels')
        .select(`
          id,
          created_at,
          updated_at,
          topic,
          target_audience,
          niche,
          slide_count,
          theme_style,
          caption,
          hashtags,
          status,
          slides (
            id,
            slide_number,
            slide_type,
            headline,
            subtitle,
            body_text,
            badge,
            highlight_word,
            cta_text
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: CarouselProject[] = data.map((item: any) => {
          const rawSlides: any[] = item.slides || [];
          const sortedSlides: SlideData[] = rawSlides
            .sort((a, b) => a.slide_number - b.slide_number)
            .map((s) => ({
              id: s.id,
              slideNumber: s.slide_number,
              totalSlides: item.slide_count,
              type: s.slide_type,
              badge: s.badge || undefined,
              headline: s.headline,
              highlightWord: s.highlight_word || undefined,
              subtitle: s.subtitle || undefined,
              bodyText: s.body_text ? s.body_text.split('\n') : undefined,
              ctaButtonText: s.cta_text || undefined,
            }));

          return {
            id: item.id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            topic: item.topic,
            targetAudience: item.target_audience,
            niche: item.niche,
            slideCount: item.slide_count,
            themeStyle: item.theme_style,
            caption: item.caption,
            hashtags: item.hashtags || [],
            status: item.status || 'draft',
            authorHandle: '@innovarymidia',
            slides: sortedSlides,
          };
        });

        // Sincroniza o cache local
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped.slice(0, 30)));
          } catch (e) {}
        }

        return mapped;
      }
    } catch (e) {
      console.warn('Erro ao carregar do Supabase, buscando LocalStorage:', e);
    }
  }

  return loadFromLocalStorage();
}

/**
 * Remove um carrossel do Supabase e do LocalStorage
 */
export async function deleteCarousel(id: string): Promise<boolean> {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('carousels').delete().eq('id', id);
    } catch (e) {
      console.warn('Erro ao deletar no Supabase:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = loadFromLocalStorage();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  return true;
}

/**
 * Obtém configuração da tabela system_settings
 */
export async function getSystemSetting(key: string): Promise<any | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (!error && data) return data.value;
  } catch (e) {}
  return null;
}

/**
 * Salva configuração na tabela system_settings
 */
export async function setSystemSetting(key: string, value: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('system_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (e) {
    return false;
  }
}

function saveToLocalStorage(project: CarouselProject) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadFromLocalStorage();
    const index = existing.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      existing[index] = project;
    } else {
      existing.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 30)));
  } catch (e) {
    console.error('Erro ao salvar no LocalStorage', e);
  }
}

function loadFromLocalStorage(): CarouselProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
