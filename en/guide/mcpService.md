---
layout: doc
title: AI MCP Service (Retired)
head:
  - - meta
    - name: keywords
      content: Mint Pinyin,MCP,AI,Knowledge Base,Service Retirement
  - - meta
    - property: "og:description"
      content: "The public Oh My Rime MCP service has been retired due to resource abuse, sustained traffic of 1,200,000 requests per day, and unaffordable operating costs."
description: The public Oh My Rime MCP service has been retired due to resource abuse, sustained traffic of 1,200,000 requests per day, and unaffordable operating costs.
aside: true
---

# AI MCP Service <Badge type="danger" text="Retired" />

::: warning Service retirement notice
The public Oh My Rime MCP knowledge base service has been retired.

Resource abuse led to sustained traffic of **1,200,000 requests per day**. We can no longer afford the ongoing operating costs and have therefore shut down the service.
:::

## Impact on existing users

The former endpoint, `https://www.mintimate.cc/mcp`, now serves only a static retirement notice. It no longer supports MCP initialization, tool listing, or tool calls.

If you configured this service in Cursor, Windsurf, VS Code, Claude Desktop, Cherry Studio, or another client, please remove or disable the MCP entry pointing to this address (usually named `oh-my-rime-knowledge`) to prevent further connection attempts and retries. The former setup examples have been removed.

## Continue using the documentation

You can still read the Oh My Rime configuration tutorials and usage guides on this site:

- [Configuration guide](/en/guide/)
- [Install Rime](/en/guide/installRime)
- [Import Oh My Rime](/en/guide/importMint)
- [Frequently asked questions](/en/guide/faQ)

Thank you to everyone who used this service and supported Oh My Rime. If it helped you solve a configuration problem or saved you a little trial and error, the effort was worthwhile.

We're sorry to say goodbye to the MCP service. Thank you for being part of its journey. We'll see you in the Oh My Rime documentation, and we hope your everyday typing stays smooth and enjoyable.
