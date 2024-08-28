<script setup>
import {ref} from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh'
  }
})
let isCollapsed = ref(false)

let toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div>
    <button @click="toggleCollapse"
            class="title vp-doc"
            v-text="lang === 'zh' ? '👉 如果认为本文档或者薄荷输入法(方案)对你很有帮助，可以请我喝咖啡 ☕' :
            'If you find this document or Oh-my-rime Pinyin useful, you can buy me a coffee ☕'
      "/>
    <transition name="bounce">
      <div v-show="isCollapsed" style="text-align: center; padding: 5px">
        <slot name="default">
          <p>
            <img style="max-width: 300px;margin: auto;" alt="WebChart Recognise"
                 src="../../../public/image/global/recognise.webp">
          </p>
        </slot>
        <slot name="link">
          <p style="font-size: smaller" v-if="lang === 'zh'">
            Tips:如果你有爱发电账号，那么也可以访问<a href="https://afdian.com/a/mintimate" target="_blank">爱发电平台</a>
          </p>
          <p style="font-size: smaller" v-else>
            Tips:If you have an Afdian account, you can also visit <a href="https://afdian.com/a/mintimate" target="_blank">Afdian</a>.
          </p>
        </slot>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dark img {
  -webkit-filter: brightness(0.9);
  filter: brightness(0.9);
  transition: filter 0.2s ease-in-out;
}

img {
  border-radius: 24px;
}

.title {
  text-decoration: underline;
  text-decoration-color: #41d1ff;
  text-underline-offset: 5px;
  text-decoration-style: wavy;
  margin-left: 5px; /* 添加一些间距 */
}

.vp-doc button{
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s, opacity 0.25s;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>