import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        narrow: ['var(--font-archivo-narrow)', 'system-ui', 'sans-serif'],
        mono: ['monospace', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        'scalar-red': '#A80000',
        'scalar-black': '#000502',
        'scalar-black-charcoal': '#1a1a1a',
        'parchment': '#FCFBF8',
        'atmospheric-blue': '#001A23',
      },
    },
  },
  plugins: [],
}
export default config
