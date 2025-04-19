/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem', // default padding
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px'
        },
      },

      // Colors
      colors: {
        primary       : "#B92B5D",
        secondary     : "#F3F3E9",
        gray          : {
          '100'       : "#D9D9D9",
          '200'       : "#373052",
          '300'       : "#E9E8E3",
          '500'       : "#2E2E2E",
        }
        
      },

      // Font family
      fontFamily: {
        "primary": ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
