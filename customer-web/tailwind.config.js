/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#10B981", // Emerald 500
                    hover: "#059669", // Emerald 600
                    light: "#D1FAE5", // Emerald 100
                    dark: "#047857", // Emerald 700
                },
                bgDark: {
                    DEFAULT: "#0F172A", // Slate 900
                    paper: "#1E293B", // Slate 800
                    card: "#334155", // Slate 700
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
