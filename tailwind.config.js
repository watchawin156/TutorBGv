/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'figma-bg': '#F0F4FF',
        'brand-from': '#667eea',
        'brand-to': '#764ba2',
        'figma-brand': '#667eea',
        'stat-blue-from': '#667eea',
        'stat-blue-to': '#764ba2',
        'stat-red-from': '#f5576c',
        'stat-red-to': '#f093fb',
        'stat-orange-from': '#f6d365',
        'stat-orange-to': '#fda085',
        'figma-text-dim': '#94A3B8',
        'nav-active': '#EEF2FF',
        'nav-active-text': '#6366F1',
        'dash-bg': '#F0F4FF',
      },
      borderRadius: {
        'figma-card': '24px',
        'figma-button': '16px',
      },
      boxShadow: {
        'figma-soft': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'dash': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'dash-hover': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'card-blue': '0 8px 32px rgba(102, 126, 234, 0.3)',
        'card-green': '0 8px 32px rgba(67, 233, 123, 0.3)',
        'card-cyan': '0 8px 32px rgba(79, 172, 254, 0.3)',
      },
      fontFamily: {
        'sans': ['Inter', 'Sarabun', 'sans-serif'],
        'sarabun': ['Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
