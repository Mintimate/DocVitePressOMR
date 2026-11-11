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
const loading = ref(true)
const failed = ref(false)
const enabled = computed(() => client && frontmatter.value.umami !== false && !page.value.isNotFound)
const showSite = computed(() => props.scope !== 'page')
const showPage = computed(() => props.scope !== 'site')
const text = computed(() => lang.value.startsWith('en') ? {
  period: `Last ${client?.days ?? 30} days`,
  siteVisitors: 'Site visitors', siteViews: 'Site views',
  pageVisitors: 'Page visitors', pageViews: 'Page views',
  retry: 'Retry statistics', unavailable: 'Statistics unavailable',
  loading: 'Loading statistics',
  pageHint: 'Exact page path; historical fragment URLs are counted separately.',
} : {
  period: `近 ${client?.days ?? 30} 天`,
  siteVisitors: '全站访客', siteViews: '全站浏览',
  pageVisitors: '本页访客', pageViews: '本页浏览',
  retry: '重试统计', unavailable: '统计暂不可用',
  loading: '正在加载统计',
  pageHint: '按页面路径统计，历史锚点地址单独计数。',
})
const groups = computed(() => [
  {
    key: 'page', visible: showPage.value, hint: text.value.pageHint,
    metrics: [
      { key: 'visitors', label: text.value.pageVisitors, value: currentStats.value?.visitors },
      { key: 'views', label: text.value.pageViews, value: currentStats.value?.pageviews },
    ],
  },
  {
    key: 'site', visible: showSite.value,
    metrics: [
      { key: 'visitors', label: text.value.siteVisitors, value: siteStats.value?.visitors },
      { key: 'views', label: text.value.siteViews, value: siteStats.value?.pageviews },
    ],
  },
].filter(group => group.visible))
const formatter = computed(() => new Intl.NumberFormat(lang.value || 'zh-CN'))
const format = value => value == null ? '—' : formatter.value.format(value)
let generation = 0
let stopWatch

async function refresh() {
  const currentGeneration = ++generation
  siteStats.value = null
  currentStats.value = null
  failed.value = false
  if (!enabled.value) {
    loading.value = false
    return
  }

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
    <span v-for="group in groups" :key="group.key" class="umami-group" :title="group.hint">
      <span v-for="metric in group.metrics" :key="metric.key">
        {{ metric.label }}
        <strong>
          <span v-if="loading && metric.value == null" class="umami-loading" role="img" :aria-label="text.loading">
            <span v-for="dot in 3" :key="dot" class="umami-loading-dot" aria-hidden="true" />
          </span>
          <template v-else>{{ format(metric.value) }}</template>
        </strong>
      </span>
    </span>
    <button v-if="failed && !loading" type="button" :title="text.unavailable" @click="refresh">
      {{ text.retry }}
    </button>
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

.umami-period {
  color: var(--vp-c-text-3);
}

.umami-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px 14px;
}

strong {
  display: inline-block;
  min-width: 3ch;
  margin-left: 4px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.umami-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 1em;
  vertical-align: middle;
}

.umami-loading-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  animation: stats-bounce 1s ease-in-out infinite;
}

.umami-loading-dot:nth-child(2) { animation-delay: 0.12s; }
.umami-loading-dot:nth-child(3) { animation-delay: 0.24s; }

@keyframes stats-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
  30% { transform: translateY(-3px); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .umami-loading-dot { animation: none; opacity: 0.65; }
}

button {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
