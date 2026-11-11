<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { pagePath, umamiStatsKey } from './client.js'

const props = defineProps({
  scope: {
    type: String,
    default: 'both',
    validator: value => ['site', 'page', 'both'].includes(value),
  },
})

const client = inject(umamiStatsKey, null)
const { lang, frontmatter, page } = useData()
const route = useRoute()
const siteStats = ref(null)
const currentStats = ref(null)
const loading = ref(false)
const failed = ref(false)
const enabled = computed(() => client && frontmatter.value.umami !== false && !page.value.isNotFound)
const showSite = computed(() => props.scope !== 'page')
const showPage = computed(() => props.scope !== 'site')
const text = computed(() => lang.value.startsWith('en') ? {
  period: `Last ${client?.days ?? 30} days`,
  siteVisitors: 'Site visitors', siteViews: 'Site views',
  pageVisitors: 'Page visitors', pageViews: 'Page views',
  retry: 'Retry statistics', unavailable: 'Statistics unavailable',
  pageHint: 'Exact page path in Umami; historical fragment URLs are counted separately.',
} : {
  period: `近 ${client?.days ?? 30} 天`,
  siteVisitors: '全站访客', siteViews: '全站浏览',
  pageVisitors: '本页访客', pageViews: '本页浏览',
  retry: '重试统计', unavailable: '统计暂不可用',
  pageHint: '按 Umami 页面路径统计，历史锚点地址单独计数。',
})
const formatter = computed(() => new Intl.NumberFormat(lang.value || 'zh-CN'))
const format = value => value == null ? '—' : formatter.value.format(value)
let generation = 0
let stopWatch

async function refresh() {
  const currentGeneration = ++generation
  siteStats.value = null
  currentStats.value = null
  failed.value = false
  if (!enabled.value) return

  loading.value = true
  const jobs = []
  const read = async (path, target) => {
    try {
      const result = await client.getStats(path)
      if (generation === currentGeneration) target.value = result
    } catch {
      if (generation === currentGeneration) failed.value = true
    }
  }
  if (showSite.value) jobs.push(read(null, siteStats))
  if (showPage.value) jobs.push(read(route.path, currentStats))
  await Promise.all(jobs)
  if (generation === currentGeneration) loading.value = false
}

function onVisible() {
  if (document.visibilityState === 'visible') refresh()
}

onMounted(() => {
  // 仅在客户端取数，构建文档时不依赖 Umami；忽略锚点跳转。
  stopWatch = watch(() => [pagePath(route.path), props.scope, enabled.value], refresh, { immediate: true })
  document.addEventListener('visibilitychange', onVisible)
})

onUnmounted(() => {
  generation++
  stopWatch?.()
  document.removeEventListener('visibilitychange', onVisible)
})
</script>

<template>
  <div v-if="enabled" class="umami-stats" :class="`umami-stats--${scope}`" :aria-busy="loading">
    <span class="umami-period">{{ text.period }}</span>
    <span v-if="showPage" class="umami-group" :title="text.pageHint">
      <span>{{ text.pageVisitors }} <strong>{{ format(currentStats?.visitors) }}</strong></span>
      <span>{{ text.pageViews }} <strong>{{ format(currentStats?.pageviews) }}</strong></span>
    </span>
    <span v-if="showSite" class="umami-group">
      <span>{{ text.siteVisitors }} <strong>{{ format(siteStats?.visitors) }}</strong></span>
      <span>{{ text.siteViews }} <strong>{{ format(siteStats?.pageviews) }}</strong></span>
    </span>
    <button v-if="failed && !loading" type="button" :title="text.unavailable" @click="refresh">
      {{ text.retry }}
    </button>
    <span class="umami-credit">Umami</span>
  </div>
</template>

<style scoped>
.umami-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin: 16px 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.8;
}

.umami-stats--site {
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.umami-period, .umami-credit {
  color: var(--vp-c-text-3);
}

.umami-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px 14px;
}

strong {
  display: inline-block;
  min-width: 1ch;
  margin-left: 4px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

button {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
