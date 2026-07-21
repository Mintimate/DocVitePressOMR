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
生身亲母亲，谨请您就寝，请您心宁静，身心很要紧。
新星伴月明，银光澄清清。尽是清静境，警铃不要惊。
您醒我进来，进来敬母亲。
```
对应的拼音: 
```text
shēng shēn qīn mǔ qīn, jǐn qǐng nín jiù qǐn, qǐng nín xīn níng jìng, shēn xīn hěn yào jǐn。
xīn xīng bàn yuè míng, yín guāng chéng qīng qīng. jìn shì qīng jìng jìng, jǐng líng bú yào jīng。
nín xǐng wǒ jìn lái, jìn lái jìng mǔ qīn。
```

如果使用模糊拼音，忽略后鼻音：
```txt
shen shen qin mu qin, jin qin nin jiu qin, qin nin xin nin jin, shen xin hen yao jin。
xin xing ban yue ming, yin guan chen qin qin。jin shi qin jin jin, jin lin bu yao jin。
nin xing wo jin lai, jin lai jin mu qin。
```

## Rime的模糊拼音设置
使用 Rime 配置模糊拼音，需要修改输入方案的 `speller/algebra`。`derive/A/B/` 的含义是：为词典中的拼音 `A` 派生一个可以输入的编码 `B`，并不是在输入时直接把用户键入的内容替换掉。

```yaml
- erase/^xx$/ # 首选保留
- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s
- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
- derive/([aei])n$/$1ng/ # an, en, in => ang, eng, ing
- derive/([aei])ng$/$1n/ # ang, eng, ing => an, en, in
- derive/([aeiou])ng$/$1gn/        # dagn => dang
- derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
- derive/ong$/on/                  # zhonguo => zhong guo
- derive/ao$/oa/                   # hoa => hao
- derive/([iu])a(o|ng?)$/a$1$2/    # tain => tian
- abbrev/^([a-z]).+$/$1/ #简拼（首字母）
- abbrev/^([zcs]h).+$/$1/ #简拼（zh, ch, sh）
```
这样的话，首选项是准确的拼音，其他选项是对模糊拼音的设置。

::: tip 关于 `ian/iang` 和 `uan/uang`

上面的 `([aei])n$` 没有限定从音节开头匹配，因此已经可以在 `ian`、`uan` 的末尾匹配 `an`，从而覆盖 `ian ↔ iang` 和 `uan ↔ uang`，不需要再添加单独的规则。

如果希望单独配置，也必须使用数字 `1` 表示捕获组：

```yaml
- derive/([iu])an$/$1ang/ # ian => iang, uan => uang
- derive/([iu])ang$/$1an/ # iang => ian, uang => uan
```

`$lan` 中是字母 `l`，不是 `$1an`，无法得到预期的拼音。

:::

> 建议保留简拼内容，去除的话，输入就一定需要完整拼音，如： `你好(nihao)`，就无法输入`nh`或者输入`n`出现`你`。
```yaml
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

## 薄荷全拼方案的模糊拼音 <Badge type="tip" text="^2025.11.19" />

薄荷输入法的全拼方案 `rime_mint` 默认关闭了模糊音，但保留了自动纠错。需要模糊音时，可以取消 `rime_mint.schema.yaml` 中对应规则的注释：

![模糊拼音部分](/image/guide/fuzzyPinyinMintSchema.webp)

如果不想直接修改方案文件，也可以在 `rime_mint.custom.yaml` 中追加模糊音规则：

```yaml
patch:
  'speller/algebra/+':
    - erase/^xx$/ # 首选保留
    - derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s
    - derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh
    - derive/([aei])n$/$1ng/ # an, en, in => ang, eng, ing
    - derive/([aei])ng$/$1n/ # ang, eng, ing => an, en, in
    - derive/([aeiou])ng$/$1gn/        # dagn => dang
    - derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
    - derive/ong$/on/                  # zhonguo => zhong guo
    - abbrev/^([a-z]).+$/$1/ #简拼（首字母）
    - abbrev/^([zcs]h).+$/$1/ #简拼（zh, ch, sh）
```

![使用custom覆盖](/image/guide/fuzzyPinyinMintCustom.webp)

