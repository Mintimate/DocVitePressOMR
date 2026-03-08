---
layout: doc
title: Chinese-English Mixed Input
head:
  - - meta
    - name: keywords
      content: oh-my-rime,Chinese-English mixed input,melt_eng,cn_en,bilingual input
description: Oh-my-rime supports Chinese-English mixed input, allowing you to type English words directly in Chinese input mode without switching. Demo of the mixed dictionary and English sub-translator features.
aside: true
---

# Chinese-English Mixed Input <Badge type="tip" text="^2026.03" />

Oh-my-rime supports typing English words directly in Chinese input mode without manually switching the IME. This is achieved through two mechanisms: the **Chinese-English mixed dictionary** and the **English sub-translator**.

## Two Mechanisms

### Chinese-English Mixed Dictionary (cn_en)

The `cn_en` dictionary contains a large collection of common Chinese-English mixed terms, such as brand names and proper nouns:

```
哆啦A梦
iPhone
MacBook
Wi-Fi
GitHub
```

When you type the pinyin of these terms, the candidate list will directly show the mixed Chinese-English words.

### English Sub-Translator (melt_eng)

`melt_eng` is a lightweight English dictionary embedded as a sub-translator in the Chinese scheme. It allows you to type English words directly in Chinese mode.

::: tip
::: tip Difference from Switching to English Mode
- **English sub-translator**: Type in Chinese mode; English candidates are mixed with Chinese candidates. Best for occasional English word input.
- **Switch to English mode** (Shift or Caps Lock): Fully switches to English input. Best for typing large amounts of English continuously.
:::

## Demo

### Brand Names and Proper Nouns

When typing `pingguo`, the candidate list shows both「苹果」and「Apple」.

### Auto-Capitalization

Oh-my-rime includes `autocap_filter.lua`, which automatically recognizes English abbreviations and converts them to uppercase:

- Type `usa` → `USA` appears in candidates
- Type `cpu` → `CPU` appears in candidates

### English Frequency Reduction

To prevent English words from interfering with Chinese input, oh-my-rime uses `reduce_english_filter.lua` to reduce the priority of certain short English words:

- Type `rug` → 「如果」(rúguǒ) ranks above `rug`
- Type `and` → Chinese words rank above `and`

This preserves English input capability while preventing English words from occupying the top Chinese candidate positions.

## Configuration

Chinese-English mixed input is enabled by default in oh-my-rime. You can adjust the behavior via `custom` files:

### Disable the English Sub-Translator

```yaml
# rime_mint.custom.yaml
patch:
  # Remove melt_eng from translators
  "engine/translators/@7": {}
```

### Adjust English Frequency Reduction Mode

```yaml
# rime_mint.custom.yaml
patch:
  reduce_english_filter:
    mode: none    # none: no reduction | all: reduce all | custom: custom list
```

### Add Custom Chinese-English Mixed Terms

Refer to the [Customization Input](/en/guide/customizationInput.html) guide for how to add custom terms to `dicts/custom_simple.dict.yaml`:

```yaml
# dicts/custom_simple.dict.yaml
ChatGPT	chat g p t	100
VSCode	v s code	100
```
