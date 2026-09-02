/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0a0a0a',
          card: '#141414',
          cardHover: '#1c1c1c',
          border: '#262626',
          orange: '#FF3D00',
          orangeDark: '#EA580C',
          orangeGlow: 'rgba(255, 61, 0, 0.25)',
          text: '#FFFFFF',
          muted: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(255, 61, 0, 0.35)',
        glowSm: '0 0 15px -3px rgba(255, 61, 0, 0.4)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF3D00 0%, #EA580C 100%)',
        'dark-radial': 'radial-gradient(circle at top center, rgba(255, 61, 0, 0.12) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
