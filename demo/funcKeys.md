---
layout: doc
title: 特殊功能键
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