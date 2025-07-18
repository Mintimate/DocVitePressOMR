---
layout: doc
title: Setting Language Model
aside: true
---

# Setting Language Model
In fact, Rime comes with a built-in language model, which we usually refer to as the "[八股文](https://github.com/lotem/rime-octagram-data)". This can be configured in the dictionary settings with the following parameters:
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

However, the built-in "八股文" in Rime is actually a Lite version: [https://github.com/rime/rime-essay](https://github.com/rime/rime-essay). Therefore, the actual effect is limited, but fortunately, we can customize the language model.

Here, we recommend using the [RIME-LMDG](https://github.com/amzxyz/RIME-LMDG).

## Usage Effect
First, let's see the effect without installing the RIME-LMDG Model:

If we want to input: `渐渐地就不在意了`, corresponding to the code `jian jian de jiu bu zai yi le`. Without the RIME-LMDG Model, it might appear as:

![No RIME-LMDG Model](/image/guide/noLMDG.webp)

> ("不/在意/了" is understood as "不再/一乐")

After using the RIME-LMDG Model, the effect is as follows:

![With RIME-LMDG Model](/image/guide/withLMDG.webp)

That is, the recognition of sentences and phrases is more accurate.

## Installing RIME-LMDG Model

To install the RIME-LMDG Model, you need to download the corresponding files and place them in the Rime configuration directory. First, open the [RIME-LMDG Model's Github repository](https://github.com/amzxyz/RIME-LMDG/releases) and download the latest version:

![Download RIME-LMDG Model](/image/guide/downloadLMDG.webp)

::: info Mirror Acceleration Information

If you cannot access GitHub, or the download is too slow; then you can use the mirror acceleration provided by [CNB](https://cnb.cool) (thanks to [CNB](https://cnb.cool) for providing computing power and storage support; automatically synchronize the latest version of the RIME-LMDG Model:
- [RIME-LMDG Model「wanxiang-lts-zh-hans.gram」 (Mirror from GitHub Release)](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/wanxiang-lts-zh-hans.gram)

:::

Then, move the configuration file to the Rime configuration directory, such as the macOS Squirrel configuration directory: `$HOME/Library/Rime/`:

![Move Configuration File](/image/guide/moveLMDG.webp)

Here, the language model file we downloaded is: `amz-v3n2m1-zh-hans.gram`, so if we want to use it in `薄荷全拼 (rime_mint)`, we can add it in `rime_mint.custom.yaml`:

```yaml
patch:
  # Language model
  "grammar/language": amz-v3n2m1-zh-hans
  "grammar/collocation_max_length": 5
  "grammar/collocation_min_length": 2

  # Load within translator
  "translator/contextual_suggestions": true
  "translator/max_homophones": 7
  "translator/max_homographs": 7
```

Finally, redeploy.

If you want to directly modify `rime_mint.schema.yaml`, you can modify it as follows:

![Modify Configuration File](/image/guide/modifySchemaWithLMDG.webp)

## Usage Recommendations
It is recommended for those who like to type long sentences to load the RIME-LMDG Model, as it provides more accurate recognition for long sentences.

## References
- [V2ex -- 感觉 Rime 的分词和搭配很成问题啊](https://www.v2ex.com/t/1097614)
- [Emacs China -- 为rime的输入方案启用语言模型](https://emacs-china.org/t/rime/28508)