---
layout: doc
title: Configuration Overrides and Customization
head:
  - - meta
    - name: keywords
      content: Rime Custom,Configuration Overrides,Rime Customization
description: Customization is easy to understand. The Mint Input Method is based on the Rime Input Method framework, which is essentially a set of Rime Input Method configurations. Different Rime clients have a large number of personalization configurations. Although the Mint Input Method has already made a lot of settings, there are still many configurations that have not been activated; users can configure them according to their preferences.
---
# Configuration Overrides and Customization
Customization is easy to understand. The Mint Input Method is based on the Rime Input Method framework, which is essentially a set of Rime Input Method configurations. Different Rime clients have a large number of personalization configurations. Although the Mint Input Method has already made a lot of settings, **there are still many configurations that have not been activated; users can configure them according to their preferences**.

As for overrides, **the Mint Input Method has already configured the Rime Input Method client**, but it may not suit your preferences, so **you can override it**.

## Rime's Personal Configuration Files
Rime's configurations are generally divided into two types:
- Input method application configuration: Generally, it is used to set the appearance of the client, and each client may be different. For example: set the appearance of the input method and vertical input on macOS (Squirrel) and Windows (Weasel).
- Input method scheme configuration: Set the internal configuration of the input method scheme; for example: set the form of inputting periods in half-width mode, input method paging shortcut keys, etc.

Generally speaking, if you want to customize the display appearance, you should set the "input method application configuration". On macOS, it is `squirrel.yaml` and `squirrel.custom.yaml`; on Windows, it is `weasel.yaml` and `weasel.custom.yaml`.

If you want to affect the input content and method, you should set the "input method scheme configuration". This is further divided into "global input settings (default)" and "input scheme settings (scheme)". Similarly, there are versions with and without `custom`.

> Why are there versions with and without `custom`?
>> In fact, **the one without `custom` is for configuration customization, used for configuration implementation**; **the one with `custom` is for configuration overriding, used to override certain configurations without `custom`; other content inherits the configuration without `custom`**.

## Input Method Application Configuration
First, let's look at the application configuration. This will allow us to modify the appearance of the input method.

Taking the Mint Input Method as an example, we have already installed the Mint Input Method. If you are on macOS, you can open the `squirrel.yaml` file. The Mint Input Method is already based on the official configuration: [Configuration in Squirrel source code](https://github.com/rime/squirrel/blob/master/data/squirrel.yaml).

If you don't have the `squirrel.yaml` file in your project, then the official configuration will be used. Similarly, if you are on Windows and don't have the `weasel.yaml` file, then the following will be used: [Configuration in Weasel source code](https://github.com/rime/weasel/blob/master/output/data/weasel.yaml).

Content reference (`squirrel.yaml` file excerpt reference):
```yaml
style:
  # 选择皮肤，亮色与暗色主题
  color_scheme: mint_light_blue
  color_scheme_dark: mint_dark_blue
  
  # 预设选项。如果皮肤没写，则使用这些属性；如果皮肤写了，使用皮肤的。
  text_orientation: horizontal  # horizontal | vertical
  andidate_list_layout: stacked # stacked | linear  候选项排列方向（如果你想调整为横屏，可以调整这个）
  
  # 内嵌预编辑
  inline_preedit: true
  # 选中框 圆角半径
  hilited_corner_radius: 0
  # 窗口边界高度，大于圆角半径才生效
  border_height: 0
  # 窗口边界宽度，大于圆角半径才生效
  border_width: 0
  # 外边框 圆角半径
  corner_radius: 10
  # 色彩空间： srgb | display_p3
  color_space: srgb
  line_spacing: 5
  spacing: 10
  #candidate_format: '%c. %@'
  #base_offset: 6
  # 全局字体及大小
  font_face: "PingFang SC"
  font_point: 16
  # 序号字体及大小
  label_font_face: "PingFang SC"
  label_font_point: 16
  # 注字体及大小
  comment_font_face: "PingFang SC"
  comment_font_point: 14
```
There are complete annotations inside. If you are interested, you can click on the annotations for reference.

You can directly change this file and redeploy it. You can also modify the `custom` file (if it does not exist, you can create it yourself in a directory at the same level without `custom`).

If you want to modify the `custom` file, you need to pay attention to:
- Need to use `patch` to describe at the beginning;
- When overwriting certain content, you need to use `""` to point to the specific content.

Example: Modify the layout of the squirrel tube to a horizontal layout, then `squirrel.custom.yaml` can be written like this:
```yaml
patch:
  "style/horizontal": false
```
Counterexample:
```yaml
patch:
  style:
    # 这样会把style内部的内容清空，只有一个horizontal配置
    horizontal: false
```

## Input method scheme configuration

Next, let's take a look at the "Input Method Scheme Configuration". The global configuration of the scheme is `default.yaml` and `defalut.custom.yaml`; for local, taking the Mint input method as an example, `rime_mint.scheme.yaml` is A local configuration. The configuration of `default.yaml` can be overridden in `rime_mint.scheme.yaml`.

Relative to the scheme, you can also override the configuration of `rime_mint.scheme.yaml` based on `rime_mint.custom.yaml`.

So, the priority is:
`rime_mint.custom.yaml > rime_mint.scheme.yaml > default.custom.yaml > default.yaml`

Currently, the Mint input method does not specify `default.yaml`; it directly inherits the configuration that comes with Rime; on the contrary, it uses `default.custom.yaml` to override the global configuration. In the scheme input method, in the corresponding It's customizable.

If you want to modify the `custom` file, you need to pay attention to:
- Need to use `patch` to describe at the beginning;
- When overwriting certain content, you need to use `""` to point to the specific content.

Example: Override the global input scheme configuration and set the number of candidates to 6:
```yaml
patch:
  "menu/page_size": 6
```
Counterexample:
```yaml
patch:
  menu:
    # 这样会把menu内容清空，只有一个page_size配置
    page_size: 6
```