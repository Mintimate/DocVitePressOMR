// Package handler implements HTTP handlers for all API routes.
//
// This file covers the RAG (Retrieval-Augmented Generation) chat endpoints:
//
//	POST /api/v1/chat        — non-streaming RAG answer
//	POST /api/v1/chat/stream — streaming RAG answer (SSE)
package handler

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"

	"cloud-functions/internal/config"
	"cloud-functions/internal/knowledge"
)

// ── request / response types ──────────────────────────────────────────────────

type chatRequest struct {
	Query string `json:"Query" binding:"required"`
}

type chatResponse struct {
	Success bool   `json:"success"`
	Answer  string `json:"answer,omitempty"`
	Message string `json:"message,omitempty"`
}

// ── handlers ──────────────────────────────────────────────────────────────────

// RagChat handles non-streaming RAG chat:
// query knowledge base → call LLM with context → return JSON.
func RagChat(cfg config.Config, aiClient *openai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req chatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, chatResponse{Success: false, Message: "请求参数错误: " + err.Error()})
			return
		}

		knowledgeCtx := ""
		if result, err := knowledge.Query(cfg, req.Query, "", cfg.KnowledgeTopK); err == nil {
			knowledgeCtx = knowledge.FormatResult(result)
		}

		resp, err := aiClient.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
			Model:       cfg.AIModel,
			Messages:    buildRAGMessages(cfg, req.Query, knowledgeCtx),
			MaxTokens:   2000,
			Temperature: 0.7,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, chatResponse{Success: false, Message: "AI 服务暂时不可用"})
			return
		}
		if len(resp.Choices) == 0 {
			c.JSON(http.StatusInternalServerError, chatResponse{Success: false, Message: "AI 未返回回复"})
			return
		}
		c.JSON(http.StatusOK, chatResponse{Success: true, Answer: resp.Choices[0].Message.Content})
	}
}

// RagStreamChat handles streaming RAG chat over SSE.
// Supports DeepSeek-R1 style reasoning_content with <think>/<answer> markers.
func RagStreamChat(cfg config.Config, aiClient *openai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req chatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, chatResponse{Success: false, Message: "请求参数错误: " + err.Error()})
			return
		}

		knowledgeCtx := ""
		if result, err := knowledge.Query(cfg, req.Query, "", cfg.KnowledgeTopK); err == nil {
			knowledgeCtx = knowledge.FormatResult(result)
		}

		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.SSEvent("connected", gin.H{"success": true, "message": "连接已建立，开始处理..."})
		c.Writer.Flush()

		stream, err := aiClient.CreateChatCompletionStream(context.Background(), openai.ChatCompletionRequest{
			Model:       cfg.AIModel,
			Messages:    buildRAGMessages(cfg, req.Query, knowledgeCtx),
			MaxTokens:   2000,
			Temperature: 0.7,
			Stream:      true,
		})
		if err != nil {
			c.SSEvent("error", gin.H{"success": false, "message": "AI 服务暂时不可用"})
			c.Writer.Flush()
			return
		}
		defer stream.Close()

		var reasoningStarted, reasoningEnded, answerStarted bool
		for {
			select {
			case <-c.Request.Context().Done():
				return
			default:
			}

			response, err := stream.Recv()
			if err == io.EOF {
				if reasoningStarted && !reasoningEnded {
					c.SSEvent("data", gin.H{"content": "</think>"})
				}
				if !answerStarted {
					c.SSEvent("data", gin.H{"content": "<answer>"})
				}
				c.SSEvent("done", gin.H{"success": true, "message": "回答完成"})
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

			delta := response.Choices[0].Delta

			// Reasoning content (DeepSeek-R1 style).
			if delta.ReasoningContent != "" {
				if !reasoningStarted {
					c.SSEvent("data", gin.H{"content": "<think>"})
					reasoningStarted = true
				}
				c.SSEvent("data", gin.H{"content": delta.ReasoningContent})
				c.Writer.Flush()
			}

			// Answer content.
			if delta.Content != "" {
				if reasoningStarted && !reasoningEnded {
					c.SSEvent("data", gin.H{"content": "</think>"})
					reasoningEnded = true
				}
				if !answerStarted {
					c.SSEvent("data", gin.H{"content": "<answer>"})
					answerStarted = true
				}
				c.SSEvent("data", gin.H{"content": delta.Content})
				c.Writer.Flush()
			}
		}
	}
}

// ── private helpers ───────────────────────────────────────────────────────────

// buildRAGMessages assembles the LLM message list:
// system prompt → optional knowledge context + user query.
func buildRAGMessages(cfg config.Config, query, knowledgeCtx string) []openai.ChatCompletionMessage {
	msgs := []openai.ChatCompletionMessage{
		{Role: openai.ChatMessageRoleSystem, Content: cfg.RAGSystemPrompt},
	}
	content := query
	if knowledgeCtx != "" {
		content = fmt.Sprintf("参考知识库内容：\n%s\n\n用户问题：%s", knowledgeCtx, query)
	}
	return append(msgs, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: content,
	})
}
