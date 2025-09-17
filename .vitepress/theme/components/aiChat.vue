<template>
  <div class="ai-chat-container">
    <!-- AI按钮 -->
    <button class="ai-chat-button" @click="toggleChat" :class="{ 'active': isOpen }" title="AI Assistant">
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
    <div v-if="isOpen" class="ai-chat-window">
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
          <button class="close-button" @click="closeChat">×</button>
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

          <div v-if="isLoading" class="message ai">
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

          <!-- 验证码组件 -->
          <qCloudCaptcha 
            :app-id="captchaAppId"
            :enabled="enableCaptcha"
            :show="captchaState.isVerifying"
            embed-mode
            global-mode
            @success="onCaptchaSuccess"
            @cancel="onCaptchaCancel"
            @error="onCaptchaError"
            @hide="onCaptchaHide"
          />
          
          <div class="input-container">
            <textarea 
              v-model="inputMessage" 
              @keydown="handleKeydown" 
              :placeholder="captchaState.isVerifying ? '请先完成验证码验证...' : '请输入您关于薄荷配置上的问题...'" 
              rows="1"
              ref="textareaRef"
              :disabled="captchaState.isVerifying">
            </textarea>
            <button @click="sendMessage" :disabled="!inputMessage.trim() || isLoading || captchaState.isVerifying" class="send-button">
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
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'
import qCloudCaptcha from './captcha/qCloudCaptcha.vue'
import gtCaptcha from './captcha/gtCaptcha.vue'
import googleCaptcha from './captcha/googleCaptcha.vue'

/**
  AI聊天组件
  作者: Mintimate
  创建时间: 2025-08-02
  更新时间: 2025-09-11
  描述: 基于RAG知识库的AI聊天助手组件，支持流式响应和思考过程展示，支持使用独立的验证码组件
*/

// 注册组件
const components = {
  qCloudCaptcha,
  gtCaptcha,
  googleCaptcha
}

// Props
const props = defineProps({
  apiUrl: {
    type: String,
    // Refer to: https://github.com/Mintimate/knowledge-maker
    default: 'http://localhost:8082/api/v1/chat/stream'
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
    default: '1234567890', // 需要替换为实际的验证码应用ID
    required: true
  },
  enableCaptcha: {
    type: Boolean,
    default: true // 是否启用验证码验证
  }
})

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
const textareaRef = ref(null)

// 存储对话历史记录，用于上下文联系
const chatHistory = ref([])

// 滚动控制相关
const isUserScrolling = ref(false)
const scrollTimeout = ref(null)

// 验证码相关状态
const captchaState = ref({
  isVerifying: false,
  // 腾讯云验证码字段
  ticket: '',
  randstr: '',
  // 极验验证码字段
  lot_number: '',
  captcha_output: '',
  pass_token: '',
  gen_time: '',
  // Google reCAPTCHA v3 字段
  recaptcha_token: '',
  recaptcha_action: ''
})

// 获取最近的对话历史
const getRecentChatHistory = () => {
  // 只保留最近的maxHistoryTurns轮对话
  return chatHistory.value.slice(-props.maxHistoryTurns * 2) // 每轮包含用户和AI的消息，所以乘以2
}

// 检查是否应该自动滚动到底部
const shouldAutoScroll = () => {
  if (!messagesContainer.value) return false
  const container = messagesContainer.value
  const threshold = 100 // 距离底部100px内认为用户在底部
  return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold
}

// 智能滚动到底部
const smartScrollToBottom = () => {
  if (!isUserScrolling.value && shouldAutoScroll()) {
    scrollToBottom()
  }
}

// 监听用户滚动
const handleScroll = () => {
  isUserScrolling.value = true
  
  // 清除之前的定时器
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  
  // 500ms后认为用户停止滚动
  scrollTimeout.value = setTimeout(() => {
    isUserScrolling.value = false
  }, 500)
}

// 将文本转换为HTML
const convertToHtml = (text) => {
  return md.render(text)
}

// 验证码组件事件处理
const onCaptchaSuccess = (data) => {  
  console.log(data)
  // 根据验证码类型存储不同的数据
  if (data.ticket && data.randstr) {
    // 腾讯云验证码
    captchaState.value.ticket = data.ticket
    captchaState.value.randstr = data.randstr
  } else if (data.lot_number && data.captcha_output && data.pass_token && data.gen_time) {
    // 极验验证码
    captchaState.value.lot_number = data.lot_number
    captchaState.value.captcha_output = data.captcha_output
    captchaState.value.pass_token = data.pass_token
    captchaState.value.gen_time = data.gen_time
  } else if (data.recaptcha_token || (data.token && (data.action || data.version))) {
    // Google reCAPTCHA v2/v3 验证码
    captchaState.value.recaptcha_token = data.recaptcha_token || data.token
    captchaState.value.recaptcha_action = data.recaptcha_action || data.action || 'verify'
  }
  
  captchaState.value.isVerifying = false
  
  // 验证成功后继续发送消息
  proceedWithMessage()
}

