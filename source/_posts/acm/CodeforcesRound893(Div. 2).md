---
title: Codeforces Round 893 (Div. 2)
date: 2023-08-19 14:39:32
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Buttons

## 大致题意

有 $1, 2, 3$ 三种按钮，其中 Anna 只能按 $1, 3$ 两种按钮，而 Katie 只能按 $2, 3$ 两种按钮。每个按钮只能按一次。

Anna 和 Katie 玩游戏，两人依次按按钮，Anna 先，直到谁没有按钮可以按，谁就输了，问谁会赢

## 思路

明显大家先抢着把 $3$ 按完就行了，因为 Anna 先开始按，所以为偶数则恰好对半分，为奇数则 Anna 多分到一个，然后计算谁按钮多就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, c;
        cin >> a >> b >> c;
        a += (c + 1) / 2;
        b += c / 2;
        cout << (a > b ? "First" : "Second") << endl;
    }
}
```

# B. The Walkway

## 大致题意

有一条路，路上有一些饼干店，饼干店的初始位置都确定，有一个人带着无限数量的饼干，从路的某一端匀速走到另外一端，每隔 $k$ 分钟没有吃饼干的情况下，他会吃掉背包里的一片饼干，如果刚刚遇到了饼干店的情况下，他也会吃掉一片饼干，在同一个时间点不会吃掉超过一片饼干，且在刚刚进入路的时候需要吃一片饼干。

你可以移除掉一个，最多一个饼干店，问最少只需要吃到多少饼干

## 思路

通过饼干店，可以分割成 $n$ 段，每一段吃掉的饼干数量等于 $\left \lceil \frac{pos\_{n} - pos\_{n-1}}{t} \right \rceil$，那么对于每一个饼干店 $i$，若其被移除掉，可以带来减少的饼干数量为 $\left \lceil \frac{pos\_{i + 1} - pos\_{i - 1}}{t} \right \rceil - \left \lceil \frac{pos\_{i} - pos\_{i - 1}}{t} \right \rceil - \left \lceil \frac{pos\_{i + 1} - pos\_{i}}{t} \right \rceil$

所以只需要枚举所有可能被干掉的饼干店，找到能减少的最大值就行了，注意一下，这里输出的最小饼干数量和能满足这个最小饼干数量的饼干店数量，而不是唯一那个位置

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, d;
        cin >> n >> m >> d;
        vector<int> data(m);
        for (int i = 0; i < m; ++i) cin >> data[i];
 
        int tot = 0, ans = 0, cnt = 0;
        int l = 1, r = data[1];
        for (int i = 0; i < m; ++i) {
            int tmp = (data[i] - l + d - 1) / d;
            tot += tmp;
            tmp += (r - data[i] + d - 1) / d;
            int del = (r - l + d - 1) / d;
            if (tmp - del > ans) {
                cnt = 1;
                ans = tmp - del;
            } else if (tmp - del == ans) cnt++;
            l = data[i];
            r = i + 2 < m ? data[i + 2] : n + 1;
        }
        tot += (r - data[m - 1] + d - 1) / d;
        cout << tot - ans << ' ' << cnt << endl;
    }
}
```

# C. Yet Another Permutation Problem

## 大致题意

给出一个 $n$ 的排列，使得所有相邻两个数的 $GCD$ 的值的种类足够多

## 思路

