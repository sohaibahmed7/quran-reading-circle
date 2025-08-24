
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-didot)', 'serif'],
        'zuhair-display': ['var(--font-zuhair-display)', 'serif'],
        'zuhair-text': ['var(--font-zuhair-text)', 'serif'],
      },
      colors: {
        'custom-bg': '#F8EBD5',
      },
    },
  },
  plugins: [],
}
export default config
