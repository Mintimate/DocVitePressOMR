---
layout: doc
title: 安装rime输入法
aside: true
---
# Installing Rime Input Keyboard
Now let's introduce how to install the Rime input keyboard.

It is highly recommended to follow along with the video（Chinese Only)：
- [跨平台、无隐私追踪的开源输入法Rime定制指南: 聪明的输入法懂我心意!](https://www.bilibili.com/video/BV12M411T7gf)

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

## ibus Version
The ibus version is easy:
```bash
sudo apt install ibus-rime
```
Then restart or logout/login the current user session and add ibus in the system.

## fcitx5 Version
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

Finally, set the fcitx5 environment by adding:
```bash
# GTK based programs use fcitx5 input method engine
export GTK_IM_MODULE=fcitx5
# Qt based programs use fcitx5 input method engine
export QT_IM_MODULE=fcitx5
# X system level input method, set to fcitx5 for all X programs 
export XMODIFIERS=@im=fcitx5
```

重启系统，打开fcitx5即可使用。
