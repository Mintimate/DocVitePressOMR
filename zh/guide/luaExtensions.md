---
layout: doc
title: Lua功能扩展
head:
  - - meta
    - name: keywords
      content: Rime Lua脚本,薄荷输入法Lua,oh-my-rime lua目录,shijian.lua,number_translator.lua,mint_calculator_translator.lua,chineseLunarCalendar_translator.lua,unicode_translator.lua,select_character.lua,codeLengthLimit_processor.lua,kp_number_processor.lua,auxCode_filter.lua,corrector_filter.lua,super_preedit.lua,autocap_filter.lua,reduce_english_filter.lua,force_gc.lua,tag_user_dict.lua
description: 薄荷输入法内的 Lua 功能扩展详解，按 lua 目录文件名、Rime 注册名、processor、translator、filter、触发编码和配置项说明日期时间、计算器、金额大写、农历、Unicode 编码查询、以词定字、辅码、小键盘数字、候选标记等功能。
---

# Lua 功能扩展

薄荷输入法（oh-my-rime）通过 `lua/` 目录中的脚本提供扩展功能。本文按 Lua 文件名、Rime 注册名、模块类型、触发编码和配置项组织，方便搜索 `shijian.lua`、`select_character.lua`、`auxCode_filter.lua`、`kp_number_processor.lua` 等关键词时直接定位到对应功能。

## Lua 目录与注册方式

在方案文件中，Lua 脚本通常通过以下方式注册：

| 注册写法 | 类型 | 用途 |
|------|------|------|
| `lua_processor@*模块名` | processor | 处理按键事件，如以词定字、小键盘数字、输入长度限制 |
| `lua_translator@*模块名` | translator | 根据输入编码生成候选，如日期时间、金额大写、计算器、农历 |
| `lua_filter@*模块名` | filter | 调整或标注候选，如错音错字提示、辅码筛选、英文降频 |
| `lua_filter@*模块名@命名空间` | filter + namespace | 同一个脚本读取不同数据文件，例如 `lua_filter@*auxCode_filter@flypy_full` 读取 `lua/aux_code/flypy_full.txt` |

## 功能概览

薄荷输入法内置了以下 Lua 文件和辅助数据。这里的“默认启用”以 `rime_mint.schema.yaml` 为参考；双拼、辅码或自定义方案可能会额外启用其他 Lua。

| Lua 文件或目录 | 注册名或命名空间 | 类型 | 默认启用 | 功能和检索关键词 |
|------|------|------|------|------|
| `shijian.lua` | `shijian` | translator | 是 | 日期、时间、星期、节日、节气、问候、`osj`、`/sj`、`N20250315` |
| `number_translator.lua` | `number_translator` | translator | 是 | 数字金额大写、人民币大写、`R1234` |
| `chineseLunarCalendar_translator.lua` | `chineseLunarCalendar_translator` | translator | 是 | 农历、公历转农历、`/nl`、`onl`、`N20240115` |
| `mint_calculator_translator.lua` | `mint_calculator_translator` | translator | 是 | 计算器、数学表达式、`=1+1`、`sqrt` |
| `kp_number_processor.lua` | `kp_number_processor` | processor | 是 | 小键盘数字、数字键盘、候选选择、`kp_number_mode` |
| `select_character.lua` | `select_character` | processor | 是 | 以词定字、首字、末字、`select_first_character`、`select_last_character` |
| `codeLengthLimit_processor.lua` | `codeLengthLimit_processor` | processor | 是 | 输入长度限制、最长编码、拼音串过长、卡顿 |
| `corrector_filter.lua` | `corrector_filter` | filter | 是 | 错音错字提示、拼写纠错、候选注释 |
| `super_preedit.lua` | `super_preedit` | filter | 是 | 输入码全拼显示、声调显示、`tone_display`、`声杳`、`声起` |
| `autocap_filter.lua` | `autocap_filter` | filter | 是 | 英文自动大写、句首大写 |
| `reduce_english_filter.lua` | `reduce_english_filter` | filter | 是 | 英文候选降频、短英文置顶、`rug`、`mode: all` |
| `unicode_translator.lua` | `unicode_translator` | translator | 是 | Unicode 编码查询、码位转换、`Uc`、`U+4E2D`、`\u4E2D`、HTML 实体 |
| `force_gc.lua` | `force_gc` | translator | 是 | 强制垃圾回收、内存稳定、Lua GC |
| `auxCode_filter.lua` | `auxCode_filter@flypy_full` 等 | filter | 否 | 辅助码、形码筛选、小鹤双拼、自然码、墨奇、`aux_code/trigger_word` |
| `aux_code/*.txt` | `flypy_full`、`ZRM_Aux-code_4.3`、`moqi_aux_code` | 数据文件 | 按方案 | 辅码数据、`汉字=形码`、小鹤形码、自然码形码 |
| `tag_user_dict.lua` | `tag_user_dict` | filter | 否 | 候选来源标记、用户词典、用户短语、`user_table`、`user_phrase` |
| `log.lua` | `log` | helper | 否 | Lua 调试日志、开发调试、输出日志文件 |

