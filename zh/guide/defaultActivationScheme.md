---
layout: doc
title: 自定义默认激活方案
head:
  - - meta
    - name: keywords
      content: rime默认激活方案,薄荷输入法开启双拼,rime默认方案配置
description: 在薄荷输入方案中，如何自定义默认的激活方案呢？如何激活紫光双拼、搜狗双拼、自然码双拼等内容呢？。
---

# 默认激活方案
 默认激活方案，指的是什么？其实就是我们薄荷输入方案的默认方案。
 
在薄荷输入法中，我们默认激活的是薄荷全拼、小鹤双拼、全拼小鹤混合输入和五笔98、五笔86，以及适用于 iOS仓输入法 的九键布局T9。

可以看到，激活的方案以及很多了。但是，这样有两种情况：
- 一种是，我们不需要这么多的方案，只需要激活一个或者两个方案；
- 另一种是，我们需要激活其他的方案，比如紫光双拼、搜狗双拼、自然码双拼等等。

通常情况，激活的方案越多，重新部署，Rime 需要编译的时间就越长；虽然 Rime 大部分情况下是增量更新，但是如果触发全量，或者修改部分操作需要删除build文件夹重新部署，

这样就会导致重新编译的时间很长。而且，很多人有其他的使用习惯，比如：紫光双拼、搜狗双拼、自然码双拼等等。

并且，薄荷方案，自<Badge type="tip">[Commit 4b558f21cb](https://github.com/Mintimate/oh-my-rime/commit/4b558f21cb946e96e11cce51c68c8a16e5676877)</Badge>开始适配紫光双拼、搜狗双拼、自然码双拼等的，只是默认没有激活而已。
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
接下来，我们就看看如何修改默认的激活方案。如果一些小伙伴，使用虎码等形码，想自行添加在薄荷里，也可以参考这个方法，进行修改。

## default.yaml文件
我们在[配置覆写和定制](configurationOverride.html)中，讲到了配置覆写，这里我们也可以使用这个方法，来修改默认激活方案。

默认激活的配置方案就在`default.yaml`文件中，我们可以在这个文件中：
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

需要注意，这里的`schema`就是我们的方案名称，`rime_mint`实际上就是代表外层目录的`rime_mint.schema.yaml`和`rime_mint.custom.yaml`。并且`rime_mint.custom.yaml`优先级高于`rime_mint.schema.yaml`；这也是为什么，我们推荐使用`custom`文件进行覆写。

薄荷默认的配置都是不带`custom`的，方便用户自己创建和实现`custom`，进而不影响后续同步和更新。

事实上，我自己也是这样做的，我最近使用的是小鹤双拼，所以我自己创建了`double_pinyin_flypy.custom.yaml`文件，对`double_pinyin_flypy.schema.yaml`进行了覆写：

![我自己的定制方案](/image/guide/customConfigOfMineInDoubleFly.webp)

## 覆写default文件
回到正题。 我们可以通过覆写`default.yaml`文件，来修改默认激活方案。

创建`default.custom.yaml`文件，然后在这个文件中，覆写`default.yaml`文件中的内容：
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

可以看到，我们在`patch`中，覆写了`schema_list`，激活了`double_pinyin_abc`、`double_pinyin_mspy`、`double_pinyin_sogou`、`double_pinyin_ziguang`和`double_pinyin`这几个方案。

同时，我们也可以修改`menu`中的`page_size`，来修改候选词的个数。方便展示效果。

![覆写配置](/image/guide/overwriteDefaultResult.webp)

![覆写配置效果](/image/guide/overwriteDefault.webp)
