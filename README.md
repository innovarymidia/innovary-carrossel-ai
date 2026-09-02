# 🚀 Innovary Mídia - Gerador de Carrosséis Multi-Agente para Food Service

Sistema inteligente de múltiplos agentes de IA desenvolvido para a agência **Innovary Mídia** (@innovarymidia), focado em gerar carrosséis educativos e de alta conversão (5 a 7 folhas no formato vertical 4:5 / 1080x1350) para atrair donos de **delivery e restaurantes** (hamburguerias, pizzarias, sushis, marmitarias).

---

## 👥 A Equipe Multi-Agente

1. **Lucas Prado (Estrategista B2B)**: Mapeia as dores viscerais do dono do restaurante (taxas de 27% a 30% do iFood, motoboy parado na terça-feira, dinheiro jogado fora no botão "Impulsionar").
2. **Helena Brandão (Copywriter)**: Escreve o roteiro completo lâmina a lâmina seguindo a estrutura de retenção (Hook magnético, Diagnóstico, A virada de jogo com Tráfego Hiperlocal, Checklist e CTA matador) + legenda persuasiva completa com hashtags.
3. **Mateus Castro (Diretor de Arte)**: Aplica um dos **6 estilos visuais da marca** com a paleta oficial da Innovary Mídia (`#0a0a0a`, `#ff4500`, `#ea580c` e fonte Space Grotesk).
4. **Camila Siqueira (Revisora QA)**: Valida contraste, limites de caracteres e safe zones para garantir leitura perfeita no feed do Instagram.
5. **Felipe Noronha (Exportador & Automação)**: Renderiza e empacota todas as lâminas em alta definição (1080x1350) em arquivo `.ZIP` pronto para postar, com suporte à Instagram Graph API para quando quiser ativar o piloto automático.

---

## 🎨 Os 6 Estilos de Design da Marca

1. **Dark Fire (Assinatura Innovary)**: Fundo preto espacial, títulos em gradiente laranja fogo, brilho sutil (glow) e cards translúcidos.
2. **Clean Authority**: Fundo claro editorial de alto contraste, tipografia forte, badges laranjas e moldura minimalista.
3. **Alerta de Prejuízo**: Visual de alto choque com avisos de perigo e ênfase na perda de dinheiro com taxas abusivas.
4. **Data & Growth**: Estilo dashboard/métricas focado em ROI, faturamento no canal próprio e custo por pedido.
5. **Thread & Perfil**: Estilo bate-papo de autoridade com avatar da agência e tom de consultoria direta.
6. **Sunset Food Gradient**: Gradiente quente e gastronômico que evoca apetite e energia para food service.

---

## 🛠️ Como Rodar Localmente

```bash
# 1. Entre na pasta do projeto
cd innovary-carrossel-ai

# 2. Instale as dependências (se já não estiverem instaladas)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse no seu navegador: **`http://localhost:3000`**

---

## 🌐 Como Fazer Deploy Gratuito na Vercel

1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório do GitHub.
4. Adicione as variáveis de ambiente (se desejar, ou configure direto no modal do app):
   - `NEXT_PUBLIC_GEMINI_API_KEY` (Sua chave do Google AI Studio - Grátis)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy**. O site estará no ar em menos de 2 minutos!

---

## 🗄️ Como Conectar ao Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No menu lateral, acesse o **SQL Editor**.
3. Copie todo o conteúdo do arquivo `supabase_schema.sql` e clique em **Run**.
4. Em **Project Settings > API**, copie a **Project URL** e a **anon public key** e cole no modal de configurações do aplicativo.
