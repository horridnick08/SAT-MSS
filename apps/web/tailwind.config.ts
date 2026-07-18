import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core design system tokens (PXD §13)
        space: {
          black: '#06080D',
          night: '#0D1117',
        },
        panel: {
          deep: '#131920',
          surface: '#1C2333',
        },
        border: {
          dim: '#2A3547',
          active: '#3D5080',
        },
        // Earth Accents
        terrain: {
          green: '#1A4A2E',
        },
        alert: {
          amber: '#E88C30',
        },
        critical: {
          red: '#C94040',
        },
        water: {
          cyan: '#1AABB0',
        },
        bare: {
          orange: '#C77A3A',
        },
        road: {
          teal: '#06D6A0',
        },
        concession: {
          purple: '#7B5EA7',
        },
        protected: {
          green: '#2D8653',
        },
        // UI Tokens
        mission: {
          amber: '#E88C30',
          'amber-hover': '#F5A042',
        },
        text: {
          primary: '#E8EAF0',
          secondary: '#8A9BBB',
          tertiary: '#4E5D7A',
        },
        success: '#2D8653',
        error: '#C94040',
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backdropBlur: {
        'glass-deep': '24px',
        'glass-mid': '16px',
        'glass-light': '8px',
      },
      boxShadow: {
        'glass-deep': '0 4px 32px rgba(0, 0, 0, 0.40)',
        'glass-mid': '0 2px 16px rgba(0, 0, 0, 0.30)',
        'glass-light': '0 2px 8px rgba(0, 0, 0, 0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
