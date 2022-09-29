/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
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
