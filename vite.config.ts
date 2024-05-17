import * as path from "path";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import tailwindcssNesting from "tailwindcss/nesting";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  css: {
    postcss: {
      plugins: [tailwindcssNesting, tailwindcss, autoprefixer],
    },
  },
});
