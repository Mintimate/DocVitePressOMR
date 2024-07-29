---
layout: doc
title: Customization of Double Pinyin Flypy
head:
  - - meta
    - name: keywords
      content: Mint Pinyin, effect display, usage effect, Double Pinyin Flypy customization
description: In Mint Input Method, a customized scheme based on Double Pinyin Flypy is demonstrated. Demonstration of Double Pinyin Flypy and Phonetic Shape Auxiliary Code based on rime.
aside: true
---

# Double Pinyin Flypy
[小鹤音形](https://flypy.com/) actually contains two parts:
- Double Spelling: The initial and final sounds are each represented by a letter, and the sound of a Chinese character is expressed in two letters;
- Double Shape: According to the splitting rules, a Chinese character is split into two parts by the root, to distinguish homophones;

We usually use Double Pinyin Flypy more, that is, the double spelling part. If you are using double shape, then most of the time it is four characters on the screen.

For example (referenced from [Xiaohe(Double Pinyin Flypy) Official Document](https://flypy.cc/#/xh)):

| Single Character | Full Spelling | Double Spelling | Double Shape | Full Code |
| --- | --- | --- | --- | --- |
| Small | xiao | xn | ld丨丶 | xnld |
| Crane | he | he | dn丶bird | hedn |
| Sound | yin | yb | lo立day | yblo |
| Shape | xing | xk | kp open丿 | xkkp |

So? How does Mint use Double Pinyin Flypy?

The answer is: Double spelling is the main, and the shape is used as the positioning auxiliary code.
## Usage within Mint
Currently, Mint can use the content of Double Pinyin Flypy. You can use the hotkey (`Ctrl/Control + ~` or `F4`) to switch to `小鹤双拼-薄荷定制`:
![Switch and use Double Pinyin Flypy](/image/demo/switchDoublePinyinFly.webp)

Usage guide:
- Switch to `小鹤双拼-薄荷定制`, you can use Xiaohe's double spelling keys for double spelling input. The dictionary used is the same as `薄荷拼音-全拼输入`. You can refer to the `translator`'s `dictionary` and `prism` in the repository [double_pinyin_flypy.schema.yaml](https://github.com/Mintimate/oh-my-rime/blob/main/double_pinyin_flypy.schema.yaml).

## Auxiliary Code
Although there is no phonetic shape, we have introduced auxiliary codes. By default, after inputting, use `;` to activate the auxiliary code, and then use the Double Pinyin shape code to locate words.

![Auxiliary Code](/image/demo/AxuCodeDemo.webp)

In fact, **other Double Pinyin schemes are also supported.** However, the Double Pinyin Fly's shape code is more well-known, and in Mint, the Natural Code can also use the Natural Code shape code for auxiliary positioning. Other Double Pinyin schemes use [Moqi's shape code](https://github.com/gaboolic/rime-shuangpin-fuzhuma) for auxiliary positioning.

If you want to change the key to activate the auxiliary code, you can use `custom` to override the `axu_code` in the [double_pinyin_flypy.schema.yaml](https://github.com/Mintimate/oh-my-rime/blob/main/double_pinyin_flypy.schema.yaml) file, and add new auxiliary activation codes to the `alphabet` in `speller`.

More settings for `axu_code`:
```YAML
# Xiaohe Phonetic Shape Configuration
axu_code:
  # Activation code
  trigger_word: ";"
  # Mode to display auxiliary code
  # always:   Always display (default)
  # trigger:  Activate auxiliary code after entering activation code
  # none:     Never display auxiliary code
  show_aux_notice: "trigger"
```

Example of Overriding: On Android phones, the default `?123` symbol keyboard in the Little Penguin Input Method does not process symbols through Rime, so we use a comma to replace the trigger key:

```yaml
# double_pinyin_flypy.custom.yaml
# Rime schema
# encoding: utf-8

patch:
  # Set the trigger key
  "axu_code/trigger_word": ","
  # Release the semicolon and let the comma participate in input
  "speller/alphabet": zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA~,
```

> Although I think using a comma as an auxiliary code is a bit "awkward", it might be a matter of habit?

![Effect after customizing the trigger key](/image/demo/customAxuCodeForDoubleFly.webp)

Core code:
- [https://github.com/Mintimate/oh-my-rime/blob/main/lua/auxCode_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/auxCode_filter.lua)

Referenced from:
- [https://github.com/HowcanoeWang/rime-lua-aux-code](https://github.com/HowcanoeWang/rime-lua-aux-code)

## Auxiliary Code OpenCC
Haha, actually this is no longer auxiliary code content. For convenience when not using auxiliary codes, you can also directly see the content of the shape. You can change `show_aux_notice` in `axu_code` to `always`.

You can also use Chaifen OpenCC made by [GGboxCloud](https://github.com/GGboxCloud):
```yaml
# Crane Shape Splitting Auxiliary Filter
chaifen_cc:
  opencc_config: fly_Chaifen.json
  option_name: chaifen
  show_in_comment: true  # Whether to only display the conversion result in the comment
  comment_format:
    - "xform/&nbsp;/ /"
  tags:                  # Set its scope
    - abc
    - storkfly
    - reverse_lookup
  tips: char             #  Add filter to single character: char; All: all，
```
![Auxiliary Code VS axu_code Shape Code](/image/demo/showHelperInfoForDoublePinyinFly.webp)

::: warning Warning
Auxiliary Code OpenCC, just for prompt purposes. If you need the auxiliary code to participate in word positioning and follow-up, you still need to use `axu_code` for positioning.
:::