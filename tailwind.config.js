/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          deep: '#25245B',
          900: '#1c1b48',
          800: '#25245B',
          700: '#323075',
          600: '#434190',
        },
        brand: {
          blue: '#5271FF',
          blueHover: '#405ee6',
          purple: '#A78BFA',
          green: '#5DD6B5',
          greenDark: '#3fb594',
          yellow: '#FFD76A',
          coral: '#FF947F',
          bg: '#F7F9FF',
          card: '#FFFFFF',
          text: '#25245B',
          muted: '#6B7280',
          border: '#E5E9F5',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(37, 36, 91, 0.06)',
        'card': '0 4px 20px rgba(37, 36, 91, 0.08)',
        'hover': '0 12px 35px rgba(82, 113, 255, 0.16)',
        'yellow-glow': '0 6px 20px rgba(255, 215, 106, 0.4)',
        'green-glow': '0 6px 20px rgba(93, 214, 181, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
