import { viteStaticCopy } from 'vite-plugin-static-copy'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 统一暴露所有 AI_ 开头的环境变量
  const envWithPrefix = Object.keys(env)
    .filter(key => key.startsWith('AI_'))
    .reduce((acc, key) => {
      acc[`import.meta.env.${key}`] = JSON.stringify(env[key])
      return acc
    }, {})
  
  return {
    server: {
      host: '0.0.0.0',
      allowedHosts: true
    },
    // 定义全局常量，将环境变量暴露给客户端
    define: envWithPrefix,
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: [
              '.vitepress/theme/components/resources/fcitx5Online/Fcitx5.wasm',
              '.vitepress/theme/components/resources/fcitx5Online/libFcitx5Config.so',
              '.vitepress/theme/components/resources/fcitx5Online/libFcitx5Core.so',
              '.vitepress/theme/components/resources/fcitx5Online/libFcitx5Utils.so'
            ],
            dest: 'assets/chunks'
          }
        ]
      })
    ]
  }
})