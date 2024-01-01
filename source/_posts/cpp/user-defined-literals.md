---
title: C++自定义的字面量
date: 2024-01-01 13:42:42
updated: 2024-01-01 13:42:42
categories:
  - 学习&开发&实现
tag:
  - C++
description: C++自定义的字面量表达方式
math: false
mermaid: false
---

最近在看 CPP 的一些东西的时候，发现了一个非常有意思的特性。不得不说，CPP 的特性总是朝着一些奇奇怪怪的方向发展，整出了一堆奇奇怪怪的语法糖

这个特性叫 **[User-defined literals](https://en.cppreference.com/w/cpp/language/user_literal)**

非常简单的一种特性，例如很多时候我们会用一些结构体来表示内存/磁盘等大小，比如这种

```cpp
static size_t B = 1;
static size_t KB = 1000 * B;
static size_t MB = 1000 * KB;
static size_t GB = 1000 * MB;
static size_t KiB = 1024 * B;
static size_t MiB = 1024 * KiB;
static size_t GiB = 1024 * MiB;

struct Size {
    size_t value;
};

inline std::ostream& operator<<(std::ostream& o, const Size& size) {
    if (size.value < KiB) o << size.value << 'B';
        // NOLINTNEXTLINE(*-narrowing-conversions)
    else if (size.value < MiB)o << std::fixed << std::setprecision(2) << 1.0 * size.value / KiB << "KiB";
        // NOLINTNEXTLINE(*-narrowing-conversions)
    else if (size.value < GiB)o << std::fixed << std::setprecision(2) << 1.0 * size.value / MiB << "MiB";
        // NOLINTNEXTLINE(*-narrowing-conversions)
    else o << std::fixed << std::setprecision(2) << 1.0 * size.value / GiB << "GiB";
    return o;
}
```

这样就可以有一个表示占用大小的类型了，但是这样并不方便，因为初始化的时候还需要明确表示这个类型。但是用上这个特性之后就可以非常简单，只需要再定义几个方法

```cpp
inline Size operator ""_B(unsigned long long v) {
    return {v * B};
}

#pragma region 1000

inline Size operator ""_KB(const unsigned long long v) {
    return {v * KB};
}

inline Size operator ""_MB(const unsigned long long v) {
    return {v * MB};
}

inline Size operator ""_GB(const unsigned long long v) {
    return {v * GB};
}

#pragma endregion

#pragma region 1024

inline Size operator ""_KiB(const unsigned long long v) {
    return {v * KiB};
}

inline Size operator ""_MiB(const unsigned long long v) {
    return {v * MiB};
}

inline Size operator ""_GiB(const unsigned long long v) {
    return {v * GiB};
}

#pragma endregion
```

这样之后就可以直接用字面量初始化

```cpp
const auto v = 123435245_KiB;
std::cout << v << std::endl;
```
