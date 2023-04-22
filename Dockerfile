FROM node:14 AS BUILD_IMAGE
#声明作者
MAINTAINER yao guan shou
# RUN apk update && apk add bash
RUN mkdir ot-system-client
# 复制package.json文件
COPY  package.json  /ot-system-client
WORKDIR /ot-system-client
# RUN echo 'dist , node_modules目录下所有文件,以及清理缓存'
RUN echo '删除dist,node_modules目录下所有文件,以及清理缓存' & rm -rf ./node_modules & rm -rf  ./dist & rm -rf package-lock.json & rm -rf yarn.lock & npm cache clean --force & npm install --production 
 
#清理缓存
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
#移动当前目录下面的文件到client目录下
COPY  .  /ot-system-client
# RUN echo '复制成功'
#进入到server目录下面，类似cd
WORKDIR /ot-system-client
# RUN echo 'webpack打包编译生产代码'
RUN npm run build:client:prod


# # # 设置基础镜像
FROM nginx
# 定义作者
MAINTAINER yao guan shou
#对外暴露的端口
EXPOSE 80

# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
RUN echo '复制静态文件到nginx html目录中'
# 拷贝 装依赖阶段 生成的 node_modules 文件夹到工作目录下
COPY --from=BUILD_IMAGE  /ot-system-client/dist/client  /usr/share/nginx/html/
# COPY  dist/client  /usr/share/nginx/html/

# 覆盖默认配置
RUN echo '复制nginx.conf配置到容器中'
COPY nginx.conf   /etc/nginx/conf.d/default.conf
RUN echo 'client镜像build打包成功'

