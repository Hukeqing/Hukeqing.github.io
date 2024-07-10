---
title: 用 magic 变量解决 UAF 问题
date: 2024-07-10 09:06:10
updated: 2024-07-10 09:06:10
categories: 
  - 杂项
tags:
  - C++
  - UAF
math: true
description: 用 magic 变量解决 UAF 问题
hide: false
---

最近学到了一个很有意思的方法解决 UA(Use-After-Free) 的问题，示例代码如下

```cpp
class A {
public:
    explicit A(int x): _magic(0x41), a(x) {}

    ~A() {
        _magic = 0xdead;
    }

    void print() const {
        assert(_magic == 0x41);
        cout << a << endl;
    }

private:
    unsigned _magic;
    int a;
};

int main() {
    auto a = new A(10);
    a->print();
    delete a;
    a->print();
}
```

简单来说就是在定义类的时候，增加一个 magic 的变量，用于记录当前的变量是否已经被释放了

同时使用了 `assert` 在每一个方法内判断一下是否正在执行被释放的代码

如果被释放了（示例中的代码），此时就会提示

> Assertion failed: (_magic == 0x41), function print, file main.cpp, line 16.

其中可以注意到使用了 `0x41` 作为 magic 的默认值，也是为了解决 CPP 没有 RTTI 的问题，因为其恰好是 `A` 这个字母
