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
# Reverse Lookup Function
Reverse lookup, in simple terms, refers to using alternative input methods to find characters under the current input method.

For example, using Wubi to view words under the current Pinyin input method.

Oh-my-rime includes three types of reverse lookup:
- Radical-based reverse lookup (uu)
- Wubi reverse lookup (uw)
- Stroke-based reverse lookup (ui)

In the near future, Pinyin reverse lookup (up) is expected to be adapted, making it convenient for Wubi users to perform Pinyin reverse lookup within the Wubi input mode.

## Radical-based Reverse Lookup
**Personally, I think this is the most practical type of reverse lookup**. In Oh-my-rime, press `uu` to activate the radical-based input mode. Subsequent inputs will be interpreted using the radical library.

For example, typing `uuniuniuniu` on the keyboard will be interpreted as the combination of "niu niu niu," which represents three "牛" (cows) and forms the character "犇":
![Radical-based Reverse Lookup](/image/demo/reverseChaizi.webp)

## Wubi Reverse Lookup

In Oh-my-rime's Mint Pinyin mode, use `uw` to activate the Wubi mode. Subsequent inputs will be interpreted using Wubi.

For example, typing `uuq` on the keyboard will be interpreted as the combination for "q" and automatically retrieve the character "我" (me) for convenient combination lookup:

![Wubi Reverse Lookup](/image/demo/reverseWubi.webp)

## Stroke-based Reverse Lookup

In Oh-my-rime's Mint Pinyin mode, use `ui` to activate the stroke mode. Subsequent inputs will be interpreted using strokes.