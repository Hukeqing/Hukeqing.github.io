---
title: 记一次 Navicat 连接 MySQL 一直报认证错误(Access denied)
date: 2021-01-02 00:38:39
categories: 杂项
tag:
 - MySQL
 - 短笔记
---

*今天一时兴起，想在 WSL2 里下个 MySQL。方法也很简单，直接 `sudo apt install mysql-server`*
*本来以为顺风顺水，结果却在 Navicat 连接 MySQL 的操作上出事了*

### 问题
Navicat 无法连接上 MySQL

### 配置情况
Navicat Premium 15.0.19
MySQL 8.0.22
WSL2(Ubuntu 20)

### 现状
终端可以通过`sudo mysql`连上 MySQL
终端不可以通过`mysql -u root -p`的方式连接，显示密码错误(`Access denied for user 'root'@'localhost'`)
终端可以通过默认用户连接(默认用户为 `/etc/mysql/debian.cnf` 文件中的 `debian-sys-maint`，密码为安装MySQL时随机生成得到的)
Navicat不可以通过直接连接或者通过 ssh 的方式连接，显示密码错误(`Access denied for user 'root'@'localhost'`)
Navicat可以通过默认用户连接

### 经过
#### 尝试1
首先是尝试了百度的结果，重置 MySQL 的 root 账户的密码
因为可以通过`sudo mysql`直接进入数据库，也就不需要那么多百度出来的奇奇怪怪的操作了
直接进入数据库，然后尝试了下面几行代码
```mysql
use mysql;
alter user 'root'@'localhost' identified by 'newPassword';
exit
```

然后，测试`mysql -u root -p`连接——**失败**

#### 尝试2
后来在MySQL官网找到了重置root密码的方法，然后赶紧拿来测试
[官网链接](https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html)
其中的一点提到

> B.3.3.2.2 Resetting the Root Password: Unix and Unix-Like Systems

大致操作就是先终止 MySQL，然后使用 MySQL 的附加参数来设置一个初始化文件，然后使得 MySQL 去运行此文件。

然后，测试`mysql -u root -p`连接——**失败**

其实觉得挺奇怪的，既然都能重启 MySQL 了，说明你已经拿到这个设备的 root 权限了，为什么不直接用 `sudo mysql` 进入直接run这条命令呢？

#### 尝试3
最终我在一份不起眼的博客上找到了解决方案
[博客连接](https://phoenixnap.com/kb/access-denied-for-user-root-localhost)
其中提到了一个很重要的命令
```mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'insert_password';
```

> This command changes the password for the user root and sets the authentication method to mysql_native_password. This is a traditional method for authentication, and it is not as secure as auth_plugin.

其中的`mysql_native_password`是所谓的传统验证方案，也就是 Navicat 连接 MySQL 的解决方案

然后将方案1的命令稍作改正得到
```mysql
use mysql;
alter user 'root'@'localhost' identified with mysql_native_password by 'newPassword';
exit
```

然后，测试`mysql -u root -p`连接——**成功！**

### 后续
mysql5.8开始将caching_sha2_password作为默认的身份验证插件，该caching_sha2_password和 sha256_password认证插件提供比mysql_native_password插件更安全的密码加密 ，并 caching_sha2_password提供了比更好的性能sha256_password。由于这些优越的安全性和性能特性 caching_sha2_password它是MySQL 8.0首选的身份验证插件，而且也是默认的身份验证插件而不是 mysql_native_password。此更改会影响服务器和libmysqlclient 客户端库；<font color=red>目前来说和经常使用的客户端软件兼容性不好</font>。

这也是导致目前 Navicat 无法连接到 MySQL 5.8及以后版本的原因。当然如此操作后的影响便是无法直接使用`sudo mysql`的方式连接到数据库，只能通过 `mysql -u root -p`的传统密码验证的方式来登陆
