---
layout: doc
title: 雾凇和薄荷的区别
head:
  - - meta
    - name: keywords
      content: 薄荷输入法,雾凇拼音,薄荷和雾凇区别,rime输入方案,薄荷和雾凇那个好
description: 雾凇拼音是非常好的Rime输入方案，薄荷输入法配置也大量参考了雾凇配置；但是，雾凇拼音和薄荷输入方案配置，具体有什么区别呢？甚至和白霜拼音有什么区别呢？
aside: true
---
# 雾凇拼音
[雾凇拼音: https://github.com/iDvel/rime-ice](https://github.com/iDvel/rime-ice)，是一个非常好的Rime输入方案，支持全拼、双拼等多种输入方式，词库全面。同时，仓库贡献度活跃。词库有着：
- 简体字表、词库
    -   [《通用规范汉字表》](https://github.com/iDvel/The-Table-of-General-Standard-Chinese-Characters)
    -   [华宇野风系统词库](http://bbs.pinyin.thunisoft.com/forum.php?mod=viewthread&tid=30049)（@野风）
    -   [清华大学开源词库](https://github.com/thunlp/THUOCL)（@THUNLP | [MIT](https://github.com/thunlp/THUOCL/blob/master/LICENSE)）
    -   [现代汉语常用词表](https://gist.github.com/indiejoseph/eae09c673460aa0b56db)（@Joseph cheng）
    -   [腾讯词向量](https://ai.tencent.com/ailab/nlp/en/download.html)（@Tencent AI Lab | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)）
    -   参考
        -   《现代汉语词典》
        -   《同义词词林》
        -   《新华成语大词典》
- 词库修订
    - 校对大量异形词、错别字、错误注音
    - 全词库完成注音
    - 同义多音字注音

![雾凇拼音](/image/demo/demoOfRimeIce.webp)

并且基于上述词库，构建主要维护的词库：
- `8105` 字表。
- `base` 基础词库。
- `ext` 扩展词库，小词库。
- `tencent` 扩展词库，大词库。
- Emoji

接下来就说一下雾凇和薄荷的区别。

## 相同点
基础的方面，都是适配了Rime输入法框架，支持全拼、双拼等多种输入方式，拼音词库全面（~~毕竟薄荷使用了雾凇词库~~<Badge type="tip" text="^2024.07" />薄荷使用了[白露拼音词库](https://github.com/gaboolic/rime-frost)，基于雾凇拼音并使用Python的 jieba 等方法重新分词训练；所以在拼音方面，体验类似）。

雾凇和薄荷，都使用了一些其他仓库的工具和方案：
- [melt_eng](https://github.com/tumuyan/rime-melt) 英文输入（@tumuyan | [Apache 2.0](https://github.com/tumuyan/rime-melt/blob/master/LICENSE)）
- [部件拆字方案](https://github.com/mirtlecn/rime-radical-pinyin) 反查、辅码（@mirtlecn | [CC BY-SA 4.0](https://github.com/mirtlecn/rime-radical-pinyin/blob/master/LICENSE)）
- [以词定字](https://github.com/BlindingDark/rime-lua-select-character)（@BlindingDark | [LGPL 3.0](https://github.com/BlindingDark/rime-lua-select-character/blob/master/LICENSE)）
- [数字、人民币大写](https://github.com/yanhuacuo/98wubi/blob/master/lua/number.lua)（@98wubi）

与此同时，薄荷使用了雾凇的
- 常见错音错字提示: [corrector_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/corrector_filter.lua)
- 英文词汇自动大写转换: [autocap_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/autocap_filter.lua)
- 等等一些小细节相同~

所以，就使用而言。雾凇和薄荷的拼音体验类似。

## 不同点
不同点也是有挺多的，毕竟，薄荷最初只是我个人的方案，很多东西，还体现了我个人的风格。

主要体现在：
- 薄荷适配了更多的输入方案，如98五笔、86五笔和小鹤双拼等，并且使用小鹤音形作为辅码辅助输入。而雾凇主要是拼音输入，并且考虑到拼音和形码是两个完全不同的体系，不考虑引入形码；
- 薄荷和雾凇的主题风格不一样（不过，这个其实无所谓）；
- 部分Lua脚本不一样，薄荷使用了雾凇的一些脚本，但是也有自己的脚本；同时，雾凇的一些脚本，薄荷也没有；同时，一些Lua可能功能一样，但是是使用不同的代码实现：
  - 星期、日期、时间: 雾凇和薄荷都可以使用`week`、`date`、`time`呼出当前时间；但是实现的代码不一样；
  - 雾凇有Unicode输入，薄荷没有；主要是，我认为使用Unicode的场景比较少，就没有映入；
  - 薄荷为了限制输入的检录内容，使用了`codeLengthLimit_processor.lua`限制最大检索长度，雾凇没有；
  - 雾凇有使用长词优先等Lua脚本，薄荷没有；还在考虑是否需要添加；
  - ……
- 雾凇的symbol等定制和薄荷的不一样。比如部分特殊字符的输入，两个是完全不同的；
- 雾凇和薄荷的快捷键也是不一样的，使用过程中需要主要查看各自的源码；
- 雾凇为了确保兼容性，使用的Lua语法引入是旧版的，但是薄荷考虑到新版的Lua语法更加简洁，同时较高版本的 librime 总会普及各个客户端，所以使用了新版的Lua语法引入；
- 雾凇的GitHub仓库更活跃，issue内有更多大佬解答问题；薄荷基本上维护和贡献的都是[Mintimate](https://github.com/Mintimate)和[YummyCocoa](https://github.com/YummyCocoa)，偶尔雾凇维护者之一的[@mirtlecn](https://github.com/mirtlecn)会推送一下内容，所以，有问题的话，可能解答会慢很多；推荐有不知道的问题，可以在雾凇的issue内看看有没有答案。
- 等等一些小细节差异~

所以，雾凇和薄荷的区别，主要是在于适配的输入方案、Lua脚本、快捷键、symbol等定制、GitHub仓库活跃度等方面。

## 选择建议
如果你是一个拼音输入用户，那么雾凇拼音是一个非常好的选择；如果你是一个需要多种输入方案的用户，那么薄荷输入法是一个不错的选择。

**只建议选择一个方案，不要同时使用雾凇和薄荷**: 因为，两个方案的配置文件会有冲突，同时，两个方案的快捷键也是不一样的，可能会导致输入冲突。

举个实际的场景，如果你使用的是拼音，那么实际上使用薄荷和雾凇都是可以的，也可以基于雾凇和薄荷进行更改（毕竟: 薄荷有大量借鉴雾凇的地方，开源协议也从最初的GPL2.0，同步使用了GPL3.0协议）。但是，如果你还有五笔的需求，比如家里的其他人是使用五笔的，或者使用你电脑的其他人是使用五笔的，那么薄荷或许是一个更好的选择。

当然，这只是一个建议，具体还是看个人的需求。并且，因为雾凇的开源社区环境更加繁荣，有更多的开源贡献者，雾凇的更新也会比薄荷更有质量（甚至我也给雾凇提过一些PR……）。

::: info 提示信息
另外，不要认为方案就是只有[雾凇](https://github.com/iDvel/rime-ice)和薄荷，还有很多其他的方案，可以根据自己的需求进行选择。而且，方案作者也是有交流的，比如: 雾凇主要维护者[@iDvel](https://github.com/iDvel)的博客，也是我博客的友链；[五笔86极点](https://github.com/KyleBing/rime-wubi86-jidian)的方案作者[@KyleBing](https://github.com/KyleBing)授权薄荷使用了他的方案等等。

**大家都在努力为社区贡献，希望大家都能找到适合自己的输入方案。**

> 哈哈，也打一个广告，如果你觉得本文档或者薄荷对你很有帮助

<donate/>

对于捐赠咖啡☕️的用户，将进入「鸣谢」和「日志更新」内(●'◡'●)ﾉ♥

:::

## END
其实，我最初是想配置一套自己的方案，进而就有了薄荷配置，借鉴了大量的雾凇配置，也继承雾凇配置使用 GPL 3 开源协议。 后续也在不断把实用、好用的功能加入到薄荷中。

但是 RIME 的圈就这么大，能想到、发现的功能，功能大部分雾凇都有（这也是为什么墨奇也和雾凇相似的原因之一）；即使拼音的词库后续词库从雾凇迁移到了白露、为了适配 wubi98 团队的 RimeTool，还是和雾凇的体验相识。

我个人其实是不喜欢反复造轮子的，但是目前的现状就是薄荷和雾凇、墨奇以及白露等方案有着大量的交织和使用相同的依赖，我不清楚这是否是一个好的现象，但是，如果你想有个适合自己的方案，那么，目前来说，可以任选一个就好了。