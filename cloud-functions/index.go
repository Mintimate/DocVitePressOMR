// Oh My Rime Agent + MCP 后端 — EdgeOne Pages Go Cloud Function (Framework 模式)
//
// 路由总览：
//
//	GET  /                     — 服务信息
//	GET  /api/v1/health        — 健康检查
//	POST /api/v1/chat          — Agent 非流式问答（需验证码）
//	POST /api/v1/chat/stream   — Agent 流式问答（SSE，需验证码）
//	POST /api/v1/agent/chat/stream — Agent 流式问答别名（SSE，需验证码）
//	GET  /api/v1/mcp/tools     — Tool Use 工具列表（前端 AI 组件）
//	POST /api/v1/mcp/tools/call — Tool Use 工具调用（前端 AI 组件）
//	POST /api/v1/mcp/llm/chat  — Tool Use LLM 聊天（需验证码）
//	ANY  /mcp                  — 标准 MCP Streamable HTTP 端点（外部 AI 客户端）
//
// 包结构：
//
//	internal/config/     — Config 结构、loadConfig、CORS 中间件、AI 客户端
//	internal/knowledge/  — CNB 知识库 HTTP 客户端、结果格式化
//	internal/handler/    — 各路由 handler（agent.go / rag.go / tooluse.go / mcp.go）
//	internal/captcha/    — 多提供商验证码服务（Cloudflare Turnstile 等）
//	internal/middleware/  — 验证码中间件（session token 机制）
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"

	"cloud-functions/internal/captcha"
	"cloud-functions/internal/config"
	"cloud-functions/internal/handler"
	"cloud-functions/internal/middleware"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	cfg := config.Load()
	aiClient := config.NewAIClient(cfg)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(config.CORSMiddleware())

	// 初始化验证码服务
	captchaService := captcha.NewService(cfg)

	// 初始化验证码中间件
	captchaMiddleware := middleware.NewCaptchaMiddleware(captchaService)

	registerRoutes(r, cfg, aiClient, captchaMiddleware)
	r.Run(":9000")
}

// registerRoutes 是唯一的路由编排入口，保持 main() 整洁。
func registerRoutes(r *gin.Engine, cfg config.Config, aiClient *openai.Client, captchaMW *middleware.CaptchaMiddleware) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service": "Oh My Rime Agent + MCP 后端",
			"status":  "running",
			"endpoints": map[string]string{
				"health":      "/api/v1/health",
				"chat":        "/api/v1/chat",
				"stream":      "/api/v1/chat/stream",
				"agentStream": "/api/v1/agent/chat/stream",
				"tools":       "/api/v1/mcp/tools",
				"mcp":         "/mcp",
			},
		})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Agent 代理服务运行正常"})
		})

		// Agent 问答 — 前端 AI 组件直接调用（需验证码）
		api.POST("/chat", captchaMW.VerifyCaptcha(), handler.AgentChat(cfg))
		api.POST("/chat/stream", captchaMW.VerifyCaptcha(), handler.AgentStreamChat(cfg))
		api.POST("/agent/chat/stream", captchaMW.VerifyCaptcha(), handler.AgentStreamChat(cfg))

		// Tool Use — 前端 AI 组件 Function Calling 流程
		mcpGroup := api.Group("/mcp")
		{
			mcpGroup.GET("/tools", handler.ToolsList(cfg))
			// tools/call 不加验证码，避免与 llm/chat 流程中重复弹出
			mcpGroup.POST("/tools/call", handler.ToolsCall(cfg))
			// LLM 聊天 — 作为 MCP 流程的入口鉴权点（需验证码）
			mcpGroup.POST("/llm/chat", captchaMW.VerifyCaptcha(), handler.LLMChat(cfg, aiClient))
		}
	}

	// 标准 MCP Streamable HTTP — 供 Cursor / Claude Desktop 等外部 AI 客户端接入
	r.Any("/mcp", handler.MCPStreamable(cfg))
}
