---
layout: doc
title: 反查功能
head:
  - - meta
    - name: keywords
      content: 薄荷拼音,薄荷输入法,功能键,反查,组合输入,第二翻译器
description: 薄荷输入法自带的反查功能，帮助使用者在使用的过程中，可以拆字输入、笔画输入和五笔输入。比如： 输入三个“牛”，可以自动组合为“犇”
aside: true
---
# 反查功能 <Badge type="tip" text="^2026.03" />
所谓反查，简单地说就是使用其他输入模式，查找现有输入模式下的字符输入。

> 2024.04: 反查功能，由原本的`uu/~u`、`uw/~w`、`ui/~i`等，统一改为`Uu`、`Uw`、`Ui`等，方便记忆。
> 参考: <Badge type="tip">[51779acb8](https://github.com/Mintimate/oh-my-rime/commit/51779acb88a447926af451426439573d504638f7)</Badge>

举个例子: 在小鹤双拼模式下，突然不知道`龘`的读音，就可以使用`Uu`进行拆字反查，输入`Uu`后，输入`longlonglong`调用拆字输入模式，查找`龘`字，并在小鹤双拼的词库内反查读音和字，辅助输入。

薄荷输入法的拼音方案内包含三个反查:
- 拆字反查(Uu)
- 五笔反查(Uw)
- 笔画反查(Ui)

五笔输入内支持:
- 拼音反查(Up)

## 配置方法

薄荷输入法已内置完整的反查配置。本节介绍如何自定义和移除反查功能。

::: tip 推荐使用 custom 文件覆写
Rime 支持 `.custom.yaml` 文件覆写配置，这样可以在不修改原文件的情况下自定义设置，且不会因更新而被覆盖。

例如，覆写薄荷拼音配置，创建 `rime_mint.custom.yaml` 文件。
:::

### 自定义反查

如果需要修改反查的前缀或提示文字，可以在 `custom` 文件中覆写。以拆字反查为例：

```yaml
# rime_mint.custom.yaml
patch:
  radical_reverse_lookup:
    prefix: "Vu"           # 将前缀从 Uu 改为 Vu
    tips: 〔拆字反查〕      # 修改提示文字
  # 同步修改 recognizer 以匹配新前缀
  "recognizer/patterns/radical_lookup": "Vu[a-z]*'?$"
```

::: warning 注意同步 recognizer
修改反查前缀时，必须同步更新 `recognizer/patterns` 中对应的匹配规则，否则新的前缀无法触发反查功能。
:::

如果需要开启「声起」功能以显示带声调的拼音注释：

```yaml
# rime_mint.custom.yaml
patch:
  "switches/@next":
    name: tone_display
    states: [ 声杳, 声起 ]
    reset: 1               # 默认开启
```

### 移除反查功能

如果不需要某些反查功能，可以在 `custom` 文件中移除相关配置。以移除笔画反查为例：

```yaml
# rime_mint.custom.yaml
patch:
  # 移除依赖
  "dependencies/@next": {}
  # 从 segmentors 中移除
  "engine/segmentors/@before 4": {}
  # 从 translators 中移除
  "engine/translators/@before 6": {}
  # 从 reverse_lookup.tags 中移除
  "reverse_lookup/tags/@before 2": {}
  # 移除 recognizer pattern
  "recognizer/patterns/stroke": {}
```

### 添加新的反查

如果需要添加新的反查功能，需要完成以下步骤：

1. **添加依赖**：在 `dependencies` 中引入目标方案
   ```yaml
   dependencies:
     - radical_pinyin
   ```

2. **添加引擎组件**：在 `engine` 的 `segmentors` 和 `translators` 中引入
   ```yaml
   engine:
     segmentors:
       - affix_segmentor@radical_reverse_lookup
     translators:
       - reverse_lookup_translator@radical_reverse_lookup
   ```

3. **定义反查配置**：
   ```yaml
   radical_reverse_lookup:
     tag: radical_lookup
     dictionary: radical_pinyin
     prefix: "Uu"
     tips: 〔拆字〕
   
   reverse_lookup:
     tags: [radical_lookup]
     overwrite_comment: true
   ```

4. **添加识别规则**：
   ```yaml
   recognizer:
     patterns:
       radical_lookup: "Uu[a-z]*'?$"
   ```

## 拆字反查

**个人觉得这应该是反查内最为实用的反查**；在薄荷输入法内，按下`Uu`进行激活拆字模式，后续输入的内容，将使用拆字字库进行解析。

举个例子: 键盘上输入`Uuniuniuniu`，会被解析为`niu niu niu`的组合，也就是三个`牛`：`犇`:

![拆字反查](/image/demo/reverseChaizi.webp)

::: tip 输入注释显示（声起）
在薄荷输入法内，反查结果支持显示完整的拼音注释。这一功能由「**声起**」开关控制：
- **声杳**：关闭拼音注释显示
- **声起**：开启拼音注释显示，在反查时会在输入框显示完整拼音

开启后，输入 `Uuniuniuniu` 时，preedit 会实时显示为带声调的完整拼音（如 `niú niú niú`），帮助你确认拆字组合的正确读音。

**工作原理**：
1. 在 schema 中定义 `tone_display` 开关
   ```yaml
   - name: tone_display
     states: [ 声杳, 声起 ]
     reset: 0
   ```
2. Lua 过滤器 `super_preedit.lua` 读取开关状态，将输入编码转换为带声调的全拼显示在 preedit 区域
3. 反查时 `reverse_lookup` 配置的 `overwrite_comment: true` 确保注释被正确覆盖显示
:::

## 五笔反查
在薄荷拼音内，中文输入法模式下，使用`Uw`进行激活五笔模式，后续输入的内容，将使用五笔进行解析。

举个例子: 键盘上输入`Uwq`，会被解析为`q`的，在五笔词库内检录，自动查询到`我`这个字，方便组合查找字：
![五笔反查](/image/demo/reverseWubi.webp)

## 笔画反查
在薄荷拼音内，中文输入法模式下，使用`Ui`进行激活笔模式，后续输入的内容，将使用笔画进行解析。

::: danger 移除倒计时

考虑到笔画的输入方式，使用的人太少。 近期在考虑移除笔画反查和笔画有关配置。如果你还在使用笔画输入或反查，请一定要联系我们，否则后续我们可能会移除笔画类。

:::

## 拼音反查
在薄荷五笔内，中文输入法模式下，使用`Up`进行激活笔模式，后续输入的内容，将使用拼音进行解析。
