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


Colors of the main configuration (in `squirrel.yaml` and `weasel.yaml` in the repository), reference:
```yaml
# 亮色模式
mint_light_blue:
  name: "蓝水鸭／Mint Light Blue"
  author: Mintimate <"Mintimate's Blog">
  translucency: false                     # 磨砂： false | true
  mutual_exclusive: false                 # 色不叠加： false | true
  shadow_size: 0                       `  # 阴影大小
  line_spacing: 5                         # 行间距
  base_offset: 0                          # 字基高
  alpha: 1                                # 透明度，0~1
  spacing: 10                             # 拼音与候选项之间的距离 （inline_preedit: false）
  back_color: 0xefefef                    # 底色
  hilited_candidate_back_color: 0xed9564  # 选中底色
  label_color: 0xcac9c8                   # 序号颜色
  hilited_candidate_label_color: 0xefefef # 选中序号颜色
  candidate_text_color: 0x424242          # 文字颜色
  hilited_candidate_text_color: 0xefefef  # 选中文字颜色
  comment_text_color: 0xcac9c8            # 注颜色
  hilited_comment_text_color: 0xefefef    # 选中注颜色
  text_color: 0x6495ed                    # 拼音颜色 （inline_preedit: false）
  hilited_text_color: 0xed9564            # 选中拼音颜色 （inline_preedit: false）

# 暗色模式
mint_dark_blue:
  name: "黑水鸭／Mint Dark Blue"
  author: Mintimate <"Mintimate's Blog">
  translucency: false                     # 磨砂： false | true
  mutual_exclusive: false                 # 色不叠加： false | true
  shadow_size: 0                       `  # 阴影大小
  line_spacing: 5                         # 行间距
  base_offset: 0                          # 字基高
  alpha: 1                                # 透明度，0~1
  spacing: 10                             # 拼音与候选项之间的距离 （inline_preedit: false）
  back_color: 0x424242                    # 底色
  hilited_candidate_back_color: 0xc6c01a  # 选中底色
  label_color: 0xefefef                   # 序号颜色
  hilited_candidate_label_color: 0xefefef # 选中序号颜色
  candidate_text_color: 0xefefef          # 文字颜色
  hilited_candidate_text_color: 0xefefef  # 选中文字颜色
  comment_text_color: 0xefefef            # 注颜色
  hilited_comment_text_color: 0xffffff    # 选中注颜色
  text_color: 0x6495ed                    # 拼音颜色 （inline_preedit: false）
  hilited_text_color: 0xc6c01a            # 选中拼音颜色 （inline_preedit: false）
```

> **!Breaking change:** On 2024.03.02, the personalized configuration of Squirrel and Weasel in Sogou Pinyin Input Method will be changed from using the `custom` file by default to using the main configuration.
>> That is, instead of using `squirrel.custom.yaml` and `weasel.custom.yaml`, `squirrel.yaml` and `weasel.yaml` will be used. **When users want to customize their own content, they can use the `custom` file.**

On Linux, if iBus is used, it is not possible to make changes due to the different iBus configurations used by different platforms. However, you can use the system's style to make changes. For example: GNOME. If Fcitx is used, Rime inherits the appearance configuration of Fcitx.

Currently, Sogou Pinyin Input Method **does not modify the personalized configuration of the iOS version.**

Next, let's take a look at the display effects on Windows and macOS.

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

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

## Appearance in Linux
As mentioned earlier, **if Linux uses ibus, it is limited by the system style and cannot be customized.** For example, using this input method configuration on GNOME:

![Linux上外观(继承主系统)](/image/demo/Linux_Mint.webp)

If you use Fcitx5, you can install the theme：[Oh-my-rime Style Theme For_Fcitx](/resources/ohMyRimeThemeForFcitx5.zip)


