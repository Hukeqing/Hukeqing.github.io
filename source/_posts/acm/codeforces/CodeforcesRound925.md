---
title: Codeforces Round 925 (Div. 3)
date: 2024-04-06 14:44:35
updated: 2024-04-06 14:44:35
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 925 (Div. 3) 个人写题记录
index_img: /image/acm/codeforces/CodeforcesRound925/G.png
---

# A. Recovering a Small String

## 大致题意

有一个字符串，长度固定为 $3$ 个字母，将其的每个字母对应的字母下标相加的值已知，问字典序最小的字符串是多少

## 思路

简单题，从后往前考虑即可，后面的尽可能大就是前面尽可能小

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> str(3);
        str[2] = min(26, n - 2);
        n -= str[2];
        str[1] = min(26, n - 1);
        n -= str[1];
        str[0] = n;
        cout << (char)(str[0] + 'a' - 1) << (char)(str[1] + 'a' - 1) << (char)(str[2] + 'a' - 1) << endl;
    }
}
```

# B. Make Equal

## 大致题意

有 $n$ 个水壶，每次允许将前面的水壶里的一部分水倒入到后面的水壶，问是否可能使得所有水壶的水一样多

## 思路

记录一个中间值，从前往后遍历，超过平均值就把超出部分加到中间值上，反之则减去，只要中间值不出现负数即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &i: data) cin >> i;
        int tar = 0;
        for (const auto &i: data) tar += i;
        tar /= n;
        int last = 0;
        bool flag = true;
        for (const auto& i:data) {
            last += i - tar;
            if (last < 0) flag = false;
        }
        cout << (flag ? "YES" : "No") << endl;
    }
}
```

# C. Make Equal Again

## 大致题意

有一段数组，允许最多选择一段区间，把区间的数值变成一个任意值，问最少需要选择多少的区间才能让整个数组变成一样的值

## 思路

看看最左边的值和最右边的值即可，如果一样就抓中间的，如果不一样就尝试一下都变成最左边的值或者最右边的值即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &i: data) cin >> i;
        // left
        int l = 0, r =  n - 1;
        while (l < n && data[l] == data[0]) ++l;
        while (r >= 0 && data[r] == data[n - 1]) -- r;
        if (data[0] == data[n - 1]) cout << max(r - l + 1, 0) << endl;
        else cout << min(n - l, r + 1) << endl;
    }
}
```

# D. Divisible Pairs

## 大致题意

已知一个数组，找出满足如下条件的 $i, j$ 对，问有多少对

- $(a\_i + a\_j) \space mod \space x = 0$
- $(a\_i - a\_j) \space mod \space y = 0$

## 思路

从取摸特点考虑，容易得出

{% raw %}
$$a_i \space mod \space x + a_j \space mod \space x = x$$
{% endraw %}

且

{% raw %}
$$a_i \space mod \space y = a_j \space mod \space y$$
{% endraw %}

所以只需要统计 $mod \space x$ 和 $mod \space y$ 的结果即可。我这里直接用了高位

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, x, y;
        cin >> n >> x >> y;
        map<int, int> cnt;
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            int a = tmp % x, b = tmp % y;
            auto iter = cnt.find(a << 32 | b);
            if (iter != cnt.end()) ans += iter->second;
            ++cnt[(a == 0 ? 0 : (x - a)) << 32 | b];
        }
        cout << ans << endl;
    }
}
```

# E. Anna and the Valentine's Day Gift

## 大致题意

有一个数组，两个人博弈

- A 每次允许将数组中的一个值，在 10 进制上做翻转，并清除掉前导 0
- B 每次允许将数组的两个值在十进制上直接拼接在一块

问最终得到的唯一一个的数值和 $10^m$ 的大小关系是什么

## 思路

