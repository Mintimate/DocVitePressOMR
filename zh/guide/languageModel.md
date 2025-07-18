---
layout: doc
title: 设置语言模型
aside: true
---

# 设置语言模型
实际上，Rime 是自带一个语言模型的，也就是平时我们所说的“[八股文](https://github.com/lotem/rime-octagram-data)”，也就是在词典设置时候，可以选择的配置参数：
```yaml
---
name: rime_mint                  # 注意name和文件名一致
version: "2024.02.11"
sort: by_weight
use_preset_vocabulary: false     # 是否启用预设的“八股文”模型
# 此处为 输入法所用到的词库，既补充拓展词库的地方
# 雾凇拼音词库，由Github Robot自动更新
import_tables:
  - dicts/custom_simple          # 自定义
  - dicts/rime_ice.8105          # 白霜拼音 常用字集合
  - dicts/rime_ice.41448         # 白霜拼音 完整字集合
  - dicts/rime_ice.base          # 白霜拼音 基础词库
  - dicts/rime_ice.ext           # 白霜拼音 扩展词库
  - dicts/other_kaomoji          # 颜文字表情（按`VV`呼出)
  - dicts/rime_ice.others        # 雾凇拼音 others词库（用于自动纠错）
  # 20240608 Emoji完全交友OpenCC，不再使用字典作为补充
  # - dicts/other_emoji            # Emoji(仅仅作为补充，实际使用一般是OpenCC生效)
...
```

但是，rime 自带的“八股文”，实际上也是 Lite 版本：[https://github.com/rime/rime-essay](https://github.com/rime/rime-essay)。所以，实际的效果有限，好在我们可以自定义语言模型。

这里推荐大家可以使用 [万象拼音模型](https://github.com/amzxyz/RIME-LMDG)。

## 使用效果
首先，我们看看没有安装万象拼音模型的效果：

如果我们想输入：`渐渐地就不在意了`，对应码字 `jian jian de jiu bu zai yi le`。如果没有万象拼音模型，可能会出现：

![没有万象拼音模型](/image/guide/noLMDG.webp)

> （「不/在意/了」被理解成了「不再/一乐」）

使用了万象拼音模型后，效果如下：

![有万象拼音模型](/image/guide/withLMDG.webp)

也就是对于句子和词组的识别更加准确。

## 安装万象模型

安装万象拼音模型，需要下载对应的文件，然后将其放入 Rime 的配置目录内。首先打开[万象拼音模型的 Github 仓库发布地址](https://github.com/amzxyz/RIME-LMDG/releases)，下载最新的版本：

![下载万象拼音模型](/image/guide/downloadLMDG.webp)

::: info 镜像加速信息

如果你无法访问 GitHub，或者下载过慢；那么可以使用薄荷提供的镜像下载（感谢 [CNB](https://cnb.cool) 提供的算力和存储支持；自动同步最新版本 万象模型 : 
- [万象模型「wanxiang-lts-zh-hans.gram」（镜像自 GitHub Release）](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/wanxiang-lts-zh-hans.gram)

:::

之后，移动配置文件到 Rime 的配置目录内，比如 macOS 鼠须管的配置目录：`$HOME/Library/Rime/`：

![移动配置文件](/image/guide/moveLMDG.webp)

这里，我们下载的语言模型文件是：`amz-v3n2m1-zh-hans.gram`，所以我们如果要在`薄荷全拼（rime_mint）`中使用，可以在`rime_mint.custom.yaml`中添加：

```yaml
patch:
  # 语言模型
  "grammar/language": amz-v3n2m1-zh-hans
  "grammar/collocation_max_length": 5
  "grammar/collocation_min_length": 2

  # translator 内加载
  "translator/contextual_suggestions": true
  "translator/max_homophones": 7
  "translator/max_homographs": 7
```

最后，重新部署即可。

如果你想直接修改 `rime_mint.schema.yaml`，可以直接这样修改：

![修改配置文件](/image/guide/modifySchemaWithLMDG.webp)

## 使用建议
建议喜欢打长句的小伙伴，可以加载万象拼音模型，这样对于长句的识别更加准确。

## 参考
- [V2ex -- 感觉 Rime 的分词和搭配很成问题啊](https://www.v2ex.com/t/1097614)
- [Emacs China -- 为rime的输入方案启用语言模型](https://emacs-china.org/t/rime/28508)