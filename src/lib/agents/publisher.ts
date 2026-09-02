import JSZip from 'jszip';
import { toBlob } from 'html-to-image';
import { CarouselProject } from '../types';

export class PublisherAgent {
  name = 'Felipe Noronha';
  title = 'Gerenciador de Exportação & Automação Meta';
  avatar = '📦';

  /**
   * Empacota todos os slides do carrossel em um arquivo .ZIP em alta resolução
   */
  async exportToZip(
    project: CarouselProject,
    slideElements: HTMLElement[],
    onProgress?: (percent: number, current: number, total: number) => void
  ): Promise<Blob> {
    const zip = new JSZip();
    const folder = zip.folder(`innovary-carrossel-${project.id.slice(0, 8)}`);

    const total = slideElements.length;

    for (let i = 0; i < total; i++) {
      const element = slideElements[i];
      if (element) {
        // Renderiza com escala 2x ou pixelRatio nativo para garantir 1080x1350 nítido
        const blob = await toBlob(element, {
          quality: 0.98,
          pixelRatio: 2,
          cacheBust: true,
        });

        if (blob && folder) {
          const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`;
          folder.file(fileName, blob);
        }
      }

      if (onProgress) {
        onProgress(Math.round(((i + 1) / total) * 100), i + 1, total);
      }
    }

    // Adiciona arquivo de texto com a legenda e hashtags
    if (folder) {
      const readmeContent = `CARROSSEL INNOVARY MÍDIA (@innovarymidia)
Tema: ${project.topic}
Total de Lâminas: ${project.slideCount}
Estilo Visual: ${project.themeStyle}

==================================================
LEGENDA PARA O POST DO INSTAGRAM:
==================================================

${project.caption}

${project.hashtags.join(' ')}

==================================================
INSTRUÇÕES DE POSTAGEM:
1. Abra o Instagram no celular ou no Meta Business Suite.
2. Selecione as imagens em ordem numérica (slide-01.png até slide-${String(total).padStart(2, '0')}.png).
3. Cole a legenda acima e adicione a localização da sua agência ou do cliente alvo.
4. Publique no melhor horário (11h30 às 13h ou 18h às 20h).
`;
      folder.file('legenda-e-instrucoes.txt', readmeContent);
    }

    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Baixa um único slide como PNG de alta resolução
   */
  async exportSingleSlide(element: HTMLElement, slideIndex: number): Promise<Blob | null> {
    return await toBlob(element, {
      quality: 0.98,
      pixelRatio: 2,
      cacheBust: true,
    });
  }

  /**
   * Estrutura da Instagram Graph API para publicação automática futura
   */
  async publishToInstagram(
    imageUrls: string[],
    caption: string,
    credentials: { instagramAccountId: string; accessToken: string }
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!credentials.accessToken || !credentials.instagramAccountId) {
      return {
        success: false,
        error: 'Credenciais da Instagram Graph API não fornecidas. Utilize o modo de download manual por enquanto.',
      };
    }

    try {
      // 1. Criar container de cada item do carrossel
      const itemContainerIds: string[] = [];
      for (const imageUrl of imageUrls) {
        const itemRes = await fetch(
          `https://graph.facebook.com/v19.0/${credentials.instagramAccountId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: imageUrl,
              is_carousel_item: true,
              access_token: credentials.accessToken,
            }),
          }
        );
        const itemData = await itemRes.json();
        if (itemData.id) {
          itemContainerIds.push(itemData.id);
        } else {
          throw new Error(itemData.error?.message || 'Falha ao criar item do carrossel');
        }
      }

      // 2. Criar o container principal do carrossel
      const carouselRes = await fetch(
        `https://graph.facebook.com/v19.0/${credentials.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'CAROUSEL',
            children: itemContainerIds,
            caption: caption,
            access_token: credentials.accessToken,
          }),
        }
      );
      const carouselData = await carouselRes.json();
      if (!carouselData.id) {
        throw new Error(carouselData.error?.message || 'Falha ao criar carrossel principal');
      }

      // 3. Publicar o container
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${credentials.instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: carouselData.id,
            access_token: credentials.accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();

      return {
        success: true,
        postId: publishData.id,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Erro na comunicação com a Graph API da Meta',
      };
    }
  }
}
