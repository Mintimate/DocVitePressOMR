import { nextTick, ref } from 'vue'

export function useAgentChat(convertToHtml, smartScrollToBottom) {
  const agentStatus = ref(false)
  const agentSteps = ref([])
  const conversationId = ref(createConversationId())

  const resetAgentState = () => {
    agentStatus.value = false
    agentSteps.value = []
  }

  const sendAgentMessage = async ({
    apiUrl,
    message,
    context,
    aiMessageIndex,
    messages,
    addAssistantHistory,
    captchaData = null
  }) => {
    if (!apiUrl) {
      throw new Error('Agent 接口地址未配置，请设置 AI_AGENT_API_URL 或 AI_API_URL')
    }

    agentStatus.value = true
    updateSteps([
      { text: '连接 Oh My Rime Agent...', active: true, completed: false },
      { text: '检索文档与工具编排', active: false, completed: false },
      { text: '生成回答', active: false, completed: false }
    ])

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...buildCaptchaHeaders(captchaData)
      },
      body: JSON.stringify({
        message,
        context,
        conversation_id: conversationId.value
      })
    })

    const returnedConversationId = response.headers.get('X-Agent-Conversation-Id')
    if (returnedConversationId) {
      conversationId.value = returnedConversationId
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Agent HTTP error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let accumulatedContent = ''
    let historyCommitted = false
    let traceAutoCollapsed = false
    const traceItems = []

    const finalizeAnswer = () => {
      if (historyCommitted) return

      if (!accumulatedContent.trim()) {
        accumulatedContent = '抱歉，Agent 暂时没有生成可用回答。'
        updateMessageContent(messages, aiMessageIndex, accumulatedContent)
      }

      completeAnswerTrace(traceItems)
      completeActiveTraceItems(traceItems)
      updateMessageTrace(messages, aiMessageIndex, traceItems, { preserveExpanded: true })
      addAssistantHistory(accumulatedContent)
      historyCommitted = true
      updateSteps([
        { text: 'Agent 分析完成', active: false, completed: true },
        { text: '文档与工具结果就绪', active: false, completed: true },
        { text: '回答生成完成', active: false, completed: true }
      ])
    }

    const handleEventData = (data) => {
      if (data === '[DONE]') {
        finalizeAnswer()
        return true
      }

      let event
      try {
        event = JSON.parse(data)
      } catch (error) {
        console.warn('解析 Agent SSE 数据失败:', data, error)
        return false
      }

      switch (event.type) {
        case 'thinking':
          appendTrace(traceItems, {
            type: 'thinking',
            title: '分析',
            detail: event.content || ''
          })
          updateMessageTrace(messages, aiMessageIndex, traceItems)
          updateSteps([
            { text: 'Agent 正在分析问题', active: true, completed: false },
            { text: '检索文档与工具编排', active: false, completed: false },
            { text: '生成回答', active: false, completed: false }
          ])
          break

        case 'tool_call':
          appendTrace(traceItems, {
            type: 'tool',
            status: 'active',
            name: event.name,
            title: formatToolName(event.name),
            detail: '正在调用工具'
          })
          updateMessageTrace(messages, aiMessageIndex, traceItems)
          updateSteps([
            { text: 'Agent 分析完成', active: false, completed: true },
            { text: `正在调用 ${formatToolName(event.name)}`, active: true, completed: false },
            { text: '生成回答', active: false, completed: false }
          ])
          break

        case 'tool_result':
          completeToolTrace(traceItems, event.name, event.content)
          updateMessageTrace(messages, aiMessageIndex, traceItems)
          updateSteps([
            { text: 'Agent 分析完成', active: false, completed: true },
            { text: `${formatToolName(event.name)} 完成`, active: false, completed: true },
            { text: '正在生成回答...', active: true, completed: false }
          ])
          break

        case 'ai_response':
          ensureAnswerTrace(traceItems)
          updateMessageTrace(messages, aiMessageIndex, traceItems, { preserveExpanded: true })
          accumulatedContent += event.content || ''
          updateMessageContent(messages, aiMessageIndex, accumulatedContent)
          if (!traceAutoCollapsed && messages.value[aiMessageIndex].thinkContent) {
            messages.value[aiMessageIndex].thinkExpanded = false
            traceAutoCollapsed = true
          }
          updateSteps([
            { text: 'Agent 分析完成', active: false, completed: true },
            { text: '文档与工具结果就绪', active: false, completed: true },
            { text: '正在生成回答...', active: true, completed: false }
          ])
          break

        case 'error_message':
          throw new Error(event.content || 'Agent 返回错误')

        default:
          break
      }

      return false
    }

    try {
      let result
      streamLoop:
      while (!(result = await reader.read()).done) {
        buffer += decoder.decode(result.value, { stream: true })
        const events = parseSSEBuffer(buffer)
        buffer = events.remainder

        for (const data of events.items) {
          if (handleEventData(data)) {
            break streamLoop
          }
        }
      }

      if (buffer.trim()) {
        const trailingEvents = parseSSEBuffer(`${buffer}\n\n`)
        for (const data of trailingEvents.items) {
          if (handleEventData(data)) break
        }
      }
    } finally {
      reader.releaseLock()
    }

    finalizeAnswer()

    setTimeout(() => {
      resetAgentState()
    }, 1200)
  }

  const updateSteps = (steps) => {
    agentSteps.value = steps
    nextTick(() => {
      smartScrollToBottom(true)
    })
  }

  const updateMessageContent = (messages, index, content) => {
    messages.value[index].text = content
    messages.value[index].html = convertToHtml(content)
    nextTick(() => {
      smartScrollToBottom(true)
    })
  }

  const updateMessageTrace = (messages, index, items, options = {}) => {
    const wasExpanded = messages.value[index].thinkExpanded
    messages.value[index].thinkContent = items.map(item => `${item.title}: ${item.detail || ''}`).join('\n')
    messages.value[index].thinkHtml = renderAgentTrace(items)
    messages.value[index].thinkExpanded = options.preserveExpanded ? wasExpanded !== false : true
    nextTick(() => {
      smartScrollToBottom(true)
    })
  }

  return {
    agentStatus,
    agentSteps,
    conversationId,
    sendAgentMessage,
    resetAgentState
  }
}

