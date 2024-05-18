---
layout: doc
title: Custom Default Activation Scheme
head:
    - - meta
      - name: keywords
        content: rime default activation scheme, mint input method to open double spelling, rime default scheme configuration
description: In the Mint input scheme, how to customize the default activation scheme? How to activate Zhiguang Double Spelling, Sogou Double Spelling, Natural Code Double Spelling, etc.?
---

# Default Activation Scheme
What does the default activation scheme mean? In fact, it is the default scheme of our Mint input method.

In the Mint input method, we default to activate Mint Quanpin, Xiaohe Double Spelling, Quanpin Xiaohe Mixed Input and Wubi 98, Wubi 86, and the nine-key layout T9 suitable for iOS warehouse input method.

As you can see, there are already many activated schemes. But in this case, there are two situations:
- One is that we don't need so many schemes, we only need to activate one or two schemes;
- The other is that we need to activate other schemes, such as Zhiguang Double Spelling, Sogou Double Spelling, Natural Code Double Spelling, etc.

Usually, the more activated schemes, the longer Rime needs to compile when redeploying; although Rime is incremental update in most cases, but if it triggers a full amount, or some operations need to delete the build folder and redeploy,

This will cause the recompilation time to be very long. Moreover, many people have other usage habits, such as: Zhiguang Double Spelling, Sogou Double Spelling, Natural Code Double Spelling, etc.

And, the Oh-my-rime scheme, since <Badge type="tip">[Commit 4b558f21cb](https://github.com/Mintimate/oh-my-rime/commit/4b558f21cb946e96e11cce51c68c8a16e5676877)</Badge> began to adapt to Zhiguang Double Spelling, Sogou Double Spelling, Natural Code Double Spelling, etc., it is just not activated by default.

```yaml
## 九宫格依赖于 rime_mint ，如果需要使用其他方案（比如: 小鹤双拼的 九宫格），可以使用 custom 文件覆写
schema_list:
# 以下方案薄荷进行了适配，但是没有激活
# - schema: double_pinyin_abc    # 智能ABC双拼
# - schema: double_pinyin_mspy   # 微软双拼
# - schema: double_pinyin_sogou  # 搜狗双拼
# - schema: double_pinyin_ziguang # 紫光双拼
# - schema: double_pinyin         # 自然码双拼
```

Next, let's see how to modify the default activation scheme. If some buddies, using Tiger Code and other shape codes, want to add them to Oh-my-rime by themselves, they can also refer to this method to modify.

## default.yaml file
We talked about configuration override in [Configuration Override and Customization](configurationOverride.html). Here, we can also use this method to modify the default activation scheme.

The default activation configuration scheme is in the `default.yaml` file, we can modify it as follows:

```yaml
## 九宫格依赖于 rime_mint ，如果需要使用其他方案（比如: 小鹤双拼的 九宫格），可以使用 custom 文件覆写
schema_list:
  - schema: rime_mint            # 薄荷拼音
  - schema: double_pinyin_flypy  # 小鹤双拼
  - schema: rime_mint_flypy      # 薄荷拼音-小鹤混输方案
  - schema: terra_pinyin         # 地球拼音-薄荷定制
  - schema: wubi98_mint          # 五笔98-五笔小筑
  - schema: wubi86_jidian        # 五笔86-极点86
  - schema: t9                   # 仓九宫格-全拼输入
  # 以下方案薄荷进行了适配，但是没有激活
  # - schema: double_pinyin_abc    # 智能ABC双拼
  # - schema: double_pinyin_mspy   # 微软双拼
  # - schema: double_pinyin_sogou  # 搜狗双拼
  # - schema: double_pinyin_ziguang # 紫光双拼
  # - schema: double_pinyin         # 自然码双拼
```

Please note that the `schema` here is our scheme name, `rime_mint` actually represents the `rime_mint.schema.yaml` and `rime_mint.custom.yaml` in the outer directory. And `rime_mint.custom.yaml` has a higher priority than `rime_mint.schema.yaml`; this is why we recommend using `custom` files for overwriting.

Oh-my-rime's default configurations are all without `custom`, which makes it convenient for users to create and implement `custom`, thus not affecting subsequent synchronization and updates.

In fact, I do the same. I have been using Xiaohe Double Spelling recently, so I created the `double_pinyin_flypy.custom.yaml` file and overwrote the `double_pinyin_flypy.schema.yaml`:

![My own custom scheme](/image/guide/customConfigOfMineInDoubleFly.webp)

## Overwrite default file
Back to the topic. We can modify the default activation scheme by overwriting the `default.yaml` file.

Create a `default.custom.yaml` file, and overwrite the content of the `default.yaml` file in this file:

```yaml
# 注意，一个文件中只能有一个 patch
patch:
  schema_list:
    - schema: rime_mint            # 薄荷拼音
    - schema: double_pinyin_flypy  # 小鹤双拼
    - schema: rime_mint_flypy      # 薄荷拼音-小鹤混输方案
    - schema: terra_pinyin         # 地球拼音-薄荷定制
    - schema: wubi98_mint          # 五笔98-五笔小筑
    - schema: wubi86_jidian        # 五笔86-极点86
    - schema: t9                   # 仓九宫格-全拼输入
    # 激活下列输入方案
    - schema: double_pinyin_abc    # 智能ABC双拼
    - schema: double_pinyin_mspy   # 微软双拼
    - schema: double_pinyin_sogou  # 搜狗双拼
    - schema: double_pinyin_ziguang # 紫光双拼
    - schema: double_pinyin         # 自然码双拼
  menu:
    # 候选词个数
    page_size: 12
```

As you can see, we have overwritten `schema_list` in `patch`, and activated the `double_pinyin_abc`, `double_pinyin_mspy`, `double_pinyin_sogou`, `double_pinyin_ziguang` and `double_pinyin` schemes.

At the same time, we can also modify the `page_size` in `menu` to change the number of candidate words. This is convenient for displaying effects.

![Overwrite Configuration](/image/guide/overwriteDefaultResult.webp)

![Overwrite Configuration Effect](/image/guide/overwriteDefault.webp)