___
layout: doc 
title: Emoji Configuration (OpenCC) 
aside: true
---

# Emoji Configuration

There are various ways to input emojis in an input method, such as:

- Using dictionaries to match emojis
- Using OpenCC for word filtering and replacement

Currently, both of the above methods are good options. Here, we will focus on the OpenCC method.


## OpenCC

OpenCC, short for "Open Chinese Convert," was originally developed for converting between Simplified Chinese and Traditional Chinese.

For example, you can use the OpenCC command line to convert a file of Simplified Chinese characters to Traditional Chinese:

```bash
opencc -i simplified.txt -o traditional.txt -c t2s
```

However, the underlying principle is actually about substitution and expansion of characters, which makes it suitable for implementing emojis as well.

Some people also use OpenCC for ancient poetry or Chinese-English dictionaries, which is also a good approach. However, OpenCC, being a text-based replacement, may not be suitable for large-scale text corpora.

Here's an example of an OpenCC file configuration:

```yaml
露齿笑	露齿笑 😃
哈	哈 😄
哈哈	哈哈 😄
开心	开心 😄
笑	笑 😄 😊
```

In this case, when you input "露齿笑," it will be transformed into the phrase "露齿笑" and the emoji "😃," allowing you to mix emojis with regular text input in your input method.

## Emoji in Oh-My-Rime

Now, let's take a look at emojis in Oh-My-Rime. In fact, the emoji implementation in Oh-My-Rime has undergone multiple revisions. For example, in a previous version, iOS 16 emojis were introduced, resulting in an excessive number of emojis. As a result, when you input characters like "花" (flower), the first 15 candidates could all be emojis.

The final approach adopted for Oh-My-Rime went back to the basics.

### Emoji Configuration Files

The configuration files for emojis are located in the OpenCC folder, and there are three files:

```txt
.
├── emoji.json
├── emoji.txt
└── others.txt
```

Here's a breakdown of each file:

- emoji.json: This file contains the mapping rules for emoji expressions. OpenCC uses this JSON file for emoji conversion.
- emoji.txt: This file contains a list of all emoji expressions, with one emoji per line. It serves as the input for generating the emoji.json mapping file.
- others.txt: This file contains some special vocabulary forms.

You can modify these files as needed, but be mindful of the formatting, especially the use of tabs and spaces.

### Emoji Switch

There is a switch in the input method's configuration file, `rime_mint.schema.yaml`:

```yaml
switches:
  - name: emoji_suggestion
    reset: 1
    states: [ "😣️","😁️"]
```

This switch controls the filtering of characters for emojis. The character filtering is done in the following section:

```yaml
engine:
  filters:
    - simplifier@emoji_suggestion         # Emoji
    - simplifier@simplification           # Simplified and Traditional Chinese conversion
    - lua_filter@reduce_english_filter    # Adjusting the position of some English words in the candidate list
    - simplifier
    - uniquifier
```

Of course, there are specific filtering rules as well:

```yaml
# Emoji Module
emoji_suggestion:
  opencc_config: emoji.json
  option_name: emoji_suggestion
  tips: all
  inherit_comment: false
```

The above content constitutes the Emoji OpenCC configuration for Oh-My-Rime. If you need to make changes, you can refer to the aforementioned details.