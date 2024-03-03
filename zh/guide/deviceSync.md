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
如果之前在用别的方案，如: `pinyin_simp`或`luna_pinyin`。

可以进行一下操作：
- 将之前的`pinyin_simp.userdb.txt`或 `luna_pinyin[_simp].userdb.txt`放到同步目录；
- 命名为`custom_dict.userdb.txt`；
- 修改文件里面的 #@/db_name 为`custom_dict`；
- 点击之后同步就可以了。

如果之前用的是繁体词库，还需要提前做一个简繁转换，注意不要把`Tab`全转为空格了。

简单的方法，比如通过VSCode`打开➡️全选➡️左上角Code➡️服务➡️将文本转换为简体中文`。

或者用opencc：
```shell
opencc -c t2s -i in.txt -o out.txt
