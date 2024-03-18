---
layout: doc
title: Multi-device synchronization
head:
  - - meta
    - name: keywords
      content: Rime dictionary customization, Rime multi-terminal synchronization, Rime configuration synchronization
      description: How to synchronize the configuration of multiple terminals in Rime input method? And how to customize the dictionary function? You can check this article to learn how to customize dictionary content and multi-end synchronization.
---

# Multi-device synchronization
Most Rime-based input methods do not have built-in online synchronization capabilities. So how can you synchronize input across multiple devices?

You can use the sync feature of the Rime input method framework.

## Configuration Sync

The installation.yaml file in the configuration directory is automatically generated after the initial deployment. You can edit the ID and sync_dir (sync directory) for the current device, for example:

```yaml
distribution_code_name: Squirrel
distribution_name: "鼠鬚管"
distribution_version: 0.16.2
install_time: "Tue Aug  1 00:28:37 2023"
# The ID flag of the local machine, which is a UUID by default
# You can customize the name for more elegant backup filenames
installation_id: "c5f45f7e-3c1c-4257-8ff7-bce78e9b5fb5"
rime_version: 1.8.5
```

You can append a `sync_dir` configuration:
```yaml
distribution_code_name: Squirrel
distribution_name: "鼠鬚管"
distribution_version: 0.16.2
install_time: "Tue Aug  1 00:28:37 2023"
# The ID flag of the local machine, which is a UUID by default
# You can customize the name for more elegant backup filenames
installation_id: "Macbook-M2Max"
# If not set, the default is `sync/` in the current configuration directory
sync_dir: "/Users/mintimate/Documents/rimeSync"
rime_version: 1.8.5
```

After configuring the sync directory, generate the user dictionary and user configuration

![Generate sync file](/image/guide/rimeSync.webp)

After completing the synchronization operation, the `*.userdb.txt` generated in the synchronization directory contains the entered content.

There are some other useless files in the synchronization directory. Rime additionally backs up the `YAML` and `TXT` files in the configuration directory, but only the ones in the root directory, such as the words in the `dicts` folder in the Mint input method. Libraries and lua scripts are not synchronized.

> ⚠️ Windows users note YAML syntax, backslashes are escaped in double quotes and not escaped in single quotes:

```yaml
sync_dir: "c:\\file\\path\\sync"
```
Or:
```yaml 
sync_dir: 'c:\file\path\sync'
```
## Synchronize directory settings
Set the `sync_dir` of all platforms to the same directory, such as the directories of iCloud, Dropbox, and OneDrive.

Multiple devices will generate parallel folders in this directory, which contain user dictionaries.

Click [Synchronize] on PC-1 to synchronize to PC-2 through the network disk. PC-2 clicks Sync again to obtain the content input by PC-1.
> Note: `installation_id` is set to different IDs. You can set it to `PC-1` in PC-1 and `PC-2` in PC-2.


## User dictionary migration

> This directory thanks [@H-Tung](https://github.com/H-Tung) for his suggestion [issue: 用户词典迁移部分说明存在偏误](https://github.com/Mintimate/DocVitePressOMR/issues/5)

The user dictionary is the custom words generated when we usually use the input scheme. Usually in the `*.userdb` folder within the configuration scheme.

If you were using other solutions before, such as: `pinyin_simp` or `luna_pinyin`; if there are no other settings, there will be a user dictionary `pinyin_simp.userdb.txt` or `luna_pinyin.userdb.txt`. How do we migrate to `rime_mint What about .userdb.txt`?

The following uses the old `luna.userdb.txt` to `rime_mint.userdb.txt` as an example.

### Replace migration

Replacement migration, that is, the file `rime_mint.userdb.txt` does not exist, and the `rime_mint` solution is a completely new configuration. We completely migrated the user dictionary `luna.userdb.txt` corresponding to the old `luna` solution to `rime_mint.userdb.txt`.

The following operations are possible:
- Put the previous `luna_pinyin.userdb.txt` into the synchronization directory;
- Named `rime_mint.userdb.txt`;
- Modify `#@/db_name` in the file to `rime_mint`;
- Just click and sync.

![Replace migration synchronization](/image/guide/syncDevice_ChangeUserdbName.webp)

If you used a Traditional Chinese dictionary before, you need to do a conversion from Simplified Chinese to Traditional Chinese in advance. Be careful not to convert all `Tab` to spaces.

Simple methods, such as through macOS automatic service: `Open ➡️Select All ➡️Code in the upper left corner ➡️Service ➡️Convert text to Simplified Chinese`, reference: [Convert Chinese or Latin characters on Mac - Official Apple Support (China)] (https://support.apple.com/zh-cn/guide/chinese-input-method/mchlp2865/104/mac/14.0)

Or use opencc:
```shell
opencc -c t2s -i in.txt -o out.txt
```

### Synchronous migration

Synchronous migration, that is, using rime's synchronization mechanism for migration. Applicable to those who already have the `rime_mint.userdb.txt` file and want to merge `luna.userdb.txt` into the `rime_mint.userdb.txt` file.

At this time, we need to use the synchronization mechanism of rime. We use data synchronization, and the generated files and configuration may look like this:

![Replace migration synchronization](/image/guide/sysncDevice_demo.webp)

Internal file structure (abbreviated):
```text
sync
├── Hamster
│ ├── luna.userdb.txt
│ └── rime_mint.userdb.txt
└──MacbookPro-M2Max
    ├── luna.userdb.txt
    └── rime_mint.userdb.txt
```

How to merge `luna.userdb.txt` into `rime_mint.userdb.txt`?

It's very simple. Create a new `temp` folder under the `sync` folder, and rename `luna.userdb.txt` to `rime_mint.userdb.txt` (change the `#@/db_name` in the file to `rime_mint`). When merging in this way, Rime will think that this is a dictionary on another device and merge it over.

If `MacbookPro-M2Max` is counted as **B**, `temp` is counted as **A**; synchronization logic:
|New thesaurus|Old thesaurus|Can it be merged|
|:---|:---|:---:|
|`sync\A\A.userdb.txt`|`sync\B\A.userdb.txt`|✅|
|`sync\A\A.userdb.txt`|`sync\A.userdb.txt` |❎|
|`sync\A\A.userdb.txt`|`sync\B\B.userdb.txt`|❎|
|`sync\A\A.userdb.txt`|`sync\A\B.userdb.txt`|❎|

Reference from: [https://github.com/Mintimate/DocVitePressOMR/issues/5#issuecomment-1999136683](https://github.com/Mintimate/DocVitePressOMR/issues/5#issuecomment-1999136683)