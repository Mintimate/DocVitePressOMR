---
layout: doc
title: 小鹤双拼定制
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,效果展示,使用效果,小鹤双拼定制
description: 薄荷输入法内，基于小鹤双拼实现的定制方案演示。 基于 rime 实现的小鹤双拼和音形辅码使用演示。
aside: true
---
# 小鹤双拼 <Badge type="tip" text="^2024.07" />
[小鹤音形](https://flypy.com/)其实包含两个部分：
- 双拼：声母、韵母各用一个字母表示，一个汉字的音用两个字母表达;
- 双形：根据拆分规则把一个汉字按字根拆分出两个部分，以区分同音字;

我们平时用小鹤双拼比较多，也就是双拼部分。 如果使用的是双形，那么大部分情况就是四字上屏。 

举个例子(参考自[小鹤官方文档](https://flypy.cc/#/xh))：
| 单字 | 全拼 | 双拼 | 双形 | 全码 |
| --- | --- | --- | --- | --- |
| 小 | xiao | xn | ld丨丶 | xnld |
| 鹤 | he | he | dn丶鸟 | hedn |
| 音 | yin | yb | lo立日 | yblo |
| 形 | xing | xk | kp开丿 | xkkp |

那么？ 薄荷内是如何使用小鹤双拼的呢？

答案是： 双拼为主，形作为定位辅助码。

## 薄荷内使用
目前，薄荷内可以使用小鹤双拼内容。你可以使用热键（`Ctrl/Control + ~`）切换到`小鹤双拼-薄荷定制`：
![切换和使用小鹤双拼](/image/demo/switchDoublePinyinFly.webp)

使用指南：
- 切换到`小鹤双拼-薄荷定制`，即可使用小鹤的双拼键位进行双拼输入。使用的词库和`薄荷拼音-全拼输入`一样。可以参考仓库内 [double_pinyin_flypy.schema.yaml](https://github.com/Mintimate/oh-my-rime/blob/main/double_pinyin_flypy.schema.yaml) 的`translator`内`dictionary`和 `prism`。 

## 小鹤辅码
虽然没有音形，但是我们引入了辅码。默认情况，可以在输入后，使用`;`激活辅助码，之后用小鹤的形码来定位字词。 

![薄荷辅码](/image/demo/AxuCodeDemo.webp)

实际上，**其他双拼方案也是支持的。只不过小鹤双拼的形码比较有名，在薄荷内自然码也可以使用自然码的形码作为辅助定位。其他双拼，使用[墨奇的形码](https://github.com/gaboolic/rime-shuangpin-fuzhuma)作为辅助定位。**

如果想切换激活辅助码的按键，可以使用`custom`覆写 [double_pinyin_flypy.schema.yaml](https://github.com/Mintimate/oh-my-rime/blob/main/double_pinyin_flypy.schema.yaml) 的`axu_code`，并且`speller`内的`alphabet`追加新的辅助激活码。

`axu_code`的更多设置：
```YAML
# 小鹤音形配置
axu_code:
  # 激活码
  trigger_word: ";"
  # 展示辅码的模式
  # always:   总是展示(默认)
  # trigger:  输入激活码后激活辅码
  # none:     始终不展示辅码
  show_aux_notice: "trigger"
```

覆写举例，Android手机上，小企鹅输入法默认`?123`符号键盘内的符号，不经过Rime处理，所以我们使用逗号来替换激活码：
```yaml
# double_pinyin_flypy.custom.yaml
# Rime schema
# encoding: utf-8

patch:
  # 设置激发键
  "axu_code/trigger_word": ","
  # 释放分号，并让逗号参与输入
  "speller/alphabet": zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA~,

```

> 虽然我觉得用逗号作为辅码有点“蹩脚”，可能是我习惯的问题？

![自定义激活键后的效果](/image/demo/customAxuCodeForDoubleFly.webp)


核心代码：
- [https://github.com/Mintimate/oh-my-rime/blob/main/lua/auxCode_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/auxCode_filter.lua)

参考自: 
- [https://github.com/HowcanoeWang/rime-lua-aux-code](https://github.com/HowcanoeWang/rime-lua-aux-code)

## 辅码OpenCC
哈哈，其实这个已经不是辅码内容了。 为了方便在不使用辅码情况下，也可以直接看到形的内容。你可以把`axu_code`的`show_aux_notice`改为`always`。

也可以使用 [GGboxCloud](https://github.com/GGboxCloud) 制作的 Chaifen OpenCC:
```yaml
# 鹤形拆字辅助滤镜
chaifen_cc:
  opencc_config: fly_Chaifen.json
  option_name: chaifen
  show_in_comment: true  # 是否仅将转换结果显示在备注中
  comment_format:
    - "xform/&nbsp;/ /"
  tags:                  # 设置其作用范围
    - abc
    - storkfly
    - reverse_lookup
  tips: char             #  单字加滤镜: char; 全部: all，
```
![辅助码 VS axu_code 形码](/image/demo/showHelperInfoForDoublePinyinFly.webp)

::: warning 警告
辅码 OpenCC，仅仅作为提示作用。 如果需要辅码参与词的定位和后续，那么还是需要用`axu_code`进行定位。
:::