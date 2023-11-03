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
- 时间打印
- 星期打印
- 日期打印
- 大写人民币打印

## 时间打印
在输入法内，只要输入关键词`time`，输入法会使用`Lua`脚本，自动根据当前的时间进行造句：
![时间打印](/image/demo/timeKey.webp)

## 星期打印
和上面类似，只不过关键词变成`week`:
![星期打印](/image/demo/weekKey.webp)

## 日期打印
关键词`date`:
![日期打印](/image/demo/dateKey.webp)


## 大写人民币打印
这个大写人民币打印就比较有意思了，使用大写字母`R`进行激活，后续输入键盘上的数字键（小键盘上的无效，要字母上方的数字）：
![大写人民币](/image/demo/rmbKey.webp)