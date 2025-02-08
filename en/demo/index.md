---
layout: doc
title: Effect Demonstration
head:
  - - meta
    - name: keywords
      content: oh-my-rime, function keys, shortcuts, Lua effects
  - - meta
    - property: "og:image"
      content: "https://www.mintimate.cc/image/demo/guide.webp"
description: Based on the rime input method framework, preview the effects and appearance after installing oh-my-rime. It showcases specific features supported by oh-my-rime, such as Emoji input, character decomposition reverse lookup input, Wubi reverse lookup input, stroke reverse lookup input, in addition to dictionary functionality.
aside: true
---

# Demonstration Effect
![Simple demonstration effect](/image/demo/guide.webp)

This section will showcase the adaptation and usage effects of the Mint Input Method.

> Tip: It was originally called "Mint Pinyin", but after adapting to "98 Wubi", "86 Wubi", "Terra Pinyin" and "Double Fly Pinyin", it feels more appropriate to call it "Mint Input Method" ✪ω✪. Of course, it should actually be called 'Mint Input Configuration', but 'Mint Input Method' sounds better.

GitHub repository address: [oh-my-rime: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

Mirror repository address (if you cannot access GitHub): [oh-my-rime: https://gitlab.mintimate.cn/Mintimate/oh-my-rime](https://gitlab.mintimate.cn/Mintimate/oh-my-rime)

::: tip
In essence, the Mint input method is a set of input configurations for Rime. Therefore, **this website is also an unofficial Rime configuration document**.

<donate lang="en"/>

:::

## Platform Support
Oh-my-rime currently supports the following desktop platforms:
- Windows: Rime framework input method for Windows -- [Weasel](https://github.com/rime/weasel)
- macOS: Rime framework input method for macOS -- [Squirrel](https://github.com/rime/squirrel)
- Linux: ibus framework and fcitx can be used on Linux
- iOS: [Hamster input method (App Store)](https://apps.apple.com/cn/app/%E4%BB%93%E8%BE%93%E5%85%A5%E6%B3%95/id6446617683)
- Android:
  - [Fcitx5 Android: https://fcitx-im.org/wiki/Fcitx_5/zh-cn](https://fcitx-im.org/wiki/Fcitx_5/zh-cn)
  - [Trime: https://github.com/osfans/trime](https://github.com/osfans/trime)

## Supported Input Methods
Currently, three input types are supported within two major categories:
- Full Pinyin class
  - Mint Pinyin: The flagship input type, supporting various reverse lookups, mixed Chinese-English input, and a rich full-spelling input experience. The dictionary is based on the [Rime-ice Pinyin dictionary](https://github.com/iDvel/rime-ice).
  - Terra Pinyin Mint Customization: Based on Earth Pinyin with additional customizations; the dictionary automatically synchronizes with Rime-ice Pinyin and uses the [Python pypinyin library](https://pypinyin.readthedocs.io/) for conversion.
- Double Pinyin class
  - Flypy Mint Customization: Customized based on [Flypy Double Pinyin](https://flypy.com/) (phonetic-graphic), with additional customizations. The dictionary uses Rime-ice Pinyin.
  - Flypy Mint Customization: Based on Flypy Double Pinyin, with additional customizations; the dictionary also uses Rime-ice Pinyin. Supports phonetic-graphic (auxiliary code) input, with the `;` key activating graphic input by default. If you are not used to `;`, you can reconfigure the activation key. If you need a complete phonetic and graphic mixed input, you can introduce Flypy phonetic-graphic and extend the `abc_segmentor` scheme.
- Stroke class
  - 98 Wubi Mint Customization: Customized based on the [98 Wubi](https://github.com/yanhuacuo/98wubi-tables) to meet the needs of Wubi input; a **lightweight version of 98 Wubi**. If you need a complete experience of 98 Wubi, you can try the original repository.
  - 86 Wubi Mint Customization: Customized based on the [86 Wubi](https://github.com/KyleBing/rime-wubi86-jidian) to meet the needs of Wubi input; a **lightweight version of 86 Wubi**. Similarly, if you need a complete experience of 86 Wubi, you can try the original repository.

Oh-my-rime has already adapted and integrated, but by default, the following input types are not activated:
- Double Pinyin class
  - Natural code: Customized input method based on [Natural code(wiki)](https://zh.wikipedia.org/zh/%E8%87%AA%E7%84%B6%E7%A0%81).
  - Intelligent ABC: Customized input method based on [Intelligent ABC(wiki)](https://zh.wikipedia.org/wiki/%E6%99%BA%E8%83%BDABC%E8%BE%93%E5%85%A5%E6%B3%95).
  - Microsoft double spelling: Customized input method based on Microsoft double spelling key map.
  - Sogou double spelling: Customized input method based on Sogou double spelling key map.
  - Zhiguang double spelling: Customized input method based on Zhiguang double spelling key map.

If you need to activate them, you can refer to: [Customize the default activation scheme](/en/guide/defaultActivationScheme.html)

## Supported Features
Currently supported features include:
- Functionality
    - Supports light and dark theme styles, automatically switching based on the system theme on Windows (Windows 10 1809+) and macOS.
    - Chinese input supporting Traditional Chinese (Taiwan style) and Simplified Chinese.
    - Mixed Chinese-English input, e.g., inputting "DoraA Dream".
    - Supports Emoji and [Kaomoji](kaomoji.html).
    - Supports [multiple reverse lookup inputs](reverseWords.html): Pinyin supports character decomposition (Uu) reverse lookup input, Wubi (Uw) reverse lookup input, stroke (Ui) reverse lookup input; Wubi supports Pinyin (Up) reverse lookup input.   
    - Supports quick input of [dates, days of the week, times, lunar dates, and Chinese numerals](funcKeys.html).
- The dictionary of Pinyin benefits from using [Rime-ice Pinyin](https://github.com/iDvel/rime-ice)
    - The Table of General Standard Chinese Characters
    - Huayu Cloud Wind system dictionary
    - Tsinghua University open-source dictionary
    - The Modern Chinese Frequency Dictionary
    - The Contemporary Chinese Dictionary
    - The Synonymous Dictionary
    - The Xinhua Dictionary of Chinese Idioms
    - Tencent Word Vectors

## Special Thanks
The construction of Mint Input Method is inseparable from the support of the following projects:
- [Rime-ice: https://github.com/iDvel/rime-ice](https://github.com/iDvel/rime-ice)
- [98 Wubi: https://github.com/yanhuacuo/98wubi-tables](https://github.com/yanhuacuo/98wubi-tables)
- [86 Wubi: https://github.com/KyleBing/rime-wubi86-jidian](https://github.com/KyleBing/rime-wubi86-jidian)

Special thanks to the following individuals for their help and authorization:
- [yanhuacuo](https://github.com/yanhuacuo), the maintainer of 98 Wubi
- [iDvel](https://github.com/iDvel) and [mirtlecn](https://github.com/mirtlecn), the maintainers of Rime-ice Pinyin
- [KyleBing](https://github.com/KyleBing), the maintainer of 86 Wubi