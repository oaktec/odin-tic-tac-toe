/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      minHeight: {
        "50vmin": "50vmin",
      },
      minWidth: {
        "50vmin": "50vmin",
      },
    },
  },
  plugins: [],
};
