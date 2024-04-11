---
layout: doc
title: 更新日志
sidebar: false
---
# 更新日志
感谢大家长久以来的期待，改页面枚举一下更新日志，方便大家知道各个时间点的配置变动，尤其是破坏性变更。 

与此同时，捐赠用户的鸣谢，也会记录在时间轴内。

::: info 提示
如果你想加入薄荷输入法配置模板的开发，欢迎提交PR：
- [oh-my-rime 配置仓库](https://github.com/Mintimate/oh-my-rime)
- [oh-my-rime 配置文档](https://github.com/Mintimate/DocVitePressOMR)

也欢迎请我[喝咖啡](https://afdian.net/a/mintimate)，请务必备注『薄荷拼音』或者『oh-my-rime』(●'◡'●)ﾉ♥

:::

## 2024-S02
Features:
- 破坏性变更: 反查激活键修改。各个输入法方案内统一使用 <Badge type="tip">[51779acb8](https://github.com/Mintimate/oh-my-rime/commit/51779acb88a447926af451426439573d504638f7)</Badge> ：
  - Uu: 拆字反查
  - Uw: 五笔反查
  - Ui: 笔画反查
- 破坏性变更: 颜文字由`vv`激活替换为`VV`激活，并且解决了双拼情况下，在组词时候，英文`vv`被占用而无法联想。 <Badge type="tip">[46a070dd0d](https://github.com/Mintimate/oh-my-rime/commit/46a070dd0dedf72725631b1c16b2d0a23ecc3112)</Badge>

## 2024-S01
Features:
- 破坏性变更: 全面使用新的Lua引入方式，以备添加到仓更新源内
- 破坏性变更: 拆字使用 radical_pinyin 替换 chaizi <Badge type="tip">[#29](https://github.com/Mintimate/oh-my-rime/discussions/29)</Badge>
- 默认配置文件迁移: 将 `default.custom.yaml` 迁移到 `default.yaml`，方便用户自定义覆写
- 小鹤双拼辅码滤镜提示: 添加小鹤双拼的辅码滤镜，方便小鹤用户看到形码提示，默认关闭，可以在存在候选词情况下，使用「Control + Shift + C」进行激活，使用`;`进行辅码输入
- 适配农历日期输出的Lua <Badge type="tip">[7febf49d7](https://github.com/Mintimate/oh-my-rime/commit/7febf49d7c577e908492f1ed3b4bbfe13c08d08d)</Badge>

Performance:
- 优化拼写速度 <Badge type="tip">[43757469d1](https://github.com/Mintimate/oh-my-rime/commit/43757469d1d314deea83ee5f22e169d29c28690e)</Badge> :
  - 移除小鹤拼音内的简拼正则，可以大幅度提升拼写速度；双拼也不需要简拼。
  - 优化其他拼音输入法内的简拼，理论上比通配效率高一些

Style:
- 破坏性变更: 移除小狼毫和鼠须管的custom个性化补丁配置，使用个性化配置代替
- 鼠须管序号使用等宽字体: 使用系统自带的等宽字体，以免序号长度不一 <Badge type="tip">[#35](https://github.com/Mintimate/oh-my-rime/issues/35)</Badge>
- 句号自动上屏，`` ``` ``默认上屏
- 小狼毫主题预览适配 <Badge type="tip">[a6b054698dc](https://github.com/Mintimate/oh-my-rime/commit/a6b054698dcbf72d42bd02918acff75a07807c86)</Badge>
- 中英混合短语取消「自动提示」<Badge type="tip">[92f6143688](https://github.com/Mintimate/oh-my-rime/commit/92f6143688132c1c3bbff2b352a702a5d085ce5f)</Badge>

Fix:
- 繁体切换快捷键修正<Badge type="tip">[#37](https://github.com/Mintimate/oh-my-rime/issues/37)</Badge>
- 移除`__inculde`配置，优化字符限制Lua <Badge type="tip">[#28](https://github.com/Mintimate/oh-my-rime/issues/28)</Badge>

Clear:
- 删除已经不用的Emoji配置（已经使用了OpenCC进行替换）
- 删除不再使用的朙月拼音残留依赖

Thanks:
| 时间         | 平台  | 用户                                                        | 支持💵     | 留言                 |
|------------|-----|-----------------------------------------------------------|----------|--------------------|
| 2024/01/22 | 爱发电 | [爱发电用户_8b769](https://afdian.net/u/8b769b02b8c111ee928952540025c377) | 50¥（KFC） | Hi, 感谢维护oh-my-rime |
| 2024/03/15 | 爱发电 | [爱发电用户_520f9](https://afdian.net/u/520f9e12e26111eeaa3a5254001e7c00) | 50¥（KFC） | 辛苦了，希望能持续更新下去！ |


## 2023-S04
Features:
- 使用98五笔替代86五笔，后续考虑是否再次引入86五笔
- 更新说明文档，引入镜像仓库

Style:
- 默认不使用模糊拼音 <Badge type="tip">[#15](https://github.com/Mintimate/oh-my-rime/pull/15)</Badge>

Fix:
- 修复「薄荷拼音-全拼输入」拆字引入错误
- 修复五笔反查失败


## 2023-S03
Features:
- 引入雾凇拼音英文降频 <Badge type="tip">[af972d72f4](https://github.com/Mintimate/oh-my-rime/commit/af972d72f49d575a4915131a4e9ce7b85aa92f67)</Badge>
- 优化星期、时间和日期的Lua脚本，简化算法
- 使用melt_eng替换easy_en，修复英文词库引用问题 <Badge type="tip">[ece44d9c6c](https://github.com/Mintimate/oh-my-rime/commit/ece44d9c6c0b77ff9bb9c5f53dcc1164c9ffb366)</Badge>
- 引入雾凇英文词库 rime-ice.en <Badge type="tip">[2743a6f9fb](https://github.com/Mintimate/oh-my-rime/commit/2743a6f9fb43f3d77c4591045f3ed1eddb31964b)</Badge>
- 适配基于Lua的金额转换 <Badge type="tip">[ed1476d95f](https://github.com/Mintimate/oh-my-rime/commit/ed1476d95f3b6f6c2031c15edc1658b05a6c6947)</Badge>
- 适配`-`和`=`进行候选词的翻页

## 2023-S02
Features:
- 引入输入限制Lua <Badge type="tip">[d9b59b2c5878dc](https://github.com/Mintimate/oh-my-rime/commit/d9b59b2c5878dcbba9b5bf933ee01bee23855283)</Badge>
- 删除拆字字库（发现因为过多字使用`uu`作为前导并且没有词频，会导致Rime卡顿）
- 融合雾凇拼音 rime-ice.base <Badge type="tip">[ee7f61b260](https://github.com/Mintimate/oh-my-rime/commit/ee7f61b260baaa831c6ab3ddfd312e3e5d41d554)</Badge>


## 2023-S01
Features:
- 初始化项目，基于朙月拼音，适配语句流
- 引入和适配easy_en，使其支持中英混合输入
- 添加拆字字库
- 适配地球拼音
