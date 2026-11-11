export const umamiStatsKey = Symbol('umami-stats')

// 与 Umami v2 存储的 pathname 保持一致；查询参数和锚点不作为页面标识。
export function pagePath(path) {
  const pathname = path.split(/[?#]/, 1)[0] || '/'
  try {
    return decodeURI(pathname)
  } catch {
    return pathname
  }
}

export function createUmamiClient({
  baseUrl,
  websiteId,
  shareId,
  days = 30,
  cacheTtl = 300000,
  timeout = 20000,
}, { fetch: fetcher = (...args) => fetch(...args), now = Date.now } = {}) {
  if (!baseUrl || !websiteId || !shareId || !Number.isInteger(days) || days < 1 ||
    !Number.isFinite(cacheTtl) || cacheTtl <= 0 || !Number.isFinite(timeout) || timeout <= 0) {
    throw new Error('Invalid Umami statistics configuration')
  }

  const origin = baseUrl.replace(/\/+$/, '')
  const cache = new Map()
  let sharePromise

  async function request(path, headers = {}) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetcher(`${origin}${path}`, {
        headers,
        signal: controller.signal,
        credentials: 'omit',
      })
      if (!response.ok) {
        const error = new Error(`Umami statistics unavailable (${response.status})`)
        error.status = response.status
        throw error
      }
      return await response.json()
    } finally {
      clearTimeout(timer)
    }
  }

  function getShare() {
    if (!sharePromise) {
      sharePromise = request(`/api/share/${encodeURIComponent(shareId)}`)
        .then(data => {
          if (data.websiteId !== websiteId || typeof data.token !== 'string' || !data.token) {
            throw new Error('Invalid Umami share response')
          }
          return data.token
        })
        .catch(error => {
          sharePromise = undefined
          throw error
        })
    }
    return sharePromise
  }

  async function readStats(path, endAt) {
    const params = new URLSearchParams({
      startAt: String(endAt - days * 86400000),
      endAt: String(endAt),
    })
    if (path !== null) params.set('url', pagePath(path))

    // 分享 token 仅保存在内存中；过期时重新获取一次。
    for (let attempt = 0; attempt < 2; attempt++) {
      const shareRequest = getShare()
      const token = await shareRequest
      try {
        const data = await request(`/api/websites/${encodeURIComponent(websiteId)}/stats?${params}`, {
          'x-umami-share-token': token,
        })
        const visitors = data.visitors?.value
        const pageviews = data.pageviews?.value
        if (![visitors, pageviews].every(value => Number.isSafeInteger(value) && value >= 0)) {
          throw new Error('Invalid Umami v2 statistics response')
        }
        return { visitors, pageviews }
      } catch (error) {
        if (error.status !== 401 || attempt > 0) throw error
        if (sharePromise === shareRequest) sharePromise = undefined
      }
    }
  }

  return {
    days,
    getStats(path = null) {
      // 同一缓存窗口内，全站和当前页使用完全相同的统计区间。
      const endAt = Math.floor(now() / cacheTtl) * cacheTtl
      const key = JSON.stringify([endAt, path === null ? null : pagePath(path)])
      if (cache.has(key)) return cache.get(key).promise

      for (const [cacheKey, entry] of cache) {
        if (entry.endAt !== endAt) cache.delete(cacheKey)
      }
      if (cache.size >= 100) cache.delete(cache.keys().next().value)

      const promise = readStats(path, endAt).catch(error => {
        // 失败不是 0，也不永久缓存失败；下次访问或点击重试可恢复。
        if (cache.get(key)?.promise === promise) cache.delete(key)
        throw error
      })
      cache.set(key, { endAt, promise })
      return promise
    },
  }
}
