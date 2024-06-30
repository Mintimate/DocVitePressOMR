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
- 引入 仓九宫格布局: 引入仓九宫格布局，默认的九宫格使用的是全拼方案，可以自己覆写配置为其他方案 <Badge type="tip">[88ede4c8c](https://github.com/Mintimate/oh-my-rime/commit/88ede4c8cd27b0fc57ab5d12860c348c3e26c777)</Badge>
- 引入 86五笔-极点 方案: [https://github.com/KyleBing/rime-wubi86-jidian](https://github.com/KyleBing/rime-wubi86-jidian)
- 破坏性变更: 适配 rime-tool: 适配 rime-tool，可以使用 rime-tool 进行图形化定制 <Badge type="tip">[52daba2f74](https://github.com/Mintimate/oh-my-rime/commit/52daba2f74418c08c170ad54879d256b13a9401d)</Badge>、<Badge type="tip">[31895cec7f](https://github.com/Mintimate/oh-my-rime/commit/31895cec7f8b145468b8482cc090640adc3c5517)</Badge>

Style:
- 主题: 小狼毫和鼠须管新增一套皮肤 <Badge type="tip">[e263a21743](https://github.com/Mintimate/oh-my-rime/commit/e263a217437d87ef12c25c0372e08c7b99f8c2b1)</Badge>

Fix:
- 修复鼠须管纵向无法被覆写问题 <Badge type="tip">[5a9a29b7f8](https://github.com/Mintimate/oh-my-rime/commit/5a9a29b7f8bc3e8aca4982956f276a542a9d891b)</Badge>

Refactor:
- 重构98五笔，方案名称更名为: 五笔98-五笔小筑。引入其他方案都在使用的 Lua <Badge type="tip">[4f10fbbce8](https://github.com/Mintimate/oh-my-rime/commit/4f10fbbce8c6f4e1455faf7bbf60e5dfacb89a0e)</Badge>
- Emoji词典不再引入，Emoji完全使用OpenCC实现 <Badge type="tip">[80dcec1878](https://github.com/Mintimate/oh-my-rime/commit/80dcec187865ef1ad20a2c31268cc95c435be385)</Badge>

Thanks:

| 时间         | 平台  | 用户                                                                   | 支持💵      | 留言                                                    |
|------------|-----|----------------------------------------------------------------------|-----------|-------------------------------------------------------|
| 2024/06/30 | 爱发电 | [奶茶不加冰](https://afdian.net/u/802ed17a36bf11efa4db52540025c377)       | 20¥       | 手机上已经用上了，体验非常好，感谢作者。                                  |
| 2024/06/12 | 爱发电 | [爱发电用户_15aca](https://afdian.net/u/15aca804289b11efa13952540025c377) | 36¥       | oh-my-rime                                            |
| 2024/06/11 | 爱发电 | [爱发电用户_9d84b](https://afdian.net/u/9d84b3ac280011efa1d352540025c377) | 20¥       | oh-my-rime, perfect!                                  |
| 2024/05/31 | 爱发电 | [爱发电用户_sYNg](https://afdian.net/u/c428e6701f1a11efab4a5254001e7c00)  | 20¥       | 一个月前就准备请up来杯奶茶了~今天是时候兑现一下了！感谢up的薄荷拼音真的非常好用~我已经全平台跟进啦~ |
| 2024/05/28 | 微信  | 公众号用户: 晶码战士                                                          | 50¥       | 薄荷输入法👍👍👍                                           |
| 2024/04/28 | 爱发电 | [爱发电用户_UkCK](https://afdian.net/u/8717bcc8054511efbfc052540025c377)  | 20¥（一杯奶茶） | oh-my-rime                                            |

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
