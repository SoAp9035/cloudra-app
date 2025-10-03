// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

      colors: {
        /* 
        Colors taken from the logo - used in specific places
        usage: cloudra-primarytext
        */
        cloudra: {
          primarytext: "#141a37",
          lightblue: "#85D0CD",
          blue: "#587E9C",
          purple: "#7480A1",
          dark: "#0D1321",   // çok koyu lacivert (arka plan gibi)
          navy: "#1E3A8A",   // koyu mavi
          indigo: "#3730A3", // indigo
          cyan: "#2563EB",   // canlı mavi (cyan yerine daha koyu)
          sky: "#38BDF8",    // açık mavi ton
          sidebr: "#1E3A8A",
        

          
        },
        
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      
      },


      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOutUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
      },
      animation: {
        fadeInDown: "fadeInDown 0.5s ease-out forwards",
        fadeOutUp: "fadeOutUp 0.5s ease-in forwards",
      },
    },
  },
  plugins: [],
};
