<template>
  <div v-if="isVisible" class="captcha-status" :class="{ 'in-modal': inModal }">
    <div class="captcha-indicator">
      <svg class="captcha-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
      </svg>
      <span>{{ currentStatusText }}</span>
    </div>
    
    <!-- reCAPTCHA v2 可见容器 -->
    <div v-if="version === 'v2'" class="recaptcha-container">
      <div :id="recaptchaElementId" class="recaptcha-element"></div>
    </div>
    
    <!-- reCAPTCHA v3 进度显示 -->
    <div v-if="version === 'v3' && showProgress" class="captcha-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-text">{{ progressText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted, watch, computed } from 'vue'

/**
 * Google reCAPTCHA v2/v3 验证码组件
 * 作者: Mintimate
 * 创建时间: 2025-09-13
 * 描述: 可复用的 Google reCAPTCHA 验证码组件，支持 v2 可见验证和 v3 无感验证
 * 参考文档: 
 * - v2: https://developers.google.com/recaptcha/docs/display
 * - v3: https://developers.google.com/recaptcha/docs/v3
 */

// Props
const props = defineProps({
  appId: {
    type: String,
    required: true,
    default: 'your_recaptcha_site_key'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: false
  },
  statusText: {
    type: String,
    default: '正在进行安全验证...'
  },
  version: {
    type: String,
    default: 'v2',  // 'v2' 或 'v3'
    validator: (value) => ['v2', 'v3'].includes(value)
  },
  action: {
    type: String,
    default: 'submit'  // reCAPTCHA v3 需要指定动作名称
  },
  minScore: {
    type: Number,
    default: 0.5  // 最小可接受分数 (0.0-1.0)，仅 v3 使用
  },
  timeout: {
    type: Number,
    default: 10000
  },
  language: {
    type: String,
    default: 'zh-CN'  // 支持的语言代码
  },
  inModal: {
    type: Boolean,
    default: false  // 是否在模态框中使用
  },
  autoExecute: {
    type: Boolean,
    default: true  // 是否自动执行验证
  },
  theme: {
    type: String,
    default: 'light',  // 'light' 或 'dark'，仅 v2 使用
    validator: (value) => ['light', 'dark'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',  // 'normal' 或 'compact'，仅 v2 使用
    validator: (value) => ['normal', 'compact'].includes(value)
  }
})

// Emits
const emit = defineEmits(['success', 'cancel', 'error', 'show', 'hide', 'ready'])

// 响应式状态
const isVisible = ref(false)
const isReady = ref(false)
const isExecuting = ref(false)
const captchaResult = ref(null)
const progress = ref(0)
const showProgress = ref(false)
const progressText = ref('')

// reCAPTCHA v2 相关状态
const recaptchaElementId = ref(`recaptcha-${Date.now()}-${Math.random().toString(36).substr(2)}`)
const widgetId = ref(null)
const callbackName = ref(`onloadCallback_${Date.now()}_${Math.random().toString(36).substr(2)}`)

// 计算属性
const currentStatusText = computed(() => {
  if (isExecuting.value) {
    return props.version === 'v2' ? '请完成验证...' : '正在验证中...'
  }
  return props.statusText
})

// reCAPTCHA 脚本加载状态
let scriptLoaded = false
let scriptLoading = false

// reCAPTCHA v2 回调函数
const onRecaptchaV2Success = (token) => {
  console.log('reCAPTCHA v2 验证成功:', token)
  
  const result = {
    // Google reCAPTCHA v2 字段
    token: token,
    success: true,
    challenge_ts: new Date().toISOString(),
    version: 'v2',
    
    // 兼容字段
    recaptcha_token: token,
    recaptcha_action: 'verify'
  }
  
  captchaResult.value = result
  isExecuting.value = false
  emit('success', result)
  
  // 注意：v2 验证成功后不自动隐藏，让用户看到验证结果
}

const onRecaptchaV2Expired = () => {
  console.warn('reCAPTCHA v2 验证过期')
  
  const result = {
    token: null,
    success: false,
    error: 'Token expired',
    challenge_ts: new Date().toISOString(),
    errorCode: 'expired',
    version: 'v2',
    
    // 兼容字段
    recaptcha_token: null,
    recaptcha_action: 'verify'
  }
  
  isExecuting.value = false
  emit('error', result)
}

const onRecaptchaV2Error = (error) => {
  console.error('reCAPTCHA v2 验证失败:', error)
  
  const result = {
    token: null,
    success: false,
    error: 'Verification failed',
    challenge_ts: new Date().toISOString(),
    errorCode: 'verification_failed',
    version: 'v2',
    
    // 兼容字段
    recaptcha_token: null,
    recaptcha_action: 'verify'
  }
  
  isExecuting.value = false
  emit('error', result)
}

// 加载 reCAPTCHA 脚本
const loadRecaptchaScript = () => {
  return new Promise((resolve, reject) => {
    // 如果已经加载，直接返回
    if (scriptLoaded && window.grecaptcha) {
      resolve(window.grecaptcha)
      return
    }
    
    // 如果正在加载，等待加载完成
    if (scriptLoading) {
      const checkLoaded = () => {
        if (scriptLoaded && window.grecaptcha) {
          resolve(window.grecaptcha)
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }
    
    scriptLoading = true
    
    // 创建脚本标签
    const script = document.createElement('script')
    
    // 根据版本选择不同的加载方式
    if (props.version === 'v3') {
      // v3 使用 render 参数
      script.src = `https://www.google.com/recaptcha/api.js?render=${props.appId}&hl=${props.language}`
      
      script.onload = () => {
        scriptLoaded = true
        scriptLoading = false
        
        // 等待 grecaptcha 对象可用
        const waitForGrecaptcha = () => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              resolve(window.grecaptcha)
            })
          } else {
            setTimeout(waitForGrecaptcha, 100)
          }
        }
        waitForGrecaptcha()
      }
    } else {
      // v2 使用标准加载方式，按照官方示例设置回调函数
      script.src = `https://www.google.com/recaptcha/api.js?onload=${callbackName.value}&render=explicit&hl=${props.language}`
      
      // 为 v2 设置全局回调函数，使用唯一名称避免冲突
      window[callbackName.value] = () => {
        scriptLoaded = true
        scriptLoading = false
        resolve(window.grecaptcha)
        // 清理全局回调函数
        delete window[callbackName.value]
      }
    }
    
    script.async = true
    script.defer = true
    
    script.onerror = () => {
      scriptLoading = false
      // 清理可能的全局回调函数
      if (props.version === 'v2' && window[callbackName.value]) {
        delete window[callbackName.value]
      }
      reject(new Error('Failed to load reCAPTCHA script'))
    }
    
    // 添加到页面
    document.head.appendChild(script)
  })
}

