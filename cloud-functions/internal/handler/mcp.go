// Package handler — Standard MCP Streamable HTTP endpoint (/mcp).
//
// Implements MCP JSON-RPC 2.0 over HTTP for external AI clients
// (Cursor, Claude Desktop, VS Code / Cline, Cherry Studio, …).
//
// Supported methods:
//
//	initialize              — handshake; returns server info and capabilities
//	ping                    — heartbeat
//	tools/list              — list available tools
//	tools/call              — execute a tool
//	notifications/initialized — notification (no response needed)
//
// Tools:
//
//	query_oh-my-rime   — semantic search in knowledge base
//	get_download_links — download links for Rime clients and Oh My Rime
//	get_author_info    — author profile and social links
//	get_schema_list    — supported input schemas
package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"cloud-functions/internal/config"
	"cloud-functions/internal/knowledge"
)

// ── constants ─────────────────────────────────────────────────────────────────

const (
	mcpServerName      = "oh-my-rime-knowledge-mcp"
	mcpServerVersion   = "2.0.0"
	mcpProtocolVersion = "2025-03-26"
)

// ── MCP tool definitions ──────────────────────────────────────────────────────

var mcpTools = []map[string]interface{}{
	{
		"name": "query_oh-my-rime",
		"description": "Search the Oh My Rime knowledge base using semantic vector search. " +
			"Use this tool to find information about Rime input method configuration, " +
			"Mint Pinyin (薄荷输入法) usage, and related documentation. " +
			"Supports both semantic query and keyword-based search.",
		"inputSchema": map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"query": map[string]interface{}{
					"type":        "string",
					"description": "The search query in natural language (supports both Chinese and English).",
				},
				"keyword": map[string]interface{}{
					"type":        "string",
					"description": "Optional keywords for search, separated by semicolons.",
				},
				"top_k": map[string]interface{}{
					"type":        "number",
					"description": "Maximum number of results to return (default: 5, range: 1-10).",
				},
			},
			"required": []string{"query"},
		},
	},
	{
		"name": "get_download_links",
		"description": "Get download links for Oh My Rime related resources, including Rime client " +
			"installers (Squirrel for macOS, Weasel for Windows, Fcitx5), " +
			"Oh My Rime configuration package, Wanxiang language model, and CLI tool.",
		"inputSchema": map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"resource": map[string]interface{}{
					"type":        "string",
					"enum":        []string{"all", "oh-my-rime", "squirrel", "weasel", "fcitx5-rime", "wanxiang-model", "oh-my-rime-cli"},
					"description": "Specific resource to get download link for. Use 'all' for all links (default: 'all').",
				},
			},
		},
	},
	{
		"name":        "get_author_info",
		"description": "Get information about the author of Oh My Rime (薄荷输入法).",
		"inputSchema": map[string]interface{}{"type": "object", "properties": map[string]interface{}{}},
	},
	{
		"name": "get_schema_list",
		"description": "Get the list of all input schemas (输入方案) supported by Oh My Rime, " +
			"including full pinyin, double pinyin variants, Wubi, and Terra Pinyin.",
		"inputSchema": map[string]interface{}{"type": "object", "properties": map[string]interface{}{}},
	},
}

// ── Static Data: Download Links ───────────────────────────────────────────────

type downloadLink struct {
	Name        string
	GitHub      string
	Mirror      string
	Description string
	Platform    string
}

var downloadLinks = map[string]downloadLink{
	"oh-my-rime": {
		Name:        "Oh My Rime 薄荷输入法配置包",
		GitHub:      "https://github.com/Mintimate/oh-my-rime",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/oh-my-rime.zip",
		Description: "薄荷输入法配置仓库完整打包，解压后导入 Rime 即可使用。",
	},
	"squirrel": {
		Name:        "鼠须管 (Squirrel) — macOS 客户端",
		GitHub:      "https://github.com/rime/Squirrel",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Squirrel-latest.pkg",
		Description: "macOS 平台的 Rime 输入法框架客户端。",
		Platform:    "macOS",
	},
	"weasel": {
		Name:        "小狼毫 (Weasel) — Windows 客户端",
		GitHub:      "https://github.com/rime/weasel",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/weasel-installer-latest.exe",
		Description: "Windows 平台的 Rime 输入法框架客户端。",
		Platform:    "Windows",
	},
	"fcitx5-rime": {
		Name:        "Fcitx5-Rime — macOS Fcitx5 客户端",
		GitHub:      "https://github.com/fcitx-contrib/fcitx5-macos",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Fcitx5-Rime.zip",
		Description: "macOS 平台的 Fcitx5 输入法框架 Rime 客户端。",
		Platform:    "macOS",
	},
	"wanxiang-model": {
		Name:        "万象语言模型 (Wanxiang LTS)",
		GitHub:      "https://github.com/amzxyz/RIME-LMDG",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/wanxiang-lts-zh-hans.gram",
		Description: "万象语言模型，可提升输入预测的准确性。",
	},
	"oh-my-rime-cli": {
		Name:        "Oh My Rime CLI 命令行工具",
		GitHub:      "https://cnb.cool/Mintimate/rime/oh-my-rime-cli",
		Mirror:      "https://cnb.cool/Mintimate/rime/oh-my-rime-cli/-/releases",
		Description: "一键安装和更新薄荷输入法的 CLI 工具，支持 Windows/Linux/macOS。",
	},
}

