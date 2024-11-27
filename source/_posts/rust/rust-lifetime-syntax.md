---
title: 【转载】Rust 中常见的有关生命周期的误解
date: 2024-10-08 23:15:49
updated: 2024-10-08 23:15:49
categories: 
  - 学习笔记
tags:
  - Rust
math: true
description: Rust 中常见的有关生命周期的误解
---

# 1. 介绍

Rust学习中最难的部分就是⽣命周期，很多⽣命周期规则衍⽣的复杂情况并没有在 TRPL 中得到介绍，因此本⽂的⽬的是想帮助Rust程序员打通⽣命周期的问题，同时也希望能为 modern C++ 程序员带来⼀些思考和启发。

本⽂中使⽤的术语可能并不那么官⽅，因此下⾯列出了⼀个表格，记录使⽤的短语及其想表达的含义。

|          短语          |                      意义                      |
|:--------------------:|:--------------------------------------------:|
|         `T`          |       1)所有可能类型的集合 *或* 2)上述集合中的某一个具体类型        |
|        所有权类型         | 某些非引用类型，其自身拥有所有权 例如 `i32`, `String`, `Vec` 等 |
|  1)借用类型 _或_ 2) 引用类型  |      引用类型，不考虑可变性 例如 `&i32`, `&mut i32`       |
|  1)可变引用 _或_ 2) 独占引用  |              独占可变引用，即 `&mut T`               |
| 1) 不可变引用 _或_ 2) 共享引用 |               可共享不可变引用，即 `&T`                |

# 2. 误解

简单来讲，⼀个变量的⽣命周期是指⼀段时期，在这段时期内，该变量所指向的内存地址中的数据是有效的，这段时期是由编译器静态分析得出的，有效性由编译器保证。接下来我将探讨这些常⻅误解的细节。

## 1) `T` 只包含所有权类型

这更像是对泛型的误解⽽⾮对⽣命周期的误解，但在 Rust 中，泛型与⽣命周期的关系是如此紧密，以⾄于不可能只讨论其中⼀个⽽忽视另外⼀个。当我刚开始学习 Rust 时，我知道 `i32` , `&i32` , 和 `&mut i32` 是不同的类型，同时我也知泛型 `T` 表示所有可能类型的集合。然⽽，尽管能分别理解这两个概念，但我却没能将⼆者结合起来。在当时我这位 Rust 初学者的眼⾥，泛型是这样运作的：

| 类型 |  `T`  |  `&T`  |  `&mut T`  |
|:--:|:-----:|:------:|:----------:|
| 例子 | `i32` | `&i32` | `&mut i32` |

其中 `T` 包全体所有权类型；`&T` 包括全体不可变引⽤； `&mut T` 包括全体可变引⽤；`T`, `&T`, 和 `&mut T` 是不相交的有限集。简洁明了，符合直觉，却完全错误。事实上泛型是这样运作的：

| 类型 |                         `T`                         |             `&T`             |                 `&mut T`                 |
|:--:|:---------------------------------------------------:|:----------------------------:|:----------------------------------------:|
| 例子 | `i32`, `&i32`, `&mut i32`, `&&i32`, `&mut &mut i32` | `&i32`, `&&i32`, `&&mut i32` | `&mut i32`, `&mut &mut i32`, `&mut &i32` |

`T` , `&T` , 和 `&mut T` 都是⽆限集，因为你可以借⽤⼀个类型⽆限次。`T` 是 `&T` 和 `&mut T` 的超集。`&T` 和 `&mut T` 是不相交的集合. 下⾯有⼀些例⼦来验证这些概念：

```rust
trait Trait {}

impl<T> Trait for T {}

impl<T> Trait for &T {} // 编译错误

impl<T> Trait for &mut T {} // 编译错误
```

上述代码不能编译通过：

```text
error[E0119]: conflicting implementations of trait `Trait` for type `&_`:
 --> src/lib.rs:5:1
  |
3 | impl<T> Trait for T {}
  | ------------------- first implementation here
4 |
5 | impl<T> Trait for &T {}
  | ^^^^^^^^^^^^^^^^^^^^ conflicting implementation for `&_`

error[E0119]: conflicting implementations of trait `Trait` for type `&mut _`:
 --> src/lib.rs:7:1
  |
3 | impl<T> Trait for T {}
  | ------------------- first implementation here
...
7 | impl<T> Trait for &mut T {}
  | ^^^^^^^^^^^^^^^^^^^^^^^^ conflicting implementation for `&mut _`
```

编译器不允许我们为 `&T` 和 `&mut T` 实现 Trait ，因为这与我们为 `T` 实现的 Trait 发⽣了冲突，⽽ `T` 已经包括了 `&T` 和 `&mut T`. 因为 `&T` 和 `&mut T` 是不相交的，所以下⾯的代码可以通过编译：

```rust
trait Trait {}

impl<T> Trait for &T {} // 编译通过

impl<T> Trait for &mut T {} // 编译通过
```

关键点回顾

- `T` 是 `&T` 和 `&mut T` 的超集
- `&T` 和 `&mut T` 是不相交的集合

## 2) 如果 `T: 'static` 那么 `T` 直到程序结束为⽌都⼀定是有效的

错误的推论

- `T: 'static` 应该视为 “ `T` 有着 `'static` ⽣命周期”
- `&'static T` 和 `T: 'static` 是⼀回事
- 若 `T: 'static` 则 `T` ⼀定是不可变的
- 若 `T: 'static` 则 `T` 只能在编译期创建

让⼤多数 Rust 初学者第⼀次接触 `'static` ⽣命周期注解的代码示例⼤概是这样的：

```rust
fn main() {
    let str_literal: &'static str = "字符串字⾯量";
}
```

他们被告知说 `"字符串字⾯量"` 是被硬编码到编译出来的⼆进制⽂件当中去的，并在运⾏时被加载到只读内存中，所以它不可变且在程序的整个运⾏期间都有效，这也使其⽣命周期为 `'static`. 在了解到 Rust 使⽤ `static` 来定义静态变量这⼀语法后，这⼀观点还会被进⼀步加强。

