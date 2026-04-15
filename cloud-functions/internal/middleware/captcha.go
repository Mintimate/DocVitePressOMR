// Package middleware 提供 Gin 中间件，包括验证码验证。
//
// 验证码中间件支持 session token 机制：
// 验证码通过后生成带签名的 session token，后续请求（如 MCP Function Calling 多轮调用）
// 可携带此 token 跳过验证码，避免重复弹出。
package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"cloud-functions/internal/captcha"
)

// sessionTokenSecret 用于签名 session token 的密钥（每次服务重启后旧 token 自动失效）
var sessionTokenSecret = generateSessionSecret()

// sessionTokenExpiry session token 有效期（5 分钟）
const sessionTokenExpiry = 5 * time.Minute

func generateSessionSecret() string {
	h := hmac.New(sha256.New, []byte("oh-my-rime-captcha-session"))
	h.Write([]byte(time.Now().String()))
	return hex.EncodeToString(h.Sum(nil))
}

// CaptchaMiddleware 验证码中间件
type CaptchaMiddleware struct {
	service *captcha.Service
}

// NewCaptchaMiddleware 创建验证码中间件实例
func NewCaptchaMiddleware(service *captcha.Service) *CaptchaMiddleware {
	return &CaptchaMiddleware{service: service}
}

// VerifyCaptcha 验证码验证中间件
func (m *CaptchaMiddleware) VerifyCaptcha() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 如果验证码服务未启用，跳过验证
		if m.service == nil || !m.service.IsEnabled() {
			c.Next()
			return
		}

		// 优先检查 session token（用于 MCP 多轮调用场景）
		sessionToken := c.GetHeader("X-Session-Token")
		if sessionToken != "" {
			if m.verifySessionToken(sessionToken, c.ClientIP()) {
				c.Next()
				return
			}
		}

		// 验证验证码
		if err := m.verifyCaptcha(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": err.Error(),
			})
			c.Abort()
			return
		}

		// 验证码通过后，生成 session token 返回给前端
		token := m.generateSessionToken(c.ClientIP())
		c.Header("X-Session-Token", token)

		c.Next()
	}
}

// generateSessionToken 生成带签名的 session token
// 格式: {clientIP}|{expireTimestamp}|{signature}
func (m *CaptchaMiddleware) generateSessionToken(clientIP string) string {
	expireAt := time.Now().Add(sessionTokenExpiry).Unix()
	payload := fmt.Sprintf("%s|%d", clientIP, expireAt)

	h := hmac.New(sha256.New, []byte(sessionTokenSecret))
	h.Write([]byte(payload))
	signature := hex.EncodeToString(h.Sum(nil))

	return fmt.Sprintf("%s|%s", payload, signature)
}

// verifySessionToken 验证 session token 的有效性
func (m *CaptchaMiddleware) verifySessionToken(token string, clientIP string) bool {
	parts := strings.SplitN(token, "|", 3)
	if len(parts) != 3 {
		return false
	}

	tokenIP := parts[0]
	expireStr := parts[1]
	signature := parts[2]

	// 验证 IP 是否匹配
	if tokenIP != clientIP {
		return false
	}

	// 验证是否过期
	expireAt, err := strconv.ParseInt(expireStr, 10, 64)
	if err != nil {
		return false
	}
	if time.Now().Unix() > expireAt {
		return false
	}

	// 验证签名
	payload := fmt.Sprintf("%s|%s", tokenIP, expireStr)
	h := hmac.New(sha256.New, []byte(sessionTokenSecret))
	h.Write([]byte(payload))
	expectedSig := hex.EncodeToString(h.Sum(nil))

	return hmac.Equal([]byte(signature), []byte(expectedSig))
}

// verifyCaptcha 根据验证码类型从请求头提取参数并验证
func (m *CaptchaMiddleware) verifyCaptcha(c *gin.Context) error {
	captchaType := m.service.GetType()
	clientIP := c.ClientIP()

	switch captchaType {
	case "cloudflare":
		token := c.GetHeader("X-Cf-Turnstile-Token")
		if token == "" {
			return fmt.Errorf("请完成 Cloudflare Turnstile 验证")
		}
		ok, err := m.service.Verify(map[string]string{"token": token, "userIP": clientIP})
		if err != nil {
			return fmt.Errorf("验证码验证失败: %v", err)
		}
		if !ok {
			return fmt.Errorf("验证码验证失败，请重新验证")
		}

	case "tencent":
		ticket := c.GetHeader("X-Captcha-Ticket")
		randstr := c.GetHeader("X-Captcha-Randstr")
		if ticket == "" || randstr == "" {
			return fmt.Errorf("请完成腾讯云验证码验证")
		}
		ok, err := m.service.Verify(map[string]string{"ticket": ticket, "randstr": randstr, "userIP": clientIP})
		if err != nil {
			return fmt.Errorf("验证码验证失败: %v", err)
		}
		if !ok {
			return fmt.Errorf("验证码验证失败，请重新验证")
		}

	case "geetest":
		lotNumber := c.GetHeader("X-Geetest-Lot-Number")
		captchaOutput := c.GetHeader("X-Geetest-Captcha-Output")
		passToken := c.GetHeader("X-Geetest-Pass-Token")
		genTime := c.GetHeader("X-Geetest-Gen-Time")
		if lotNumber == "" || captchaOutput == "" || passToken == "" || genTime == "" {
			return fmt.Errorf("请完成极验验证码验证")
		}
		ok, err := m.service.Verify(map[string]string{
			"lotNumber": lotNumber, "captchaOutput": captchaOutput,
			"passToken": passToken, "genTime": genTime,
		})
		if err != nil {
			return fmt.Errorf("验证码验证失败: %v", err)
		}
		if !ok {
			return fmt.Errorf("验证码验证失败，请重新验证")
		}

	case "google_v2", "google_v3":
		token := c.GetHeader("X-Recaptcha-Token")
		if token == "" {
			return fmt.Errorf("请完成 Google reCAPTCHA 验证")
		}
		ok, err := m.service.Verify(map[string]string{"token": token, "userIP": clientIP})
		if err != nil {
			return fmt.Errorf("验证码验证失败: %v", err)
		}
		if !ok {
			return fmt.Errorf("验证码验证失败，请重新验证")
		}

	default:
		return fmt.Errorf("不支持的验证码类型: %s", captchaType)
	}

	return nil
}
