---
title: Codeforces Round 923 (Div. 3)
date: 2024-03-31 20:27:55
updated: 2024-03-31 20:27:55
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 923 (Div. 3) 个人写题记录
---

# A. Make it White

## 大致题意

有一段黑白间隔的数组，允许选择其中的一段，将其涂成白色，问最小要多长

## 思路

找到最左边和最右边黑色即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.resize(n);
        cin >> str;
        int l = n, r = 0;
        for (int i = 0; i < n; ++i) if (str[i] == 'B') {
            l = min(l, i);
            r = max(r, i);
        }
        cout << r - l + 1 << endl;
    }
}
```

# B. Following the String

## 大致题意

已知一个数组，其映射一个相同长度的字符串，其中每一个数值表示对应字符串里的这个位置上的字母，是整个字符串里第几次出现

给出一个合理的字符串

## 思路

找就行了，对于每一个位置，找到一个合理的字母放上去就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int cnt[26] = {};
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < 26; ++j) {
                if (cnt[j] == data[i]) {
                    cout << static_cast<char>(j + 'a');
                    ++cnt[j];
                    break;
                }
            }
        }
        cout << endl;
    }
}
```

# C. Choose the Different Ones!

## 大致题意

有两个数组，分别取出 $\frac{k}{2}$ 个数值，使得正好得到 $[1, k]$ 这几个数，问是否可能

## 思路

找出 $[1, k]$ 中，仅存在一侧的数值，看看是不是有一次持有的这种值超过 $\frac{k}{2}$ 个即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<char> data(k + 1);
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp <= k) data[tmp] |= 1;
        }
        for (int i = 0; i < m; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp <= k) data[tmp] |= 2;
        }
        int cnt[2] = {};
        bool flag = true;
        for (int i = 1; i <= k; ++i) if (data[i] == 0) flag = false; else if (data[i] <= 2) ++cnt[data[i] - 1];
        cout << (flag && cnt[0] <= k / 2 && cnt[1] <= k / 2 ? "YES" : "NO") << endl;
    }
}
```

# D. Find the Different Ones!

## 大致题意

有一个数组，每次给出一个区间的询问，问区间内是否存在任何两个值不一样

## 思路

只要记录所有值发生变化的下标即可，然后找一下区间内有没有下标，有的话取下标两边的值即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, q;
        cin >> n;
        set<int> st;
        int last = -1;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (i != 0 && tmp != last) st.insert(i + 1);
            last = tmp;
        }
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int l, r;
            cin >> l >> r;
            const auto iter = st.upper_bound(l);
            if (iter == st.end() || *iter > r) cout << -1 << ' ' << -1 << endl;
            else cout << *iter - 1 << ' ' << *iter << endl;
        }
        cout << endl;
    }
}
```

# E. Klever Permutation

## 大致题意

已知 $n, k$，需要给出一个 $n$ 的排列，使得任取两组相邻的 $k$ 个数值组成的和，差值不超过 1

## 思路

从滑动窗口的视角看比较容易

把原始的有序排列拆成 $\left \lfloor \frac{n}{k} \right \rfloor$ 份，然后依次从每一份中取一个值，排列成一个数组即可

