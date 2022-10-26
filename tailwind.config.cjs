/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 1s ease"
      },
      keyframes: {
        "fade-in": {
          "from": { opacity: 0},
          "to": { opacity: 1}
        }
      }
    }
  },
  plugins: []
}