// 渲染 reCAPTCHA v2 组件
const renderRecaptchaV2 = async () => {
  try {
    const grecaptcha = await loadRecaptchaScript()
    
    // 等待 DOM 元素可用
    await nextTick()
    
    const element = document.getElementById(recaptchaElementId.value)
    if (!element) {
      throw new Error('reCAPTCHA container element not found')
    }
    
    // 渲染 reCAPTCHA v2 组件
    widgetId.value = grecaptcha.render(recaptchaElementId.value, {
      sitekey: props.appId,
      theme: props.theme,
      size: props.size,
      callback: onRecaptchaV2Success,
      'expired-callback': onRecaptchaV2Expired,
      'error-callback': onRecaptchaV2Error
    })
    
    if (!isReady.value) {
      isReady.value = true
      emit('ready')
    }    
  } catch (error) {
    console.error('reCAPTCHA v2 渲染失败:', error)
    captchaLoadErrorCallback()
  }
}

// 执行 reCAPTCHA 验证
const executeRecaptcha = async () => {
  if (!props.enabled) {
    // 如果未启用验证码，直接触发成功回调
    emit('success', {
      token: 'disabled_' + Date.now(),
      score: 1.0,
      action: props.action,
      success: true,
      challenge_ts: new Date().toISOString()
    })
    return
  }
  
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.warn('服务端环境，跳过验证码验证')
    emit('success', {
      token: 'ssr_' + Date.now(),
      score: 1.0,
      action: props.action,
      success: true,
      challenge_ts: new Date().toISOString()
    })
    return
  }
  
  try {
    isExecuting.value = true
    
    if (props.version === 'v2') {
      // reCAPTCHA v2 - 渲染可见的验证组件
      await renderRecaptchaV2()
      // v2 的验证结果由回调函数处理，这里不需要继续执行
      // 注意：不要设置 isExecuting.value = false，让用户看到"请完成验证..."状态
      return
    } else {
      // reCAPTCHA v3 - 无感验证
      showProgress.value = true
      progress.value = 0
      progressText.value = '加载验证组件...'
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (progress.value < 70) {
          progress.value += Math.random() * 10
          if (progress.value < 30) {
            progressText.value = '连接 Google 服务...'
          } else if (progress.value < 60) {
            progressText.value = '分析用户行为...'
          } else {
            progressText.value = '生成安全令牌...'
          }
        }
      }, 200)
      
      // 加载 reCAPTCHA 脚本
      const grecaptcha = await loadRecaptchaScript()
      
      if (!isReady.value) {
        isReady.value = true
        emit('ready')
      }
      
      progress.value = 80
      progressText.value = '执行验证...'
      
      // 执行 reCAPTCHA v3 验证
      const token = await grecaptcha.execute(props.appId, { action: props.action })
      
      progress.value = 100
      progressText.value = '验证完成'
      
      clearInterval(progressInterval)
      
      // 验证成功，构造结果 - 适配 aiChat.vue 的回调格式
      const result = {
        // Google reCAPTCHA v3 特有字段
        token: token,
        action: props.action,
        success: true,
        challenge_ts: new Date().toISOString(),
        score: null,  // 分数需要后端验证
        version: 'v3',
        
        // 为了兼容现有代码，也提供类似其他验证码的字段格式
        // 这样 aiChat.vue 可以统一处理不同类型的验证码
        recaptcha_token: token,
        recaptcha_action: props.action
      }
      
      captchaResult.value = result
      
      setTimeout(() => {
        showProgress.value = false
        emit('success', result)
        hideCaptcha()
      }, 500)
    }
    
  } catch (error) {
    console.error('reCAPTCHA 验证失败:', error)
    
    // 生成容灾令牌
    const errorResult = {
      token: 'error_' + Date.now() + '_' + Math.random().toString(36).substr(2),
      action: props.action,
      success: false,
      error: error.message,
      challenge_ts: new Date().toISOString(),
      errorCode: error.code || 'unknown_error',
      version: props.version,
      
      // 兼容字段
      recaptcha_token: 'error_' + Date.now() + '_' + Math.random().toString(36).substr(2),
      recaptcha_action: props.action
    }
    
    showProgress.value = false
    emit('error', errorResult)
    hideCaptcha()
  } finally {
    if (props.version === 'v3') {
      isExecuting.value = false
    }
    // v2 的 isExecuting 由回调函数处理
  }
}

