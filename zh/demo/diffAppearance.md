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
# 外观展示 <Badge type="tip" text="^2024.04" />
主要适配了Windows和macOS上的外观。自带两套皮肤： 水鸭系列、青涩系列：
- 蓝水鸭: 蓝色色调的亮色主题；
- 黑水鸭: 蓝色色调的暗色主题；
- 碧皓青: 绿色色调的亮色主题；
- 碧月青: 绿色色调的暗色主题；

![外观展示](/image/demo/themeOfOhMyRime.webp)

:::info 提示信息

默认激活的是 “水鸭”系列哦。如果需要 切换到 “青涩”系列，可以使用[配置覆写](/zh/guide/configurationOverride.html)的方式，用 custom 去覆写 `squirrel.yaml`或`weasel.yaml`的`style/color_scheme`和`style/color_scheme_dark`配置项。 

:::

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

> **! 破坏性变更:** 2024.03.02 薄荷输入法的鼠须管和小狼毫个性化配置，由默认使用`custom`文件，替换为默认使用主体配置。
>> 也就是，本来使用的是`squirrel.custom.yaml`和`weasel.custom.yaml`，转而使用`squirrel.yaml`和`weasel.yaml`。**方便用户自己自定义内容时候，可以使用`custom`文件**。

Linux上，如果使用的是的iBus，受限于不同的平台使用的iBus配置，无法进行更改，但是，可以使用系统的样式进行更改。比如： GNOME。而如果使用的是Fcitx，那么rime是继承于Fcitx的外观配置的。

目前，薄荷输入法并**没有修改iOS上仓输入法的个性化配置**。

加下来我们就看看 Windows 和 macOS 上的展示效果。

## macOS外观
首先是macOS，鼠须管适配了系统提供的亮色和暗色的API接口。所以，鼠须管可以根据系统当前的外观，响应不同的外观。
![macOS外观](/image/demo/macOS_Mint.webp)

如果你使用 Fcitx5 macOS，那么薄荷内自带的鼠须管皮肤不会生效，可以导入 Fcitx5 macOS 配置:
- [移植版本-薄荷外观风格主题_Fcitx5 macOS](/resources/mint_green.conf)

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

如果你使用Fcitx5，可以安装主题：
- [移植版本-薄荷外观风格主题_Fcitx](/resources/ohMyRimeThemeForFcitx5.zip)
- [社区版本-薄荷外观风格主题_witt-bit/fcitx5-theme-mint「推荐」](https://github.com/witt-bit/fcitx5-theme-mint)

![Linux上外观(自定义)](/image/demo/Linux_MintGreenLight.gif)

## Android外观 <Badge type="tip" text="^2024.05" />
如果你选择的小企鹅输入法，默认的颜色就是挺不错的。而且目前小企鹅输入法暂时不支持更换外观。

如果是同文输入法，那么是挺依靠第三方输入方案和布局的，~~你可以在薄荷输入法的主题仓库内下载到我们制作的同文输入法主题~~：

![同文输入法上外观](/image/demo/Trime_Mint.webp)

方案不在薄荷输入法的主仓库内，另外开了一个仓库（不建议使用）：
- [https://github.com/Mintimate/RimeTheme](https://github.com/Mintimate/RimeTheme)

:::danger 2024.05更新

同文输入法的主题适配难度较高，我们基于 danjing 大佬适配的皮肤，一直有问题； 团队目前没有精力维护。放弃适配同文主题，如果需要使用，可以使用原库的主题。

主题方案基于（原库）: [https://github.com/nopdan/danjing](https://github.com/nopdan/danjing) 

:::

## iOS外观

如果是仓输入法，那么是自带的布局和外观其实就很不错。但是如果你想追求一些不一样的，我们也是用制作：

![仓输入法上外观](/image/demo/Hamster_Mint.webp)

同样，方案不在薄荷输入法的主仓库内，在主题仓库内：
- [https://github.com/Mintimate/RimeTheme](https://github.com/Mintimate/RimeTheme)


:::info 版权©说明

本方案基于 仓输入法QQ群 内作者「咖啡☕」大佬的`渐变`主题魔改制作，魔改内容：
- 注记码替换为小鹤双拼；
- 按键气泡更改；
- 部分颜色修改。

并且使用了在线可视化工具进行编辑：
- [https://lost-melody.github.io/hamster-tools/](https://lost-melody.github.io/hamster-tools/)

版权信息，依旧归于「咖啡☕」大佬。 已经经大佬授权。

:::
