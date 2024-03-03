---
layout: doc
title: Rime输入内容定制
head:
  - - meta
    - name: keywords
      content: Rime词典定制,Rime多端同步,Rime配置同步
description: 在Rime输入法内，如何同步多端的配置呢？ 并且如何定制词典功能呢？ 可以查看本文学习如何进行定制词典内容和多端同步。
---

# 输入的内容定制

如果你想定制一些内容，本文进行了一些讲解。

建议定制本文内容，使用软件：
- [Visual Studio Code: https://code.visualstudio.com](https://code.visualstudio.com/)

本文内容参考：
- [雾凇拼音文档: https://dvel.me/posts/rime-ice](https://dvel.me/posts/rime-ice)
- [Rime官方定制指南: https://github.com/rime/home/wiki/CustomizationGuide](https://github.com/rime/home/wiki/CustomizationGuide)

## 编写词库
由于 Rime 的设计，拼音词库中并不适用`英文单词`和`超级简拼`：
```yaml
# 错误（不建议）示例
hello	hello
世界	s j
蒙奇·D·路飞	meng qi d lu fei
```
可以看到，`世界`使用`s`和`j`，这样会导致输入`s`后，无法检录出`s`开头的字或者词；同理，`j`和`d`也会导致无法检录出相关开头的词语。

如果词库都采用这样的设计，那么当你输入`s`时候，会把所有`s`开头的词语全部检录，导致输入法卡顿，甚至内存泄露，输入法闪退。

所以：
- 建议词库内容全部全拼；
- 英文词库放在英文字典里，英文薄荷输入法，是把英文词库作为第二输入源，并且关闭英文输入的自动联想和造句。

查看薄荷输入法的文件，你会发现目录结构是这样的：
```text
dicts
├── custom_simple.dict.yaml        # 预留的自定义词典，可以把自己喜欢的词丢在这里
├── luna_pinyin.biaoqing.dict.yaml # 表情包词典
├── luna_pinyin.emoji.dict.yaml    # Emoji词典，后续可能会移除
├── luna_pinyin.extended.dict.yaml # 明月拼音的词典，后续可能会移除
├── rime_ice.41448.dict.yaml       # 雾凇拼音的扩展单字
├── rime_ice.8105.dict.yaml        # 雾凇拼音的基础单字
├── rime_ice.base.dict.yaml        # 雾凇拼音核心基础词库
├── rime_ice.en.dict.yaml          # 雾凇拼音的英文词典
├── se_words.dict.yaml             # 软件从业常用词典
├── terra_rime_ice.base.dict.yaml  # 地球拼音词典（Python生成）
└── wubi98_base.dict.yaml          # 98五笔词典
```
词典文件内部的编写：
```yaml
---
name: 词库名
version: "版本号"
sort: by_weight（按权重排序） | original（按码表顺序排序）
columns:    # 不写 columns 属性时，默认顺序为：
- text    # 词汇
- code    # 编码
- weight  # 权重
- stem    # 造词码（不知道是啥，好像和拼音方案没有关系）
  ...
  你好	ni hao	123
  对于没有注音，又想设置权重的词库文件，修改列即可：

---
```
举例，**注意，词内的格式是`『词』<Tab>『拼音』<空格>『拼音』<空格>『拼音』<Tab>『权重』`**：
```yaml
# Rime dictionary
# encoding: utf-8
#
# 个性化词语 - by @Mintimate
# 建议自定义短语或者词语追加在这里
---
name: custom_simple
version: "2023.11.30"
sort: by_weight
...

# 人名
# 常用语
哈哈	ha ha	99
macOS	mac	99
可以	ke yi	99
# (｡>ㅅ<｡)
Mintimate	mintimate	1
https://www.mintimate.cn	mintimate	2
Mintimate's Blog	mintimate	3
```

这些词典由根目录下的词典主驱动配置进行引用：
```text
├── custom_dict_en.all.dict.yaml        # 薄荷输入法的英文词典
├── custom_dict_terra.all.dict.yaml     # 地球拼音 薄荷定制词典
├── custom_dict.all.dict.yaml           # 薄荷拼音词典
└── custom_dict.wubi.dict.yaml          # 98五笔 薄荷定制词典
```

看看内部是如何引用：
```yaml
---
name: custom_dict.all ##注意name和文件名一致
version: "2020.6.7"
sort: by_weight
# 此处为 输入法所用到的词库，既补充拓展词库的地方
import_tables:
  - dicts/rime_ice.8105 # 霧凇拼音 常用字集合
  - dicts/rime_ice.41448 # 霧凇拼音 完整字集合
  - dicts/custom_simple # 自定义
  - dicts/rime_ice.base  # 雾凇拼音 https://github.com/iDvel/rime-ice
  - dicts/se_words # 互联网网络词汇
  - dicts/luna_pinyin.biaoqing # 表情
  - dicts/luna_pinyin.emoji # emoji Ext
...
```

关键点： 
- `name`: `name`为文件名去除`dict`后缀，并且文件名也需要`dict`;
- `import_tables`: 后面枚举需要引入的词典。

修改好词库后，记得重新部署输入法。

以上内容，可以帮助你定制词库。


## 自定义文本
`自定义文本`，就是输入法内`custom_phrase.txt`，你在薄荷输入法内应该看不到…… 

我自己理解，`自定义文本`，就是权重特别高的字典（默认是这样的，但可以通过`initial_quality`调整各个翻译器的权重）；所以，我就去除了`自定义文本`的配置。如果需要，可以自行配置。
格式和字典一样：
```yaml
# Rime table
# coding: utf-8
# 自定义文本
# 此行之后不能写注释
噷	hm
哼	hng


去	q	2
千	q	1

我	w	3
万	w	2
往	w	1

等等	dd
的地得	ddd
等等等等	dddd
刚刚	gg
才刚刚	cgg
知道	zd
不知道	bzd
```
同时，输入法的配置内需要加上：
```yaml
translators:
    - table_translator@custom_phrase      # 自定义短语 custom_phrase.txt
```

自定义文本不与其他翻译器互相造词，如果使用了完整编码，那么这个字或词将无法参与造词，即自造词无法被记住。

所以建议只固定非完整编码的字词，`「的de」`应为`「的d」`，`「是shi」`应为`「是s」`，`「仙剑xianjian」`应为`「仙剑xj」`。

注意全拼的`a o e`也是完整拼写，不宜将`a o e`的单字写进自定义文本，否则`「啊 哦 呃」`无法进行造词。
```