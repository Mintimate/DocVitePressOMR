<template>
  <div v-if="isVisible" class="captcha-status" :class="{ 'in-modal': inModal, 'bind-mode': product === 'bind' }">
    <div class="captcha-indicator">
      <svg class="captcha-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
      </svg>
      <span>{{ statusText }}</span>
    </div>
    <!-- bind 模式：不显示 captcha-container -->
    <div v-if="product !== 'bind'"
      :id="containerId" 
      :data-product="product"
      :data-in-modal="inModal"
      class="captcha-container"
    ></div>
    <!-- bind 模式：验证码直接嵌入到外层容器 -->
    <div v-else :id="containerId" style="display: none;"></div>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted, watch } from 'vue'

/**
 * 极验验证码组件
 * 作者: Mintimate
 * 创建时间: 2025-09-12
 * 描述: 可复用的极验验证码组件，支持嵌入式验证码
 */

// Props
const props = defineProps({
  appId: {
    type: String,
    required: true,
    default: 'your_captcha_id'
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
    default: 'gt-captcha-embed'
  },
  language: {
    type: String,
    default: 'zh-cn'
  },
  timeout: {
    type: Number,
    default: 10000
  },
  product: {
    type: String,
    default: 'bind'  // bind, popup, float
  },
  maskBgColor: {
    type: String,
    default: '#0000004d'  // 弹出背景颜色，用于popup和bind类型
  },
  inModal: {
    type: Boolean,
    default: false  // 是否在模态框中使用
  }
})

// Emits
const emit = defineEmits(['success', 'cancel', 'error', 'show', 'hide'])

// 响应式状态
const isVisible = ref(false)
const captchaInstance = ref(null)
const captchaResult = ref(null)