// 验证码加载错误处理函数
const captchaLoadErrorCallback = () => {
  console.warn('reCAPTCHA 加载失败，生成容灾令牌')
  
  // 生成容灾令牌
  const result = {
    token: 'fallback_' + Date.now() + '_' + Math.random().toString(36).substr(2),
    action: props.action,
    success: false,
    error: 'Script load failed',
    challenge_ts: new Date().toISOString(),
    errorCode: 'script_load_error',
    version: props.version,
    
    // 兼容字段
    recaptcha_token: 'fallback_' + Date.now() + '_' + Math.random().toString(36).substr(2),
    recaptcha_action: props.action
  }
  
  emit('error', result)
  hideCaptcha()
}

// 显示验证码
const showCaptcha = async () => {
  try {
    isVisible.value = true
    emit('show')
    
    // 等待DOM更新完成
    await nextTick()
    
    if (props.autoExecute) {
      // 自动执行验证
      await executeRecaptcha()
    }
    
  } catch (error) {
    console.error('reCAPTCHA 初始化失败:', error)
    captchaLoadErrorCallback()
  }
}

// 隐藏验证码
const hideCaptcha = () => {
  isVisible.value = false
  isExecuting.value = false
  showProgress.value = false
  progress.value = 0
  emit('hide')
}