注意取的时候，奇数份内从大到小，而偶数份从小到大即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        vector<pair<int, int>> data(k);
        int page = n / k, start = n % k;
        data[0] = {1, page + (start != 0)};
        for (int i = 1; i < k; ++i) {
            data[i] = {data[i - 1].second + 1, data[i - 1].second + page};
            if (i < start) data[i].second++;
        }
        for (int i = 0; i < n; ++i)
            if (i % 2) cout << data[i % k].second-- << ' ';
            else cout << data[i % k].first++ << ' ';
        cout << endl;
    }
}
```

# F. Microcycle

## 大致题意

有一个无向图，找一个包含最小边权的环

## 思路

类似生成树，只不过反过来，从最大权重的边开始遍历，找到最后一个会触发环逻辑的边即可，然后再根据确认的边的两个点找环即可

用一下并查集即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<tuple<int, int, int>> data(m);
        for (auto &[u, v, w]: data) cin >> u >> v >> w;
 
        sort(data.begin(), data.end(), [](const tuple<int, int, int> &lhs, const tuple<int, int, int> rhs) {
            return get<2>(lhs) > get<2>(rhs);
        });
 
        vector<int> fa(n + 1);
        for (int i = 0; i < n + 1; ++i) fa[i] = i;
        function<int(int)> find = [&](const int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); };
        auto join = [&](int x, int y) {
            x = find(x);
            y = find(y);
            if (x == y) return false;
            fa[y] = x;
            return true;
        };
 
        tuple<int, int, int> start;
        vector<int> head(n + 1, -1);
        vector<pair<int, int>> edges;
        for (const auto &[u, v, w]: data) {
            if (!join(u, v)) start = {u, v, w};
            else {
                edges.emplace_back(u, head[v]);
                head[v] = (int) edges.size() - 1;
                edges.emplace_back(v, head[u]);
                head[u] = (int) edges.size() - 1;
            }
        }
 
        vector<int> dis(n + 1, -1);
        queue<int> q;
        auto [l, r, w] = start;
        dis[l] = 0;
        q.push(l);
        while (!q.empty()) {
            auto cur = q.front();
            q.pop();
            for (int e = head[cur]; ~e; e = edges[e].second) {
                if (dis[edges[e].first] != -1) continue;
                dis[edges[e].first] = dis[cur] + 1;
                q.push(edges[e].first);
            }
        }
 
        cout << w << ' ' << dis[r] + 1 << endl;
        cout << r;
        int cur = r;
        while (cur != l) {
            for (int e = head[cur]; ~e; e = edges[e].second) {
                if (dis[edges[e].first] + 1 == dis[cur]) {
                    cur = edges[e].first;
                    cout << ' ' << cur;
                    break;
                }
            }
        }
        cout << endl;
    }
}
```

# G. Paint Charges

## 大致题意

有一个数组，数组上，对于每一个值可以进行如下操作其中一个，或者不操作

- 将当前值左侧的 $a\_i$ 个值进行染色（包含自己）
- 将当前值右侧的 $a\_i$ 个值进行染色（包含自己）

问最少操作几次，可以使得整个数组都被染色

## 思路

考虑 dp，定义 `dp[i][j]` 表示，当前是关注的是第 $i$ 个值，且此时染色到 $j$ 位置的时候，最小花费是多少

显然 $dp\_{i,j} = dp\_{i-1,j}$

同时，考虑向左和向右的填涂即可

此时可以发现，大部分样例都过了，除了一个特殊的 case：一个值先不管左边，先往右进行染色，然后由右边的值来补偿左边的。

这种 case 也可以融入进 dp 的逻辑

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n + 1);
        for (int i = 1; i <= n; ++i) cin >> data[i];
        vector<vector<int>> dp(n + 1);
        constexpr int INF = 0x3fffffff;
        for (auto& item: dp) item.resize(n + 1, INF);
        dp[0][0] = 0;
        for (int i = 1; i <= n; ++i) {
            // nothing
            for (int j = 0; j < n + 1; ++j) dp[i][j] = dp[i - 1][j];
            // go left
            for (int j = max(i - data[i] + 1, 0); j <= i; ++j) dp[i][j] = min(dp[i][j], dp[i - 1][max(i - data[i], 0)] + 1);
            // go right
            for (int j = i; j <= min(i + data[i] - 1, n); ++j) dp[i][j] = min(dp[i][j], dp[i - 1][i - 1] + 1);
            // go left + another go right
            for (int j = 1; j < i; ++j) {
                if (i - data[i] + 1 >= j || j + data[j] - 1 <= i) continue;
                for (int k = max(i - data[i], 0); k <= min(j + data[j] - 1, n); ++k)
                    dp[i][k] = min(dp[i][k], dp[j - 1][max(i - data[i], 0)] + 2);
            }
        }
        cout << dp[n][n] << endl;
    }
}
```
