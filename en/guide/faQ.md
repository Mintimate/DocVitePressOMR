---
layout: doc
title: Q&A
head:
  - - meta
    - name: keywords
      content: Rime FAQ, Rime answers, Rime questions and answers
description: Answers to some common questions in Rime
---
# Q&A

This chapter will complete some common questions about Rime.

## WinXP and Win7 use Mint input method
Windows XP and Windows 7 only support the `0.14.3` version of Weasel:
- [https://github.com/rime/weasel/releases/tag/0.14.3](https://github.com/rime/weasel/releases/tag/0.14.3)

Starting from `0.15`, the minimum Windows version of Weasel is Windows 8.

The version of librime (Rime core library) that comes with the `0.14.3` version is relatively low, Lua scripts is not very good at the version. 

Due to the inability to fully utilize the functions of the Mint input method, which includes Lua scripting configuration (similar to Rime and other input methods), as a consequence, certain limitations arise.

The optimal solution is to upgrade the operating system. However, in many cases, the operating system may be Windows Server, a bastion machine, a springboard machine, etc., making upgrades inconvenient. Here is a less than satisfactory solution:
- Manually upgrade the librime support library: [https://github.com/rime/librime/releases](https://github.com/rime/librime/releases)

![Manually download the librime support library](/image/guide/downloadRimeDll.webp)

Unzipped internal files:
```txt
.
├── dist
│    ├── bin
│    │    ├── rime_deployer.exe
│    │    ├── rime_dict_manager.exe
│    │    ├── rime_patch.exe
│    │    └── rime_table_decompiler.exe
│    ├── include
│    │    ├── rime_api.h
│    │    └── rime_levers_api.h
│    ├── lib
│    │    ├── rime.dll  # 关键支援文件
│    │    └── rime.lib
│    └── share
│        └── cmake
│            └── rime
│                └── RimeConfig.cmake
└── version-info.txt

```

Open the installation directory of our Weasel input method:

![Weasel installation directory](/image/guide/openWeaselRootPath.webp)

After that, we shut down Weasel’s service. Back up `rime.dll` in Weasel's installation directory, and move `dist/lib/rime.dll` in the file you just downloaded and unzipped into it.

Finally, restart Weasel's service; redeploy it.


It should be noted that according to one of the upgrade descriptions of [librime 1.9.0](https://github.com/rime/librime/releases/tag/1.9.0):
- [8b7bdbe](https://github.com/rime/librime/commit/8b7bdbe115f8e903bbd6210f32066ac6c1760d6a): drop BOOST_USE_CXX11; fix 2 cmake warnings ([#694](https://github.com/rime/librime/pull/694 )) (Qijia Liu) [#694](https://github.com/rime/librime/pull/694)

> Starting from the librime 1.9.0 version released on 2023.09.16, Windows XP is no longer supported.
> > So, if you want to manually update Weasel's dependent libraries through this method, you can only use [librime 1.8.5](https://github.com/rime/librime/releases/tag/1.8.5) ;The good news is that 1.8.5 can currently use all the functions of the Mint input method normally.

## How to remove the built-in ABC in macOS

Some friends want to use Whisker only as the input method to remove the interference of the ABC input method that comes with macOS. It's actually very simple, just modify the `com.apple.HIToolbox.plist` file:
```text
# Open the com.apple.HIToolbox.plist file
sudo open ~/Library/Preferences/com.apple.HIToolbox.plist
```

Click on `Root -> AppleEnabledInputSources` in order, you will see a column of `item`, find the column where `KeyboardLayout Name` is ABC, delete the entire `item` column, and then `command + S` to save.

![Delete the built-in ABC input](/image/guide/removeABC.webp)

Then restart the computer, open the keyboard settings, and you can see that the ABC input method that comes with the system has been deleted.

> If you want to add it back, just add it in the system settings.

## How to Delete Custom Words
You can delete custom words, or reduce the weight of existing words in the dictionary (return to the original weight, not the lowest).
- Squirrel uses Fn + ⇧ + ⌫
- Weasel uses Ctrl/Shift + Del

Effect:
![Delete custom words](/image/guide/deleteSelfWord.gif)

If you want to permanently delete a word that exists in the **dictionary**, you can only edit the dictionary and redeploy.

## Oh-my-rime Not Working on Linux?

Using Rime input method on Linux requires reliance on an input method framework, such as: iBus and Fcitx. At this time, in conjunction with the Rime plugin and Oh-my-rime input method configuration, sometimes it is found to be unusable.

Possible situations:
- You can input English, but you cannot input Chinese, or the English of the input method is always in the follow-up, no candidate words appear, and there is no upper screen.
- Unable to switch input methods, or after switching input methods, unable to input Chinese.
- Chinese candidate words appear, but each candidate word will appear a combination character prompt, similar to the "Earth Pinyin" prompt.

![cannot input Chinese](/image/guide/cantInputWithoutEnglish1.webp)

![Appear combination character prompt](/image/guide/cantInputWithoutEnglish2.webp)

The above problems are all caused by the outdated librime of Linux. Especially, the version of librime in the apt source of Ubuntu is too low to support the new Lua script introduction method in the Oh-my-rime input method. And some Lua acts on `filter`, causing input failure.

At present, there are several solutions:
- Wait for the system source to update the librime version.
- Use third-party sources. Reference: [ibus-rime.AppImage](https://github.com/hchunhui/ibus-rime.AppImage)、[Fcitx5 With Flatpak](installRime.html#fcitx5-version-flatpak).
- Compile the librime、librme-lua and ibus-rime. Reference: [Linux上手动编译安装librime、librime-lua以及ibus-rime](https://www.mintimate.cn/2024/07/13/rimeLinuxMakeIbus/).
- Modify the Oh-my-rime configuration to use the old version of Lua.

Here is how to roll back the Oh-my-rime input method configuration to use the old version of Lua, refer to this commit: [18e0ae7aa5](https://github.com/Mintimate/oh-my-rime/commit/18e0ae7aa52773d8dd7e15a4ad15a8c91bc9e6d9)

For example, we observe the `Oh-my-rime full spelling input file (rime_mint.schema.yaml)`, and find the Lua fragment in it:
```yaml
engine:
  processors:
    - lua_processor@*select_character              # Select character by word
    - lua_processor@*codeLengthLimit_processor     # Use Lua to limit the maximum length of input (to prevent it from being too long and stuck)
  translators:
    - lua_translator@*mint_date_time_translator          # Time, date, week, month
    - lua_translator@*number_translator                  # Amount in words
    - lua_translator@*chineseLunarCalendar_translator    # Lunar calendar
  filters:
    - lua_filter@*corrector_filter            # Mispronunciation and misspelling prompts
    - lua_filter@*autocap_filter              # Automatic capitalization of English
```

![The Lua import style in high version of librime](/image/guide/newStyleOfRime.webp)

Each `lua` script filename is preceded by a `*`; this is the optional writing method of the high version librime. We need to change it to the low version writing method.

First modify the `rime.lua` file:
```lua
-- Register lua script
-- Format: require("script file name"), no suffix needed
select_character = require("select_character")
number_translator = require("number_translator")
reduce_english_filter = require("reduce_english_filter")
mint_date_time_translator = require("mint_date_time_translator")
corrector_filter = require("corrector_filter")
codeLengthLimit_processor = require("codeLengthLimit_processor")
chineseLunarCalendar_translator = require("chineseLunarCalendar_translator")
auxCode_filter = require("auxCode_filter")
autocap_filter = require("autocap_filter")
```

Then, remove the `*` in the `processors`, `filters` and `translators` in `rime_mint.schema.yaml`. 

The same is true for other input schemes.

It is recommended to use the `custom` file to override the `schema`, rather than directly modifying `*.schema.yaml`.


## User Dictionary Phonetic Transcription

Initially, oh-my-rime used dictionaries without phonetic marks, like this:
```yaml
你	ni	19
好	hao	6
```

Later it switched to Wanxiang-style dictionaries with phonetic marks, like this:
```yaml
你	nǐ	19  
好	hǎo	6
```

User dictionaries created from this will also contain phonetic marks. So if you're migrating from another schema or using an older version of oh-my-rime, you might encounter phonetic transcription issues.

Theoretically, **this doesn't affect word frequency ordering (dynamic frequency adjustment remains unaffected)**. However, if you want to use real-time phonetic mark display, **words from user dictionaries might fail to display phonetic marks**.

![Phonetic mark display reference](/image/guide/pinyinWithToneMark.webp)

Solution: Rewrite the user dictionary to add phonetic marks. Follow these steps:
1. Sync the user dictionary once to create a backup folder.
2. Use oh-my-rime's precompiled executable ([Open source download](https://cnb.cool/Mintimate/rime/rime-userdb-maker/-/releases/latest)) to rewrite the user dictionary.
3. Replace the backup folder.
4. Delete the `*.userdb` folders in the user directory.
5. Sync the user dictionary again.

```mermaid
flowchart LR
    A([🔄 Sync user dictionary once]) --> B[📝 Rewrite with oh-my-rime executable]
    B --> C[📂 Replace backup folder]
    C --> D[🗑️ Delete *.userdb folders]
    D --> E([✅ Sync user dictionary again])
    
    classDef start fill:#ff9ff3,stroke:#f368e0,stroke-width:3px,color:#fff,font-weight:bold,rx:15,ry:15;
    classDef step fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff,rx:10,ry=10;
    classDef finish fill:#55efc4,stroke:#00b894,stroke-width:3px,color:#2d3436,font-weight:bold,rx:15,ry=15;
    
    class A start;
    class B,C,D step;
    class E finish;
    
    linkStyle 0 stroke:#f368e0,stroke-width:3px,stroke-dasharray:5 5;
    linkStyle 1 stroke:#0984e3,stroke-width:2px;
    linkStyle 2 stroke:#0984e3,stroke-width:2px;
    linkStyle 3 stroke:#00b894,stroke-width:3px,stroke-dasharray:5 5;
```

For Windows, after downloading rime-dict-processor-windows-x64.zip and extracting rime-dict-processor.exe, execute in CMD/Powershell:
```cmd
# In CMD
rime-dict-processor.exe -i "C:\Users\Username\AppData\Roaming\Rime\syncData" -o "C:\Users\Username\AppData\Roaming\Rime\syncData"
# In Powershell
./rime-dict-processor.exe -i "C:\Users\Username\AppData\Roaming\Rime\syncData" -o "C:\Users\Username\AppData\Roaming\Rime\syncData"
```

![Rewriting user dictionary](/image/guide/refreshUserdb.webp)

## Setting Weasel Candidates to Horizontal Layout

In Squirrel, you can configure horizontal candidate layout by adding this to `squirrel.custom.yaml`:

```yaml
patch:
  "style/text_orientation": horizontal  # Candidate arrangement direction (horizontal for horizontal, vertical for vertical)
```

For Weasel, the configuration in `weasel.custom.yaml` might not work. In this case, you can configure it like this in `weasel.custom.yaml`:
```yaml
patch:
  "style/horizontal": true
```