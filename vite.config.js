import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 前回の「タスク帳」と同じく、Reactを使うためのプラグイン設定だけです。
export default defineConfig({
  plugins: [react()],
});
