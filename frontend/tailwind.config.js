module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class', // This is CRITICAL for the theme toggle
  theme: {
    extend: {
      keyframes: {
        gradientBG: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradientBG: 'gradientBG 15s ease infinite',
      },
    },
  },
  plugins: [],
}
