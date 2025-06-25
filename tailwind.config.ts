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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // New colors to match trainy.ai
        'trainy-dark': '#0A0A0A',
        'trainy-light': '#F0F0F0',
        'trainy-accent-blue': '#4F46E5',
        'trainy-accent-purple': '#8B5CF6',
        trainy: {
          // Trainy.ai inspired colors
          'background': '#F8FAFC',
          'card': '#FFFFFF',
          'text-primary': '#1E293B',
          'text-secondary': '#64748B',
          'accent-blue': '#3B82F6',
          'accent-dark-blue': '#2563EB',
          'border': '#E2E8F0',
          'success': '#10B981',
          'error': '#EF4444',
          'warning': '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.05)',
        medium: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config; 