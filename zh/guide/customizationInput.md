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

我自己理解，`自定义文本`，就是权重特别高的字典（默认是这样的，但可以通过`initial_quality`调整各个翻译器的权重）；所以，我就去除了`自定义文本`的配置。**如果需要，可以自行配置**。
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

# 自定义短语
custom_phrase:
  dictionary: ""
  user_dict: custom_phrase   # 需要手动创建 custom_phrase.txt 文件
  db_class: stabledb
  enable_completion: false   # 补全提示
  enable_sentence: false     # 禁止造句
  initial_quality: 99        # custom_phrase 的权重应该比其他词库大
```

自定义文本不与其他翻译器互相造词，**如果使用了完整编码，那么这个字或词将无法参与造词，即自造词无法被记住。**

所以建议只固定非完整编码的字词，`「的」`(de)应为`「d」`，`「是」`(shi)应为`「是s」`，`「仙剑」`(xian jian)应为`「xj」`。

注意全拼的`a o e`也是完整拼写，不宜将`a o e`的单字写进自定义文本，否则`「啊 哦 呃」`无法进行造词。也就是这些不宜加入：
```yaml
啊 a
哦 o
```

以薄荷输入法内的薄荷全拼为例，根据[配置覆写和定制](configurationOverride.html)的方法，我们可以创建`rime_mint.custom.yaml`文件：

```yaml
# Rime Custom
# encoding: utf-8

patch:
  "engine/translators/+":
    - table_translator@mint_simple            # 薄荷自定义短语

  # 薄荷自定义短语
  mint_simple:
    dictionary: ""
    user_dict: dicts/rime_mint.simple
    db_class: stabledb
    enable_completion: false
    enable_sentence: false
    initial_quality: 0.5
    comment_format:
      - xform/^.+$//
```

与此同时，我们需要创建`dicts/rime_mint.simple.txt`文件：
```yaml
# Rime table
# coding: utf-8
#@/db_name	rime_mint.simple.txt
#@/db_type	tabledb
#
#
# 此行之后不能写注释
我们	wm
```
注意，`rime_mint.simple.txt`文件内的内容，是`「词」<Tab>「拼音简写」`的格式。

最后，重新部署输入法，就可以看到自定义文本的效果了。

## 双拼编码转义

薄荷的默认配置，双拼的候选区编码是有做转换的，比如：小鹤双拼需要拼写`你好`，会出现`nihao`，而不是`nihc`：

![双拼编码转义为正常](/image/guide/doublePinyinPreedit_format.webp)

其实是因为方案内部的`translator/preedit_format`配置，这个配置是用来转义编码的，依旧以小鹤双拼为例：
```yaml
translator:
  preedit_format:
    - xform/([bpmfdtnljqx])n/$1iao/
    - xform/(\w)g/$1eng/
    - xform/(\w)q/$1iu/
    - xform/(\w)w/$1ei/
    - xform/([dtnlgkhjqxyvuirzcs])r/$1uan/
    - xform/(\w)t/$1ve/
    - xform/(\w)y/$1un/
    - xform/([dtnlgkhvuirzcs])o/$1uo/
    - xform/(\w)p/$1ie/
    - xform/([jqx])s/$1iong/
    - xform/(\w)s/$1ong/
    - xform/(\w)d/$1ai/
    - xform/(\w)f/$1en/
    - xform/(\w)h/$1ang/
    - xform/(\w)j/$1an/
    - xform/([gkhvuirzcs])k/$1uai/
    - xform/(\w)k/$1ing/
    - xform/([jqxnl])l/$1iang/
    - xform/(\w)l/$1uang/
    - xform/(\w)z/$1ou/
    - xform/([gkhvuirzcs])x/$1ua/
    - xform/(\w)x/$1ia/
    - xform/(\w)c/$1ao/
    - xform/([dtgkhvuirzcs])v/$1ui/
    - xform/(\w)b/$1in/
    - xform/(\w)m/$1ian/
    - xform/([aoe])\1(\w)/$1$2/
    - "xform/(^|[ '])v/$1zh/"
    - "xform/(^|[ '])i/$1ch/"
    - "xform/(^|[ '])u/$1sh/"
    - xform/([jqxy])v/$1u/
    - xform/([nl])v/$1ü/
    - xform/ü/v/  # ü 显示为 v
```

如果你不需要，可以覆写方案配置内的`translator/preedit_format`为空。以小鹤双拼为例，我们可以创建`double_pinyin_flypy.custom.yaml`文件：
```yaml
# Rime Custom
# encoding: utf-8

patch:
  translator/preedit_format: []
```

之后，重新部署输入法，就可以看到双拼的编码了。

::: warning 注意
一个custom内，只能有一个`patch`入口，比如我还覆写了其他配置，那么`custom`文件可能是这样的：
```yaml
# Rime Custom
# encoding: utf-8

patch:
  "switches/@last":
      name: emoji_suggestion
      reset: 1
      states: [ "😣️","😁️"]
  "engine/translators/+":
    - table_translator@wubi86_jidian
  wubi86_jidian:
    dictionary: wubi86_jidian           # 英文词典
    enable_sentence: false         # 关闭自动造句
    enable_completion: false       # 关闭自动提示
    initial_quality: 0.8
  "engine/filters/+":
    - lua_filter@*tag_user_dict               # 标记用户的短语和词典
  # 词库提示
  tag_user_dict:
    # 用户词典表示
    user_table: '☁'
    # 自动不全
    completion: '☁'
    # 自动造句
    sentence: '~'
    # 默认短语
    phrase: ''
    # 用户短语
    user_phrase: '*'
  # 编码转义
  translator/preedit_format: []
```

![只能有一个patch](/image/guide/onlyOnePatchInCustom.webp)

:::