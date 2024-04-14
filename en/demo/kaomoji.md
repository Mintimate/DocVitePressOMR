---
layout: doc
title: Kaomoji Input
head:
  - - meta
    - name: keywords
      content: Mint Pinyin, Kaomoji, Kaomoji Dictionary, Rime Kaomoji
description: Use the Kaomoji dictionary in Mint input method to input Kaomoji. Kaomoji can also be output on the Rime input method.
aside: true
---

# Kaomoji
Kaomoji (Emoticon or Kaomoji) is a type of emoticon created using printable characters and punctuation marks on the keyboard. They are arranged and combined to simulate human facial expressions, emotions, postures, or shapes of objects. These symbols were originally invented to enhance the emotional expression of written text in network communication, especially widely used in emails, forums, instant messaging software, and social media platforms.

::: info Trivia
In English, there are two different corresponding words for Kaomoji, which are "emoticon" and "kaomoji".
- Emoticon: Originated from English, it is an abbreviation of "emotion icon", which refers to graphic expressions formed by characters, punctuation marks, or simple combinations of letters and numbers on the keyboard, used to express emotions. For example, the earliest :-) represents a smile, :-( represents sadness.
- Kaomoji: This term comes from Japanese, referring to more complex and visually detailed emoticons, often containing stronger directional characters, which can form faces, animal faces, or other images with emotional meanings. For example, Kaomoji like (´▽`ʃƪ) or (╯°□°）╯︵ ┻━┻ not only include expressions, but can also depict emotional states or scenes, and are usually more figurative than traditional Western emoticons.
:::

## Mint Implementation
There are many ways to implement Kaomoji in Rime, such as using OpenCC to replace the input content.

How is Kaomoji implemented in Mint? Here, a special prefix (essentially implemented by the [dictionary](https://github.com/Mintimate/oh-my-rime/blob/main/dicts/other_kaomoji.dict.yaml)) is used, which is `VV`. After entering this prefix in the input method, you can select Kaomoji within the input method.
```yaml
# Rime dictionary
# encoding: utf-8
#
# 「Rime词库扩展计划」  by @imy0823
#  Mintimate修改:
#    - 修改前导词为VV
#    - 增加颜文字词库

---
name: other_kaomoji
version: "2024.04.06"
sort: by_weight
...

<(￣︶￣)↗ 	V V	100
╳╳○○	V V	100
(╯—﹏—)╯（ ┷━━━┷ 	V V	100
(￣∇￣)	V V	100
(｡>ㅅ<｡)	V V	100
```

If you want to customize it yourself, you can refer to the format of this dictionary and add Kaomoji on your own.

## Effect Display
Below are some displays of Kaomoji effects. You can enter `VV` in the input method and then select Kaomoji (it's best to scroll up and down to choose).
![Kaomoji Effect Display](/image/demo/kaomojiDemo.webp)