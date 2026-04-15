// Package handler — Tool Use API for the frontend AI component (Function Calling flow).
//
//	GET  /api/v1/mcp/tools      — advertised tool list
//	POST /api/v1/mcp/tools/call — single tool execution
//	POST /api/v1/mcp/llm/chat   — LLM chat with optional function calling (stream or not)
package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"

	"cloud-functions/internal/config"
	"cloud-functions/internal/knowledge"
)

// ── advertised tools ──────────────────────────────────────────────────────────

var internalTools = []map[string]interface{}{
	{
		"name":        "query_knowledge_base",
		"description": "查询 Oh My Rime（薄荷输入法）知识库，根据用户的问题在知识库中检索相关内容。适用于需要查找 Rime 输入法配置、使用方法、问题排查等相关资料的场景。",
		"parameters": map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"query": map[string]interface{}{
					"type":        "string",
					"description": "需要在知识库中查询的问题或关键词",
				},
			},
			"required": []string{"query"},
		},
	},
}

// ── request / response types ──────────────────────────────────────────────────

type toolCallRequest struct {
	ToolName  string                 `json:"tool_name" binding:"required"`
	Arguments map[string]interface{} `json:"arguments"`
}

type toolCallResponse struct {
	Success bool        `json:"success"`
	Result  interface{} `json:"result,omitempty"`
	Message string      `json:"message,omitempty"`
}

type llmMessage struct {
	Role       string     `json:"role"`
	Content    string     `json:"content,omitempty"`
	ToolCalls  []llmTCall `json:"tool_calls,omitempty"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
	Name       string     `json:"name,omitempty"`
}

type llmTCall struct {
	ID       string      `json:"id"`
	Type     string      `json:"type"`
	Function llmFuncCall `json:"function"`
}

type llmFuncCall struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

type llmToolDef struct {
	Type     string     `json:"type"`
	Function llmFuncDef `json:"function"`
}

type llmFuncDef struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters"`
}

type llmChatBody struct {
	Messages []llmMessage `json:"messages" binding:"required"`
	Tools    []llmToolDef `json:"tools,omitempty"`
	Stream   bool         `json:"stream"`
}

// ── handlers ──────────────────────────────────────────────────────────────────

// ToolsList returns the advertised tool list to the frontend AI component.
func ToolsList(_ config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "tools": internalTools})
	}
}

// ToolsCall executes a single named tool and returns the result.
func ToolsCall(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req toolCallRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, toolCallResponse{Success: false, Message: "请求参数错误: " + err.Error()})
			return
		}

		switch req.ToolName {
		case "query_knowledge_base":
			query, _ := req.Arguments["query"].(string)
			if query == "" {
				c.JSON(http.StatusBadRequest, toolCallResponse{Success: false, Message: "缺少参数: query"})
				return
			}
			result, err := knowledge.Query(cfg, query, "", cfg.KnowledgeTopK)
			if err != nil {
				c.JSON(http.StatusInternalServerError, toolCallResponse{
					Success: false, Message: "知识库查询失败: " + err.Error(),
				})
				return
			}
			content := knowledge.FormatResult(result)
			if content == "" {
				c.JSON(http.StatusOK, toolCallResponse{
					Success: true,
					Result:  map[string]interface{}{"found": false, "content": "未找到相关知识库内容"},
				})
				return
			}
			c.JSON(http.StatusOK, toolCallResponse{
				Success: true,
				Result:  map[string]interface{}{"found": true, "content": content},
			})

		default:
			c.JSON(http.StatusBadRequest, toolCallResponse{
				Success: false, Message: "未知工具: " + req.ToolName,
			})
		}
	}
}

// LLMChat handles LLM chat with optional function calling.
func LLMChat(cfg config.Config, aiClient *openai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req llmChatBody
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "请求参数错误: " + err.Error()})
			return
		}

		chatReq := openai.ChatCompletionRequest{
			Model:       cfg.AIModel,
			Messages:    toOpenAIMessages(cfg, req.Messages),
			MaxTokens:   2000,
			Temperature: 0.7,
			Stream:      req.Stream,
		}
		if len(req.Tools) > 0 {
			chatReq.Tools = toOpenAITools(req.Tools)
		}

		if req.Stream {
			llmStreamHandler(c, aiClient, chatReq)
		} else {
			llmNonStreamHandler(c, aiClient, chatReq)
		}
	}
}

// ── private helpers ───────────────────────────────────────────────────────────

func llmNonStreamHandler(c *gin.Context, client *openai.Client, chatReq openai.ChatCompletionRequest) {
	resp, err := client.CreateChatCompletion(context.Background(), chatReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "LLM 调用失败: " + err.Error()})
		return
	}
	if len(resp.Choices) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "LLM 未返回回复"})
		return
	}
	choice := resp.Choices[0]
	msg := llmMessage{
		Role:    string(choice.Message.Role),
		Content: choice.Message.Content,
	}
	for _, tc := range choice.Message.ToolCalls {
		msg.ToolCalls = append(msg.ToolCalls, llmTCall{
			ID:   tc.ID,
			Type: string(tc.Type),
			Function: llmFuncCall{
				Name:      tc.Function.Name,
				Arguments: tc.Function.Arguments,
			},
		})
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": msg})
}

