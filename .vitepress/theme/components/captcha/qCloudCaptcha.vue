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
 * 腾讯云天御验证码组件
 * 作者: Mintimate
 * 创建时间: 2025-09-11
 * 描述: 可复用的腾讯云验证码组件，支持嵌入式验证码
 */

// Props
const props = defineProps({
  appId: {
    type: String,
    required: true,
    default: '1234567890'
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
    default: 'captcha-container'
  },
  embedMode: {
    type: Boolean,
    default: false
  },
  globalMode: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['success', 'cancel', 'error', 'show', 'hide'])

// 响应式状态
const isVisible = ref(false)
const captchaInstance = ref(null)
const captchaTicket = ref('')
const captchaRandstr = ref('')

// 验证码回调函数
const captchaCallback = (res) => {
  
  if (res.ret === 0) {
    // 验证成功，存储票据信息
    captchaTicket.value = res.ticket
    captchaRandstr.value = res.randstr
    
    emit('success', {
      ticket: res.ticket,
      randstr: res.randstr
    })
    hideCaptcha()
  } else if (res.ret === 2) {
    // 用户主动关闭验证码
    emit('cancel')
    hideCaptcha()
  } else {
    // 其他错误
    emit('error', res)
    hideCaptcha()
  }
}

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
  console.warn('验证码JS加载失败，生成容灾票据')

  // 生成容灾票据
  const ticket = 'terror_1001_' + props.appId + '_' + Math.floor(new Date().getTime() / 1000)
  const randstr = '@' + Math.random().toString(36).substr(2)

  captchaCallback({
    ret: 0,
    randstr: randstr,
    ticket: ticket,
    errorCode: 1001,
    errorMessage: 'jsload_error'
  })
}

// 显示验证码
const showCaptcha = async () => {
  if (!props.enabled) {
    // 如果未启用验证码，直接触发成功回调
    emit('success', {
      ticket: 'disabled_' + Date.now(),
      randstr: 'disabled'
    })
    return
  }
  
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.warn('服务端环境，跳过验证码验证')
    emit('success', {
      ticket: 'ssr_' + Date.now(),
      randstr: 'ssr'
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
    
    // 动态加载验证码脚本
    if (typeof window.TencentCaptcha === 'undefined') {
      try {
        if (!props.globalMode) {
          // 加载国内版本
          await import('./captcha/TCaptcha.js')
        } else {
          // 加载国外版本
          await import('./captcha/TCaptchaGlobal.js')
        }
      } catch (importError) {
        console.error('验证码脚本加载失败:', importError)
        captchaLoadErrorCallback()
        return
      }
    }
    
    // 检查 TencentCaptcha 是否可用
    if (typeof window.TencentCaptcha === 'undefined') {
      console.error('TencentCaptcha 未加载')
      captchaLoadErrorCallback()
      return
    }
    
    // 等待DOM完全稳定并确保容器可用
    await waitForDOMReady(captchaContainer)
    
    // 创建验证码实例
    captchaInstance.value = new window.TencentCaptcha(captchaContainer, props.appId, captchaCallback, {
        type: props.embedMode ? 'embed' : 'popup'
    })
    
    // 显示验证码
    captchaInstance.value.show()
  } catch (error) {
    console.error('验证码初始化失败:', error)
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
      console.warn('验证码实例销毁失败:', error)
    }
    captchaInstance.value = null
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