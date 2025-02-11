/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        // bg colors
        'main-bg-gray': '#121212',
        'main-bg-white': '#FFFFFF',
        'light-gray':'#2a2a2a',
        // hover sidebar
        'light-gray-hover':'#2a2a2a',
        // font colors
        'main-font-black': 'black',
        // login color
        'main-login-button': "#1ED760",
        // album page font color
        'light-gray':'#7F7F7F'
      }
    },
  },
  // plugins: [

  //   function ({ addUtil }) {
  //     const newAddUtil = {
  //         /* Hide scrollbar for Chrome, Safari and Opera */
  //       ".no-scrollbar::-webkit-scrollbar" : {
  //       display: 'none'
  //     },
  //     /* Hide scrollbar for IE, Edge and Firefox */
  //     ".no - scrollbar" : {
  //      "-ms - overflow - style": 'none',  /* IE and Edge */
  //       "scrollbar - width": 'none',  /* Firefox */
  //     },
  //     };
  //     //addUtil(newAddUtil);
  //   },
  // ],
plugins: [
     function ({ addUtilities }) {
         const newUtilities = {
             ".no-scrollbar::-webkit-scrollbar": {
                display: "none",
               
             },
             ".no-scrollbar": {
                 "-ms-overflow-style": "none",
                 "scrollbar-width": "none",
             },
         };
         addUtilities(newUtilities);
     },
 ],
}

