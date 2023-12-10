/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/views/**/*.pug"],
    theme: {
        extend: {
            colors: {
                customBlue: "#026873",
                customBlue2: "#01343A",
                customYellow: "#BF8C2C",
                customYellow2: "#9F7526",
                customGreen1: "#6DC799",
                customGreen2: "#2D523F",
                customGreen3: "#2BA868",
                customGreen4: "#437A5E",
                customGreen5: "#87F5BC",
            },
            fontFamily: {
                Custom: ["Roboto", "Arial", "sans-serif"],
            },
        },
    },
    plugins: [],
};
