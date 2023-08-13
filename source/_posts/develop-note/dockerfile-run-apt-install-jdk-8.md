---
title: Dockerfile 中下载 JDK8
date: 2021-11-18 13:48:29
categories: 杂项
tag:
 - Docker
 - 短笔记
 - JDK
---

# openjdk-8-jdk-headless

在 Linux 中常用 `apt install openjdk-8-headless` 来安装 JDK，但是 dockerfile 中无法正常安装

# adoptopenjdk-8-hotspot

通常在 docker 中使用 adoptopenjdk-8-hotspot 来代替 openjdk

```
RUN ["/bin/bash", "-c", "wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add -"]
RUN ["/bin/bash", "-c", "echo 'deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb buster main' > /etc/apt/sources.list.d/AdoptOpenJDK.list"]
apt install adoptopenjdk-8-hotspot
```

