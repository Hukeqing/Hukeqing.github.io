---
title: Codeforces Round 606 E. Two Fairs——图论
date: 2020-01-08 19:15:24
updated: 2020-01-08 19:15:24
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

[题目链接](http://codeforces.com/contest/1277/problem/E)

# 题意

给你一张无向图，求出有多少对点对（x, y）满足从点x到点y的所有路径必同时经过点a和点b

# 分析
## 单点

首先考虑假如点a和点b是同一个点的情况

我从任意的一点出发，把所有与点a/b相连的路视为不存在，通过bfs遍历所有可能到达的点。那么这些点之间可以满足不经过点a/b能联通。反之，如果能将其他所有的点均进行bfs，组成类似并查集的数据结构，那么我可以很快得到，所有非同一集合内的点之间必须通过点a/b。

下一个问题：**如何保证所有点都完成了遍历（bfs）**

我们可以不断的在vis数组中找没有被vis的点，然后不断的bfs，但是这样效率很低

换一种思路

**我们可以直接从点a/b出发**，设定bfs起点为点a/b，那么就可以一次性的完成整个图的bfs遍历，并且使用类似并查集的结构将他们保存下来。

## 两点

我们可以这样定义，如果存在点对（x，y），假设与点b联通的路均视为不连通，满足x与a联通，但是不与y联通，同时，假设与点a联通的路均视为不连通，满足y与b联通，但是不与x联通，那么我们可以得到这样点x的集合和点y的集合，那么这两个集合内各取一点即为一组合理的点对

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

const int MAXN = 201000;
const int MAXM = 1001000;

// 无权有向图
struct Graph {
    struct Edge {
        int to, next;
    } edge[MAXM];
    int head[MAXN];
    int tot;

    void init(int n) {
        tot = 0;
        memset(head, -1, sizeof(int) * (n + 1));
    }

    void add_edge(int from, int to) {
        edge[tot].to = to;
        edge[tot].next = head[from];
        head[from] = tot++;
    }
} graph;


void solve() {
    int T;
    cin >> T;
    for (int ts = 0; ts < T; ++ts) {
        int n, m, a, b;
        cin >> n >> m >> a >> b;
        graph.init(n);
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
            graph.add_edge(u, v);
            graph.add_edge(v, u);
        }
        bool vis[MAXN];
        queue<int> q;
        int a_cnt = n - 2, b_cnt = n - 2;

        memset(vis, false, sizeof(bool) * (n + 1));
        q.push(a);
        vis[a] = true;
        while (!q.empty()) {
            int cur = q.front();
            q.pop();
            for (int i = graph.head[cur]; i != -1; i = graph.edge[i].next) {
                if (!vis[graph.edge[i].to] && graph.edge[i].to != b) {
                    vis[graph.edge[i].to] = true;
                    q.push(graph.edge[i].to);
                    a_cnt--;
                }
            }
        }

        memset(vis, false, sizeof(bool) * (n + 1));
        q.push(b);
        vis[b] = true;
        while (!q.empty()) {
            int cur = q.front();
            q.pop();
            for (int i = graph.head[cur]; i != -1; i = graph.edge[i].next) {
                if (!vis[graph.edge[i].to] && graph.edge[i].to != a) {
                    vis[graph.edge[i].to] = true;
                    q.push(graph.edge[i].to);
                    b_cnt--;
                }
            }
        }

        cout << 1ll * a_cnt * b_cnt << endl;
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
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
