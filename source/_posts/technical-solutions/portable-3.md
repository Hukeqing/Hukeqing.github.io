---
title: Portable OJ 三期工程技术方案
date: 2022-3-15 10:02:00
math: true
mermaid: true
hide: true
---

# 新增模块

## 批量用户

# 存储

## 批量用户

```sql
CREATE TABLE `batch` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `owner` bigint NOT NULL COMMENT '拥有者 ID',
  `contest_id` bigint DEFAULT NULL COMMENT '绑定至的比赛 ID',
  `prefix` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '用户名前缀',
  `count` int NOT NULL COMMENT '总数量',
  `ip_lock` tinyint(1) NOT NULL COMMENT '是否锁定 IP',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `idx_owner` (`owner`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
