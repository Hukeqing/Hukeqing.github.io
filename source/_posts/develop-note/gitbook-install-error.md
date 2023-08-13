---
title: Gitbook 安装出错
date: 2022-03-24 23:54:01
categories: 杂项
tag:
 - Gitbook
 - nodejs
---

执行 `npm i gitbook-cli -g` 时出现

```
    if (cb) cb.apply(this, arguments)
           ^
TypeError: cb.apply is not a function
    at /home/travis/.nvm/versions/node/v12.18.3/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287:18
    at FSReqCallback.oncomplete (fs.js:169:5)
```

的情况，可以执行下面的命令解决

```
cd `npm root -g`/gitbook-cli/node_modules/npm/node_modules/
npm install graceful-fs@4.2.4 --save
gitbook install
```

即可
