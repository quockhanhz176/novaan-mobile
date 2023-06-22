/** @type {import('tailwindcss').Config} */

const colors = {
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
        platinum: "#dedede",
        dimGrey: "#606060",
    },
};

module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors,
        },
    },
    plugins: [],
    customColors: colors,
};
