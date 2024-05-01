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
# 反查功能 <Badge type="tip" text="^2024.04" />
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
如果不需要某些反查，可以按照这个配置方法进行逆向配置。

以反查拆字为例，在目标输入方案的头部`dependencies`内引入拆字的方案：
```yaml
dependencies:
    - radical_pinyin_flypy
```
之后是在`engine`的`segmentors`和`translators`引入`tag`：
```yaml
  segmentors:
    - ascii_segmentor # 標識西文段落
    - matcher         # 標識符合特定規則的段落，如網址、反查等
    - affix_segmentor@radical_reverse_lookup   # 引入的反查
    - abc_segmentor             # 標識常規的文字段落
    - punct_segmentor           # 標識句讀段落
    - fallback_segmentor        # 標識其他未標識段落
  translators:
   - punct_translator  # ※ 轉換標點符號
   - script_translator
   - reverse_lookup_translator@radical_reverse_lookup
```

这个`tag`可以这样定义：
```yaml
radical_reverse_lookup:
  tag: radical_lookup
  dictionary: radical_pinyin
  enable_completion: false
  enable_sentence: false
  prefix: "Uu"
  suffix: " '"
  comment_format:
    - erase/^.*$//
    - xform/([nljqxy])v/$1ü/
  tips: 〔拆字〕

reverse_lookup:
  tags: [wubi98_mint,stroke,radical_lookup]
  overwrite_comment: true
  dictionary: dicts/rime_ice.8105
```

末尾的`recognizer`内引入：
```yaml
# 反查映射
recognizer:
  import_preset: default
  patterns:
    punct: "^/([0-9]0?|[a-z]+)$"
    radical_lookup: "Uu[a-z]*'?$"
```

这样，反查就配置好了。

## 拆字反查

**个人觉得这应该是反查内最为实用的反查**；在薄荷输入法内，按下`Uu`进行激活拆字模式，后续输入的内容，将使用拆字字库进行解析。

举个例子: 键盘上输入`Uuniuniuniu`，会被解析为`niu niu niu`的组合，也就是三个`牛`：`犇`:

![拆字反查](/image/demo/reverseChaizi.webp)

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