## 日期时间输入（shijian）

`lua/shijian.lua` 注册为 `lua_translator@*shijian`，是薄荷输入法中最常用的 Lua translator 之一。通过特定的引导键，可以快速输入当前日期、时间、星期、节日、节气、问候模板等内容。

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

`lua/number_translator.lua` 注册为 `lua_translator@*number_translator`，用于人民币金额大写、数字金额大写和中文大写金额转换。在中文输入模式下，输入大写 `R` 后跟数字，可以将数字转换为大写金额格式。

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

`lua/mint_calculator_translator.lua` 注册为 `lua_translator@*mint_calculator_translator`，用于在输入法候选区直接计算数学表达式。在中文输入模式下，输入 `=` 后跟表达式即可得到计算结果。

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

`lua/chineseLunarCalendar_translator.lua` 注册为 `lua_translator@*chineseLunarCalendar_translator`，用于农历查询和公历转农历。除了上述 `N` 模式外，薄荷输入法也配置了农历翻译器。方案中的配置：

```yaml
chineseLunarCalendar_translator: lunar
```

使用 `/nl` 或 `onl` 可以直接输出当天的农历日期。

## Unicode 编码查询（unicode_translator）

`lua/unicode_translator.lua` 注册为 `lua_translator@*unicode_translator`，用于把候选文字转换为常见 Unicode 码位表示。默认使用 `Uc` 作为触发前缀，输入方式是 `Uc` 加上当前方案中该字或词的编码。

这个功能不是“输入 Unicode 码位得到文字”，而是“输入字词编码后查询它的 Unicode 表示”。例如先通过拼音、双拼、五笔等方案编码找到「中」，再输出 `U+4E2D`、`\u4E2D` 等格式。它主要是为了好玩：偶尔好奇「薄荷」两个字分别是什么 Unicode 码位时，可以顺手查一下。

| 输入 | 方案示例 | 说明 |
|------|----------|------|
| `Uczhong` | 薄荷拼音全拼 | 查询「中」的 Unicode 编码 |
| `Ucvs` | 小鹤双拼 | 查询「中」的 Unicode 编码 |

当候选文字为「中」时，会生成多种候选格式：

| 格式 | 输出示例 |
|------|----------|
| Unicode 码位 | `U+4E2D` |
| 十六进制码位 | `4E2D` |
| JavaScript/JSON 转义 | `\u4E2D` |
| HTML 实体 | `&#x4E2D;` |
| Perl/Ruby 风格转义 | `\x{4E2D}` |

如果候选是多字词，转换器会按字符依次生成码位。例如输入某个词的 `Uc` 编码后，可能得到 `U+4F60 U+597D`、`\u4F60\u597D`、`&#x4F60;&#x597D;` 等候选；候选注释会显示原始字词，例如 `[你好]`。

自 2026-07-13 起，此功能使用独立的 Lua 转换器，而不是让全局 Lua 过滤器包装普通候选。这样可避免部分 librime 版本中简拼的延迟候选展开受到影响。当前薄荷方案已内置下列配置；如果你曾手动接入旧版 `unicode_filter.lua`，请按下面的方式迁移：

