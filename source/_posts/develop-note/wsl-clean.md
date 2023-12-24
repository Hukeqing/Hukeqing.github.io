---
title: 清理 WSL2 的磁盘占用
date: 2021-01-27 14:58:23
categories: 杂项
tag:
 - WSL
 - 短笔记
math: true
---

方法来源：[https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168](https://github.com/microsoft/WSL/issues/4699#issuecomment-627133168)


由于 vhdx 格式的磁盘镜像文件只支持自动扩容但不支持自动缩容，所以需要手动来实现缩容，即利用 Windows 自带的 diskpart 来实现
