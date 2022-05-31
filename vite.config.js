import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import requireTransform from 'vite-plugin-require-transform'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), requireTransform({
    fileRegex: /.ts$|.vue$/
  })]
})
