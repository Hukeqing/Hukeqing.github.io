---
title: 记一次 SQL LEFT JOIN 没有得到预期结果的错误
date: 2022-05-29 21:26:47
tag:
 - SQL
---

最近在业务中做数据开发的时候，写了一个 SQL 但是没有得到预期的结果，大致如下

```
表 a
+----+------+-----+
| id | name | tid |
+----+------+-----+
|  1 |  aaa | 101 |
+----+------+-----+
|  2 |  bbb | 102 |
+----+------+-----+
|  3 |  ccc | 103 |
+----+------+-----+
```

```
表 b
+------+------+-------+
|   id | nick |  type |
+------+------+-------+
| 1001 |  abc | false |
+------+------+-------+
| 1002 |  edf |  true |
+------+------+-------+
| 1003 |  xyz |  true |
+------+------+-------+
```

然后圈选的 SQL 的为

```sql
SELECT
    a.name
    b.nick
FROM
    a
LEFT JOIN
    b
ON
    a.tid = b.id
WHERE
    b.type = "true"
;
```

本意上，通过 `LEFT JOIN` ，即使没有找到，也应该正常返回数据，但是实际上没有返回任何数据

因为 WHERE 条件是在 `JOIN` 之后发生的，所以实际上，因为 `LEFT JOIN` 拿不到数据，所以所有列的 `b.type` 都是 `NULL`，当然就不是 `true`

此时可以拆分这两个条件，例如

```sql
@true_b :=
SELECT
    id,
    nick
FROM
    b
WHERE
    type = "true"
;

SELCT
    a.name
    c.nick
FROM
    a
LEFT JOIN
    @true_b c
ON
    a.tid = c.id
```
