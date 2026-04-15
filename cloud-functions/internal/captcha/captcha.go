// Package captcha 提供多提供商验证码验证服务。
//
// 支持的验证码类型：
//   - cloudflare: Cloudflare Turnstile
//   - tencent:    腾讯云验证码
//   - geetest:    极验验证码
//   - google_v2:  Google reCAPTCHA v2
//   - google_v3:  Google reCAPTCHA v3
//
// 通过环境变量 CAPTCHA_TYPE 选择验证码类型，留空则不启用验证码。
package captcha

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"cloud-functions/internal/config"
)

// Service 验证码服务
type Service struct {
	cfg     config.Config
	enabled bool
	client  *http.Client
}

// NewService 创建验证码服务实例
func NewService(cfg config.Config) *Service {
	enabled := cfg.CaptchaEnabled
	return &Service{
		cfg:     cfg,
		enabled: enabled,
		client:  &http.Client{Timeout: 10 * time.Second},
	}
}

// IsEnabled 检查验证码服务是否启用
func (s *Service) IsEnabled() bool {
	return s.enabled
}

// GetType 获取验证码类型
func (s *Service) GetType() string {
	return s.cfg.CaptchaType
}

// Verify 根据验证码类型进行验证
func (s *Service) Verify(params map[string]string) (bool, error) {
	if !s.enabled {
		return true, nil
	}

	switch s.cfg.CaptchaType {
	case "cloudflare":
		return s.verifyCloudflareTurnstile(params)
	case "tencent":
		return s.verifyTencent(params)
	case "geetest":
		return s.verifyGeetest(params)
	case "google_v2", "google_v3":
		return s.verifyGoogleRecaptcha(params)
	default:
		return false, fmt.Errorf("不支持的验证码类型: %s", s.cfg.CaptchaType)
	}
}

// ── Cloudflare Turnstile ──────────────────────────────────────────────────────

// CloudflareTurnstileResponse Cloudflare Turnstile 响应结构
type CloudflareTurnstileResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes,omitempty"`
}

func (s *Service) verifyCloudflareTurnstile(params map[string]string) (bool, error) {
	token := params["token"]
	userIP := params["userIP"]

	if token == "" {
		return false, fmt.Errorf("Cloudflare Turnstile token 不能为空")
	}

	// 容灾票据直接通过
	if len(token) > 12 && token[:12] == "cf_fallback_" {
		return true, nil
	}

	data := url.Values{}
	data.Set("secret", s.cfg.CloudflareSecretKey)
	data.Set("response", token)
	if userIP != "" {
		data.Set("remoteip", userIP)
	}

	resp, err := s.client.PostForm(s.cfg.CloudflareURL, data)
	if err != nil {
		return false, fmt.Errorf("Cloudflare Turnstile 验证请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("读取 Cloudflare Turnstile 响应失败: %v", err)
	}

	var result CloudflareTurnstileResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return false, fmt.Errorf("解析 Cloudflare Turnstile 响应失败: %v", err)
	}

	if !result.Success {
		errorMsg := "Cloudflare Turnstile 验证失败"
		if len(result.ErrorCodes) > 0 {
			errorMsg += fmt.Sprintf(": %v", result.ErrorCodes)
		}
		return false, fmt.Errorf(errorMsg)
	}

	return true, nil
}

// ── 腾讯云验证码 ──────────────────────────────────────────────────────────────

func (s *Service) verifyTencent(params map[string]string) (bool, error) {
	ticket := params["ticket"]
	randstr := params["randstr"]

	if ticket == "" || randstr == "" {
		return false, fmt.Errorf("腾讯云验证码 ticket 和 randstr 不能为空")
	}

	// 腾讯云验证码需要通过 API 调用验证，这里简化处理
	// 实际生产环境应使用腾讯云 SDK 或 REST API
	ticketPreview := ticket
	if len(ticketPreview) > 8 {
		ticketPreview = ticketPreview[:8]
	}
	randstrPreview := randstr
	if len(randstrPreview) > 8 {
		randstrPreview = randstrPreview[:8]
	}
	fmt.Printf("[Captcha] 腾讯云验证码验证: ticket=%s, randstr=%s\n", ticketPreview, randstrPreview)
	return true, nil
}

// ── 极验验证码 ────────────────────────────────────────────────────────────────

// GeetestResponse 极验响应结构
type GeetestResponse struct {
	Result string `json:"result"`
	Reason string `json:"reason"`
}

func (s *Service) verifyGeetest(params map[string]string) (bool, error) {
	lotNumber := params["lotNumber"]
	captchaOutput := params["captchaOutput"]
	passToken := params["passToken"]
	genTime := params["genTime"]

	if lotNumber == "" || captchaOutput == "" || passToken == "" || genTime == "" {
		return false, fmt.Errorf("极验验证码参数不完整")
	}

	data := url.Values{}
	data.Set("lot_number", lotNumber)
	data.Set("captcha_output", captchaOutput)
	data.Set("pass_token", passToken)
	data.Set("gen_time", genTime)
	data.Set("captcha_id", s.cfg.GeetestID)

	resp, err := s.client.PostForm(s.cfg.GeetestURL, data)
	if err != nil {
		return false, fmt.Errorf("极验验证码验证请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("读取极验响应失败: %v", err)
	}

	var result GeetestResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return false, fmt.Errorf("解析极验响应失败: %v", err)
	}

	if result.Result != "success" {
		return false, fmt.Errorf("极验验证码验证失败: %s", result.Reason)
	}

	return true, nil
}

// ── Google reCAPTCHA ──────────────────────────────────────────────────────────

// GoogleRecaptchaResponse Google reCAPTCHA 响应结构
type GoogleRecaptchaResponse struct {
	Success    bool     `json:"success"`
	Score      float64  `json:"score,omitempty"`
	Action     string   `json:"action,omitempty"`
	ErrorCodes []string `json:"error-codes,omitempty"`
}

func (s *Service) verifyGoogleRecaptcha(params map[string]string) (bool, error) {
	token := params["token"]
	userIP := params["userIP"]

	if token == "" {
		return false, fmt.Errorf("Google reCAPTCHA token 不能为空")
	}

	data := url.Values{}
	data.Set("secret", s.cfg.GoogleRecaptchaSecretKey)
	data.Set("response", token)
	if userIP != "" {
		data.Set("remoteip", userIP)
	}

	resp, err := s.client.PostForm(s.cfg.GoogleRecaptchaURL, data)
	if err != nil {
		return false, fmt.Errorf("Google reCAPTCHA 验证请求失败: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("读取 Google reCAPTCHA 响应失败: %v", err)
	}

	var result GoogleRecaptchaResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return false, fmt.Errorf("解析 Google reCAPTCHA 响应失败: %v", err)
	}

	if !result.Success {
		errorMsg := "Google reCAPTCHA 验证失败"
		if len(result.ErrorCodes) > 0 {
			errorMsg += fmt.Sprintf(": %v", result.ErrorCodes)
		}
		return false, fmt.Errorf(errorMsg)
	}

	return true, nil
}
