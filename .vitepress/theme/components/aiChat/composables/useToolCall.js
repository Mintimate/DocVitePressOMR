import { nextTick, ref } from 'vue'

/**
 * Tool Use / MCP 工具调用 composable
 * 封装 MCP 工具列表获取、工具调用、LLM 流式请求及 Tool Use 完整流程
 */
export function useToolCall(convertToHtml, smartScrollToBottom) {
  // Tool Use 模式相关
  const toolCallStatus = ref(false)   // 是否正在执行工具调用流程
  const toolCallSteps = ref([])        // 工具调用步骤状态
  const mcpTools = ref([])             // 从后端获取的 MCP 工具列表
  let fallbackTools = []               // 降级工具定义（从环境变量传入）

  /**
   * 更新工具调用步骤状态
   * @param {Array} steps - 步骤数组
   */
  const updateToolSteps = (steps) => {
    toolCallSteps.value = steps
    nextTick(() => { smartScrollToBottom() })
  }

  /**
   * 设置降级工具定义（从环境变量传入）
   * @param {string} defaultToolsJson - JSON 格式的工具定义字符串
   */
  const setFallbackTools = (defaultToolsJson) => {
    if (!defaultToolsJson) {
      fallbackTools = []
      return
    }
    try {
      const parsed = JSON.parse(defaultToolsJson)
      fallbackTools = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.warn('解析 AI_DEFAULT_TOOLS 环境变量失败:', e)
      fallbackTools = []
    }
  }

  /**
   * 获取 MCP 工具列表
   * @param {string} mcpBaseUrl - MCP 接口基础 URL
   */
  const fetchMCPTools = async (mcpBaseUrl) => {
    if (!mcpBaseUrl) {
      console.warn('mcpBaseUrl 未配置，将使用降级工具定义')
      mcpTools.value = fallbackTools
      return
    }

    try {
      const response = await fetch(`${mcpBaseUrl}/tools`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.tools) {
          mcpTools.value = data.tools
          console.log('MCP 工具列表加载成功:', mcpTools.value.length, '个工具')
          return
        }
      }
      // 响应异常，降级
      console.warn('MCP /tools 响应异常，将使用降级工具定义')
      mcpTools.value = fallbackTools
    } catch (e) {
      console.warn('获取 MCP 工具列表失败，将使用降级工具定义:', e)
      mcpTools.value = fallbackTools
    }
  }

  /**
   * 调用 MCP 工具
   * @param {string} mcpBaseUrl - MCP 接口基础 URL
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {string|null} sessionToken - 会话令牌（可选，由第一轮 LLM 响应返回，用于跳过验证码）
   * @returns {Object} 工具调用结果
   */
  const callMCPTool = async (mcpBaseUrl, toolName, args, sessionToken = null) => {
    if (!mcpBaseUrl) {
      throw new Error('MCP 接口地址未配置（mcpBaseUrl 为空）')
    }
    const headers = { 'Content-Type': 'application/json; charset=utf-8' }
    if (sessionToken) {
      headers['X-Session-Token'] = sessionToken
    }
    const response = await fetch(`${mcpBaseUrl}/tools/call`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tool_name: toolName,
        arguments: args
      })
    })
    if (!response.ok) {
      throw new Error(`工具调用失败: HTTP ${response.status}`)
    }
    return await response.json()
  }

  /**
   * 构建 LLM 工具定义（OpenAI function calling 格式）
   * @returns {Array} 工具定义数组
   */
  const buildToolDefs = () => {
    return mcpTools.value.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }))
  }

  /**
   * 根据验证码数据构建请求头
   * 后端 captchaMiddleware 通过 HTTP Header 读取验证码字段
   * @param {Object|null} captchaData - 验证码数据
   * @returns {Object} 包含验证码信息的请求头对象
   */
  const buildCaptchaHeaders = (captchaData) => {
    const headers = {}
    if (!captchaData) return headers

    // 腾讯云 / 阿里云验证码
    if (captchaData.ticket) headers['X-Captcha-Ticket'] = captchaData.ticket
    if (captchaData.randstr) headers['X-Captcha-Randstr'] = captchaData.randstr

    // 极验验证码
    if (captchaData.lot_number) headers['X-Geetest-Lot-Number'] = captchaData.lot_number
    if (captchaData.captcha_output) headers['X-Geetest-Captcha-Output'] = captchaData.captcha_output
    if (captchaData.pass_token) headers['X-Geetest-Pass-Token'] = captchaData.pass_token
    if (captchaData.gen_time) headers['X-Geetest-Gen-Time'] = captchaData.gen_time

    // Google reCAPTCHA v2/v3
    if (captchaData.recaptcha_token) headers['X-Recaptcha-Token'] = captchaData.recaptcha_token
    if (captchaData.recaptcha_action) headers['X-Recaptcha-Action'] = captchaData.recaptcha_action

    // Cloudflare Turnstile
    if (captchaData.cf_token) headers['X-Cf-Turnstile-Token'] = captchaData.cf_token

    return headers
  }

  /**
   * 通过 LLM 流式接口发送消息，并处理 tool_calls
   * @param {string} mcpBaseUrl - MCP 接口基础 URL
   * @param {Array} llmMessages - LLM 消息列表
   * @param {Array|null} tools - 工具定义列表
   * @param {number|null} aiMessageIndex - AI 消息在 messages 数组中的索引
   * @param {import('vue').Ref<Array>} messages - 消息列表 ref
   * @param {Object|null} captchaData - 验证码数据（可选，启用验证码时传入）
   * @param {string|null} sessionToken - 会话令牌（可选，后续请求携带以跳过验证码）
   * @returns {Object} { content, reasoning, toolCalls, finishReason, sessionToken }
   */
  const callLLMStream = async (mcpBaseUrl, llmMessages, tools, aiMessageIndex, messages, captchaData = null, sessionToken = null) => {
    if (!mcpBaseUrl) {
      throw new Error('MCP 接口地址未配置（mcpBaseUrl 为空），请设置 AI_MCP_BASE_URL 环境变量')
    }

    const requestBody = {
      messages: llmMessages,
      tools: tools && tools.length > 0 ? tools : undefined,
      stream: true
    }

    // 构建请求头：优先使用 sessionToken（跳过验证码），否则使用验证码 Headers
    const authHeaders = sessionToken
      ? { 'X-Session-Token': sessionToken }
      : buildCaptchaHeaders(captchaData)

    const response = await fetch(`${mcpBaseUrl}/llm/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...authHeaders
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LLM HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let accumulatedContent = ''
    let accumulatedReasoning = ''
    let toolCallsMap = {} // {index: {id, name, arguments}}
    let finishReason = ''
    let reasoningStarted = false
    let reasoningEnded = false

    try {
      let result
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true })
        buffer += chunk

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()

          // 处理 event: 行
          if (trimmedLine.startsWith('event:done') || trimmedLine.startsWith('event: done')) {
            finishReason = 'stop'
            continue
          }
          if (trimmedLine.startsWith('event:tool_calls') || trimmedLine.startsWith('event: tool_calls')) {
            finishReason = 'tool_calls'
            continue
          }
          if (trimmedLine.startsWith('event:error') || trimmedLine.startsWith('event: error')) {
            continue
          }
          if (trimmedLine.startsWith('event:connected') || trimmedLine.startsWith('event: connected')) {
            continue
          }

          if (trimmedLine.startsWith('data:')) {
            try {
              const jsonStr = trimmedLine.substring(5).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue

              const data = JSON.parse(jsonStr)

              // 处理连接确认等非内容消息
              if (data.success !== undefined && !data.delta) continue

              const delta = data.delta
              if (!delta) continue

              // 处理思考内容
              if (delta.reasoning_content) {
                if (!reasoningStarted) {
                  reasoningStarted = true
                }
                accumulatedReasoning += delta.reasoning_content
                if (aiMessageIndex !== null && messages) {
                  messages.value[aiMessageIndex].thinkContent = accumulatedReasoning
                  messages.value[aiMessageIndex].thinkHtml = convertToHtml(accumulatedReasoning)
                  messages.value[aiMessageIndex].thinkExpanded = true
                }
                nextTick(() => { smartScrollToBottom() })
              }

              // 处理普通内容
              if (delta.content) {
                // 如果之前在思考阶段，现在有普通内容说明思考结束
                if (reasoningStarted && !reasoningEnded) {
                  reasoningEnded = true
                  if (aiMessageIndex !== null && messages) {
                    messages.value[aiMessageIndex].thinkExpanded = false
                  }
                }
                accumulatedContent += delta.content
                if (aiMessageIndex !== null && messages) {
                  messages.value[aiMessageIndex].text = accumulatedContent
                  messages.value[aiMessageIndex].html = convertToHtml(accumulatedContent)
                }
                nextTick(() => { smartScrollToBottom() })
              }

              // 处理工具调用增量
              if (delta.tool_calls && delta.tool_calls.length > 0) {
                for (const tc of delta.tool_calls) {
                  const idx = tc.index
                  if (!toolCallsMap[idx]) {
                    toolCallsMap[idx] = { id: '', name: '', arguments: '' }
                  }
                  if (tc.id) toolCallsMap[idx].id = tc.id
                  if (tc.function) {
                    if (tc.function.name) toolCallsMap[idx].name += tc.function.name
                    if (tc.function.arguments) toolCallsMap[idx].arguments += tc.function.arguments
                  }
                }
              }

              // 处理 finish_reason
              if (data.finish_reason) {
                finishReason = data.finish_reason
              }
            } catch (e) {
              console.warn('解析 LLM SSE 数据失败:', trimmedLine, e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    // 组装工具调用列表
    const toolCalls = Object.keys(toolCallsMap).sort((a, b) => a - b).map(idx => toolCallsMap[idx])

    // 从响应头中提取会话令牌，后续请求可携带此令牌跳过验证码
    const respSessionToken = response.headers.get('X-Session-Token') || null

    return {
      content: accumulatedContent,
      reasoning: accumulatedReasoning,
      toolCalls,
      finishReason,
      sessionToken: respSessionToken
    }
  }

  /**
   * 执行完整的 Tool Use 流程（第一轮 LLM → 工具调用 → 第二轮 LLM）
   * @param {Object} options - 选项
   * @param {string} options.mcpBaseUrl - MCP 接口基础 URL
   * @param {Array} options.llmMessages - LLM 消息列表
   * @param {number} options.aiMessageIndex - AI 消息索引
   * @param {import('vue').Ref<Array>} options.messages - 消息列表 ref
   * @param {Function} options.addAssistantHistory - 添加助手历史回调
   * @returns {Promise<void>}
   */
  const executeToolUseFlow = async ({ mcpBaseUrl, llmMessages, aiMessageIndex, messages, addAssistantHistory, captchaData = null }) => {
    const toolDefs = buildToolDefs()

    // ========== 第一轮：调用 LLM（带 tools），看是否需要工具调用 ==========
    toolCallStatus.value = true
    updateToolSteps([
      { text: 'AI 正在分析问题...', active: true, completed: false },
      { text: '查询知识库', active: false, completed: false },
      { text: '生成回答', active: false, completed: false }
    ])

    const firstResult = await callLLMStream(mcpBaseUrl, llmMessages, toolDefs, aiMessageIndex, messages, captchaData, null)

    // 提取第一轮响应中的会话令牌，后续请求（工具调用、第二轮 LLM）使用此令牌跳过验证码
    const sessionToken = firstResult.sessionToken || null

    // 标记第一步完成
    updateToolSteps([
      { text: 'AI 分析问题完成', active: false, completed: true },
      { text: '查询知识库', active: false, completed: false },
      { text: '生成回答', active: false, completed: false }
    ])

    // ========== 判断是否需要工具调用 ==========
    if (firstResult.toolCalls && firstResult.toolCalls.length > 0) {
      // LLM 要求调用工具
      updateToolSteps([
        { text: 'AI 分析问题完成', active: false, completed: true },
        { text: '正在查询知识库...', active: true, completed: false },
        { text: '生成回答', active: false, completed: false }
      ])

      // 构建 assistant 消息（包含 tool_calls）
      const assistantMsg = {
        role: 'assistant',
        content: firstResult.content || '',
        tool_calls: firstResult.toolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.name,
            arguments: tc.arguments
          }
        }))
      }

      // 执行每个工具调用
      const toolResults = []
      for (const tc of firstResult.toolCalls) {
        try {
          let args = {}
          try {
            args = JSON.parse(tc.arguments)
          } catch (e) {
            console.warn('解析工具参数失败:', tc.arguments)
          }

          const result = await callMCPTool(mcpBaseUrl, tc.name, args, sessionToken)
          toolResults.push({
            role: 'tool',
            tool_call_id: tc.id,
            name: tc.name,
            content: JSON.stringify(result.result || result)
          })
        } catch (e) {
          console.error('工具调用失败:', e)
          toolResults.push({
            role: 'tool',
            tool_call_id: tc.id,
            name: tc.name,
            content: JSON.stringify({ error: e.message })
          })
        }
      }

      // 标记知识库查询完成
      updateToolSteps([
        { text: 'AI 分析问题完成', active: false, completed: true },
        { text: '知识库查询完成', active: false, completed: true },
        { text: '正在生成回答...', active: true, completed: false }
      ])

      // ========== 第二轮：将工具结果回传 LLM 生成最终回答 ==========
      // 清空之前的AI消息占位（第一轮可能有些内容）
      messages.value[aiMessageIndex].text = ''
      messages.value[aiMessageIndex].html = ''

      const secondMessages = [
        ...llmMessages,
        assistantMsg,
        ...toolResults
      ]

      const secondResult = await callLLMStream(mcpBaseUrl, secondMessages, null, aiMessageIndex, messages, null, sessionToken)

      // 工具调用流程完成
      updateToolSteps([
        { text: 'AI 分析问题完成', active: false, completed: true },
        { text: '知识库查询完成', active: false, completed: true },
        { text: '回答生成完成', active: false, completed: true }
      ])

      // 短暂展示完成状态后隐藏
      setTimeout(() => {
        toolCallStatus.value = false
        toolCallSteps.value = []
      }, 1500)

      // 处理最终回答内容
      const finalContent = secondResult.content || messages.value[aiMessageIndex].text
      if (!finalContent.trim()) {
        const defaultMessage = '抱歉，我暂时无法回答这个问题。'
        messages.value[aiMessageIndex].text = defaultMessage
        messages.value[aiMessageIndex].html = convertToHtml(defaultMessage)
        addAssistantHistory(defaultMessage)
      } else {
        addAssistantHistory(finalContent)
      }

      // 如果有思考内容，默认折叠
      if (messages.value[aiMessageIndex].thinkContent) {
        messages.value[aiMessageIndex].thinkExpanded = false
      }

    } else {
      // LLM 直接回答（不需要工具调用）
      toolCallStatus.value = false
      toolCallSteps.value = []

      const finalContent = firstResult.content || messages.value[aiMessageIndex].text
      if (!finalContent.trim()) {
        const defaultMessage = '抱歉，我暂时无法回答这个问题。'
        messages.value[aiMessageIndex].text = defaultMessage
        messages.value[aiMessageIndex].html = convertToHtml(defaultMessage)
        addAssistantHistory(defaultMessage)
      } else {
        addAssistantHistory(finalContent)
      }

      // 如果有思考内容，默认折叠
      if (messages.value[aiMessageIndex].thinkContent) {
        messages.value[aiMessageIndex].thinkExpanded = false
      }
    }
  }

  /**
   * 重置工具调用状态
   */
  const resetToolCallState = () => {
    toolCallStatus.value = false
    toolCallSteps.value = []
  }

  return {
    toolCallStatus,
    toolCallSteps,
    mcpTools,
    setFallbackTools,
    fetchMCPTools,
    callMCPTool,
    buildToolDefs,
    callLLMStream,
    executeToolUseFlow,
    resetToolCallState
  }
}
