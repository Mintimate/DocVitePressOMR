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