const onCaptchaCancel = () => {
  captchaState.value.isVerifying = false
  pendingMessage.value = '' // 清空待发送消息
  // 清空所有验证码相关状态
  captchaState.value.ticket = ''
  captchaState.value.randstr = ''
  captchaState.value.lot_number = ''
  captchaState.value.captcha_output = ''
  captchaState.value.pass_token = ''
  captchaState.value.gen_time = ''
  captchaState.value.recaptcha_token = ''
  captchaState.value.recaptcha_action = ''
  console.log('用户取消了验证码验证')
}

const onCaptchaError = (error) => {
  captchaState.value.isVerifying = false
  pendingMessage.value = '' // 清空待发送消息
  // 清空所有验证码相关状态
  captchaState.value.ticket = ''
  captchaState.value.randstr = ''
  captchaState.value.lot_number = ''
  captchaState.value.captcha_output = ''
  captchaState.value.pass_token = ''
  captchaState.value.gen_time = ''
  captchaState.value.recaptcha_token = ''
  captchaState.value.recaptcha_action = ''
  console.error('验证码验证失败:', error)
}

const onCaptchaHide = () => {
  // 验证码隐藏时的处理
  if (captchaState.value.isVerifying) {
    captchaState.value.isVerifying = false
  }
}

// 触发验证码验证
const triggerCaptcha = async () => {
  if (!props.enableCaptcha) {
    // 如果未启用验证码，直接发送消息
    proceedWithMessage()
    return
  }
  
  // 检查是否已有有效票据（腾讯云、极验或Google reCAPTCHA）
  const hasTencentTicket = captchaState.value.ticket && captchaState.value.randstr
  const hasGeetestTicket = captchaState.value.lot_number && captchaState.value.captcha_output && 
                          captchaState.value.pass_token && captchaState.value.gen_time
  const hasGoogleTicket = captchaState.value.recaptcha_token
  
  if (hasTencentTicket || hasGeetestTicket || hasGoogleTicket) {
    // 如果已有有效票据，直接发送消息
    proceedWithMessage()
    return
  }
  
  // 设置验证状态，这会触发验证码组件显示
  captchaState.value.isVerifying = true
}

// 切换思考内容展开/收起
const toggleThink = (index) => {
  messages.value[index].thinkExpanded = !messages.value[index].thinkExpanded
}

// 初始化欢迎消息和事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 添加欢迎消息到显示列表
  messages.value.push({
    type: 'ai',
    text: props.welcomeMessage,
    html: convertToHtml(props.welcomeMessage),
    timestamp: new Date()
  })
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
      // 添加滚动事件监听器
      if (messagesContainer.value) {
        messagesContainer.value.addEventListener('scroll', handleScroll, { passive: true })
      }
    })
  } else {
    // 移除滚动事件监听器
    if (messagesContainer.value) {
      messagesContainer.value.removeEventListener('scroll', handleScroll)
    }
  }
}

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

const closeChat = () => {
  isOpen.value = false
  
  // 清理验证码相关状态
  if (captchaState.value.isVerifying) {
    captchaState.value.isVerifying = false
    captchaState.value.ticket = ''
    captchaState.value.randstr = ''
    captchaState.value.lot_number = ''
    captchaState.value.captcha_output = ''
    captchaState.value.pass_token = ''
    captchaState.value.gen_time = ''
    captchaState.value.recaptcha_token = ''
    captchaState.value.recaptcha_action = ''
    pendingMessage.value = ''
  }
  
  // 移除滚动事件监听器
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
}

// 点击窗口外部关闭聊天窗口
const handleClickOutside = (event) => {
  // 如果正在验证验证码，不关闭聊天窗口
  if (captchaState.value.isVerifying) {
    return
  }

  
  if (isOpen.value && !event.target.closest('.ai-chat-container')) {
    closeChat()
  }
}



const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // 检查是否是输入法组合状态
    if (event.isComposing || event.keyCode === 229) {
      // 如果是输入法组合状态，不处理发送逻辑
      return
    }
    event.preventDefault()
    sendMessage()
  }
}

