<script setup>
import { ref } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh'
  }
})

const loading = ref(false)
const error = ref(null)
const fileInput = ref(null)
const uploadSuccess = ref(false)
const isInputEnabled = ref(false)
const isDragging = ref(false) // 新增：拖拽状态

async function handleFile(file) {
  if (!file) return
  
  // 检查文件类型是否为zip
  if (!file.name.endsWith('.zip')) {
    error.value = '请上传ZIP格式的文件'
    isInputEnabled.value = false
    return
  }

  loading.value = true
  error.value = null
  uploadSuccess.value = false
  isInputEnabled.value = false

  try {
    console.log('Loading Rime input:', file)
    const { loadZip } = await import('./resources/fcitx5Online/Fcitx5.js')
    await loadZip(file)
    loading.value = false
    uploadSuccess.value = true
    isInputEnabled.value = true
    setTimeout(() => { uploadSuccess.value = false }, 3000) // Hide success message after 3 seconds
  } catch (err) {
    error.value = '输入法加载失败: ' + err.message
    console.error('Failed to load Rime input:', err)
    loading.value = false
    isInputEnabled.value = false
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  await handleFile(file)
}

function triggerFileInput() {
  fileInput.value.click()
}

// 新增：拖拽相关事件处理
function handleDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer.files[0]
  await handleFile(file)
}
</script>

<template>
  <div class="rime-container">
    <!-- 文件上传区域 -->
    <div 
      class="upload-area" 
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="{ 'dragging': isDragging }"
    >
      <input 
        ref="fileInput"
        type="file" 
        accept=".zip" 
        @change="handleFileUpload"
        style="display: none"
      />
      <p v-text="lang === 'zh' ? '点击上传或拖放Rime输入法方案ZIP文件' : 'Click to upload or drag and drop Rime input ZIP file'"></p>
      <p class="hint" v-text="lang === 'zh' ? '请上传包含输入法方案的ZIP压缩包' : 'Please upload a ZIP file containing the input method package'"></p>
    </div>
    
    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载输入法引擎...</p>
        <p class="hint" v-text="lang === 'zh' ? '加载完成后即可开始输入' : 'After loading is complete, you can start typing'"></p>
      </div>
    </div>
    
    <!-- 成功提示 -->
     <div v-if="uploadSuccess" class="tip custom-block">
      <p class="custom-block-title">TIP</p>
      <div>
        <p v-text="lang === 'zh' ?'ZIP 加载完成，可以在下方尝试输入' : 'ZIP loaded, you can try typing below'"></p>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="danger custom-block">
      <p class="custom-block-title">Error</p>
      <div>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <textarea 
      class="rime-input" 
      :disabled="!isInputEnabled"
      :placeholder="lang === 'zh' ? '请先上传并加载输入法方案' : 'Please upload and load the input method package first'"
    ></textarea>
  </div>
</template>

<style scoped>
.rime-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  padding: 20px 0 0 0;
}

.tip.custom-block {
  padding: 8px 16px;
  background-color: var(--vp-custom-block-tip-bg);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-brand);
  margin: 1rem 0;
}

.custom-block-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand);
}

.title.vp-doc {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: var(--vp-c-brand);
  text-decoration: underline;
}

.upload-area {
  padding: 1.5rem;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}

.upload-area:hover, .upload-area.dragging {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.upload-area p {
  margin: 0;
  color: var(--vp-c-text-1);
}

.upload-area .hint {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  border: 3px solid var(--vp-c-bg-soft);
  border-top: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rime-input {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.25s;
  flex-grow: 1;
}

.rime-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.rime-input:disabled {
  background-color: var(--vp-c-bg-soft);
  cursor: not-allowed;
}
</style>