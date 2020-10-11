module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ef1217',
      },
    },
  },
  variants: {},
  plugins: [],
};
