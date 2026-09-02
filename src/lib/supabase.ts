import { createClient } from '@supabase/supabase-js';
import { CarouselProject } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'innovary_carousels_history';

/**
 * Salva um projeto de carrossel no Supabase ou no LocalStorage como fallback
 */
export async function saveCarousel(project: CarouselProject): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> {
  try {
    // Tenta salvar no Supabase se configurado
    if (supabase) {
      const { error: carError } = await supabase.from('carousels').upsert({
        id: project.id,
        topic: project.topic,
        target_audience: project.targetAudience,
        niche: project.niche,
        slide_count: project.slideCount,
        theme_style: project.themeStyle,
        caption: project.caption,
        hashtags: project.hashtags,
        status: project.status,
        updated_at: new Date().toISOString(),
      });

      if (!carError) {
        // Upsert slides
        const slidesToInsert = project.slides.map((s) => ({
          id: s.id,
          carousel_id: project.id,
          slide_number: s.slideNumber,
          slide_type: s.type,
          headline: s.headline,
          subtitle: s.subtitle || '',
          body_text: s.bodyText ? s.bodyText.join('\n') : '',
          badge: s.badge || '',
          highlight_word: s.highlightWord || '',
          cta_text: s.ctaButtonText || '',
        }));

        await supabase.from('slides').upsert(slidesToInsert);
        saveToLocalStorage(project);
        return { success: true, source: 'supabase' };
      }
    }

    // Fallback para LocalStorage
    saveToLocalStorage(project);
    return { success: true, source: 'local' };
  } catch (err: any) {
    saveToLocalStorage(project);
    return { success: true, source: 'local', error: err.message };
  }
}

/**
 * Carrega a lista de projetos salvos
 */
export async function getCarousels(): Promise<CarouselProject[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('carousels')
        .select('*, slides(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
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
          status: item.status,
          authorHandle: '@innovarymidia',
          slides: (item.slides || []).sort((a: any, b: any) => a.slide_number - b.slide_number).map((s: any) => ({
            id: s.id,
            slideNumber: s.slide_number,
            totalSlides: item.slide_count,
            type: s.slide_type,
            badge: s.badge,
            headline: s.headline,
            highlightWord: s.highlight_word,
            subtitle: s.subtitle,
            bodyText: s.body_text ? s.body_text.split('\n') : [],
            ctaButtonText: s.cta_text,
          })),
        }));
      }
    }
  } catch (e) {
    // Ignora erro e recorre ao local
  }

  return loadFromLocalStorage();
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
