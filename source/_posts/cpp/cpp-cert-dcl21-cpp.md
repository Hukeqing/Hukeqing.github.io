---
title: 反复横跳的 Clang-Tidy(cert-dcl21-cpp)
date: 2023-12-04 21:18:30
updated: 2023-12-04 21:18:30
categories: 杂项
tag:
 - C++
---

今天早上有些发烧，就没去上班，下午稍微好点了之后就爬起来折腾会代码，写着写着就发现了一个奇怪的东西。把代码抽出核心部分类似如下的代码

```cpp
struct A {
    int v;

    A operator++(int) noexcept { return A(v++); }
}
```

这里返回的值是一个自身为 `A` 的右值，理论上并不需要明确指明右值（即返回值写 `A&&`），因为返回值本身肯定是右值，在原来的栈中如果进行赋值操作的时候，会先尝试进行移动构造，如果没有提供移动构造的情况下才会尝试进行引用构造甚至是复制构造

但是这段代码，Clang-Tidy 却给我报了 Warning: `Clang-Tidy: Overloaded 'operator++' returns a non-constant object instead of a constant object type`

大致意思是说，`operator++` 方法返回了一个非 `const` 的变量。看了下事例，大概意思是说，因为返回值是一个"临时"的类型（毕竟是一个右值，用完应该就要丢掉的）故需要 `const` 一下，避免会出现 `(i++)++;` 这种离谱的代码（后者的 `++` 是作用在返回的右值上的，实际上不会对原来的值生效）

一听，好像有点道理，自动修复一下

```cpp
struct A {
    int v;

    const A operator++(int) noexcept { return A(v++); }
}
```

嗯，这样应该就行了吧。然后 Clang-Tidy 又给我报了个 Warning：`Clang-Tidy: Return type 'const A' is 'const'-qualified at the top level, which may reduce code readability without improving const correctness`

蛤？又告诉我不能带 `const`，因为这可能会导致不必要的代码理解？看了下例子，也非常好理解，因为返回值是一个右值，最终（指代通常情况下）都应该被移动构造，这样的话，实际上 `const` 仅仅是对右值进行了 `const` 标识，并没有什么用处

也就是说，加也不对，不加也不对……

在翻找了一堆资料后，发现了这两个 checker 的文档：

- [cert-dcl21-cpp](https://clang.llvm.org/extra/clang-tidy/checks/cert/dcl21-cpp.html)
- [readability-const-return-type](https://clang.llvm.org/extra/clang-tidy/checks/readability/const-return-type.html)

其中，在前者有这样一句：

> It will be removed in clang-tidy version 19.

嗯，再一看自己的 clang-tidy，恰好是 `18.0.0`
