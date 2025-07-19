# 导入薄荷拼音
在前面的过程中，你已经了解如何安装Rime输入法了。

实际上，Rime输入法可以配置成任何输入法，比如： 闽南语输入法、吴语输入法、粤语输入法等等；你也可以简单配置一下输入按键的转义，比如：配置输入ABC，实际上是CBA、模糊拼音等。

但是，这一切对于一个新用户来说，可能比较复杂；在探索Rime的配置时候，建议使用他人配置好的模板，比如： 雾凇拼音。当然，也可以用本文的薄荷输入法（薄荷rime输入配置）。

安装的方法有两种：
- **手动覆盖安装配置文件**: 在 rime 客户端下载和安装好的情况下，手动下载薄荷配置文件，将配置文件移动到配置目录内，然后重新部署即可。
- 东风破安装薄荷配置: 适用于大部分的桌面端 rime 客户端，在配置了东风破的情况下，可以直接通过东风破一键导入薄荷配置方案。

本章节，主要介绍手动覆盖安装配置文件的方法。在文末介绍一下东风破的方法。

## 下载薄荷输入配置
薄荷输入配置是使用[GPL 3.0](https://github.com/Mintimate/oh-my-rime/blob/main/LICENSE)的开源项目，这意味着你可以看到它的一切源代码，并且自己定制和更改，但是请遵守开源协议，不得用于商用。

我们进入薄荷输入法（rime配置）的项目地址: 
- [薄荷输入配置 Github 地址: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)
- [薄荷输入配置 CNB 地址: https://cnb.cool/Mintimate/rime/oh-my-rime](https://cnb.cool/Mintimate/rime/oh-my-rime)

下载薄荷到本地：
![下载薄荷输入配置到本地](/image/guide/downloadMintPinyin.webp)

::: info 提示信息

如果你在 GitHub 上不知道下载那一个，或者下载过慢；那么可以使用薄荷提供的镜像下载（感谢 [CNB](https://cnb.cool) 提供的算力和存储支持；自动打包薄荷方案）
- [薄荷方案打包下载（ CNB 镜像）](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/oh-my-rime.zip)

:::

解压后，内部文件应该是这样的：
![解压后的内部文件](/image/guide/unzipMintPinyin.webp)


## 移动配置文件
当我们解压获得薄荷输入配置后，需要将配置文件移动到Rime的配置目录内。

默认的配置文件地址：
- macOS鼠须管: `$HOME/Library/Rime/`
- macOS Fcitx5: `$HOME/.local/share/fcitx5/rime`
- Windows小狼毫: `%APPDATA%/Rime`
- Linux ibus: `$HOME/.config/ibus/rime`
- Linux Fcitx5: `$HOME/.local/share/fcitx5/rime`
- Linux Fcitx5(Flatpak): `$HOME/.var/app/org.fcitx.Fcitx5/data/fcitx5`
- Android Fcitx(小企鹅): `/storage/emulated/0/Android/data/org.fcitx.fcitx5.android/files/data/rime/`

macOS鼠须管和Windows的小狼毫可以通过软件打开配置文件的地址，比如macOS：
![macOS通过设置打开配置文件](/image/guide/openConfigDirByApp.webp)

而对于Android的Fcitx小企鹅，你可以使用MT文件管理器打开配置文件的地址（你可以试试文件管理器搜索`fcitx.fcitx5`）：
![小企鹅通过MT文件管理器找到配置目录](/image/guide/fcitxAndroidSearchFile.webp)

::: info
图里是已经安装好薄荷输入法了，否则左侧的配置文件地址，应该是空文件夹。
:::

在打开配置文件地址后，我们将薄荷输入配置文件移动进入：
![薄荷输入配置移动到配置目录内](/image/guide/moveMintPinyinToConfigDir.webp)

## 部署薄荷输入配置
在上述完成后，我们进行rime的部署即可，比如：macOS上的鼠须管
![应用配置](/image/guide/applyConfig.webp)

同样，对于Android的Fcitx5小企鹅也有一些特殊，需要在任意一个可以输入的界面操作：
![小企鹅通的应用配置部署](/image/guide/fcitxAndroidDeploy.webp)

在部署完成后，即可使用薄荷输入配置（薄荷输入法）。

## ⭐东风破导入薄荷
如果你熟悉东风破的操作，可以直接通过东风破导入薄荷输入配置。东风破的前置条件：
- 已经安装好 Git，并且配置到环境变量内；

如果你是Windows用户，其实小狼毫已经自带一个半成品的东风破，你可以在小狼毫的`方案选单设定`中的`获取更多输入方案`内激活东风破：
![小狼毫的东风破](/image/guide/WeaselEmitPlum.webp)

之后，在这个界面内，输入薄荷的配方：
```text
Mintimate/oh-my-rime:plum/full
```

![小狼毫使用东风破安装薄荷方案](/image/guide/WindowsUsingPlum.webp)

需要注意，如果你的电脑没有配置Git，那么可能需要先输入`plum`，使其自动配置和下载Git后，激活完整版东风破：

![激活完整版东风破后安装薄荷方案](/image/guide/WindowsInstallFullPlum.webp)

> 参考: [Windows下使用东风破安装异常](https://github.com/Mintimate/oh-my-rime/issues/123)、[Plum Wiki: 安装与更新输入方案](https://github.com/rime/weasel/wiki/%E5%AE%89%E8%A3%85%E4%B8%8E%E6%9B%B4%E6%96%B0%E8%BE%93%E5%85%A5%E6%96%B9%E6%A1%88)

::: info 推荐🥳
这个在CMD窗口上显示系统配置的工具是什么呢？ 可以参考：[摸不透系统当前状态和配置？一条命令快速查看! NeoFetch和FastFetch使用详解](https://www.bilibili.com/video/BV1fHYLeSEr4/)
:::

如果你使用的是macOS或者Linux，你可以通过终端输入东风破的命令：
```bash
# 安装东风破，这将在当前目录下生成(clone)一个plum项目
curl -fsSL https://raw.githubusercontent.com/rime/plum/master/rime-install | bash
# 进入东风破的目录
cd plum
```

![Linux安装东风破](/image/guide/plumDir.webp)

在这个目录，输入薄荷的配方：
```bash
# 安装薄荷输入法（方案配置）
./rime-install Mintimate/oh-my-rime:plum/full
```

![Linu使用东风破安装薄荷输入法](/image/guide/LinuxUsingPlum.webp)

默认情况：
- macOS自动识别为鼠须管，也就是安装配置方案到`$HOME/Library/Rime/`。
- Linux自动识别为ibus，也就是安装配置方案到`$HOME/.config/ibus/rime`。

如果你的Linux使用Fcitx5，你可以通过`rime_frontend`参数或`rime_dir`指定安装配置文件的目录：
```bash
# 指定安装到Fcitx5的配置目录
rime_frontend=fcitx-rime bash rime-install Mintimate/oh-my-rime:plum/full
# 或者指定安装配置目录
rime_dir="$HOME/.config/fcitx/rime" bash rime-install Mintimate/oh-my-rime:plum/full
# 指定安装到Fcitx5
rime_dir="$HOME/.local/share/fcitx5/rime" bash rime-install Mintimate/oh-my-rime:plum/full
```

参考：
- [rime-plum](https://github.com/rime/plum)

## ⭐CLI导入和更新薄荷

为了方便不会使用 Git 的用户更新和安装薄荷，我们提供了 CLI 工具，可以一键安装和更新薄荷输入法。

![oh-my-rime-cli](/image/guide/oh-my-rime-cli.webp)

下载地址：

- [oh-my-rime-cli [Windows/Linux/MacOS]](https://cnb.cool/Mintimate/rime/oh-my-rime-cli/-/releases)

![oh-my-rime-cli](/image/guide/DownloadCli.webp)

项目源码: [oh-my-rime-cli](https://cnb.cool/Mintimate/rime/oh-my-rime-cli)

下载后，Linux 和 macOS 用户在 Terminal 内提权执行即可：
```bash
# 提权
chmod +x 「oh-my-rime-cli文件地址」
# 执行(假设文件在当前目录且文件名为oh-my-rime-cli)
./oh-my-rime-cli
```

至于 Windows 用户，双击运行即可。

::: warning 警告

因为我没有代码签名，所以文件可能会被杀毒软件误报，如果你遇到这种情况，可以尝试手动信任这个文件。

并且，认准 [oh-my-rime-cli 的项目地址](https://cnb.cool/Mintimate/rime/oh-my-rime-cli)，不要下载其他来源的文件。
:::

原理图:

```mermaid
flowchart TD
    A[🌟 启动程序 <br/> macOS/Linux使用终端<br/>Windows双击即可] --> B[🖥️ 检测操作系统]
    B --支持的操作系统--> C[📋 显示主菜单]
    B --不支持/检测失败--> I
    
    C --> D{"✨用户选择"}
    D -->|① 更新方案| E[💼 下载薄荷方案包]
    D -->|② 更新模型| F[🧠 下载万象模型]
    D -->|③ 更新词库| G[📚 下载薄荷方案包<br/>提取词库]
    D -->|④ 自定义| H[🔗 粘贴配置链接]
    D -->|⏹️ 退出| I[👋 结束程序]
    
    E --> J[📂 选择输入法目录<br/>「Linux 和 macOS 需要」]
    F --> J
    G --> J
    H --> J
    
    J --> K{🛠️ 更新类型}
    K -->|方案更新| L[📤 解压&替换方案包]
    K -->|模型替换| M[💾 替换模型文件]
    K -->|词库更新| N[🔄 更新词库]
    K -->|自定义| O{🔍 文件类型}
    
    O -->|📦 ZIP文件| L
    O -->|🧾 模型文件| M
    
    L --> P[✅ 更新成功！]
    M --> P
    N --> P
    
    P --> C

    style A fill:#7E57C2,stroke:#5E35B1,color:white,stroke-width:2px,stroke-dasharray:5
    style I fill:#EF5350,stroke:#D32F2F,color:white,stroke-width:2px
    style C fill:#42A5F5,stroke:#1976D2,color:white
    style D fill:#FFCA28,stroke:#FFA000,color:black,stroke-width:2px
    style E fill:#26A69A,stroke:#00897B
    style F fill:#5C6BC0,stroke:#3949AB
    style G fill:#29B6F6,stroke:#039BE5
    style H fill:#FF7043,stroke:#F4511E
    style J fill:#AB47BC,stroke:#8E24AA,color:white
    style K fill:#FFEE58,stroke:#FDD835,color:black
    style L fill:#66BB6A,stroke:#43A047,color:white
    style M fill:#5C6BC0,stroke:#3949AB,color:white
    style N fill:#29B6F6,stroke:#039BE5,color:white
    style O fill:#FFA726,stroke:#FB8C00,color:black
    style P fill:#66BB6A,stroke:#43A047,color:white,stroke-width:2px
    linkStyle default stroke:#90A4AE,stroke-width:2px
```