---
layout: doc
title: 不同操作系统展示效果
aside: true
---
# 外观展示
主要适配了Windows和macOS上的外观。

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

主要配置的颜色，参考:
```yaml
  "preset_color_schemes/MyStyleMi":
    name: 蓝水鸭／MyStyleMi
    author: Mintimate <"Mintimate's Blog">
    text_color: 0x6495ed #拼音串
    candidate_text_color: 0x424242 # 非第一候选项
    back_color: 0xefefef # 背景
    border_color: 0xefefef # 边框
    hilited_text_color: 0xed9564 # 拼音串高亮
    hilited_back_color: 0xefefef # 拼音串高亮背景
    hilited_candidate_back_color: 0xed9564 # 第一候选项背景
    hilited_candidate_text_color: 0xefefef # 第一候选项
    hilited_comment_text_color: 0xefefef # 注解文字高亮
    comment_text_color: 0xcac9c8 # 注解文字
    label_color: 0xcac9c8 # 预选栏编号颜色
  "preset_color_schemes/MyStyleMiDark":
    name: 黑水鸭／MyStyleMiDark
    author: Mintimate <"Mintimate's Blog">
    text_color: 0x6495ed #拼音串
    candidate_text_color: 0xefefef # 非第一候选项
    back_color: 0x424242 # 背景
    border_color: 0x424242 # 边框
    hilited_text_color: 0xc6c01a # 拼音串高亮
    hilited_back_color: 0x424242 # 拼音串高亮背景
    hilited_candidate_back_color: 0xc6c01a # 第一候选项背景
    hilited_candidate_text_color: 0xefefef # 第一候选项
    hilited_comment_text_color: 0xffffff # 注解文字高亮
    comment_text_color: 0xefefef #注解文字
    label_color: 0xefefef # 预选栏编号颜色
```

Linux上的ibus，受限于不同的平台使用的ibus配置，无法进行更改，但是，可以使用系统的样式进行更改。比如： GNOME。

加下来我们就看看Windows和macOS上的展示效果。

## macOS外观
首先是macOS，鼠须管适配了系统提供的亮色和暗色的API接口。所以，鼠须管可以根据系统当前的外观，响应不同的外观。
![macOS外观](/image/demo/macOS_Mint.webp)

## Windows外观
其次，在Windows上；Windows上的系统API接口比较混乱；在Win10的后期，暗色模式才逐渐完善。小狼毫在`0.15`版本后，支持跟随系统暗色模式。

但是需要注意：
- 0.15版本起，不再支持Windows8以及之前的Windows版本；
- 0.15版本是一个重大版本更新，添加了许多功能和优化内部许多组建，但是目前不支持Arm64架构版本的Windows。

![Windows外观](/image/demo/Windows_Mint.webp)

受限于我的Windows虚拟机(Arm64)，所以截屏内，文字存在一定的精度丢失，看起来比较模糊。

## Linux外观
正如前文所说，**Linux如果使用ibus，受限于系统样式，无法进行外观的自定义**；比如: GNOME上使用本输入法配置:
![Linux上外观(继承主系统)](/image/demo/Linux_Mint.webp)

如果你使用Fcitx5，可以安装主题：[薄荷拼音外观风格主题_Fcitx](/resources/ohMyRimeThemeForFcitx5.zip)