```rust
static BYTES: [u8; 3] = [1, 2, 3];
static mut MUT_BYTES: [u8; 3] = [1, 2, 3];

fn main() {
    MUT_BYTES[0] = 99; // 编译错误，修改静态变量是 unsafe 的

    unsafe {
        MUT_BYTES[0] = 99;
        assert_eq!(99, MUT_BYTES[0]);
    }
}
```

关于静态变量

- 它们只能在编译期创建
- 它们应当是不可变的，修改静态变量是 unsafe 的
- 它们在整个程序运⾏期间有效

静态变量的默认⽣命周期很有可能是 `'static`, 对吧？所以可以合理推测 `'static` ⽣命周期也要遵循同样的规则，对吧？

确实，但 持有 `'static` ⽣命周期注解的类型和⼀个满⾜ `'static` 约束 的类型是不⼀样的。后者可以于**运⾏时被动态分配**，能被安全⾃由地修改，也可以被 drop, 还能存活任意的时⻓。区分 `&'static T` 和 `T: 'static` 是⾮常重要的⼀点。`&'static T` 是⼀个指向 `T` 的不可变引⽤，其中 `T` 可以被安全地⽆期限地持有，甚⾄可以直到程序结束。这只有在 `T` ⾃身不可变且保证 在引⽤创建后 不会被 move 时才有可能。`T` 并不需要在编译时创建。我们可以以内存泄漏为代价，在运⾏时动态创建随机数据，并返回其 `'static` 引⽤，⽐如：

```rust
use rand;

// 在运⾏时⽣成随机 &'static str
fn rand_str_generator() -> &'static str {
    let rand_string = rand::random::<u64>().to_string();
    Box::leak(rand_string.into_boxed_str())
}
```

`T: 'static` 是指 `T` 可以被安全地⽆期限地持有，甚⾄可以直到程序结束。 `T: 'static` 在包括了全部 `&'static T` 的同时，还包括了全部所有权类型， ⽐如 `String`, `Vec` 等等。 数据的所有者保证，只要⾃身还持有数据的所有权，数据就不会失效，因此所有者能够安全地⽆期限地持有其数据，甚⾄可以直到程序结束。 `T: 'static` 应当视为 “ `T` 满⾜ `'static` ⽣命周期约束” ⽽⾮ “ `T` 有着 `'static` ⽣命周期”。 ⼀个程序可以帮助阐述这些概念：

```rust
fn drop_static<T: 'static>(t: T) {
    std::mem::drop(t);
}
fn main() {
    let mut strings: Vec<String> = Vec::new();
    for _ in 0..10 { 
        if rand::random() {
            // 所有字符串都是随机⽣成的
            // 并且在运⾏时动态分配
            let string = rand::random::<u64>().to_string();
            // strings获取了string的所有权
            strings.push(string);
        }
    }

    // 这些字符串是所有权类型，所以他们满⾜ 'static ⽣命周期约束
    for mut string in strings {
        // 这些字符串是可变的
        string.push_str("a mutation");
        // 这些字符串都可以被 drop
        drop_static(string); // 编译通过
    }

    // 这些字符串在程序结束之前就已经全部失效了
    println!("i am the end of the program");
}
```

关键点回顾
- `T: 'static` 应当视为 “ `T` 满⾜ `'static` ⽣命周期约束”
- 若 `T: 'static` 则 T 可以是⼀个有 `'static` ⽣命周期的引⽤类型 _或_ 是⼀个所有权类型
- 因为 `T: 'static` 包括了所有权类型，所以 `T`
  - 可以在运⾏时动态分配
  - 不需要在整个程序运⾏期间都有效
  - 可以安全，⾃由地修改
  - 可以在运⾏时被动态的 drop
  - 可以有不同⻓度的⽣命周期

## 3) `&'a T` 和 `T: 'a` 是⼀回事

这个误解是前⼀个误解的泛化版本。`&'a T` 要求并隐含了 `T: 'a` ，因为如果 `T` 本身不能在 `'a` 范围内保证有效，那么其引⽤也不能在 'a 范围内保证有效。例如，Rust 编译器不会运⾏构造⼀个 `&'static Ref<'a, T>` ，因为如果 `Ref` 只在 `'a` 范围内有效，我们就不能给它 `'static` ⽣命周期。`T: 'a` 包括了全体 `&'a T` ，但反之不成⽴。

```rust
// 只接受带有 'a ⽣命周期注解的引⽤类型
fn t_ref<'a, T: 'a>(t: &'a T) {}

// 接受满⾜ 'a ⽣命周期约束的任何类型
fn t_bound<'a, T: 'a>(t: T) {}

// 内部含有引⽤的所有权类型
struct Ref<'a, T: 'a>(&'a T);

fn main() {
    let string = String::from("string");

    t_bound(&string); // 编译通过
    t_bound(Ref(&string)); // 编译通过
    t_bound(&Ref(&string)); // 编译通过
    t_ref(&string); // 编译通过
    t_ref(Ref(&string)); // 编译失败，期望得到引⽤，实际得到 struct
    t_ref(&Ref(&string)); // 编译通过

    // 满⾜ 'static 约束的字符串变量可以转换为 'a 约束
    t_bound(string); // 编译通过
}
```

关键点回顾
- `T: 'a` ⽐ `&'a T` 更泛化，更灵活
- `T: 'a` 接受所有权类型，内部含有引⽤的所有权类型，和引⽤
- `&'a T` 只接受引⽤
- 若 `T: 'static` 则 `T: 'a` 因为对于所有 `'a` 都有 `'static >= 'a`

## 4) 我的代码⾥不含泛型也不含⽣命周期注解

错误的推论
- 避免使⽤泛型和⽣命周期注解是可能的

这个让⼈爽到的误解之所以能存在，要得益于 Rust 的⽣命周期省略规则，这个规则能允许你在函数
定义以及 impl 块中省略掉显式的⽣命周期注解，⽽由借⽤检查器来根据以下规则对⽣命周期进⾏
隐式推导。

