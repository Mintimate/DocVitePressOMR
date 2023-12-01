---
layout: doc
title: 效果演示
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,薄荷拼音效果展示,使用展示,薄荷拼音外观,薄荷拼音预览
description: 基于rime输入法框架，预览安装薄荷拼音后的效果、外观；以及在除了支持字典功能外，支持的特定功能和，如：Emoji、支持拆字反查输入、五笔反查输入、笔画反查输入等。
aside: true
---
# 效果演示
![效果简单展示](/image/demo/guide.webp)

本章节将展示薄荷输入法的适配情况和使用的效果。

> Tips: 之前本来叫『薄荷拼音』，后来适配了『98五笔』，感觉叫『薄荷输入法』比较合适✪ω✪

Github仓库地址: [oh-my-rime: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

镜像仓库地址: [oh-my-rime: https://gitlab.mintimate.cn/Mintimate/oh-my-rime](https://gitlab.mintimate.cn/Mintimate/oh-my-rime)

## 平台支持的情况
支持Rime输入法框架的平台有很多，我们已经进行测试，可以良好使用的：
- Windows: [小狼毫输入法: https://github.com/rime/weasel](https://github.com/rime/weasel)
- macOS: [鼠须管: https://github.com/rime/weasel](https://github.com/rime/squirrel)
- Linux: Linux上可以使用ibus框架和fcitx
- iOS: [仓输入法(App Store)](https://apps.apple.com/cn/app/%E4%BB%93%E8%BE%93%E5%85%A5%E6%B3%95/id6446617683)

理论上适配，但是我们未实际测试:
- Android: [同文输入法: https://github.com/osfans/trime](https://github.com/osfans/trime)

## 支持的输入方式
目前支持两大类型的输入方式内，三种输入类型：
- 全拼类
  - 薄荷拼音: 招牌主打输入类型，支持各种反查、中英混合输入等，丰富多彩的全拼；
  - 地球拼音薄荷定制: 基于地球拼音，追加一些定制，属于有薄荷拼音特点的地球拼音；
- 笔画类
  - 98五笔薄荷定制: 基于98五笔基础版本进行定制，满足五笔输入的需要；轻量版本的98五笔。

## 支持的功能
目前支持的功能，主要是:
- 功能方面
  - 支持亮色/暗色皮肤样式，在Win11和macOS上，可以根据系统进行切换；
  - 中文输入法，支持繁体、简体；
  - 支持中英混合输入；
  - 支持Emoji表情和颜文字；
  - 支持拆字(uu)反查输入、五笔(uw)反查输入、笔画(ui)反查输入；
  - 支持输入日期、星期、时间和人民币大写
- 词库得益于使用[雾凇拼音](https://github.com/iDvel/rime-ice)
  - 《通用规范汉字表》
  - 华宇野风系统词库
  - 清华大学开源词库
  - 《现代汉语常用词表》
  - 《现代汉语词典》
  - 《同义词词林》
  - 《新华成语大词典》
  - 腾讯词向量
