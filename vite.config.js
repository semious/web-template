import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  build: {},
  envDir: "./",
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "arcoblue-6": "#f85959",
        },
        javascriptEnabled: true,
      },
    },
  },
  base:
    process.env.NODE_ENV === "production"
      ? "https://tg.yuanzixx.cn/public/clothing-admin"
      : "/",
});
