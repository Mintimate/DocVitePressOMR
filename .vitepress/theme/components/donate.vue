<script setup>
const props = defineProps({
  lang: {
    type: String,
    default: 'zh'
  }
})
</script>

<template>
  <details class="details custom-block">
    <summary>
      {{
        lang === 'zh' ? '如果认为本文档或者薄荷拼音对你很有帮助，可以请我喝咖啡 ☕' :
            'If you find this document or Oh-my-rime Pinyin useful, you can buy me a coffee ☕'
      }}
    </summary>
    <p>
      <img style="max-width: 300px;margin: auto;" alt="WebChart Recognise"
           src="../../../public/image/global/recognise.webp">
    </p>

  </details>
</template>

<style scoped>
img {
  -webkit-filter: brightness(0.9);
  filter: brightness(0.9);
  transition: filter 0.2s ease-in-out;
  border-radius: 24px;
}
</style>