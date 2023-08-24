# Importing Oh-My-Rime

In the previous steps, you have learned how to install the Rime input method.

<div class="wwads-cn wwads-horizontal" data-id="266" ></div>

In fact, Rime can be configured as any input method, such as Minnan language input method, Wu language input method, Cantonese input method, and so on. You can also configure key mappings, such as inputting "ABC" but getting "CBA" or fuzzy pinyin.

However, all of this might be a bit complex for a new user. When exploring Rime's configuration, it is recommended to use pre-configured templates created by others, such as "Wusong Pinyin" or the "Oh-My-Rime" introduced in this article.

## Downloading Oh-My-Rime

Oh-My-Rime is an open-source project that uses the [GPL 2.0](https://github.com/Mintimate/oh-my-rime/blob/main/LICENSE) license. This means you can access its source code and customize it according to your needs. However, please comply with the open-source license and do not use it for commercial purposes.

Let's go to the project page of Oh-My-Rime:

- [Oh-My-Rime GitHub Repository: https://github.com/Mintimate/oh-my-rime](https://github.com/Mintimate/oh-my-rime)

Download Oh-My-Rime to your local machine:
![Download Oh-My-Rime](<>)

After extracting the downloaded file, the internal files should look like this:
![Internal files after extraction](<>)

## Moving the Configuration Files

Once we have extracted Oh-My-Rime, we need to move the configuration files to Rime's configuration directory.

The default configuration file locations are:

- For macOS with Squirrel: `~/Library/Rime/`
- For Windows with Weasel: `%APPDATA%/Rime`
- For Linux with ibus: `~/.config/ibus/rime`
- For Linux with Fcitx5: `~/.local/share/fcitx5/rime`

Additionally, on macOS with Squirrel and Windows with Weasel, you can open the configuration directory using software. For example, on macOS:
![Open configuration directory using settings](<>)

After opening the configuration directory, move the Oh-My-Rime configuration files into it:
![Move Oh-My-Rime to the configuration directory](<>)

## Deploying Oh-My-Rime

After completing the above steps, we can deploy Rime, for example, on macOS with Squirrel:
![Apply configuration](<>)

Once the deployment is complete, you can start using Oh-My-Rime.