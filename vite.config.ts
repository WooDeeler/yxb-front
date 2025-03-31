import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  plugins: [uni()],
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
