/** @type {import("tailwindcss").Config} */
import daisyui from "daisyui";
import * as daisyuiThemes from "daisyui/src/theming/themes";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cupcake: {
          ...daisyuiThemes["[data-theme=light]"],

          primary: "#DC2B20",
        },
      },
    ],
  },
};
