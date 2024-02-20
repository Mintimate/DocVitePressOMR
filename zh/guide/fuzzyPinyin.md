---
layout: doc
title: 模糊拼音
head:
  - - meta
    - name: keywords
      content: Rime模糊拼音,Rime自动纠错,输入法定制
description: 模糊拼音是指在拼写汉字时，发音与标准拼音相对模糊或不准确的一种拼音方式。它常见于一些非标准的拼音输入法或个别人使用拼音输入法输入时出现的情况。在薄荷输入法、Rime内，如何设置模糊拼音，可以查看本文教程。
---

# 模糊拼音

模糊拼音是指在拼写汉字时，发音与标准拼音相对模糊或不准确的一种拼音方式。它常见于一些非标准的拼音输入法或个别人使用拼音输入法输入时出现的情况。

以下是一个模糊拼音的示例，中国🇨🇳：
- 标准拼音：zhongguo(zhōngguó)
- 模糊拼音：zongguo

在模糊拼音中，声母 "zh" 可以使用"z"。

更多的：
```txt
ch -> c
c -> ch

an - > ang
ang -> an

……
```

相对的，如果像这样的绕口令：
```txt
生身亲母亲，谨请您就寝，请您心宁静，身心很要紧。新星伴月明，银光澄清清。尽是清静境，警铃不要惊。您醒我进来，进来敬母亲。
```
对应的拼音: 
```text
shēng shēn qīn mǔ qīn, jǐn qǐng nín jiù qǐn, qǐng nín xīn níng jìng, shēn xīn hěn yào jǐn.
xīn xīng bàn yuè míng, yín guāng chéng qīng qīng.
jìn shì qīng jìng jìng, jǐng líng bú yào jīng.
nín xǐng wǒ jìn lái, jìn lái jìng mǔ qīn.
```

如果使用模糊拼音，忽略后鼻音：
```txt
shen shen qin mu qin, jin qin nin jiu qin, qin nin xin nin jin, shen xin hen yao jin。xin xing ban yue ming, yin guan chen qin qin。jin shi qin jin jin, jin lin bu yao jin。nin xing wo jin lai, jin lai jin mu qin。
```

## Rime的模糊拼音设置
使用Rime进行模糊拼音，就需要更改输入法配置的`speller/algebra`模块，使用正则对输入的内容进行替换：
```yaml
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
- derive/ao$/oa/                   # hoa => hao
- derive/([iu])a(o|ng?)$/a$1$2/    # tain => tian
- abbrev/^([a-z]).+$/$1/ #简拼（首字母）
- abbrev/^([zcs]h).+$/$1/ #简拼（zh, ch, sh）
```
这样的话，首选项是准确的拼音，其他选项是对模糊拼音的设置。

> 建议保留简拼内容，去除的话，输入就一定需要完整拼音，如： `你好(nihao)`，就无法输入`nh`或者输入`n`出现`你`。
```yarl
# 建议保留内容
- abbrev/^([a-z]).+$/$1/ #简拼（首字母）
- abbrev/^([zcs]h).+$/$1/ #简拼（zh, ch, sh）
```

通过模糊拼音，还可以设置自动纠错（按键盘太快，导致输入错误，可以一定程度容错）：
```yaml
 ### 自动纠错
 # 有些规则对全拼简拼混输有副作用：如「x'ai 喜爱」被纠错为「xia 下」
 # zh、ch、sh
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
 # uo（无）
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
 # - derive/([qtpdjlxbnm])ian$/$1ina/ # 和「李娜、蒂娜、缉拿」等常用词有冲突
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
 # - derive/([qrtysdghjklzxcn])uan$/$1una/ # 和「去哪、露娜」等常用词有冲突
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
 # 其他
 - derive/([rtsdghkzc])o(u|ng)$/$1o/ # do → dou|dong
 - derive/ong$/on/ # lon → long
 - derive/([tl])eng$/$1en/ # ten → teng
 - derive/([qwrtypsdfghjklzxcbnm])([aeio])ng$/$1ng/ # lng → lang、leng、ling、long
```
使用自动纠错，可以让我们在输入的时候，一些情况下打错拼音也可以输入我们想要的。
> 注意: 自动纠错参考自『雾凇拼音』，此处特别感谢。

## 薄荷拼音的模糊拼音<Badge type="tip" text="^2023.11.30" />
薄荷输入法内的薄荷拼音默认关闭了除了自动纠错外的模糊拼音。

如果你喜欢模糊拼音，可以参考上文，并对`rime_mint.schema.yaml`文件中的模糊拼音部分的注释进行删除：
![模糊拼音部分](/image/guide/fuzzyPinyinMintSchema.webp)

删除后，重新部署rime输入法以应用薄荷拼音的新配置。

当然，你也可以在`rime_mint.custom.yaml`内追加内容，达到覆写`rime_mint.schema.yaml`文件的目的。

在`rime_mint.custom.yaml`内追加内容：
```yaml
  'speller/algebra':
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

![使用custom覆盖](/image/guide/fuzzyPinyinMintCustom.webp)


保存并重新部署rime，这个时候，在编译阶段`rime_mint.custom.yaml`内`speller/algebra`会覆盖`rime_mint.schema.yaml`内的`speller/algebra`部分。

