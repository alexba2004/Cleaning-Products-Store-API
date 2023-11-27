/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/views/**/*.pug"],
    theme: {
        extend: {
            colors: {
                customGreen1: "#6DC799",
                customGreen2: "#2D523F",
                customGreen3: "#2BA868",
                customGreen4: "#437A5E",
                customGreen5: "#87F5BC",
            },
            fontFamily: {
                Custom: ["Roboto", "Arial", "sans-serif"],
            },
            margin: {
                customM1: "3rem", // O el valor que desees
            },
        },
    },
    plugins: [],
};
