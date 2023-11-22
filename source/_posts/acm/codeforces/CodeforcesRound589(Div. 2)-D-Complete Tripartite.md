---
title: Codeforces Round#589 (Div. 2) D、Complete Tripartite
date: 2019-09-30 19:17:23
updated: 2019-09-30 19:17:23
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

[题目链接](https://codeforces.com/contest/1228/problem/D)

# 大致题意
把一个图分成三块，要求任意两块之间是完全图，块内部没有连线

# 分析
首先根据块内没有连线可以直接分成两块
假定点1是属于块1的，那么所有与点1连接的点，都不属于块1；反之则是块1的
然后在所有不属于块1的点内随意找一点k，设定其属于块2，那么所有与点k连接的点且不属于块1，则是块3。

块分完了，然后是判断每个块是否满足条件，我通过下面三条来判断

> 1、每个块都有点
> 2、每个块内部没有连线，即没有一条线的两个端点在同一个块内
> 3、每个块内的点的度等于其他两个块的点个数和也等于n减去当前块内的点数

# AC Code
（暴力就完事）
```cpp
#include <bits/stdc++.h>

using namespace std;

#define MAXN 101000

int fa[MAXN];		// 保存了点属于哪个块
int deg[MAXN];		// 保存了点的度
pair<int, int> edge[MAXN * 3];

void solve() {
    int n, m;
    cin >> n >> m;
    int f2 = 2; // f2 用来找块2
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        deg[u]++;
        deg[v]++;
        edge[i] = {u, v};
        if (u == 1) {
            fa[v] = 1;
            f2 = v;
        } else if (v == 1) {
            fa[u] = 1;
            f2 = u;
        }
    }
    // 找出第三块
    for (int i = 0; i < m; ++i) {
        if (edge[i].first == f2 && fa[edge[i].second] == 1)
            fa[edge[i].second] = 2;
        else if (edge[i].second == f2 && fa[edge[i].first] == 1)
            fa[edge[i].first] = 2;
    }
    int cnt[3] = {n, n, n};	// 保存了每个块内点的个数
    // 需要变成完全图需要多少条边
    for (int i = 0; i < n; ++i)
        cnt[fa[i + 1]]--;
    // 块内的入度是否符合条件
    for (int i = 0; i < n; ++i) {
        if (deg[i + 1] != cnt[fa[i + 1]]) {
            cout << -1 << endl;
            return;
        }
    }
    // 每个块是否为空
    if (cnt[0] == n || cnt[1] == n || cnt[2] == n) {
        cout << -1 << endl;
        return;
    }
    // 内部连线
    for (int i = 0; i < m; ++i) {
        if (fa[edge[i].first] == fa[edge[i].second]) {
            cout << -1 << endl;
            return;
        }
    }
    for (int i = 0; i < n - 1; ++i)
        cout << fa[i + 1] + 1 << " ";
    cout << fa[n] + 1 << endl;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    long long test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        cin.putback(acm_local_for_debug);
        if (test_index_for_debug > 20) {
            throw runtime_error("Check the stdin!!!");
        }
        auto start_clock_for_debug = clock();
        solve();
        auto end_clock_for_debug = clock();
        cout << "Test " << test_index_for_debug << " successful" << endl;
        cerr << "Test " << test_index_for_debug++ << " Run Time: "
             << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "--------------------------------------------------" << endl;
    }
#else
    solve();
#endif
    return 0;
}
```
总之一句话，暴力就完事了。反正边不多，我已经懒得优化了