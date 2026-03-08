---
layout: doc
title: Lua功能扩展
head:
  - - meta
    - name: keywords
      content: Rime Lua脚本,薄荷输入法Lua,Rime日期时间,Rime计算器,Rime大写金额
description: 薄荷输入法内的Lua功能扩展详解，包括日期时间输入、计算器、大写金额转换、农历等高级功能。
---

# Lua 功能扩展

薄荷输入法（oh-my-rime）通过 Lua 脚本提供了丰富的扩展功能，这些功能大大增强了输入法的实用性。本文详细介绍各个 Lua 功能模块的使用方法和配置。

## 功能概览

薄荷输入法内置了以下 Lua 功能模块：

| 模块 | 类型 | 功能说明 |
|------|------|----------|
| `shijian` | translator | 日期、时间、星期、节日、节气、问候等 |
| `number_translator` | translator | 数字金额大小写转换 |
| `chineseLunarCalendar_translator` | translator | 公历转农历 |
| `mint_calculator_translator` | translator | 计算器（动态表达式计算） |
| `select_character` | processor | 以词定字 |
| `codeLengthLimit_processor` | processor | 限制输入编码最大长度 |
| `corrector_filter` | filter | 错音错字提示 |
| `super_preedit` | filter | 输入码显示全拼并带声调 |
| `autocap_filter` | filter | 英文自动大写 |
| `reduce_english_filter` | filter | 降低部分英语单词候选位置 |
| `force_gc` | translator | 强制垃圾回收（性能优化） |

## 日期时间输入（shijian）

这是薄荷输入法中最为常用的 Lua 功能之一。通过特定的引导键，可以快速输入当前的日期、时间、星期等信息。

### 基本用法

薄荷输入法默认使用 `o` 作为 Lua 脚本的引导键。虽然 `shijian.lua` 脚本本身支持 `/` 作为引导符，但在默认配置中，`/` 被符号输入（Symbols）占用。因此，建议使用 `o` 开头的编码来触发日期时间功能。

| 输入编码 | 功能 | 输出示例 |
|----------|------|----------|
| `osj` | 当前时间 | 14:30、14点30分 |
| `orq` | 当前日期 | 2025年03月08日、2025-03-08 |
| `onl` | 农历日期 | 二〇二五年二月初九 |
| `oxq` | 星期 | 星期六 |
| `oww` | 今年第几周 | 第10周 |
| `ojq` | 当前节气 | 惊蛰 |
| `odt` | 日期+时间 | 2025-03-08 14:30:00 |
| `ott` | 时间戳 | 1741425000 |
| `ojr` | 节日 | 妇女节 |
| `oday` | 问候模板 | 下午好！ |

::: tip 注意
输入 `/sj`、`/rq` 等编码时，会触发 Rime 的符号输入功能（由 `symbols.yaml` 定义），输出的是特殊符号（如 `㍘`、`㏠` 等），而非动态生成的日期时间。
:::

### N模式日期

输入大写 `N` 后跟日期数字，可以将指定的公历日期转换为农历：

| 输入 | 功能 |
|------|------|
| `N20250308` | 将2025年3月8日转换为农历 |
| `N0308` | 将当年3月8日转换为农历 |

### 自定义日期时间格式

薄荷输入法支持在方案文件中自定义日期时间的输出格式。在 `rime_mint.schema.yaml` 中有以下配置：

```yaml
date_formats:
  - "Y年m月d日"
  - "Y-m-d"
  - "Y/m/d"
  - "Y.m.d"
  - "Ymd"
  - "Y年n月j日"

time_formats:
  - "H:M"
  - "H点M分"
  - "H:M:S"
  - "H时M分S秒"
  - "AI:M"
  - "I:M P"

datetime_formats:
  - "Y-m-d H:M:S"
  - "Y-m-dTH:M:S O"
  - "YmdHMS"
  - "Y年m月d日 H点M分"
  - "y/m/d I:M p"
```

**格式化占位符说明：**

**日期类：**
| 占位符 | 说明 | 范围/示例 |
|--------|------|-----------|
| `Y` | 四位年份 | 2025 |
| `y` | 两位年份 | 25 |
| `m` | 月（前导零） | 01-12 |
| `n` | 月（不带前导零） | 1-12 |
| `d` | 日（前导零） | 01-31 |
| `j` | 日（不带前导零） | 1-31 |

**时间类：**
| 占位符 | 说明 | 范围/示例 |
|--------|------|-----------|
| `H` | 24小时（前导零） | 00-23 |
| `G` | 24小时（不带零） | 0-23 |
| `I` | 12小时（前导零） | 01-12 |
| `l` | 12小时（不带零） | 1-12 |
| `M` | 分钟（前导零） | 00-59 |
| `S` | 秒（前导零） | 00-59 |
| `p` | am/pm（小写） | am / pm |
| `P` | AM/PM（大写） | AM / PM |
| `A` | 中文时段 | 凌晨/上午/中午/下午/晚上 |

**时区类：**
| 占位符 | 说明 | 示例 |
|--------|------|------|
| `O` | 带冒号 | +08:00 |
| `o` | 不带冒号 | +0800 |

