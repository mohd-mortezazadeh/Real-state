/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "src/pages/**/*.{js,ts,jsx,tsx}",
        "src/components/**/*.{js,ts,jsx,tsx}",
        "src/layouts/**/*.{js,ts,jsx,tsx}",
        "src/forms/**/*.{js,ts,jsx,tsx}",
        "src/services/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '.5rem',
                lg: '2rem',
                xl: '3rem',
            },
        },
        extend: {
            aspectRatio: {
                '5/3': '5 / 3',
            },
            height: {
                '100': '30rem',
                '70': '17.5rem'
            },
            width : {
               '100' : '25rem',
               '104' : '26rem'
            } ,
            fontFamily: {
                sans: ['yekanbakh'],
            },
            colors: {
                'primary': '#005ADC',
                'primary-100': '#AACEFF',
                'text': '#051429',
                'custom-gray': '#B5B5B5',
                'custom-gray-200': '#737373',
                'custom-gray-100': '#FBFBFB',
                'bg-primary': '#FEFEFE',
                'custom-red': '#FA3737',
                'custom-gold': '#FFD100',
                'custom-green': '#0D9E2D',
                'second-layout' : '#eaeaea',
                'error-logic' : '#63CCFB'

            },
            backgroundImage: {
                'header-banner': "url('/images/header-banner.png')",
                'footer-banner': "url('/images/footer-banner.jpg')",
                'statistic-banner': "url('/images/statistics-banner.png')",
                'ad-bg': "url('/images/ad-bg.png')",
                'auth-bg': "url('/images/auth-bg.png')",
            },
            padding : {
                "2/3" : "66.666667"
            }
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/typography'),
    ],
}