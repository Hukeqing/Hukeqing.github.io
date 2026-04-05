---
title: Codeforces Round 1089 (Div. 2)
date: 2026-04-05 00:43:38
updated: 2026-04-05 00:43:38
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1089 (Div. 2) 个人写题记录
#index_img:
---

# A. A Simple Sequence

## 大致题意

要求你生成一个排列，满足

$a\_1 \space mod \space a\_2 \geq a\_2 \space mod \space a\_3 \dots a\_{n-2} \space mod \space a\_{n-1} \geq a\_{n-1} \space mod \space a\_n$

## 思路

由于这里可以是 $\geq$，而 $n \space n-1 = 1$，是一个显然的等式，所以直接倒序输出即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n;
        cin >> n;
        for (int i = n; i >= 1; --i) cout << i << " \n"[i == 1];
    }
}
```

# B. Simply Sitting on Chairs

## 大致题意

有一个 $n$ 的排列 $p$，然后需要完成如下操作：

从第一个值开始往后逐个选择，如果选择了这个值 $i$，那么接下来就不能选择 $p\_i$

问最多可以选多少个值

## 思路

其实也非常简单，只要选择的 $i \geq p\_i$ 就行了 

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n, ans = 0;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            int x;
            cin >> x;
            ans += x <= i + 1;
        }
        cout << ans << endl;
    }
}
```

# C2. A Simple GCD Problem

## 大致题意

有两个数组 $a, b$，都是长度 $n$，现在希望生成一个新的数组 $a'$，满足

$a'\_i \in \Set{a\_i, [1, b\_i]}, \forall \Set{l, r} (1 \leq l < r \leq n), gcd(a\_l, a\_{l+1}, a\_{l+2}, \dots, a\_{r}) = gcd(a'\_l, a'\_{l+1}, a'\_{l+2}, \dots, a'\_{r})$

问最多可以同时存在多少个 $a'\_i$ 满足 $a'\_i \neq a\_i$

## 思路

首先先分析题目中提到的 $gcd(a\_l, a\_{l+1}, a\_{l+2}, \dots, a\_{r}) = gcd(a'\_l, a'\_{l+1}, a'\_{l+2}, \dots, a'\_{r})$

看起来很吓人，实际上根据 $gcd$ 的性质，可以得到 $gcd(gcd(a, b), gcd(b, c)) = gcd(a, b, c)$

而题目中提到的是$\forall \Set{l, r} (1 \leq l < r \leq n)$，由于任意区间的 $gcd$ 等于这个区间里的相邻值的 $gcd$ 再做 $gcd$

所以要求条件可以转为: $\forall i (1 \leq i < n), gcd(a\_i, a\_{i+1}) = gcd(a'\_i, a'\_{i+1})$

要满足这条，我们需要先找出一个数组 $c$，满足 $c\_i = gcd(a\_i, a\_{i+1})$，这不是什么难事

显然我们可以得到，最终的 $a'$ 满足: $gcd(a'\_i, a'\_{i-1}) = c\_{i-1}, gcd(a'\_i, a'\_{i+1}) = c\_{i+1}$

根据 $gcd$ 的性质，我们可以得到 $a'\_i = x \times lcm(c\_{i-1}, c\_i), x \geq 1$

由此我们可以得到 $a'$ 数组的每一项的最小可选值，即 $a'\_i = lcm(c\_{i-1}, c\_i)$

至此，我们已经完成了 Easy Version 的题解。由于 $b\_i = a\_i$，所以如果 $lcm(c\_{i-1}, c\_i) = a\_i$，那么就不可能存在 $a'\_{i} \neq a\_{i}$

接下来是讨论 Hard 部分的解决方案

显然，如果 $lcm(c\_{i-1}, c\_i) \neq a\_i$ 的话，我们就可以选择令 $a'\_{i} = lcm(c\_{i-1}, c\_i)$，因为再乘上任何值都有可能让 $gcd$ 发生变化（变大）

接下来核心是要处理这些不满足的值，也就是 $lcm(c\_{i-1}, c\_i) = a\_i$ 的值，尝试找到一个 $x$ 使得 $x \times lcm(c\_{i-1}, c\_i) \neq a\_i$ 且不改变 $gcd$ 关系

由于不能改变 $gcd$ 关系，假定 $a'\_i = x\_i \times lcm(c\_{i-1}, c\_i)$，那么 $gcd(x\_i, a'\_{i-1}) = gcd(x\_i, a'\_{i+1}) = 1$

扩展后可以得到：

$gcd(x\_i, x\_{i-1}) = gcd(x\_i, x\_{i+1}) = gcd(x\_i, lcm(c\_{i-2}, c\_{i-1})) = gcd(x\_i, lcm(c\_{i}, c\_{i+1}))$

即有很多很多的互质

显然我们很容易想到用素数，因为任意两个素数之间肯定互质，由于本身是乘法，且只需要找到相互互质的值即可，所以只需要限制在较小的值内即可

我用了 100 以内的素数，通过 dp 的方式，枚举每一位乘上每一种素数的情况

我的 dp 算法里，下标 $x$ 表示第几个素数，其中 $0$ 表示 $lcm(c\_{i-1}, c\_i)$ 本体，而 $max(x)$ 表示 $a\_i$ 本身

## AC code

```cpp
#define int long long
 
int gcd(const int a, const int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}
 
void solve() {
    vector<int> primes;
    primes.push_back(1);
    vector isPrime(100, true);
    for (int i = 2; i < 100; i++) {
        if (isPrime[i]) {
            primes.push_back(i);
        }
        for (int j = i * i; j < 100 && j > 0; j += i) {
            isPrime[j] = false;
        }
    }

    int _;
    cin >> _;
    for (int ts = 1; ts <= _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n), b(n), c(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        for (int i = 0; i < n; i++) cin >> b[i];
 
        for (int i = 0; i < n; i++) {
            if (i == 0) {
                c[i] = gcd(a[0], a[1]);
            } else if (i == n - 1) {
                c[i] = gcd(a[i - 1], a[i]);
            } else {
                const int x = gcd(a[i - 1], a[i]);
                const int y = gcd(a[i] , a[i + 1]);
                c[i] = x * y / gcd(x, y);
            }
        }
        vector<int> dp[2];
        dp[0].resize(primes.size() + 1);
        dp[1].resize(primes.size() + 1);
        int cur = 0, nxt = 1, ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < primes.size() + 1; ++j) {
                const int v = j == primes.size() ? a[i] : c[i] * primes[j];
                dp[nxt][j] = -1;
                if (v > b[i] && v != a[i]) continue;
                if (i == 0) {
                    dp[nxt][j] = v != a[i];
                    continue;
                }
 
                for (int k = 0; k < primes.size() + 1; ++k) {
                    const int u = k == primes.size() ? a[i - 1] : c[i - 1] * primes[k];
                    if (gcd(u, v) == gcd(c[i - 1], c[i])) {
                        dp[nxt][j] = max(dp[nxt][j], dp[cur][k] + (v != a[i]));
                    }
                }
            }
            swap(cur, nxt);
        }
        for (auto x : dp[cur]) ans = max(ans, x);
        cout << ans << endl;
    }
}
```