- 第⼀条规则是每⼀个是引⽤的参数都有它⾃⼰的⽣命周期参数
- 第⼆条规则是如果只有⼀个输⼊⽣命周期参数，那么它被赋予所有输出⽣命周期参数
- 第三条规则是如果是有多个输⼊⽣命周期参数的⽅法，⽽其中⼀个参数是 `&self` 或 `&mut self`, 那么所有输出⽣命周期参数被赋予 `self` 的⽣命周期。
- 其他情况下，⽣命周期必须有明确的注解

这⾥有不少值得讲的东⻄，让我们来看⼀些例⼦：

```rust
// 显式标注的⽅案
fn get_str<'a>() -> &'a str; // 泛型版本
fn get_str() -> &'static str; // 'static 版本

// ⾮法，多个输⼊，不能确定返回值的⽣命周期
fn overlap(s: &str, t: &str) -> &str;

// 显式标注（但仍有部分标注被省略）的⽅案
fn overlap<'a>(s: &'a str, t: &str) -> &'a str; // 返回值的⽣命周期不⻓于 s
fn overlap<'a>(s: &str, t: &'a str) -> &'a str; // 返回值的⽣命周期不⻓于 t
fn overlap<'a>(s: &'a str, t: &'a str) -> &'a str; // 返回值的⽣命周期不⻓于 s 且不⻓于 t
fn overlap(s: &str, t: &str) -> &'static str; // 返回值的⽣命周期可以⻓于 s 或者 t
fn overlap<'a>(s: &str, t: &str) -> &'a str; // 返回值的⽣命周期与输⼊⽆关

// 展开后
fn overlap<'a, 'b>(s: &'a str, t: &'b str) -> &'a str;
fn overlap<'a, 'b>(s: &'a str, t: &'b str) -> &'b str;
fn overlap<'a>(s: &'a str, t: &'a str) -> &'a str;
fn overlap<'a, 'b>(s: &'a str, t: &'b str) -> &'static str;
fn overlap<'a, 'b, 'c>(s: &'a str, t: &'b str) -> &'c str;

// 展开前
fn compare(&self, s: &str) -> &str;

// 展开后
fn compare<'a, 'b>(&'a self, &'b str) -> &'a str;
```

如果你写过
- 结构体⽅法
- 接收参数中有引⽤的函数
- 返回值是引⽤的函数
- 泛型函数
- trait object(后⾯将讨论)
- 闭包（后⾯将讨论）

那么对于上⾯这些，你的代码中都有被省略的泛型⽣命周期注解。

**关键点回顾**

- ⼏乎所有的 Rust 代码都是泛型代码，并且到处都带有被省略掉的泛型⽣命周期注解

## 5) 如果编译通过了，那么我标注的⽣命周期就是正确的

错误的推论
- Rust 对函数的⽣命周期省略规则总是对的
- Rust 的借⽤检查器总是正确的，⽆论是技巧上还是语义上
- Rust ⽐我更懂我程序的语义

让⼀个 Rust 程序通过编译但语义上不正确是有可能的。来看看这个例⼦：

```rust
struct ByteIter<'a> {
    remainder: &'a [u8]
}

impl<'a> ByteIter<'a> {
    fn next(&mut self) -> Option<&u8> {
        if self.remainder.is_empty() {
            None
        } else {
            let byte = &self.remainder[0];
            self.remainder = &self.remainder[1..];
            Some(byte)
        }
    }
}
fn main() {
    let mut bytes = ByteIter { remainder: b"1" };
    assert_eq!(Some(&b'1'), bytes.next());
    assert_eq!(None, bytes.next());
}
```

`ByteIter` 是⼀个 `byte` 切⽚上的迭代器，简洁起⻅，我这⾥省略了 Iterator trait 的具体实现。这看起来没什么问题，但如果我们想同时检查多个 `byte` 呢？

```rust
fn main() {
    let mut bytes = ByteIter { remainder: b"1123" };
    let byte_1 = bytes.next();
    let byte_2 = bytes.next();
    if byte_1 == byte_2 {
        // ⼀些代码
    }
}
```

Compiler Error:

```rust
error[E0499]: cannot borrow `bytes` as mutable more than once at a time
  --> src/main.rs:20:18
   |
19 | let byte_1 = bytes.next();
   |              ----- first mutable borrow occurs here
20 | let byte_2 = bytes.next();
   |              ^^^^^ second mutable borrow occurs here
21 | if byte_1 == byte_2 {
   |    ------ first borrow later used here
```

如果你说可以通过逐 byte 拷⻉来避免编译错误，那么确实。当迭代⼀个 byte 数组上时，我们的确可以通过拷⻉每个 byte 来达成⽬的。但是如果我想要将 `ByteIter` 改写成⼀个泛型的切⽚迭代器，使得我们能够对任意 `&'a [T]` 进⾏迭代，⽽此时如果有⼀个 `T`，其 copy 和 clone 的代价⼗分昂贵，那么我们该怎么避免这种昂贵的操作呢？哦，我想我们不能，毕竟代码都通过编译了，那么⽣命周期注解肯定也是对的，对吧？错，事实上现有的⽣命周期就是 bug 的源头！这个错误的⽣命周期被省略掉了以⾄于难以被发现。现在让我们展开这些被省略掉的⽣命周期来暴露出这个问题。

```rust
struct ByteIter<'a> {
    remainder: &'a [u8]
}

impl<'a> ByteIter<'a> {
    fn next<'b>(&'b mut self) -> Option<&'b u8> {
        if self.remainder.is_empty() {
            None
        } else {
            let byte = &self.remainder[0];
            self.remainder = &self.remainder[1..];
            Some(byte)
        }
    }
}
```

感觉好像没啥⽤，我还是搞不清楚问题出在哪。这⾥有个 Rust 专家才知道的⼩技巧：给你的⽣命周期注解起⼀个更有含义的名字，让我们试⼀下：

```rust
struct ByteIter<'remainder> {
    remainder: &'remainder [u8]
}

impl<'remainder> ByteIter<'remainder> {
    fn next<'mut_self>(&'mut_self mut self) -> Option<&'mut_self u8> {
        if self.remainder.is_empty() {
            None
        } else {
            let byte = &self.remainder[0];
            self.remainder = &self.remainder[1..];
            Some(byte)
        }
    }
}
```