**转义支持：**
- `\X`：转义单个字符，按字面量输出
- `[[...]]`：区块整体按字面量输出

如果想通过 custom 文件自定义格式，以薄荷拼音为例创建 `rime_mint.custom.yaml`：

```yaml
patch:
  date_formats:
    - "Y年m月d日"
    - "Y-m-d"
    - "Ymd"
  time_formats:
    - "H:M:S"
    - "H:M"
```

### 修改引导键

日期时间功能的引导键可以通过 `key_binder/shijian_keys` 进行修改：

```yaml
patch:
  key_binder/shijian_keys: ["o", "v"]  # 同时支持 o 和 v 作为引导键
```

## 数字金额大写（number_translator）

在中文输入模式下，输入大写 `R` 后跟数字，可以将数字转换为大写金额格式。

### 使用示例

| 输入 | 输出 |
|------|------|
| `R1234` | 壹仟贰佰叁拾肆元整 |
| `R1234.56` | 壹仟贰佰叁拾肆元伍角陆分 |
| `R0.5` | 零元伍角 |

::: tip 触发前缀
此功能由 `recognizer` 中的 `rmb` 规则触发：
```yaml
recognizer:
  patterns:
    rmb: "^R[0-9]+[.]?[0-9]*"
```
脚本自动获取第2个字符（即数字部分）进行转换。
:::

## 计算器（mint_calculator_translator）

在中文输入模式下，输入 `=` 后跟数学表达式，可以直接计算结果。

### 使用示例

| 输入 | 输出 |
|------|------|
| `=1+1` | 2 |
| `=3.14*2` | 6.28 |
| `=100/3` | 33.333... |
| `=2^10` | 1024 |
| `=sqrt(144)` | 12 |

::: tip 触发前缀
此功能由 `recognizer` 中的 `expression` 规则触发：
```yaml
recognizer:
  patterns:
    expression: "^=.*$"
```
:::

## 农历转换（chineseLunarCalendar_translator）

除了上述 `N` 模式外，薄荷输入法也配置了农历翻译器。方案中的配置：

```yaml
chineseLunarCalendar_translator: lunar
```

使用 `/nl` 或 `onl` 可以直接输出当天的农历日期。

## 错音错字提示（corrector_filter）

此 Lua 过滤器会在你输入时提示可能的错音错字。例如，当你输入了常见的拼写错误时，候选项的注释区会显示正确的拼写提示。

此功能需要配合方案中的以下配置：

```yaml
translator:
  spelling_hints: 8
  always_show_comments: true
  comment_format: {comment}
```

## 英文自动大写（autocap_filter）

当英文单词出现在句首或特定上下文时，此过滤器会自动将首字母大写。

## 降低英文候选（reduce_english_filter）

此过滤器用于解决短英文单词在拼音输入时的干扰问题。例如输入 `rug` 时，默认会优先显示英文 `rug`，开启后会优先显示中文 `如果`。

### 配置模式

在方案文件中可以配置不同的降频模式：

```yaml
reduce_english_filter:
  mode: all       # all | none | custom | 留白
  idx: 2          # 降低到第几个位置
  words: [...]    # custom 模式下的自定义单词列表
```

| 模式 | 说明 |
|------|------|
| `all` | 降低所有3~4位长度的特定英文单词（使用内置词库） |
| `none` | 不降低任何单词 |
| `custom` | 只降低 `words` 列表中指定的单词 |
| 留白 | 使用脚本内全局默认设置 |

如需通过 custom 文件修改，创建对应方案的 custom 文件：

```yaml
patch:
  reduce_english_filter:
    mode: none  # 关闭英文降频
```

## 以词定字（select_character）

薄荷输入法默认使用 `[` 和 `]` 来实现以词定字功能：
- `[`：选取词组的第一个字
- `]`：选取词组的最后一个字

例如，输入 `mingbai`（明白）后：
- 按 `[` 上屏「明」
- 按 `]` 上屏「白」

### 修改定字按键

如果想修改以词定字的按键（例如换成 `-` 和 `=`），可以在方案的 `key_binder` 中配置：

```yaml
patch:
  key_binder/select_first_character: "minus"   # 使用 - 选首字
  key_binder/select_last_character: "equal"    # 使用 = 选末字
```

## 输入码全拼显示（super_preedit）

此过滤器可以将输入码实时转换为带声调的全拼显示。例如输入 `nihao` 时，预编辑区会显示为 `nǐ hǎo`。

此功能通过方案中的 `tone_display` 开关控制：

```yaml
switches:
  - name: tone_display
    states: [ 声杳, 声起 ]
    reset: 0  # 默认关闭
```

- **声杳**（关闭）：显示原始输入编码
- **声起**（开启）：显示带声调的全拼

## 输入长度限制（codeLengthLimit_processor）

薄荷输入法默认限制拼音串最大长度为 25 个字符，以防止过长输入导致卡顿。

修改方法：

```yaml
patch:
  codeLengthLimit_processor: 100  # 调整为 100 个字符
```

::: warning 提示
增大输入长度限制可能会导致输入法在长拼音串时出现卡顿，建议根据设备性能适当调整。
:::