这里使用 `'speller/algebra/+'`：它把规则追加到现有数组末尾；`'speller/algebra'` 则会覆盖整个数组。对于没有双拼键位转换的 `rime_mint` 全拼方案，直接追加即可。

保存并重新部署 Rime 后，custom 中的规则会在编译阶段合并到 `rime_mint.schema.yaml` 的 `speller/algebra` 数组末尾。

## 薄荷双拼方案的模糊拼音 <Badge type="tip" text="^2026.07.22" />

薄荷输入法的 `double_pinyin_flypy` 是小鹤双拼方案，`rime_mint_flypy` 是全拼与小鹤双拼混输方案。它们的 `speller/algebra` 都先处理词典中的完整拼音，再通过后续的 `xform` 转换成小鹤键码。因此，双拼方案中的模糊音规则仍然写成全拼形式。

规则必须按照以下顺序执行：

1. 如果词典拼音带声调，先去除声调。
2. 再执行模糊音的 `derive` 规则。
3. 最后执行小鹤双拼的键位转换规则。

以 `double_pinyin_flypy` 为例：先把 `double_pinyin_flypy.schema.yaml` 中完整的 `speller/algebra` 复制到 `double_pinyin_flypy.custom.yaml`，再把模糊音规则插入去声调规则之后、小鹤转换规则之前。配置 `rime_mint_flypy` 时，同样应复制并修改对应方案的完整规则。

```yaml
patch:
  "speller/algebra":
    # 1. 先规范化词典中的带调拼音
    - xlit/āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü/aaaaooooeeeeiiiiuuuuvvvvv/
    - xform/^ng$/eng/
    - xform/ńg|ňg|ǹg/eng/
    - xform/ń|ň|ǹ/en/
    - erase/^xx$/

    # 2. 再派生模糊音
    - derive/^([zcs])h/$1/
    - derive/^([zcs])([^h])/$1h$2/
    - derive/([aei])n$/$1ng/
    - derive/([aei])ng$/$1n/

    # 3. 此处继续完整保留原方案的小鹤双拼转换规则
    - derive/^([jqxy])u$/$1v/
    - derive/^([aoe])([ioun])$/$1$1$2/
    - xform/^([aoe])(ng)?$/$1$1$2/
    # ……其余 xform/xlit 规则不可省略
```

::: warning 双拼方案不能使用追加写法

不要使用 `"speller/algebra/+"` 把模糊音规则追加到末尾。追加规则执行时，完整拼音已经转换成双拼键码，针对 `zh`、`eng` 等完整拼音的正则将无法匹配。必须使用 `"speller/algebra"` 覆盖完整数组，并确保模糊音派生发生在双拼键位转换之前。

![使用custom覆盖，模糊拼音优先级高于双拼](/image/guide/fuzzyPinyinMintCustomFlypy.webp)

:::

测试时应输入双拼键码，而不是模糊全拼：

- 小鹤 `shen = uf`、`sheng = ug`；启用 `en ↔ eng` 后，输入 `uf` 或 `ug` 应能看到两边的候选。
- 小鹤 `zong = zs`、`zhong = vs`；启用 `z ↔ zh` 后，输入 `zs` 或 `vs` 应能看到两边的候选。

保存后重新部署 Rime，使新的 schema 和 prism 生效。

## u/ü与v映射 <Badge type="tip" text="^2024.10.02" />
我们学习拼音的过程中，会学习到`un`和`ün`这样的复韵母，以及`u`和`ü`这样的单韵母。

虽然键盘内，有`u`按键，但是没有`ü`按键；但是，各个输入法和用户的共有认同就是将`v`映射为`ü`上。不过，部分输入法会将`ü`同时模糊为`u`，这也是很多用户使用薄荷方案后，会反馈打不出`女(nv)`、`攻略(gong lve)`等字词的原因: **薄荷方案内，默认没有模糊拼音，所以如果需要模糊拼音，需要自行配置`ü`和`u`的混淆。**

配置其实也很简单，以薄荷全拼为例(`rime_mint.schema.yaml`)，我们创建一个`mint_mint.custom.yaml`文件，在其中追加内容：
```yaml 
patch:
  # 对 speller/algebra 进行追加
  "speller/algebra/+":
    - derive/v/u/ # u => ü
```
重新部署后，我们就可以模糊化`u`和`ü`了。
