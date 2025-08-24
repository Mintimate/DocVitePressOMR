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
    <div v-if="isOpen" class="ai-chat-modal" @click="closeChat">
      <div class="ai-chat-window" @click.stop>
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
          <div class="input-container">
            <textarea v-model="inputMessage" @keydown="handleKeydown" placeholder="请输入您关于薄荷配置上的问题..." rows="1"
              ref="textareaRef"></textarea>
            <button @click="sendMessage" :disabled="!inputMessage.trim() || isLoading" class="send-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import MarkdownIt from 'markdown-it'

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

// 切换思考内容展开/收起
const toggleThink = (index) => {
  messages.value[index].thinkExpanded = !messages.value[index].thinkExpanded
}

// 初始化欢迎消息
onMounted(() => {
  const welcomeText = '您好！我是薄荷输入法 AI助手 ，可以帮您解答关于薄荷输入法的各种问题。请随时向我提问！<br/> ' +
                      '内容基于`向量化的知识库` 和 `DeepSeek RAG检索`，不保证正确性，请自行判断 😊… <br/><br/> ' + 
                      '你可能会喜欢 🤔 : [oh-my-rime](https://github.com/Mintimate/oh-my-rime)、[Mintimate\'s Blog](https://www.mintimate.cn)、[Bilibili](https://space.bilibili.com/355567627)'
  
  // 添加欢迎消息到显示列表
  messages.value.push({
    type: 'ai',
    text: welcomeText,
    html: convertToHtml(welcomeText),
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
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

const closeChat = () => {
  isOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()

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

  inputMessage.value = ''
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
    
    const response = await fetch(props.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        Query: userMessage,
        History: recentHistory
      })
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
}

/* ===== AI按钮 ===== */
.ai-chat-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: #00d4aa;
  background: transparent;
  border: none;
  border-radius: 6px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  pointer-events: auto;
}

.ai-chat-button:hover,
.ai-chat-button.active {
  color: #00b894;
  transform: scale(1.1);
  filter: drop-shadow(0 2px 8px rgba(0, 212, 170, 0.3));
}

.ai-chat-button.active {
  transform: scale(1.05);
  filter: drop-shadow(0 2px 8px rgba(0, 212, 170, 0.4));
}

/* ===== 聊天模态框 ===== */
.ai-chat-modal {
  position: fixed;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  padding: 60px 20px 20px;
}

.ai-chat-window {
  background: var(--vp-local-search-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  width: 100%;
  max-width: 800px;
  height: 70vh;
  max-height: 85hv;
  display: flex;
  flex-direction: column;
  box-shadow: var(--vp-shadow-3);
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
@media (max-width: 768px) {
  .ai-chat-modal {
    padding: 20px 10px 10px;
  }

  .ai-chat-window {
    height: 85vh;
    max-height: none;
  }

  .ai-chat-button {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .message {
    max-width: 95%;
  }
}
</style>