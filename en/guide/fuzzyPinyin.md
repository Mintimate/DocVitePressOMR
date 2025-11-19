---
layout: doc
title: Fuzzy Pinyin
head:
  - - meta
    - name: keywords
      content: Rime Fuzzy Pinyin, Rime automatic error correction, input method customization
description: Fuzzy Pinyin refers to a Pinyin input method where the pronunciation of Chinese characters is relatively unclear or inaccurate compared to standard Pinyin. It is commonly found in some non-standard Pinyin input methods or when individuals use Pinyin input methods. In Bǔhé Pinyin, Rime, how to set up Fuzzy Pinyin can be found in this tutorial.
---

# Fuzzy Pinyin

Fuzzy pinyin refers to a pinyin input method where the pronunciation is relatively vague or inaccurate compared to standard pinyin. It is commonly seen in some non-standard pinyin input methods or when individual users use pinyin input methods. This article introduces how to set fuzzy pinyin in Oh-my-rime and Rime.

Fuzzy pinyin is an example，中国🇨🇳:
- Standard pinyin: zhōngguó
- Fuzzy pinyin: zongguo

In fuzzy pinyin, the initial "zh" can be replaced with "z".

More examples:
```txt
ch -> c  
c -> ch

an - > ang
ang -> an

......
```

The pinyin for the tongue twister is:
```txt 
shēng shēn qīn mǔ qīn, jǐn qǐng nín jiù qǐn, qǐng nín xīn níng jìng, shēn xīn hěn yào jǐn。
xīn xīng bàn yuè míng, yín guāng chéng qīng qīng. jìn shì qīng jìng jìng, jǐng líng bú yào jīng。
nín xǐng wǒ jìn lái, jìn lái jìng mǔ qīn。
```

If using fuzzy pinyin and ignoring the retroflex endings:
```txt
shen shen qin mu qin, jin qin nin jiu qin, qin nin xin nin jin, shen xin hen yao jin。
xin xing ban yue ming, yin guan chen qin qin。jin shi qin jin jin, jin lin bu yao jin。
nin xing wo jin lai, jin lai jin mu qin。
```

## Fuzzy pinyin settings in Rime
To implement fuzzy pinyin in Rime, you need to modify the `speller/algebra` module in the input method configuration to use regular expressions for replacement:

```yaml
- erase/^xx$/ # Primary retention
- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s 
- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
- derive/([aei])n$/$1ng/ # en => eng, in => ing
- derive/([aei])ng$/$1n/ # eng => en, ing => in
- derive/([iu])an$/$lan/ # ian => iang, uan => uang
- derive/([iu])ang$/$lan/ # iang => ian, uang => uan
- derive/([aeiou])ng$/$1gn/ # dagn => dang
- derive/([dtngkhrzcs])o(u|ng)$/$1o/ # zho => zhong|zhou  
- derive/ong$/on/ # zhonguo => zhong guo
- derive/ao$/oa/ # hoa => hao
- derive/([iu])a(o|ng?)$/a$1$2/ # tain => tian
- abbrev/^([a-z]).+$/$1/ # Simple pinyin (first letter)
- abbrev/^([zcs]h).+$/$1/ # Simple pinyin (zh, ch, sh)
```

This way, the accurate pinyin is the primary option, and the other options are for fuzzy pinyin settings.

> It is recommended to retain simple pinyin content, otherwise input will always require full pinyin, such as only being able to input "n" or "nh" for "你好(nihao)".
```yaml
# Recommended retention
- abbrev/^([a-z]).+$/$1/ # Simple pinyin (first letter)  
- abbrev/^([zcs]h).+$/$1/ # Simple pinyin (zh, ch, sh)
```

Through fuzzy pinyin, you can also enable automatic error correction (to a certain extent) when typing too fast and making input errors. Here is a YAML configuration for automatic error correction:

