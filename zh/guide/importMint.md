# 导入薄荷拼音
在前面的过程中，你已经了解如何安装Rime输入法了。

实际上，Rime输入法可以配置成任何输入法，比如： 闽南语输入法、吴语输入法、粤语输入法等等；你也可以简单配置一下输入按键的转义，比如：配置输入ABC，实际上是CBA、模糊拼音等。

但是，这一切对于一个新用户来说，可能比较复杂；在探索Rime的配置时候，建议使用他人配置好的模板，比如： 雾凇拼音。当然，也可以用本文的薄荷拼音。

## 下载薄荷拼音
薄荷拼音是使用[GPL 2.0](https://github.com/Mintimate/oh-my-rime/blob/main/LICENSE)的开源项目，这意味着你可以看到它的一切源代码，并且自己定制和更改，但是请遵守开源协议，不得用于商用。

我们进入薄荷拼音的项目地址: 
- [薄荷拼音Github地址: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

下载薄荷拼到本地：
![下载薄荷拼音到本地](/image/guide/downloadMintPinyin.webp)

解压后，内部文件应该是这样的：
![解压后的内部文件](/image/guide/unzipMintPinyin.webp)


## 移动配置文件
当我们解压获得薄荷拼音后，需要将配置文件移动到Rime的配置目录内。

默认的配置文件地址：
- macOS鼠须管: `~/Library/Rime/`
- Windows小狼毫: `%APPDATA%/Rime`
- Linux ibus: `~/.config/ibus/rime`
- Linux Fcitx5: `~/.local/share/fcitx5/rime`
- Linux Fcitx5(Flatpak): `~/.var/app/org.fcitx.Fcitx5/data/fcitx5`
- Android Fcitx(小企鹅): `/storage/emulated/0/Android/data/org.fcitx.fcitx5.android/files/data/rime/`

macOS鼠须管和Windows的小狼毫可以通过软件打开配置文件的地址，比如macOS：
![macOS通过设置打开配置文件](/image/guide/openConfigDirByApp.webp)

而对于Android的Fcitx小企鹅，你可以使用MT文件管理器打开配置文件的地址（你可以试试文件管理器搜索`fcitx.fcitx5`）：
![小企鹅通过MT文件管理器找到配置目录](/image/guide/fcitxAndroidSearchFile.webp)

::: info
图里是已经安装好薄荷输入法了，否则左侧的配置文件地址，应该是空文件夹。
:::

在打开配置文件地址后，我们将薄荷拼音的配置文件移动进入：
![薄荷拼音移动到配置目录内](/image/guide/moveMintPinyinToConfigDir.webp)

## 部署薄荷拼音
在上述完成后，我们进行rime的部署即可，比如：macOS上的鼠须管
![应用配置](/image/guide/applyConfig.webp)

同样，对于Android的Fcitx5小企鹅也有一些特殊，需要在任意一个可以输入的界面操作：
![小企鹅通的应用配置部署](/image/guide/fcitxAndroidDeploy.webp)

在部署完成后，即可使用薄荷拼音。