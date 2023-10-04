---
title: Codeforces Round 899 (Div. 2)
date: 2023-10-04 12:34:09
updated: 2023-10-04 12:34:09
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Increasing Sequence

## 大致题意

有一个初始的数组，要求构造另外一个数组，使得新数组严格递增，同时任何一项不与原来的数组的对应项相同，问这个数组最后一个值最小是多少

## 思路

由于严格递增，所以最小的方式就是 $1, 2, 3, 4 \dots$，再考虑一下不能相同的这个情况，容易得到如果按照上述的方式撞上了相同，那么就再加一即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &i: data) cin >> i;
        int cur = 0;
        for (int i: data) {
            cur++;
            if (cur == i) cur++;
        }
        cout << cur << endl;
    }
}
```

# B. Sets and Union

## 大致题意

有一堆集合，需要选出几个集合，使得这几个集合合并后的集合的元素数量尽可能多的同时，与全部集合直接合并的结果不同，问最大的集合元素数量

## 思路

因为数据量比较小，所以可以暴力解决，最简单的方式就是直接遍历所有可能的最终不出现在答案中的某个值，然后尝试最大化最终结果即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<vector<int>> data(n);
        for (auto &i: data) {
            int s;
            cin >> s;
            i.resize(s);
            for (auto &j: i) cin >> j;
        }
        int cnt[52] = {0};
        for (auto &i: data) for (auto &j: i) cnt[j]++;
        int ans = 0;
        for (int i = 0; i < 52; ++i) {
            if (cnt[i] == 0) continue;
            set<int> st;
            for (auto &a: data) {
                bool flag = true;
                for (auto &b: a) if (b == i) flag = false;
                if (!flag) continue;
                for (auto &b: a) st.insert(b);
            }
            ans = max(ans, (int) st.size());
        }
 
        cout << ans << endl;
    }
}
```

# C. Card Game

## 大致题意

有一个数组，每一个值可能是任何整数，允许你每次选择一个当前在奇数位置的值，并得到对应的分数，或者删除掉一个当前在偶数位置的值。数组被取走值后会重新获得新的下标（不留出空位）问最多可以得到多少总分

## 思路

假定某个位置，我们对它进行了操作，无论是删除 or 得到对应的分数，总之其后面的所有值的下标都会经历奇数和偶数的两种可能，意味着对于后面的值，如果它是负数，那我一定能找到一个时间将其直接删除，否则我一定可以计算进入我的分数

所以只要知道第一个被操作的值是谁就行，其后面的所有正数都可以加入到分数中，而负数都可以删除。故直接从后往前遍历即可

## AC code

```cpp
```


# D. Tree XOR

## 思路

快可以说是树上换根 dp 模版题了，不解释了

## AC code

```cpp

#define int long long

using namespace std;

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n + 1);
        for (int i = 1; i <= n; ++i) cin >> a[i];

        struct node {
            int v, n;
        };
        vector<node> edge(n * 2);
        vector<int> head(n + 1, -1);
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            edge[i << 1].v = u;
            edge[i << 1].n = head[v];
            head[v] = i << 1;

            edge[(i << 1) | 1].v = v;
            edge[(i << 1) | 1].n = head[u];
            head[u] = (i << 1) | 1;
        }

        vector<int> cnt(n + 1, 0), cost(n + 1, 0);
        function<void(int, int)> dfs1 = [&](int u, int f) {
            cnt[u] = 1;
            for (int i = head[u]; ~i; i = edge[i].n) {
                int v = edge[i].v;
                if (v == f) continue;
                dfs1(v, u);
                cnt[u] += cnt[v];
                cost[u] += cost[v];
            }
            if (f) cost[u] += (a[u] ^ a[f]) * cnt[u];
        };

        vector<int> ans(n + 1, 0);
        function<void(int, int)> dfs2 = [&](int u, int f) {
            ans[u] = ans[f];
            ans[u] -= cnt[u] * (a[u] ^ a[f]);
            ans[u] += (n - cnt[u]) * (a[u] ^ a[f]);
            for (int i = head[u]; ~i; i = edge[i].n) {
                if (edge[i].v == f) continue;
                dfs2(edge[i].v, u);
            }
        };

        dfs1(1, 0);
        ans[1] = cost[1];
        for (int i = head[1]; ~i; i = edge[i].n) dfs2(edge[i].v, 1);
        for (int i = 1; i <= n; ++i) cout << ans[i] << " \n"[i == n];
    }
}
```
