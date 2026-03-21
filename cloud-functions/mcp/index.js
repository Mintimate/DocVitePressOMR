/**
 * MCP Server Implementation on EdgeOne Pages Cloud Function
 *
 * Implements the Model Context Protocol (MCP) using Streamable HTTP transport.
 * Provides tools to search the project's knowledge base and retrieve
 * useful information about Oh My Rime (薄荷输入法).
 *
 * File path: cloud-functions/mcp/index.js
 * Access path: https://www.mintimate.cc/mcp
 */

// ============ Constants ============
const KNOWLEDGE_API_URL =
  "https://api.cnb.cool/Mintimate/rime/DocVitePressOMR/-/knowledge/base/query";
const KNOWLEDGE_AUTH_TOKEN = process.env.CNB_TOKEN;

const SERVER_INFO = {
  name: "oh-my-rime-knowledge-mcp",
  version: "1.1.2",
};

const SUPPORTED_PROTOCOL_VERSION = "2025-03-26";

// ============ CORS Headers ============
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

// ============ Static Data: Download Links ============
const DOWNLOAD_LINKS = {
  "oh-my-rime": {
    name: "Oh My Rime 薄荷输入法配置包",
    github: "https://github.com/Mintimate/oh-my-rime",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/oh-my-rime.zip",
    description: "薄荷输入法配置仓库完整打包，解压后导入 Rime 即可使用。",
  },
  squirrel: {
    name: "鼠须管 (Squirrel) — macOS 客户端",
    github: "https://github.com/rime/Squirrel",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Squirrel-latest.pkg",
    description: "macOS 平台的 Rime 输入法框架客户端。",
    platform: "macOS",
  },
  weasel: {
    name: "小狼毫 (Weasel) — Windows 客户端",
    github: "https://github.com/rime/weasel",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/weasel-installer-latest.exe",
    description: "Windows 平台的 Rime 输入法框架客户端。",
    platform: "Windows",
  },
  "fcitx5-rime": {
    name: "Fcitx5-Rime — macOS Fcitx5 客户端",
    github: "https://github.com/fcitx-contrib/fcitx5-macos",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Fcitx5-Rime.zip",
    description: "macOS 平台的 Fcitx5 输入法框架 Rime 客户端。",
    platform: "macOS",
  },
  "wanxiang-model": {
    name: "万象语言模型 (Wanxiang LTS)",
    github: "https://github.com/amzxyz/RIME-LMDG",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/wanxiang-lts-zh-hans.gram",
    description: "万象语言模型，可提升输入预测的准确性。",
  },
  "oh-my-rime-cli": {
    name: "Oh My Rime CLI 命令行工具",
    github: "https://cnb.cool/Mintimate/rime/oh-my-rime-cli",
    mirror: "https://cnb.cool/Mintimate/rime/oh-my-rime-cli/-/releases",
    description: "一键安装和更新薄荷输入法的 CLI 工具，支持 Windows/Linux/macOS。",
  },
};

// ============ Static Data: Input Schemas ============
const INPUT_SCHEMAS = {
  activated_by_default: [
    {
      id: "rime_mint",
      name: "薄荷拼音 (全拼)",
      type: "全拼",
      description: "招牌主打输入类型，支持各种反查、中英混合输入，词库基于雾凇拼音词库。",
    },
    {
      id: "terra_pinyin",
      name: "地球拼音",
      type: "全拼",
      description: "带声调输入的拼音方案。",
    },
    {
      id: "double_pinyin_flypy",
      name: "小鹤双拼",
      type: "双拼",
      description: "基于小鹤双拼键位图定制，支持辅码滤镜提示。",
    },
    {
      id: "wubi98_mint",
      name: "98五笔 (薄荷定制)",
      type: "五笔",
      description: "基于98五笔基础版本定制的轻量版本。",
    },
    {
      id: "wubi86_jidian",
      name: "86五笔 (极点码表)",
      type: "五笔",
      description: "基于86五笔极点码表定制的轻量版本。",
    },
  ],
  available_not_default: [
    {
      id: "double_pinyin",
      name: "自然码双拼",
      type: "双拼",
      description: "基于自然码键位图定制的双拼输入方式。",
    },
    {
      id: "double_pinyin_abc",
      name: "智能ABC双拼",
      type: "双拼",
      description: "基于智能ABC键位图定制的双拼输入方式。",
    },
    {
      id: "double_pinyin_mspy",
      name: "微软双拼",
      type: "双拼",
      description: "基于微软双拼键位图定制的双拼输入方式。",
    },
    {
      id: "double_pinyin_sogou",
      name: "搜狗双拼",
      type: "双拼",
      description: "基于搜狗双拼键位图定制的双拼输入方式。",
    },
    {
      id: "double_pinyin_ziguang",
      name: "紫光双拼",
      type: "双拼",
      description: "基于紫光双拼键位图定制的双拼输入方式。",
    },
  ],
  activation_guide: "如需开启未默认激活的方案，请参考文档: https://www.mintimate.cc/zh/guide/defaultActivationScheme.html",
};

