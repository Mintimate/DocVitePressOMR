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

You are also welcome to invite me to [drink coffee](https://afdian.net/a/minimise), please be sure to note "Mint Pinyin" or "oh-my-rime" (●'◡'●)ﾉ♥

:::

Okay, generate update documents in quarterly format:

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
| Time | Platform | User | Support💵 | Message |
|------------|-----|-----------------------------------------------------------|----------|--------------------|
| 2024/01/22 | 爱发电 | [爱发电用户_8b769](https://afdian.net/u/8b769b02b8c111ee928952540025c377) | 50¥（KFC） | Hi, 感谢维护oh-my-rime |
| 2024/03/15 | 爱发电 | [爱发电用户_520f9](https://afdian.net/u/520f9e12e26111eeaa3a5254001e7c00) | 50¥（KFC） | 辛苦了，希望能持续更新下去！ |

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
