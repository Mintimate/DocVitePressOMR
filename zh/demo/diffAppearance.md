---
layout: doc
title: 不同操作系统展示效果
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,效果展示,使用效果,外观展示
description: 薄荷拼音在不同操作系统平台上的效果。适配了暗色和亮色模式，但是操作系统不同、rime实现的框架不同，可能会有所差异。
aside: true
---
# 外观展示
主要适配了Windows和macOS上的外观。

主要配置的颜色（仓库内的`squirrel.yaml`和`weasel.yaml`），参考:
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

> **! 破坏性变更:** 2024.03.02 薄荷输入法的鼠须管和小狼毫个性化配置，由默认使用`custom`文件，替换为默认使用主体配置。
>> 也就是，本来使用的是`squirrel.custom.yaml`和`weasel.custom.yaml`，转而使用`squirrel.yaml`和`weasel.yaml`。**方便用户自己自定义内容时候，可以使用`custom`文件**。

Linux上，如果使用的是的iBus，受限于不同的平台使用的iBus配置，无法进行更改，但是，可以使用系统的样式进行更改。比如： GNOME。而如果使用的是Fcitx，那么rime是继承于Fcitx的外观配置的。

目前，薄荷输入法并**没有修改iOS上仓输入法的个性化配置**。

加下来我们就看看 Windows 和 macOS 上的展示效果。

## macOS外观
首先是macOS，鼠须管适配了系统提供的亮色和暗色的API接口。所以，鼠须管可以根据系统当前的外观，响应不同的外观。
![macOS外观](/image/demo/macOS_Mint.webp)

## Windows外观
其次，在Windows上；Windows上的系统API接口比较混乱；在Win10的后期（Windows 10 1809+ ），暗色模式才逐渐完善。小狼毫在`0.15`版本后，支持跟随系统暗色模式。

但是需要注意：
- 0.15版本起，不再支持Windows8以及之前的Windows版本；
- 0.15版本是一个重大版本更新，添加了许多功能和优化内部许多组建，~~但是目前不支持Arm64架构版本的Windows~~Action版本已经支持Arm64架构的Windows。

![Windows外观](/image/demo/Windows_Mint.webp)

受限于我的Windows虚拟机(Arm64)，所以截屏内，文字存在一定的精度丢失，看起来比较模糊。

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

> 如果你使用的是0.14版本的话（Windows7只能用0.14.3），那么可能无法使用薄荷输入法的完整功能；需要把部分Lua脚本移除。

## Linux外观
正如前文所说，**Linux如果使用iBus，受限于系统样式，无法进行外观的自定义**；不过Fcitx5是可以的，比如Fcitx5的效果:

![Linux上外观(继承主系统)](/image/demo/Linux_Mint.webp)

如果你使用Fcitx5，可以安装主题：[薄荷拼音外观风格主题_Fcitx](/resources/ohMyRimeThemeForFcitx5.zip)

