<template>
  <div class="ai-chat-container">
    <!-- AI按钮 -->
    <button class="ai-chat-button" @click="lazyToggleChat" :class="{ 'active': isOpen }" title="AI Assistant">
      <svg t="1754120888533" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4656" width="20" height="20">
        <path d="M0 0h1024v1024H0z" fill="#D4D4D4" fill-opacity="0" p-id="4657"></path>
        <path d="M387.657143 394.971429l-65.828572 160.914285h124.342858l-58.514286-160.914285z" fill="currentColor"
          p-id="4658"></path>
        <path
          d="M658.285714 0H365.714286C160.914286 0 0 160.914286 0 365.714286v292.571428c0 204.8 160.914286 365.714286 365.714286 365.714286h292.571428c204.8 0 365.714286-160.914286 365.714286-365.714286V365.714286c0-204.8-160.914286-365.714286-365.714286-365.714286zM497.371429 694.857143l-29.257143-87.771429H307.2l-36.571429 87.771429h-58.514285l138.971428-365.714286h65.828572l138.971428 365.714286h-58.514285z m153.6 0h-58.514286v-365.714286h51.2v365.714286z m124.342857 0h-51.2v-365.714286h51.2v365.714286z"
          fill="currentColor" p-id="4659"></path>
      </svg>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="ai-chat-window" ref="chatWindowRef" :style="windowStyle">
      <!-- 调整大小手柄 -->
      <div class="resize-handle" @mousedown.prevent="startResize"></div>

        <div class="ai-chat-header">
          <h2 class="ai-header-title">
            <svg t="1754120888533" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="4656" width="20" height="20">
              <path d="M0 0h1024v1024H0z" fill="#D4D4D4" fill-opacity="0" p-id="4657"></path>
              <path d="M387.657143 394.971429l-65.828572 160.914285h124.342858l-58.514286-160.914285z"
                fill="currentColor" p-id="4658"></path>
              <path
                d="M658.285714 0H365.714286C160.914286 0 0 160.914286 0 365.714286v292.571428c0 204.8 160.914286 365.714286 365.714286 365.714286h292.571428c204.8 0 365.714286-160.914286 365.714286-365.714286V365.714286c0-204.8-160.914286-365.714286-365.714286-365.714286zM497.371429 694.857143l-29.257143-87.771429H307.2l-36.571429 87.771429h-58.514285l138.971428-365.714286h65.828572l138.971428 365.714286h-58.514285z m153.6 0h-58.514286v-365.714286h51.2v365.714286z m124.342857 0h-51.2v-365.714286h51.2v365.714286z"
                fill="currentColor" p-id="4659"></path>
            </svg>
            <span>Assistant</span>
          </h2>
          <button class="close-button" @click="handleCloseChat">×</button>
        </div>

        <div class="ai-chat-messages" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="message-content">
              <!-- 思考内容区域 -->
              <div v-if="message.thinkContent" class="think-section">
                <div class="think-header" @click="toggleThink(index)">
                  <svg class="think-icon" :class="{ 'expanded': message.thinkExpanded }" width="12" height="12"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                  <span class="think-label">AI思考过程</span>
                  <span class="think-status">{{ message.thinkExpanded ? '收起' : '展开' }}</span>
                </div>
                <div v-if="message.thinkExpanded" class="think-content" v-html="message.thinkHtml"></div>
              </div>

              <!-- 回答内容区域 -->
              <div class="answer-section">
                <div class="message-text" v-html="message.html"></div>
              </div>

              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <!-- 工具调用状态展示 -->
          <div v-if="toolCallStatus" class="message ai">
            <div class="message-content">
              <div class="tool-call-status">
                <div class="tool-call-step" v-for="(step, idx) in toolCallSteps" :key="idx" :class="{ 'completed': step.completed, 'active': step.active }">
                  <svg v-if="step.completed" class="tool-step-icon completed" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <svg v-else-if="step.active" class="tool-step-icon active spinning" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                  <svg v-else class="tool-step-icon pending" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" opacity="0.3"/>
                  </svg>
                  <span class="tool-step-text">{{ step.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isLoading && !toolCallStatus" class="message ai">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-chat-input">

          <!-- 国际版腾讯云验证码 -->
          <qCloudCaptcha 
            :app-id="captchaAppId"
            :enabled="enableCaptcha"
            :show="captchaState.isVerifying"
            :animation="true"
            global-mode
            @success="handleCaptchaSuccess"
            @cancel="handleCaptchaCancel"
            @error="handleCaptchaError"
            @hide="handleCaptchaHide"
          />

          <div class="input-container">
            <textarea 
              v-model="inputMessage" 
              @keydown="onKeydown" 
              :placeholder="captchaState.isVerifying ? '请先完成验证码验证...' : '请输入您关于薄荷配置上的问题...'" 
              rows="1"
              ref="textareaRef"
              :disabled="captchaState.isVerifying">
            </textarea>
            <button id="rag-send" @click="sendMessage" :disabled="!inputMessage.trim() || isLoading || captchaState.isVerifying" class="send-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import qCloudCaptcha from '../captcha/qCloudCaptcha.vue'
import { useCaptcha } from './composables/useCaptcha'
import { useChat } from './composables/useChat'
import { useMarkdown } from './composables/useMarkdown'
import { useToolCall } from './composables/useToolCall'

/**
  AI聊天组件
  作者: Mintimate
  创建时间: 2025-08-02
  更新时间: 2025-09-11
  描述: 基于RAG知识库的AI聊天助手组件，支持流式响应和思考过程展示，支持使用独立的验证码组件
*/

// Props
const props = defineProps({
  apiUrl: {
    type: String,
    // Refer to: https://github.com/Mintimate/knowledge-maker
    // 聚合接口（保留兼容）
    default: 'http://localhost:9000/api/v1/chat/stream'
  },
  mcpBaseUrl: {
    type: String,
    // MCP 接口基础 URL，用于 Tool Use 模式
    default: 'http://localhost:9000/api/v1/mcp'
  },
  maxHistoryTurns: {
    type: Number,
    default: 3
  },
  welcomeMessage: {
    type: String,
    default: '您好！我是 RAG 知识库检索助手，可以查看项目地址: https://github.com/Mintimate/knowledge-maker'
  },
  captchaAppId: {
    type: String,
    default: '1234567890',
    required: true
  },
  enableCaptcha: {
    type: Boolean,
    default: false
  },
  defaultTools: {
    type: String,
    // 降级工具定义 JSON 字符串，从环境变量 AI_DEFAULT_TOOLS 传入
    default: ''
  }
})

// ==================== 初始化 Composables ====================

const { convertToHtml } = useMarkdown()

const {
  captchaState,
  clearCaptchaFields,
  onCaptchaSuccess,
  onCaptchaCancel,
  onCaptchaError,
  onCaptchaHide,
  triggerCaptcha,
  resetCaptchaVerifying
} = useCaptcha()

const {
  isOpen,
  inputMessage,
  messages,
  isLoading,
  messagesContainer,
  textareaRef,
  pendingMessage,
  getRecentChatHistory,
  scrollToBottom,
  smartScrollToBottom,
  toggleThink,
  addWelcomeMessage,
  addUserMessage,
  addAiMessagePlaceholder,
  addAssistantHistory,
  trimHistory,
  toggleChat,
  closeChat,
  cleanup,
  handleKeydown,
  formatTime
} = useChat(convertToHtml)

const {
  toolCallStatus,
  toolCallSteps,
  setFallbackTools,
  fetchMCPTools,
  executeToolUseFlow,
  resetToolCallState
} = useToolCall(convertToHtml, smartScrollToBottom)

// 初始化降级工具定义
setFallbackTools(props.defaultTools)

// 标记是否已经获取过 MCP 工具列表（懒加载，首次打开聊天窗口时才获取）
let mcpToolsFetched = false

// ==================== 窗口拖拽调整大小 ====================
const chatWindowRef = ref(null)
const windowWidth = ref(null)
const windowHeight = ref(null)

const windowStyle = computed(() => {
  const style = {}
  if (windowWidth.value) style['--chat-width'] = `${windowWidth.value}px`
  if (windowHeight.value) style['--chat-height'] = `${windowHeight.value}px`
  return style
})

let isResizing = false
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

const startResize = (e) => {
  isResizing = true
  startX = e.clientX
  startY = e.clientY
  
  if (chatWindowRef.value) {
    const rect = chatWindowRef.value.getBoundingClientRect()
    startWidth = rect.width
    startHeight = rect.height
  } else {
    startWidth = windowWidth.value || 620
    startHeight = windowHeight.value || 600
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.userSelect = 'none'
}

const handleResize = (e) => {
  if (!isResizing) return
  
  // 向左拖拽宽度增加，向下拖拽高度增加
  const deltaX = startX - e.clientX
  const deltaY = e.clientY - startY
  
  // 限制最小尺寸
  const newWidth = Math.max(320, startWidth + deltaX)
  const newHeight = Math.max(400, startHeight + deltaY)
  
  // 限制最大尺寸（不超过屏幕）
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 40 : 1920
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 100 : 1080
  
  windowWidth.value = Math.min(newWidth, maxWidth)
  windowHeight.value = Math.min(newHeight, maxHeight)
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.userSelect = ''
}

// ==================== 事件处理桥接 ====================

// 验证码事件桥接
const handleCaptchaSuccess = (data) => {
  onCaptchaSuccess(data, proceedWithMessage)
}
const handleCaptchaCancel = () => {
  onCaptchaCancel(pendingMessage)
}
const handleCaptchaError = (error) => {
  onCaptchaError(error, pendingMessage)
}
const handleCaptchaHide = () => {
  onCaptchaHide()
}

// 关闭聊天窗口（含验证码清理）
const handleCloseChat = () => {
  if (captchaState.value.isVerifying) {
    captchaState.value.ticket = ''
    captchaState.value.randstr = ''
    clearCaptchaFields()
    pendingMessage.value = ''
  }
  closeChat()
}

// 延迟获取 MCP 工具列表：覆盖 useChat 的 toggleChat，在首次打开时获取
const originalToggleChat = toggleChat
const lazyToggleChat = () => {
  originalToggleChat()
  if (isOpen.value && !mcpToolsFetched) {
    mcpToolsFetched = true
    fetchMCPTools(props.mcpBaseUrl)
  }
}

// 键盘事件桥接
const onKeydown = (event) => {
  handleKeydown(event, sendMessage)
}

// 点击窗口外部关闭聊天窗口
const handleClickOutside = (event) => {
  if (captchaState.value.isVerifying) {
    return
  }
  if (isOpen.value && !event.target.closest('.ai-chat-container')) {
    handleCloseChat()
  }
}

// ==================== 核心发送逻辑 ====================

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value || captchaState.value.isVerifying) return

  pendingMessage.value = inputMessage.value.trim()
  inputMessage.value = ''

  if (props.enableCaptcha) {
    triggerCaptcha(props.enableCaptcha, proceedWithMessage)
  } else {
    proceedWithMessage()
  }
}

// 实际发送消息的函数（Tool Use 模式）
const proceedWithMessage = async () => {
  if (!pendingMessage.value.trim()) return

  const userMessage = pendingMessage.value.trim()
  pendingMessage.value = ''

  // 添加用户消息
  addUserMessage(userMessage)

  isLoading.value = true

  // 添加 AI 消息占位符
  const aiMessageIndex = addAiMessagePlaceholder()

  // 用户主动发送消息，强制滚动到底部
  nextTick(() => { scrollToBottom() })

  try {
    // 构建 LLM 消息（含历史对话）
    const recentHistory = getRecentChatHistory(props.maxHistoryTurns)
    const llmMessages = [
      ...recentHistory.map(h => ({ role: h.role, content: h.content }))
    ]
    // 确保最后一条是当前用户消息
    if (llmMessages.length === 0 || llmMessages[llmMessages.length - 1].content !== userMessage) {
      llmMessages.push({ role: 'user', content: userMessage })
    }

    // 构建验证码数据（仅在启用验证码时传递）
    const captchaData = props.enableCaptcha ? {
      ticket: captchaState.value.ticket,
      randstr: captchaState.value.randstr,
      lot_number: captchaState.value.lot_number,
      captcha_output: captchaState.value.captcha_output,
      pass_token: captchaState.value.pass_token,
      gen_time: captchaState.value.gen_time,
      recaptcha_token: captchaState.value.recaptcha_token,
      recaptcha_action: captchaState.value.recaptcha_action,
      cf_token: captchaState.value.cf_token
    } : null

    // 执行 Tool Use 完整流程
    await executeToolUseFlow({
      mcpBaseUrl: props.mcpBaseUrl,
      llmMessages,
      aiMessageIndex,
      messages,
      addAssistantHistory,
      captchaData
    })

    // 裁剪历史记录
    trimHistory(props.maxHistoryTurns)

  } catch (error) {
    console.error('AI请求失败:', error)
    resetToolCallState()
    const errorMessage = '抱歉，连接AI服务失败。请检查网络连接或稍后再试。'
    messages.value[aiMessageIndex].text = errorMessage
    messages.value[aiMessageIndex].html = convertToHtml(errorMessage)
  } finally {
    isLoading.value = false
    resetToolCallState()
    resetCaptchaVerifying()
    // 每次交互结束后清除验证码字段，确保下次提问时重新触发验证码验证
    clearCaptchaFields()
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  addWelcomeMessage(props.welcomeMessage)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  cleanup()
})
</script>

<style scoped src="./aiChat.styles.css"></style>