function parseSSEBuffer(buffer) {
  const parts = buffer.split('\n\n')
  const remainder = parts.pop() || ''
  const items = []

  for (const part of parts) {
    const dataLines = part
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trim())

    if (dataLines.length) {
      items.push(dataLines.join('\n'))
    }
  }

  return { items, remainder }
}

function buildCaptchaHeaders(captchaData) {
  const headers = {}
  if (!captchaData) return headers

  if (captchaData.ticket) headers['X-Captcha-Ticket'] = captchaData.ticket
  if (captchaData.randstr) headers['X-Captcha-Randstr'] = captchaData.randstr
  if (captchaData.lot_number) headers['X-Geetest-Lot-Number'] = captchaData.lot_number
  if (captchaData.captcha_output) headers['X-Geetest-Captcha-Output'] = captchaData.captcha_output
  if (captchaData.pass_token) headers['X-Geetest-Pass-Token'] = captchaData.pass_token
  if (captchaData.gen_time) headers['X-Geetest-Gen-Time'] = captchaData.gen_time
  if (captchaData.recaptcha_token) headers['X-Recaptcha-Token'] = captchaData.recaptcha_token
  if (captchaData.recaptcha_action) headers['X-Recaptcha-Action'] = captchaData.recaptcha_action
  if (captchaData.cf_token) headers['X-Cf-Turnstile-Token'] = captchaData.cf_token

  return headers
}

function appendTrace(items, item) {
  const detail = truncateText(item.detail, item.type === 'thinking' ? 280 : 180)
  const previous = items[items.length - 1]

  if (item.type === 'thinking' && previous?.type === 'thinking' && previous.detail === detail) {
    return
  }

  items.push({
    ...item,
    detail
  })
}

function completeToolTrace(items, name, content) {
  const detail = content ? truncateText(content, 180) : '工具已返回结果'
  const index = findLastIndex(items, item => item.type === 'tool' && item.name === name && item.status === 'active')

  if (index >= 0) {
    items[index] = {
      ...items[index],
      status: 'done',
      detail
    }
    return
  }

  appendTrace(items, {
    type: 'tool',
    status: 'done',
    name,
    title: formatToolName(name),
    detail
  })
}

function ensureAnswerTrace(items) {
  if (items.some(item => item.type === 'answer')) {
    return
  }

  items.push({
    type: 'answer',
    status: 'active',
    title: '生成回答',
    detail: '正在流式输出最终答案'
  })
}

function completeAnswerTrace(items) {
  ensureAnswerTrace(items)
  const index = findLastIndex(items, item => item.type === 'answer')
  if (index >= 0) {
    items[index] = {
      ...items[index],
      status: 'done',
      detail: '最终答案已生成'
    }
  }
}

function completeActiveTraceItems(items) {
  for (const item of items) {
    if (item.status === 'active') {
      item.status = 'done'
    }
  }
}

function renderAgentTrace(items) {
  return `
    <div class="agent-trace">
      ${items.map(renderTraceItem).join('')}
    </div>
  `
}

function renderTraceItem(item) {
  const state = item.status || 'done'
  const kind = ['tool', 'answer'].includes(item.type) ? item.type : 'thinking'
  const detail = item.detail ? `<div class="agent-trace-detail">${formatTraceDetail(item.detail)}</div>` : ''

  return `
    <div class="agent-trace-item ${kind} ${state}">
      <div class="agent-trace-dot">${traceIcon(kind, state)}</div>
      <div class="agent-trace-body">
        <div class="agent-trace-title">${escapeHtml(item.title || 'Agent')}</div>
        ${detail}
      </div>
    </div>
  `
}

function traceIcon(kind, state) {
  if (state === 'active') return '↻'
  if (state === 'done') return '✓'
  return '•'
}

function formatTraceDetail(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function findLastIndex(items, predicate) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) return index
  }
  return -1
}

function createConversationId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `agent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function formatToolName(name) {
  const labels = {
    oh_my_rime_knowledge_base: '文档知识库',
    search_docs: '文档检索',
    resolve_client: '客户端识别',
    target_file: '目标文件判断',
    make_patch: '配置补丁生成',
    check_yaml: 'YAML 检查',
    recipe: '内置配置配方'
  }
  return labels[name] || name || 'Agent 工具'
}

function truncateText(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}