每个返回的 byte 都被标注为 `'mut_self`, 但是显然这些 byte 都源于 `'remainder`! 让我们来修复⼀下这段代码。

```rust
struct ByteIter<'remainder> {
    remainder: &'remainder [u8]
}

impl<'remainder> ByteIter<'remainder> {
    fn next(&mut self) -> Option<&'remainder u8> {
        if self.remainder.is_empty() {
            None
        } else {
            let byte = &self.remainder[0];
            self.remainder = &self.remainder[1..];
            Some(byte)
        }
    }
}

fn main() {
    let mut bytes = ByteIter { remainder: b"1123" };
    let byte_1 = bytes.next();
    let byte_2 = bytes.next();
    std::mem::drop(bytes); // 我们现在甚⾄可以把这个迭代器给 drop 掉！
    if byte_1 == byte_2 { // 编译通过
        // ⼀些代码
    }
}
```

现在我们再回过头来看看我们上⼀版的实现，就能看出它是错的了，那么为什么 Rust 会编译通过呢？答案很简单：因为这是内存安全的。Rust 借⽤检查器对⽣命周期注解的要求只到能静态验证程序的内存安全为⽌。即便⽣命周期注解有语义上的错误，Rust 也能让程序编译通过，哪怕这样做为程序带来不必要的限制。这⼉有⼀个和之前相反的例⼦：在这个例⼦中，Rust ⽣命周期省略规则标注的⽣命周期是语义正确的，但是我们却在⽆意间使⽤了不必要的显式注解，导致写出了⼀个限制极其严格的⽅法。

```rust
#[derive(Debug)]
struct NumRef<'a>(&'a i32);

impl<'a> NumRef<'a> {
    // 我定义的泛型结构体以 'a 为参数，这意味着我也需要给⽅法的参数
    // 标注为 'a ⽣命周期，对吗？（答案：错）
    fn some_method(&'a mut self) {}
}

fn main() {
    let mut num_ref = NumRef(&5);
    num_ref.some_method(); // 可变借⽤ num_ref 直⾄其⽣命周期结束
    num_ref.some_method(); // 编译错误
    println!("{:?}", num_ref); // 同样编译错误
}
```

如果我们有⼀个带 `'a` 泛型参数的结构体，我们⼏乎不可能去写⼀个带 `&'a mut self` 参数的⽅法。因为这相当于告诉 Rust “这个⽅法将独占借⽤该对象，直到对象⽣命周期结束”。实际上，这意味着 Rust 的借⽤检查器只会允许在该对象上调⽤⾄多⼀次 `some_method`, 此后该对象将⼀直被独占借⽤并会因此变得不再可⽤。这种⽤例极其罕⻅，但是因为这种代码能够通过编译，所以那些对⽣命周期还感到困惑的初学者们很容易写出这种 bug. 修复这种 bug 的⽅式是去除掉不必要的显式⽣命周期注解，让 Rust ⽣命周期省略规则来处理它：

```rust
#[derive(Debug)]
struct NumRef<'a>(&'a i32);

impl<'a> NumRef<'a> {
    // 不再给 mut self 添加 'a 注解
    fn some_method(&mut self) {}

    // 上⼀⾏去掉语法糖后：
    fn some_method_desugared<'b>(&'b mut self){}
}

fn main() {
    let mut num_ref = NumRef(&5);
    num_ref.some_method();
    num_ref.some_method(); // 编译通过
    println!("{:?}", num_ref); // 编译通过
}
```

关键点回顾

- Rust 对函数的⽣命周期省略规则并不保证在任何情况下都正确
- 在程序的语义⽅⾯，Rust 并不⽐你懂
- 可以试试给你的⽣命周期注解起⼀个有意义的名字
- 试着记住你在哪⾥添加了显式⽣命周期注解，以及为什么要加

## 6) Boxed Trait Object对象不含⽣命周期注解

之前我们讨论了 Rust 对函数 的⽣命周期省略规则。Rust 对 trait 对象也存在⽣命周期省略规则，它
们是：

- 如果 trait 对象被⽤作泛型类型的⼀个类型参数，那么 trait 对象的⽣命周期约束会依据该类型参数
的定义进⾏推导
  - 若该类型参数有唯⼀的⽣命周期约束，则将这个约束赋给 trait 对象
  - 若该类型参数不⽌⼀个⽣命周期约束，则 trait 对象的⽣命周期约束需要显式标注
- 如果上⾯不成⽴，也就是说该类型参数没有⽣命周期约束，那么
  - 若 trait 定义时有且仅有⼀个⽣命周期约束，则将这个约束赋给 trait 对象
  - 若 trait 定义时⽣命周期约束中存在⼀个 `'static` , 则将 `'static` 赋给 trait 对象
  - 若 trait 定义时没有⽣命周期约束，则当 trait 对象是表达式的⼀部分时，⽣命周期从表达式中推导⽽出，否则赋予 `'static`

以上这些听起来特别复杂，但是可以简单地总结为⼀句话“⼀个 trait 对象的⽣命周期约束从上下⽂推导⽽出。”看下⾯这些例⼦后，我们会看到⽣命周期约束的推导其实很符合直觉，因此我们没必要去记忆上⾯的规则：

```rust
type T2 = Box<dyn Trait + 'static>;

// 展开前
impl dyn Trait {}
// 展开后
impl dyn Trait + 'static {}

// 展开前
type T3<'a> = &'a dyn Trait;
// 展开后，&'a T 要求 T: 'a, 所以推导为 'a
type T4<'a> = &'a (dyn Trait + 'a);

// 展开前
type T5<'a> = Ref<'a, dyn Trait>;
// 展开后，Ref<'a, T> 要求 T: 'a, 所以推导为 'a
type T6<'a> = Ref<'a, dyn Trait + 'a>;

trait GenericTrait<'a>: 'a {}

// 展开前
type T7<'a> = Box<dyn GenericTrait<'a>>;
// 展开后
type T8<'a> = Box<dyn GenericTrait<'a> + 'a>;

// 展开前
impl<'a> dyn GenericTrait<'a> {}
// 展开后
impl<'a> dyn GenericTrait<'a> + 'a {}
```

