import type { Config } from 'tailwindcss'

/**
 * ParkSafe Tailwind Config
 * Extends CSS variables from styles/tokens.css — never hardcode hex values here.
 * Dark mode is DISABLED — ParkSafe is light-mode only.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
        },
        neutral: {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          400: 'var(--color-neutral-400)',
          600: 'var(--color-neutral-600)',
          900: 'var(--color-neutral-900)',
        },
        slate: {
          500: 'var(--color-slate-500)',
          600: 'var(--color-slate-600)',
        },
        gray: {
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
        },
        error: {
          50: 'var(--color-error-50)',
          500: 'var(--color-error-500)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          500: 'var(--color-warning-500)',
        },
        success: {
          50: 'var(--color-success-50)',
          500: 'var(--color-success-500)',
        },
        emergency: {
          DEFAULT: 'var(--color-emergency)',
          bg: 'var(--color-emergency-bg)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        button: 'var(--radius-button)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'card-offset': 'var(--shadow-card-offset)',
        'card-offset-neutral': 'var(--shadow-card-offset-neutral)',
        'card-offset-primary': 'var(--shadow-card-offset-primary)',
        'success-glow': 'var(--shadow-success-glow)',
      },
      backgroundColor: {
        'register-tint': 'var(--color-register-tint)',
      },
      maxWidth: {
        page: 'var(--page-max-width)',
      },
      minHeight: {
        touch: 'var(--min-touch-target)',
      },
    },
  },
  plugins: [],
}

export default config
