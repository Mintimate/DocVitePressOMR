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
	_ "embed"
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

// ── embed static text content ─────────────────────────────────────────────────

//go:embed static/author_info.md
var authorInfoText string

//go:embed static/download_links.md
var downloadLinksText string

//go:embed static/schema_list.md
var schemaListText string

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
		"inputSchema": map[string]interface{}{"type": "object", "properties": map[string]interface{}{}},
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
		return mcpOK(req.ID, mcpText(downloadLinksText))
	case "get_author_info":
		return mcpOK(req.ID, mcpText(authorInfoText))
	case "get_schema_list":
		return mcpOK(req.ID, mcpText(schemaListText))
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