// 存储待发送的消息
const pendingMessage = ref('')

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value || captchaState.value.isVerifying) return

  // 保存待发送的消息
  pendingMessage.value = inputMessage.value.trim()
  inputMessage.value = ''

  // 如果启用验证码，先进行验证
  if (props.enableCaptcha) {
    triggerCaptcha()
  } else {
    proceedWithMessage()
  }
}

// 实际发送消息的函数
const proceedWithMessage = async () => {
  if (!pendingMessage.value.trim()) return

  const userMessage = pendingMessage.value.trim()
  pendingMessage.value = '' // 清空待发送消息

  // 添加用户消息
  messages.value.push({
    type: 'user',
    text: userMessage,
    html: convertToHtml(userMessage),
    timestamp: new Date()
  })

  // 添加当前用户消息到历史记录
  chatHistory.value.push({
    role: 'user',
    content: userMessage
  })

  isLoading.value = true

  // 添加AI消息占位符
  const aiMessageIndex = messages.value.length
  messages.value.push({
    type: 'ai',
    text: '',
    html: '',
    timestamp: new Date()
  })

  nextTick(() => {
    smartScrollToBottom()
  })

  try {
    // 获取最近的对话历史
    const recentHistory = getRecentChatHistory()
    
    // 构建请求体
    const requestBody = {
      Query: userMessage,
      History: recentHistory
    }
    
    // 如果启用验证码且有票据，添加到请求中
    if (props.enableCaptcha) {
      // 腾讯云验证码
      if (captchaState.value.ticket && captchaState.value.randstr) {
        requestBody.CaptchaTicket = captchaState.value.ticket
        requestBody.CaptchaRandstr = captchaState.value.randstr
        
        // 发送后清空票据，确保每次都需要重新验证
        captchaState.value.ticket = ''
        captchaState.value.randstr = ''
      }
      // 极验验证码
      else if (captchaState.value.lot_number && captchaState.value.captcha_output && 
               captchaState.value.pass_token && captchaState.value.gen_time) {
        requestBody.lot_number = captchaState.value.lot_number
        requestBody.captcha_output = captchaState.value.captcha_output
        requestBody.pass_token = captchaState.value.pass_token
        requestBody.gen_time = captchaState.value.gen_time
        
        // 发送后清空票据，确保每次都需要重新验证
        captchaState.value.lot_number = ''
        captchaState.value.captcha_output = ''
        captchaState.value.pass_token = ''
        captchaState.value.gen_time = ''
      }
      // Google reCAPTCHA v3 验证码
      else if (captchaState.value.recaptcha_token) {
        requestBody.recaptcha_token = captchaState.value.recaptcha_token
        if (captchaState.value.recaptcha_action) {
          requestBody.recaptcha_action = captchaState.value.recaptcha_action
        }
        
        // 发送后清空票据，确保每次都需要重新验证
        captchaState.value.recaptcha_token = ''
        captchaState.value.recaptcha_action = ''
      }
    }
    
    const response = await fetch(props.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 处理流式响应 (Server-Sent Events格式)
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let accumulatedText = ''
    let buffer = ''
    let thinkContent = ''
    let answerContent = ''
    let isStreamComplete = false

    // 使用异步迭代器处理流式数据
    const processStream = async () => {
      try {
        let result
        while (!(result = await reader.read()).done) {
          const chunk = decoder.decode(result.value, { stream: true })
          buffer += chunk

          // 按行分割处理SSE数据
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // 保留最后一个不完整的行

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine.startsWith('data:')) {
              try {
                // 提取data:后的JSON数据
                const jsonStr = trimmedLine.substring(5).trim()
                if (jsonStr && jsonStr !== '[DONE]' && !jsonStr.includes('"success":true')) {
                  const data = JSON.parse(jsonStr)
                  if (data.content) {
                    accumulatedText += data.content

                    // 提取思考内容
                    const thinkMatch = accumulatedText.match(/<think>([\s\S]*?)(?:<\/think>|$)/)
                    if (thinkMatch) {
                      thinkContent = thinkMatch[1]
                      messages.value[aiMessageIndex].thinkContent = thinkContent
                      messages.value[aiMessageIndex].thinkHtml = convertToHtml(thinkContent)
                    }

                    // 提取回答内容
                    const answerMatch = accumulatedText.match(/<answer>([\s\S]*?)(?:<\/answer>|$)/)
                    if (answerMatch) {
                      answerContent = answerMatch[1]
                      messages.value[aiMessageIndex].text = answerContent
                      messages.value[aiMessageIndex].html = convertToHtml(answerContent)
                    }

                    // 智能滚动到底部
                    nextTick(() => {
                      smartScrollToBottom()
                    })
                  }
                }
              } catch (e) {
                // 忽略JSON解析错误，继续处理下一行
                console.warn('解析SSE数据失败:', trimmedLine, e)
              }
            } else if (trimmedLine.startsWith('event:done')) {
              // 处理完成事件
              isStreamComplete = true
              return // 直接返回，结束处理
            }
          }
        }
      } finally {
        // 确保 reader 被正确关闭
        reader.releaseLock()
      }
    }

    await processStream()

    // 流式响应完成后，如果有思考内容，默认折叠
    if (isStreamComplete && thinkContent.trim()) {
      messages.value[aiMessageIndex].thinkExpanded = false
    }

    // 如果没有收到任何内容，显示默认消息
    if (!answerContent.trim() && !thinkContent.trim() && !accumulatedText.trim()) {
      const defaultMessage = '抱歉，我暂时无法回答这个问题。'
      messages.value[aiMessageIndex].text = defaultMessage
      messages.value[aiMessageIndex].html = convertToHtml(defaultMessage)
      
      // 添加AI回复到历史记录
      chatHistory.value.push({
        role: 'assistant',
        content: defaultMessage
      })
    } else if (!answerContent.trim() && !thinkContent.trim() && accumulatedText.trim()) {
      // 如果有内容但没有标签，显示全部内容（兼容旧格式）
      messages.value[aiMessageIndex].text = accumulatedText
      messages.value[aiMessageIndex].html = convertToHtml(accumulatedText)
      
      // 添加AI回复到历史记录
      chatHistory.value.push({
        role: 'assistant',
        content: accumulatedText
      })
    } else if (answerContent.trim()) {
      // 如果有回答内容，添加到历史记录
      chatHistory.value.push({
        role: 'assistant',
        content: answerContent
      })
    }
    
    // 如果历史记录超过了最大限制的两倍，则裁剪掉最早的对话
    if (chatHistory.value.length > props.maxHistoryTurns * 2 * 2) { // 每轮包含用户和AI的消息，所以乘以2
      chatHistory.value = chatHistory.value.slice(-props.maxHistoryTurns * 2)
    }

  } catch (error) {
    console.error('AI请求失败:', error)
    const errorMessage = '抱歉，连接AI服务失败。请检查网络连接或稍后再试。'
    messages.value[aiMessageIndex].text = errorMessage
    messages.value[aiMessageIndex].html = convertToHtml(errorMessage)
  } finally {
    isLoading.value = false
    nextTick(() => {
      smartScrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* ===== 基础容器 ===== */
.ai-chat-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 1000;
}

/* ===== AI按钮 ===== */
.ai-chat-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-sizing: border-box;
  pointer-events: auto;
}

.ai-chat-button:hover,
.ai-chat-button.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.ai-chat-button.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* ===== 聊天窗口 ===== */
.ai-chat-window {
  position: absolute;
  top: 50px;
  right: 0;
  background: var(--vp-local-search-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  width: 620px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform-origin: top right;
  animation: chatWindowOpen 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes chatWindowOpen {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ===== 聊天头部 ===== */
.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 6px 6px 0 0;
}

.ai-chat-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ai-header-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-header-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}

/* ===== 消息区域 ===== */
.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--vp-c-bg);
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
}

