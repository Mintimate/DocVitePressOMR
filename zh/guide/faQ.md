---
layout: doc
title: 问题答疑
head:
  - - meta
    - name: keywords
      content: Rime 常见问题,Rime解惑,Rime问题答疑
description: 在Rime内，一些常见的问题解惑
---
# 问题答疑

本章节，将补全一些Rime的常见问题。

## WinXP和Win7使用薄荷输入法
Windows XP和Windows 7只支持小狼毫的`0.14.3`版本：
- [https://github.com/rime/weasel/releases/tag/0.14.3](https://github.com/rime/weasel/releases/tag/0.14.3)

从`0.15`开始，小狼毫的最低Windows版本为Windows 8。

这样就有一个问题，`0.14.3`版本自带的librime(Rime核心库)，版本比较低；对Lua脚本的支持不是很好，导致无法发挥出薄荷输入法的全部功能（雾凇等使用Lua脚本的配置也是一样的）。

最好的解决方法肯定是升级操作系统，但是很多情况下，我们的操作系统可能是Windows Server、堡垒机、跳板机等等情况，升级不是很方便。这里有一个差强人意的解决方法：
- 手动升级librime支援库: [https://github.com/rime/librime/releases](https://github.com/rime/librime/releases)

![手动下载librime支援库](/image/guide/downloadRimeDll.webp)

解压后的内部文件：
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

打开我们的小狼毫的输入法的安装目录：

![小狼毫的安装目录](/image/guide/openWeaselRootPath.webp)

之后，我们关闭小狼毫的服务。 备份小狼毫的安装目录的`rime.dll`，移动刚刚下载和解压文件中的`dist/lib/rime.dll`进入其中。 

最后，重新启动小狼毫的服务；重新部署即可。 


需要注意，根据[librime 1.9.0](https://github.com/rime/librime/releases/tag/1.9.0)的升级描述之一：
- [8b7bdbe](https://github.com/rime/librime/commit/8b7bdbe115f8e903bbd6210f32066ac6c1760d6a): drop BOOST_USE_CXX11; fix 2 cmake warnings ([#694](https://github.com/rime/librime/pull/694)) (Qijia Liu) [#694](https://github.com/rime/librime/pull/694)

> 2023.09.16 发布的librime 1.9.0版本开始，不再支持Windows XP。
> > 所以，如果你想通过本方法手动更新小狼毫的依赖库，那么只能用[librime 1.8.5](https://github.com/rime/librime/releases/tag/1.8.5)了；好消息是，1.8.5目前可以正常使用薄荷输入法的全部功能。

## macOS如何移除自带的ABC

有些小伙伴，想只使用鼠须管作为输入法，移除macOS自带的ABC输入法的干扰。其实很简单，修改`com.apple.HIToolbox.plist`文件即可：
```text
# 打开com.apple.HIToolbox.plist文件
sudo open ~/Library/Preferences/com.apple.HIToolbox.plist
```

依次点开`Root -> AppleEnabledInputSources`，会看到一列`item`，找到其中`KeyboardLayout Name`为 ABC 的那一列，将整列`item`删掉，然后`command + S`保存。

![删除自带的ABC输入](/image/guide/removeABC.webp)

接着重启电脑，打开键盘设置，就可以看到系统自带的 ABC 输入法已经被删掉了。

> 如果想添加回来，那么在系统设置内添加即可。