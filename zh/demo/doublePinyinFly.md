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

## 理解小鹤音形

[小鹤音形](https://flypy.com/)是一套完整的汉字输入方案，由两个核心部分组成：

| 组成部分 | 说明 | 输入方式 |
| --- | --- | --- |
| **双拼** | 声母、韵母各用一个字母表示，一个汉字的音用两个字母表达 | 2键定音 |
| **双形** | 根据拆分规则把一个汉字按字根拆分出两个部分，以区分同音字 | 2键定形 |

举个例子（参考自[小鹤官方文档](https://flypy.cc/#/xh)）：

| 单字 | 全拼 | 双拼 | 双形 | 全码 |
| --- | --- | --- | --- | --- |
| 小 | xiao | xn | ld丨丶 | xnld |
| 鹤 | he | he | dn丶鸟 | hedn |
| 音 | yin | yb | lo立日 | yblo |
| 形 | xing | xk | kp开丿 | xkkp |

传统小鹤音形采用「四码定字」：双拼2码 + 双形2码 = 4码上屏。这种方式定位精准，但需要记忆形码规则，学习曲线较陡。

## 薄荷的设计理念

薄荷输入法采用「**双拼为主，形码为辅**」的设计思路：

::: tip 为什么不直接用音形？
说出来你可能不信——**作者本人不会形码** 😅

所以用辅码的形式引入，这样既能体验形码的好处，又不用被四码上屏"绑架"。顺便，这种设计也：
1. **降低学习成本**：普通用户无需记忆形码即可正常使用双拼
2. **按需使用**：遇到重码较多时，形码作为辅助手段快速定位
3. **灵活自由**：想用就用，不想用可以完全忽略
:::

这种设计让薄荷既保持了双拼的高效，又保留了形码的精准定位能力，同时降低了入门门槛。

## 方案切换

使用热键（`Ctrl/Control + ~` 或 `F4`）切换到「小鹤双拼-薄荷定制」：

![切换和使用小鹤双拼](/image/demo/switchDoublePinyinFly.webp)

切换后即可使用小鹤的双拼键位进行输入，词库与「薄荷拼音-全拼输入」相同（详见 [double_pinyin_flypy.schema.yaml](https://github.com/Mintimate/oh-my-rime/blob/main/double_pinyin_flypy.schema.yaml) 的 `translator` 配置）。

## 辅码功能详解

### 什么是辅码？

辅码是一种「可选的」汉字定位机制。在双拼输入后，通过特定的激活键（默认 `;`）进入辅码模式，然后输入形码来筛选候选项。

![薄荷辅码](/image/demo/AxuCodeDemo.webp)

### 辅码的工作原理

薄荷通过 Lua 过滤器实现辅码功能，核心流程：

```
用户输入双拼 → 显示候选词 → 输入 ; 激活辅码 → 输入形码 → 筛选匹配的候选词
```

**配置解读**（`double_pinyin_flypy.schema.yaml`）：

```yaml {93}
filters:
  # ... 其他过滤器 ...
  - lua_filter@*auxCode_filter@flypy_full   # 小鹤双拼辅码(音形)
```

这个配置的含义：
- `lua_filter`：使用 Lua 过滤器
- `*auxCode_filter`：过滤器名称（对应 `lua/auxCode_filter.lua`）
- `@flypy_full`：辅码数据文件（对应 `lua/aux_code/flypy_full.txt`）

### 辅码数据文件

辅码文件位于 `lua/aux_code/` 目录，格式为 `汉字=形码`：

```
啊=kk
阿=ek
爱=py
安=bn
```

薄荷内置三种辅码方案：

| 文件名 | 适用方案 | 说明 |
| --- | --- | --- |
| `flypy_full.txt` | 小鹤双拼 | 小鹤形码 |
| `ZRM_Aux-code_4.3.txt` | 自然码 | 自然码形码（默认） |
| `moqi_aux_code.txt` | 其他双拼 | [墨奇形码](https://github.com/gaboolic/rime-shuangpin-fuzhuma) |

### 辅码配置项

```yaml {190-198}
# 小鹤音形配置
aux_code:
  # 激活码
  trigger_word: ";"
  # 展示辅码的模式
  # always:   总是展示(默认)
  # trigger:  输入激活码后激活辅码
  # none:     始终不展示辅码
  show_aux_notice: "trigger"
```

| 配置项 | 可选值 | 说明 |
| --- | --- | --- |
| `trigger_word` | 任意字符（默认 `;`） | 激活辅码模式的按键 |
| `show_aux_notice` | `always` | 候选项始终显示形码提示 |
| | `trigger` | 输入激活码后才显示形码提示 |
| | `none` | 从不显示形码提示 |

### 自定义激活键

如果默认的 `;` 键不方便（如 Android 小企鹅输入法的符号键盘不经过 Rime 处理），可以通过 `custom.yaml` 覆写：

```yaml
# double_pinyin_flypy.custom.yaml
# Rime schema
# encoding: utf-8

patch:
  # 设置激活键为逗号
  "aux_code/trigger_word": ","
  # 让逗号参与输入（添加到 alphabet）
  "speller/alphabet": zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA~,
```

![自定义激活键后的效果](/image/demo/customAxuCodeForDoubleFly.webp)

### 核心代码

- [auxCode_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/auxCode_filter.lua) - 辅码过滤器实现
- 参考自 [rime-lua-aux-code](https://github.com/HowcanoeWang/rime-lua-aux-code)

## 形码提示（OpenCC 拆字）

除了辅码定位，薄荷还支持通过 OpenCC 拆字滤镜显示形码提示：

```yaml {173-184}
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
  tips: char             # 单字加滤镜: char; 全部: all
```

使用 `Ctrl+Shift+C` 可开关此功能。

![辅助码 VS aux_code 形码](/image/demo/showHelperInfoForDoublePinyinFly.webp)

::: warning 注意
OpenCC 拆字滤镜**仅作为提示用途**，形码不会参与实际的候选词筛选。如需通过形码定位候选词，请使用辅码功能。
:::

## 方案对比总结

| 功能 | 小鹤音形（原版） | 薄荷小鹤双拼 |
| --- | --- | --- |
| 输入方式 | 四码定字（必须输入形码） | 双拼 + 可选辅码 |
| 形码作用 | 必需，用于定位 | 可选，用于辅助定位 |
| 学习成本 | 较高（需记忆形码） | 较低（可渐进学习） |
| 输入效率 | 高（精准定位） | 灵活（按需使用） |

薄荷的设计让用户可以：
1. **入门阶段**：只用双拼，完全忽略形码
2. **进阶阶段**：遇到重码时使用辅码快速定位
3. **熟练阶段**：如鱼得水，高效输入