.ai-chat-messages::-webkit-scrollbar {
  width: 4px;
}

.ai-chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.ai-chat-messages::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 2px;
}

.ai-chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* ===== 消息样式 ===== */
.message {
  display: flex;
  max-width: 95%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-content {
  background: var(--vp-c-bg-soft);
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 0;
  word-break: break-word;
}

.message.user .message-content {
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 8px 8px 2px 8px;
}

.message.ai .message-content {
  background: var(--vp-c-bg-mute);
  border-radius: 8px 8px 8px 2px;
}

/* ===== 消息文本 ===== */
.message-text {
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  min-width: 0;
  max-width: 100%;
}

/* 通用元素样式 */
.message-text :deep(h1),
.message-text :deep(h2),
.message-text :deep(h3),
.message-text :deep(h4),
.message-text :deep(h5),
.message-text :deep(h6) {
  margin: 12px 0 8px 0;
  font-weight: 600;
  line-height: 1.25;
  color: var(--vp-c-text-1);
  font-size: 1em;
}

.message-text :deep(h1) {
  font-size: 1.2em;
}

.message-text :deep(h2) {
  font-size: 1.15em;
}

.message-text :deep(h3) {
  font-size: 1.1em;
}

.message-text :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  list-style: outside;
  margin: 8px 0;
  padding-left: 1.2em;
}

.message-text :deep(li) {
  margin: 2px 0;
  line-height: 1.6;
}

