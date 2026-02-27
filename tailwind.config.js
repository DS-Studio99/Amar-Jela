/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#e8f8f0',
                    100: '#c8eedd',
                    200: '#93ddbf',
                    300: '#5ecda1',
                    400: '#2dbd88',
                    500: '#1a9e5c',
                    600: '#157a47',
                    700: '#0f5c35',
                    800: '#0a3d24',
                    900: '#051f12',
                },
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                'slide-up': 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
                'pop-in': 'popIn 0.25s ease',
                float: 'float 3s ease-in-out infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                slideUp: {
                    from: { transform: 'translateY(100px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                popIn: {
                    from: { transform: 'scale(0.9)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
        },
    },
    plugins: [],
};
