---
title: 一段奇怪的 CPP 代码
date: 2023-12-03 13:56:55
updated: 2023-12-03 13:56:55
categories: 杂项
tag:
 - C++
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

这似乎有点不太符合预期
