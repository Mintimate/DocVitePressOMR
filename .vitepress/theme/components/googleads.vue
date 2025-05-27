<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="dataAdClient"
      :data-ad-slot="dataAdSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  dataAdClient: {
    type: String,
    default: 'ca-pub-8322854923336162'
  },
  dataAdSlot: {
    type: String,
    required: true
  }
})

onMounted(() => {
  // 初始化广告（延迟确保脚本加载完成）
  setTimeout(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('Google AdSense error:', e)
    }
  }, 500)
})
</script>