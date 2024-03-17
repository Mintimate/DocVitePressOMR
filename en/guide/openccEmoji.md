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
# Emoji Configuration
There are various ways to input emojis in an input method, such as:
- Using dictionaries to match emojis
- Using OpenCC for word filtering and replacement

Both of the above methods are effective, but here we will focus on the OpenCC approach.


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