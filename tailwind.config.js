/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{jsx,js,ts,tsx}",
  './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  "./node_modules/flowbite/**/*.js",
  'node_modules/flowbite-react/lib/esm/**/*.js',
],
  theme: {
    extend: {
      width:{
        main:'100vw',
        second:'1280px'
      },
    },
    container: {
      center: true,
      padding: "15px",
      screens: {
        mobile: "600px",
        tablet: "900px",
        desktop: "1140px",
      },
    },
  },
  important: true, 
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin'),
  ],
}