// ============ Static Data: Author Info ============
const AUTHOR_INFO = {
  name: "Mintimate",
  description: "Oh My Rime（薄荷输入法）作者，开源项目爱好者。",
  blog: "https://www.mintimate.cn",
  github: "https://github.com/Mintimate",
  cnb: "https://cnb.cool/u/Mintimate",
  bilibili: "https://space.bilibili.com/355567627",
  youtube: "https://www.youtube.com/@mintimate",
  projects: [
    {
      name: "Oh My Rime",
      url: "https://github.com/Mintimate/oh-my-rime",
      description: "薄荷输入法 —— 跨平台 Rime 输入法配置方案",
    },
    {
      name: "Open Kounter",
      url: "https://github.com/Mintimate/open-kounter",
      description: "A lightweight visitor counter based on KV",
    },
    {
      name: "Homebrew CN",
      url: "https://github.com/Mintimate/homebrew-cn",
      description: "Homebrew CN — fast one‑line Homebrew installer using China mirrors",
    },
  ],
};

// ============ Tool Definitions ============
const TOOLS = [
  {
    name: "query_oh-my-rime",
    description:
      "Search the Oh My Rime knowledge base using semantic vector search. " +
      "Use this tool to find information about Rime input method configuration, " +
      "Mint Pinyin (薄荷输入法) usage, and related documentation. " +
      "Supports both semantic query and keyword-based search.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The search query in natural language (supports both Chinese and English). " +
            "For example: '如何配置薄荷输入法' or 'How to install Rime'",
        },
        keyword: {
          type: "string",
          description:
            "Optional keywords for search, separated by semicolons. " +
            "For example: 'macOS;安装;Rime'. When provided along with query, " +
            "both semantic and keyword matching will be combined for better results.",
        },
        top_k: {
          type: "number",
          description:
            "Maximum number of results to return (default: 5, range: 1-10). " +
            "Use a smaller value for focused answers or a larger value for comprehensive research.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_download_links",
    description:
      "Get download links for Oh My Rime related resources, including Rime client " +
      "installers (Squirrel for macOS, Weasel for Windows, Fcitx5), " +
      "Oh My Rime configuration package, Wanxiang language model, and CLI tool. " +
      "All mirror links are CDN-accelerated for users who cannot access GitHub.",
    inputSchema: {
      type: "object",
      properties: {
        resource: {
          type: "string",
          enum: [
            "all",
            "oh-my-rime",
            "squirrel",
            "weasel",
            "fcitx5-rime",
            "wanxiang-model",
            "oh-my-rime-cli",
          ],
          description:
            "Specific resource to get download link for. " +
            "Use 'all' to get all available download links (default: 'all').",
        },
      },
    },
  },
  {
    name: "get_author_info",
    description:
      "Get information about the author of Oh My Rime (薄荷输入法). " +
      "Returns author profile, blog, social media links, and open-source projects. " +
      "Useful for answering questions like 'Who made Oh My Rime?', 'How to contact the author?', " +
      "or 'What other projects does the author have?'.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_schema_list",
    description:
      "Get the list of all input schemas (输入方案) supported by Oh My Rime, " +
      "including full pinyin, double pinyin variants (Xiaohe, Sogou, Microsoft, Ziguang, etc.), " +
      "Wubi (86 and 98), and Terra Pinyin. Shows which schemas are activated by default " +
      "and which need manual activation, along with activation instructions.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// ============ Knowledge Base Client ============
async function queryKnowledgeBase(query, keyword, topK) {
  const payload = { query };
  if (keyword) {
    payload.keyword = keyword;
  }
  if (topK && topK > 0) {
    payload.top_k = topK;
  }

  const response = await fetch(KNOWLEDGE_API_URL, {
    method: "POST",
    headers: {
      Authorization: KNOWLEDGE_AUTH_TOKEN,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Knowledge base API error: ${response.status} - ${errorText}`
    );
  }

  return await response.json();
}

// ============ Helper: Create JSON Response ============
function jsonResponse(statusCode, data, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

// ============ Helper: Create SSE Response ============
function sseResponse(results) {
  const items = Array.isArray(results) ? results : [results];
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      for (const item of items) {
        controller.enqueue(
          encoder.encode(`event: message\ndata: ${JSON.stringify(item)}\n\n`)
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// ============ MCP Protocol Handlers ============

function handleInitialize(request) {
  return {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      protocolVersion: SUPPORTED_PROTOCOL_VERSION,
      capabilities: {
        tools: { listChanged: false },
      },
      serverInfo: SERVER_INFO,
    },
  };
}

function handleToolsList(request) {
  return {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      tools: TOOLS,
    },
  };
}

async function handleToolsCall(request) {
  const { name, arguments: args } = request.params;

  console.log(`[MCP] tools/call ${name} - args: ${JSON.stringify(args || {})}`);

  switch (name) {
    case "query_oh-my-rime":
      return await handleQueryTool(request.id, args);
    case "get_download_links":
      return handleDownloadLinksTool(request.id, args);
    case "get_author_info":
      return handleAuthorInfoTool(request.id);
    case "get_schema_list":
      return handleSchemaListTool(request.id);
    default:
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32602,
          message: `Unknown tool: ${name}`,
        },
      };
  }
}

function handlePing(request) {
  return {
    jsonrpc: "2.0",
    id: request.id,
    result: {},
  };
}

function createErrorResponse(id, code, message) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message },
  };
}

// ============ Tool Handlers ============

async function handleQueryTool(id, args) {
  if (!args || !args.query) {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32602,
        message:
          'Missing required parameter: query. ' +
          'Usage: {"query": "your search text", "keyword": "optional;keywords"}',
      },
    };
  }

  // 限制 top_k 范围为 1-10，默认 5
  const topK = args.top_k ? Math.max(1, Math.min(10, Math.floor(args.top_k))) : 5;

  try {
    const result = await queryKnowledgeBase(args.query, args.keyword, topK);

    // 格式化知识库搜索结果
    let content = "";
    if (result.data && Array.isArray(result.data)) {
      content = result.data
        .map((item, index) => {
          const title =
            item.metadata?.name || item.metadata?.path || "Untitled";
          const text = item.chunk || item.content || item.text || "";
          const score = item.score
            ? ` (relevance: ${item.score.toFixed(3)})`
            : "";
          const url = item.metadata?.url ? `\nSource: ${item.metadata.url}` : "";
          return `## ${index + 1}. ${title}${score}\n\n${text}${url}`;
        })
        .join("\n\n---\n\n");
    } else {
      content = JSON.stringify(result, null, 2);
    }

    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: content || "No results found for the given query.",
          },
        ],
      },
    };
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: `Error querying knowledge base: ${error.message}`,
          },
        ],
        isError: true,
      },
    };
  }
}

