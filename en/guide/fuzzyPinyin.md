# Fuzzy Pinyin

Fuzzy pinyin refers to an imprecise or inaccurate way of spelling Chinese characters based on their pronunciation. It is common in some non-standard pinyin input methods or when individuals use pinyin input methods.

Here is an example of fuzzy pinyin for China🇨🇳(中国）:
- Standard pinyin: zhōngguó
- Fuzzy pinyin: zongguo

In fuzzy pinyin, the initial "zh" can be replaced with "z".

More examples:
```txt  
ch -> c
c -> ch

an -> ang  
ang -> an

......
```

In contrast, a tongue twister like this:
```txt
生身亲母亲,谨请您就寝,请您心宁静,身心很要紧。新星伴月明,银光澄清清。尽是清静境,警铃不要惊。您醒我进来,进来敬母亲。

shēng shēn qīn mǔ qīn, jǐn qǐng nín jiù qǐn, qǐng nín xīn níng jìng, shēn xīn hěn yào jǐn. 
xīn xīng bàn yuè míng, yín guāng chéng qīng qīng.
jìn shì qīng jìng jìng, jǐng líng bú yào jīng.  
nín xǐng wǒ jìn lái, jìn lái jìng mǔ qīn.
```

Using fuzzy pinyin while ignoring nasal finals:
```txt
shen shen qin mu qin, jin qin nin jiu qin, qin nin xin nin jin, shen xin hen yao jin。xin xing ban yue ming, yin guan chen qin qin。jin shi qin jin jin, jin lin bu yao jin。nin xing wo jin lai, jin lai jin mu qin。
```

## Fuzzy Pinyin Configuration in Rime

To enable fuzzy pinyin in Rime, the `speller/algebra` module in the input schema needs to be modified to perform regular expression replacements on the input:

```yaml
- erase/^xx$/ # preserve first choice  
- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s
- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh  
- derive/([aei])n$/$1ng/ # en => eng, in => ing
- derive/([aei])ng$/$1n/ # eng => en, ing => in
- derive/([iu])an$/$1ang/ # ian => iang, uan => uang
- derive/([iu])ang$/$1an/ # iang => ian, uang => uan
- derive/([aeiou])ng$/$1gn/        # dagn => dang
- derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
- derive/ong$/on/                  # zhonguo => zhong guo  
- derive/ao$/oa/                   # hoa => hao
- derive/([iu])a(o|ng?)$/a$1$2/    # tain => tian
- abbrev/^([a-z]).+$/$1/ #abbreviation (initials) 
- abbrev/^([zcs]h).+$/$1/ #abbreviation (zh, ch, sh)
```

This allows fuzzy pinyin as the first option, with other options providing mappings for common fuzzy patterns.


Automatic error correction can also be configured:

```yaml
# Automatic error correction

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

# uo(无) 

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

# Other  
- derive/([rtsdghkzc])o(u|ng)$/$1o/ # do → dou|dong
- derive/ong$/on/ # lon → long
- derive/([tl])eng$/$1en/ # ten → teng 
- derive/([qwrtypsdfghjklzxcbnm])([aeio])ng$/$1ng/ # lng → lang、leng、ling、long
```

Automatic correction allows some typos to still match the intended input.


## Fuzzy Pinyin in oh-my-rime

Fuzzy pinyin is enabled by default in oh-my-rime. It uses automatic error correction rules adapted from the Wubi pinyin input method.

If you don't like fuzzy pinyin, you can remove the relevant parts from the `rime_mint.schema.yaml` file:

![Fuzzy pinyin section](/image/guide/fuzzyPinyinMintSchema.webp)

After removing it, redeploy Rime to apply the new oh-my-rime configuration.

You can also override `rime_mint.schema.yaml` by appending to `rime_mint.custom.yaml`.

Add the following to `rime_mint.custom.yaml`:

```yaml
  'speller/algebra':
    - erase/^xx$/ # preserve first choice
```

![Override using custom](/image/guide/fuzzyPinyinMintCustom.webp)


Save and redeploy Rime. Now the `speller/algebra` section in `rime_mint.custom.yaml` will override the one in `rime_mint.schema.yaml` during compilation.