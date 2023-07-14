/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{vue, js, jsx, ts, tsx, html}'
  ],
  theme: {
    extend: {
      colors: {
        22158660.1: ' rgba(22, 158, 66, 0.1)'
      },
      fontSize: {
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px'
      }
    }
  },
  plugins: [],
};

