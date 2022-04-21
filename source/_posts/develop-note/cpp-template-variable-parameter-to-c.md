---
title: C++ 模版可变参数列表传递给 C 的 va_list 可变参数列表
date: 2022-01-12 23:26:29
tag:
 - C
 - C++
 - 可变参数
---

# C 可变参数
以 `printf` 为例，常见如下
```c
int printf(const char* format, ...);
```

# CPP 可变参数
常见如下

```cpp
template<class... Args>
int printf(const string &format, const Args &... args);
```

若此时需要为 C 的 `printf` 进行包装，使其可以接受 `string` 类型的 format，则可以用如下方式实现

```cpp
template<class... Args>
int printf(const string &format, const Args &... args) {
    return printf(format.c_str(), args...);
}
```

通常会提示警告，因为 `c_str()` 得到的字符串不能保证是一个可格式化的字符串，而 `printf` 的函数原型是


```c
__attribute__((__format__ (__printf__, 1, 0)))
int printf(const char* format, ...);
```

这使得 `printf` 会被检查第一个参数是否满足 `printf`, `scanf`, `strftime`, 或者 `strfmon` 风格

但是通过此方法可以将部分 C 语言中的方法扩展到 CPP 的模版化
