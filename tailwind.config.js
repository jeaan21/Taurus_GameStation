/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        taurus: {
          obsidian: '#0D0D0D',
          blood: '#8B0000',
          silver: '#C0C0C0',
          carbon: '#1A1A1B',
          smoke: '#F5F5F5',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px #8B000044' },
          to:   { boxShadow: '0 0 25px #8B000088, 0 0 50px #8B000022' },
        },
      },
    },
  },
  plugins: [],
};
