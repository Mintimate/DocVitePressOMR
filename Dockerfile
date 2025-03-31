# 打包镜像
FROM node:18 as builder
# 安装项目依赖
WORKDIR /app

COPY package*.json ./

RUN apt update && \
    apt install libxml2-utils -y && \
    yarn install

# 复制应用代码
COPY . .

# 构建应用
RUN yarn build && \
    xmllint --format .vitepress/dist/sitemap.xml --output .vitepress/dist/sitemap.xml

# 使用 Nginx 部署构建产物
FROM nginx:alpine

# 复制构建产物到 Nginx 的 html 目录
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# 创建 Nginx 配置文件
RUN echo 'server {\
    gzip on;\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\
    listen 80;\
    server_name _;\
    index index.html;\
    location / {\
        root /usr/share/nginx/html;\
        try_files $uri $uri.html $uri/ =404;\
        error_page 404 /404.html;\
        error_page 403 /404.html;\
        # 检查用户浏览器语言\
        if ($http_accept_language !~* "^zh") {\
          rewrite ^/$ /en permanent;\
        }\
        if ($request_uri ~ ^/(.+)/ex.html) {\
          return 301 /$1/;\
        }\
        # 禁止部分内容响应\
        max_ranges 0;\
        location ~* ^/assets/ {\
            expires 1y;\
            add_header Cache-Control "public, immutable";\
        }\
    }\
    location /demo {\
        return 301 /zh$request_uri;\
    }\
    location /guide {\
        return 301 /zh$request_uri;\
    }\
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

