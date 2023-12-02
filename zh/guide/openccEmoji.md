---
layout: doc
title: Emoji配置(OpenCC)
head:
  - - meta
    - name: keywords
      content: 薄荷输入法,OpenCC,rime emoji
description: 薄荷输入法自带的OpenCC，帮助使用者在使用的过程中，输入Emoji表情
---
# Emoji配置
输入法内打出Emoji有很多种不同的方式，比如：
- 使用词典，匹配Emoji
- 使用OpenCC，进行词语的滤镜替换

目前上述两种方法都是不错的方法，这里介绍OpenCC的方法。



## OpenCC
opencc 的全名是`Open Chinese Convert`，最初用在简体中文和繁体中文之间进行转换。

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

## 薄荷输入法内Emoji
现在，我们来看看薄荷输入法内的Emoji；实际上薄荷输入法的Emoji也改版多次，比如：之前有引入iOS16的Emoji，结果Emoji过多，输入`花`等文字，可能候选项的前15个，都是Emoji；

最后使用的方法，也是回到了相对基础的版本，谋求一个平衡。

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
- emoji.txt - 该文件包含所有emoji表情的列表,每行一个emoji。它作为emoji词典的输入,用于生成emoji.json映射文件。
- others.txt - 该文件包含一些特殊词汇表的形式。

你可以自行修改，但是需要注意格式。尤其是`Tab`和`空格`。

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