// 手动执行验证（供外部调用）
const execute = async () => {
  if (!isVisible.value) {
    await showCaptcha()
  } else {
    await executeRecaptcha()
  }
}

// 重置验证状态
const reset = () => {
  captchaResult.value = null
  isExecuting.value = false
  showProgress.value = false
  progress.value = 0
  
  // 重置 reCAPTCHA v2 组件
  if (props.version === 'v2' && widgetId.value !== null && window.grecaptcha) {
    try {
      window.grecaptcha.reset(widgetId.value)
    } catch (error) {
      console.warn('重置 reCAPTCHA v2 失败:', error)
    }
  }
}

// 监听 show prop 变化
watch(() => props.show, (newValue) => {
  if (newValue) {
    showCaptcha()
  } else {
    hideCaptcha()
  }
}, { immediate: true })

// 组件卸载时清理
onUnmounted(() => {
  hideCaptcha()
  // 清理可能残留的全局回调函数
  if (window[callbackName.value]) {
    delete window[callbackName.value]
  }
})

// 暴露方法给父组件
defineExpose({
  showCaptcha,
  hideCaptcha,
  execute,
  reset,
  getCaptchaResult: () => captchaResult.value,
  isReady: () => isReady.value
})
</script>

<style scoped>
/* ===== 验证码状态 ===== */
.captcha-status {
  margin-bottom: 8px;
  padding: 12px 16px;
  background: rgba(66, 133, 244, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.1);
  animation: slideInUp 0.3s ease-out;
}

.captcha-status.in-modal {
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(66, 133, 244, 0.15);
}

.captcha-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4285f4;
  font-weight: 500;
  margin-bottom: 8px;
}

.captcha-icon {
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

/* ===== reCAPTCHA v2 容器 ===== */
.recaptcha-container {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 78px; /* 为 reCAPTCHA v2 预留空间 */
}

.recaptcha-element {
  transform-origin: center;
  transition: transform 0.3s ease;
}

/* 响应式缩放 reCAPTCHA v2 */
@media (max-width: 320px) {
  .recaptcha-element {
    transform: scale(0.77);
  }
}

@media (max-width: 480px) and (min-width: 321px) {
  .recaptcha-element {
    transform: scale(0.85);
  }
}

/* ===== 进度条 ===== */
.captcha-progress {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4285f4 0%, #34a853 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
  animation: shimmer 2s infinite;
}

.progress-text {
  font-size: 12px;
  color: #5f6368;
  text-align: center;
}

/* ===== 动画效果 ===== */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.progress-fill {
  background: linear-gradient(
    90deg,
    #4285f4 0%,
    #34a853 25%,
    #fbbc04 50%,
    #ea4335 75%,
    #4285f4 100%
  );
  background-size: 200px 100%;
  animation: shimmer 2s infinite linear;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .captcha-status {
    padding: 10px 12px;
    font-size: 12px;
  }
  
  .captcha-indicator {
    gap: 6px;
  }
  
  .progress-text {
    font-size: 11px;
  }
}

/* ===== 深色模式适配 ===== */
@media (prefers-color-scheme: dark) {
  .captcha-status {
    background: rgba(66, 133, 244, 0.15);
    border-color: rgba(66, 133, 244, 0.3);
  }
  
  .progress-text {
    color: #9aa0a6;
  }
  
  .progress-bar {
    background: rgba(66, 133, 244, 0.2);
  }
}

/* ===== VitePress 主题适配 ===== */
.dark .captcha-status {
  background: rgba(66, 133, 244, 0.15);
  border-color: rgba(66, 133, 244, 0.3);
}

.dark .progress-text {
  color: var(--vp-c-text-2);
}

.dark .progress-bar {
  background: rgba(66, 133, 244, 0.2);
}
</style>