import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mona: ['var(--font-mona)', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        syne: ['var(--font-mona)', 'sans-serif'],
      }
    }
  },
  plugins: []
}
export default config