function handleDownloadLinksTool(id, args) {
  const resource = args?.resource || "all";

  let content = "";

  if (resource === "all") {
    content = "# Oh My Rime 下载链接\n\n" +
      "以下所有镜像链接均由 CNB 提供加速，适合无法访问 GitHub 的用户。\n\n" +
      Object.entries(DOWNLOAD_LINKS)
        .map(([key, item]) => {
          let text = `## ${item.name}\n`;
          text += `${item.description}\n`;
          if (item.platform) text += `- 平台: ${item.platform}\n`;
          text += `- GitHub: ${item.github}\n`;
          text += `- 镜像下载: ${item.mirror}`;
          return text;
        })
        .join("\n\n---\n\n");
  } else if (DOWNLOAD_LINKS[resource]) {
    const item = DOWNLOAD_LINKS[resource];
    content = `# ${item.name}\n\n${item.description}\n`;
    if (item.platform) content += `- 平台: ${item.platform}\n`;
    content += `- GitHub: ${item.github}\n`;
    content += `- 镜像下载: ${item.mirror}`;
  } else {
    content = `Unknown resource: ${resource}. Available: ${Object.keys(DOWNLOAD_LINKS).join(", ")}`;
  }

  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text: content }],
    },
  };
}

function handleSchemaListTool(id) {
  let content = "# Oh My Rime 支持的输入方案\n\n";

  content += "## 默认激活的方案\n\n";
  content += INPUT_SCHEMAS.activated_by_default
    .map((s) => `- **${s.name}** (\`${s.id}\`) [${s.type}]: ${s.description}`)
    .join("\n");

  content += "\n\n## 可用但未默认激活的方案\n\n";
  content += INPUT_SCHEMAS.available_not_default
    .map((s) => `- **${s.name}** (\`${s.id}\`) [${s.type}]: ${s.description}`)
    .join("\n");

  content += `\n\n## 如何激活其他方案？\n\n${INPUT_SCHEMAS.activation_guide}`;

  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text: content }],
    },
  };
}

