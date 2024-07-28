---
title: Golang 踩坑 —— interface 为参数的时候传 nil 指针
date: 2024-07-28 22:11:22
updated: 2024-07-28 22:11:22
categories: 
  - 杂项
tags:
  - Golang
math: true
description: Golang 踩坑 —— interface 为参数的时候传 nil 指针
hide: false
---

# 问题

这两天踩了一个奇怪的坑，抽出核心逻辑可以得到这样一段代码

```golang
type V interface {
}

type T struct {
	V
	next V
}

func NewT(t V) *T {
	return &T{next: t}
}

func TestName(t *testing.T) {
	var tmp *T = nil
	newT := NewT(tmp)
	if newT.next == nil {
		t.Log("newT.next is nil as expected.")
	} else {
		t.Errorf("newT.next should be nil, but got %v", newT.next)
	}
}
```

此时，输出的内容是：`newT.next should be nil, but got <nil>`

是不是挺疑惑的，稍做修改，将 `var tmp *T = nil` 改成 `var tmp V = nil`

此时，运行得到的结果是：`newT.next is nil as expected.`

# 原因

最终在 [Google Groups](https://groups.google.com/g/golang-nuts/c/s8kK700U8zw) 上找到了相关说明：

> I'm trying to understand why a nil pointer when converted to an interface produces a non-nil value.
>
> Because different nil pointers can have different types, and the
> interface remembers the type of the (nil) pointer (that it is converted from):
> that remembering means that the interface value isn't nil.
>
> Is this a bug?
>
> No.
>
> (It's a mild confusion based on the overloading of `nil` to mean the
> zero value for pointers of any type and for interfaces -- it's not obvious
> from the text of a program that the nils are of different types.)
> 
> Chris

简单来说就是为了满足类似 C++ 的 RTTI 的特性，因为转为 `interface` 必然会丢失掉原来的类型信息，需要保存下原来的类型

这就导致了一个具体的变量传递给一个 `interface` 参数的函数的时候，因为会丢失掉原始的类型，所以将其包装成一个特殊的 `struct`。我们可以用 `unsafe` 的方式来获取到相关的信息

因为样例的 interface 在 golang 中使用类似如下的结构进行存储

```golang
type eface struct {
	_type *_type
	data  unsafe.Pointer
}
```
所以我们可以使用如下方案提取具体的变量值：

```golang
type InterfaceStruct struct {
	pt uintptr
	pv uintptr
}

type V interface {
}

type T struct {
	V
	next V
}

func NewT(t V) *T {
	return &T{next: t}
}

func TestName(t *testing.T) {
	var tmp *T = nil
	newT := NewT(tmp)
	pointer := *(*InterfaceStruct)(unsafe.Pointer(&newT.next))
	fmt.Println(pointer)
}
```

就可以得到执行结果为 `{4309258112 0}`

也就是实际上 `data` 字段确实是 `0`，也就是 `nil`，但是其类型则存在一个 `_type` 的指针用来描述，所以在程序层面又不能说是 `nil`
