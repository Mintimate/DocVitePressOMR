// 由 CNB 密钥仓库或本地 .env.local 提供构建环境变量。
// 仅返回前端统计所需的公开字段，不要把整个 env 序列化进 themeConfig。
export function resolveUmamiConfig(env = {}) {
  const baseUrl = (env.UMAMI_BASE_URL || '').trim().replace(/\/+$/, '')
  const websiteId = (env.UMAMI_WEBSITE_ID || '').trim()
  const shareId = (env.UMAMI_SHARE_ID || '').trim()

  if (!baseUrl && !websiteId && !shareId) return null
  if (!baseUrl || !websiteId) {
    throw new Error('Umami requires both UMAMI_BASE_URL and UMAMI_WEBSITE_ID')
  }

  const url = new URL(baseUrl)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('UMAMI_BASE_URL must be an HTTP(S) URL without credentials, query or fragment')
  }

  function positiveInteger(key, fallback) {
    if (!env[key]?.trim()) return fallback
    const value = Number(env[key])
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new Error(`${key} must be a positive integer`)
    }
    return value
  }

  const excludeHash = env.UMAMI_EXCLUDE_HASH?.trim() || 'true'
  if (!['true', 'false'].includes(excludeHash)) {
    throw new Error('UMAMI_EXCLUDE_HASH must be true or false')
  }

  return {
    baseUrl,
    websiteId,
    shareId,
    days: positiveInteger('UMAMI_STATS_DAYS', 30),
    cacheTtl: positiveInteger('UMAMI_CACHE_TTL_MS', 5 * 60 * 1000),
    excludeHash: excludeHash === 'true',
  }
}
