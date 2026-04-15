#!/usr/bin/env bash
# =========================================================
#  本地开发一键启动脚本
#  同时启动 Go 后端 (cloud-functions) 和 VitePress 前端
#  按 Ctrl+C 可同时关闭两个服务
# =========================================================

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/cloud-functions"

# 清理函数：关闭所有子进程
cleanup() {
    echo ""
    echo -e "${YELLOW}[终止]${NC} 正在关闭所有服务..."
    if [ ! -z "${BACKEND_PID:-}" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
        echo -e "${GREEN}[后端]${NC} Go 服务已停止 (PID: $BACKEND_PID)"
    fi
    if [ ! -z "${FRONTEND_PID:-}" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
        echo -e "${GREEN}[前端]${NC} VitePress 服务已停止 (PID: $FRONTEND_PID)"
    fi
    echo -e "${GREEN}[完成]${NC} 所有服务已关闭"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  Oh My Rime 本地开发环境启动脚本${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# 1. 检查依赖
echo -e "${YELLOW}[检查]${NC} 检查 Go 环境..."
if ! command -v go &>/dev/null; then
    echo -e "${RED}[错误]${NC} 未安装 Go，请先安装: https://go.dev/dl/"
    exit 1
fi

echo -e "${YELLOW}[检查]${NC} 检查 Node.js 环境..."
if ! command -v node &>/dev/null; then
    echo -e "${RED}[错误]${NC} 未安装 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi

# 2. 检查并安装 Go 依赖
echo -e "${YELLOW}[后端]${NC} 检查 Go 依赖..."
cd "$BACKEND_DIR"
if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}[后端]${NC} 下载 Go 依赖 (go mod download)..."
    go mod download
else
    echo -e "${GREEN}[后端]${NC} 检测到 vendor 目录，跳过依赖下载"
fi
cd "$PROJECT_ROOT"

# 3. 检查并安装前端依赖
echo -e "${YELLOW}[前端]${NC} 检查 Node 依赖..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[前端]${NC} 安装前端依赖 (npm install)..."
    npm install
else
    echo -e "${GREEN}[前端]${NC} 检测到 node_modules 目录，跳过依赖安装"
fi

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}  启动服务...${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# 加载 .env 文件中的环境变量（Go 后端不会自动读取 .env）
# 这样 AI_BASE_URL、AI_API_KEY、AI_MODEL 等后端必需变量才能生效
# 注意：不能用 source，因为 .env 中的值可能含有括号等 shell 特殊字符
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${GREEN}[环境]${NC} 加载 .env 文件..."
    while IFS= read -r line || [ -n "$line" ]; do
        # 跳过空行和注释
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        # 只处理 KEY=VALUE 格式的行
        if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
            export "$line"
        fi
    done < "$PROJECT_ROOT/.env"
else
    echo -e "${YELLOW}[警告]${NC} 未找到 .env 文件，请确保环境变量已正确设置"
fi

# 设置本地开发环境变量，覆盖 .env 中的生产配置
# 确保前端 AI 聊天组件能正确定位到本地 Go 后端
export AI_API_URL=http://localhost:9000/api/v1/chat/stream
export AI_MCP_BASE_URL=http://localhost:9000/api/v1/mcp
export AI_ENABLE_CAPTCHA=true
export AI_CAPTCHA_APP_ID=${CAPTCHA_APP_ID:-189904202}

# 4. 启动 Go 后端
echo -e "${GREEN}[后端]${NC} 启动 Go 服务 (端口 :9000)..."
cd "$BACKEND_DIR"
go run index.go &
BACKEND_PID=$!
cd "$PROJECT_ROOT"

# 等待后端启动
sleep 2

# 检查后端是否成功启动
if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo -e "${RED}[错误]${NC} Go 后端启动失败"
    exit 1
fi

echo -e "${GREEN}[后端]${NC} Go 服务已启动 (PID: $BACKEND_PID, http://localhost:9000)"

# 5. 启动 VitePress 前端
echo -e "${GREEN}[前端]${NC} 启动 VitePress 开发服务器..."
npm run dev &
FRONTEND_PID=$!

# 等待前端启动
sleep 3

# 检查前端是否成功启动
if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo -e "${RED}[错误]${NC} VitePress 前端启动失败"
    kill "$BACKEND_PID" 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${GREEN}  ✅ 所有服务启动成功！${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""
echo -e "  ${GREEN}后端 API${NC}:  http://localhost:9000"
echo -e "  ${GREEN}前端页面${NC}:  http://localhost:5173 (或查看上方输出)"
echo -e "  ${GREEN}健康检查${NC}:  http://localhost:9000/api/v1/health"
echo ""
echo -e "${YELLOW}  按 Ctrl+C 停止所有服务${NC}"
echo ""

# 等待任一子进程结束
wait -n 2>/dev/null || wait

# 如果到这里说明有服务异常退出
echo -e "${RED}[警告]${NC} 有服务异常退出，正在关闭其他服务..."
cleanup
