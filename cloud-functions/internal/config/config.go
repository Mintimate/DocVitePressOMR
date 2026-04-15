// Package config holds all runtime configuration loaded from environment variables.
//
// 环境变量说明：
//
//	KNOWLEDGE_API_URL     — CNB 知识库查询 API 端点
//	CNB_TOKEN             — 知识库认证 token
//	KNOWLEDGE_TOP_K       — （可选）知识库返回条数，默认 5
//	AI_BASE_URL           — OpenAI 兼容 API 基础 URL
//	AI_API_KEY            — AI API 密钥
//	AI_MODEL              — 模型名称，如 hunyuan-t1-20250711
//	AI_MCP_BASE_URL       — （可选）MCP 专用 AI 基础 URL，留空则复用 AI_BASE_URL
//	RAG_SYSTEM_PROMPT     — （可选）RAG 系统提示词
//	CAPTCHA_ENABLED       — 是否启用验证码: true / false，留空则根据 CAPTCHA_TYPE 是否非空判断
//	CAPTCHA_TYPE          — 验证码类型: cloudflare / tencent / geetest / google_v2 / google_v3
//	CLOUDFLARE_SECRET_KEY — Cloudflare Turnstile 服务端密钥
//	CLOUDFLARE_URL        — Cloudflare Turnstile 验证接口 URL
package config

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
)

// Config holds all runtime configuration loaded from environment variables.
type Config struct {
	// 知识库
	KnowledgeAPIURL string
	KnowledgeToken  string
	KnowledgeTopK   int
	// AI
	AIBaseURL    string
	AIAPIKey     string
	AIModel      string
	AIMCPBaseURL string // MCP 专用 AI 基础 URL，留空则复用 AIBaseURL
	// RAG
	RAGSystemPrompt string
	// 验证码
	CaptchaEnabled           bool // 显式控制验证码开关
	CaptchaType              string
	CloudflareSecretKey      string
	CloudflareURL            string
	TencentSecretID          string
	TencentSecretKey         string
	TencentCaptchaAppID      string
	TencentAppSecretKey      string
	GeetestID                string
	GeetestKey               string
	GeetestURL               string
	GoogleRecaptchaSecretKey string
	GoogleRecaptchaURL       string
	GoogleMinScore           string
}

// Load reads configuration from environment variables.
func Load() Config {
	prompt := os.Getenv("RAG_SYSTEM_PROMPT")
	if prompt == "" {
		prompt = "你是 Oh My Rime（薄荷输入法）的知识库助手，请根据提供的知识库内容回答用户关于 Rime 输入法配置、使用和问题排查的问题。如果知识库中没有相关内容，请如实告知用户。"
	}

	cfURL := os.Getenv("CLOUDFLARE_URL")
	if cfURL == "" {
		cfURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
	}

	gtURL := os.Getenv("GEETEST_URL")
	if gtURL == "" {
		gtURL = "http://gcaptcha4.geetest.com/validate"
	}

	grURL := os.Getenv("GOOGLE_RECAPTCHA_URL")
	if grURL == "" {
		grURL = "https://www.recaptcha.net/recaptcha/api/siteverify"
	}

	// 知识库 top_k
	topK := 5
	if v := os.Getenv("KNOWLEDGE_TOP_K"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			topK = n
		}
	}

	// 验证码开关：优先读 CAPTCHA_ENABLED，否则根据 CAPTCHA_TYPE 是否非空判断
	captchaType := os.Getenv("CAPTCHA_TYPE")
	captchaEnabled := captchaType != ""
	if v := os.Getenv("CAPTCHA_ENABLED"); v != "" {
		captchaEnabled = strings.EqualFold(v, "true") || v == "1"
	}

	// MCP 专用 AI 基础 URL
	aiMCPBaseURL := os.Getenv("AI_MCP_BASE_URL")
	if aiMCPBaseURL == "" {
		aiMCPBaseURL = os.Getenv("AI_BASE_URL")
	}

	return Config{
		KnowledgeAPIURL:          os.Getenv("KNOWLEDGE_API_URL"),
		KnowledgeToken:           os.Getenv("CNB_TOKEN"),
		KnowledgeTopK:            topK,
		AIBaseURL:                os.Getenv("AI_BASE_URL"),
		AIAPIKey:                 os.Getenv("AI_API_KEY"),
		AIModel:                  os.Getenv("AI_MODEL"),
		AIMCPBaseURL:             aiMCPBaseURL,
		RAGSystemPrompt:          prompt,
		CaptchaEnabled:           captchaEnabled,
		CaptchaType:              captchaType,
		CloudflareSecretKey:      os.Getenv("CLOUDFLARE_SECRET_KEY"),
		CloudflareURL:            cfURL,
		TencentSecretID:          os.Getenv("TENCENTCLOUD_SECRET_ID"),
		TencentSecretKey:         os.Getenv("TENCENTCLOUD_SECRET_KEY"),
		TencentCaptchaAppID:      os.Getenv("CAPTCHA_APP_ID"),
		TencentAppSecretKey:      os.Getenv("CAPTCHA_APP_SECRET_KEY"),
		GeetestID:                os.Getenv("GEETEST_ID"),
		GeetestKey:               os.Getenv("GEETEST_KEY"),
		GeetestURL:               gtURL,
		GoogleRecaptchaSecretKey: os.Getenv("GOOGLE_RECAPTCHA_SECRET_KEY"),
		GoogleRecaptchaURL:       grURL,
		GoogleMinScore:           os.Getenv("GOOGLE_MIN_SCORE"),
	}
}

// CORSMiddleware returns a Gin middleware that sets CORS headers and handles OPTIONS preflight.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Mcp-Session-Id, X-Captcha-Ticket, X-Captcha-Randstr, X-Geetest-Lot-Number, X-Geetest-Captcha-Output, X-Geetest-Pass-Token, X-Geetest-Gen-Time, X-Recaptcha-Token, X-Recaptcha-Action, X-Cf-Turnstile-Token, X-Session-Token")
		c.Header("Access-Control-Expose-Headers", "Mcp-Session-Id, X-Session-Token")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

// NewAIClient creates an OpenAI-compatible client from Config.
func NewAIClient(cfg Config) *openai.Client {
	c := openai.DefaultConfig(cfg.AIAPIKey)
	if cfg.AIBaseURL != "" {
		c.BaseURL = cfg.AIBaseURL
	}
	c.HTTPClient = &http.Client{
		Timeout: 0,
		Transport: &http.Transport{
			MaxIdleConns:       100,
			IdleConnTimeout:    90 * time.Second,
			DisableCompression: true,
		},
	}
	return openai.NewClientWithConfig(c)
}
