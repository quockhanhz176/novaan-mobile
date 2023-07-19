/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const customColors = {
    black: colors.black,
    white: colors.white,
    gray: colors.gray,
    cprimary: {
        100: "#1aeda7",
        200: "#13ad7a",
        300: "#12a171",
        400: "#0f875f",
        500: "#0b6144",
    },
    csecondary: "#e94f37",
    ctertiary: "#fff5ea",
    cinfo: "#1e96fc",
    cwarning: "#f32839",
    cgrey: {
        seasalt: "#f9f9f9",
        whitesmoke: "#f2f2f2",
        platinum: "#dedede",
        battleship: "#999999",
        grey: "#777777",
        dim: "#606060",
    },
    xanthous: "#f7b01c",
    star: "#ffcb01",
    heart: "#ff6531",
    save: "#2ca58d",
    seeker: {
        background: "#898b8B",
        foreground: "#a40605",
    },
};

module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: customColors,
        },
    },
    plugins: [],
    customColors,
};