```yaml
engine:
  segmentors:
    - affix_segmentor@unicode
  translators:
    - script_translator             # 五笔等表形方案可为 table_translator
    - lua_translator@*unicode_translator

unicode:
  tag: unicode
  prefix: "Uc"
  tips: 〔Unicode〕

recognizer:
  patterns:
    unicode: "^Uc[a-z]*'?$"
```

旧配置中的 `script_translator@unicode`（或 `table_translator@unicode`）和 `lua_filter@*unicode_filter` 均不再需要，也不应保留旧的 `unicode` 词典、`prism` 等配置项。

::: tip 提示
Unicode 编码查询依赖当前方案的词典编码，所以全拼、双拼、五笔、九宫格等方案的 `Uc` 后缀不同；记住规则是 `Uc + 当前方案编码` 即可。
:::

## 小键盘数字处理（kp_number_processor）

`lua/kp_number_processor.lua` 注册为 `lua_processor@*kp_number_processor`，用于处理小键盘数字和主键盘数字的行为。它解决的问题是：数字键既可能要参与编码，也可能要直接上屏，还可能要在有候选菜单时选择第几个候选。

在 `rime_mint.schema.yaml` 中，处理器位于 `engine/processors` 前部：

```yaml
engine:
  processors:
    - lua_processor@*kp_number_processor
```

可配置项：

```yaml
kp_number_mode: auto  # auto | compose
```

| 模式 | 说明 |
|------|------|
| `auto` | 默认模式。空闲时小键盘数字直接上屏；正在输入时，小键盘数字参与编码 |
| `compose` | 小键盘数字始终参与编码，不直接上屏 |

主键盘数字在有候选菜单时仍可用于选候选；如果输入内容匹配 `recognizer/patterns` 中的网址、反查、金额、计算器、农历等功能编码，数字会继续作为编码输入。

## 错音错字提示（corrector_filter）

`lua/corrector_filter.lua` 注册为 `lua_filter@*corrector_filter`。此 Lua 过滤器会在你输入时提示可能的错音错字。例如，当你输入了常见的拼写错误时，候选项的注释区会显示正确的拼写提示。

此功能需要配合方案中的以下配置：

```yaml
translator:
  spelling_hints: 8
  always_show_comments: true
  comment_format: {comment}
```

## 英文自动大写（autocap_filter）

`lua/autocap_filter.lua` 注册为 `lua_filter@*autocap_filter`。当英文单词出现在句首或特定上下文时，此过滤器会自动将首字母大写。常见检索词包括英文自动大写、句首大写、auto capitalization、autocap。

## 降低英文候选（reduce_english_filter）

`lua/reduce_english_filter.lua` 注册为 `lua_filter@*reduce_english_filter`。此过滤器用于解决短英文单词在拼音输入时的干扰问题。例如输入 `rug` 时，默认会优先显示英文 `rug`，开启后会优先显示中文 `如果`。

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

`lua/select_character.lua` 注册为 `lua_processor@*select_character`。以词定字是指先输入一个词语，让目标词出现在候选区，然后通过预先定义好的按键直接上屏这个词的第一个字或最后一个字。薄荷输入法默认使用 `[` 和 `]`：
- `[`：上屏候选词的第一个字
- `]`：上屏候选词的最后一个字

例如，想输入「钛」时，直接输入 `tai` 可能很难找到这个字；可以输入 `tai he jin`，当候选区出现「钛合金」后，按 `[` 即可上屏「钛」。如果按 `]`，则会上屏「金」。

### 修改定字按键

如果想修改以词定字的按键（例如换成 `-` 和 `=`），可以在方案的 `key_binder` 中配置。修改后就需要按新的绑定键，例如 `select_first_character: "minus"` 表示按 `-` 上屏首字：

```yaml
patch:
  key_binder/select_first_character: "minus"   # 使用 - 选首字
  key_binder/select_last_character: "equal"    # 使用 = 选末字
```

## 辅码过滤（auxCode_filter）

