---
title: GitHub 下载的 zip 代码如何与原仓库再次建立连接
date: 2021-11-25 12:45:30
categories: 杂项
tag:
 - git
 - GitHub
---

执行如下命令即可（注意替换关键词）

```shell
unzip <repo>.zip
cd <repo>
git init
git add .
git remote add origin https://github.com/<user>/<repo>.git
git remote update
git checkout master
```
