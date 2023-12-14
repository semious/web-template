import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // entry: path.resolve(__dirname, "./src/main.ts"),
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  build: {
    // rollupOptions: {
    //     input: {
    //         1: path.resolve(__dirname, "./src/index.html"),
    //     },
    //     output: {
    //         entryFileNames: `dist/[name].js`,
    //         chunkFileNames: `dist/[name].js`,
    //         assetFileNames: `dist/[name].[ext]`,
    //     },
    // },
    // minify: "esbuild",
  },
  envDir: './',
  base:
    process.env.NODE_ENV === "production"
      ? "https://tg.yuanzixx.cn/public/fortune-admin"
      : "/",
});