func llmStreamHandler(c *gin.Context, client *openai.Client, chatReq openai.ChatCompletionRequest) {
	stream, err := client.CreateChatCompletionStream(context.Background(), chatReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "LLM 流式调用失败: " + err.Error()})
		return
	}
	defer stream.Close()

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.SSEvent("connected", gin.H{"success": true, "message": "LLM 流式连接已建立"})
	c.Writer.Flush()

	for {
		select {
		case <-c.Request.Context().Done():
			return
		default:
		}

		response, err := stream.Recv()
		if err == io.EOF {
			c.SSEvent("done", gin.H{"success": true, "message": "回答完成", "finish_reason": "stop"})
			c.Writer.Flush()
			return
		}
		if err != nil {
			c.SSEvent("error", gin.H{"success": false, "message": fmt.Sprintf("流式响应错误: %v", err)})
			c.Writer.Flush()
			return
		}
		if len(response.Choices) == 0 {
			continue
		}

		choice := response.Choices[0]
		delta := map[string]interface{}{}

		if choice.Delta.Role != "" {
			delta["role"] = string(choice.Delta.Role)
		}
		if choice.Delta.Content != "" {
			delta["content"] = choice.Delta.Content
		}
		if choice.Delta.ReasoningContent != "" {
			delta["reasoning_content"] = choice.Delta.ReasoningContent
		}
		if len(choice.Delta.ToolCalls) > 0 {
			tcs := make([]map[string]interface{}, 0, len(choice.Delta.ToolCalls))
			for _, tc := range choice.Delta.ToolCalls {
				idx := 0
				if tc.Index != nil {
					idx = *tc.Index
				}
				tcMap := map[string]interface{}{"index": idx}
				if tc.ID != "" {
					tcMap["id"] = tc.ID
				}
				if tc.Type != "" {
					tcMap["type"] = string(tc.Type)
				}
				if tc.Function.Name != "" || tc.Function.Arguments != "" {
					tcMap["function"] = map[string]string{
						"name":      tc.Function.Name,
						"arguments": tc.Function.Arguments,
					}
				}
				tcs = append(tcs, tcMap)
			}
			delta["tool_calls"] = tcs
		}

		finishReason := string(choice.FinishReason)
		if finishReason == "tool_calls" {
			c.SSEvent("tool_calls", gin.H{"success": true, "finish_reason": "tool_calls"})
			c.Writer.Flush()
			continue
		}

		if len(delta) > 0 {
			chunk := map[string]interface{}{"delta": delta}
			if finishReason != "" {
				chunk["finish_reason"] = finishReason
			}
			c.SSEvent("data", chunk)
			c.Writer.Flush()
		}
	}
}

// toOpenAIMessages converts the frontend llmMessage list to go-openai format.
func toOpenAIMessages(cfg config.Config, messages []llmMessage) []openai.ChatCompletionMessage {
	hasSystem := false
	for _, m := range messages {
		if m.Role == "system" {
			hasSystem = true
			break
		}
	}

	var result []openai.ChatCompletionMessage
	if !hasSystem && cfg.RAGSystemPrompt != "" {
		result = append(result, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleSystem,
			Content: cfg.RAGSystemPrompt,
		})
	}
	for _, m := range messages {
		msg := openai.ChatCompletionMessage{Role: m.Role, Content: m.Content}
		for _, tc := range m.ToolCalls {
			msg.ToolCalls = append(msg.ToolCalls, openai.ToolCall{
				ID:   tc.ID,
				Type: openai.ToolType(tc.Type),
				Function: openai.FunctionCall{
					Name:      tc.Function.Name,
					Arguments: tc.Function.Arguments,
				},
			})
		}
		if m.Role == "tool" {
			msg.ToolCallID = m.ToolCallID
			msg.Name = m.Name
		}
		result = append(result, msg)
	}
	return result
}

// toOpenAITools converts the frontend llmToolDef list to go-openai Tool format.
func toOpenAITools(tools []llmToolDef) []openai.Tool {
	result := make([]openai.Tool, 0, len(tools))
	for _, t := range tools {
		paramBytes, err := json.Marshal(t.Function.Parameters)
		if err != nil {
			continue
		}
		result = append(result, openai.Tool{
			Type: openai.ToolTypeFunction,
			Function: &openai.FunctionDefinition{
				Name:        t.Function.Name,
				Description: t.Function.Description,
				Parameters:  json.RawMessage(paramBytes),
			},
		})
	}
	return result
}
