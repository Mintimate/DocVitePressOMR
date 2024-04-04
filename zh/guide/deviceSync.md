---
layout: doc
title: 多设备同步
head:
  - - meta
    - name: keywords
      content: Rime词典定制,Rime多端同步,Rime配置同步
      description: 在Rime输入法内，如何同步多端的配置呢？ 并且如何定制词典功能呢？ 可以查看本文学习如何进行定制词典内容和多端同步。
---

# 多设备同步
大部分基于Rime输入法框架的输入法，都是没有联网功能的；那么多设备的输入同步，如何设置呢？

你可以使用Rime输入法框架的同步功能。

## 配置同步

配置目录下的`installation.yaml`文件会在第一次部署后会自动生成；在这里可以编辑当前设备的`ID`和`同步目录`，如：
```yaml
distribution_code_name: Squirrel
distribution_name: "鼠鬚管"
distribution_version: 0.16.2
install_time: "Tue Aug  1 00:28:37 2023"
# 本机的 ID 标志，默认是一串 UUID
# 你可以自定义名字，方便生成的备份文件更优雅
installation_id: "c5f45f7e-3c1c-4257-8ff7-bce78e9b5fb5"
rime_version: 1.8.5
```
你可以追加一个`sync_dir`配置：
```yaml
distribution_code_name: Squirrel
distribution_name: "鼠鬚管"
distribution_version: 0.16.2
install_time: "Tue Aug  1 00:28:37 2023"
# 本机的 ID 标志，默认是一串 UUID
# 你可以自定义名字，方便生成的备份文件更优雅
installation_id: "Macbook-M2Max"
# 不设置，默认是当前配置目录下的 `sync/`
sync_dir: "/Users/mintimate/Documents/rimeSync"
rime_version: 1.8.5
```

之后进行同步，生成词库和用户配置：
![生成同步文件](/image/guide/rimeSync.webp)

完成同步的操作后，在同步目录下生成的`*.userdb.txt`，里面都是输入过的内容。

同步目录里还有其他一些没用的文件，Rime 额外单向备份了配置目录下的`YAML`和`TXT`文件，但只有根目录的，像薄荷输入法内`dicts`文件夹里的词库、以及lua脚本就没有被同步过来。

> ⚠️ Windows 用户注意 YAML 语法，反斜杠在双引号中转义，在单引号中不转义：

```yaml
sync_dir: "c:\\file\\path\\sync"
```
或者:
```yaml 
sync_dir: 'c:\file\path\sync'
```


## 同步目录设置
将所有平台的`sync_dir`设定为同一个目录，比如： iCloud、Dropbox、OneDrive的目录。

多个设备在这个目录中会生成并列的文件夹，里面是用户词典。

PC-1 里点【同步】，通过网盘同步到 PC-2，PC-2 再点同步，才可以获得 PC-1 输入过的内容。
> 注意： `installation_id`设置为不一样的ID，你可以PC-1里面设置为`PC-1`，PC-2里面设置为`PC-2`。


## 用户词典迁移

