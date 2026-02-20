---
title: Codeforces Round 1079 (Div. 2)
date: 2026-02-21 01:01:09
updated: 2026-02-21 01:01:09
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1079 (Div. 2) 个人写题记录
#index_img:
---

很久没有写题了，最近也想稍微恢复一下自己的脑子，经常让 AI 帮忙写也容易脑子生锈，特别是今天这场，一个明显的暴力题却卡了很久

# A. Friendly Numbers

## 大致题意

已知一个等式 $y - d(y) = x$，其中的 $d(y)$ 的意思是将 $y$ 的十进制的每一位求和。问给出 $x$ 的情况下有多少个可能的 $y$

## 思路

这道题是比较容易解决的，虽然 $x$ 和 $y$ 都有可能很大，不适合操作，但是 $d(y)$ 的范围是有限的，显然最大不可能超过 $90$，因为 $1 \leq x \leq 10^9$

那么我们枚举可能的 $d(y)$ 然后根据原等式得到 $y = x + d(y)$ 即可得到 $y$，再验证 $y$ 是不是一个合法的值（即 $d(y)$ 是否等于我们枚举的值即可）

## AC code

```cpp
bool sum(int x, int len, int target) {
    while (x) {
        --len;
        target -= x % 10;
        x /= 10;
    }
    return !len && !target;
}
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n;
        cin >> n;
        // get n length
        int len = 0, tmp = n;
        while (tmp) {
            ++len;
            tmp /= 10;
        }
 
        // test for len
        int ans = 0;
        for (int i = 0; i <= len * 9; ++i)
            ans += sum(n + i, len, i);
        for (int i = 0; i <= (len + 1) * 9; ++i)
            ans += sum(n + i, len + 1, i);
 
        cout << ans << endl;
    }
}
```

# B. Array and Permutation

## 大致题意

有两个长度都为 $n$ 的数组 $p$ 和 $a$，其中 $p$ 是 $n$ 的排列，现在允许你通过任意次以下操作，检查 $p$ 是否能够变成 $a$

- 选择 $p$ 中的一个值，将这个值拷贝给它的其中一个相邻的值

## 思路

显然，因为值的移动是通过将沿途的值都覆盖掉的方式进行的，例如如下的方式就会无法达成

```text
1  2  3
 \   /
  \ /
   X
   |\
   | \
x  3  1
```

因为 1 需要移动到第三个位置的时候，必然第 1、2、3 个位置都会变成 1，即第三个位置的 3 就会被覆盖掉。而因为 $p$ 是 $n$ 的排列，所以一旦被覆盖了 3 之后，就再也无法创造 3 出来了

所以核心的思路是：如果 $p$ 一个值在 $a$ 中出现，那么这个值在 $p$ 中的左边的值，不可以再次出现，不然就会出现上面的交叉

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n;
        cin >> n;
        vector<int> p(n), a(n);
        for (int i = 0; i < n; ++i) cin >> p[i];
        for (int i = 0; i < n; ++i) cin >> a[i];
 
        int t = 0;
        bool ans = true;
        for (int i = 0; i < n; ++i) {
            while (t < n && p[t] != a[i]) ++t;
            if (p[t] != a[i]) ans = false;
        }
 
        cout << (ans ? "YES" : "NO") << endl;
    }
}
```

# C. Game with a Fraction

## 大致题意

Alice 和 Bob 的博弈。有两个数字 $p, q$，现在每一轮要求他们选择其中一个值，并将其减去 $1$，Alice 先手。
如果在某一时刻出现 $\frac{p}{q} = \frac{2}{3}$ 的时候，认为 Bob 胜出，否则 为 Alice 胜出

## 思路

除开开局胜利的情况，Bob 只有一种可能的胜利办法：$\frac{2x + n}{3x + n}$ 给到 Alice 的时候，Alice 无法阻止生成一个 $\frac{2}{3}$，
因为 Bob 只需要根据 Alice 的操作，操作另外一个数值即可

而只要给到 Alice 的不是这种场景，Alice 都可以很容易避免出现，例如 $\frac{2x}{3x + 1}$ 给到 Alice，Alice 可以选择让 $p - 1$ 来避开必败逻辑

所以必须开局的数值满足上面的公式才行

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int p, q;
        cin >> p >> q;
        int x = p * 3 - 2 * q;
        cout << (x >= 0 && p - x >= 2 ? "Bob" : "Alice") << endl;
    }
}
```

# D. Another Problem about Beautiful Pairs

## 大致题意

有一个数组，要求你找有多少对下标满足 $a_i \times a_j = j - i$

## 思路

其实就是个暴力题，遍历每一个位置，为这个位置寻找可能存在配对的值即可

注意这道题需要考虑一个非常巧妙的点：
正常情况下，这段代码类似埃氏筛，外层 `for (int i = 2; i < n; ++i)` 内层 `for (int j = i; i * J < n; ++j)` 这样。
当然这里是用类似埃氏筛的代码举例，实际可以参考下面的代码，直接使用有的值，而不是遍历所有可能的 `j`。
但是这道题却要反过来，即外层 `for (int i = 2; i < n; ++i)` 内层 `for (int j = 2; j <= i; ++j)` 这样。

这个问题主要在于，对于比较小的值，前者的写法内循环次数会更高，而后者的写法可以有效降低内循环次数。

至于为啥对于较大的数值，并不会有较大影响呢？很简单，因为对于 `1` 而言，其需要固定遍历所有值，而对于超过 $\frac{n}/x$ 的值而言，之多只需要遍历 $x$ 个值即可 

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n);
        set<int> cnt;
        for (int i = 0; i < n; ++i) {
            cin >> a[i];
            cnt.insert(a[i]);
        }
 
        int ans = 0;
        for (auto i = 0; i < n; ++i) {
            const auto end = cnt.upper_bound(a[i]);
            for (auto j = cnt.begin(); j != end; ++j) {
                const int v = a[i] * *j;
                if (v >= n) break;
                if (i - v >= 0 && a[i - v] == *j) ++ans;
                if (i + v < n && a[i + v] == *j && a[i] != *j) ++ans;
            }
        }
 
        cout << ans << endl;
    }
}
```
