import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 统一暴露 AI_ 和 CAPTCHA_ 开头的环境变量给前端
  // 排除后端独有的敏感变量，防止密钥泄露到客户端
  const allowedPrefixes = ['AI_', 'CAPTCHA_']
  const excludeKeys = [
    'AI_API_KEY',
    'AI_BASE_URL',
    'AI_MODEL',
    'CAPTCHA_APP_SECRET_KEY',
    'CAPTCHA_TYPE'
  ]
  const envWithPrefix = Object.keys(env)
    .filter(key => allowedPrefixes.some(prefix => key.startsWith(prefix)))
    .filter(key => !excludeKeys.includes(key))
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
