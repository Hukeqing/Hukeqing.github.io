---
title: Codeforces Round 942 (Div. 2)
date: 2024-05-05 00:39:10
updated: 2024-05-05 00:39:10
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 942 (Div. 2) 个人写题记录
#index_img:
---

# A. Contest Proposal

## 大致题意

有两个数组 $a, b$，已经从小到大排序好了，现在往 $a$ 数组最前面再塞入几个值，同时从最后面删除相同数量的值，使得 $\forall i \in [1, n], a\_i \leq b\_i$

## 思路

简单题，由于数据量很小，甚至可以暴力

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (auto &i: a) cin >> i;
    for (auto &i: b) cin >> i;
    int l = 0, r = 0, ans = 0;
    while (l < n && r < n) {
        if (a[l] <= b[r]) {
            ++l;
            ++r;
        } else {
            ++ans;
            ++r;
        }
    }
    cout << ans << endl;
}
```

# B. Coin Games

## 大致题意

有两个人做游戏，有几个英镑再桌面上，有些正面朝上有些背面朝上。

每次操作，允许移走一个正面朝上的，然后连续选择两个剩下的影片进行翻转

问谁会操作到最后一次

## 思路

翻转两个硬币等于没有翻转

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    string str;
    str.resize(n);
    cin >> str;
    int cnt = 0;
    for (const auto& c: str) cnt += c == 'U';
    cout << (cnt % 2 ? "YES" : "NO") << endl;
}
```

# C. Permutation Counting

## 大致题意

有 $n$ 种卡片，每种都有一定数量，现在允许额外再增加 $k$ 张，使得这些卡片可以组成一个数组，数组种的存在的 $[1, n]$ 的排列的子串尽可能多，问可以有多少个

## 思路

只需要 $1, 2, 3, \dots, n, 1, 2, 3, \dots n$ 类似这样排列即可，通过二分找出每个数值都能到达的数量，然后排列起来

然后是剩下的那部分，比如多了一个 $1$，那么按照上面的排列方式，将 $1$ 放在最后面还能再多一次，即每有一个多出来的种类，就能增加一个子串

## AC code

```cpp
#define int long long

void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> data(n);
    for (auto &i: data) cin >> i;
    auto check = [&](int x) {
        int use = 0;
        for (const auto &v: data) {
            if (v < x) use += x - v;
            if (use > k) break;
        }
        return use <= k;
    };

    int l = 0, r = 1e15;
    while (l + 1 < r) {
        int mid = (l + r) >> 1;
        if (check(mid)) l = mid;
        else r = mid;
    }
    int ans = 0, use = k;
    for (const auto& v: data) {
        if (v > l) ++ans;
        else use -= l - v;
    }
    ans = min(n, use + ans);

    cout << ans + (l - 1) * n + 1 << endl;
}
```

# D1. Reverse Card (Easy Version)

## 大致题意

给出 $n, m$，求满足条件的 $a, b$ 对

- $1 \leq a \leq n, 1 \leq b \leq m$
- $(a + b) \space mod \space b \times gcd(a, b) = 0$

## 思路

假定 $a = x \times y, b = x \times z$，且 $gcd(y, z) = 1$
则可以得到

{% raw %}
$$          & (a + b) \space mod \space b \times gcd(a, b) = 0 \\
\rightarrow & x \times y + x \times z = t \times (x \times z \times x) \\
\rightarrow & y + z = t \times x \time z \\
\rightarrow & 1 + \frac{y}{z} = t \times x \\
$$
{% endraw %}

容易得到，必然 $\frac{y}{z}$ 是整数，而 $gcd(y, z) = 1$，所以 $z = 1$，故 $1 + y = t \times x$

所以很容易得到公式进行计算

## AC code

```cpp
#define int long long

void solve() {
    int n, m, ans = 0;
    cin >> n >> m;
    for (int i = 1; i <= n && i <= m; ++i) {
        int my = n / i;
        ans += (my + 1) / i;
    }
    cout << ans - 1 << endl;
}
```

# D2. Reverse Card (Hard Version)

## 大致题意

给出 $n, m$，求满足条件的 $a, b$ 对

- $1 \leq a \leq n, 1 \leq b \leq m$
- $b \times gcd(a, b) \space mod \space (a + b) = 0$

## 思路

假定 $a = x \times y, b = x \times z$，且 $gcd(y, z) = 1$
则可以得到

{% raw %}
$$          & b \times gcd(a, b) \space mod \space (a + b) = 0 \\
\rightarrow & x \times z \times x = t \times (x \times y + x \times z) \\
\rightarrow & x \times z = t \times (y + z) \\
\rightarrow & x \times = \frac{t}{z} \times (y + z)
$$
{% endraw %}

容易得到，必然 $\frac{y}{z}$ 是整数，而 $gcd(y, z) = 1$，所以必然只能用 $t$ 来承接除过来的 $z$，即上述公式中的表达

所以可以根据公式得到，只需要找到合理的互质数 $y, z$，即可找出有多少个 $x$ 满足条件，因为 $t$ 可以是任意值，即 $x$ 是 $y + z$ 的倍数

## AC code

```cpp
#define int long long

void solve() {
    int n, m, ans = 0;
    cin >> n >> m;
    if (n < 2 || m < 2) {
        cout << 0 << endl;
        return;
    }

    function<int(int, int)> gcd = [&](int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    };

    for (int i = 1; i * i <= n; ++i) {
        for (int j = 1; j * j <= m; ++j) {
            if (gcd(i, j) != 1) continue;

            ans += min(n / i, m / j) / (i + j);
        }
    }
    cout << ans << endl;
}
```
