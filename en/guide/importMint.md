# Importing Oh-My-Rime

In the previous steps, you have learned how to install the Rime input method.

In fact, Rime can be configured as any input method, such as Minnan language input method, Wu language input method, Cantonese input method, and so on. You can also configure key mappings, such as inputting "ABC" but getting "CBA" or fuzzy pinyin.

However, all of this might be a bit complex for a new user. When exploring Rime's configuration, it is recommended to use pre-configured templates created by others, such as "Wusong Pinyin" or the "Oh-My-Rime" introduced in this article.

There are two methods for installing:
- **Manual override installation of configuration files**: After downloading and installing the Rime client, manually download the Oh-my-rime configuration files, move them to the configuration directory, and then redeploy.
- Installation of Oh-my-rime configuration via Dongfeng Po: Suitable for most desktop Rime clients, with Dongfeng Po configured, you can directly import the Oh-my-rime configuration scheme with one click.

This section mainly introduces the method of manually overriding and installing configuration files. The method using Dongfeng Po will be introduced at the end of the document.

## Downloading Oh-My-Rime

Oh-My-Rime is an open-source project that uses the [GPL 3.0](https://github.com/Mintimate/oh-my-rime/blob/main/LICENSE) license. This means you can access its source code and customize it according to your needs. However, please comply with the open-source license and do not use it for commercial purposes.

Let's go to the project page of Oh-My-Rime:

- [Oh-My-Rime GitHub Repository: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)
- [Oh-My-Rime CNB Repository: https://cnb.cool/Mintimate/rime/oh-my-rime](https://cnb.cool/Mintimate/rime/oh-my-rime)

Download Oh-My-Rime to your local machine:
![Download Oh-My-Rime](/image/guide/downloadMintPinyin.webp)

::: info Notification

If you're unsure which file to download on GitHub, or the download speed is too slow; you can use the mirror download provided by Oh-my-rime (thanks to [CNB](https://cnb.cool) for computing power and storage support; automatically packaged Mintimate configuration):
- [Oh-my-Rime Configuration Package （CNB Mirror）](https://cnb.cool/Mintimate/rime/oh-my-rime/-/releases/download/latest/oh-my-rime.zip)

:::

After extracting the downloaded file, the internal files should look like this:
![Internal files after extraction](/image/guide/unzipMintPinyin.webp)

## Moving the Configuration Files

Once we have extracted Oh-My-Rime, we need to move the configuration files to Rime's configuration directory.

The default configuration file locations are:

- For macOS with Squirrel: `~/Library/Rime/`
- For macOS Fcitx5: `~/.local/share/fcitx5/rime`
- For Windows with Weasel: `%APPDATA%/Rime`
- For Linux with ibus: `~/.config/ibus/rime`
- For Linux with Fcitx5: `~/.local/share/fcitx5/rime`
- For Linux with Fcitx5(Flatpak): `~/.var/app/org.fcitx.Fcitx5/data/fcitx5`
- Android Fcitx(Fcitx5 For Android): `/storage/emulated/0/Android/data/org.fcitx.fcitx5.android/files/data/rime/`

Additionally, on macOS with Squirrel and Windows with Weasel, you can open the configuration directory using software. For example, on macOS:
![Open configuration directory using settings](/image/guide/openConfigDirByApp.webp)

For Fcitx Little Penguin on Android, you can use the MT file manager to open the address of the configuration file (you can try searching for `fcitx.fcitx5` in the file manager):
![Finds the configuration directory through MT file manager](/image/guide/fcitxAndroidSearchFile.webp)

::: info
The picture shows that the Oh-my-rime Input Method has been installed. Otherwise, the configuration file address on the left should be an empty folder.
:::

After opening the configuration directory, move the Oh-My-Rime configuration files into it:
![Move Oh-My-Rime to the configuration directory](/image/guide/moveMintPinyinToConfigDir.webp)

## Deploying Oh-My-Rime

After completing the above steps, we can deploy Rime, for example, on macOS with Squirrel:
![Apply configuration](/image/guide/applyConfig.webp)

Similarly,Fcitx5 For Android, there are some special features that need to be operated in any interface that can be entered:
![Fcitx5 For Android With Deploy](/image/guide/fcitxAndroidDeploy.webp)

Once the deployment is complete, you can start using Oh-My-Rime.

## ⭐Oh-my-rime with Plum
If you are familiar with Plum, you can directly import the Oh-my-rime input configuration through it. The prerequisites for using Plum are:
- Git is already installed and configured in the environment variables.

For Windows users, Weasel actually comes with a semi-finished version of Plum. You can activate Plum in Weasel's `Scheme Menu Settings` under `Get More Input Schemes`:
![Plum in Weasel](/image/guide/WeaselEmitPlum.webp)

After that, enter the Oh-my-rime recipe in this interface:
```text
Mintimate/oh-my-rime:plum/full
```

![Installing Oh-my-rime scheme with Plum in Weasel](/image/guide/WindowsUsingPlum.webp)

Note that if Git is not configured on your computer, you may need to enter plum first, which will automatically configure and download Git before activating the full version of Plum.

![Activate the full version of Plum and then install the Oh-my-rime scheme](/image/guide/WindowsInstallFullPlum.webp)

> References: [Windows下使用东风破安装异常](https://github.com/Mintimate/oh-my-rime/issues/123)、[Plum Wiki: 安装与更新输入方案](https://github.com/rime/weasel/wiki/%E5%AE%89%E8%A3%85%E4%B8%8E%E6%9B%B4%E6%96%B0%E8%BE%93%E5%85%A5%E6%96%B9%E6%A1%88)

::: info Guide🥳
What is the tool that displays system configuration in the Terminal? Here：[摸不透系统当前状态和配置？一条命令快速查看! NeoFetch和FastFetch使用详解](https://www.bilibili.com/video/BV1fHYLeSEr4/)
:::

If you are using macOS or Linux, you can enter the Plum command in the terminal:
```bash
# Install Plum, this will clone a plum project in the current directory
curl -fsSL https://raw.githubusercontent.com/rime/plum/master/rime-install | bash
# Enter the Plum directory
cd plum
```

![Linux install plum](/image/guide/plumDir.webp)

In this directory, enter the Oh-my-rime recipe:
```bash
# Install the Oh-my-rime input method (scheme configuration)
./rime-install Mintimate/oh-my-rime:plum/full
```

![Linu install oh-my-rime by plum](/image/guide/LinuxUsingPlum.webp)

By default:
- macOS is automatically recognized as Squirrel, which means installing the configuration scheme to `~/Library/Rime/`.
- Linux is automatically recognized as ibus, which means installing the configuration scheme to `~/.config/ibus/rime`.

If your Linux uses Fcitx5, you can specify the installation directory for the configuration files with the `rime_frontend` parameter or `rime_dir`:
```bash
# Specify installation to the Fcitx configuration directory
rime_frontend=fcitx-rime bash rime-install Mintimate/oh-my-rime:plum/full
# Or specify the installation configuration directory
rime_dir="$HOME/.config/fcitx/rime" bash rime-install Mintimate/oh-my-rime:plum/full
# Specify installation to the Fcitx5 configuration directory(macOS)
rime_dir="$HOME/.local/share/fcitx5/rime" bash rime-install Mintimate/oh-my-rime:plum/full
```

Reference:
- [rime-plum](https://github.com/rime/plum)

## ⭐CLI Import and Update Oh-My-Rime

To facilitate users who do not use Git to install and update oh-my-rime, we provide a CLI tool that can install and update oh-my-rime in one click.

![oh-my-rime-cli](/image/guide/oh-my-rime-cli.webp)

Download address:

- [oh-my-rime-cli [Windows/Linux/MacOS]](https://cnb.cool/Mintimate/rime/oh-my-rime-cli/-/releases)

![oh-my-rime-cli](/image/guide/DownloadCli.webp)

Project source: [oh-my-rime-cli](https://cnb.cool/Mintimate/rime/oh-my-rime-cli)

On Linux and macOS, you can execute the following command in the terminal after granting execution permissions:
```bash
# Grant execution permissions
chmod +x oh-my-rime-cli
# Execute (assuming the file is in the current directory and the file name is oh-my-rime-cli)
./oh-my-rime-cli
```

For Windows users, double-click to run.

![Windows install oh-my-rime-cli](/image/guide/WindowsInstallCli.webp)

::: warning Warning

Because I haven't signed my code, the file may be reported by the antivirus software. If you encounter this situation, you can try manually trusting this file.

Also, make sure to use the [official oh-my-rime-cli project address](https://cnb.cool/Mintimate/rime/oh-my-rime-cli), and do not download files from other sources.

:::