⼀个实现了 trait 的具体类型可以被引⽤，因此它们也会有⽣命周期约束，同样其对应的 trait 对象也有⽣命周期约束。你也可以直接对引⽤实现 trait, 引⽤显然是有⽣命周期约束的：

```rust
trait Trait {}

struct Struct {}
struct Ref<'a, T>(&'a T);

impl Trait for Struct {}
impl Trait for &Struct {} // 直接为引⽤类型实现 Trait
impl<'a, T> Trait for Ref<'a, T> {} // 为包含引⽤的类型实现 Trait
```

总之，这个知识点值得反复理解，新⼿在重构⼀个使⽤ trait 对象的函数到⼀个泛型的函数或者反过来时，常常会因为这个知识点⽽感到困惑。来看看这个示例程序：

```rust
use std::fmt::Display;

fn dynamic_thread_print(t: Box<dyn Display + Send>) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}

fn static_thread_print<T: Display + Send>(t: T) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}
```

这⾥编译器报错：

```text
error[E0310]: the parameter type `T` may not live long enough
  --> src/lib.rs:10:5
   |
9  | fn static_thread_print<T: Display + Send>(t: T) {
   |                        -- help: consider adding an explicit lifetime bound...: `T: 'static +`
10 |     std::thread::spawn(move || {
   |     ^^^^^^^^^^^^^^^^^^
   |
note: ...so that the type `[closure@src/lib.rs:10:24: 12:6 t:T]` will meet its required lifetime bounds
  --> src/lib.rs:10:5
   |
10 |     std::thread::spawn(move || {
   |     ^^^^^^^^^^^^^^^^^^
```

很好，编译器告诉了我们怎样修复这个问题，让我们修复⼀下。

```rust
use std::fmt::Display;

fn dynamic_thread_print(t: Box<dyn Display + Send>) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}

fn static_thread_print<T: Display + Send + 'static>(t: T) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}
```

现在它编译通过了，但是这两个函数对⽐起来看起来挺奇怪的，为什么第⼆个函数要求 `T` 满⾜ `'static` 约束⽽第⼀个函数不⽤呢？这是个刁钻的问题。事实上，通过⽣命周期省略规则，Rust ⾃动在第⼀个函数⾥推导并添加了⼀个 `'static` 约束，所以其实两个函数都含有 `'static` 约束。Rust 编译器实际看到的是这个样⼦的：

```rust
use std::fmt::Display;

fn dynamic_thread_print(t: Box<dyn Display + Send + 'static>) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}

fn static_thread_print<T: Display + Send + 'static>(t: T) {
    std::thread::spawn(move || {
        println!("{}", t);
    }).join();
}
```

关键点回顾

- 所有 trait 对象都含有⾃动推导的⽣命周期

## 7) 编译器的报错信息会告诉我怎样修复我的程序

**错误的推论**

- Rust 对 trait 对象的⽣命周期省略规则总是正确的
- Rust ⽐我更懂我程序的语义

这个误解是前两个误解的结合，来看⼀个例⼦：

```rust
use std::fmt::Display;

fn box_displayable<T: Display>(t: T) -> Box<dyn Display> {
    Box::new(t)
}
```

报错如下

```text
error[E0310]: the parameter type `T` may not live long enough
 --> src/lib.rs:4:5
  |
3 | fn box_displayable<T: Display>(t: T) -> Box<dyn Display> {
  |                    -- help: consider adding an explicit lifetime bound...: `T: 'static +`
4 |     Box::new(t)
  |     ^^^^^^^^^^^
  |
note: ...so that the type `T` will meet its required lifetime bounds
 --> src/lib.rs:4:5
  |
4 | Box::new(t)
  | ^^^^^^^^^^^
```

好，让我们按照编译器的提示进⾏修复。这⾥我们先忽略⼀个事实：返回值中装箱的 trait 对象有⼀个⾃动推导的 `'static` 约束，⽽编译器是基于这个没有显式说明的事实给出的修复建议。

```rust
use std::fmt::Display;

fn box_displayable<T: Display + 'static>(t: T) -> Box<dyn Display> {
    Box::new(t)
}
```

现在可以编译通过了，但这真的是我们想要的吗？可能是，也可能不是，编译器并没有提到其他修复⽅案，但下⾯这个也是⼀个合适的修复⽅案。

```rust
use std::fmt::Display;

fn box_displayable<'a, T: Display + 'a>(t: T) -> Box<dyn Display + 'a> {
    Box::new(t)
}
```

这个函数所能接受的实际参数⽐前⼀个函数多了不少！这个函数是不是更好？确实，但不⼀定必要，这取决于我们对程序的要求与约束。上⾯这个例⼦有点抽象，所以让我们看⼀个更简单明了的例⼦：

```rust
fn return_first(a: &str, b: &str) -> &str {
    a
}
```

报错

```text
error[E0106]: missing lifetime specifier
 --> src/lib.rs:1:38
1 | fn return_first(a: &str, b: &str) -> &str {
  |                    ----     ----     ^ expected named lifetime parameter
  = help: this function's return type contains a borrowed value, but the
signature does not say whether it is borrowed from `a` or `b`
help: consider introducing a named lifetime parameter
  |
  |
  |
1 | fn return_first<'a>(a: &'a str, b: &'a str) -> &'a str {
  |                ^^^^    ^^^^^^^     ^^^^^^^     ^^^
```

这个错误信息推荐我们给所有输⼊输出都标注上同样的⽣命周期注解。如果我们这么做了，那么程序将通过编译，但是这样写出的函数过度限制了返回类型。我们真正想要的是这个：

```rust
fn return_first<'a>(a: &'a str, b: &str) -> &'a str {
    a
}
```

关键点回顾

- Rust 对 trait 对象的⽣命周期省略规则并不保证在任何情况下都正确
- 在程序的语义⽅⾯，Rust 并不⽐你懂
- Rust 编译错误的提示信息所提出的修复⽅案并不⼀定能满⾜你对程序的需求

## 8) ⽣命周期可以在运⾏时动态变⻓或变短

错误的推论

- 容器类可以在运⾏时交换其内部的引⽤，从⽽改变⾃身的⽣命周期
- Rust 借⽤检查器能进⾏⾼级的控制流分析

这个编译不通过：

```rust
struct Has<'lifetime> {
    lifetime: &'lifetime str,
}

fn main() {
    let long = String::from("long");
    let mut has = Has { lifetime: &long };
    assert_eq!(has.lifetime, "long");

    {
        let short = String::from("short");
        // “转换到” 短的⽣命周期
        has.lifetime = &short;
        assert_eq!(has.lifetime, "short");

        // “转换回” ⻓的⽣命周期（实际是并不是）
        has.lifetime = &long;
        assert_eq!(has.lifetime, "long");
        // `short` 变量在这⾥ drop
    }

    // 编译失败， `short` 在 drop 后仍旧处于 “借⽤” 状态
    assert_eq!(has.lifetime, "long");
}
```

报错：

```text
error[E0597]: `short` does not live long enough
 --> src/main.rs:11:24
   |
11 | has.lifetime = &short;
   |                ^^^^^^ borrowed value does not live long enough
...
15 | }
   | - `short` dropped here while still borrowed
16 | assert_eq!(has.lifetime, "long");
   | --------------------------------- borrow later used here
```

下⾯这个还是报错，报错信息也和上⾯⼀样：

```rust
struct Has<'lifetime> {
    lifetime: &'lifetime str,
}

fn main() {
    let long = String::from("long");
    let mut has = Has { lifetime: &long };
    assert_eq!(has.lifetime, "long");

    // 这个代码块逻辑上永远不会被执⾏
    if false {
        let short = String::from("short");
        // “转换到” 短的⽣命周期
        has.lifetime = &short;
        assert_eq!(has.lifetime, "short");

        // “转换回” ⻓的⽣命周期（实际是并不是）
        has.lifetime = &long;
        assert_eq!(has.lifetime, "long");
        // `short` 变量在这⾥ drop
    }

    // 还是编译失败， `short` 在 drop 后仍旧处于 “借⽤” 状态
    assert_eq!(has.lifetime, "long");
}
```

⽣命周期必须在编译时被静态确定，⽽且 Rust 借⽤检查器只会做基本的控制流分析，所以它假设每个 `if-else` 块和 `match` 块的每个分⽀都能被执⾏，然后**选出⼀个最短的⽣命周期赋给块中的变量**。⼀旦⼀个变量被⼀个⽣命周期约束了，那么它将 永远 被这个⽣命周期所约束。**⼀个变量的⽣命周期只能缩短，⽽且所有的缩短时机都在编译时确定。**

## 9) 将独占引⽤(`&mut`)降级为共享引⽤(`&`)是 safe 的

错误的推论

- 通过重借⽤引⽤内部的数据，能抹掉其原有的⽣命周期，然后赋⼀个新的上去

你可以将⼀个独占引⽤作为参数传给⼀个接收共享引⽤的函数，因为 Rust 将隐式地重借⽤独占引⽤内部的数据，⽣成⼀个共享引⽤：

```rust
fn takes_shared_ref(n: &i32) {}

fn main() {
    let mut a = 10;
    takes_shared_ref(&mut a); // 编译通过
    takes_shared_ref(&*(&mut a)); // 上⾯那⾏去掉语法糖
}
```

这在直觉上是合理的，因为将⼀个独占引⽤转换为共享引⽤显然是⽆害的，对吗？令⼈讶异的是，这并不对，下⾯的这段程序不能通过编译：

```rust
fn main() {
    let mut a = 10;
    let b: &i32 = &*(&mut a); // 重借⽤为不可变引⽤
    let c: &i32 = &a;
    dbg!(b, c); // 编译失败
}
```

报错如下：

```text
error[E0502]: cannot borrow `a` as immutable because it is also borrowed as mutable
 --> src/main.rs:4:19
  |
3 |     let b: &i32 = &*(&mut a);
  |                     -------- mutable borrow occurs here
4 |     let c: &i32 = &a;
  |                   ^^ immutable borrow occurs here
5 | dbg!(b, c);
  |      - mutable borrow later used here
```

代码⾥确实有⼀个独占引⽤，但是它⽴即重借⽤变成了⼀个共享引⽤，然后⾃身就被 drop 掉了。但是为什么 Rust 好像把这个重借⽤出来的共享引⽤看作是有⼀个独占的⽣命周期呢？上⾯这个例⼦中，允许独占引⽤直接降级为共享引⽤是没有问题的，但是这个允许确实会导致潜在的内存安全问题。

```rust
use std::sync::Mutex;

struct Struct {
    mutex: Mutex<String>
}

impl Struct {
    // 将 self 的独占引⽤降级为 str 的共享引⽤
    fn get_string(&mut self) -> &str {
        self.mutex.get_mut().unwrap()
    }
    fn mutate_string(&self) {
        // 如果 Rust 允许独占引⽤降级为共享引⽤，那么下⾯这⼀⾏代码执⾏后，
        // 所有通过 get_string ⽅法返回的 &str 都将变为⾮法引⽤
        *self.mutex.lock().unwrap() = "surprise!".to_owned();
    }
}

fn main() {
    let mut s = Struct {
        mutex: Mutex::new("string".to_owned())
    };
    let str_ref = s.get_string(); // 独占引⽤降级为共享引⽤
    s.mutate_string(); // str_ref 失效，变成⾮法引⽤，现在是⼀个悬垂指针
    dbg!(str_ref); // 当然，实际上会编译错误
}
```

这⾥的关键点在于，你在重借⽤⼀个独占引⽤为共享引⽤时，就已经落⼊了⼀个陷阱：为了保证重借⽤得到的共享引⽤在其⽣命周期内有效，被重借⽤的独占引⽤也必须保证在这段时期有效，这延⻓了独占引⽤的⽣命周期！哪怕独占引⽤⾃身已经被 drop 掉了，但独占引⽤的⽣命周期却⼀直延续到共享引⽤的⽣命周期结束。使⽤重借⽤得到的共享引⽤是很难受的，因为它明明是⼀个共享引⽤但是却不能和其他共享引⽤共存。重借⽤得到的共享引⽤有着独占引⽤和共享引⽤的缺点，却没有⼆者的优点。我认为重借⽤⼀个独占引⽤为共享引⽤的⾏为应当被视为 Rust 的⼀种反模式。知道这种反模式是很重要的，当你看到这样的代码时，你就能轻易地发现错误了

```rust
// 将独占引⽤降级为共享引⽤
fn some_function<T>(some_arg: &mut T) -> &T;

struct Struct;

impl Struct {
    // 将独占的 self 引⽤降级为共享的 self 引⽤
    fn some_method(&mut self) -> &self;

    // 将独占的 self 引⽤降级为共享的 T 引⽤
    fn other_method(&mut self) -> &T;
}
```

尽管你可以在函数和⽅法的声明⾥避免重借⽤，但是由于 Rust 会⾃动做隐式重借⽤，所以很容易⽆意识地遇到这种情况

```rust
use std::collections::HashMap;

type PlayerID = i32;

#[derive(Debug, Default)]
struct Player {
    score: i32,
}

fn start_game(player_a: PlayerID, player_b: PlayerID, server: &mut HashMap<PlayerID, Player>) {
    // 从 server 中得到 player, 如果不存在就创建⼀个默认的 player 并得到这个新创建的。
    let player_a: &Player = server.entry(player_a).or_default();
    let player_b: &Player = server.entry(player_b).or_default();

    // 对得到的 player 做⼀些操作
    dbg!(player_a, player_b); // 编译错误
}
```

上⾯这段代码会编译失败。这⾥ `or_default()` 会返回⼀个 `&mut Player`，但是由于我们添加了⼀个显式的类型标注，它会被隐式重借⽤成 `&Player`。⽽为了达成我们真正的⽬的，我们不得不这样做：

```rust
use std::collections::HashMap;

type PlayerID = i32;

#[derive(Debug, Default)]
struct Player {
    score: i32,
}

fn start_game(player_a: PlayerID, player_b: PlayerID, server: &mut HashMap<PlayerID, Player>) {
    // 因为编译器不允许这两个返回值共存，所有这⾥直接丢弃这两个 &mut Player
    server.entry(player_a).or_default();
    server.entry(player_b).or_default();

    // 再次获取 player, 这次我们直接拿到共享引⽤，避免隐式的重借⽤
    let player_a = server.get(&player_a);
    let player_b = server.get(&player_b);

    // 对得到的 player 做⼀些操作
    dbg!(player_a, player_b); // 现在能编译通过了
}
```

难⽤，⽽且很蠢，但这是我们为了内存安全这⼀信条所做出的牺牲。

**关键点回顾**

- 尽量避免重借⽤⼀个独占引⽤为共享引⽤，不然你会遇到很多麻烦
- 重借⽤⼀个独占引⽤并不会结束其⽣命周期，哪怕它⾃身已经被 drop 掉了

## 10) 对闭包的⽣命周期省略规则和函数⼀样

这更像是 Rust 的陷阱⽽⾮误解尽管闭包可以被当作是⼀个函数，但是并不遵循和函数同样的⽣命周期省略规则。

```rust
fn function(x: &i32) -> &i32 {
    x
}

fn main() {
    let closure = |x: &i32| x;
}
```

报错：

```text
error: lifetime may not live long enough
 --> src/main.rs:6:29
  |
6 | let closure = |x: &i32| x;
  |                   -   - ^ returning this value requires that `'1` must outlive `'2`
  |                   |   |
  |                   |   return type of closure is &'2 i32
  |                   let's call the lifetime of this reference `'1`
```

去掉语法糖后，我们得到的是：

```rust
// 输⼊的⽣命周期应⽤到了输出上
fn function<'a>(x: &'a i32) -> &'a i32 {
    x
}

fn main() {
    // 输⼊和输出有它们⾃⼰各⾃的⽣命周期
    let closure = for<'a, 'b> |x: &'a i32| -> &'b i32 { x };
    // 注意：上⼀⾏并不是合法的语句，但是我们需要它来描述我们⽬的
}
```

出现这种差异并没有什么好处。只是在闭包最初的实现中，使⽤的类型推断语义与函数不同，⽽现在将⼆者做⼀个统⼀将是⼀个 breaking change, 因此现在已经没法改了。那么我们怎么显式地标注⼀个闭包的类型呢？我们有以下⼏种⽅案：

```rust
fn main() {
    // 转换成 trait 对象，但这样是不定长的，所以会编译错误
    let identity: dyn Fn(&i32) -> &i32 = |x: &i32| x;
    
    // 可以分配到堆上作为代替方案，但是在这里堆分配感觉有点蠢
    let identity: Box<dyn Fn(&i32) -> &i32> = Box::new(|x: &i32| x);

    // 可以不⽤堆分配⽽直接创建⼀个 'static 引⽤
    let identity: &dyn Fn(&i32) -> &i32 = &|x: &i32| x;

    // 上⼀⾏去掉语法糖 :)
    let identity: &'static (dyn for<'a> Fn(&'a i32) -> &'a i32 + 'static) = &|x: &i32| -> &i32 { x };

    // 这看起来很完美，但可惜不符合语法
    let identity: impl Fn(&i32) -> &i32 = |x: &i32| x;

    // 这个也⾏，但也不符合语法
    let identity = for<'a> |x: &'a i32| -> &'a i32 { x };

    // 但是 "impl trait" 可以作为函数的返回值类型
    fn return_identity() -> impl Fn(&i32) -> &i32 {
        |x| x
    }
    let identity = return_identity();

    // 上⼀个解决⽅案的泛化版本
    fn annotate<T, F>(f: F) -> F where F: Fn(&T) -> &T {
        f
    }
    let identity = annotate(|x: &i32| x);
}
```

我想你应该注意到了，在上⾯的例⼦中，如果对闭包应⽤ trait 约束，闭包会和函数遵循同样的⽣命周期省略规则。这⾥没有什么现实的教训或⻅解，只是说明⼀下闭包是这样的。

**关键点回顾**

- 每个语⾔都有其陷阱
- 避免在闭包中使⽤⽣命周期！

## 11) `'static` 引⽤总能被强制转换为 `'a` 引⽤

我之前有过这样的代码：

```rust
fn get_str<'a>() -> &'a str; // 泛型版本
fn get_str() -> &'static str; // 'static 版本
```

两者之间是否有实际的差异。我⼀开始并不确定，但⼀番研究过后遗憾地发现，是的，这⼆者确实有差异。通常在使⽤值时，我们能⽤ `'static` 引⽤直接代替⼀个 `'a` 引⽤，因为 Rust 会⾃动把 `'static` 引⽤强制转换为 `'a` 引⽤。直觉上这很合理，因为在⼀个对⽣命周期要求⽐较短的地⽅⽤⼀个⽣命周期⽐较⻓的引⽤绝不会导致任何内存安全问题。下⾯的这段代码通过编译，和预期⼀致：

```rust
use rand;
fn generic_str_fn<'a>() -> &'a str {
    "str"
}

fn static_str_fn() -> &'static str {
    "str"
}

fn a_or_b<T>(a: T, b: T) -> T {
    if rand::random() {
        a
    } else {
        b
    }
}

fn main() {
    let some_string = "string".to_owned();
    let some_str = &some_string[..];
    let str_ref = a_or_b(some_str, generic_str_fn()); // 编译通过
    let str_ref = a_or_b(some_str, static_str_fn()); // 编译通过
}
```

然⽽当引⽤作为函数类型签名的⼀部分时，强制类型转换并不⽣效。所以下⾯这段代码不能通过编译：

```rust
use rand;
fn generic_str_fn<'a>() -> &'a str {
    "str"
}

fn static_str_fn() -> &'static str {
    "str"
}