一个是要通过翻转来删除后缀 0，能够有效的减少最终数值的长度，而另外一个可以拼接把后缀 0 隐藏在数值内部，所以只需要考虑所有的后缀 0 长度即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<int> data(n);
        int tot = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            for (int j = 1000000000, k = 9; j >= 1; j /= 10, --k)
                if (tmp % j == 0) {
                    data[i] = k;
                    break;
                }
            for (int j = 1000000000, k = 10; j >= 1; j /= 10, --k)
                if (tmp >= j) {
                    tot += k;
                    break;
                }
        }
        sort(data.begin(), data.end(), greater<>());
        for (int i = 0; i < n; i += 2) tot -= data[i];
        cout << (tot > m ? "Sasha" : "Anna") << endl;
    }
}
```

# F. Chat Screenshots

## 大致题意

有一个未知的默认的初始的排列，现在给出 $k$ 个通过其演变来的数组，演变的方式是将原始数组中的某一个值提到最开头，其他值顺序不变

问这些数组是否来自同一个初始的排列

## 思路

放弃第一个值，直接拓扑即可，能拓扑就是成功

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        vector<vector<int>> data(k);
        for (auto &v: data) {
            v.resize(n);
            for (auto &i: v) cin >> i;
        }

        if (k == 1) {
            cout << "YES" << endl;
            continue;
        }

        vector<set<int>> map(n);
        for (const auto &v: data) for (int i = 2; i < n; ++i) map[v[i - 1] - 1].insert(v[i] - 1);

        vector<int> deg(n);
        for (const auto &v: map) for (const auto &i: v) ++deg[i];
        queue<int> q;
        int cnt = 0;
        for (int i = 0; i < n; ++i) if (!deg[i]) q.push(i);
        while (!q.empty()) {
            auto cur = q.front();
            q.pop();
            ++cnt;
            for (const auto& i: map[cur]) if (!--deg[i]) q.push(i);
        }
        cout << (cnt == n ? "YES" : "NO") << endl;
    }
}
```

# G. One-Dimensional Puzzle

## 大致题意

有 4 种方块，现在需要把它们拼接在一行里，问有多少种排列方式

![G](/image/acm/codeforces/CodeforcesRound925/G.png)

## 思路

显然，当不存在 1 和 2 的时候，同时仅存在 3 和 4 的时候，那么

- 如果只有 3 或者 4，那么只有一种排法
- 如果同时有 3 和 4，那么就没有排法

接下来要考虑的肯定是 1 和 2 至少其中一个有的情况。

也容易发现，3 和 4 本质上并不会改变接口的形状，只是增长了一些现有的结构罢了，所以容易得出，3 / 4 在是否能够排列出这件事上，不重要

而 1 和 2 不一样，前者会减少一个凹形，后者会减少一个凸形，而一个 1 只会引入两个凸形，如果恰好，2 的数量比 1 多两个，那么必然会导致无法组成一行

同理，1 比 2 多两个也会导致组成不了形状。实际上也很容易得出，一定上组成 1/2/1/2/1/2 这样的依次排列形状（先不考虑 3/4）

所以如果 1 和 2 一样多，那么就可以得到 1/2/1/2 这样的组合，同时也可以得到 2/1/2/1 这样的组合。
如果恰好差一个，那么必然是 1/2/1/2/1 或者 2/1/2/1/2 其中之一，显然此时分成了两种情况考虑

接下来看 3/4 的情况，实际上 3/4 就是往 1/2 组成的结构里插入即可，于是问题就回到了在 $n$ 个和盒子中放 $m$ 个苹果的问题，注意可以空箱子

即答案就是 $\begin{pmatrix} n + m - 1 \\\\ m - 1 \end{pmatrix}$

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        constexpr int mod = 998244353;
        auto qp = [&](int a, int p) {
            int res = 1;
            while (p) {
                if (p & 1) res = res * a % mod;
                a = a * a % mod;
                p >>= 1;
            }
            return res;
        };
        auto inv = [&](int v) { return qp(v, mod - 2); };
        auto step = [&](int n) {
            int res = 1;
            for (int i = 2; i <= n; ++i) res = res * i % mod;
            return res;
        };
        auto cal = [&](int n, int m) {
            int a = step(n + m -1), b = step(m - 1), c = step(n);
            a = a * inv(b) % mod;
            a = a * inv(c) % mod;
            return a;
        };

        int c1, c2, c3, c4;
        cin >> c1 >> c2 >> c3 >> c4;
        if (abs(c1 - c2) > 1 || (c1 == 0 && c2 == 0 && c3 != 0 && c4 != 0)) {
            cout << 0 << endl;
            continue;
        }
        if (c1 == 0 && c2 == 0) {
            cout << 1 << endl;
            continue;
        }
        int ans = 1;
        int tmp = max(c1, c2);
        if (c1 == c2) {
            int ans1 = 1, ans2 = 1;
            if (c3 != 0) {
                ans1 = ans1 * cal(c3, tmp) % mod;
                ans2 = ans2 * cal(c3, tmp + 1) % mod;
            }
            if (c4 != 0) {
                ans2 = ans2 * cal(c4, tmp) % mod;
                ans1 = ans1 * cal(c4, tmp + 1) % mod;
            }
            ans = (ans1 + ans2) % mod;
        }
        else {
            if (c3 != 0) ans = ans * cal(c3, tmp) % mod;
            if (c4 != 0) ans = ans * cal(c4, tmp) % mod;
        }
        cout << ans << endl;
    }
}
```
