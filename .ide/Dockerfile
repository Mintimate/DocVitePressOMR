# 帮助文档地址: https://docs.cnb.cool/zh/vscode/quick-start.html
FROM node:18

# 设置软件源
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

# 以及按需安装其他软件
# RUN apt-get update && apt-get install -y git

# 安装 code-server 和 vscode 常用插件
RUN curl -fsSL https://code-server.dev/install.sh | sh \
  && code-server --install-extension redhat.vscode-yaml \
  && code-server --install-extension eamodio.gitlens \
  && code-server --install-extension tencent-cloud.coding-copilot \
  && code-server --install-extension vscjava.vscode-java-pack \
  && echo done

# 安装 ssh 服务，用于支持 VSCode 客户端通过 Remote-SSH 访问开发环境
RUN apt-get update && apt-get install -y wget unzip openssh-server

# 指定字符集支持命令行输入中文（根据需要选择字符集）
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8

# 安装环境依赖
RUN yarn install