---
title: Codeforces Round 916 (Div. 3)
date: 2023-12-21 00:54:20
updated: 2023-12-21 00:54:20
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 916 (Div. 3) 个人写题记录
---

这场本来是想在比赛的时候写的，可惜写到一半突然有公司的电话进来了，就只好先去处理点事情了

# A. Problemsolving Log

## 大致题意

写出 A 题需要思考 1min，写出 B 题需要思考 2min，以此类推，给出一个人每分钟在思考的题，问最终有几道题能写出来

## 思路

简单题，统计一下每个字母出现次数就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        cin >> str;
        map<char, int> mp;
        for (auto&c: str) mp[c]++;
        int ans = 0;
        for (char i = 'A'; i <= 'Z'; ++i)
            if (mp[i] >= i - 'A' + 1) ans++;
        cout << ans << endl;
    }
}
```

# B. Preparing for the Contest

## 大致题意

需要构造一个长度为 n 的序列，使得其满足所有相邻两个值中，存在恰好 k 个前者大于后者的对数

## 思路

也是简单题，想清楚怎么构造就行。比如我的思路是把最大的 k 个值按照递增序放在后面

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;

        for (int i = n - k; i > 0; --i) cout << i << " ";
        for (int i = n - k + 1; i <= n; ++i) cout << i << " ";
        cout << endl;
    }
}
```

# C. Quests

## 大致题意

有一堆问题，第一次写出来可以得到 $a\_i$ 的分数，第二次及之后写出来可以得到 $b\_i$ 的分数

每道题写出来的前提是前面的所有题至少都写出来一次

问最多写 $x$ 道题，最多可以得到多少分

## 思路

由于每道题必须要前面的所有题都写出来才能写，所以可以考虑枚举最终写到了哪道题，然后把剩下的所有写题的机会给那个 $b\_i$ 最大的题即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> a(n), b(n);
        for (auto&i: a) cin >> i;
        for (auto&i: b) cin >> i;

        int ma = 0, ans = 0, suf = 0;
        for (int i = 0; i < min(n, k); ++i) {
            suf += a[i];
            ma = max(ma, b[i]);
            ans = max(ans, suf + (k - i - 1) * ma);
        }
        cout << ans << endl;
    }
}
```

# D. Three Activities

## 大致题意

有三种活动，且有 $n$ 天，每一天最多参加一个活动，每一个活动最多只能有一天参加。

每个活动每天都有其他伙伴一起来参加，数量都不相同。问应该挑哪三天去参加活动，能够使得一起参加的伙伴数量最多

## 思路

由于总共就只有三种活动，所以只需要挑选三天。对于每一个活动而言，他们只需要考虑参加伙伴最多的那三天即可

所以在每一个活动下单独排序参加的伙伴数量，选择每个活动下伙伴最多的三天，暴力找下答案即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<pair<int, int>> a(n), b(n), c(n);
        for (auto&i: a) cin >> i.first;
        for (auto&i: b) cin >> i.first;
        for (auto&i: c) cin >> i.first;
        for (int i = 0; i < n; ++i) a[i].second = i;
        for (int i = 0; i < n; ++i) b[i].second = i;
        for (int i = 0; i < n; ++i) c[i].second = i;

        sort(a.begin(), a.end(), greater<>());
        sort(b.begin(), b.end(), greater<>());
        sort(c.begin(), c.end(), greater<>());

        int ans = 0;
        for (int i = 0; i < 3; ++i) {
            for (int j = 0; j < 3; ++j) {
                if (b[j].second == a[i].second) continue;
                for (int k = 0; k < 3; ++k) {
                    if (c[k].second == a[i].second || c[k].second == b[j].second) continue;
                    ans = max(ans, a[i].first + b[j].first + c[k].first);
                }
            }
        }
        cout << ans << endl;
    }
}
```

# E2. Game with Marbles (Hard Version)

## 大致题意

直接看 Hard Version

Alice 和 Bob 做游戏，有 $n$ 种颜色的石头，每个人都有所有颜色的石头若干个

每轮，当前的选手需要选择一种颜色，然后当前选手丢掉一个这种颜色的石头，对方丢掉全部的

目标是让自己的石头数量之和尽可能多，问最后剩下多少个

## 思路

假如一种颜色的石头，Alice 有 $a$ 个，Bob 有 $b$ 个。如果是 Alice 选择，那么 Alice 会剩下 $a-1$ 个，差值是 $a-1$。如果是 Bob 选择，则是 $-(b-1)$

这样可以得到，不选择这个颜色的代价就是 $(a-1)-(-(b-1)) = (a+b-2)$，同时选择它的收益也是这个