/* 代码样式 */
.message-text :deep(pre) {
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  padding: 12px 16px;
  margin: 8px 0;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-code-block-color);
  max-width: 100%;
  box-sizing: border-box;
}

.message-text :deep(pre code) {
  display: block;
  width: 100%;
  font-family: var(--vp-font-family-mono);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
}

.message-text :deep(:not(pre) > code) {
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  border-radius: 4px;
  padding: 3px 6px;
  margin: 0 1px;
  font-size: 0.85em;
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
  word-break: break-word;
}

/* 链接和强调 */
.message-text :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
  word-break: break-all;
}

.message-text :deep(a:hover) {
  color: var(--vp-c-brand-2);
}

.message-text :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.message-text :deep(em) {
  font-style: italic;
  color: var(--vp-c-text-2);
}

/* 引用和表格 */
.message-text :deep(blockquote) {
  margin: 8px 0;
  border-left: 3px solid var(--vp-c-divider);
  padding-left: 12px;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.message-text :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
  font-size: 13px;
}

.message-text :deep(th),
.message-text :deep(td) {
  border: 1px solid var(--vp-c-divider);
  padding: 6px 10px;
  text-align: left;
}

.message-text :deep(th) {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}

.message-text :deep(hr) {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 16px 0;
}

/* 用户消息样式覆盖 */
.message.user .message-text :deep(h1),
.message.user .message-text :deep(h2),
.message.user .message-text :deep(h3),
.message.user .message-text :deep(h4),
.message.user .message-text :deep(h5),
.message.user .message-text :deep(h6),
.message.user .message-text :deep(strong) {
  color: rgba(255, 255, 255, 0.95);
}

.message.user .message-text :deep(:not(pre) > code) {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
}

.message.user .message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.message.user .message-text :deep(a) {
  color: rgba(255, 255, 255, 0.9);
}

.message.user .message-text :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.8);
}

/* ===== 消息时间 ===== */
.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 6px;
}

.message.user .message-time {
  text-align: right;
}

/* ===== 打字指示器 ===== */
.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--vp-c-text-3);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* ===== 思考内容 ===== */
.think-section {
  margin-bottom: 12px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
}

.think-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border-radius: 6px 6px 0 0;
  transition: background-color 0.2s;
  user-select: none;
}

.think-header:hover {
  background: var(--vp-c-gray-soft);
}

.think-icon {
  transition: transform 0.2s ease;
  color: var(--vp-c-text-2);
}

.think-icon.expanded {
  transform: rotate(90deg);
}

.think-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  flex: 1;
}

.think-status {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.think-content {
  padding: 12px;
  border-top: 1px solid var(--vp-c-divider-light);
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border-radius: 0 0 6px 6px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
  overflow: hidden;
}

.think-content :deep(p) {
  margin: 6px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.think-content :deep(code) {
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  word-break: break-all;
  white-space: pre-wrap;
}

.think-content :deep(pre) {
  background: var(--vp-code-block-bg);
  padding: 8px 12px;
  border-radius: 4px;
  margin: 6px 0;
  font-size: 12px;
  overflow-x: auto;
  max-width: 100%;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;
}

.think-content :deep(pre code) {
  white-space: pre-wrap;
  word-break: break-word;
}

/* ===== 输入区域 ===== */
.ai-chat-input {
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 0 0 6px 6px;
}



.input-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-container textarea {
  flex: 1;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  min-height: 36px;
  max-height: 120px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  transition: border-color 0.25s;
}

.input-container textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.input-container textarea::placeholder {
  color: var(--vp-c-text-3);
}

.input-container textarea:disabled {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
}

.input-container textarea:disabled::placeholder {
  color: var(--vp-c-text-3);
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s;
}

.send-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== 响应式设计 ===== */
@media (max-width: 1024px) {
  .ai-chat-window {
    width: 420px;
    height: 550px;
  }
}

@media (max-width: 768px) {
  .ai-chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    height: 70vh;
    border-radius: 12px;
    max-height: 600px;
    z-index: 9999;
    transform-origin: center center;
    animation: chatWindowOpenMobile 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .ai-chat-button {
    width: 32px;
    height: 32px;
  }

  .message {
    max-width: 95%;
  }
}

@media (max-width: 480px) {
  .ai-chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95vw;
    height: 75vh;
    border-radius: 12px;
    max-height: 550px;
    z-index: 9999;
    transform-origin: center center;
    animation: chatWindowOpenMobile 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .ai-chat-button {
    width: 28px;
    height: 28px;
  }
}

/* 移动端专用动画 */
@keyframes chatWindowOpenMobile {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>