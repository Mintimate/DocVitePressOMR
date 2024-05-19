---
layout: doc
title: Differences between RimeIce and Oh-my-rime
head:
  - - meta
    - name: keywords
      content: oh-my-rime, rime-ice, Differences between oh-my-rime and rime-ice, Rime input scheme
description: rime-ice is a very good Rime input scheme, and the configuration of oh-my-rime input method also refers to rime-ice a lot; but what are the specific differences between rime-ice and oh-my-rime input scheme configuration?
aside: true
---
## Differences between rime-ice and oh-my-rime
Rime-ice is a very good Rime input scheme, supporting multiple input methods such as full spelling and double spelling, and has a comprehensive vocabulary. At the same time, the repository is actively contributed. The vocabulary includes:
- Simplified character table, vocabulary
  - [General Standard Chinese Character Table](https://github.com/iDvel/The-Table-of-General-Standard-Chinese-Characters)
  - [Huayu Wild Wind System Vocabulary](http://bbs.pinyin.thunisoft.com/forum.php?mod=viewthread&tid=30049) (@Wild Wind)
  - [Tsinghua University Open Source Vocabulary](https://github.com/thunlp/THUOCL) (@THUNLP | [MIT](https://github.com/thunlp/THUOCL/blob/master/LICENSE))
  - [Modern Chinese Common Word List](https://gist.github.com/indiejoseph/eae09c673460aa0b56db) (@Joseph Cheng)
  - [Tencent Word Vector](https://ai.tencent.com/ailab/nlp/en/download.html) (@Tencent AI Lab | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/))
  - References
    - Modern Chinese Dictionary
    - Synonym Forest
    - New Chinese Idiom Dictionary
- Vocabulary revision
  - Proofread a large number of variant characters, typos, and incorrect pronunciations
  - Complete pronunciation of the entire vocabulary
  - Pronunciation of synonymous polyphones

And based on the above vocabulary, build the main maintenance vocabulary:
- `8105` character table.
- `base` basic vocabulary.
- `ext` extended vocabulary, small vocabulary.
- `tencent` extended vocabulary, large vocabulary.
- Emoji

Next, let's talk about the differences between rime-ice and oh-my-rime.
## Similarities
In terms of the basics, both are adapted to the Rime input method framework, support multiple input methods such as full spelling and double spelling, and have a comprehensive pinyin vocabulary (after all, oh-my-rime uses the rime-ice vocabulary, and the pinyin experience is basically similar).

rime-ice and oh-my-rime both use some tools and schemes from other repositories:
- [melt_eng](https://github.com/tumuyan/rime-melt) English input (@tumuyan | [Apache 2.0](https://github.com/tumuyan/rime-melt/blob/master/LICENSE))
- [Component decomposition scheme](https://github.com/mirtlecn/rime-radical-pinyin) Reverse lookup, auxiliary code (@mirtlecn | [CC BY-SA 4.0](https://github.com/mirtlecn/rime-radical-pinyin/blob/master/LICENSE))
- [Word-based character selection](https://github.com/BlindingDark/rime-lua-select-character) (@BlindingDark | [LGPL 3.0](https://github.com/BlindingDark/rime-lua-select-character/blob/master/LICENSE))
- [Numbers, RMB capitalization](https://github.com/yanhuacuo/98wubi/blob/master/lua/number.lua) (@98wubi)

At the same time, oh-my-rime uses rime-ice's
- Common mispronunciation and typo prompts: [corrector_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/corrector_filter.lua)
- Automatic capitalization of English vocabulary: [autocap_filter.lua](https://github.com/Mintimate/oh-my-rime/blob/main/lua/autocap_filter.lua)
- And so on some detail similarities~

So, in terms of use. The pinyin experience of rime-ice and oh-my-rime is similar.

## Differences
There are also quite a few differences, after all, oh-my-rime was initially just my personal scheme, and many things also reflect my personal style.

Mainly reflected in:
- oh-my-rime adapts to more input schemes, such as 98 Wubi, 86 Wubi, and Xiaohe Double Spelling, etc., and uses Xiaohe Sound and Shape as an auxiliary code for auxiliary input. While rime-ice is mainly pinyin input, and considering that pinyin and shape codes are two completely different systems, it does not consider introducing shape codes;
- The theme styles of oh-my-rime and rime-ice are different (but this actually doesn't matter);
- Some Lua scripts are different, oh-my-rime uses some of rime-ice's scripts, but also has its own scripts; at the same time, some of rime-ice's scripts, oh-my-rime does not have; at the same time, some Lua may have the same function, but use different code implementation:
  - Week, date, time: rime-ice and oh-my-rime can both use `week`, `date`, `time` to call up the current time; but the implementation code is different;
  - rime-ice has Unicode input, oh-my-rime does not; mainly because, I think the use of Unicode is relatively small, so it is not included;
  - oh-my-rime, in order to limit the input of the check-in content, used `codeLengthLimit_processor.lua` to limit the maximum retrieval length, rime-ice does not have;
  - rime-ice has used long word priority and other Lua scripts, oh-my-rime does not have; still considering whether to add;
  - ……
- rime-ice's symbol customization and oh-my-rime's are not the same. For example, the input of some special characters, the two are completely different;
- The shortcuts of rime-ice and oh-my-rime are also different, and you need to mainly check the source code of each during use;
- rime-ice, in order to ensure compatibility, uses the old version of Lua syntax introduction, but oh-my-rime considers that the new version of Lua syntax is more concise, and the higher version of librime will always popularize various clients, so it uses the new version of Lua syntax introduction;
- rime-ice's GitHub repository is more active, and there are more experts answering questions in the issue; oh-my-rime is basically maintained and contributed by [Mintimate](https://github.com/Mintimate) and [YummyCocoa](https://github.com/YummyCocoa), occasionally rime-ice maintainer One of [@mirtlecn](https://github.com/mirtlecn) will push some content, so, if there is a problem, the answer may be much slower; it is recommended that if you have a question you don't know, you can see if there is an answer in rime-ice's issue.
- And so on some small detail differences~

So, the difference between rime-ice and oh-my-rime is mainly in the adapted input scheme, Lua script, shortcut, symbol customization, GitHub repository activity, etc.

## Suggestions for Choice
If you are a pinyin input user, then rime-ice is a very good choice; if you are a user who needs multiple input schemes, then oh-my-rime is a good choice.

To give a practical scenario, if you use pinyin, then in fact both oh-my-rime and rime-ice can be used, and you can also make changes based on rime-ice and oh-my-rime (after all: oh-my-rime has a lot of references to rime-ice, and the open source protocol has also been synchronized from the initial GPL2.0, using the GPL3.0 protocol). However, if you also have a need for Wubi, such as other people in your family using Wubi, or other people using your computer using Wubi, then oh-my-rime may be a better choice.

Of course, this is just a suggestion, and it depends on individual needs. Moreover, the open source community environment of rime-ice in English is more prosperous, with more open source contributors, and the updates of rime-ice will be of higher quality than oh-my-rime (even I have submitted some PRs to rime-ice...).