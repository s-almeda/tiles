/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'nintendo': ['var(--font-nintendo-sans-serif)', 'system-ui', 'sans-serif'], // Nintendo Sans Serif
        'nintendo-ds': ['var(--font-nintendo)', 'Courier New', 'monospace'], // Nintendo DS BIOS
        'sans': ['var(--font-nintendo-sans-serif)', 'system-ui', 'sans-serif'], // Override default sans
        'mono': ['var(--font-nintendo)', 'Courier New', 'monospace'], // Override default mono
      },
    },
  },
}