```yaml
    ### Automatic Error Correction
    # Some rules have side effects on mixing full pinyin and abbreviated pinyin, e.g., "x'ai 喜爱" being corrected to "xia 下"
    # zh, ch, sh
    - derive/([zcs])h(a|e|i|u|ai|ei|an|en|ou|uo|ua|un|ui|uan|uai|uang|ang|eng|ong)$/h$1$2/  # hzi → zhi
    - derive/([zcs])h([aeiu])$/$1$2h/  # zih → zhi
    # ai
    - derive/^([wghk])ai$/$1ia/  # wia → wai
    # ia
    - derive/([qjx])ia$/$1ai/  # qai → qia
    # ei
    - derive/([wtfghkz])ei$/$1ie/
    # ie
    - derive/([jqx])ie$/$1ei/
    # ao
    - derive/([rtypsdghklzcbnm])ao$/$1oa/
    # ou
    - derive/([ypfm])ou$/$1uo/
    # uo（none）
    # an
    - derive/([wrtypsdfghklzcbnm])an$/$1na/
    # en
    - derive/([wrpsdfghklzcbnm])en$/$1ne/
    # ang
    - derive/([wrtypsdfghklzcbnm])ang$/$1nag/
    - derive/([wrtypsdfghklzcbnm])ang$/$1agn/
    # eng
    - derive/([wrtpsdfghklzcbnm])eng$/$1neg/
    - derive/([wrtpsdfghklzcbnm])eng$/$1egn/
    # ing
    - derive/([qtypdjlxbnm])ing$/$1nig/
    - derive/([qtypdjlxbnm])ing$/$1ign/
    # ong
    - derive/([rtysdghklzcn])ong$/$1nog/
    - derive/([rtysdghklzcn])ong$/$1ogn/
    # iao
    - derive/([qtpdjlxbnm])iao$/$1ioa/
    - derive/([qtpdjlxbnm])iao$/$1oia/
    # ui
    - derive/([rtsghkzc])ui$/$1iu/
    # iu
    - derive/([qjlxnm])iu$/$1ui/
    # ian
    - derive/([qtpdjlxbnm])ian$/$1ain/
    # - derive/([qtpdjlxbnm])ian$/$1ina/ # Conflicts with common words like "李娜、蒂娜、缉拿"
    # in
    - derive/([qypjlxbnm])in$/$1ni/
    # iang
    - derive/([qjlxn])iang$/$1aing/
    - derive/([qjlxn])iang$/$1inag/
    # ua
    - derive/([g|k|h|zh|sh])ua$/$1au/
    # uai
    - derive/([g|h|k|zh|ch|sh])uai$/$1aui/
    - derive/([g|h|k|zh|ch|sh])uai$/$1uia/
    # uan
    - derive/([qrtysdghjklzxcn])uan$/$1aun/
    # - derive/([qrtysdghjklzxcn])uan$/$1una/ # Conflicts with common words like "去哪、露娜"
    # un
    - derive/([qrtysdghjklzxc])un$/$1nu/
    # ue
    - derive/([nlyjqx])ue$/$1eu/
    # uang
    - derive/([g|h|k|zh|ch|sh])uang$/$1aung/
    - derive/([g|h|k|zh|ch|sh])uang$/$1uagn/
    - derive/([g|h|k|zh|ch|sh])uang$/$1unag/
    - derive/([g|h|k|zh|ch|sh])uang$/$1augn/
    # iong
    - derive/([jqx])iong$/$1inog/
    - derive/([jqx])iong$/$1oing/
    - derive/([jqx])iong$/$1iogn/
    - derive/([jqx])iong$/$1oign/
    # Others
    - derive/([rtsdghkzc])o(u|ng)$/$1o/ # do → dou|dong
    - derive/ong$/on/ # lon → long
    - derive/([tl])eng$/$1en/ # ten → teng
    - derive/([qwrtypsdfghjklzxcbnm])([aeio])ng$/$1ng/ # lng → lang、leng、ling、long
```
Using automatic error correction can allow us to input what we want even when we make some mistakes in typing.
> Note: The automatic error correction is based on "Wusong Pinyin," and special thanks to them for the reference.

## Fuzzy Pinyin in Oh-my-rime <Badge type="tip" text="^2025.11.19" />
By default, the fuzzy Pinyin feature, except for automatic error correction, is disabled in Mint Pinyin.

If you prefer to use fuzzy Pinyin, you can refer to the previous text and remove the comments in the fuzzy Pinyin section of the `rime_mint.schema.yaml` file:
![Fuzzy Pinyin Section](/image/guide/fuzzyPinyinMintSchema.webp)

After removing the comments, redeploy the Rime input method to apply the new configuration for Mint Pinyin.Alternatively, you can add content to the `rime_mint.custom.yaml` file to override the settings in the `rime_mint.schema.yaml` file.

To add content in `rime_mint.custom.yaml`:
```yaml
patch:
  'speller/algebra/+':
     - erase/^xx$/ # 首选保留
     - derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s
     - derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
     - derive/([aei])n$/$1ng/ # en => eng, in => ing
     - derive/([aei])ng$/$1n/ # eng => en, ing => in
     - derive/([iu])an$/$lan/ # ian => iang, uan => uang
     - derive/([iu])ang$/$lan/ # iang => ian, uang => uan
     - derive/([aeiou])ng$/$1gn/        # dagn => dang
     - derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
     - derive/ong$/on/                  # zhonguo => zhong guo
     - abbrev/^([a-z]).+$/$1/ #简拼（首字母）
     - abbrev/^([zcs]h).+$/$1/ #简拼（zh, ch, sh）
```
![using Custom](/image/guide/fuzzyPinyinMintCustom.webp)

> Choose `'speller/algebra/+'` instead of `'speller/algebra'`; the former appends to the existing configuration, while the latter directly overrides it.

After saving and redeploying Rime, during the compilation phase, the `speller/algebra` section in `rime_mint.custom.yaml` will override the corresponding section in `rime_mint.schema.yaml`.

::: warning

Note ⚠️: The example demonstrates the fuzzy pinyin for the `rime_mint` scheme, which is the full pinyin fuzzy pinyin. If you are using a mixed scheme of double pinyin and full pinyin, such as Mint's `rime_mint_flypy`, you need to pay attention to the regular expression order in `speller/algebra`. You cannot use `speller/algebra/+` to append content; you need to use `speller/algebra` to override the content to ensure that the priority of fuzzy pinyin is higher than that of double pinyin:

![Using custom override, fuzzy pinyin priority higher than double pinyin](/image/guide/fuzzyPinyinMintCustomFlypy.webp)

:::

## Mapping of u/ü and v <Badge type="tip" text="^2024.10.02" />

In the process of learning Pinyin, we learn about complex vowels such as `un` and `ün`, as well as single vowels like `u` and `ü`.

Although there is a `u` key on the keyboard, there is no `ü` key; however, the common agreement among various input methods and users is to map `v` to `ü`. However, some input methods will also blur `ü` into `u`, which is why many users who use the Mint scheme report that they cannot type words like `女(nv)` and `攻略(gong lve)`: **By default, the Mint scheme does not have fuzzy pinyin, so if you need fuzzy pinyin, you need to configure the confusion between `ü` and `u` yourself.**

The configuration is actually very simple. Taking Mint Full Pinyin as an example (`rime_mint.schema.yaml`), we create a `rime_mint.custom.yaml` file and append the following content to it:
```yaml 
patch:
  # Append to speller/algebra
  "speller/algebra/+":
    - derive/v/u/ # u => ü
```
After redeploying, you can blur `u` and `ü`.