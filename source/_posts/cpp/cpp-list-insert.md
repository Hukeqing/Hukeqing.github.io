---
title: 一段奇怪的 CPP 代码
date: 2023-12-03 13:56:55
updated: 2023-12-03 13:56:55
categories: 杂项
index_img: /image/cpp/cpp-list-insert/docs.png
tag:
 - C++
description: 踩了一个 list 的一个坑，当然是我自己笨蛋了
---

最近发现了一个奇怪的代码，在 C++17 下。使用的 cmake 命令是

```shell
"~/Applications/CLion Nova.app/Contents/bin/cmake/mac/aarch64/bin/cmake" -DCMAKE_BUILD_TYPE=Debug "-DCMAKE_MAKE_PROGRAM=~/Applications/CLion Nova.app/Contents/bin/ninja/mac/aarch64/ninja" -G Ninja -S ~/Code/ClionProject -B ~/Code/ClionProject/cmake-build-debug
```

而这段代码则是

```cpp
list<int> l;
for (int i = 0; i < 10; ++i) l.push_back(i);
auto iter = l.begin();
for (int i = -1; i >= -10; --i) l.insert(iter--, i);
for (int&v: l) cout << v << ' ';
```

这段代码的结果却是

```
-1 0 1 -10 2 -9 3 -8 4 -7 5 -6 6 -5 7 -4 8 -3 9 -2 
```

如果稍微调整一下，比如这样的代码

```cpp
list<int> l;
for (int i = 0; i < 10; ++i) l.push_back(i);
auto iter = l.begin();
for (int i = -1; i >= -10; --i) {
    l.insert(iter, i);
    --iter;
}
for (int&v: l) cout << v << ' ';
```

得到的结果却是

```
-10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 
```

如果调整成这样

```cpp
list<int> l;
for (int i = 0; i < 10; ++i) l.push_back(i);
auto iter = l.begin();
++iter;
for (int i = -1; i >= -10; --i) {
    l.insert(--iter, i);
}
for (int&v: l) cout << v << ' ';
```

得到的结果也是

```
-10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 
```

这似乎有点不太符合预期。至少后两个是符合预期的，而第一个就有点奇怪了。第一反应是不是踩到 UB 了，但是很快在文档里找到了不符合预期的描述

![docs](/image/cpp/cpp-list-insert/docs.png)

既然如此，那么就写一段测试代码看看

```cpp
list<int> l;

void f(list<int>::iterator iter, int v) {
    cout << *iter << ' ';
    l.insert(iter, v);
    cout << *iter << endl;
}

void solve() {
    for (int i = 0; i < 10; ++i) l.push_back(i);
    auto iter = l.begin();
    for (int i = -1; i >= -10; --i) {
        f(iter--, i);
        cout << (iter == l.begin()) << endl;
        for (int&v: l) cout << v << ' ';
        cout << endl;
    }
}
```

此处进行了一下代理，将每次试图写入钱，通过 `f` 函数进行代理后，再执行插入操作。结果发现

```
0 0
0
-1 0 1 2 3 4 5 6 7 8 9 
11 12
0
-1 0 1 2 3 4 5 6 7 8 9 -2 
9 9
0
-1 0 1 2 3 4 5 6 7 8 -3 9 -2 
8 8
0
-1 0 1 2 3 4 5 6 7 -4 8 -3 9 -2 
7 7
0
-1 0 1 2 3 4 5 6 -5 7 -4 8 -3 9 -2 
6 6
0
-1 0 1 2 3 4 5 -6 6 -5 7 -4 8 -3 9 -2 
5 5
0
-1 0 1 2 3 4 -7 5 -6 6 -5 7 -4 8 -3 9 -2 
4 4
0
-1 0 1 2 3 -8 4 -7 5 -6 6 -5 7 -4 8 -3 9 -2 
3 3
0
-1 0 1 2 -9 3 -8 4 -7 5 -6 6 -5 7 -4 8 -3 9 -2 
2 2
0
-1 0 1 -10 2 -9 3 -8 4 -7 5 -6 6 -5 7 -4 8 -3 9 -2 
```

仍然有这个奇奇怪怪的问题。

正当我想要搜索一些文档来看看是不是什么奇奇怪怪的 bug 的时候，突然意识到一个问题：`i++;` 等价于下面这三行代码

```cpp
auto tmp = i;
++i;
return tmp;
```

这似乎就能解释为什么了！因为在试图进行 `iter--` 操作的时候，又进行了插入操作，实际上导致了 `iter` 本身先移动到了前一个指针的位置，而在 STL 标准库实现的 `list` 中，这个链表是一个双向带头循环链表，故实际上此时 `iter` 是先被移动到了 `end()` 的位置，然后再返回了 `begin()` 的位置，并在 `begin()` 前插入了一个值，使得实际上的 `begin()` 发生了更新。而实际上我们的 `iter` 早就被移动到 `end()` 的位置。
