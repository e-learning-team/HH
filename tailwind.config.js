/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{jsx,js,ts,tsx}",
  './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
],
  theme: {
    extend: {
      width:{
        main:'100vw',
        second:'1400px'
      },
    },
  },
  important: true, 
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

