<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display:inline-block;min-width:220px;height:150px"
      :data-ad-client="dataAdClient"
      :data-ad-slot="dataAdSlot"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

defineProps({
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
  // 确保DOM完全加载
  setTimeout(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, 500)
})
</script>

<style scoped>
</style>