fn a_or_b_fn<T, F>(a: T, b_fn: F) -> T
    where F: Fn() -> T
{
    if rand::random() {
        a
    } else {
        b_fn()
    }
}

fn main() {
    let some_string = "string".to_owned();
    let some_str = &some_string[..];
    let str_ref = a_or_b_fn(some_str, generic_str_fn); // 编译通过
    let str_ref = a_or_b_fn(some_str, static_str_fn); // 编译错误
}
```

报错如下：

```text
error[E0597]: `some_string` does not live long enough
 --> src/main.rs:23:21
   |
23 | let some_str = &some_string[..];
   |                 ^^^^^^^^^^^ borrowed value does not live long enough
...
25 | let str_ref = a_or_b_fn(some_str, static_str_fn);
   |               ---------------------------------- argument requires that `some_string` is borrowed for `'static`
26 | }
   | - `some_string` dropped here while still borrowed
```

很难说这是不是 Rust 的⼀个陷阱，把 `for<T> Fn() -> &'static T` 强制转换为 `for<'a, T> Fn() -> &'a T` 并不是⼀个像把 `&'static str` 强制转换为 `&'a str` 这样简单直⽩的情况。前者是类型之间的转换，后者是值之间的转换。

**关键点回顾**

- `for <'a，T> fn（）->＆'a T` 签名的函数⽐ `for <T> fn（）->＆'static T` 签名的函数要更灵活，并且泛⽤于更多场景