// ── Static Data: Input Schemas ────────────────────────────────────────────────

type inputSchema struct {
	ID          string
	Name        string
	Type        string
	Description string
}

var schemasDefault = []inputSchema{
	{"rime_mint", "薄荷拼音 (全拼)", "全拼", "招牌主打输入类型，支持各种反查、中英混合输入，词库基于雾凇拼音词库。"},
	{"terra_pinyin", "地球拼音", "全拼", "带声调输入的拼音方案。"},
	{"double_pinyin_flypy", "小鹤双拼", "双拼", "基于小鹤双拼键位图定制，支持辅码滤镜提示。"},
	{"wubi98_mint", "98五笔 (薄荷定制)", "五笔", "基于98五笔基础版本定制的轻量版本。"},
	{"wubi86_jidian", "86五笔 (极点码表)", "五笔", "基于86五笔极点码表定制的轻量版本。"},
}

var schemasOptional = []inputSchema{
	{"double_pinyin", "自然码双拼", "双拼", "基于自然码键位图定制的双拼输入方式。"},
	{"double_pinyin_abc", "智能ABC双拼", "双拼", "基于智能ABC键位图定制的双拼输入方式。"},
	{"double_pinyin_mspy", "微软双拼", "双拼", "基于微软双拼键位图定制的双拼输入方式。"},
	{"double_pinyin_sogou", "搜狗双拼", "双拼", "基于搜狗双拼键位图定制的双拼输入方式。"},
	{"double_pinyin_ziguang", "紫光双拼", "双拼", "基于紫光双拼键位图定制的双拼输入方式。"},
}

const schemaActivationGuide = "如需开启未默认激活的方案，请参考文档: https://www.mintimate.cc/zh/guide/defaultActivationScheme.html"

// ── Static Data: Author Info ──────────────────────────────────────────────────

const authorInfoText = `# Oh My Rime 作者信息

**Mintimate**

Oh My Rime（薄荷输入法）作者，开源项目爱好者。

## 联系方式 & 社交媒体

- 博客: https://www.mintimate.cn
- GitHub: https://github.com/Mintimate
- CNB: https://cnb.cool/u/Mintimate
- Bilibili: https://space.bilibili.com/355567627
- YouTube: https://www.youtube.com/@mintimate

## 开源项目

- **Oh My Rime**: 薄荷输入法 —— 跨平台 Rime 输入法配置方案
  https://github.com/Mintimate/oh-my-rime
- **Open Kounter**: A lightweight visitor counter based on KV
  https://github.com/Mintimate/open-kounter
- **Homebrew CN**: Homebrew CN — fast one-line Homebrew installer using China mirrors
  https://github.com/Mintimate/homebrew-cn`

// ── JSON-RPC types ────────────────────────────────────────────────────────────

type mcpRequest struct {
	JSONRPC string                 `json:"jsonrpc"`
	ID      interface{}            `json:"id"`
	Method  string                 `json:"method"`
	Params  map[string]interface{} `json:"params"`
}

// ── JSON-RPC response helpers ─────────────────────────────────────────────────

func mcpOK(id interface{}, result interface{}) map[string]interface{} {
	return map[string]interface{}{"jsonrpc": "2.0", "id": id, "result": result}
}

func mcpError(id interface{}, code int, message string) map[string]interface{} {
	return map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      id,
		"error":   map[string]interface{}{"code": code, "message": message},
	}
}

func mcpText(text string) map[string]interface{} {
	return map[string]interface{}{
		"content": []map[string]interface{}{{"type": "text", "text": text}},
	}
}

func mcpErrorContent(text string) map[string]interface{} {
	return map[string]interface{}{
		"content": []map[string]interface{}{{"type": "text", "text": text}},
		"isError": true,
	}
}

