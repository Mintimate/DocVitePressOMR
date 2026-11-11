import { writeFileSync } from 'node:fs'
import { resolveUmamiConfig } from '../../.vitepress/config/umami.mjs'

// EdgeOne CLI 的构建子进程不会继承 CNB 的全部环境变量。
// 在 CLI 启动前将这六项公开配置写入 Vite 的生产环境文件，避免被 .env 拉取覆盖。
for (const key of ['UMAMI_BASE_URL', 'UMAMI_WEBSITE_ID', 'UMAMI_SHARE_ID']) {
  if (!process.env[key]?.trim()) {
    throw new Error(`Missing ${key}: check the CNB DocVitePressOMR.yaml import`)
  }
}

const config = resolveUmamiConfig(process.env)
const publicEnv = {
  UMAMI_BASE_URL: config.baseUrl,
  UMAMI_WEBSITE_ID: config.websiteId,
  UMAMI_SHARE_ID: config.shareId,
  UMAMI_STATS_DAYS: config.days,
  UMAMI_CACHE_TTL_MS: config.cacheTtl,
  UMAMI_EXCLUDE_HASH: config.excludeHash,
}

const contents = Object.entries(publicEnv).map(([key, value]) => {
  // 双引号保护 # 等字符，转义 $ 防止 dotenv-expand 将其当作变量引用。
  return `${key}=${JSON.stringify(String(value)).replace(/\$/g, '\\$')}`
}).join('\n') + '\n'

writeFileSync('.env.production.local', contents, { mode: 0o600 })
console.log('[Umami] Prepared 6 public variables in .env.production.local')
