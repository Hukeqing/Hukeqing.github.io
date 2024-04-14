---
title: Codeforces Round 926 (Div. 2)
date: 2024-04-13 00:39:50
updated: 2024-04-13 00:39:50
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 926 (Div. 2) 个人写题记录
#index_img:
---

# A. Sasha and the Beautiful Array

## 大致题意

有一个数组，现在允许你任意排序它，使得其所有的相邻对之差之和最小，问如何操作

## 思路

排序一下就行，这样就等于最大的那个值减去最小的那个

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
        sort(data.begin(), data.end());
        cout << data.back() - data.front() << endl;
    }
}
```

# B. Sasha and the Drawing

## 大致题意

有一个正方形，其上有 $4 \times n - 2$ 条对角线，现在要你染黑一些格子，使得这些对角线至少有 $x$ 个被覆盖，问最少染黑几个

## 思路

只要染黑第一行和最下面一行即可，显然，除了四个角落，其他几个点染了就是影响两条对角线

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        if (m <= 4 * n - 4) cout << (m + 1) / 2 << endl;
        else if (m == 4 * n - 3) cout << 2 * n - 1 << endl;
        else if (m == 4 * n - 2) cout << 2 * n << endl;
    }
}
```

# C. Sasha and the Casino

## 大致题意

在赌场赌博，已知每次可以下注任意合理的钱 $y$，赢了就收回 $k \times y$，输了就没了，且最多连续输 $x$ 场，问是否赚到任意数量的钱

## 思路

根据赌徒原理做，要保证你每次下注的时候，如果赢了能把之前输的钱全都赚回来，且还要多赚一点

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int k, x, a;
        cin >> k >> x >> a;
        int ca = a, lose = 0;
        bool flag = true;
        for (int i = 0; i < x; ++i) {
            int cur = (lose + k - 1) / (k - 1);
            if (ca < cur) {
                flag = false;
                break;
            }
            ca -= cur;
            lose += cur;
        }
        if (ca * k <= a) flag = false;
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# D. Sasha and a Walk in the City

## 大致题意

有一棵树，现在要选择一定数量的节点染色，使得任意两个节点之间的路径最多只经过两个染黑节点，问如何操作

## 思路

树上 dp 即可，关注当前节点到所有下面的子节点中，染色数量最多的路径染色了多少个，可以枚举 1 个和 2 个的情况（0 个一定只有一种）

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        constexpr int mod = 998244353;
        vector<pair<int, int>> edges((n - 1) * 2);
        vector<int> head(n + 1, -1);
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            edges[i << 1] = {v, head[u]};
            edges[i << 1 | 1] = {u, head[v]};
            head[u] = i << 1;
            head[v] = i << 1 | 1;
        }

        function<pair<int, int>(int, int)> dfs = [&](int u, int p) {
            int a = 1, b = 0;
            for (int e = head[u]; ~e; e = edges[e].second) {
                if (edges[e].first == p) continue;
                auto [na, nb] = dfs(edges[e].first, u);
                a = (a * (1 + na)) % mod;
                b = (b + na + nb) % mod;
            }

            return make_pair(a, b);
        };

        auto [a, b] = dfs(1, 0);
        cout << (a + b + 1) % mod << endl;
    }
}
```
