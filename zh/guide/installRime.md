---
layout: doc
title: 安装rime输入法
aside: true
---
# 安装rime输入法
现在，我们来介绍如何安装rime输入法。
强烈建议配合视频进行操作：
- [跨平台、无隐私追踪的开源输入法Rime定制指南: 聪明的输入法懂我心意!](https://www.bilibili.com/video/BV12M411T7gf)



## macOS安装rime
正如前文所说的，macOS上的rime框架输入法，可以使用鼠须管。

### 安装鼠须管
在macOS上安装鼠须管以便后续使用薄荷拼音或者其他输入法配置。进入[鼠须管的仓库地址](https://github.com/rime/squirrel)，我们下载鼠须管：

![下载鼠须管](/image/guide/downloadSquirrel.webp)

之后，我们解压并打开；可能会无法打开：
![无法打开](/image/guide/macOS_FailOpen.webp)

因为Squirrel的签名并没有得到Apple的认证，所以校验是无法通过的。不用担心，这个时候，我们需要打开系统的设置，选择打开即可：
![仍要打开](/image/guide/macOS_Security.webp)

最后会出现安装界面，按提示进行安装即可：
![安装界面](/image/guide/macOS_InstallSquirrel.webp)

需要注意，安装后，需要重启macOS或者注销当前的登录状态重新登录系统。

### 激活鼠须管
现在，我们重新进入系统；其实就已经可以使用鼠须管了，打开系统设置 -> 文字输入 -> 编辑并添加鼠须管;
![激活鼠须管](/image/guide/enableSquirrel.webp)

之后，状态栏就可以看到Squirrel的图标了，代表Rime已经安装成功，可以进入下一个章节，进行薄荷拼音的导入与激活。

## Windows安装rime
Windows上安装rime，可以使用小狼毫输入法。

### 安装小狼毫
在Windows上安装小狼毫以便后续使用薄荷拼音或者其他输入法配置。进入[小狼毫的仓库地址](https://github.com/rime/weasel)，我们下载小狼毫安装包：

![下载小狼毫](/image/guide/downloadWeasel.webp)

之后，我们解压并打开，按着提示安装即可。

需要注意这一步，配置文件地址，就是后期我们导入薄荷拼音的地址；用户可以选择自己喜欢的文档目录内进行安放。

![设置小狼毫的默认配置地址](/image/guide/configPathWeasel.webp)

### 激活小狼毫
Windows激活小狼毫，其实就是添加一个输入法：

![添加新的输入法](/image/guide/addToSystemWindows1.webp)

![添加的结果](/image/guide/addToSystemWindows2.webp)

到此，Windows上的rime输入法就准备完成了。

## Linux安装rime
Linux上安装Rime的方法也很多，主要分为两个方法：
- ibus框架实现的rime输入法
- fcitx5框架实现的rime输入法

在安装前，建议更新`librime`的依赖包，Debian11和Debian12目前`apt`使用的`librime`版本过低，建议升级，否则可能造成`Lua`脚本无法使用的情况。

每个人的Linux环境不一样，需要安装的配置也不一样。这里以Linux Kali发行版本（基于Debian 11，使用Gnome桌面环境）为例，分别进行演示。

### ibus版本
使用ibus版本很简单：
```bash
sudo apt install ibus-rime
```

之后，重启或者注销当前用户对话；在系统内添加ibus即可。

### fcitx5版本
如果使用fcitx5版本，操作会相对复杂一点（目前还是ibus比较多点）：
```bash
sudo apt install fcitx5 fcitx5-chinese-addons
```
其中：
- fcitx5: 输入法框架核心包
- fcitx5-chinese-addons: 汉语言扩展包,提供中文输入法引擎

- 只安装fcitx5是可以用,但不能输入中文。想要用fcitx5来输入中文,还需再安装fcitx5-chinese-addons扩展包。这两个包需要一起安装,才能完整地在Debian中使用fcitx5中文输入法。

之后，安装fcitx5的rime输入法：
```bash
sudo apt install fcitx5-rime
```

![安装Fcitx5](/image/guide/installFcitx5.webp)

最后，设置一下fcitx5的环境，将下列内容添加到环境变量内：
```bash
# 基于 GTK 的程序使用 fcitx5 作为输入法引擎
export GTK_IM_MODULE=fcitx5
# 基于 Qt 的程序使用 fcitx5 作为输入法引擎
export QT_IM_MODULE=fcitx5
# X系统层面的输入法设置,设置为 fcitx5,使所有 X 程序都使用 fcitx5
export XMODIFIERS=@im=fcitx5
```

重启系统或注销系统：
![注销系统](/image/guide/logOutInKali.webp)

打开fcitx5：

![打开Fcitx5](/image/guide/openFcitx5.webp)

在状态栏上找到Fcitx5的选项，进行打开：
![打开Fcitx5的配置](/image/guide/FcitxConfig.webp)

选择Rime输入法进行激活：
![在Fcitx5内添加Rime](/image/guide/openFcitx5ConfigInBar.webp)

## iOS安装rime

在iOS上，推荐使用:
- [仓输入法: https://apps.apple.com/cn/app/仓输入法/id6446617683](https://apps.apple.com/cn/app/%E4%BB%93%E8%BE%93%E5%85%A5%E6%B3%95/id6446617683)

非常好用( ◔ ڼ ◔ )


## Android安装rime

在Android上，推荐使用：
- [Fcitx For Android: https://fcitx5-android.github.io/installation/](https://fcitx5-android.github.io/installation/)

### Fcitx Android

Fcitx For Android，也就是小企鹅输入法，在多个商店平台都有分发。这里以GitHub Release上面的正式版本为例。 

在[GitHub releases](https://github.com/fcitx5-android/fcitx5-android/releases)下载对应架构的应用本体(app)和插件(plugin.rime)，并安装：

![选择本体和插件](/image/guide/fcitxAndroidApk.webp)

::: tip
原则上，现在的手机选择`arm64-v8a`版本架构；虚拟机选择`x86_64`或`x86`架构；一些比较旧的手机，选择`armeabi-v7a`。

:::

以0.0.8版本为例，在桌面仅有一个“小企鹅输入法5”图标，自带拼音输入法，用起来也不错；但是，要安装插件后，才可以选择Rime的输入法：

![Android安装Fcitx小企鹅](/image/guide/fcitxAndroidInstallRime.webp)

小企鹅输入法的配置也有点特殊，在接下来的章节，我们进行解释。