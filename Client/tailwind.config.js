/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'zen-bg':      '#0A0A0F',
        'zen-surface': '#12121A',
        'zen-card':    '#1A1A28',
        'zen-accent':  '#6C63FF',
        'zen-teal':    '#00D4AA',
        'zen-text':    '#F0F0FF',
        'zen-muted':   '#8888AA',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        space:  ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
