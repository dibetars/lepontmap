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
        forest: {
          DEFAULT: '#306d00',
          mid: '#76b743',
          light: '#8fce5a',
        },
        cream: '#F5F0E8',
        gold: '#C9A84C',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fog-left': 'fogLeft 12s ease-in-out infinite alternate',
        'fog-right': 'fogRight 15s ease-in-out infinite alternate',
        'slide-in-right': 'slideInRight 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-out-right': 'slideOutRight 0.35s ease-in forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-slow': 'fadeIn 1.6s ease-out forwards',
      },
      keyframes: {
        fogLeft: {
          '0%': { transform: 'translateX(-5%) scale(1.05)', opacity: '0.7' },
          '100%': { transform: 'translateX(3%) scale(1)', opacity: '0.35' },
        },
        fogRight: {
          '0%': { transform: 'translateX(5%) scale(1)', opacity: '0.5' },
          '100%': { transform: 'translateX(-3%) scale(1.05)', opacity: '0.7' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
