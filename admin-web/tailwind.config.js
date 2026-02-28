/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#10b981', // Emerald 500
                    hover: '#059669',   // Emerald 600
                },
                secondary: {
                    DEFAULT: '#8b5cf6', // Violet 500
                    hover: '#7c3aed',   // Violet 600
                },
                bgDark: {
                    DEFAULT: '#0f172a', // Slate 900
                    paper: '#1e293b',   // Slate 800
                    card: '#0b1120',    // Darker Slate
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
