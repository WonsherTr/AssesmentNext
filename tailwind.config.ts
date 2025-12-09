import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tema azul turquí oscuro
        dark: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
          950: '#004d40',
        },
        primary: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        accent: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
        },
        surface: {
          50: '#1a2332',
          100: '#151c28',
          200: '#111827',
          300: '#0d1117',
          400: '#090c10',
          500: '#050709',
        },
        success: {
          50: '#0d3320',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#332a0d',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#330d0d',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Colores para tema oscuro - MÁS CONTRASTE con el body
        'dark-bg': '#030710',
        'dark-card': '#1e3a5f',
        'dark-card-elevated': '#2a4a75',
        'dark-border': '#3d6a9f',
      },
    },
  },
  plugins: [],
}

export default config
