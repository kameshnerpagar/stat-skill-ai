/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',
          slate: '#1e293b',
          blue: '#1e40af',
          saffron: '#d97706',
          green: '#047857',
          gold: '#b45309',
          light: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0'
        }
      }
    },
  },
  plugins: [],
}
