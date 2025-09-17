<template>
  <div v-if="isVisible" class="captcha-status">
    <div class="captcha-indicator">
      <svg class="captcha-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
      </svg>
      <span>{{ statusText }}</span>
    </div>
    <div :id="containerId" class="captcha-container"></div>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted, watch } from 'vue'

/**
 * 阿里云验证码组件
 * 作者: Mintimate
 * 创建时间: 2025-09-17
 * 描述: 可复用的阿里云验证码组件，支持弹出式和嵌入式验证码
 */

// Props
const props = defineProps({
  region: {
    type: String,
    required: true,
    default: 'cn',
    validator: (value) => ['cn', 'sgp'].includes(value)
  },
  prefix: {
    type: String,
    required: true,
    default: 'xxxxxx'
  },
  sceneId: {
    type: String,
    required: true,
    default: 'c9h3****'
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
    default: '请完成安全验证...'
  },
  containerId: {
    type: String,
    default: 'aliyun-captcha-container'
  },
  embedMode: {
    type: Boolean,
    default: false
  },
  slideStyle: {
    type: Object,
    default: () => ({
      width: 360,
      height: 40
    })
  },
  language: {
    type: String,
    default: 'cn',
    validator: (value) => ['cn', 'tw', 'en'].includes(value)
  }
})

// Emits
const emit = defineEmits(['success', 'cancel', 'error', 'show', 'hide'])

// 响应式状态
const isVisible = ref(false)
const captchaInstance = ref(null)
const captchaVerifyParam = ref(null)

// DOM就绪检查函数
const waitForDOMReady = async (element, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    // 检查元素是否已渲染且可见
    if (element && element.offsetParent !== null && element.getBoundingClientRect().width > 0) {
      return true
    }
    // 使用requestAnimationFrame等待下一帧
    await new Promise(resolve => requestAnimationFrame(resolve))
  }
  console.warn('DOM元素未能在预期时间内就绪')
  return false
}

// 验证码加载错误处理函数
const captchaLoadErrorCallback = () => {
  console.warn('阿里云验证码JS加载失败，生成容灾票据')

  // 生成容灾票据
  const ticket = 'aliyun_error_' + props.prefix + '_' + Math.floor(new Date().getTime() / 1000)
  const randstr = '@' + Math.random().toString(36).substr(2)

  // 模拟阿里云验证码成功回调格式
  emit('success', {
    captcha_param: {
      ticket: ticket,
      randstr: randstr,
      errorCode: 1001,
      errorMessage: 'jsload_error'
    },
    result: true,
    bizResult: true
  })
  
  hideCaptcha()
}

// 设置阿里云验证码全局配置
const setupAliyunConfig = () => {
  if (typeof window === 'undefined') return

  window.AliyunCaptchaConfig = {
    region: props.region,
    prefix: props.prefix
  }
}

// 业务请求验证回调函数
const captchaVerifyCallback = async (captchaVerifyParam) => {
  try {
    // 存储验证参数，供父组件使用
    captchaVerifyParam.value = captchaVerifyParam

    // 触发success事件，让父组件处理业务验证
    emit('success', {
      captcha_param: captchaVerifyParam,
      result: true
    })

    // 返回验证成功结果
    return {
      captchaResult: true,
      bizResult: true
    }
  } catch (error) {
    console.error('验证码业务验证失败:', error)
    
    emit('error', error)
    
    return {
      captchaResult: false,
      bizResult: false
    }
  }
}

// 业务请求验证结果回调函数
const onBizResultCallback = (bizResult) => {
  console.log('业务验证结果:', bizResult)
  
  if (bizResult === true) {
    // 业务验证成功，隐藏验证码
    hideCaptcha()
  } else {
    // 业务验证失败
    emit('error', {
      message: '业务验证不通过',
      bizResult: bizResult
    })
    hideCaptcha()
  }
}

// 获取验证码实例回调函数
const getInstance = (instance) => {
  captchaInstance.value = instance
}

// 显示验证码
const showCaptcha = async () => {
  if (!props.enabled) {
    // 如果未启用验证码，直接触发成功回调
    emit('success', {
      captcha_param: {
        ticket: 'disabled_' + Date.now(),
        randstr: 'disabled'
      },
      result: true,
      bizResult: true
    })
    return
  }
  
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.warn('服务端环境，跳过验证码验证')
    emit('success', {
      captcha_param: {
        ticket: 'ssr_' + Date.now(),
        randstr: 'ssr'
      },
      result: true,
      bizResult: true
    })
    return
  }
  
  try {
    isVisible.value = true
    emit('show')
    
    // 等待DOM更新完成
    await nextTick()
    
    // 检查验证码容器是否存在
    const captchaContainer = document.getElementById(props.containerId)
    if (!captchaContainer) {
      console.error('验证码容器不存在')
      captchaLoadErrorCallback()
      return
    }
    
    // 清理容器内容
    captchaContainer.innerHTML = ''
    
    // 设置全局配置
    setupAliyunConfig()
    
    // 动态加载验证码脚本
    if (typeof window.initAliyunCaptcha === 'undefined') {
      try {
        await import('./captcha/AliyunCaptcha.js')
      } catch (importError) {
        console.error('阿里云验证码脚本加载失败:', importError)
        captchaLoadErrorCallback()
        return
      }
    }
    
    // 检查 initAliyunCaptcha 是否可用
    if (typeof window.initAliyunCaptcha === 'undefined') {
      console.error('initAliyunCaptcha 未加载')
      captchaLoadErrorCallback()
      return
    }
    
    // 等待DOM完全稳定并确保容器可用
    await waitForDOMReady(captchaContainer)
    
    // 初始化阿里云验证码
    window.initAliyunCaptcha({
      SceneId: props.sceneId,
      mode: props.embedMode ? 'embed' : 'popup',
      element: `#${props.containerId}`,
      captchaVerifyCallback: captchaVerifyCallback,
      onBizResultCallback: onBizResultCallback,
      getInstance: getInstance,
      slideStyle: props.slideStyle,
      language: props.language
    })
    
  } catch (error) {
    console.error('阿里云验证码初始化失败:', error)
    captchaLoadErrorCallback()
  }
}

// 隐藏验证码
const hideCaptcha = () => {
  isVisible.value = false
  emit('hide')
  
  // 清理验证码容器
  const captchaContainer = document.getElementById(props.containerId)
  if (captchaContainer) {
    captchaContainer.innerHTML = ''
  }
  
  // 清理验证码实例
  if (captchaInstance.value) {
    try {
      captchaInstance.value.destroy && captchaInstance.value.destroy()
    } catch (error) {
      console.warn('阿里云验证码实例销毁失败:', error)
    }
    captchaInstance.value = null
  }
  
  // 清理验证参数
  captchaVerifyParam.value = null
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
})
</script>

<style scoped>
/* ===== 验证码状态 ===== */
.captcha-status {
  margin-bottom: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg-soft) 100%);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.3s ease-out;
}

.captcha-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin-bottom: 12px;
}

.captcha-icon {
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

.captcha-container {
  border-radius: 6px;
  overflow: visible;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  animation: fadeInScale 0.4s ease-out 0.1s both;
  max-width: 100%;
  width: fit-content;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>