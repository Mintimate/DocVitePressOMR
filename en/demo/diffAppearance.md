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
# Appearance Display <Badge type="tip" text="^2024.04" />
The appearance is mainly designed for Windows and macOS. It comes with two sets of skins: the "Blue Duck" series and the "Fresh" series:
- Light Blue: A light theme with blue tones.
- Dark Blue: A dark theme with blue tones.
- Light Green: A light theme with green tones.
- Dark Green: A dark theme with green tones.

![Appearance Display][/image/demo/themeOfOhMyRime.webp]

:::info Information

The "Blue" series is activated by default. If you want to switch to the "Green" series, you can use the [configuration override](/zh/guide/configurationOverride.html) method and override the `style/color_scheme` and `style/color_scheme_dark` configurations in the `squirrel.yaml` or `weasel.yaml` files with the "custom" option.

:::


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
  shadow_size: 0                          # 阴影大小
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

## Appearance in Android <Badge type="tip" text="^2024.05" />
If you choose the `Fcitx5 For Android`, the default color is quite good. Moreover, `Fcitx5 For Android` currently does not support changing the appearance.

If it is Trime input method, it relies on third-party input solutions and layouts. ~~You can download the Trime input method theme we made in the theme repository of Mint input method~~:

![Appearance of Trime input method](/image/demo/Trime_Mint.webp)

The solution is not in the main repository of Mint Input Method, but another repository has been opened:
- [https://github.com/Mintimate/RimeTheme](https://github.com/Mintimate/RimeTheme)

:::danger Update in May 2024

The theme adaptation of the Trime input method is quite difficult, we have been having problems based on the skin adapted by danjing; the team currently does not have the energy to maintain it. We gave up adapting the Trime theme, if you need to use it, you can use the original library theme.

The theme is based on: [https://github.com/nopdan/danjing](https://github.com/nopdan/danjing)

:::

## Appearance in iOS

If you choose the Hamster, then the built-in layout and appearance are actually very good. But if you want to pursue something different, we also use production:

![Hamster input method appearance](/image/demo/Hamster_Mint.webp)

Likewise, the scheme is not in the main repository of Mint Input Method, but in the theme repository:
- [https://github.com/Mintimate/RimeTheme](https://github.com/Mintimate/RimeTheme)


:::info Copyright Notice

This solution is based on the "渐变" theme modified by the author "咖啡☕" in the QQ group of the Hamster. The modifications include:
- Replacing the annotation code with Double Fly Input;
- Changing the key bubbles;
- Modifying some colors.

The solution was edited using an online visualization tool:
- [https://lost-melody.github.io/hamster-tools/](https://lost-melody.github.io/hamster-tools/)

The copyright information still belongs to the author "咖啡☕" and has been authorized by the author.

:::