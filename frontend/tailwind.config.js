// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // CRUCIAL: Scans all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}