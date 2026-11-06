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

Mint currently provides Emoji candidates through OpenCC. The small Emoji dictionary was removed from the default configuration after 2024-S02. To disable Emoji by default, adjust the switch below.


### Close Emoji's OpenCC

For Mint full-pinyin (`rime_mint`), `simplifier@emoji_suggestion` in the `engine/filters` list of `rime_mint.schema.yaml` loads the Emoji filter. The current schema's `switches` list starts with:
```yaml
switches:
  - name: ascii_mode
    reset: 0
    states: [ 中文, 英文 ]
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
  # Remaining switches omitted
```

For a compact patch that changes only one field, use its list index. Emoji is currently the second item and indexes start at `0`, so change its `reset` value at `@1` in `rime_mint.custom.yaml`:
```yaml
patch:
  # The second switch in the current schema is emoji_suggestion
  "switches/@1/reset": 0
```

If the file already has a `patch:` block, add the setting to that block instead of creating another one. For other schemas or a reordered switch list, first find the actual index of `name: emoji_suggestion`.

::: tip @last and /+ are both valid syntax
`@last` changes the last item and is appropriate when the target switch is actually last. The last switch in the current Mint full-pinyin schema is `ascii_punct`. Replacing it with an Emoji switch can also disable Emoji by default, but removes the punctuation switch and creates a duplicate Emoji switch.

`switches/+` appends switches to the list; it does not update existing items by `name`. Appending a duplicate Emoji switch also overrode its initial state in our librime 1.17.0 test, but the compiled configuration still contained two switches with the same name. Use `/+` to add a new switch; to modify an existing one, check its position or replace the complete list.
:::

<details>
<summary>Avoid numeric indexes: replace the complete switches list</summary>

The following is the complete switch list for the current Mint full-pinyin schema. Each `name` makes its purpose visible; only Emoji's `reset` value changes to `0`. Choose either this approach or the index patch above:

```yaml
patch:
  switches:
    - name: ascii_mode
      reset: 0
      states: [ 中文, 英文 ]
    - name: emoji_suggestion
      reset: 0
      states: [ "😣️", "😁️" ]
    - name: full_shape
      reset: 0
      states: [ 半角, 全角 ]
    - name: tone_display
      reset: 0
      states: [ 声杳, 声起 ]
    - name: transcription
      reset: 0
      states: [ 简体, 繁体 ]
    - name: ascii_punct
      reset: 0
      states: [ "。，", "．，" ]
```

This replaces the entire list. For another schema or existing custom switches, copy your own complete `switches` list before editing it. Any switches added upstream will also need to be added to your custom list manually.

</details>

Save and redeploy. Emoji will be off when the schema initializes, and you can still enable it through the schema menu or shortcut. `reset: 0` neither removes the filter nor prevents later toggling. Leave the following OpenCC settings unchanged:
```yaml
# Emoji module
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```
If the change does not take effect, check `build/rime_mint.schema.yaml` in the user data directory. It should contain exactly one `name: emoji_suggestion`, with `reset: 0`. If the old value remains, check the deployment log, custom file name, and active schema.

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
