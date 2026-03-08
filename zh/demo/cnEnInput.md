---
layout: doc
title: 中英混合输入
head:
  - - meta
    - name: keywords
      content: 薄荷输入法,中英混合,中英文混输,英文输入,melt_eng,cn_en
description: 薄荷输入法支持中英混合输入，可以在中文输入模式下直接输入英文单词，无需切换输入法。演示薄荷的中英混合词库和英文输入功能。
aside: true
---

# 中英混合输入 <Badge type="tip" text="^2026.03" />

薄荷输入法支持在中文输入模式下直接输入英文单词，无需手动切换输入法。这一功能通过两套机制共同实现：**中英混合词库**和**英文子翻译器**。

## 两种机制

### 中英混合词库（cn_en）

`cn_en` 词库收录了大量常见的中英混合词汇，如品牌名、专有名词等：

```
哆啦A梦
iPhone
MacBook
Wi-Fi
GitHub
```

当你输入这些词的拼音时，候选项中会直接出现包含英文的混合词。

### 英文子翻译器（melt_eng）

`melt_eng` 是一个轻量级英文词典，作为子翻译器嵌入中文方案中。它让你在中文模式下也能直接输入英文单词。

::: tip
::: tip 与切换到英文模式的区别
- **英文子翻译器**：在中文模式下输入，英文候选词会与中文候选词混合显示，适合偶尔需要输入英文单词的场景
- **切换英文模式**（Shift 或 Caps Lock）：完全切换到英文输入，适合需要连续输入大量英文的场景
:::

## 效果展示

### 输入品牌和专有名词

输入 `pingguo` 时，候选项中会出现「苹果」和「Apple」等混合候选。

### 英文自动大写

薄荷内置了 `autocap_filter.lua`，可以自动识别英文缩写并转换为大写形式：

- 输入 `usa` → 候选中出现 `USA`
- 输入 `cpu` → 候选中出现 `CPU`

### 英文降频

为了避免英文单词干扰中文输入，薄荷使用 `reduce_english_filter.lua` 对部分短英文单词进行降频处理：

- 输入 `rug` → 「如果」排在 `rug` 前面
- 输入 `and` → 「按道」等中文词排在 `and` 前面

这样既保留了英文输入能力，又不会让英文单词抢占中文候选的位置。

## 配置说明

中英混合输入在薄荷中默认已启用，无需额外配置。如需调整行为，可以通过 `custom` 文件覆写：

### 关闭英文子翻译器

```yaml
# rime_mint.custom.yaml
patch:
  # 从 translators 中移除 melt_eng
  "engine/translators/@7": {}
```

### 调整英文降频模式

```yaml
# rime_mint.custom.yaml
patch:
  reduce_english_filter:
    mode: none    # none: 不降频 | all: 降频所有 | custom: 自定义
```

### 添加自定义中英混合词

参考 [输入个性定制](/zh/guide/customizationInput.html) 中的词库编写章节，可以在 `dicts/custom_simple.dict.yaml` 中添加自定义的中英混合词汇：

```yaml
# dicts/custom_simple.dict.yaml
ChatGPT	chat g p t	100
VSCode	v s code	100
```
