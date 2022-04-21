---
title: develop-note/centos-ufw-docker-ip.md
date: 2022-04-21 20:15:20
updated: 2022-04-21 20:15:20
tags:
 - Docker
 - centOS
---

当 centOS 关闭掉防火墙后，请务必重启 docker

```shell
systemctl restart docker
```

否则会导致 docker-compose 出错

```
ERROR: Failed to Setup IP tables: Unable to enable SKIP DNAT rule:  (iptables failed: iptables --wait -t nat -I DOCKER -i br-7506353a9954 -j RETURN: iptables: No chain/target/match by that name.
```