// 验证码成功回调函数
const captchaSuccessCallback = (result) => {
  console.log('极验验证成功:', result)
  captchaResult.value = result
  
  // 检查 result 是否存在以及是否有必要的属性
  if (result && typeof result === 'object') {
    // 发送符合后端期望格式的数据
    emit('success', {
      // 极验验证码的四个必需字段
      lot_number: result.lot_number || '',
      captcha_output: result.captcha_output || '',
      pass_token: result.pass_token || '',
      gen_time: result.gen_time || Math.floor(Date.now() / 1000).toString(),
      // 额外信息
      captcha_id: result.captcha_id || props.appId,
      risk_type: result.risk_type || 'slide'
    })
  } else {
    // 如果 result 为空或无效，使用默认值
    console.warn('验证结果无效，使用默认值:', result)
    emit('success', {
      lot_number: 'default_lot_' + Math.random().toString(36).substr(2),
      captcha_output: 'success_' + Date.now(),
      pass_token: 'default_token_' + Math.random().toString(36).substr(2),
      gen_time: Math.floor(Date.now() / 1000).toString(),
      captcha_id: props.appId,
      risk_type: 'slide'
    })
  }
  hideCaptcha()
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

// 验证码错误回调函数
const captchaErrorCallback = (error) => {
  console.error('极验验证失败:', error)
  emit('error', error)
  
  hideCaptcha()
}

// 验证码关闭回调函数
const captchaCloseCallback = () => {
  console.log('用户关闭了验证码')
  emit('cancel')
  hideCaptcha()
}

// 验证码准备就绪回调函数
const captchaReadyCallback = () => {
  console.log('极验验证码准备就绪')
}

// 验证码加载错误处理函数
const captchaLoadErrorCallback = () => {
  console.warn('极验验证码JS加载失败，生成容灾票据')
  
  // 生成容灾票据
  const result = {
    lot_number: 'terror_lot_' + Math.random().toString(36).substr(2),
    captcha_output: 'terror_output_' + Math.random().toString(36).substr(2),
    pass_token: 'terror_token_' + Math.random().toString(36).substr(2),
    gen_time: Math.floor(Date.now() / 1000).toString(),
    captcha_id: props.appId,
    risk_type: 'slide',
    errorCode: 1001,
    errorMessage: 'jsload_error'
  }
  
  captchaSuccessCallback(result)
}

// 显示验证码
const showCaptcha = async () => {
  if (!props.enabled) {
    // 如果未启用验证码，直接触发成功回调
    emit('success', {
      lot_number: 'disabled',
      captcha_output: 'disabled_' + Date.now(),
      pass_token: 'disabled',
      gen_time: Math.floor(Date.now() / 1000).toString(),
      captcha_id: props.appId,
      risk_type: 'slide'
    })
    return
  }
  
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.warn('服务端环境，跳过验证码验证')
    emit('success', {
      lot_number: 'ssr',
      captcha_output: 'ssr_' + Date.now(),
      pass_token: 'ssr',
      gen_time: Math.floor(Date.now() / 1000).toString(),
      captcha_id: props.appId,
      risk_type: 'slide'
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
    if (captchaContainer) {
      captchaContainer.innerHTML = ''
    }
    
    // 动态加载极验验证码脚本
    if (typeof window.initGeetest4 === 'undefined') {
      try {
        await import('./resources/captcha/gt4.js')
      } catch (importError) {
        console.error('极验验证码脚本加载失败:', importError)
        captchaLoadErrorCallback()
        return
      }
    }
    
    // 检查 initGeetest4 是否可用
    if (typeof window.initGeetest4 === 'undefined') {
      console.error('initGeetest4 未加载')
      captchaLoadErrorCallback()
      return
    }
    
    // 等待DOM完全稳定并确保容器可用
    await waitForDOMReady(captchaContainer)
    
    // 准备初始化配置
    const initConfig = {
      captchaId: props.appId,
      product: props.product,
      language: props.language,
      timeout: props.timeout,
      riskType: 'slide'
    }
    
    // 为 popup 和 bind 类型添加 mask 配置
    if (props.product === 'popup' || props.product === 'bind') {
      initConfig.mask = {
        bgColor: props.maskBgColor
      }
    }
    
    // 初始化极验验证码
    window.initGeetest4(initConfig, (captcha) => {
      captchaInstance.value = captcha
      
      // 绑定事件监听器
      captcha.onReady(() => {
        captchaReadyCallback()
      })
      
      captcha.onSuccess(() => {
        // 极验4.0需要通过 getValidate() 方法获取验证结果
        try {
          const result = captcha.getValidate()
          captchaSuccessCallback(result)
        } catch (error) {
          console.error('获取验证结果失败:', error)
          captchaSuccessCallback(null)
        }
      })
      
      captcha.onError((error) => {
        captchaErrorCallback(error)
      })
      
      captcha.onClose(() => {
        captchaCloseCallback()
      })
      
      if (props.product === 'bind') {
        // bind 模式：直接将验证码嵌入到状态容器中，不使用 captcha-container
        const statusContainer = captchaContainer.parentElement
        captcha.appendTo(statusContainer)
        // bind 模式可能需要手动触发显示
        setTimeout(() => {
          if (captcha.showBox) {
            captcha.showBox()
          }
        }, 100)
      } else {
        // popup 和 float 模式：将按钮插入到容器中
        captcha.appendTo(captchaContainer)
      }
    })
    
  } catch (error) {
    console.error('极验验证码初始化失败:', error)
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
      console.warn('极验验证码实例销毁失败:', error)
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

// 暴露方法给父组件
defineExpose({
  showCaptcha,
  hideCaptcha,
  getCaptchaResult: () => captchaResult.value
})
</script>

<style scoped>
/* ===== 验证码状态 ===== */
.captcha-status {
  margin-bottom: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.3s ease-out;
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

/* ===== 验证码容器 ===== */

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

/* 响应式设计 */
@media (max-width: 768px) {
  .captcha-container {
    max-width: 100%;
  }
  
  .captcha-container :deep(.geetest_holder) {
    max-width: 100%;
  }
}
</style>