import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'river-blue': '#1e40af',
        'river-light': '#3b82f6',
        'river-dark': '#1e3a8a',
        'tide-high': '#06b6d4',
        'tide-low': '#0891b2',
        'safe-green': '#10b981',
        'caution-yellow': '#f59e0b',
        'danger-red': '#ef4444',
      },
      animation: {
        'flow': 'flow 3s ease-in-out infinite',
        'tide-rise': 'tide-rise 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        'tide-rise': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
