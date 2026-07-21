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
To implement fuzzy Pinyin in Rime, modify the scheme's `speller/algebra`. A rule written as `derive/A/B/` derives the input spelling `B` from a dictionary spelling `A`; it does not directly replace text as the user types.

```yaml
- erase/^xx$/ # Primary retention
- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s 
- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
- derive/([aei])n$/$1ng/ # an, en, in => ang, eng, ing
- derive/([aei])ng$/$1n/ # ang, eng, ing => an, en, in
- derive/([aeiou])ng$/$1gn/ # dagn => dang
- derive/([dtngkhrzcs])o(u|ng)$/$1o/ # zho => zhong|zhou  
- derive/ong$/on/ # zhonguo => zhong guo
- derive/ao$/oa/ # hoa => hao
- derive/([iu])a(o|ng?)$/a$1$2/ # tain => tian
- abbrev/^([a-z]).+$/$1/ # Simple pinyin (first letter)
- abbrev/^([zcs]h).+$/$1/ # Simple pinyin (zh, ch, sh)
```

This way, the accurate pinyin is the primary option, and the other options are for fuzzy pinyin settings.

::: tip About `ian/iang` and `uan/uang`

Because `([aei])n$` is not anchored at the beginning of the syllable, it can match the ending `an` in both `ian` and `uan`. The two rules above therefore already cover `ian ↔ iang` and `uan ↔ uang`; no extra rules are required.

If you want to configure these pairs separately, use the digit `1` for the capture group:

```yaml
- derive/([iu])an$/$1ang/ # ian => iang, uan => uang
- derive/([iu])ang$/$1an/ # iang => ian, uang => uan
```

`$lan` contains a lowercase letter `l`, not `$1an`, and does not produce the intended spelling.

:::

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

## Fuzzy Pinyin in Mint Full Pinyin <Badge type="tip" text="^2025.11.19" />

The Mint Full Pinyin scheme, `rime_mint`, disables fuzzy Pinyin by default while keeping automatic typo correction enabled. To enable fuzzy Pinyin, uncomment the corresponding rules in `rime_mint.schema.yaml`:

![Fuzzy Pinyin Section](/image/guide/fuzzyPinyinMintSchema.webp)

Alternatively, append the fuzzy rules in `rime_mint.custom.yaml` so that you do not have to edit the scheme file directly:

```yaml
patch:
  'speller/algebra/+':
    - erase/^xx$/ # Keep the original spelling
    - derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s
    - derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
    - derive/([aei])n$/$1ng/ # an, en, in => ang, eng, ing
    - derive/([aei])ng$/$1n/ # ang, eng, ing => an, en, in
    - derive/([aeiou])ng$/$1gn/        # dagn => dang
    - derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
    - derive/ong$/on/                  # zhonguo => zhong guo
    - abbrev/^([a-z]).+$/$1/ # Abbreviation (first letter)
    - abbrev/^([zcs]h).+$/$1/ # Abbreviation (zh, ch, sh)
```
![using Custom](/image/guide/fuzzyPinyinMintCustom.webp)

This example uses `'speller/algebra/+'`, which appends rules to the existing array. In contrast, `'speller/algebra'` replaces the entire array. Appending is sufficient for the `rime_mint` full-Pinyin scheme because it has no double-Pinyin key conversion.

After saving and redeploying Rime, the custom rules are merged at the end of the `speller/algebra` array from `rime_mint.schema.yaml`.

## Fuzzy Pinyin in Mint Double Pinyin <Badge type="tip" text="^2026.07.22" />

Mint's `double_pinyin_flypy` is a Xiaohe double-Pinyin scheme, while `rime_mint_flypy` mixes full Pinyin with Xiaohe. Both begin the `speller/algebra` pipeline with full Pinyin spellings from the dictionary and later convert them into Xiaohe key codes with `xform`. It is therefore normal for their fuzzy rules to be written as full-Pinyin regular expressions.

The rules must run in this order:

1. Remove tone marks first if the dictionary contains tone-marked Pinyin.
2. Apply the fuzzy `derive` rules.
3. Apply the Xiaohe key-mapping rules.

For `double_pinyin_flypy`, copy the complete `speller/algebra` from `double_pinyin_flypy.schema.yaml` into `double_pinyin_flypy.custom.yaml`, then insert the fuzzy rules after tone normalization and before the Xiaohe transformations. Follow the same process with the corresponding files when configuring `rime_mint_flypy`.

```yaml
patch:
  "speller/algebra":
    # 1. Normalize tone-marked dictionary spellings first
    - xlit/āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü/aaaaooooeeeeiiiiuuuuvvvvv/
    - xform/^ng$/eng/
    - xform/ńg|ňg|ǹg/eng/
    - xform/ń|ň|ǹ/en/
    - erase/^xx$/

    # 2. Derive fuzzy spellings
    - derive/^([zcs])h/$1/
    - derive/^([zcs])([^h])/$1h$2/
    - derive/([aei])n$/$1ng/
    - derive/([aei])ng$/$1n/

    # 3. Keep the scheme's complete Xiaohe conversion rules below
    - derive/^([jqxy])u$/$1v/
    - derive/^([aoe])([ioun])$/$1$1$2/
    - xform/^([aoe])(ng)?$/$1$1$2/
    # ...do not omit the remaining xform/xlit rules
```

::: warning Do not append rules in double-Pinyin schemes

Do not use `"speller/algebra/+"` to append fuzzy rules. When appended rules run, the full spellings have already been converted into double-Pinyin key codes, so patterns matching `zh`, `eng`, and similar spellings can no longer match. Replace the complete array with `"speller/algebra"` and keep fuzzy derivation before the double-Pinyin conversion.

![Using custom override, fuzzy pinyin priority higher than double pinyin](/image/guide/fuzzyPinyinMintCustomFlypy.webp)

:::

Test with double-Pinyin key codes rather than fuzzy full-Pinyin spellings:

- In Xiaohe, `shen = uf` and `sheng = ug`. With `en ↔ eng` enabled, both `uf` and `ug` should offer candidates from both spellings.
- In Xiaohe, `zong = zs` and `zhong = vs`. With `z ↔ zh` enabled, both `zs` and `vs` should offer candidates from both spellings.

Redeploy Rime after saving so that it rebuilds the schema and prism.

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
