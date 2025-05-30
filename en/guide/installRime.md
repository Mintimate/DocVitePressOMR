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

### Squirrel Version

#### Installing Squirrel
On macOS, install Squirrel to use Bopomofo or other input method configurations later. Go to the [Squirrel repository](https://github.com/rime/squirrel) and download Squirrel:

![Download Squirrel](/image/guide/downloadSquirrel.webp)

::: info Notification

If you cannot access GitHub, or the download speed is too slow; you can use the mirror download provided by Oh-my-rime (thanks to [CNB](https://cnb.cool) for computing power and storage support; automatically syncs with the latest Squirrel input method package):
- [Squirrel Input Method Package (Mirrored from GitHub Release)](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/Squirrel-latest.pkg)

:::

Then decompress and open it. You may get an error saying it can't be opened:
![Failed to open](/image/guide/macOS_FailOpen.webp)

This is because Squirrel is not certified by Apple, so verification will fail. Don't worry, just go to System Preferences, select Open Anyway:
![Open Anyway](/image/guide/macOS_Security.webp)

Finally the install screen will appear. Follow the prompts to install.

![Install Squirrel](/image/guide/macOS_InstallSquirrel.webp)

Note that after installing, you need to restart macOS or relogin to take effect.

#### Activating Squirrel
Now reenter the system. Squirrel can already be used. Go to System Preferences -> Keyboard -> Text and add Squirrel.
![Activate Squirrel](/image/guide/enableSquirrel.webp)

The Squirrel icon in the menu bar means Rime is installed successfully. You can now move on to importing and activating Bopomofo in the next section.

### Fcitx5 Version

Indeed, Fcitx5, originally only available on Linux, can now be used on macOS as well:
- [Fcitx5 macOS Little Penguin Input Method](https://fcitx-contrib.github.io/)

#### Installing Fcitx5
The installation process is straightforward. Download the [Rime version of Fcitx5 macOS](https://github.com/fcitx-contrib/fcitx5-macos-installer/releases/download/latest/Fcitx5-Rime.zip) from the official website, unzip it, and you will get the installer package:

![Download and unzip to get the installer package](/image/guide/unzipFcitxMacOS.webp)

At this point, similar to Squirrel, double-clicking may not open it:
![Double-clicking does not open](/image/guide/warningFcitx5MacOS.webp)

Like Squirrel, the signature of Fcitx5 is not certified by Apple (this is an open-source project, and Apple's certification requires a fee), so we need to open the system settings and choose to open it anyway:

![Choose to open Fcitx5 anyway](/image/guide/makeSureToOpenFcitx5.webp)

Then, we can see the Fcitx5 installation interface, follow the prompts to install:

![Fcitx5 installation interface](/image/guide/enterPasswordToInstallFcitx5.webp)

Finally, after successful installation, the input method is automatically added to the system:

![Fcitx5 installation complete](/image/guide/enableFcitx5MacOS.webp)

#### Activating Fcitx5

After installation, we need to activate Fcitx5. Open system settings -> Text input -> Edit and add Fcitx5:

![Add Fcitx5 input method](/image/guide/enableFcitx5MacOS1.webp)

The effect after adding:

![Adding Fcitx5 input method complete](/image/guide/enableFcitx5MacOS2.webp)

At this point, the status bar can be switched to the little penguin:

![Status bar switched to little penguin Fcitx5](/image/guide/enterPasswordToInstallFcitx5.webp)

Rime has been successfully installed, and you can proceed to the next section to import and activate Mint Pinyin.

## Installing Rime on Windows
To install Rime on Windows, use the Weasel input keyboard.


### Installing Weasel
On Windows, install Weasel to use Mint Pinyin or other configurations later. Go to the [Weasel repository](https://github.com/rime/weasel) and download the Weasel installer:

![Download Weasel](/image/guide/downloadWeasel.webp)

::: info Notification

If you cannot access GitHub, or the download speed is too slow; you can use the mirror download provided by Oh-my-rime (thanks to [CNB](https://cnb.cool) for computing power and storage support; automatically syncs with the latest Weasel input method package):
- [Weasel Input Method Installer (Mirrored from GitHub Release)](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/weasel-installer-latest.exe)

:::

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

If you encounter issues with using the Oh-my-rime's configuration, you can reinstall ibus using the [Appimage](https://github.com/hchunhui/ibus-rime.AppImage) method.

### fcitx5 Version
The fcitx5 version is slightly more complex (ibus is still more common):
```bash
sudo apt install fcitx5 fcitx5-chinese-addons librime-plugin-lua
```
Where:
- fcitx5: Input method framework core package
- fcitx5-chinese-addons: Chinese language extension package, provides Chinese input engines

Installing only fcitx5 can work, but doesn't allow Chinese input. To use fcitx5 for Chinese, also need the fcitx5-chinese-addons extension. These two packages need to be installed together for full Chinese input support in Debian.

Then install the fcitx5 Rime input keyboard:
```bash
sudo apt install fcitx5-rime
```

"`librime-plugin-lua` might also be `librime-lua`. However, if your `librime` version is relatively low, you may not be able to use all the features of the Mint configuration, or you may not be able to use the Oh-my-rime's configuration at all. Refer to: [Linux Mint configuration not working?](faQ.html#linux%E8%96%84%E8%8D%B7%E9%85%8D%E7%BD%AE%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8)

At this point, you need to compile and install `librime` and `Fcitx5`; or you can use a third-party software store, such as: [Flatpak](https://flatpak.org/)"

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

The selected text translates to:

### fcitx5 Version (Flatpak)
If your Linux distribution supports [Flatpak](https://flatpak.org/setup/), you can use Flatpak to install Fcitx5. In fact, almost all Linux distributions support Flatpak, but some distributions do not have Flatpak installed by default. You can check the [official documentation](https://flatpak.org/setup/) to install Flatpak.

For example: on Debian 11, install Flatpak:
```bash
# Install Flatpak
sudo apt install flatpak
# The system uses the Gnome desktop environment, install the Gnome-Software Flatpak plugin
sudo apt install gnome-software-plugin-flatpak
```

![Installing flatpak on Debian](/image/guide/installFlatpakManage.webp)

The Flatpak version of fcitx5-rime is personally maintained by the author of Fcitx5, and fcitx5-rime includes the librime-lua dependency, which can avoid some dependency issues.

```bash
# If flatpak is slow, you can use the source: https://mirror.sjtu.edu.cn/docs/flathub
# Install Fcitx5
flatpak install flathub org.fcitx.Fcitx5
# Install Fcitx5 Rime plugin
flatpak install flathub org.fcitx.Fcitx5.Addon.Rime
```
![Installing Fcitx5 with flatpak](/image/guide/installFcitx5ByFlatpak.webp)

At the same time, the configuration file for Fcitx5 installed with flathub is located at `~/.var/app/org.fcitx.Fcitx5/data/fcitx5`.

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