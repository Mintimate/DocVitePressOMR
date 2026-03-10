---
layout: doc
title: Change Log
sidebar: false
---
# Change Log
Thank you for your long-term expectation. I will change the page to enumerate the update log so that everyone can know the configuration changes at various points in time, especially destructive changes.

At the same time, the acknowledgments of donating users will also be recorded in the timeline.

:::info
If you want to join the development of Mint input method configuration template, please submit a PR:
- [oh-my-rime configuration warehouse](https://github.com/Mintimate/oh-my-rime)
- [oh-my-rime configuration document](https://github.com/Mintimate/DocVitePressOMR)

<donate lang="en"/>

please be sure to note "Mint Pinyin" or "oh-my-rime" (●'◡'●)ﾉ♥

:::

Thank you to CNB for providing storage and acceleration resources. The following content is currently mirrored by Oh-my-rime, offering download links for users experiencing difficulty accessing GitHub:  

| Original Repository | Packaged Mirror | Description |  
| ------------------- | --------------- | ------------------------------------------------------------------------ |  
| [oh-my-rime Github](https://github.com/Mintimate/oh-my-rime) | [oh-my-rime.zip](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/oh-my-rime.zip) | Oh-my-rime Input Method Configuration Repository |  
| [Squirrel Github](https://github.com/rime/Squirrel) | [Squirrel-latest.pkg](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Squirrel-latest.pkg) | Squirrel Client (macOS) |  
| [Weasel Github](https://github.com/rime/weasel) | [weasel-installer-latest.exe](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/weasel-installer-latest.exe) | Weasel Client (Windows) |  
| [Fcitx5-Rime(macOS) Github](https://github.com/fcitx-contrib/fcitx5-macos) | [Fcitx5-Rime.zip](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Fcitx5-Rime.zip) | macOS Fcitx5-Rime Client |  
| [RIME-LMDG Github](https://github.com/amzxyz/RIME-LMDG) | [wanxiang-lts-zh-hans.gram](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/wanxiang-lts-zh-hans.gram) | Wanxiang (LMDG) Model |  

## 2025-S04
Features:
- Breaking changes: Remove mint_date_time_translator related configurations, use shijian.lua instead. <Badge type="tip">[7ae364ea06](https://github.com/Mintimate/oh-my-rime/commit/2c53f68cf4bb9461bda82e1b2862307ae364ea06)</Badge>

Performance:
- Adjusted the dictionary override and horizontal display demo descriptions in the documentation.
- Upgraded the internal RAG retrieval in the documentation.

Fix:
- Fixed abnormal association issues under full pinyin input <Badge type="tip">[df133d347b](https://github.com/Mintimate/oh-my-rime/commit/12437f63209b494f8f8b8277d56fe4df133d347b)</Badge>

Thanks:
| Time       | Platform | User            | Support💵 | Message       |
| ---------- | -------- | --------------- | ----- | ------------- |
| 2026/03/10 | 微信赞赏 | 微信用户: AA～电脑城-弯儿师傅 | 100¥   | 薄荷拼音很好用，电脑手机都用上了 |
| 2025/12/25 | 微信赞赏 | 微信用户: cyrasafia | 30¥   | -- |
| 2025/12/15 | 微信赞赏 | 微信用户 | 50¥   | 感谢维护，全平台换了薄荷拼音方案 |
| 2025/12/09 | 微信赞赏 | 微信用户: 周彦铭 Silver | 10¥   | 挺好用, gj! |
| 2025/11/23 | 微信赞赏 | 微信用户: ^^ | 50¥   | 输入法我只用薄荷 |
| 2025/11/22 | 微信赞赏 | 微信用户: 何唯是真名er | 10¥   | 昨天用上的，谢谢了。这么棒的作品 |
| 2025/11/13 | 微信赞赏 | 微信用户: tyfanchz | 20¥   | 感谢大大们维护的好用的方案！ |
| 2025/11/04 | 微信赞赏 | 微信用户: 培公啊 | 10¥   | -- |
| 2025/10/05 | 爱发电 | QQ用户: Lii(892***084) | 100¥   | 薄荷输入法简直丝滑无比 |
| 2025/10/25 | 爱发电 | QQ用户: 白水(290***894) | 100¥   | 期待您的回复 |

## 2025-S03  
Features:
- Breaking Changes: Switched to the Wanxiang dictionary for better compatibility with the Wanxiang model <Badge type="tip">[6dfbd6e76a](https://github.com/Mintimate/oh-my-rime/commit/f14c91f5a2ea6212f166057586210e6dfbd6e76a)</Badge>.  
- Adapted Fcitx5 macOS skins and provided mirrored Fcitx5 downloads.  
- Added a RIME and oh-my-rime relationship graph to Mintimate Docs: [Basic Concepts](/zh/guide/#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5).  

Fixes:
- Resolved conflicts between error correction and Wanxiang pre-edit scripts <Badge type="tip">[4a501002d9](https://github.com/Mintimate/oh-my-rime/commit/88ebe26fc340da18dcc1e8381283ab4a501002d9)</Badge>.  

Thanks:
| Time       | Platform | User            | Support💵 | Message       |
| ---------- | -------- | --------------- | ----- | ------------- |
| 2025/07/24 | 爱发电 | 微信用户: Xinyi | 50¥   | 膜雨月大佬，教程写得很有帮助，希望能交流一次呀 |
| 2025/09/03 | 微信赞赏 | 微信用户: Derek | 20¥   | Derek |

## 2025-S02
Features:
- Added community theme in Oh-my-rime's documentation: [#191](https://github.com/Mintimate/oh-my-rime/issues/191)
- Introduced Lua expression calculation function to implement a simple calculator <Badge type="tip">[40659cf497](https://github.com/Mintimate/oh-my-rime/commit/fca55ddff09b88b0c022f9d883a22940659cf497)</Badge>

Thanks:
| Time       | Platform | User            | Support💵 | Message       |
| ---------- | -------- | --------------- | -------- | ------------- |
| 2025/04/10 | 微信赞赏 | 微信用户: fix u | 10¥      | 感谢作者开源🙏 |
| 2025/06/06 | 微信赞赏 | 微信用户: 「匿名用户」 | 10¥   | 薄荷输入法 |
| 2025/06/08 | 微信赞赏 | 微信用户: 东方 | 28¥   | 希望可以导入“王码” |

## 2025-S01
Performance:
- Use cache to improve auxiliary code input performance <Badge type="tip">[4ecb9033f8](https://github.com/Mintimate/oh-my-rime/commit/d2498957a7a16200ce04819bb58b1a4ecb9033f8)</Badge>


Thanks:
| Time       | Platform | User                                                                     | Support💵 | Message              |
| ---------- | -------- | ------------------------------------------------------------------------ | -------- | -------------------- |
| 2025/01/03 | 微信赞赏 | QQ用户:凌(873**534)                                                      | 5¥       | 感谢在QQ群无私的帮助 |
| 2025/01/04 | 爱发电   | [爱发电用户_NVKP](https://afdian.com/u/b5636c3aca4d11ef8f5a5254001e7c00) | 15¥      | oh-my-rime           |

## 2024-S04
Features:
- Added original comment option for typo and pronunciation correction feature <Badge type="tip">[d3a3273030](https://github.com/Mintimate/oh-my-rime/commit/03fdc656896811b0593223893f613dd3a3273030)</Badge>
- Added the function to print the current second-level timestamp by inputting `timestamp` <Badge type="tip">[f90421138d](https://github.com/Mintimate/oh-my-rime/commit/2aaeec7143560e23a6b3381919ebebf90421138d)</Badge>
- Breaking changes: Remove the auxiliary code for the full spelling category and free up the semicolon key. <Badge type="tip">[0b72181e90](https://github.com/Mintimate/oh-my-rime/commit/ec9ede2e05a36c9214fd5adfc1645e0b72181e90)</Badge>
- Breaking changes: Modify the basic word library of Terra Pinyin to a manually verified word library. <Badge type="tip">[8a5c613f9b](https://github.com/Mintimate/oh-my-rime/commit/af66637a7ae4871145229aa65e75048a5c613f9b)</Badge>

Performance:
- Optimize symbols for multi-character matching <Badge type="tip">[970bc76ef1](https://github.com/Mintimate/oh-my-rime/commit/52489419e1537e5bde5206b9facb8d970bc76ef1)</Badge>
- Auxiliary codes retain original comment options <Badge type="tip">[864fe1d7cb](https://github.com/Mintimate/oh-my-rime/commit/d718661c4508f469a6867f787101fb864fe1d7cb)</Badge>

Fix:
- Fix the shortcut key mapping error between Traditional and Simplified Chinese (Ctrl + Shift + 4) <Badge type="tip">[5fd1177739](https://github.com/Mintimate/oh-my-rime/commit/2fbe2370de8544b7891f390ad14e005fd1177739)</Badge>
- Fix the Pinyin entry errors for Heishuiya and Lanshuiya <Badge type="tip">[2db700224d](https://github.com/Mintimate/oh-my-rime/commit/f3fe67b2dd2be0b7679039886976172db700224d)</Badge>

Thanks:

| Time       | Platform | User                   | Support💵 | Message                        |
| ---------- | -------- | ---------------------- | -------- | ------------------------------ |
| 2024/10/26 | 微信赞赏 | 微信用户: Jacian       | 10¥      | 很好用的方案，希望一直维护下去 |
| 2024/10/20 | 微信赞赏 | 微信用户: Torjoy       | 20¥      | 感谢大佬                       |
| 2024/09/27 | 微信赞赏 | RIME输入法交流小群群友 | 10¥      | 叮，你要的奶茶                 |
| 2024/09/06 | 微信赞赏 | 微信用户: YANGZhitao   | 20¥      | 很好用! 感谢维护这套方案       |

## 2024-S03
Features:
- Adapted [rime plum](https://github.com/rime/plum) <Badge type="warning">[More](/en/guide/importMint.html#⭐东风破导入薄荷)</Badge> <Badge type="tip">[b606836082](https://github.com/Mintimate/oh-my-rime/commit/b606836082994fc4f0c3222338ec3a67611e4816)</Badge>
- The vocabulary database has been switched from the rime-ice to the  rime-frost <Badge type="tip">[ad684cade2](https://github.com/Mintimate/oh-my-rime/commit/ad684cade2ef043be32e2677028c421dc36d05f7)</Badge>

Fix:
- Removed duplicate configurations <Badge type="tip">[cc85266b05](https://github.com/Mintimate/oh-my-rime/commit/cc85266b05219a87866ee8adb64fc5eecdc6c2f5)</Badge>
- Fixed potential lag caused by the "auxiliary code lua" still loading when not activated <Badge type="tip">[6008d00af1](https://github.com/Mintimate/oh-my-rime/commit/6008d00af1a051f9a892e0fdb750a75fe4c80a14)</Badge>; Special thanks to QQ group user `浪漫满屋` (QQ: 2416418***) for their feedback and continuous testing
- Fixed import incorrect radical_pinyin in the rime_mint schema  <Badge type="tip">[e93ea21df7](https://github.com/Mintimate/oh-my-rime/commit/e93ea21df70cc6ae80aacaeb5ecc809025a462a7)</Badge>

Thanks:

| Time       | Platform | User         | Support💵 | Message            |
| ---------- | -------- | ------------ | -------- | ------------------ |
| 2024/08/21 | 微信赞赏 | 微信用户: ZY | 20¥      | 谢谢你维护这套方案 |

## 2024-S02
Features:
- Breaking changes: Modification of the activation key for reverse lookup. It is uniformly used in all input method schemes <Badge type="tip">[51779acb8](https://github.com/Mintimate/oh-my-rime/commit/51779acb88a447926af451426439573d504638f7)</Badge> :
  - Uu: Character decomposition reverse lookup
  - Uw: Wubi reverse lookup
  - Ui: Stroke reverse lookup
- Breaking changes: The activation of emoticons has been changed from `vv` to `VV`, and the issue of English `vv` being occupied and unable to associate during word formation in the case of double spelling has been resolved. <Badge type="tip">[46a070dd0d](https://github.com/Mintimate/oh-my-rime/commit/46a070dd0dedf72725631b1c16b2d0a23ecc3112)</Badge>
- Introduce 9-grid layout: Introduce the 9-grid layout for Hamster, where the default 9-grid layout uses the full spelling scheme. You can override the configuration to use other schemes. <Badge type="tip">[88ede4c8c](https://github.com/Mintimate/oh-my-rime/commit/88ede4c8cd27b0fc57ab5d12860c348c3e26c777)</Badge>
- Introduced the 86 Wubi scheme: [https://github.com/KyleBing/rime-wubi86-jidian](https://github.com/KyleBing/rime-wubi86-jidian)
- Breaking changes: Adapt to rime-tool: Adapt to rime-tool, you can use rime-tool for graphical customization <Badge>[52daba2f74](https://github.com/Mintimate/oh-my-rime/commit/52daba2f74418c08c170ad54879d256b13a9401d)</Badge>, <Badge>[31895cec7f](https://github.com/Mintimate/oh-my-rime/commit/31895cec7f8b145468b8482cc090640adc3c5517)</Badge>

Style:
- The Squirrel and Weasel input methods have added a new skin set. <Badge type="tip">[e263a21743](https://github.com/Mintimate/oh-my-rime/commit/e263a217437d87ef12c25c0372e08c7b99f8c2b1)</Badge>

Fix:
- Fixed the issue where the vertical layout in Squirrel could not be overwritten. <Badge type="tip">[5a9a29b7f8](https://github.com/Mintimate/oh-my-rime/commit/5a9a29b7f8bc3e8aca4982956f276a542a9d891b)</Badge>

Refactor:
- Refactored 98 Wubi, the scheme name has been renamed to: Wubi98-Wubi Xiaozhu. Introduced Lua that other schemes are using. <Badge type="tip">[4f10fbbce8](https://github.com/Mintimate/oh-my-rime/commit/4f10fbbce8c6f4e1455faf7bbf60e5dfacb89a0e)</Badge>
- The Emoji dictionary is no longer imported, Emoji is fully implemented using OpenCC. <Badge>[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge>

Thanks:

| Time       | Platform | User                                                                      | Support💵        | Message                                                                                             |
| ---------- | -------- | ------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| 2024/06/30 | 爱发电   | [奶茶不加冰](https://afdian.com/u/802ed17a36bf11efa4db52540025c377)       | 20¥             | 手机上已经用上了，体验非常好，感谢作者。                                                            |
| 2024/06/12 | 爱发电   | [爱发电用户_15aca](https://afdian.com/u/15aca804289b11efa13952540025c377) | 36¥             | oh-my-rime                                                                                          |
| 2024/06/11 | 爱发电   | [爱发电用户_9d84b](https://afdian.com/u/9d84b3ac280011efa1d352540025c377) | 20¥             | oh-my-rime, perfect!                                                                                |
| 2024/05/31 | 爱发电   | [爱发电用户_sYNg](https://afdian.com/u/c428e6701f1a11efab4a5254001e7c00)  | 20¥             | 一个月前就准备请up来杯奶茶了~今天是时候兑现一下了！感谢up的薄荷拼音真的非常好用~我已经全平台跟进啦~ |
| 2024/05/28 | 微信     | 公众号用户: 晶码战士                                                      | 50¥             | 薄荷输入法👍👍👍                                                                                       |
| 2024/04/28 | 爱发电   | [爱发电用户_UkCK](https://afdian.com/u/8717bcc8054511efbfc052540025c377)  | 20¥（一杯奶茶） | oh-my-rime                                                                                          |

## 2024-S01
Features:
- Breaking changes: Fully use the new Lua introduction method to prepare for adding to the repository update source
- Destructive change: Use radical_pinyin to replace chaizi for word splitting <Badge type="tip">[#29](https://github.com/Mintimate/oh-my-rime/discussions/29)</Badge>
- Default configuration file migration: Migrate `default.custom.yaml` to `default.yaml` to facilitate user-defined overrides
- Xiaohe Shuangpin auxiliary code filter prompt: Add Xiaohe Shuangpin's auxiliary code filter to facilitate Xiaohe users to see the font code prompt. It is turned off by default. You can use "Control + Shift + C" when there are candidate words. "To activate, use `;` to enter the auxiliary code
- Lua adapted to lunar date output <Badge type="tip">[7febf49d7](https://github.com/Mintimate/oh-my-rime/commit/7febf49d7c577e908492f1ed3b4bbfe13c08d08d)</Badge>

Performance:
- Optimizing input method spelling speed <Badge type="tip">[43757469d1](https://github.com/Mintimate/oh-my-rime/commit/43757469d1d314deea83ee5f22e169d29c28690e)</Badge> :
  - Removing the regular expressions for abbreviated spellings in the Double fly Pinyin input method can significantly improve spelling speed. Double pinyin also does not require abbreviated spellings.
  - Optimizing the abbreviated spellings in other Pinyin input methods can theoretically achieve higher efficiency than wildcard matching.

Style:
- Destructive changes: Remove the custom personalized patch configuration of Xiaolanghao and Ratwhisker, and use personalized configuration instead
- Use a fixed-width font for the Mintimate serial number: Use the fixed-width font that comes with the system to avoid uneven serial number lengths<Badge type="tip">[#35](https://github.com/Mintimate/oh-my -rime/issues/35)</Badge>
- Period automatically appears on the screen, `` ``` `` appears on the screen by default
- Weasel's theme preview adaptation <Badge type="tip">[a6b054698dc](https://github.com/Mintimate/oh-my-rime/commit/a6b054698dcbf72d42bd02918acff75a07807c86)</Badge>
- Cancel "auto prompt" with mixed Chinese and English phrases <Badge type="tip">[92f6143688](https://github.com/Mintimate/oh-my-rime/commit/92f6143688132c1c3bbff2b352a702a5d085ce5f)</Badge>

Fix:
- Traditional Chinese switching shortcut key correction <Badge type="tip">[#37](https://github.com/Mintimate/oh-my-rime/issues/37)</Badge>
- Removed `__inculde` configuration, optimized character limit Lua <Badge type="tip">[#28](https://github.com/Mintimate/oh-my-rime/issues/28)</Badge>

Clear:
- Delete unused Emoji configurations (OpenCC has been used to replace them)
- Delete residual dependencies on Lunar Pinyin that are no longer used

Thanks:
| Time       | Platform | User                                                                      | Support💵   | Message                      |
| ---------- | -------- | ------------------------------------------------------------------------- | ---------- | ---------------------------- |
| 2024/01/22 | 爱发电   | [爱发电用户_8b769](https://afdian.com/u/8b769b02b8c111ee928952540025c377) | 50¥（KFC） | Hi, 感谢维护oh-my-rime       |
| 2024/03/15 | 爱发电   | [爱发电用户_520f9](https://afdian.com/u/520f9e12e26111eeaa3a5254001e7c00) | 50¥（KFC） | 辛苦了，希望能持续更新下去！ |

## 2023-S04
Features:
- Use 98 Wubi to replace 86 Wubi, and consider whether to reintroduce 86 Wubi later.
- Update documentation and introduce mirror warehouse

Style:
- Fuzzy Pinyin is not used by default <Badge type="tip">[#15](https://github.com/Mintimate/oh-my-rime/pull/15)</Badge>

Fix:
- Fixed the word splitting introduction error in "Mint Pinyin-Quanpin Input"
- Fixed Wubi reverse check failure

## 2023-S03
Features:
- Introduction of rime pinyin English frequency reduction <Badge type="tip">[af972d72f4](https://github.com/Mintimate/oh-my-rime/commit/af972d72f49d575a4915131a4e9ce7b85aa92f67)</Badge>
- Optimize the Lua script of day, time and date to simplify the algorithm
- Use melt_eng to replace easy_en to fix the English thesaurus reference problem <Badge type="tip">[ece44d9c6c](https://github.com/Mintimate/oh-my-rime/commit/ece44d9c6c0b77ff9bb9c5f53dcc1164c9ffb366)</Badge>
- Introducing rime English thesaurus rime-ice.en <Badge type="tip">[2743a6f9fb](https://github.com/Mintimate/oh-my-rime/commit/2743a6f9fb43f3d77c4591045f3ed1eddb31964b)</Badge>
- Adapt Lua-based amount conversion <Badge type="tip">[ed1476d95f](https://github.com/Mintimate/oh-my-rime/commit/ed1476d95f3b6f6c2031c15edc1658b05a6c6947)</Badge>
- Adapt `-` and `=` to turn pages of candidate words

## 2023-S02
Features:
- Introduce input restriction Lua <Badge type="tip">[d9b59b2c5878dc](https://github.com/Mintimate/oh-my-rime/commit/d9b59b2c5878dcbba9b5bf933ee01bee23855283)</Badge>
- Delete the word splitting font (it was found that too many words use `uu` as the leader and have no word frequency, which will cause Rime to freeze)
- Fusion of rime pinyin rime-ice.base <Badge type="tip">[ee7f61b260](https://github.com/Mintimate/oh-my-rime/commit/ee7f61b260baaa831c6ab3ddfd312e3e5d41d554)</Badge>


## 2023-S01
Features:
- Initialization project, based on Lunar Pinyin, adapted to statement flow
- Introduce and adapt easy_en to support mixed Chinese and English input
- Add word splitting font library
- Adapted to Earth Pinyin
