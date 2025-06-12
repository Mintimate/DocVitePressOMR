import { viteStaticCopy } from 'vite-plugin-static-copy'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '.vitepress/theme/components/resources/fcitx5Online/Fcitx5.wasm',
          dest: 'assets/chunks'
        }
      ]
    })
  ]
})