// ── protocol method handlers ──────────────────────────────────────────────────

func mcpInitialize(req mcpRequest) map[string]interface{} {
	return mcpOK(req.ID, map[string]interface{}{
		"protocolVersion": mcpProtocolVersion,
		"capabilities":    map[string]interface{}{"tools": map[string]interface{}{"listChanged": false}},
		"serverInfo":      map[string]interface{}{"name": mcpServerName, "version": mcpServerVersion},
	})
}

func mcpPing(req mcpRequest) map[string]interface{} {
	return mcpOK(req.ID, map[string]interface{}{})
}

func mcpToolsList(req mcpRequest) map[string]interface{} {
	return mcpOK(req.ID, map[string]interface{}{"tools": mcpTools})
}

func mcpToolsCall(req mcpRequest, cfg config.Config) map[string]interface{} {
	name, _ := req.Params["name"].(string)
	args, _ := req.Params["arguments"].(map[string]interface{})

	fmt.Printf("[MCP] tools/call %s - args: %v\n", name, args)

	switch name {
	case "query_oh-my-rime":
		return mcpQueryKnowledge(req.ID, args, cfg)
	case "get_download_links":
		return mcpGetDownloadLinks(req.ID, args)
	case "get_author_info":
		return mcpOK(req.ID, mcpText(authorInfoText))
	case "get_schema_list":
		return mcpGetSchemaList(req.ID)
	default:
		return mcpError(req.ID, -32602, fmt.Sprintf("Unknown tool: %s", name))
	}
}

// ── tool implementations ──────────────────────────────────────────────────────

func mcpQueryKnowledge(id interface{}, args map[string]interface{}, cfg config.Config) map[string]interface{} {
	if args == nil {
		return mcpError(id, -32602, "Missing required parameter: query")
	}
	query, _ := args["query"].(string)
	if query == "" {
		return mcpError(id, -32602, "Missing required parameter: query")
	}
	kw, _ := args["keyword"].(string)
	topK := 5
	if v, ok := args["top_k"].(float64); ok {
		topK = int(math.Max(1, math.Min(10, math.Floor(v))))
	}

	result, err := knowledge.Query(cfg, query, kw, topK)
	if err != nil {
		return mcpOK(id, mcpErrorContent(fmt.Sprintf("Error querying knowledge base: %v", err)))
	}
	content := knowledge.FormatResult(result)
	if content == "" {
		content = "No results found for the given query."
	}
	return mcpOK(id, mcpText(content))
}

func mcpGetDownloadLinks(id interface{}, args map[string]interface{}) map[string]interface{} {
	resource := "all"
	if args != nil {
		if r, ok := args["resource"].(string); ok && r != "" {
			resource = r
		}
	}

	var content string
	if resource == "all" {
		content = "# Oh My Rime 下载链接\n\n以下所有镜像链接均由 CNB 提供加速，适合无法访问 GitHub 的用户。\n\n"
		for _, key := range []string{"oh-my-rime", "squirrel", "weasel", "fcitx5-rime", "wanxiang-model", "oh-my-rime-cli"} {
			item := downloadLinks[key]
			content += fmt.Sprintf("## %s\n%s\n", item.Name, item.Description)
			if item.Platform != "" {
				content += fmt.Sprintf("- 平台: %s\n", item.Platform)
			}
			content += fmt.Sprintf("- GitHub: %s\n- 镜像下载: %s\n\n---\n\n", item.GitHub, item.Mirror)
		}
	} else if item, ok := downloadLinks[resource]; ok {
		content = fmt.Sprintf("# %s\n\n%s\n", item.Name, item.Description)
		if item.Platform != "" {
			content += fmt.Sprintf("- 平台: %s\n", item.Platform)
		}
		content += fmt.Sprintf("- GitHub: %s\n- 镜像下载: %s", item.GitHub, item.Mirror)
	} else {
		keys := make([]string, 0, len(downloadLinks))
		for k := range downloadLinks {
			keys = append(keys, k)
		}
		content = fmt.Sprintf("Unknown resource: %s. Available: %s", resource, strings.Join(keys, ", "))
	}

	return mcpOK(id, mcpText(content))
}