# 3. 总结

因为静态分析技术的局限以及 Rust 的保守性，可以看到 Rust 在内存安全做了很多看似很傻的实现（对于 C++ ⾼⼿来说实际上也很傻的）。对于恼羞成怒的 Rust 新⼿（包括作者本⼈），可以会⼀怒之下就 `unsafe{}` 就开始像写 C ⼀样写 Rust 了，但这显然违背了 Rust 这⻔语⾔的初衷。同时这⾥⾯提到的基于⽣命周期可能发⽣的内存安全问题，也能给 modern C++ 的程序员带来启发，并不是懂点指针和⾯向对象就能说⾃⼰会 C++ 的，⼀个资深的 C++ 程序员要时刻考虑内存安全问题。safe Rust 的好处就是，通过看似很傻的⽣命周期机制，尽可能的去帮程序员规避内存安全问题。

- `T` 是 `&T` 和 `&mut T` 的超集
- `&T` 和 `&mut T` 是不相交的集合
- `T: 'static` 应当视为 “ `T` 满⾜ `'static` ⽣命周期约束”
- 若 `T: 'static` 则 `T` 可以是⼀个有 `'static` ⽣命周期的引⽤类型 或 是⼀个所有权类型
- 因为 `T: 'static` 包括了所有权类型，所以 `T`
  - 可以在运⾏时动态分配
  - 不需要在整个程序运⾏期间都有效
  - 可以安全，⾃由地修改
  - 可以在运⾏时被动态的 drop
  - 可以有不同⻓度的⽣命周期
