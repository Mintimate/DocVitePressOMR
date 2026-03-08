---
layout: doc
title: Symbols Input & Configuration
head:
  - - meta
    - name: keywords
      content: Rime symbols input,Rime special symbols,Rime symbols.yaml,oh-my-rime symbols
description: How to quickly input special symbols in oh-my-rime? This article details the symbols.yaml configuration and usage of symbol input.
---

# Symbols Input & Configuration

Oh-my-rime includes a rich set of symbol input features. Through the `symbols.yaml` configuration file, users can use the `/` leader key to quickly input various special symbols, including math symbols, arrows, stars, currencies, Greek letters, and more.

## Basic Usage

In Chinese input mode, type `/` followed by the corresponding abbreviation code to bring up the symbol candidate list. For example:

| Input | Category | Example Symbols |
|-------|----------|----------------|
| `/fh` | Symbols/Computer | ©, ®, ☎, ☯, ♻ |
| `/dn` | Computer Keys | ⌘, ⌥, ⇧, ⌫, ⏏ |
| `/xq` | Chess | ♔, ♕, ♖, ♗, ♘, ♙ |
| `/pk` | Poker | ♠, ♡, ♢, ♣, ♤, ♥ |
| `/bq` | Emoticons | ☻, ☺, ☹ |
| `/tq` | Weather | ☀, ☁, ⛅, ☂, ☔ |
| `/yy` | Music | 𝄞, ♩, ♪, ♫, ♬ |
| `/jt` | Arrows | ←, →, ↑, ↓, ↔, ⇐, ⇒ |
| `/sx` | Math | ±, ÷, ×, √, ∞, ∑ |
| `/xh` | Stars | ★, ☆, ✡, ❋, ✿ |
| `/jh` | Geometry | ■, □, ▲, △, ●, ○ |
| `/fk` | Blocks | ▀, ▁, ▂, ░, ▒, ▓ |

## Numbers & Numbering Symbols

Oh-my-rime supports quick input of various number variants:

| Input | Category | Examples |
|-------|----------|----------|
| `/0` ~ `/10` | Number Variants | 〇/零/⓪, 一/壹/①/❶ |
| `/szq` | Circled Numbers | ⓪, ①, ②, ③ ... ㊿ |
| `/szh` | Parenthesized Numbers | ⑴, ⑵, ⑶ ... ⒇ |
| `/szd` | Numbers with Period | ⒈, ⒉, ⒊ ... ⒛ |
| `/zmq` | Circled Letters | ⓐ, Ⓐ, ⓑ, Ⓑ ... |
| `/zmh` | Parenthesized Letters | ⒜, ⒝, ⒞ ... ⒵ |
| `/fs` | Fractions | ½, ⅓, ¼, ⅕ ... |
| `/lm` | Roman Numerals (lower) | ⅰ, ⅱ, ⅲ ... ⅿ |
| `/lmd` | Roman Numerals (upper) | Ⅰ, Ⅱ, Ⅲ ... Ⅿ |

## Cultural Symbols

| Input | Category | Examples |
|-------|----------|----------|
| `/bg` | Bagua Trigrams | ☰, ☱, ☲, ☳, ☴, ☵, ☶, ☷ |
| `/tg` | Heavenly Stems | 甲, 乙, 丙, 丁 ... 癸 |
| `/dz` | Earthly Branches | 子, 丑, 寅, 卯 ... 亥 |
| `/gz` | Stems and Branches | 甲子, 乙丑 ... 癸亥 |
| `/jq` | Solar Terms | 立春, 雨水, 惊蛰 ... 大寒 |
| `/xz` | Zodiac Signs | ♈, ♉, ♊ ... ♓ |
| `/xzm` | Zodiac Names | 白羊座, 金牛座 ... 双鱼座 |

## Language & Script Symbols

| Input | Category | Examples |
|-------|----------|----------|
| `/xl` | Greek (lower) | α, β, γ, δ ... ω |
| `/xld` | Greek (upper) | Α, Β, Γ, Δ ... Ω |
| `/ey` | Russian (lower) | а, б, в, г ... я |
| `/eyd` | Russian (upper) | А, Б, В, Г ... Я |
| `/py` | Pinyin Tones | ā, á, ǎ, à, ō, ó ... |
| `/zy` | Zhuyin | ㄅ, ㄆ, ㄇ, ㄈ ... |
| `/jm` | Japanese Hiragana | あ, い, う, え, お ... |
| `/pjm` | Japanese Katakana | ア, イ, ウ, エ, オ ... |
| `/hw` | Korean | ㄱ, ㄴ, ㄷ, ㄹ ... |

## Latin Extended Characters

Type `/a` through `/z` or `/A` through `/Z` to input various variants of the corresponding letter (with diacritics, accents, etc.), for example:

- `/a`: ā, á, ǎ, à, â, ä, å, ã ...
- `/e`: ē, é, ě, è, ê, ë, ẽ ...
- `/u`: ū, ú, ǔ, ù, û, ü, ǖ, ǘ, ǚ, ǜ ...

Ligatures are also supported:
- `/ae`: æ, ǣ, ǽ
- `/oe`: œ
- `/fi`: ﬁ, `/fl`: ﬂ

