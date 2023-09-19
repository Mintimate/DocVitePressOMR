---
layout: doc
title: Different Display On Operating Systems
head:
  - - meta
    - name: keywords
      content: oh-my-rime, demonstration, usage, appearance
description: The demonstration of oh-my-rime on different operating system platforms. It is adapted to dark and light modes, but there may be variations depending on the different operating systems and frameworks used for rime implementation.
aside: true
---
# Appearance
This primarily showcases the appearance on Windows and macOS.

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

The main configuration for colors is as follows:
```yaml
  "preset_color_schemes/MyStyleMi":
    name: 蓝水鸭／MyStyleMi
    author: Mintimate <"Mintimate's Blog">
    text_color: 0x6495ed # Pinyin string
    candidate_text_color: 0x424242 # Non-first candidate
    back_color: 0xefefef # Background
    border_color: 0xefefef # Border
    hilited_text_color: 0xed9564 # Pinyin string highlight
    hilited_back_color: 0xefefef # Pinyin string highlight background
    hilited_candidate_back_color: 0xed9564 # First candidate background
    hilited_candidate_text_color: 0xefefef # First candidate
    hilited_comment_text_color: 0xefefef # Comment text highlight
    comment_text_color: 0xcac9c8 # Comment text
    label_color: 0xcac9c8 # Candidate list number color
  "preset_color_schemes/MyStyleMiDark":
    name: 黑水鸭／MyStyleMiDark
    author: Mintimate <"Mintimate's Blog">
    text_color: 0x6495ed # Pinyin string
    candidate_text_color: 0xefefef # Non-first candidate
    back_color: 0x424242 # Background
    border_color: 0x424242 # Border
    hilited_text_color: 0xc6c01a # Pinyin string highlight
    hilited_back_color: 0x424242 # Pinyin string highlight background
    hilited_candidate_back_color: 0xc6c01a # First candidate background
    hilited_candidate_text_color: 0xefefef # First candidate
    hilited_comment_text_color: 0xffffff # Comment text highlight
    comment_text_color: 0xefefef # Comment text
    label_color: 0xefefef # Candidate list number color
```

For ibus on Linux, it is limited by the ibus configuration used on different platforms and cannot be modified. However, you can use the system's styles. For example, GNOME.

Next, let's take a look at the appearance on Windows and macOS.

## Appearance in macOS
First, let's talk about macOS. Squirrel adapts to the light and dark APIs provided by the system. Therefore, Squirrel can respond to different appearances based on the current system appearance.
![macOS外观](/image/demo/macOS_Mint.webp)

## Appearance in Windows
Next, on Windows; the system API interfaces on Windows are somewhat chaotic. It was only in the later stages of Windows 10 that the dark mode started to become more refined. Rime supports following the system's dark mode starting from version 0.15.

However, please note:
- Starting from version 0.15, Windows 8 and earlier versions are no longer supported.
- Version 0.15 is a major update that adds many features and optimizes many internal components, but it currently does not support the Arm64 architecture version of Windows.

![Windows外观](/image/demo/Windows_Mint.webp)

Due to the limitations of my Windows virtual machine (Arm64), the text in the screenshots may have some loss of precision and appear blurry.

## Appearance in Linux
As mentioned earlier, **if Linux uses ibus, it is limited by the system style and cannot be customized.** For example, using this input method configuration on GNOME:

![Linux上外观(继承主系统)](/image/demo/Linux_Mint.webp)

If you use Fcitx5, you can install the theme：[Oh-my-rime Style Theme For_Fcitx](/resources/ohMyRimeThemeForFcitx5.zip)