- `T: 'a` ⽐ `&'a T` 更泛化，更灵活
- `T: 'a` 接受所有权类型，内部含有引⽤的所有权类型，和引⽤
- `&'a T` 只接受引⽤
- 若 `T: 'static` 则 `T: 'a` 因为对于所有 `'a` 都有 `'static >= 'a`
- ⼏乎所有的 Rust 代码都是泛型代码，并且到处都带有被省略掉的泛型⽣命周期注解e
- Rust ⽣命周期省略规则并不保证在任何情况下都正确
- 在程序的语义⽅⾯，Rust 并不⽐你懂
- 可以试试给你的⽣命周期注解起⼀个有意义的名字
- 试着记住你在哪⾥添加了显式⽣命周期注解，以及为什么要
- 所有 trait 对象都含有⾃动推导的⽣命周期
- Rust 编译错误的提示信息所提出的修复⽅案并不⼀定能满⾜你对程序的需求
- ⽣命周期在编译时被静态确定
- ⽣命周期在运⾏时不能被改变
- Rust 借⽤检查器假设所有代码路径都能被执⾏，所以总是选择尽可能短的⽣命周期赋给变量
- 尽量避免重借⽤⼀个独占引⽤为共享引⽤，不然你会遇到很多麻烦
- 重借⽤⼀个独占引⽤并不会结束其⽣命周期，哪怕它⾃身已经被 drop 掉了
- 每个语⾔都有其陷阱
- `for <'a，T> fn（）->＆'a T` 签名的函数⽐ `for <T> fn（）->＆'static T` 签名的函数要更灵活，并且泛⽤于更多场合。
