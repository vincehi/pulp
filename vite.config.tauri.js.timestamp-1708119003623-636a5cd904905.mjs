// vite.config.tauri.js
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/vite/dist/node/index.js";

// vite.config.ts
import * as path from "path";
import autoprefixer from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/autoprefixer/lib/autoprefixer.js";
import tailwindcss from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/tailwindcss/lib/index.js";
import tailwindcssNesting from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/tailwindcss/nesting/index.js";
import { defineConfig } from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///Users/vincentsourice/Sites/perso2022/pulp/node_modules/vite-plugin-solid/dist/esm/index.mjs";
var __vite_injected_original_dirname = "/Users/vincentsourice/Sites/perso2022/pulp";
var vite_config_default = defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__vite_injected_original_dirname, "./src") }]
  },
  css: {
    postcss: {
      plugins: [tailwindcssNesting, tailwindcss, autoprefixer]
    }
  }
});

// vite.config.tauri.js
var vite_config_tauri_default = defineConfig2(
  mergeConfig(
    vite_config_default,
    defineConfig2({
      // prevent vite from obscuring rust errors
      clearScreen: false,
      // Tauri expects a fixed port, fail if that port is not available
      server: {
        strictPort: true,
        open: false
      },
      // to access the Tauri environment variables set by the CLI with information about the current target
      envPrefix: [
        "VITE_",
        "TAURI_PLATFORM",
        "TAURI_ARCH",
        "TAURI_FAMILY",
        "TAURI_PLATFORM_VERSION",
        "TAURI_PLATFORM_TYPE",
        "TAURI_DEBUG"
      ],
      build: {
        // Tauri uses Chromium on Windows and WebKit on macOS and Linux
        target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
        // don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        cssMinify: !process.env.TAURI_DEBUG ? "lightningcss" : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG
      }
    })
  )
);
export {
  vite_config_tauri_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudGF1cmkuanMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmluY2VudHNvdXJpY2UvU2l0ZXMvcGVyc28yMDIyL3B1bHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy92aW5jZW50c291cmljZS9TaXRlcy9wZXJzbzIwMjIvcHVscC92aXRlLmNvbmZpZy50YXVyaS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmluY2VudHNvdXJpY2UvU2l0ZXMvcGVyc28yMDIyL3B1bHAvdml0ZS5jb25maWcudGF1cmkuanNcIjsvKiogQHR5cGUge2ltcG9ydCgndml0ZScpLlVzZXJDb25maWd9ICovXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbWVyZ2VDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGJhc2VWaXRlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnLmpzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoXG4gIG1lcmdlQ29uZmlnKFxuICAgIGJhc2VWaXRlQ29uZmlnLFxuICAgIGRlZmluZUNvbmZpZyh7XG4gICAgICAvLyBwcmV2ZW50IHZpdGUgZnJvbSBvYnNjdXJpbmcgcnVzdCBlcnJvcnNcbiAgICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICAgIC8vIFRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXG4gICAgICBzZXJ2ZXI6IHtcbiAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgb3BlbjogZmFsc2UsXG4gICAgICB9LFxuICAgICAgLy8gdG8gYWNjZXNzIHRoZSBUYXVyaSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgc2V0IGJ5IHRoZSBDTEkgd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCB0YXJnZXRcbiAgICAgIGVudlByZWZpeDogW1xuICAgICAgICBcIlZJVEVfXCIsXG4gICAgICAgIFwiVEFVUklfUExBVEZPUk1cIixcbiAgICAgICAgXCJUQVVSSV9BUkNIXCIsXG4gICAgICAgIFwiVEFVUklfRkFNSUxZXCIsXG4gICAgICAgIFwiVEFVUklfUExBVEZPUk1fVkVSU0lPTlwiLFxuICAgICAgICBcIlRBVVJJX1BMQVRGT1JNX1RZUEVcIixcbiAgICAgICAgXCJUQVVSSV9ERUJVR1wiLFxuICAgICAgXSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIC8vIFRhdXJpIHVzZXMgQ2hyb21pdW0gb24gV2luZG93cyBhbmQgV2ViS2l0IG9uIG1hY09TIGFuZCBMaW51eFxuICAgICAgICB0YXJnZXQ6XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuVEFVUklfUExBVEZPUk0gPT09IFwid2luZG93c1wiID8gXCJjaHJvbWUxMDVcIiA6IFwic2FmYXJpMTNcIixcbiAgICAgICAgLy8gZG9uJ3QgbWluaWZ5IGZvciBkZWJ1ZyBidWlsZHNcbiAgICAgICAgbWluaWZ5OiAhcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcgPyBcImVzYnVpbGRcIiA6IGZhbHNlLFxuICAgICAgICBjc3NNaW5pZnk6ICFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyA/IFwibGlnaHRuaW5nY3NzXCIgOiBmYWxzZSxcbiAgICAgICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcbiAgICAgICAgc291cmNlbWFwOiAhIXByb2Nlc3MuZW52LlRBVVJJX0RFQlVHLFxuICAgICAgfSxcbiAgICB9KVxuICApXG4pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmluY2VudHNvdXJpY2UvU2l0ZXMvcGVyc28yMDIyL3B1bHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy92aW5jZW50c291cmljZS9TaXRlcy9wZXJzbzIwMjIvcHVscC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmluY2VudHNvdXJpY2UvU2l0ZXMvcGVyc28yMDIyL3B1bHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSBcImF1dG9wcmVmaXhlclwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuaW1wb3J0IHRhaWx3aW5kY3NzTmVzdGluZyBmcm9tIFwidGFpbHdpbmRjc3MvbmVzdGluZ1wiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBzb2xpZFBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tc29saWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3NvbGlkUGx1Z2luKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFt7IGZpbmQ6IFwiQFwiLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSB9XSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzTmVzdGluZywgdGFpbHdpbmRjc3MsIGF1dG9wcmVmaXhlcl0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsZ0JBQUFBLGVBQWMsbUJBQW1COzs7QUNGc1EsWUFBWSxVQUFVO0FBRXRVLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sd0JBQXdCO0FBQy9CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBTnhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFBQSxFQUN2QixTQUFTO0FBQUEsSUFDUCxPQUFPLENBQUMsRUFBRSxNQUFNLEtBQUssYUFBa0IsYUFBUSxrQ0FBVyxPQUFPLEVBQUUsQ0FBQztBQUFBLEVBQ3RFO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsb0JBQW9CLGFBQWEsWUFBWTtBQUFBLElBQ3pEO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRFpELElBQU8sNEJBQVFDO0FBQUEsRUFDYjtBQUFBLElBQ0U7QUFBQSxJQUNBQSxjQUFhO0FBQUE7QUFBQSxNQUVYLGFBQWE7QUFBQTtBQUFBLE1BRWIsUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osTUFBTTtBQUFBLE1BQ1I7QUFBQTtBQUFBLE1BRUEsV0FBVztBQUFBLFFBQ1Q7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxPQUFPO0FBQUE7QUFBQSxRQUVMLFFBQ0UsUUFBUSxJQUFJLG1CQUFtQixZQUFZLGNBQWM7QUFBQTtBQUFBLFFBRTNELFFBQVEsQ0FBQyxRQUFRLElBQUksY0FBYyxZQUFZO0FBQUEsUUFDL0MsV0FBVyxDQUFDLFFBQVEsSUFBSSxjQUFjLGlCQUFpQjtBQUFBO0FBQUEsUUFFdkQsV0FBVyxDQUFDLENBQUMsUUFBUSxJQUFJO0FBQUEsTUFDM0I7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0Y7IiwKICAibmFtZXMiOiBbImRlZmluZUNvbmZpZyIsICJkZWZpbmVDb25maWciXQp9Cg==
