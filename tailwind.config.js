/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                cprimary: {
                    100: "#1aedA7",
                    200: "#13ad7a",
                    300: "#12a171",
                    400: "#0f875f",
                    500: "#0b6144",
                },
                cwarning: "#a12e12",
            },
        },
    },
    plugins: [],
};