按照代价排序，从最大的代价依次开始操作即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n), b(n);
        for (auto&i: a) cin >> i;
        for (auto&i: b) cin >> i;
        vector<pair<int, int>> d(n);
        for (int i = 0; i < n; ++i) {
            d[i].first = a[i] + b[i] - 2;
            d[i].second = i;
        }
        sort(d.begin(), d.end(), greater<>());
        for (int i = 0; i < n; ++i) {
            if (i % 2) {
                b[d[i].second]--;
                a[d[i].second] = 0;
            } else {
                a[d[i].second]--;
                b[d[i].second] = 0;
            }
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) ans += a[i] - b[i];
        cout << ans << endl;
    }
}
```

# F. Programming Competition

## 大致题意

一个公司，其上级或者间接的上级都是他老板，现在需要两两组队，但是有老板关系的不能组，问最多可以组几个队伍

## 思路

树上 dfs 搜索即可，每次传给当前节点，外面不属于他的员工的节点数量还有多少，有就用掉即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> p(n), d(n);
        vector<vector<int>> tree(n);
        for (int i = 1; i < n; ++i) {
            int tmp;
            cin >> tmp;
            tree[tmp - 1].push_back(i);
        }
 
        function<int(int)> deep = [&](const int v) {
            d[v] = 1;
            for (auto& i: tree[v]) d[v] += deep(i);
            return d[v];
        };
 
        int ans = 0;
        function<void(int, int)> dfs = [&](const int v, int cnt) {
            ans += cnt > 0;
            if (cnt > 0) --cnt;
 
            int sum = 0;
            for (auto &i: tree[v]) sum += d[i];
 
            for (auto &i: tree[v]) dfs(i, sum - d[i] + cnt);
        };
 
        // ReSharper disable once CppExpressionWithoutSideEffects
        deep(0);
        dfs(0, 0);
        cout << ans / 2 << endl;
    }
}
```

# G2. Light Bulbs (Hard Version)

## 大致题意

这题还是挺有意思的

有一排灯，其中每种颜色的灯恰好有两个，可以选择开始的时候，点亮一部分灯，之后可以无限次进行如下操作

- 点亮一盏灯，前提是和他相同颜色的另一盏灯已经点亮了
- 选择一种颜色，其两盏灯都已经点亮了，将这两盏灯中间的所有灯点亮

问开始的时候最少选择几盏灯，就可以把所有灯都点亮。同时给出可以选择的数量

## 思路

首先，如果存在一个 $a$ 夹在两个 $b$ 之间，那么只需要点亮 $b$ 就可以点亮 $a$，我们可以进行建图来做

但是如果这样完整建图的成本会很高，所以得考虑优化一下
例如 $1,2,3,4,1,2,3,4$ 这种，就会变成一个全连接的图，而点数量有 $2 \times 10^5$，故不太行

由于这个图并不是传统的拓扑排序，而是只要上游任意一个点满足则满足（传统拓扑是上游均满足才满足）所以可以做反向路径压缩，即“别压缩”

例如上面的例子，仅实现与最后出现的那个区间进行连接，例如上图，则仅有 $1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 1$，
容易的得到这样建图也是可以满足要求的，因为不是传统拓扑

那么只需要在创建完成图之后，将拓扑的首个节点序列拿出来即可，这些节点是必选。因为有两个相同颜色的灯，所以是 $2^x$ 种选择

接下来考虑成环的情况，我们只需要找出最初试图进入环的那个节点（最左边的节点，因为它必然可以连接到剩下所有的节点）
看剩下环内的节点是否能够反向到达它即可。可以反向建图来做。至于最初进入环的节点，可以用并查集

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
 
        struct node {
            int v, n;
        };
        stack<int> st;
        vector<node> edge, redge;
        vector head(n + 1, -1), rhead(n + 1, -1), deg(n + 1, 0), fa(n + 1, 0), vis(n + 1, 0);
        edge.reserve(n);
        redge.reserve(n);
        for (int i = 0; i < fa.size(); ++i) fa[i] = i;
        function<int(int)> finds = [&](int x) { return fa[x] == x ? x : fa[x] = finds(fa[x]); };
        function join = [&](const int x, const int y) {
            const int rx = finds(x), ry = finds(y);
            if (rx == ry) return;
            fa[rx] = ry;
        };
 
        for (int i = 0; i < n * 2; ++i) {
            int tmp;
            cin >> tmp;
            while (!st.empty() && vis[st.top()] == 2) st.pop();
            if (!st.empty() && st.top() != tmp) {
                join(tmp, st.top());
                edge.push_back({tmp, head[st.top()]});
                head[st.top()] = static_cast<int>(edge.size()) - 1;
                deg[tmp]++;
 
                redge.push_back({st.top(), rhead[tmp]});
                rhead[tmp] = static_cast<int>(redge.size()) - 1;
            }
            st.push(tmp);
            ++vis[tmp];
        }
 
        queue<int> q;
        for (int i = 1; i <= n; ++i) if (deg[i] == 0) q.push(i);
        constexpr long long mod = 998244353;
        const int res = static_cast<int>(q.size());
 
        long long ans = 1;
        for (int i = 0; i < q.size(); ++i) {
            ans <<= 1;
            ans %= mod;
        }
 
        while (!q.empty()) {
            const int cur = q.front();
            q.pop();
            if (vis[cur] == 3) continue;
            ++vis[cur];
            for (int i = head[cur]; ~i; i = edge[i].n) q.push(edge[i].v);
        }
 
        map<int, int> superCnt;
        for (int i = 1; i <= n; ++i) if (vis[i] != 3 && finds(i) == i) q.push(i);
 
        while (!q.empty()) {
            const int cur = q.front();
            q.pop();
            if (vis[cur] == 3) continue;
            ++vis[cur];
            superCnt[finds(cur)]++;
            for (int i = rhead[cur]; ~i; i = redge[i].n)
                q.push(redge[i].v);
        }
 
        for (auto [k, v]: superCnt) ans = ans * 2 * v % mod;
 
        cout << (res + superCnt.size()) << ' ' << ans << endl;
    }
}
```
