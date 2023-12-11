/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/views/**/*.pug"],
  theme: {
    extend: {
      colors: {
        customBlue: "#1797A6",
        customBlue2: "#1797A6",
        customYellow: "#F2921D",
        customYellow2: "#F28705",
        customGreen1: "#318EAD",
        customGreen2: "#212226",
        customGreen3: "#F2921D",
        customGreen4: "#F28705",
        customGreen5: "#FFFFFF",
        customColor: "#BF0413",
        customBlue12: "#0C214E",
        customBlue13: "#071A26",
        customBulue14: "#BFBFBF",
        customBlue15: "#76CAEB",
        customBlue16: "#3CB03E",
        customBlue17: "#C92724",
      },
      fontFamily: {
        Custom: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