若相邻两个数字存在 $GCD$，那么必然这个 $GCD$ 小于等于其中的任意一个。而因为恰好是 $n$ 的排列，那么必然此 $GCD$ 的值本身一定存在与序列中。那么如果我直接取每个值以及其两倍的值放在一起，那么必然可以保证这个值可以存在。而且每个值的一半一定唯一，那么就可以得到唯一确认的绑定关系，然后排列即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<bool> vis(n + 1, false);
        vector<int> res;
        res.reserve(n);
        for (int i = 1; i <= n; ++i) {
            if (vis[i]) continue;
            res.push_back(i);
            vis[i] = true;
            int tmp = i * 2;
            while (tmp <= n) {
                vis[tmp] = true;
                res.push_back(tmp);
                tmp *= 2;
            }
        }
        for (int i = 0; i < n; ++i) cout << res[i] << " \n"[i == n - 1];
    }
}
```

# D. Trees and Segments

## 大致题意

有一个长度为 $n$ 的 $01$ 串，允许你翻转其中 $k$ 个，求对于每个 $a \in [1, n]$，求算 $a \times len\_0 + len\_1$ 的最大值。

$len\_x$ 的指在这个字符串内，最长的一段连续的 $x$ 的长度

## 思路

这道题的难度跃升有点快，确实很难想清楚

首先考虑最暴力的情况，遍历每种 $a$，遍历所有可能的最长的 $0$ 的左右区间和 $1$ 的左右区间，然后计算是否满足并求解，那么总共需要 $n^6$

首先校验合法可以通过前缀和的方式预处理，这样就可以少一个 $n$

再考虑到不同的 $a$ 之和长度有关，而长度最多只有 $n$ 种可能（当 $len\_0$ 为 $x$ 的时候，$max(len\_1)$ 一定是唯一解），所以也不需要遍历所有 $a$，只需要计算出所有可能，然后再让 $a$ 和所有可能进行遍历即可，那么只需要一个单独的 $n^2$。

这样，我们只剩下了 $n^4$

为了达到目标，我们还需要拆分这两个 $n^2$，让找 $max(len\_1)$ 变成近乎 $O(1)$ 的查找。那么很显然我们需要预处理，因为当前通过 $n^2$ 的方式确定 $len\_0$ 的情况下，其实 $len\_1$ 仅会出现在这个区间的左边或者右边，故预处理从 $1 \rightarrow n$ 的每一个位置，进行 $1 \rightarrow k$ 次操作的情况下 $max(len\_1)$ 是多少，同时还有 $n \rightarrow 1$ 的也需要

这里很显然应该通过 dp 去解决，设定 $dp[i][j]$ 表示从 $1 \rightarrow i$ 这段区间内在保证 $i$ 被选入作为 $len\_1$ 的情况下（即无论如何当前位置得是 $1$）当前的连续的 $1$ 的长度是多少，这非常简单，可以得到递推公式

$$
dp\_{i,j} = 
\left\{
\begin{matrix}
dp\_{i - 1,j} & s[i] = 1 \\
dp\_{i - 1,j - 1} & s[i] = 0 \\
0 & j = 0
\end{matrix}
\right.
$$

然后再做一次取较大值 $dp\_{i, j} = max(dp\_{i, j}, dp\_{i, j - 1}, dp\_{i - 1, j})$，这样就可以 $O(1)$ 的方式快速得到在某个区间内，允许操作 $k$ 次的情况下，能够得到最长的 $1$ 串有多长了

然后暴力就好

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        string str;
        str.reserve(n);
        cin >> str;

        vector<vector<int>> left(n);
        for (auto &item : left) item.resize(k + 1);
        left[0][0] = str[0] == '0' ? 0 : 1;
        for (int i = 1; i <= k; ++i) left[0][i] = 1;
        for (int i = 1; i < n; ++i) {
            left[i][0] = str[i] == '0' ? 0 : (i == 0 ? 1 : left[i - 1][0] + 1);
            for (int j = 1; j <= k; ++j) left[i][j] = str[i] == '0' ? left[i - 1][j - 1] + 1 : left[i - 1][j] + 1;
        }

        for (int i = 1; i < n; ++i) left[i][0] = max(left[i][0], left[i - 1][0]);
        for (int i = 1; i < n; ++i) for (int j = 1; j <= k; ++j)
            left[i][j] = max(max(left[i - 1][j], left[i][j]), left[i][j - 1]);

        vector<vector<int>> right(n);
        for (auto &item : right) item.resize(k + 1);
        right[n - 1][0] = str[n - 1] == '0' ? 0 : 1;
        for (int i = 1; i <= k; ++i) right[n - 1][i] = 1;
        for (int i = n - 2; i >= 0; --i) {
            right[i][0] = str[i] == '0' ? 0 : (i == n - 1 ? 1 : right[i + 1][0] + 1);
            for (int j = 1; j <= k; ++j) right[i][j] = str[i] == '0' ? right[i + 1][j - 1] + 1 : right[i + 1][j] + 1;
        }

        for (int i = n - 2; i >= 0; --i) right[i][0] = max(right[i][0], right[i + 1][0]);
        for (int i = n - 2; i >= 0; --i) for (int j = 1; j <= k; ++j)
                right[i][j] = max(max(right[i + 1][j], right[i][j]), right[i][j - 1]);

        vector<int> preS(n + 1, 0);
        for (int i = 1; i <= n; ++i) preS[i] = preS[i - 1] + (str[i - 1] == '1');

        vector<int> cnt(n + 1, -1);
        cnt[0] = max(left[n - 1][k], right[0][k]);
        for (int l = 0; l < n; ++l) {
            for (int r = l; r < n && preS[r + 1] - preS[l] <= k; ++r) {
                int cost = preS[r + 1] - preS[l];
                int max1 = max(l == 0 ? 0 : left[l - 1][k - cost], r == n - 1 ? 0 : right[r + 1][k - cost]);
                cnt[r - l + 1] = max(cnt[r - l + 1], max1);
            }
        }

        vector<int> ans(n + 1, 0);
        for (int i = 1; i <= n; ++i) for (int j = 0; j <= n; ++j)
            ans[i] = max(ans[i], cnt[j] == -1 ? 0 : i * j + cnt[j]);
        for (int i = 1; i <= n; ++i) cout << ans[i] << " \n"[i == n];
    }
}
```

虽然写的挺丑，但是压根没有用到 `if`