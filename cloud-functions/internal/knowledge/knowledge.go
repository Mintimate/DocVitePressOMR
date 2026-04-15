// Package knowledge provides a client for querying the CNB vector knowledge base
// and utilities for formatting the results as LLM-ready Markdown context.
package knowledge

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"cloud-functions/internal/config"
)

// Query sends a semantic (vector) search request to the CNB knowledge base API.
//
//   - keyword is optional; multiple keywords should be semicolon-separated.
//   - topK ≤ 0 omits the field so the server uses its own default.
func Query(cfg config.Config, query, keyword string, topK int) (map[string]interface{}, error) {
	payload := map[string]interface{}{"query": query}
	if keyword != "" {
		payload["keyword"] = keyword
	}
	if topK > 0 {
		payload["top_k"] = topK
	}
	data, _ := json.Marshal(payload)

	req, err := http.NewRequest(http.MethodPost, cfg.KnowledgeAPIURL, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", cfg.KnowledgeToken)
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("knowledge API %d: %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return map[string]interface{}{"raw": string(body)}, nil
	}
	return result, nil
}

// FormatResult renders the knowledge base JSON response as a numbered Markdown
// document suitable for injection into an LLM prompt as RAG grounding context.
func FormatResult(result map[string]interface{}) string {
	if result == nil {
		return ""
	}
	dataArr, ok := result["data"].([]interface{})
	if !ok || len(dataArr) == 0 {
		raw, _ := json.MarshalIndent(result, "", "  ")
		return string(raw)
	}
	parts := make([]string, 0, len(dataArr))
	for i, item := range dataArr {
		m, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		meta, _ := m["metadata"].(map[string]interface{})
		title := field(meta, "name", "path")
		if title == "" {
			title = "Untitled"
		}
		text := field(m, "chunk", "content", "text")
		score := ""
		if s, ok := m["score"].(float64); ok {
			score = fmt.Sprintf(" (relevance: %.3f)", s)
		}
		src := ""
		if u := field(meta, "url"); u != "" {
			src = "\nSource: " + u
		}
		parts = append(parts, fmt.Sprintf("## %d. %s%s\n\n%s%s", i+1, title, score, text, src))
	}
	return strings.Join(parts, "\n\n---\n\n")
}

// field returns the first non-empty string value found in m for the given keys.
func field(m map[string]interface{}, keys ...string) string {
	if m == nil {
		return ""
	}
	for _, k := range keys {
		if v, ok := m[k].(string); ok && v != "" {
			return v
		}
	}
	return ""
}