## Other Useful Symbols

| Input | Category | Examples |
|-------|----------|----------|
| `/sb` | Superscript | ⁰, ¹, ², ³, ᵃ, ᵇ ... |
| `/xb` | Subscript | ₀, ₁, ₂, ₃, ₐ, ₑ ... |
| `/dw` | Units | Å, ℃, ‰, ㎏, ㎡, ㎝ ... |
| `/hb` | Currency | ￥, $, €, £, ₩, ₹ ... |
| `/bd` | Punctuation | ―, ‼, ¿, 々, 〃, 〆 ... |
| `/jg` | CJK Structure | ⿰, ⿱, ⿲, ⿳ ... |
| `/pp` | Radicals | 亻, 冫, 氵, 扌, 忄 ... |
| `/kx` | Kangxi Radicals | 一, 丨, 丶, 丿, 乙 ... |
| `/bh` | Strokes | ㇀, ㇁, ㇂ ... |

## Half-width Punctuation Configuration

Oh-my-rime defines half-width punctuation mappings in `symbols.yaml`. In the schema file, it is referenced as follows:

```yaml
punctuator:
  import_preset: symbols
  half_shape:
    "#": "#"
    "*": "*"
    '.' : { commit: 。 }
    "`": "`"
    "~": "~"
    "@": "@"
    "=": "="
    "/": ["/", "÷"]
    '\': "、"
    "'": {pair: ["「", "」"]}
    "[": ["【", "["]
    "]": ["】", "]"]
```

Where `import_preset: symbols` loads the configuration from `symbols.yaml` first, then the `half_shape` in the schema file overrides specific mappings.

## Custom Symbols

If you want to add your own symbol mappings, you can override them through a custom file. Taking Mint Pinyin as an example, create `rime_mint.custom.yaml`:

```yaml
patch:
  # Add custom symbols
  "punctuator/symbols//email": [📧, ✉, 📨, 📩]
  "punctuator/symbols//phone": [📱, ☎, 📞, 📲]
```

Now typing `/email` or `/phone` will bring up the corresponding symbol candidates.

To modify existing half-width punctuation mappings, e.g., changing `\` to output `/`:

```yaml
patch:
  "punctuator/half_shape/\\": "/"
```

::: tip Note
Symbol input requires the `punct` rule in `recognizer`. Oh-my-rime has this configured by default:
```yaml
recognizer:
  patterns:
    punct: "^/([0-9]0?|[a-zA-Z]+)$"
```
This means only `/` followed by numbers (0-90) or letters will trigger symbol input mode.
:::

## Complete Symbol Reference

<details>
<summary>Click to expand the full symbol code list</summary>

| Code | Category | Code | Category |
|------|----------|------|----------|
| `/fh` | Symbols/Computer | `/dn` | Computer Keys |
| `/xq` | Chess | `/mj` | Mahjong |
| `/sz` | Dice | `/pk` | Poker |
| `/bq` | Emoticons | `/tq` | Weather |
| `/yy` | Music | `/lx` | Gender |
| `/bg` | Bagua | `/bgm` | Bagua Names |
| `/lssg` | 64 Hexagrams | `/lssgm` | 64 Hexagram Names |
| `/txj` | Taixuanjing | `/tt` | Celestial Bodies |
| `/xz` | Zodiac | `/xzm` | Zodiac Names |
| `/seg` | 12 Houses | `/xh` | Stars |
| `/fk` | Blocks | `/jh` | Geometry |
| `/jt` | Arrows | `/sx` | Math |
| `/szq` | Circled Numbers | `/szh` | Parenthesized Numbers |
| `/szd` | Dotted Numbers | `/zmq` | Circled Letters |
| `/zmh` | Parenthesized Letters | `/fs` | Fractions |
| `/0`~`/10` | Number Variants | `/szm` | Suzhou Numerals |
| `/lm` | Roman (lower) | `/lmd` | Roman (upper) |
| `/a`~`/z` | Latin (lower) | `/A`~`/Z` | Latin (upper) |
| `/sb` | Superscript | `/xb` | Subscript |
| `/xl` | Greek (lower) | `/xld` | Greek (upper) |
| `/ey` | Russian (lower) | `/eyd` | Russian (upper) |
| `/yf` | Months | `/rq` | Dates |
| `/yr` | Days of Week | `/sj` | Time |
| `/tg` | Heavenly Stems | `/dz` | Earthly Branches |
| `/gz` | Stems & Branches | `/jq` | Solar Terms |
| `/dw` | Units | `/hb` | Currency |
| `/jg` | CJK Structure | `/pp` | Radicals |
| `/kx` | Kangxi Radicals | `/bh` | Strokes |
| `/bd` | Punctuation | `/bdz` | Vertical Punctuation |
| `/py` | Pinyin | `/zy` | Zhuyin |
| `/sd` | Tone Marks | `/hzq` | Circled CJK |
| `/hzh` | Parenthesized CJK | `/jm` | Hiragana |
| `/pjm` | Katakana | `/jmq` | Circled Kana |
| `/jmbj` | Half-width Kana | `/hw` | Korean |
| `/hwq` | Circled Korean | `/hwh` | Parenthesized Korean |

</details>
