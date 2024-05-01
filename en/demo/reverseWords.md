---
layout: doc
title: Reverse Lookup Function
head:
  - - meta
    - name: keywords
      content: Oh-my-rime, Mint Pinyin, function keys, reverse lookup, combination input, second translator
description: Oh-my-rime's built-in reverse lookup function helps users to input characters using other input methods, such as radical-based input, stroke-based input, and Wubi input.
aside: true
---
# Reverse Lookup Function <Badge type="tip" text="^2024.04" />
Reverse lookup, in simple terms, refers to using alternative input methods to find characters under the current input method.

Translation to English:

> 2024.04: The reverse lookup function, originally `uu/~u`, `uw/~w`, `ui/~i`, etc., has been uniformly changed to `Uu`, `Uw`, `Ui`, etc., for easy memory.
> More: <Badge type="tip">[51779acb8](https://github.com/Mintimate/oh-my-rime/commit/51779acb88a447926af451426439573d504638f7)</Badge>

For example, using Wubi to view words under the current Pinyin input method.

The Oh-my-rime (Mint Input Method's Pinyin scheme) includes three types of reverse lookup:
- Character decomposition reverse lookup (Uu)
- Wubi reverse lookup (Uw)
- Stroke-based reverse lookup (Ui)

The Wubi input supports:
- Pinyin reverse lookup (Up)

## Configuration Method
If you don't need certain reverse lookup features, you can perform reverse configuration according to this method.

Taking character decomposition reverse lookup as an example, import the decomposition scheme in the `dependencies` section at the beginning of the target input scheme:

```yaml
dependencies:
    - radical_pinyin_flypy
```

Then, introduce the `tag` in the `segmentors` and `translators` sections under `engine`.
```yaml
  segmentors:
    - ascii_segmentor # 標識西文段落
    - matcher         # 標識符合特定規則的段落，如網址、反查等
    - affix_segmentor@radical_reverse_lookup   # 引入的反查
    - abc_segmentor             # 標識常規的文字段落
    - punct_segmentor           # 標識句讀段落
    - fallback_segmentor        # 標識其他未標識段落
  translators:
   - punct_translator  # ※ 轉換標點符號
   - script_translator
   - reverse_lookup_translator@radical_reverse_lookup
```

this `tag` can be defined as follows:
```yaml
radical_reverse_lookup:
  tag: radical_lookup
  dictionary: radical_pinyin
  enable_completion: false
  enable_sentence: false
  prefix: "Uu"
  suffix: " '"
  comment_format:
    - erase/^.*$//
    - xform/([nljqxy])v/$1ü/
  tips: 〔拆字〕

reverse_lookup:
  tags: [wubi98_mint,stroke,radical_lookup]
  overwrite_comment: true
  dictionary: dicts/rime_ice.8105
```

At the end, introduce it in the `recognizer` section:
```yaml
# 反查映射
recognizer:
  import_preset: default
  patterns:
    punct: "^/([0-9]0?|[a-z]+)$"
    radical_lookup: "Uu[a-z]*'?$"
```

With that, the reverse lookup is configured.

## Radical-based Reverse Lookup

**Personally, I think this is the most practical type of reverse lookup**; In Oh-my-rime, press `Uu` to activate the radical-based input mode. Subsequent inputs will be interpreted using the radical library.

For example: When you type `Uuniuniuniu` on the keyboard, it will be interpreted as the combination of "niu niu niu," which represents three "牛" (cows) and forms the character "犇".

![Radical-based Reverse Lookup](/image/demo/reverseChaizi.webp)

## Wubi Reverse Lookup

In Oh-my-rime's Mint Pinyin mode, use `Uw` to activate the Wubi mode. Subsequent inputs will be interpreted using Wubi.

For example: When you type `Uwq` on the keyboard, it will be interpreted as `q`. In the Wubi dictionary, it automatically retrieves the character `我` (me), which is convenient for combined character lookup.

![Wubi Reverse Lookup](/image/demo/reverseWubi.webp)

The selected text translates to:

## Stroke Reverse Lookup
In Oh-my-rime's Mint Pinyin mode, use `Ui` to activate the stroke mode, and the subsequent input content will be parsed using strokes.

::: danger Countdown to Removal

Considering that the stroke input method is used by too few people. We are considering removing the stroke reverse lookup and related stroke configurations. If you are still using stroke input or reverse lookup, please be sure to contact us, otherwise we may remove the stroke category in the future.

:::

## Pinyin Reverse Lookup
In Oh-my-rime's Wubi mode, use `Up` to activate the stroke mode, and the subsequent input content will be parsed using Pinyin.