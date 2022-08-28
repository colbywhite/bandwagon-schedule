// https://prettier.io/docs/en/options.html
/** @type {import('prettier').RequiredOptions} */
module.exports = {
  overrides: [
    {
      files: "Routes.*",
      options: {
        printWidth: 999,
      },
    },
  ],
  tailwindConfig: "./web/config/tailwind.config.js",
  plugins: [require("prettier-plugin-tailwindcss")],
};