function handleAuthorInfoTool(id) {
  let content = "# Oh My Rime 作者信息\n\n";
  content += `**${AUTHOR_INFO.name}**\n\n`;
  content += `${AUTHOR_INFO.description}\n\n`;
  content += "## 联系方式 & 社交媒体\n\n";
  content += `- 博客: ${AUTHOR_INFO.blog}\n`;
  content += `- GitHub: ${AUTHOR_INFO.github}\n`;
  content += `- Bilibili: ${AUTHOR_INFO.bilibili}\n`;
  content += `- YouTube: ${AUTHOR_INFO.youtube}\n`;
  content += `- Email: ${AUTHOR_INFO.email}\n`;
  content += "\n## 开源项目\n\n";
  content += AUTHOR_INFO.projects
    .map((p) => `- **${p.name}**: ${p.description}\n  ${p.url}`)
    .join("\n");

  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [{ type: "text", text: content }],
    },
  };
}

// ============ MCP Request Router ============

async function handleMCPRequest(request) {
  const { method } = request;

  switch (method) {
    case "initialize":
      return handleInitialize(request);
    case "ping":
      return handlePing(request);
    case "tools/list":
      return handleToolsList(request);
    case "tools/call":
      return await handleToolsCall(request);
    case "notifications/initialized":
      // Notification (no id), no response needed
      return null;
    default:
      return createErrorResponse(
        request.id,
        -32601,
        `Method not found: ${method}`
      );
  }
}

// ============ Request Handler (EdgeOne Pages Cloud Function) ============

export async function onRequest(context) {
  const { request } = context;
  const method = request.method.toUpperCase();

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // GET - Server info (心跳探测/服务发现)
  // 设置 60s 缓存以大幅降低高频心跳导致的请求次数消耗
  if (method === "GET") {
    return jsonResponse(200, {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      description:
        "MCP server for Oh My Rime knowledge base. Use POST method to interact.",
      protocolVersion: SUPPORTED_PROTOCOL_VERSION,
      availableTools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
    }, {
      "Cache-Control": "public, max-age=60",
    });
  }

  // DELETE - Session termination
  if (method === "DELETE") {
    return new Response(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  // POST - Main MCP message endpoint
  if (method === "POST") {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return jsonResponse(
        415,
        createErrorResponse(null, -32700, "Content-Type must be application/json")
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse(
        400,
        createErrorResponse(null, -32700, "Parse error: Invalid JSON")
      );
    }

    const acceptHeader = request.headers.get("accept") || "";
    const useSSE = acceptHeader.includes("text/event-stream");

    // 分级日志：仅记录有实际意义的请求，过滤掉协议握手和心跳噪音
    const logMethod = Array.isArray(body)
      ? body.map((r) => r.method).join(", ")
      : body.method;
    const silentMethods = ["initialize", "ping", "notifications/initialized"];
    if (!silentMethods.includes(logMethod)) {
      console.log(`[MCP] POST ${logMethod}`);
    }

    // Handle batch requests
    if (Array.isArray(body)) {
      const results = [];
      for (const mcpReq of body) {
        const result = await handleMCPRequest(mcpReq);
        if (result !== null) {
          results.push(result);
        }
      }

      if (results.length === 0) {
        return new Response(null, {
          status: 202,
          headers: CORS_HEADERS,
        });
      }

      if (useSSE) {
        return sseResponse(results);
      } else {
        return jsonResponse(200, results);
      }
    }

    // Handle single request
    const result = await handleMCPRequest(body);

    if (result === null) {
      // Notification - no response needed
      return new Response(null, {
        status: 202,
        headers: CORS_HEADERS,
      });
    }

    if (useSSE) {
      return sseResponse(result);
    } else {
      return jsonResponse(200, result);
    }
  }

  // Method not allowed
  return jsonResponse(405, createErrorResponse(null, -32600, "Method not allowed"));
}
