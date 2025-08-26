---
layout: doc
title: Emoji配置(OpenCC)
head:
  - - meta
    - name: keywords
      content: 薄荷输入法,OpenCC,rime emoji
description: 薄荷输入法自带的OpenCC，帮助使用者在使用的过程中，输入Emoji表情; 那么如何在Rime内定制OpenCC实现输入文本的替换呢？
---
# Emoji配置  <Badge type="tip" text="^2024.06" />
输入法内打出Emoji有很多种不同的方式，比如：
- 使用词典，匹配Emoji: 和文本类似，我们输入「bo he」可以出现「薄荷」；同样，我们可以定义输入「xiao」时候，输出`笑`的同时，也出现`😄`等Emoji；
- 使用OpenCC，进行词语的滤镜替换: 比如，输入「xiao」如果只出现，「笑」，我们可是做替换，把「笑」替换输出为「笑」和「😄」；

目前上述两种方法都是不错的方法，薄荷内最初是两种方法都有使用，但是在<Badge>[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge>后，移除了词典方法，只使用OpenCC实现Emoji。本章节，就介绍如何移除薄荷内的Emoji，以及如何配置Rime内的OpenCC。

## 薄荷输入法内Emoji
现在，我们来看看薄荷输入法内的Emoji；实际上薄荷输入法的Emoji也改版多次，比如：之前有引入 iOS16 的Emoji，结果Emoji过多，输入`花`等文字，可能候选项的前15个，都是Emoji，过于影响输入了；

目前薄荷内，拼音类别使用的是 小型Emoji字典 + OpenCC 的方式，谋求一个平衡。

后续或许会考虑把字典部分也移除。

如果你不希望出现Emoji，需要做两步操作关闭：
1. 关闭Emoji的OpenCC过滤器；
2. ~~移除小型Emoji词典。~~ 2024-S02 <Badge>[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge> 后，默认已经移除了Emoji词典，无须再次移除。

### 关闭Emoji的OpenCC

以薄荷全拼（`rime_mint`)为例。Emoji的定义在`rime_mint_schema.yaml`的`engine/filters/simplifier@emoji_suggestion`。 但是，实际上，Emoji的开关在`switches`内有定义：
```yaml
switches:
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
```

所以，我们可以新建一个`rime_mint.custom.yaml`文件，然后在里面添加：
```yaml
  "switches/@last":
      name: emoji_suggestion
      reset: 0
      states: [ "😣️","😁️"]
```

这样。重新部署，即可个`rime_mint_schema.yaml`内的Emoji过滤器关闭。并且其他Emoji OpenCC的配置保留：
```yaml
# Emoji模块
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```
只是默认情况，Emoji过滤被关闭。你依旧可以临时打开使用。

### 移除小型Emoji词典 <Badge type="tip" text="^2024.06" />

::: tips 提示
2024-S02后，本章节默认已经执行，也就是不需要在操作。现在薄荷的Emoji有OpenCC实现。
:::

同样以薄荷全拼（`rime_mint`)为例。Emoji的词典在`rime_mint.dict.yaml`内：
```yaml
---
name: rime_mint                  # 注意name和文件名一致
version: "2024.02.11"
sort: by_weight
# 此处为 输入法所用到的词库，既补充拓展词库的地方
# 雾凇拼音词库，由Github Robot自动更新
import_tables:
  - dicts/custom_simple          # 自定义
  - dicts/rime_ice.8105          # 霧凇拼音 常用字集合
  - dicts/rime_ice.41448         # 霧凇拼音 完整字集合
  - dicts/rime_ice.base          # 雾凇拼音 基础词库
  - dicts/rime_ice.ext           # 雾凇拼音 扩展词库
  - dicts/other_kaomoji          # 颜文字表情（按`VV`呼出)
  - dicts/other_emoji            # Emoji(仅仅作为补充，实际使用一般是OpenCC生效)
  - dicts/rime_ice.others        # 雾凇拼音 others词库（用于自动纠错）
...
```
你可以删除`dicts/other_emoji`的配置，重新部署即可。同样，你也可以在`rime_mint.custom.yaml`内重新定义引入词库，以达到自定义的目的，不影响后续更新薄荷输入配置。

## OpenCC
OpenCC 的全名是`Open Chinese Convert`，最初用在简体中文和繁体中文之间进行转换。

比如： 使用OpenCC命令行根据，转换简体字文件为繁体字：
```bash
opencc -i simplified.txt -o traditional.txt -c t2s
```

但是原理实际上就是文本的替换和扩写，相当于Java的`replace`，所以后续也用来作为Emoji的实现。

网上还有一些人用来古诗句、中英词典，其实也是一个不错的方法；但是OpenCC因为是文本的替换，不适合文本量众多的词句库。

举个例子，存在OpenCC文件配置:
```yaml
露齿笑	露齿笑 😃
哈	哈 😄
哈哈	哈哈 😄
开心	开心 😄
笑	笑 😄 😊
```
这个时候，输入`露齿笑`，就会把词语变成`露齿笑`和`😃`，达到Emoji在输入法内混输的目的。

### 定制Emoji
如果你想对Emoji进行定制，Emoji的配置文件，就是OpenCC文件夹内的三个文件：
```txt
.
├── emoji.json
├── emoji.txt
└── others.txt
```
其中：
- emoji.json - 该文件包含emoji表情的映射规则。OpenCC会根据这个json文件进行emoji的转换。
- emoji.txt - 该文件包含所有emoji表情的列表，每行一个emoji。它作为emoji词典的输入，用于生成emoji.json映射文件。
- others.txt - 该文件包含一些特殊词汇表的形式。

你可以自行修改，但是需要注意格式。尤其是`Tab`和`空格`：
```YAML
笑⇥笑 😄 😊
```

### Emoji开关
在输入法的配置文件中存在开关，`rime_mint.schema.yaml`中的：
```yaml
switches:
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
```
对应的就是Emoji的开关，用于控制字符的过滤。而字符的过滤，也就是在
```yaml
engine:
  filters:
    - simplifier                          # rime自带的繁体字过滤
    - simplifier@emoji_suggestion         # Emoji过滤
    - simplifier@transcription_cc         # 简体繁体过滤
    - lua_filter@reduce_english_filter    # 降低部分英语单词在候选项的位置
    - uniquifier                          # 去重
```

当然，还有具体的过滤细则：
```yaml
# Emoji模块
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```
以上内容，构成薄荷输入法的Emoji OpenCC。如果需要更改，可以参考上述内容。