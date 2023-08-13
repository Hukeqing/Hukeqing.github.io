---
title: Windows 通过网络访问 WSL2
date: 2021-06-07 22:39:21
categories: 杂项
tag:
 - WSL
 - 短笔记
math: true
index_img: /image/develop-note/wsl-localhost/WSL-ifconfig.jpg
---
# localhost
当使用 localhost 时，Windows 直接访问到 WSL 内的进程，即看起来似乎是一台电脑，

# 127.0.0.1
当使用本地 IP 时，即使用 `127.0.0.1` 时，Windows 将会无法访问到 WSL，Windows 认为这是强调它自己。

# JVM(SpringBoot)
由于此问题是在使用 SpringBoot 时遇到的问题，并不确定是不是 JVM 的问题还是 SpringBoot 的问题

## 问题
当使用 WSL2 中的 docker 来启动一个 mongo 镜像，使用的命令是

```shell
docker run -itd --name mongo -p 27017:27017 mongo --auth
docker exec -it mongo mongo admin
db.createUser({ user:'root',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},"readWriteAnyDatabase"]});
```

然后在 Navicat 中，可以直接使用 `localhost` 对此 mongo 进行连接，但是在 SpringBoot 中，无法连接到此 mongo 数据库，配置如下

![SpringBoot-Before](/image/develop-note/wsl-localhost/SpringBoot-Before.png)

报错信息：

```
com.mongodb.MongoSocketOpenException: Exception opening socket
```

后测试发现，Navicat 也无法使用 `127.0.0.1` 来访问 WSL，由此推测，JVM 或者 SpringBoot 是否是将 `localhost` 直接解析为 `127.0.0.1` 了

## 解决策略
直接使用 WSL 的 IP 来代替 `localhost`

在 WSL 中使用 `ifconfig` 来获取 VM 的 IP，例如下图中，应该选择 `eth0` 的 IP `172.31.18.91` 来代替 `localhost`

![WSL-ifconfig](/image/develop-note/wsl-localhost/WSL-ifconfig.jpg)

## 测试
在 Navicat 和 SpringBoot 中，均连接数据库成功
