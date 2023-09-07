---
title: 【2019南昌网络赛】B-Fire-Fighting Hero
date: 2019-09-09 08:38:20
categories: ACM&算法
tag:
 - ACM
 - XCPC
math: true
---

[题目链接](https://nanti.jisuanke.com/t/41349)

# 分析
英雄方面很简单，跑一遍 Dijkstra 就行了，但是灭火团队就有点麻烦了。

这里可以借助一下最大流的建边来解决这个问题：
我们可以另外找一个点作为起点，然后建立从那个点到每一个团队的起点的边，权值为0，这样就完成了多起点的最短路

恰好我的板子是封装好的 Dijkstra ，我就直接建立两个结构体解决问题，因为点的数量只有 1000 个，空间上已经没有什么顾虑了

# AC-Code

```c
#include <bits/stdc++.h>

using namespace std;

#define MAXN 1100
#define MAXM 1000000

#define INF 0x3fffffff              //防止后面溢出，这个不能太大

struct Graph {
    struct Edge {
        long long to, next;
        long long cost;
    } edge[MAXM];
    long long head[MAXN];
    long long tot;

    void init(long long n) {
        tot = 0;
        memset(head, -1, sizeof(long long) * (n + 1));
    }

    void add_edge(long long from, long long to, long long value) {
        edge[tot].to = to;
        edge[tot].cost = value;
        edge[tot].next = head[from];
        head[from] = tot++;
    }
};

struct Dijkstra {
    long long low_cost[MAXN];
    bool vis[MAXN];
    long long pre[MAXN];

    void solve(long long b, long long e, long long start, Graph &graph) {
        for (long long i = b; i < e; i++) {
            low_cost[i] = INF;
            vis[i] = false;
            pre[i] = -1;
        }
        low_cost[start] = 0;
        vis[start] = true;
        long long cur_edge = graph.head[start];
        while (cur_edge != -1) {
            if (!vis[graph.edge[cur_edge].to] &&
                low_cost[start] + graph.edge[cur_edge].cost < low_cost[graph.edge[cur_edge].to]) {
                low_cost[graph.edge[cur_edge].to] = low_cost[start] + graph.edge[cur_edge].cost;
                pre[graph.edge[cur_edge].to] = start;
            }
            cur_edge = graph.edge[cur_edge].next;
        }
        for (long long j = b; j < e - 1; j++) {
            long long k = -1;
            long long Min = INF;
            for (long long i = b; i < e; i++) {
                if (!vis[i] && low_cost[i] < Min) {
                    Min = low_cost[i];
                    k = i;
                }
            }
            if (k == -1)
                break;
            vis[k] = true;
            cur_edge = graph.head[k];
            while (cur_edge != -1) {
                if (!vis[graph.edge[cur_edge].to] &&
                    low_cost[k] + graph.edge[cur_edge].cost < low_cost[graph.edge[cur_edge].to]) {
                    low_cost[graph.edge[cur_edge].to] = low_cost[k] + graph.edge[cur_edge].cost;
                    pre[graph.edge[cur_edge].to] = k;
                }
                cur_edge = graph.edge[cur_edge].next;
            }
        }
    }
};

Graph graph;
Dijkstra dijkstra1, dijkstra2;
int k_node[MAXN];

void solve() {
    long long t;
    cin >> t;
    long long v, e, s, k, c;
    for (int ts = 0; ts < t; ++ts) {
        cin >> v >> e >> s >> k >> c;
        graph.init(v + 1);
        for (int i = 0; i < k; ++i) {
            cin >> k_node[i];
        }
        long long from, to, value;
        for (long long i = 0; i < e; ++i) {
            cin >> from >> to >> value;
            graph.add_edge(from, to, value);
            graph.add_edge(to, from, value);
        }
        dijkstra1.solve(1, v + 1, s, graph);//第一次跑dijkstra
        for (int i = 0; i < k; ++i) {
            graph.add_edge(0, k_node[i], 0); // 这里设定超级源点为0，建立从0到每一个团队起点的边，权值为0
        }
        dijkstra2.solve(0, v + 1, 0, graph);//第二次跑dijkstra

        long long s_min_max = 0;
        for (long long i = 1; i < v + 1; ++i)
            s_min_max = max(s_min_max, dijkstra1.low_cost[i]);

        long long k_min_max = 0;
        for (long long i = 1; i < v + 1; ++i)
            k_min_max = max(k_min_max, dijkstra2.low_cost[i]);

        if (s_min_max <= c * k_min_max)//考虑到精度问题，这里用乘法代替
            cout << s_min_max << endl;
        else
            cout << k_min_max << endl;
    }
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
        if (test_index_for_debug > 100) {
            throw runtime_error("Check the stdin!!!");
        }
        auto start_clock_for_debug = clock();
        cout << "Test " << test_index_for_debug << ":" << endl;
        solve();
        auto end_clock_for_debug = clock();
        cerr << "Test " << test_index_for_debug++ << " Run Time: "
             << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "\n--------------------------------------------------" << endl;
    }
#else
    solve();
#endif
    return 0;
}
```

