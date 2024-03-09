---
layout: doc
title: 多设备同步
head:
  - - meta
    - name: keywords
      content: Rime词典定制,Rime多端同步,Rime配置同步
      description: 在Rime输入法内，如何同步多端的配置呢？ 并且如何定制词典功能呢？ 可以查看本文学习如何进行定制词典内容和多端同步。
---
# Multi-device synchronization
Most input methods based on the Rime input method framework do not have networking capabilities; how to set up input synchronization for so many devices?

You can use the synchronization feature of the Rime input method framework.

## 配置同步

The `installation.yaml` file in the configuration directory will be automatically generated after the first deployment; here you can edit the `ID` and `synchronization directory` of the current device, such as:
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
You can append a `sync_dir` configuration:
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

Then synchronize and generate thesaurus and user configuration:
![Generate sync file](/image/guide/rimeSync.webp)

After completing the synchronization operation, the `*.userdb.txt` generated in the synchronization directory contains the entered content.

There are some other useless files in the synchronization directory. Rime additionally backs up the `YAML` and `TXT` files in the configuration directory, but only the ones in the root directory, such as the words in the `dicts` folder in the Mint input method. Libraries and lua scripts are not synchronized.

> ⚠️ Windows users note YAML syntax, backslashes are escaped in double quotes and not escaped in single quotes:

```yaml
sync_dir: "c:\\file\\path\\sync"
```
或者:
```yaml 
sync_dir: 'c:\file\path\sync'
```


## Synchronize directory settings
Set the `sync_dir` of all platforms to the same directory, such as the directories of iCloud, Dropbox, and OneDrive.

Multiple devices will generate parallel folders in this directory, which contain user dictionaries.

Click [Synchronize] on PC-1 to synchronize to PC-2 through the network disk. PC-2 clicks Sync again to obtain the content input by PC-1.
> Note: `installation_id` is set to different IDs. You can set it to `PC-1` in PC-1 and `PC-2` in PC-2.


## User dictionary migration
If you were using other solutions before, such as: `pinyin_simp` or `luna_pinyin`.

You can perform the following operations:
- Put the previous `pinyin_simp.userdb.txt` or `luna_pinyin[_simp].userdb.txt` into the synchronization directory;
- Named `custom_dict.userdb.txt`;
- Modify #@/db_name in the file to `custom_dict`;
- Just click and sync.

If you used a Traditional Chinese dictionary before, you need to do a conversion from Simplified Chinese to Traditional Chinese in advance. Be careful not to convert all `Tab` to spaces.

Simple methods, such as opening through VSCode ➡️Select all ➡️Code in the upper left corner ➡️Service ➡️Convert text to Simplified Chinese`.

Or use opencc:
```shell
opencc -c t2s -i in.txt -o out.txt
```