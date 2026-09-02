import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Innovary Mídia | Gerador de Carrosséis Multi-Agente para Delivery',
  description:
    'Sistema inteligente de múltiplos agentes para geração de carrosséis de alta conversão para donos de delivery, restaurantes e food service. Innovary Mídia.',
  keywords: [
    'tráfego pago delivery',
    'marketing food service',
    'carrossel instagram',
    'innovary mídia',
    'gestão de tráfego restaurante',
  ],
  authors: [{ name: 'Innovary Mídia', url: 'https://www.innovarymidia.com.br' }],
  icons: {
    icon: '/innovary-logo-circle.png',
    apple: '/innovary-logo-circle.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-brand-bg text-white antialiased selection:bg-brand-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}
