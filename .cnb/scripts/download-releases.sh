#!/bin/bash
# 下载上游客户端并设置输出变量

# 下载 weasel .exe 文件
weasel_url=$(curl -sL -H "Authorization: Bearer ${GIT_PUBLIC_ACCESS_TOKEN}" \
  https://api.github.com/repos/rime/weasel/releases/latest | grep -Eo 'https://[^"]+\.exe' | head -1)
weasel_file=$(basename "$weasel_url")
curl -LO "$weasel_url"
mv "$weasel_file" weasel-installer-latest.exe
echo "##[set-output weasel_file=$weasel_file]"

# 下载 squirrel .pkg 文件
squirrel_url=$(curl -sL -H "Authorization: Bearer ${GIT_PUBLIC_ACCESS_TOKEN}" \
  https://api.github.com/repos/rime/squirrel/releases/latest | grep -Eo 'https://[^"]+\.pkg' | head -1)
squirrel_file=$(basename "$squirrel_url")
curl -LO "$squirrel_url"
mv "$squirrel_file" Squirrel-latest.pkg
echo "##[set-output squirrel_file=$squirrel_file]"

# 下载 fcitx5-macOS installer
fctix5_macOS_url=$(curl -sL -H "Authorization: Bearer ${GIT_PUBLIC_ACCESS_TOKEN}" \
  https://api.github.com/repos/fcitx-contrib/fcitx5-macos-installer/releases/latest | grep -Eo 'https://[^"]+Rime.zip' | head -1)
fctix5_macOS_file=$(basename "$fctix5_macOS_url")
curl -LO "$fctix5_macOS_url"
echo "##[set-output fctix5_macOS_file=$fctix5_macOS_file]"

# 下载万象语言模型
wanxiang_url=$(curl -sL -H "Authorization: Bearer ${GIT_PUBLIC_ACCESS_TOKEN}" \
  https://api.github.com/repos/amzxyz/RIME-LMDG/releases/tags/LTS | grep -Eo 'https://[^"]+\.gram' | head -1)
wanxiang_file=$(basename "$wanxiang_url")
curl -LO "$wanxiang_url"
echo "##[set-output wanxiang_file=$wanxiang_file]"
