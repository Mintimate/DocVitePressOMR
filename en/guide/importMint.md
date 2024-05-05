# Importing Oh-My-Rime

In the previous steps, you have learned how to install the Rime input method.



In fact, Rime can be configured as any input method, such as Minnan language input method, Wu language input method, Cantonese input method, and so on. You can also configure key mappings, such as inputting "ABC" but getting "CBA" or fuzzy pinyin.

However, all of this might be a bit complex for a new user. When exploring Rime's configuration, it is recommended to use pre-configured templates created by others, such as "Wusong Pinyin" or the "Oh-My-Rime" introduced in this article.

## Downloading Oh-My-Rime

Oh-My-Rime is an open-source project that uses the [GPL 2.0](https://github.com/Mintimate/oh-my-rime/blob/main/LICENSE) license. This means you can access its source code and customize it according to your needs. However, please comply with the open-source license and do not use it for commercial purposes.

Let's go to the project page of Oh-My-Rime:

- [Oh-My-Rime GitHub Repository: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

Download Oh-My-Rime to your local machine:
![Download Oh-My-Rime](/image/guide/downloadMintPinyin.webp)

After extracting the downloaded file, the internal files should look like this:
![Internal files after extraction](/image/guide/unzipMintPinyin.webp)

## Moving the Configuration Files

Once we have extracted Oh-My-Rime, we need to move the configuration files to Rime's configuration directory.

The default configuration file locations are:

- For macOS with Squirrel: `~/Library/Rime/`
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
The picture shows that the Mint Input Method has been installed. Otherwise, the configuration file address on the left should be an empty folder.
:::

After opening the configuration directory, move the Oh-My-Rime configuration files into it:
![Move Oh-My-Rime to the configuration directory](/image/guide/moveMintPinyinToConfigDir.webp)

## Deploying Oh-My-Rime

After completing the above steps, we can deploy Rime, for example, on macOS with Squirrel:
![Apply configuration](/image/guide/applyConfig.webp)

Similarly,Fcitx5 For Android, there are some special features that need to be operated in any interface that can be entered:
![Fcitx5 For Android With Deploy](/image/guide/fcitxAndroidDeploy.webp)

Once the deployment is complete, you can start using Oh-My-Rime.