func mcpGetSchemaList(id interface{}) map[string]interface{} {
	content := "# Oh My Rime 支持的输入方案\n\n## 默认激活的方案\n\n"
	for _, s := range schemasDefault {
		content += fmt.Sprintf("- **%s** (`%s`) [%s]: %s\n", s.Name, s.ID, s.Type, s.Description)
	}
	content += "\n## 可用但未默认激活的方案\n\n"
	for _, s := range schemasOptional {
		content += fmt.Sprintf("- **%s** (`%s`) [%s]: %s\n", s.Name, s.ID, s.Type, s.Description)
	}
	content += fmt.Sprintf("\n## 如何激活其他方案？\n\n%s", schemaActivationGuide)

	return mcpOK(id, mcpText(content))
}

// mcpDispatch routes a single JSON-RPC request. Returns nil for notifications.
func mcpDispatch(req mcpRequest, cfg config.Config) map[string]interface{} {
	switch req.Method {
	case "initialize":
		return mcpInitialize(req)
	case "ping":
		return mcpPing(req)
	case "tools/list":
		return mcpToolsList(req)
	case "tools/call":
		return mcpToolsCall(req, cfg)
	case "notifications/initialized":
		return nil
	default:
		if req.ID != nil {
			fmt.Printf("[MCP] unknown method: %s\n", req.Method)
		}
		return mcpError(req.ID, -32601, fmt.Sprintf("Method not found: %s", req.Method))
	}
}

// ── HTTP entry point ──────────────────────────────────────────────────────────

// MCPStreamable returns the Gin handler for the standard MCP Streamable HTTP transport.
func MCPStreamable(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		switch c.Request.Method {

		case http.MethodGet:
			c.Header("Cache-Control", "public, max-age=60")
			c.JSON(http.StatusOK, gin.H{
				"name":            mcpServerName,
				"version":         mcpServerVersion,
				"description":     "MCP server for Oh My Rime knowledge base. Use POST to interact.",
				"protocolVersion": mcpProtocolVersion,
				"availableTools":  mcpToolSummary(),
			})

		case http.MethodDelete:
			c.Status(http.StatusOK)

		case http.MethodPost:
			if !strings.Contains(c.GetHeader("Content-Type"), "application/json") {
				c.JSON(http.StatusUnsupportedMediaType,
					mcpError(nil, -32700, "Content-Type must be application/json"))
				return
			}
			body, err := io.ReadAll(c.Request.Body)
			if err != nil {
				c.JSON(http.StatusBadRequest, mcpError(nil, -32700, "Failed to read request body"))
				return
			}

			useSSE := strings.Contains(c.GetHeader("Accept"), "text/event-stream")
			trimmed := bytes.TrimSpace(body)

			if len(trimmed) > 0 && trimmed[0] == '[' {
				// Batch request
				var batch []mcpRequest
				if err := json.Unmarshal(body, &batch); err != nil {
					c.JSON(http.StatusBadRequest, mcpError(nil, -32700, "Parse error: Invalid JSON"))
					return
				}
				var results []map[string]interface{}
				for _, req := range batch {
					if r := mcpDispatch(req, cfg); r != nil {
						results = append(results, r)
					}
				}
				if len(results) == 0 {
					c.Status(http.StatusAccepted)
					return
				}
				if useSSE {
					writeMCPSSEBatch(c, results)
				} else {
					c.JSON(http.StatusOK, results)
				}
			} else {
				// Single request
				var req mcpRequest
				if err := json.Unmarshal(body, &req); err != nil {
					c.JSON(http.StatusBadRequest, mcpError(nil, -32700, "Parse error: Invalid JSON"))
					return
				}
				result := mcpDispatch(req, cfg)
				if result == nil {
					c.Status(http.StatusAccepted)
					return
				}
				if useSSE {
					writeMCPSSE(c, result)
				} else {
					c.JSON(http.StatusOK, result)
				}
			}

		default:
			c.JSON(http.StatusMethodNotAllowed, mcpError(nil, -32600, "Method not allowed"))
		}
	}
}

// ── SSE helpers ───────────────────────────────────────────────────────────────

func mcpToolSummary() []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(mcpTools))
	for _, t := range mcpTools {
		out = append(out, map[string]interface{}{
			"name":        t["name"],
			"description": t["description"],
		})
	}
	return out
}

func writeMCPSSE(c *gin.Context, data map[string]interface{}) {
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	b, _ := json.Marshal(data)
	fmt.Fprintf(c.Writer, "event: message\ndata: %s\n\n", string(b))
	c.Writer.Flush()
}

func writeMCPSSEBatch(c *gin.Context, data []map[string]interface{}) {
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	for _, item := range data {
		b, _ := json.Marshal(item)
		fmt.Fprintf(c.Writer, "event: message\ndata: %s\n\n", string(b))
	}
	c.Writer.Flush()
}