> 本目录感谢[@H-Tung](https://github.com/H-Tung)的建议[issue: 用户词典迁移部分说明存在偏误](https://github.com/Mintimate/DocVitePressOMR/issues/5)

用户词典，就是平时我们使用输入方案时候，产生的自定义词。 通常在配置方案内的`*.userdb`文件夹内。

如果之前在用别的方案，如: `pinyin_simp`或`luna_pinyin`；这样如果没有其他设置，会有用户词典`pinyin_simp.userdb.txt`或`luna_pinyin.userdb.txt`，我们如何迁移到`rime_mint.userdb.txt`里呢？

以下使用旧有的`luna.userdb.txt`到`rime_mint.userdb.txt`为例。

### 替换迁移

替换迁移，也就是不存在`rime_mint.userdb.txt`这个文件，`rime_mint`方案是全新的配置。我们把旧的`luna`方案对应的用户词典`luna.userdb.txt`完全迁移到`rime_mint.userdb.txt`。 

可以进行以下操作：
- 将之前的`luna_pinyin.userdb.txt`放到同步目录；
- 命名为`rime_mint.userdb.txt`；
- 修改文件里面的`#@/db_name`为`rime_mint`；
- 点击之后同步就可以了。

![替换迁移同步](/image/guide/syncDevice_ChangeUserdbName.webp)

如果之前用的是繁体词库，还需要提前做一个简繁转换，注意不要把`Tab`全转为空格了。

简单的方法，比如通过macOS自动的服务: `打开➡️全选➡️左上角Code➡️服务➡️将文本转换为简体中文`，参考: [在 Mac 上转换中文或拉丁字符 - 官方 Apple 支持 (中国)](https://support.apple.com/zh-cn/guide/chinese-input-method/mchlp2865/104/mac/14.0)

或者用opencc：
```shell
opencc -c t2s -i in.txt -o out.txt
```

### 同步迁移

同步迁移，也就是用rime的同步机制进行迁移。适用于，已经有`rime_mint.userdb.txt`文件，想把`luna.userdb.txt`融合进`rime_mint.userdb.txt`文件内。

这个时候，我们就需要利用rime的同步机制了。我们使用数据同步，生成的文件和配置可能是这样的：

![替换迁移同步](/image/guide/sysncDevice_demo.webp)


内部的文件结构(缩略)：
```text
sync
├── Hamster
│   ├── luna.userdb.txt
│   └── rime_mint.userdb.txt
└── MacbookPro-M2Max
    ├── luna.userdb.txt
    └── rime_mint.userdb.txt
```

如何把`luna.userdb.txt`合并到`rime_mint.userdb.txt`呢？

很简单，在`sync`文件夹下，新建一个`temp`文件夹，把并把`luna.userdb.txt`更名为`rime_mint.userdb.txt`(文件里面的`#@/db_name`改为`rime_mint`)。这样合并时 Rime 会认为这是另一个设备上的词库将其合并过来。

如果把`MacbookPro-M2Max`计为**B**，`temp`计为**A**；同步的逻辑：
|新词库|旧词库|是否能够合并|
|:---|:---|:---:|
|`sync\A\A.userdb.txt`|`sync\B\A.userdb.txt`|✅|
|`sync\A\A.userdb.txt`|`sync\A.userdb.txt`  |❎|
|`sync\A\A.userdb.txt`|`sync\B\B.userdb.txt`|❎|
|`sync\A\A.userdb.txt`|`sync\A\B.userdb.txt`|❎|

参考自: [https://github.com/Mintimate/DocVitePressOMR/issues/5#issuecomment-1999136683](https://github.com/Mintimate/DocVitePressOMR/issues/5#issuecomment-1999136683)

## 软链接词库同步

我们已经知道，Rime的同步用户数据，只是同步一些个性化配置和用户词典，词库并没有同步。

一些用户，同时使用仓输入法(Hamster)和鼠须管(Squirrel)，并且仓输入法是使用 iCloud 同步，也就是 iCloud 内 Hamster 应用数据内上`RIME/Rime`文件夹：

![iCloud同步文件夹](/image/guide/syncWithCloudHamster.webp)

理论上，如果这文件夹里有的文件，会在部署的时候，替换掉本地的文件。

> 即: 你使用Wi-Fi上传方案配置到 iPhone 内置存储内，仓输入法内进行Rime的**重新部署**，仓输入法会把 iCloud 内同名文件替换掉本地的文件，没有的文件则使用本地。

那么，如果想仓输入法和鼠须管词库，可以使用软链接的方式，把仓输入法的配置，软链接到鼠须管Rime的配置文件夹内，这样就可以使用 iCloud 上传 仓输入法的词典，并且在鼠须管部署时候，同步参与编译。

::: info 为什么使用仓输入法软链接鼠须管?
iCloud 同步的时候，对于 ln 软链接的替身文件，是不会进行同步的；所以需要把仓输入法iCloud的文件夹，软链接到鼠须管的配置文件夹内。
:::

![软链接需要同步](/image/guide/HamsterSyncConfigPathAndSquirrelRimePath.webp)

举个例子，我们想把词库同步了，那么只需要：

```shell
# 重命名原有的词库文件夹（ln-s 会自动创建软链接）
## 当前Terminal在鼠须管的配置文件夹内
mv dicts dictsBackup
# 创建软链接
ln -s "/Users/mintimate/Library/Mobile Documents/iCloud~dev~fuxiao~app~hamsterapp/Documents/RIME/Rime/dicts" "/Users/mintimate/Library/Rime/dicts"
```

![软链接同步词库](/image/guide/lnSyncDict.webp)



