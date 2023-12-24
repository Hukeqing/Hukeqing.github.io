---
title: WSL1 使用 Docker 一直无法启动
date: 2020-12-24 15:55:31
categories: 杂项
tag:
 - Dokcer
 - 短笔记
 - WSL
---

### 问题
WSL1 无法正常启动 Dokcer，Dokcer一直处于 not running 状态

### 解决办法
WSL1 是伪 Linux，实际上仍然是 Windows 底层，而 Docker 是基于系统底层实现的，这就导致了无法在 Windows(WSL1) 上运行 Linux 版本的 Dokcer
使用 WSL2 则可以正常使用 Docker，目前上述问题在不使用 WSL2 的情况下，暂时无法解决
