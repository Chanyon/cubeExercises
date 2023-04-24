import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname,"./src"),
      "assets": path.resolve(__dirname,"./src/assets"),
    }
  },
  build: {
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // },
    // rollupOptions:{
    //   plugins:[
    //     copy({
    //       verbose: true,
    //       targets: [
    //         {src:"data", dest: "./dist/data"}
    //       ]
    //     })
    //   ]
    // }
  }
})
