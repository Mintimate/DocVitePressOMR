---
layout: doc
title: Emoji Configuration (OpenCC)
aside: true
head:
  - - meta
    - name: keywords
      content: Mint Pinyin,oh-my-rime, OpenCC, Rime emoji
description: Oh-my-rime, the built-in OpenCC in the Rime input method, helps users input emoji expressions during their usage.
---
# Emoji Configuration <Badge type="tip" text="^2024.06" />
There are many different ways to output Emoji in the input method, such as:
- Using a dictionary to match Emoji: Similar to text, we can input "bo he" to get "mint"; similarly, we can define that when we input "xiao", in addition to outputting "laugh", we can also output Emoji like `😄`;
- Using OpenCC to replace words with a filter: For example, if we input "xiao" and only "laugh" appears, we can replace "laugh" with "laugh" and `😄`;

At present, both of the above methods are good methods. Initially, Mint used both methods, but after the commit <Badge>[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge>, the dictionary method was removed, and only OpenCC was used to implement Emoji. This chapter introduces how to remove Emoji in Mint and how to configure OpenCC in Rime.

## Emoji in Mint Input Method
Now, let's take a look at the Emoji in the Mint input method. In fact, the Emoji in the Mint input method has been revised many times. For example, previously it introduced Emoji from iOS 16, but the result was too many Emojis. When you enter the word "flower", the first 15 candidates were all Emojis, which greatly affected the input.

Currently, the Pinyin category in Mint uses a small Emoji dictionary + OpenCC method to seek a balance.

In the future, we may consider removing the dictionary part.

If you don't want to see Emoji, you need to do two steps to close:
1. Close the Emoji OpenCC filter;
2. ~~Remove the small Emoji dictionary.~~ After 2024-S02 <Badge>[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge>, the Emoji dictionary has been removed by default, no need to remove it again.


### Close Emoji's OpenCC

Take Mint's full spelling (`rime_mint`) as an example. The definition of Emoji is in `rime_mint_schema.yaml`'s `engine/filters/simplifier@emoji_suggestion`. But in fact, the switch of Emoji is defined in `switches`:
```yaml
switches:
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
```

So, we can create a new `rime_mint.custom.yaml` file, and then add in it:
```yaml
  "switches/@last":
      name: emoji_suggestion
      reset: 0
      states: [ "😣️","😁️"]
```

In this way. Redeploy, you can close the Emoji filter in `rime_mint_schema.yaml`. And other Emoji OpenCC configurations are retained:
```yaml
# Emoji module
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```
It's just that by default, the Emoji filter is turned off. You can still temporarily turn it on for use.

### Removing the Small Emoji Dictionary <Badge type="tip" text="^2024.06" />

::: tips 提示
2024-S02后，After 2024-S02, this chapter has been executed by default, so there is no need to operate it again. Now, the Emoji in Mint is implemented by OpenCC.
:::

Similarly, taking Mint's full spelling (`rime_mint`) as an example. The Emoji dictionary is in `rime_mint.dict.yaml`:
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
You can delete the `dicts/other_emoji` configuration and redeploy. Similarly, you can redefine the imported dictionary in `rime_mint.custom.yaml` to achieve customization without affecting subsequent updates to the Mint input configuration.

## OpenCC
OpenCC, short for "Open Chinese Convert," was originally designed for converting between Simplified Chinese and Traditional Chinese.

For example, you can use the OpenCC command line to convert a file from Simplified Chinese to Traditional Chinese:
```bash
opencc -i simplified.txt -o traditional.txt -c t2s
```

However, the underlying principle is actually text replacement and expansion, similar to Java's `replace` function. Therefore, it has also been used for implementing emojis.

Some people online have used OpenCC for ancient poetry or Chinese-English dictionaries, which is also a good approach. However, OpenCC's text replacement mechanism is not suitable for large-scale text libraries.

For example, let's consider an OpenCC file configuration:
```yaml
露齿笑	露齿笑 😃
哈	哈 😄
哈哈	哈哈 😄
开心	开心 😄
笑	笑 😄 😊
```
In this case, when you input "露齿笑," it will be transformed into both the word "露齿笑" and the emoji "😃," allowing you to mix emojis with regular text in the input method.

## Emoji in Rime (Mint Pinyin)
Now, let's take a look at emojis in Rime with the Mint Pinyin input method. In fact, the emojis in Rime have undergone multiple revisions. For example, in a previous version, Rime introduced emojis from iOS 16, but there were too many emojis. As a result, when you entered the character "花" (flower), the first 15 candidates were all emojis.

In the end, the method used was reverted to a relatively basic version in order to strike a balance.

### Customizing Emojis
If you want to customize emojis, the emoji configuration files are located in the OpenCC folder and consist of three files:
```text
.
├── emoji.json
├── emoji.txt
└── others.txt
```
Here's what each file contains:
- emoji.json: This file contains the mapping rules for emojis. OpenCC will use this JSON file for emoji conversion.
- emoji.txt: This file contains a list of all emojis, with each emoji on a separate line. It serves as the input for the emoji dictionary and is used to generate the emoji.json mapping file.
- others.txt: This file contains forms of special vocabulary.

You can modify these files yourself, but be sure to pay attention to the format, especially the use of tabs and spaces.

### Emoji Toggle
There is a toggle switch in the configuration file of the input method, `rime_mint.schema.yaml`:
```yaml
switches:
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
```
This switch controls the availability of emojis and filters certain characters. The character filtering is done in the following section:
```yaml
engine:
  filters:
    - simplifier                          # Rime's built-in traditional Chinese simplification
    - simplifier@emoji_suggestion         # Emoji filtering
    - simplifier@transcription_cc         # Simplified and traditional Chinese conversion
    - lua_filter@reduce_english_filter    # Lowering the priority of some English words in the candidates
    - uniquifier                          # Deduplication
```

Of course, there are specific rules for filtering:
```yaml
# Emoji module
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```
The above content constitutes the Emoji OpenCC in the Rime input method. If you need to make changes, you can refer to the information provided above.