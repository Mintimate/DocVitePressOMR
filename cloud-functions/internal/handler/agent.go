package handler

import (
	"bufio"
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"cloud-functions/internal/config"
)

type agentChatRequest struct {
	Message        string `json:"message"`
	Query          string `json:"Query"`
	Context        string `json:"context"`
	ConversationID string `json:"conversation_id"`
}

type agentSSEEvent struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

var agentConversationIDPattern = regexp.MustCompile(`^[0-9A-Za-z_.-]{6,36}$`)

func AgentChat(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		req, ok := bindAgentChatRequest(c)
		if !ok {
			return
		}

		resp, conversationID, err := createAgentRequest(c.Request.Context(), cfg, req)
		if err != nil {
			c.JSON(http.StatusBadGateway, chatResponse{Success: false, Message: err.Error()})
			return
		}
		defer resp.Body.Close()

		c.Header("X-Agent-Conversation-Id", conversationID)
		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
			c.JSON(http.StatusBadGateway, chatResponse{Success: false, Message: string(body)})
			return
		}

		answer, err := collectAgentAnswer(resp.Body)
		if err != nil {
			c.JSON(http.StatusBadGateway, chatResponse{Success: false, Message: err.Error()})
			return
		}
		c.JSON(http.StatusOK, chatResponse{Success: true, Answer: answer})
	}
}

func AgentStreamChat(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		req, ok := bindAgentChatRequest(c)
		if !ok {
			return
		}

		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.Header("X-Accel-Buffering", "no")

		resp, conversationID, err := createAgentRequest(c.Request.Context(), cfg, req)
		c.Header("X-Agent-Conversation-Id", conversationID)
		if err != nil {
			writeAgentSSE(c, agentSSEEvent{Type: "error_message", Content: err.Error()})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
			writeAgentSSE(c, agentSSEEvent{
				Type:    "error_message",
				Content: fmt.Sprintf("Agent service returned HTTP %d: %s", resp.StatusCode, strings.TrimSpace(string(body))),
			})
			return
		}

		if err := copyAgentStream(c, resp.Body); err != nil && c.Request.Context().Err() == nil {
			writeAgentSSE(c, agentSSEEvent{Type: "error_message", Content: err.Error()})
			return
		}
	}
}

func bindAgentChatRequest(c *gin.Context) (agentChatRequest, bool) {
	var req agentChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, chatResponse{Success: false, Message: "请求参数错误: " + err.Error()})
		return req, false
	}
	if strings.TrimSpace(req.Message) == "" {
		req.Message = strings.TrimSpace(req.Query)
	}
	if strings.TrimSpace(req.Message) == "" {
		c.JSON(http.StatusBadRequest, chatResponse{Success: false, Message: "message is required"})
		return req, false
	}
	return req, true
}

func createAgentRequest(ctx context.Context, cfg config.Config, req agentChatRequest) (*http.Response, string, error) {
	conversationID := normalizeAgentConversationID(req.ConversationID)
	payload, _ := json.Marshal(map[string]string{
		"message": strings.TrimSpace(req.Message),
		"context": req.Context,
	})

	upstreamReq, err := http.NewRequestWithContext(ctx, http.MethodPost, cfg.AgentBaseURL+"/chat", bytes.NewReader(payload))
	if err != nil {
		return nil, conversationID, err
	}
	upstreamReq.Header.Set("Accept", "text/event-stream")
	upstreamReq.Header.Set("Content-Type", "application/json; charset=utf-8")
	upstreamReq.Header.Set("makers-conversation-id", conversationID)

	client := &http.Client{Timeout: 0}
	resp, err := client.Do(upstreamReq)
	if err != nil {
		return nil, conversationID, err
	}
	return resp, conversationID, nil
}

func collectAgentAnswer(reader io.Reader) (string, error) {
	scanner := bufio.NewScanner(reader)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	var answer strings.Builder
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "" || data == "[DONE]" {
			continue
		}

		var event agentSSEEvent
		if err := json.Unmarshal([]byte(data), &event); err != nil {
			continue
		}
		switch event.Type {
		case "ai_response":
			answer.WriteString(event.Content)
		case "error_message":
			return "", errors.New(event.Content)
		}
	}
	if err := scanner.Err(); err != nil {
		return "", err
	}
	return answer.String(), nil
}

func copyAgentStream(c *gin.Context, reader io.Reader) error {
	buffer := make([]byte, 8192)
	for {
		n, err := reader.Read(buffer)
		if n > 0 {
			if _, writeErr := c.Writer.Write(buffer[:n]); writeErr != nil {
				return writeErr
			}
			c.Writer.Flush()
		}
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return err
		}
	}
}

func normalizeAgentConversationID(value string) string {
	value = strings.TrimSpace(value)
	if agentConversationIDPattern.MatchString(value) {
		return value
	}

	random := make([]byte, 8)
	if _, err := rand.Read(random); err == nil {
		return "agent-" + hex.EncodeToString(random)
	}
	return fmt.Sprintf("agent-%d", time.Now().UnixNano())
}

func writeAgentSSE(c *gin.Context, event agentSSEEvent) {
	data, _ := json.Marshal(event)
	_, _ = c.Writer.Write([]byte("data: "))
	_, _ = c.Writer.Write(data)
	_, _ = c.Writer.Write([]byte("\n\n"))
	c.Writer.Flush()
}
