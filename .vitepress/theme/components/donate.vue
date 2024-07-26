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
      <span class="title" v-text="
        lang === 'zh' ? '如果认为本文档或者薄荷拼音对你很有帮助，可以请我喝咖啡 ☕' :
            'If you find this document or Oh-my-rime Pinyin useful, you can buy me a coffee ☕'
      "/>
    </summary>
    <p>
      <img style="max-width: 300px;margin: auto;" alt="WebChart Recognise"
           src="../../../public/image/global/recognise.webp">
    </p>

  </details>
</template>

<style scoped>
.dark img {
  -webkit-filter: brightness(0.9);
  filter: brightness(0.9);
  transition: filter 0.2s ease-in-out;
}

img {
  -webkit-filter: brightness(0.95);
  filter: brightness(0.95);
  border-radius: 24px;
}

.title {
  text-decoration: underline;
  text-decoration-color: #41d1ff;
  text-underline-offset: 5px;
  text-decoration-style: wavy;
  margin-left: 5px; /* 添加一些间距 */
}


details {
  transition: max-height 0.8s ease-in-out;
  overflow-y: hidden;
}


details[open] {
  max-height: 380px;
}

details:not([open]) {
  max-height: 100px;
}

</style>