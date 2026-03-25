import { ref } from 'vue'

/**
 * 验证码 composable
 * 封装所有验证码相关的状态管理和事件处理逻辑
 */
export function useCaptcha() {
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
    recaptcha_action: '',
    // Cloudflare Turnstile 字段
    cf_token: '',
    // 阿里云验证码字段（简化）
    aliyun_app_id: ''
  })

  /**
   * 清空所有验证码字段
   */
  const clearCaptchaFields = () => {
    captchaState.value.ticket = ''
    captchaState.value.randstr = ''
    captchaState.value.lot_number = ''
    captchaState.value.captcha_output = ''
    captchaState.value.pass_token = ''
    captchaState.value.gen_time = ''
    captchaState.value.recaptcha_token = ''
    captchaState.value.recaptcha_action = ''
    captchaState.value.cf_token = ''
    captchaState.value.aliyun_app_id = ''
  }

  /**
   * 验证码成功回调
   * @param {Object} data - 验证码验证成功返回的数据
   * @param {Function} onSuccess - 验证成功后的回调（如继续发送消息）
   */
  const onCaptchaSuccess = (data, onSuccess) => {
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
    } else if (data.token && !data.action && !data.version) {
      // Cloudflare Turnstile 验证码
      captchaState.value.cf_token = data.token
    } else if (data.captcha_param && (data.result || data.bizResult)) {
      // 阿里云验证码 - 简化参数处理
      const captchaParam = typeof data.captcha_param === 'string'
        ? data.captcha_param
        : JSON.stringify(data.captcha_param)

      // 根据阿里云验证码2.0标准格式存储
      captchaState.value.ticket = captchaParam
      captchaState.value.randstr = data.scene || 'default'
      captchaState.value.aliyun_app_id = data.captchaAppId || ''
    }

    // 验证成功后回调
    if (onSuccess) onSuccess()
  }

  /**
   * 验证码取消回调
   * @param {import('vue').Ref<string>} pendingMessage - 待发送消息的 ref
   */
  const onCaptchaCancel = (pendingMessage) => {
    if (pendingMessage) pendingMessage.value = ''
    clearCaptchaFields()
    console.log('用户取消了验证码验证')
  }

  /**
   * 验证码错误回调
   * @param {*} error - 错误信息
   * @param {import('vue').Ref<string>} pendingMessage - 待发送消息的 ref
   */
  const onCaptchaError = (error, pendingMessage) => {
    if (pendingMessage) pendingMessage.value = ''
    clearCaptchaFields()
    console.error('验证码验证失败:', error)
  }

  /**
   * 验证码隐藏回调
   */
  const onCaptchaHide = () => {
    console.log('验证码组件已隐藏')
  }

  /**
   * 触发验证码验证
   * @param {boolean} enableCaptcha - 是否启用验证码
   * @param {Function} onProceed - 验证通过或无需验证时的回调
   */
  const triggerCaptcha = (enableCaptcha, onProceed) => {
    if (!enableCaptcha) {
      onProceed()
      return
    }

    // 检查是否已有有效票据
    const hasTencentTicket = captchaState.value.ticket && captchaState.value.randstr
    const hasGeetestTicket = captchaState.value.lot_number && captchaState.value.captcha_output &&
      captchaState.value.pass_token && captchaState.value.gen_time
    const hasGoogleTicket = captchaState.value.recaptcha_token
    const hasCloudflareTicket = captchaState.value.cf_token

    if (hasTencentTicket || hasGeetestTicket || hasGoogleTicket || hasCloudflareTicket) {
      onProceed()
      return
    }

    // 设置验证状态，触发验证码组件显示
    captchaState.value.isVerifying = true
  }

  /**
   * 重置验证状态
   */
  const resetCaptchaVerifying = () => {
    captchaState.value.isVerifying = false
  }

  return {
    captchaState,
    clearCaptchaFields,
    onCaptchaSuccess,
    onCaptchaCancel,
    onCaptchaError,
    onCaptchaHide,
    triggerCaptcha,
    resetCaptchaVerifying
  }
}
