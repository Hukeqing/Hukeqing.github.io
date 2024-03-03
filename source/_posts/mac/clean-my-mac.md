---
title: 个人备份的常用 macOS 清理命令
date: 2024-03-02 01:10:37
updated: 2024-03-02 01:10:37
categories:
  - 杂项
tag:
  - macOS
math: true
description: 个人备份的常用 macOS 清理命令
---

# 清理 brew（/opt/homebrew）

```shell
brew upgrade
brew autoremove
brew cleanup --prune=0
```

# 清理 log 日志（/private/var/db/diagnostics）

```shell
sudo log erase --all
```
