/**
 * MCP Server Implementation on EdgeOne Pages Cloud Function
 *
 * Implements the Model Context Protocol (MCP) using Streamable HTTP transport.
 * Provides a "query_oh-my-rime" tool to search the project's knowledge base.
 *
 * File path: cloud-functions/mcp/index.js
 * Access path: example.com/mcp
 */

// ============ Constants ============
const KNOWLEDGE_API_URL =
  "https://api.cnb.cool/Mintimate/rime/DocVitePressOMR/-/knowledge/base/query";
const KNOWLEDGE_AUTH_TOKEN = process.env.CNB_TOKEN;

const SERVER_INFO = {
  name: "oh-my-rime-knowledge-mcp",
  version: "1.0.0",
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
      },
      required: ["query"],
    },
  },
];

// ============ Knowledge Base Client ============
async function queryKnowledgeBase(query, keyword) {
  const payload = { query };
  if (keyword) {
    payload.keyword = keyword;
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

  if (name !== "query_oh-my-rime") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32602,
        message: `Unknown tool: ${name}`,
      },
    };
  }

  if (!args || !args.query) {
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32602,
        message:
          'Missing required parameter: query. ' +
          'Usage: {"query": "your search text", "keyword": "optional;keywords"}',
      },
    };
  }

  try {
    const result = await queryKnowledgeBase(args.query, args.keyword);

    // Format knowledge base results into readable text
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
      // Return raw JSON if format is unexpected
      content = JSON.stringify(result, null, 2);
    }

    return {
      jsonrpc: "2.0",
      id: request.id,
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
      id: request.id,
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

  // GET - Server info
  if (method === "GET") {
    return jsonResponse(200, {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      description:
        "MCP server for Oh My Rime knowledge base. Use POST method to interact.",
      protocolVersion: SUPPORTED_PROTOCOL_VERSION,
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
