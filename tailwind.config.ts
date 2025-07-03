import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'rank-one-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px hsl(var(--accent) / 0.5), 0 0 16px hsl(var(--accent) / 0.4)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 32px hsl(var(--accent) / 0.9), 0 0 64px hsl(var(--accent) / 0.8)',
            transform: 'scale(1.05)',
          },
        },
        'highlight-glow': {
          '0%, 100%': {
            boxShadow: 'inset 0 0 6px hsl(var(--accent)), 0 0 6px hsl(var(--accent))',
          },
          '50%': {
            boxShadow: 'inset 0 0 12px hsl(var(--accent)), 0 0 12px hsl(var(--accent))',
          },
        },
        'reveal-x': {
          'from': { transform: 'scaleX(0)' },
          'to': { transform: 'scaleX(1)' },
        },
        'reveal-y': {
          'from': { transform: 'scaleY(0)' },
          'to': { transform: 'scaleY(1)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulsing-score': {
          '0%, 100%': { transform: 'scale(2.0)', opacity: '1' },
          '50%': { transform: 'scale(2.2)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'rank-one-glow': 'rank-one-glow 4s ease-in-out infinite',
        'highlight-glow': 'highlight-glow 3s ease-in-out infinite alternate',
        'reveal-x': 'reveal-x 0.5s ease-out forwards',
        'reveal-y': 'reveal-y 0.5s ease-out 0.5s forwards',
        'pop-in': 'pop-in 0.3s ease-out 1s forwards',
        'pulsing-score': 'pulsing-score 2.0s ease-in-out 1.1s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
