---
layout: doc
title: 安装rime输入法
aside: true
---
# Installing Rime Input Keyboard
Now let's introduce how to install the Rime input keyboard.

It is highly recommended to follow along with the video（Chinese Only)：
- [跨平台、无隐私追踪的开源输入法Rime定制指南: 聪明的输入法懂我心意!](https://www.bilibili.com/video/BV12M411T7gf)
<iframe class="bilibili" src="//player.bilibili.com/player.html?aid=527165106&bvid=BV12M411T7gf&cid=1086974146&p=1&high_quality=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"  sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"> </iframe>

- [Android和iOS如何使用开源输入法中州韵(RIME)? 使用薄荷输入法配置模板快速初始化RIME！](https://www.bilibili.com/video/BV1Mr42137Ns)

## Installing Rime on macOS
As mentioned before, the Rime framework input keyboard on macOS can use Squirrel.

### Installing Squirrel
On macOS, install Squirrel to use Bopomofo or other input method configurations later. Go to the [Squirrel repository](https://github.com/rime/squirrel) and download Squirrel:

![Download Squirrel](/image/guide/downloadSquirrel.webp)

Then decompress and open it. You may get an error saying it can't be opened:
![Failed to open](/image/guide/macOS_FailOpen.webp)

This is because Squirrel is not certified by Apple, so verification will fail. Don't worry, just go to System Preferences, select Open Anyway:
![Open Anyway](/image/guide/macOS_Security.webp)

Finally the install screen will appear. Follow the prompts to install.

![Install Squirrel](/image/guide/macOS_InstallSquirrel.webp)

Note that after installing, you need to restart macOS or relogin to take effect.

### Activating Squirrel
Now reenter the system. Squirrel can already be used. Go to System Preferences -> Keyboard -> Text and add Squirrel.
![Activate Squirrel](/image/guide/enableSquirrel.webp)

The Squirrel icon in the menu bar means Rime is installed successfully. You can now move on to importing and activating Bopomofo in the next section.

## Installing Rime on Windows
To install Rime on Windows, use the Weasel input keyboard.


### Installing Weasel
On Windows, install Weasel to use Mint Pinyin or other configurations later. Go to the [Weasel repository](https://github.com/rime/weasel) and download the Weasel installer:

![Download Weasel](/image/guide/downloadWeasel.webp)

Then decompress and open it. Follow the prompts to install.

Note the configuration file path here, as this is where we will import Bopomofo later. Users can choose their preferred document folder.

![Set default config path for Weasel](/image/guide/configPathWeasel.webp)

### Activating Weasel
To activate Weasel on Windows, just add it as an input keyboard:

![Add new input method](/image/guide/addToSystemWindows1.webp)

![Added result](/image/guide/addToSystemWindows2.webp)

Now Rime is ready on Windows.

## Installing Rime on Linux
There are many ways to install Rime on Linux, mainly:
- Rime input keyboard based on ibus framework
- Rime input keyboard based on fcitx5 framework

Before installing, it is recommended to update the `librime` dependencies. The `librime` version in apt for Debian 11 and 12 is too low. Upgrading is recommended, otherwise Lua scripts may not work.

Since Linux environments differ, required configurations also differ. Here we demonstrate installation on Kali Linux (based on Debian 11, using Gnome desktop) as an example.

### ibus Version
The ibus version is easy:
```bash
sudo apt install ibus-rime
```
Then restart or logout/login the current user session and add ibus in the system.

### fcitx5 Version
The fcitx5 version is slightly more complex (ibus is still more common):
```bash
sudo apt install fcitx5 fcitx5-chinese-addons
```
Where:
- fcitx5: Input method framework core package
- fcitx5-chinese-addons: Chinese language extension package, provides Chinese input engines

Installing only fcitx5 can work, but doesn't allow Chinese input. To use fcitx5 for Chinese, also need the fcitx5-chinese-addons extension. These two packages need to be installed together for full Chinese input support in Debian.


Then install the fcitx5 Rime input keyboard:

```bash
sudo apt install fcitx5-rime
```

![Install Fcitx5](/image/guide/installFcitx5.webp)

Finally, set the fcitx5 environment by adding:
```bash
# GTK based programs use fcitx5 input method engine
export GTK_IM_MODULE=fcitx5
# Qt based programs use fcitx5 input method engine
export QT_IM_MODULE=fcitx5
# X system level input method, set to fcitx5 for all X programs 
export XMODIFIERS=@im=fcitx5
```

Restart or log out of the system:

![Log out of the system](/image/guide/logOutInKali.webp)

Open fcitx5:

![Open Fcitx5](/image/guide/openFcitx5.webp)

Find the Fcitx5 options in the status bar and open them:

![Open Fcitx5 configuration](/image/guide/FcitxConfig.webp)

Select Rime input method to activate:

![Add Rime in Fcitx5](/image/guide/openFcitx5ConfigInBar.webp)

## iOS installation rime

On iOS, we recommend using:

- [Hamster Input Method: https://apps.apple.com/cn/app/仓输入法/id6446617683](https://apps.apple.com/cn/app/%E4%BB%93%E8%BE%93%E5%85%A5%E6%B3%95/id6446617683)

It is very user-friendly ( ◔ ڼ ◔ )

## Android installation rime

On Android, it is recommended to use:
- [Fcitx For Android: https://fcitx5-android.github.io/installation/](https://fcitx5-android.github.io/installation/)

### Fcitx Android

Fcitx For Android, It is distributed on multiple commercial platforms. Here, we'll take the official version on GitHub Release as an example

Download the application (app) and the Rime plugin (plugin.rime) for the corresponding architecture from [GitHub releases](https://github.com/fcitx5-android/fcitx5-android/releases), and install them.

![Select the ontology and plug-ins](/image/guide/fcitxAndroidApk.webp)

::: tip
In principle, current smartphones should choose the arm64-v8a architecture version. For virtual machines, choose the x86_64 or x86 architectures. For some older smartphones, choose the armeabi-v7a architecture.

:::

Taking version 0.0.8 as an example, there is only one "Little Penguin Input Method 5" icon on the desktop, which comes with Pinyin input method, which is good to use; however, you need to install a plug-in before you can choose Rime's input method:

![Android installation Fcitx little penguin](/image/guide/fcitxAndroidInstallRime.webp)

The configuration of the Little Penguin input method is also a bit special. In the next chapter, we will explain it.