`lua/auxCode_filter.lua` 注册为 `lua_filter@*auxCode_filter@命名空间`，用于双拼辅码、形码筛选和候选项形码提示。常见写法是：

```yaml
filters:
  - lua_filter@*auxCode_filter@flypy_full
```

这里的 `@flypy_full` 是命名空间，也对应 `lua/aux_code/flypy_full.txt`。如果没有找到指定文件，脚本会回退到默认的 `lua/aux_code/ZRM_Aux-code_4.3.txt`。

辅码数据文件位于 `lua/aux_code/`，格式为 `汉字=形码`：

```text
啊=kk
阿=ek
爱=py
安=bn
```

内置辅码数据：

| 文件名 | 常见用途 | 说明 |
|------|------|------|
| `flypy_full.txt` | 小鹤双拼、小鹤音形 | 小鹤形码 |
| `ZRM_Aux-code_4.3.txt` | 自然码 | 自然码形码，也是默认回退文件 |
| `moqi_aux_code.txt` | 其他双拼方案 | 墨奇形码 |

辅码常用配置：

```yaml
aux_code:
  trigger_word: ";"
  show_aux_notice: "trigger"  # always | trigger | none
```

| 配置项 | 说明 |
|------|------|
| `aux_code/trigger_word` | 激活辅码筛选的按键，默认是 `;` |
| `aux_code/show_aux_notice: always` | 始终显示候选项的形码提示 |
| `aux_code/show_aux_notice: trigger` | 输入激活键后才显示形码提示 |
| `aux_code/show_aux_notice: none` | 不显示形码提示 |

例如输入双拼编码后，候选区出现多个同音候选；继续输入 `;` 和形码，`auxCode_filter` 会按字或词的辅助码筛选候选。更完整的小鹤双拼辅码说明可参考[小鹤音形教程](../demo/doublePinyinFly.md)。

## 输入码全拼显示（super_preedit）

`lua/super_preedit.lua` 注册为 `lua_filter@*super_preedit`。此过滤器可以将输入码实时转换为带声调的全拼显示。例如输入 `nihao` 时，预编辑区会显示为 `nǐ hǎo`。

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

`lua/codeLengthLimit_processor.lua` 注册为 `lua_processor@*codeLengthLimit_processor`。薄荷输入法默认限制拼音串最大长度为 25 个字符，以防止过长输入导致卡顿。

修改方法：

```yaml
patch:
  codeLengthLimit_processor: 100  # 调整为 100 个字符
```

::: warning 提示
增大输入长度限制可能会导致输入法在长拼音串时出现卡顿，建议根据设备性能适当调整。
:::

## 强制垃圾回收（force_gc）

`lua/force_gc.lua` 注册为 `lua_translator@*force_gc`。它会调用 Lua 的 `collectgarbage("step")` 做增量垃圾回收，用于缓解 Lua 长时间运行后的内存增长问题。这个模块通常不需要用户手动输入触发，也不需要额外配置，保留在方案中即可。

## 候选来源标记（tag_user_dict）

`lua/tag_user_dict.lua` 注册为 `lua_filter@*tag_user_dict`，默认不在 `rime_mint.schema.yaml` 中启用。它主要用于调试候选来源，给不同类型的候选追加标记，例如用户词典、用户短语、自动补全、自动造句、默认短语。

示例配置：

```yaml
patch:
  "engine/filters/+":
    - lua_filter@*tag_user_dict
  tag_user_dict:
    user_table: "☁"
    completion: "☁"
    sentence: "~"
    phrase: ""
    user_phrase: "*"
```

常见检索关键词：候选来源、用户词典标记、用户短语标记、`user_table`、`completion`、`sentence`、`phrase`、`user_phrase`。更完整的 custom 写法可参考[自定义输入](./customizationInput.md)。

## 调试日志（log）

`lua/log.lua` 是 Lua 调试辅助模块，供其他 Lua 脚本开发或排查问题时 `require("log")` 使用。它不是 processor、translator 或 filter，默认不作为输入法功能启用。常见用途是给 `auxCode_filter.lua` 等脚本临时输出日志，定位候选处理、辅码匹配或配置读取问题。
