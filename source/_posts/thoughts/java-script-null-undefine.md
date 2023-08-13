---
title: Java Script 的 null 和 undefined 随想
date: 2022-08-30 00:10:06
categories: 杂项
tag:
 - 随想
 - 缓存
---

有些时候感觉一些语言里看起来很蠢的设计，实际上却能解决一些很有意思的场景。比如 JavaScript 的 null 和 undefined，虽然看起来都是表示空的意思，但是实际上却解决了“没有这个值”，“这个值为空”这样两种语义。在缓存穿透的问题上，如果 redis、memcached 等数据库也有这样一层设计等话，是不是就能解决 null 穿透问题了呢
