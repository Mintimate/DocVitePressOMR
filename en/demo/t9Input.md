---
layout: doc
title: T9 (Nine-Key) Input
head:
  - - meta
    - name: keywords
      content: oh-my-rime,T9 input,nine-key,Hamster IME,mobile input,Chinese T9
description: Demo of the built-in T9 (nine-key) input scheme in oh-my-rime. Designed for iOS Hamster IME and Yuan Shu IME, it brings the full Mint dictionary experience to mobile nine-key input.
aside: true
---

# T9 (Nine-Key) Input <Badge type="tip" text="^2026.03" />

Oh-my-rime includes a built-in T9 (nine-key) input scheme, primarily designed for **iOS Hamster IME** and **Yuan Shu IME** users, bringing the full Mint dictionary experience to mobile nine-key input.

::: info What is T9 Input?
T9 is the classic mobile phone input method: the keyboard has only 9 number keys, each corresponding to multiple letters (e.g., `2` = `ABC`, `3` = `DEF`). You press number keys and the IME predicts candidate words based on the key combinations.
:::

## Scheme Features

The Mint T9 scheme (`t9.schema.yaml`) is built on top of the Mint full-pinyin scheme and inherits its core features:

| Feature | Description |
| --- | --- |
| **Dictionary** | Shares the same dictionary (`rime_mint`) as Mint full-pinyin |
| **Lua Features** | Supports time/date/solar terms, calculator, etc. |
| **Emoji** | Supports Emoji input |
| **Simplified/Traditional** | Supports switching between Simplified and Traditional Chinese |
| **Word Separator** | Press `1` to manually insert a word separator |

## Demo

### Basic Input

On a nine-key keyboard, press number keys to input the digit sequence corresponding to the pinyin, and the IME will automatically match candidate words.

For example
For example, to type「你好」(nǐ hǎo):
- `你` = `nǐ` → initial `n`(6) + final `i`(4) → press `64`
- `好` = `hǎo` → initial `h`(4) + final `ao`(26) → press `426`

### Word Separation

When the candidate doesn't match your intent, press `1` to manually insert a separator, splitting the input into multiple independent pinyin segments:

```
Input: 64 1 426
Parse: ni | hao → 你好
```

### Lua Features

The T9 scheme also supports Lua function keys. Use the digit sequence corresponding to the letter codes:

| Feature | Letter Code | Nine-Key Digits |
| --- | --- | --- |
| Time | `osj` | `674` |
| Date | `orq` | `677` |
| Lunar Calendar | `onl` | `665` |
| Day of Week | `oxq` | `697` |
| Calculator | `=expression` | `=expression` |

## Platform Support

The T9 scheme is primarily used on:

- **iOS Hamster IME**: Native nine-key keyboard layout support, best experience
- **Yuan Shu IME**: Also supports nine-key layout

::: warning Desktop Note
On desktop platforms (Windows/macOS/Linux), the T9 scheme can be loaded but without a nine-key keyboard layout, the experience is essentially the same as full-pinyin. Desktop users are recommended to use the Mint full-pinyin or double-pinyin schemes.
:::

## Activating the Scheme

The T9 scheme is activated by default in oh-my-rime. You can view it in `default.yaml`:

```yaml
# The following content may be overridden by default.custom.yaml and schema configurations
## T9 depends on rime_mint; if you need to use other schemes (e.g., T9 for Xiaohe Double Pinyin), 
## you can override with a custom file
schema_list:
  - schema: rime_mint            # Mint Pinyin
  - schema: double_pinyin_flypy  # Xiaohe Double Pinyin
  - schema: rime_mint_flypy      # Mint Pinyin-Xiaohe Mixed Input
  - schema: terra_pinyin         # Terra Pinyin-Mint Custom
  - schema: wubi98_mint          # Wubi 98-Wubi Xiaozhu
  - schema: wubi86_jidian        # Wubi 86-Jidian 86
  - schema: t9                   # Hamster T9-Full Pinyin
  # The following schemes are adapted by Mint but not activated by default
  # - schema: double_pinyin_abc    # Smart ABC Double Pinyin
  # - schema: double_pinyin_mspy   # Microsoft Double Pinyin
  # - schema: double_pinyin_sogou  # Sogou Double Pinyin
  # - schema: double_pinyin_ziguang # Ziguang Double Pinyin
  # - schema: double_pinyin         # Natural Code Double Pinyin
```

If the T9 scheme is not in your scheme list, add it to `default.yaml` or `default.custom.yaml`:

```yaml
# default.custom.yaml
patch:
  schema_list:
    - schema: rime_mint
    - schema: t9          # Add T9 scheme
```

You also need to enable the T9 scheme (Input Scheme Settings) and the nine-key layout (Keyboard Settings - Keyboard Layout - Chinese 9-Key). For Yuan Shu IME reference: [Yuan Shu IME - T9 Configuration](https://ihsiao.com/apps/hamster/v3/docs/guides/chinese-ninekey-configuration/).
