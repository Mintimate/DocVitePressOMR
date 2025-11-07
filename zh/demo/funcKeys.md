---
layout: doc
title: 特殊功能键
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,功能键,快捷键,Lua效果
description: 使用薄荷拼音，可以使用的相关快捷键。借助Lua实现的一些功能快捷键。比如： 自动输入当天日期、时间和人民币大小写等。在rime输入法上也可以实现快捷输入。
aside: true
---

# 特殊功能键
借助lua脚本，薄荷拼音实现了一些特定的功能键：
- 时间/星期/日期/节气等打印
- 大写人民币打印
- 农历日期打印/转换
- 简易计算器

## 时间/星期/日期/节气 <Badge type="tip" text="^2025.11" />

在 [7ae364ea06](https://github.com/Mintimate/oh-my-rime/commit/2c53f68cf4bb9461bda82e1b2862307ae364ea06) 版本后之前，使用多个 Lua 脚本实现时间(time)、星期(week)、日期(date)的打印。

但是在这个版本之后，AMZ 推送了 [shijian.lua](https://github.com/Mintimate/oh-my-rime/blob/8c8fb9c40a8e4bdff8a325049e96119f6699c965/lua/shijian.lua) 脚本来实现时间等信息的打印。

你可以使用下列关键词来激活对应的功能：
- 时间：osj
- 日期：orq
- 农历：onl
- 星期：oxq
- 今年第几周：oww
- 节气：ojq
- 日期+时间：ors
- 时间戳：ott
- 大写N日期：N20250315 或者N0312不带年
- 节日：ojr
- 问候模板：oday

![shijian.luia 使用效果](/image/demo/shijianLua.webp)

如果你想设置 `orq` 内每个日期的顺序，可以覆写`date_format`配置项：

![覆写date_format](/image/demo/overrideDateFormat.webp)

## 大写人民币打印
这个大写人民币打印就比较有意思了，使用大写字母`R`进行激活，后续输入键盘上的数字键（小键盘上的无效，要字母上方的数字）：
![大写人民币](/image/demo/rmbKey.webp)

之后，选择候选项，你可以使用方向键进行选择，使用空格进行选中；也可以使用 `Ctrl` + `数字键`进行选中。

## 农历日期打印/转换
如果你想要使用农历日期打印，那么需要知道，「中国的农历」英文叫：`Chinese lunar calendar`。

所以，我设置的农历日期打印的先导词是`lunar`。如果你在输入法内输入改先导词后；可以把当天的日期转为农历日期输出。

如果你想查询某天的日期，对应的农历是几号，那么，可以使用前导字母`N`。后面使用数字键输入查询的日期即可。

![农历日期打印和转换](/image/demo/luaLunar.webp)

## 简易计算器
网友的呼声很高，所以在 [fca55ddff0](https://github.com/Mintimate/oh-my-rime/commit/fca55ddff09b88b0c022f9d883a22940659cf497)版本后，正式加入了简易计算器功能。

> 实际上，这个功能我在 2024 年初就已经 PR 到上游代码 [baopaau/rime-lua-collection #3](https://github.com/baopaau/rime-lua-collection/pull/3) 了，但是因为一些原因，一直没有适配到薄荷内。

如果你想调用计算器，那么只需要在输入法内输入`=`后输入计算等式即可：

![简易计算器](/image/demo/luaCalculator.webp)

当然，`=` 是可以修改为其他字母的，你可以覆写`recognizer/expression`配置项。

如果你不想使用计算器，那么可以通过自定义配置进行关闭。举例，使用`double_pinyin_flypy.custom.yaml`文件，添加如下内容：
```yaml
patch:
  # 关闭简易计算器
  "recognizer/patterns/expression": ""
```