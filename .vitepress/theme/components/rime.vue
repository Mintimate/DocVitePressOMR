<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // 动态导入模块
    const { loadZip } = await import('./resources/fcitx5Online/Fcitx5.js')
    
    // 加载zip文件,不再显示进度
    await loadZip('/resources/fcitx5Online/rime-mint.zip')
    
    loading.value = false
  } catch (err) {
    error.value = '输入法加载失败: ' + err.message
    console.error('Failed to load Rime input:', err)
  }
})
</script>

<template>
  <div class="rime-container">
    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载输入法引擎...</p>
        <p class="hint">加载完成后即可开始输入</p>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 输入区域 -->
    <textarea 
      class="rime-input" 
      :disabled="loading"
      placeholder="输入法加载完成后即可开始输入"
    ></textarea>
  </div>
</template>

<style scoped>
.rime-container {
  position: relative;
  width: 100%;
  margin: 1rem 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--vp-c-bg), 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
  backdrop-filter: blur(2px);
}

.loading-content {
  text-align: center;
  max-width: 80%;
  color: var(--vp-c-text-1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid var(--vp-c-brand-soft);
  border-top: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hint {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.error-message {
  color: var(--vp-c-danger-1);
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-danger-soft);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.rime-input {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
  line-height: 1.5;
  transition: border-color 0.25s, background-color 0.25s;
}

.rime-input:disabled {
  background-color: var(--vp-c-bg-alt);
  cursor: not-allowed;
}

.rime-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.rime-input::placeholder {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}
</style>