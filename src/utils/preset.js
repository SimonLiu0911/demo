module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1260px',
      '2xl': '1536px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#dbdbdb',
        200: '#bbbbbb',
        300: '#9d9d9e',
        400: '#F4F4F4 ',
        500: '#F7F9FA',
        600: '#67757c',
        700: '#716969',
        800: '#333333',
        900: '#F3F1F1',
        1000: '#999999'
      },
      red: {
        50: '#fce2db',
        100: '#ff6440',
        200: '#c62727',
        300: '#DB2900',
        400: '#ff6440',
        500: '#ff8f75',
        600: '#a82000'
      }
    },
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite'
    }
  }
};
