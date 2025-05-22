import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path"; // Added import for path resolution

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      // Alias Pinia to its MJS distribution file to potentially resolve export issues
      pinia: path.resolve(__dirname, "node_modules/pinia/dist/pinia.mjs"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: require("sass"),
        sassOptions: {
          fiber: false,
        },
      },
    },
  },
  build: {
    rollupOptions: {
      external: [/^node_modules\/@dcloudio\/uni-ui\/lib\/.*/],
    },
  },
});
