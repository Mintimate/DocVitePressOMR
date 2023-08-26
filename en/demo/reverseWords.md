---
layout: doc
title: Reverse Lookup Function 
aside: true
---

# Reverse Lookup Function

Reverse lookup, simply put, is the use of alternative input methods to search for character inputs within the current input method.

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

Here's an example: using the Wubi input method to view words under the current Pinyin input method.

Oh-My-Rime includes three reverse lookup functions:

- Character decomposition reverse lookup
- Wubi reverse lookup
- Stroke count reverse lookup

## Character Decomposition Reverse Lookup

<u>Personally, I believe this is the most practical reverse lookup function</u>. In Oh-My-Rime, under the Chinese input method mode, activate the character decomposition mode by entering `uw`, and the subsequent input will be parsed using the character decomposition library.

For example, if you type `uuniuniuniu` on the keyboard, it will be parsed as a combination of `niu niu niu`, which means three `牛` characters: `犇`. Of course, two `牛` characters also form a word:
![Two cows](/image/demo/ChaiNiu2.webp)
![Three cows](/image/demo/ChaiNiu3.webp)

## Wubi Reverse Lookup

In Oh-My-Rime, under the Chinese input method mode, activate the Wubi mode by entering `uw`, and the subsequent input will be parsed using Wubi.

For example, if you type `uuq` on the keyboard, it will automatically find the character `我` (meaning "I" or "me"); it facilitates searching for characters by combination.

## Stroke Count Reverse Lookup

In Oh-My-Rime, under the Chinese input method mode, activate the stroke mode by entering `ui`, and the subsequent input will be parsed using stroke count.