---
layout: doc
title: 配置覆写和定制
head:
  - - meta
    - name: keywords
      content: Rime Custom文件,Rime配置覆写,Rime定制配置
description: 在Rime内，如何基于已经拥有的配置，定制化内容？覆写部分配置呢？本文以薄荷输入法配置为例
---
# 配置覆写和定制
定制很好理解，薄荷输入法基于Rime输入法框架，实际就是一套Rime输入法配置；不同的Rime客户端都有大量的个性化配置，虽然薄荷输入法已经进行了大量的设置，但是**还有很多配置并没有激活；用户可以根据自己的喜好进行配置**。

至于覆写，就是**薄荷输入法已经对Rime输入法的客户端进行了配置**，但是可能不符合你的喜好，那么**你可以对其进行覆写**。

## Rime的个性配置文件
Rime的配置总体分为两种：
- 输入法的应用配置: 一般是设置客户端的外观，每个客户端可能有所不一样。比如: macOS(鼠须管)和Windows(小狼毫)上设置输入法的外观和纵向输入等。
- 输入法方案配置: 设置输入法的方案内部的配置；比如: 设置在半角的情况下输入句号的形式、输入法翻页快捷键等。

一般来讲，如果是想自定义外观展示的，那么就设置「输入法的应用配置」，macOS上就是`squirrel.yaml`和`squirrel.custom.yaml`；而Windows上就是`weasel.yaml`和`weasel.custom.yaml`。

对于想影响输入的内容和方式，那么就是设置「输入法方案配置」，这个由分为「全局输入设置(default)」和「输入方案设置(scheme)」；同样，作为设置也有带`custom`和不带`custom`的。

> 为什么都有`带custom`和`不带custom`的两种呢？ 
>> 其实，**不带custom的是配置的定制，用于实现配置**；**带custom的则是配置的覆写，用于覆写不带custom的某些配置；其他内容继承不带custom配置**。

## 输入法的应用配置
首先，我们看看应用的配置。方便我们把输入法的外观进行修改。

以薄荷输入法为例，我们已经安装了薄荷输入法，如果在macOS上，可以打开`squirrel.yaml`这个文件。薄荷输入法已经基于官方的配置: [鼠须管源码内的配置](https://github.com/rime/squirrel/blob/master/data/squirrel.yaml)

如果你的项目里没有`squirrel.yaml`这个文件，那么就会使用官方的配置。同理，如果你在Windows上，没有`weasel.yaml`这个文件，那么就是使用: [小狼毫源码内的配置](https://github.com/rime/weasel/blob/master/output/data/weasel.yaml)

内容参考(`squirrel.yaml`文件节选参考):
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
内部都有完善的注释，感兴趣可以按注释进行参考。

你可以直接更改这个文件后，重新部署。也可以修改`custom`文件（如果没有，那么可以自行在不带`custom`的同级目录创建）。

如果你想修改`custom`文件，需要注意:
- 开头需要使用`patch`进行描述；
- 覆写某些内容时，需要使用`""`指向到具体的内容。

举例: 修改鼠须管的布局为横向布局，那么`squirrel.custom.yaml`可以这样写: 
```yaml
patch:
  "style/horizontal": false
```
反例:
```yaml
patch:
  style:
    # 这样会把style内部的内容清空，只有一个horizontal配置
    horizontal: false
```

## 输入法方案配置

接下来，我们看看「输入法方案配置」，方案的全局配置是`default.yaml`和`defalut.custom.yaml`；对于局部，以薄荷输入法为例，`rime_mint.schema.yaml`就是一个局部配置。在`rime_mint.schema.yaml`内可以覆写`default.yaml`的配置。

相对于方案，你也可以基于`rime_mint.custom.yaml`去覆写`rime_mint.schema.yaml`的配置。

所以，优先级是:
`rime_mint.custom.yaml > rime_mint.schema.yaml > default.custom.yaml > default.yaml`

目前，薄荷输入法并并没有指定`default.yaml`；是直接继承Rime自带的配置；相反，是使用`default.custom.yaml`覆写了全局的配置，在方案输入法内，在对其进行定制。

如果你想修改`custom`文件，需要注意:
- 开头需要使用`patch`进行描述；
- 覆写某些内容时，需要使用`""`指向到具体的内容。

举例: 覆写全局的输入方案配置，设置候选为6个:
```yaml
patch:
  "menu/page_size": 6
```
反例:
```yaml
patch:
  menu:
    # 这样会把menu内容清空，只有一个page_size配置
    page_size: 6
```