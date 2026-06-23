import { nextTick, ref } from 'vue'

/**
 * 聊天核心逻辑 composable
 * 封装消息管理、历史记录、滚动控制等基础聊天功能
 */
export function useChat(convertToHtml) {
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

  // 存储待发送的消息
  const pendingMessage = ref('')

  /**
   * 获取最近的对话历史
   * @param {number} maxHistoryTurns - 最大历史轮数
   * @returns {Array} 最近的对话历史
   */
  const getRecentChatHistory = (maxHistoryTurns) => {
    return chatHistory.value.slice(-maxHistoryTurns * 2)
  }

  /**
   * 检查是否应该自动滚动到底部
   */
  const shouldAutoScroll = () => {
    if (!messagesContainer.value) return false
    const container = messagesContainer.value
    const threshold = 100
    return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }

  /**
   * 智能滚动到底部（仅在用户未手动滚动且接近底部时自动滚动）
   */
  const smartScrollToBottom = (force = false) => {
    if (force || (!isUserScrolling.value && shouldAutoScroll())) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  }

  /**
   * 处理用户滚动事件
   */
  const handleScroll = () => {
    isUserScrolling.value = true
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
    scrollTimeout.value = setTimeout(() => {
      isUserScrolling.value = false
    }, 500)
  }

  /**
   * 切换思考内容展开/收起
   * @param {number} index - 消息索引
   */
  const toggleThink = (index) => {
    messages.value[index].thinkExpanded = !messages.value[index].thinkExpanded
  }

  /**
   * 添加欢迎消息
   * @param {string} welcomeMessage - 欢迎消息文本
   */
  const addWelcomeMessage = (welcomeMessage) => {
    messages.value.push({
      type: 'ai',
      text: welcomeMessage,
      html: convertToHtml(welcomeMessage),
      timestamp: new Date()
    })
  }

  /**
   * 添加用户消息
   * @param {string} userMessage - 用户消息文本
   */
  const addUserMessage = (userMessage) => {
    messages.value.push({
      type: 'user',
      text: userMessage,
      html: convertToHtml(userMessage),
      timestamp: new Date()
    })
    chatHistory.value.push({
      role: 'user',
      content: userMessage
    })
  }

  /**
   * 添加 AI 消息占位符
   * @returns {number} 新增消息的索引
   */
  const addAiMessagePlaceholder = () => {
    const index = messages.value.length
    messages.value.push({
      type: 'ai',
      text: '',
      html: '',
      timestamp: new Date()
    })
    return index
  }

  /**
   * 将 AI 回答内容添加到历史记录
   * @param {string} content - AI 回答内容
   */
  const addAssistantHistory = (content) => {
    chatHistory.value.push({ role: 'assistant', content })
  }

  /**
   * 裁剪历史记录
   * @param {number} maxHistoryTurns - 最大历史轮数
   */
  const trimHistory = (maxHistoryTurns) => {
    if (chatHistory.value.length > maxHistoryTurns * 2 * 2) {
      chatHistory.value = chatHistory.value.slice(-maxHistoryTurns * 2)
    }
  }

  /**
   * 切换聊天窗口打开/关闭
   */
  const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      nextTick(() => {
        scrollToBottom()
        if (textareaRef.value) {
          textareaRef.value.focus()
        }
        if (messagesContainer.value) {
          messagesContainer.value.addEventListener('scroll', handleScroll, { passive: true })
        }
      })
    } else {
      if (messagesContainer.value) {
        messagesContainer.value.removeEventListener('scroll', handleScroll)
      }
    }
  }

  /**
   * 关闭聊天窗口
   */
  const closeChat = () => {
    isOpen.value = false
    if (messagesContainer.value) {
      messagesContainer.value.removeEventListener('scroll', handleScroll)
    }
  }

  /**
   * 清理滚动监听器和定时器
   */
  const cleanup = () => {
    if (messagesContainer.value) {
      messagesContainer.value.removeEventListener('scroll', handleScroll)
    }
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  }

  /**
   * 处理键盘事件（Enter 发送）
   * @param {KeyboardEvent} event
   * @param {Function} onSend - 发送回调
   */
  const handleKeydown = (event, onSend) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (event.isComposing || event.keyCode === 229) {
        return
      }
      event.preventDefault()
      onSend()
    }
  }

  /**
   * 格式化时间
   * @param {Date} timestamp
   * @returns {string} 格式化后的时间字符串
   */
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    isOpen,
    inputMessage,
    messages,
    isLoading,
    messagesContainer,
    textareaRef,
    chatHistory,
    pendingMessage,
    getRecentChatHistory,
    scrollToBottom,
    smartScrollToBottom,
    handleScroll,
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
  }
}
