---
layout: doc
title: 效果演示
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,薄荷拼音效果展示,使用展示,薄荷拼音外观,薄荷拼音预览
  - - meta
    - property: "og:image"
      content: "https://www.mintimate.cc/image/demo/guide.webp"
description: 基于rime输入法框架，预览安装薄荷拼音后的效果、外观；以及在除了支持字典功能外，支持的特定功能和，如：Emoji、支持拆字反查输入、五笔反查输入、笔画反查输入等。
aside: true
---
# 效果演示
![效果简单展示](/image/demo/guide.webp)

本章节将展示薄荷输入法的适配情况和使用的效果。

> Tips: 之前本来叫『薄荷拼音』，后来适配了『五笔98』、『五笔86』、『地球拼音』和『小鹤双拼』，感觉叫『薄荷输入法』比较合适✪ω✪；当然，实际应该叫「薄荷输入配置」，只是「薄荷输入法」比较好听。

GitHub仓库地址: 
- [oh-my-rime: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

镜像仓库地址（如果你无法访问GitHub）: 
- [oh-my-rime: https://cnb.cool/Mintimate/rime/oh-my-rime](https://cnb.cool/Mintimate/rime/oh-my-rime)

::: tip
本质上，薄荷输入法就是Rime的一套输入配置。所以，**本网站，同时也是一份非官方的Rime配置文档**。

<donate/>

:::

## 平台支持的情况
支持Rime输入法框架的平台有很多，我们已经进行测试，可以良好使用的：
- Windows: [小狼毫输入法: https://github.com/rime/weasel](https://github.com/rime/weasel)
- macOS: [鼠须管: https://github.com/rime/weasel](https://github.com/rime/squirrel)
- Linux: Linux上可以使用ibus框架或者fcitx框架
- iOS: [仓输入法(App Store)](https://apps.apple.com/cn/app/%E4%BB%93%E8%BE%93%E5%85%A5%E6%B3%95/id6446617683)
- Android: 
  - [小企鹅输入法(Fcitx5 Android): https://fcitx-im.org/wiki/Fcitx_5/zh-cn](https://fcitx-im.org/wiki/Fcitx_5/zh-cn)
  - [同文输入法: https://github.com/osfans/trime](https://github.com/osfans/trime)

## 支持的输入方式
目前支持两大类型的输入方式内，三种输入类型：
- 全拼类
  - 薄荷拼音: 招牌主打输入类型，支持各种反查、中英混合输入等，丰富多彩的全拼；词库基于[雾凇拼音词库](https://github.com/iDvel/rime-ice)。
  - 地球拼音薄荷定制: 基于地球拼音，追加一些定制，进行定制的输入方式；词库自动同步雾凇拼音并使用[Python pypinyin库](https://pypinyin.readthedocs.io/)进行转换。
- 双拼类
  - 小鹤双拼薄荷定制: 基于[小鹤双拼](https://flypy.com/)（声形），进行定制的输入方式。词库使用雾凇拼音。
  - 小鹤双拼薄荷定制: 基于小鹤双拼，追加一些定制；词库同样使用雾凇拼音。支持音形(辅码)的输入，默认使用`;`激活形的输入。如果不习惯`;`激活，可以自行再配置内改键。如果需要完整的音形和拼音混输，可以自行引入小鹤音形后，扩展方案的`abc_segmentor`。
- 笔画类
  - 98五笔薄荷定制: 基于[98五笔基础版本](https://github.com/yanhuacuo/98wubi-tables)进行定制，满足五笔输入的需要；**轻量版本的98五笔**。如果需要完整的98五笔体验，可以试试看原仓库。
  - 86五笔薄荷定制: 基于[86五笔极点码表](https://github.com/KyleBing/rime-wubi86-jidian)进行定制，满足五笔输入的需要；**轻量版本的86五笔**。同样，如果需要完整的86五笔体验，可以试试看原仓库。 

薄荷已经进行了适配和集成，但是默认没有激活的输入类型:
- 双拼类
  - 自然码: 基于[自然码(wiki)](https://zh.wikipedia.org/zh/%E8%87%AA%E7%84%B6%E7%A0%81)进行定制的输入方式。
  - 智能ABC: 基于[智能ABC(wiki)](https://zh.wikipedia.org/wiki/%E6%99%BA%E8%83%BDABC%E8%BE%93%E5%85%A5%E6%B3%95)进行定制的输入方式。
  - 微软双拼: 基于微软双拼键位图进行定制的输入方式。
  - 搜狗双拼: 基于搜狗双拼键位图进行定制的输入方式。
  - 紫光双拼: 基于紫光双拼键位图进行定制的输入方式。

如果需要开启，可以参考：[自定义默认激活方案](/zh/guide/defaultActivationScheme.html)

## 支持的功能 <Badge type="tip" text="^2025.04" />
目前支持的功能，主要是:
- 功能方面
  - 支持亮色/暗色皮肤样式，在Windows（Windows 10 1809+ ）和macOS上，可以根据系统进行切换；
  - 中文输入法，支持繁体（台湾地区风格）、简体；
  - 支持中英混合输入，如：输入: "哆啦A梦"；
  - 支持Emoji表情和[颜文字](kaomoji.html)；
  - 支持[多种反查输入](reverseWords.html): 拼音内支持拆字(Uu)反查输入、五笔(Uw)反查输入、笔画(Ui)反查输入；五笔内支持拼音(Up)反查输入；
  - 支持[输入日期、星期、时间、农历日期、人民币大写快捷输入和简易计算器（实际是 Lua 表达式计算）](funcKeys.html)。
- 拼音词库得益于使用[雾凇拼音](https://github.com/iDvel/rime-ice)
  - 《通用规范汉字表》
  - 华宇野风系统词库
  - 清华大学开源词库
  - 《现代汉语常用词表》
  - 《现代汉语词典》
  - 《同义词词林》
  - 《新华成语大词典》
  - 腾讯词向量

## 特别鸣谢
薄荷输入法的构造，离不开以下项目的支持：
- [雾凇拼音: https://github.com/iDvel/rime-ice](https://github.com/iDvel/rime-ice)
- [98五笔小筑: https://github.com/yanhuacuo/98wubi-tables](https://github.com/yanhuacuo/98wubi-tables)
- [86五笔极点: https://github.com/KyleBing/rime-wubi86-jidian](https://github.com/KyleBing/rime-wubi86-jidian)

也感谢以下个人提供的帮助和授权: 
- 98五笔的维护者[yanhuacuo](https://github.com/yanhuacuo)
- 雾凇拼音的维护者[iDvel](https://github.com/iDvel)、[mirtlecn](https://github.com/mirtlecn)
- 86五的维护者[KyleBing](https://github.com/KyleBing)