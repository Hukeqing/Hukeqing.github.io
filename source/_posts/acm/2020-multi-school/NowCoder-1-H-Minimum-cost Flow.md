---
title: 2020牛客暑期多校训练营（第一场）H-Minimum-cost Flow——网络流
date: 2020-07-14 18:49:34
categories: ACM&算法
tag:
 - ACM
 - NowCoder
math: true
---

[题目链接](https://ac.nowcoder.com/acm/contest/5666/H)

# 大致题意

给出一个费用流图，每条边的流量上限相同且不固定。有$q$个询问，每个询问中给出每条边的流量上限（分数，且保证$\leq 1$）。当图中的流量为 $1$ 个单位的时候，求出此时的费用。

# 分析

首先是询问个数，有$1e5$次询问，则需要预处理整个图，然后O(1)作答才可以过。然后注意到题目中给出的数据规模，图的边数只有$100$条

首先由于边的流量均为分数（$\frac{u}{v}$），而总流量为 $1$ 个单位。我们先扩大$\frac{v}{u}$倍，将每条边的流量固定为 $1$ 个单位，此时流量为 $\frac{v}{u}$ 个单位

考虑在最大流使用 SPFA 查找路径时，当查找到一条路径时，此路径的流量一定为 $1$ （根据上述的设定）。由于采用的本身便是最短路查找路径，得到的路径的费用为当前网络图下的最低费用。

所以可以稍微修改费用流板子中的一部分代码，使得每次得到路径并结算费用时，将每次得到的路径费用记录下来并保存。

```cpp
#define ll long long

const int maxn = 100;      //点数
const int INF = 0x3f3f3f3f;

struct Edge {
    int from, to, cap, flow, cost;

    Edge(int u, int v, int c, int f, int cc)
            : from(u), to(v), cap(c), flow(f), cost(cc) {}
};

vector<ll> res;

struct MCMF {
    int n, m;
    vector<Edge> edges;
    vector<int> G[maxn];
    int inq[maxn];  //是否在队列中
    int d[maxn];    //bellmanford
    int p[maxn];    //上一条弧
    int a[maxn];    //可改进量
    void init(int n) {
        this->n = n;
        for (int i = 0; i <= n; ++i) G[i].clear();
        edges.clear();
    }

    void addEdge(int from, int to, int cap, int cost) {
        edges.emplace_back(Edge(from, to, cap, 0, cost));
        edges.emplace_back(Edge(to, from, 0, 0, -cost));
        m = int(edges.size());
        G[from].emplace_back(m - 2);
        G[to].emplace_back(m - 1);
    }

    bool spfa(int s, int t, int &flow, ll &cost) {
        for (int i = 1; i <= n; ++i) d[i] = INF;
        memset(inq, 0, sizeof(inq));
        d[s] = 0;
        inq[s] = 1;
        p[s] = 0;
        queue<int> q;
        a[s] = INF;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inq[u] = 0;
            for (int i = 0; i < int(G[u].size()); ++i) {
                Edge &e = edges[G[u][i]];
                if (e.cap > e.flow && d[e.to] > d[u] + e.cost) {
                    d[e.to] = d[u] + e.cost;
                    p[e.to] = G[u][i];
                    a[e.to] = min(a[u], e.cap - e.flow);
                    if (!inq[e.to]) {
                        q.push(e.to);
                        inq[e.to] = 1;
                    }
                }
            }
        }
        if (d[t] == INF) return false;
        flow += a[t];
        cost += (ll) d[t] * (ll) a[t];
        res.push_back(d[t]);
        for (int u = t; u != s; u = edges[p[u]].from) {
            edges[p[u]].flow += a[t];
            edges[p[u] ^ 1].flow -= a[t];
        }
        return true;
    }

    int MincostMaxflow(int s, int t, ll &cost) {
        int flow = 0;
        cost = 0;
        while (spfa(s, t, flow, cost));
        return flow;
    }
} mcmf;
```

通过 res 数组记录下所有得到的路径的费用

而后分解流量。对于每一次询问，从 res 数组中从开始取值每次取出一条路径来提供 $1$ 个单位的流量，直到满足流量要求，则停止取值并输出答案。

虽然 $1 \leq u, v \leq 1e9$，可能需要循环遍历 $1e9$ 次才能出结果，但是由于图中每条边的容量都是 $1$，所以对于每一条路径，它只有被完全占用和完全空闲两种状态，而边数只有 $100$ 条，即整个网络的最大流量只能是 $100$ 个单位，即最多遍历 $100$ 次，则复杂度不超过 $100 * 1e5 = 1e7$，当 $MAX\_FLOW * u < v$ 时，则无解，输出 $-1$

注意一下乘法运算只需要考虑分子部分，分母部分不需要参与运算，在最后需要分子分母都除以 $gcd$ 以保证最简

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int maxn = 100;      //点数
const int INF = 0x3f3f3f3f;

struct Edge {
    int from, to, cap, flow, cost;

    Edge(int u, int v, int c, int f, int cc)
            : from(u), to(v), cap(c), flow(f), cost(cc) {}
};

vector<long long> res;

struct MCMF {
    int n, m;
    vector<Edge> edges;
    vector<int> G[maxn];
    int inq[maxn];  //是否在队列中
    int d[maxn];    //bellmanford
    int p[maxn];    //上一条弧
    int a[maxn];    //可改进量
    void init(int n) {
        this->n = n;
        for (int i = 0; i <= n; ++i) G[i].clear();
        edges.clear();
    }

    void addEdge(int from, int to, int cap, int cost) {
        edges.emplace_back(Edge(from, to, cap, 0, cost));
        edges.emplace_back(Edge(to, from, 0, 0, -cost));
        m = int(edges.size());
        G[from].emplace_back(m - 2);
        G[to].emplace_back(m - 1);
    }

    bool spfa(int s, int t, int &flow, ll &cost) {
        for (int i = 1; i <= n; ++i) d[i] = INF;
        memset(inq, 0, sizeof(inq));
        d[s] = 0;
        inq[s] = 1;
        p[s] = 0;
        queue<int> q;
        a[s] = INF;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inq[u] = 0;
            for (int i = 0; i < int(G[u].size()); ++i) {
                Edge &e = edges[G[u][i]];
                if (e.cap > e.flow && d[e.to] > d[u] + e.cost) {
                    d[e.to] = d[u] + e.cost;
                    p[e.to] = G[u][i];
                    a[e.to] = min(a[u], e.cap - e.flow);
                    if (!inq[e.to]) {
                        q.push(e.to);
                        inq[e.to] = 1;
                    }
                }
            }
        }
        if (d[t] == INF) return false;
        flow += a[t];
        cost += (ll) d[t] * (ll) a[t];
        res.push_back(d[t]);
        for (int u = t; u != s; u = edges[p[u]].from) {
            edges[p[u]].flow += a[t];
            edges[p[u] ^ 1].flow -= a[t];
        }
        return true;
    }

    int MincostMaxflow(int s, int t, ll &cost) {
        int flow = 0;
        cost = 0;
        while (spfa(s, t, flow, cost));
        return flow;
    }
} mcmf;

int n, m;

void solve() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.precision(10);
    cout << fixed;
    while (cin >> n >> m) {
        mcmf.init(n + 10);
        res.clear();
        for (int i = 0; i < m; ++i) {
            int u, v, f;
            cin >> u >> v >> f;
            mcmf.addEdge(u, v, 1, f);
        }
        ll cost = 0;
        ll mf = mcmf.MincostMaxflow(1, n, cost);
        int q;
        cin >> q;
        while (q--) {
            ll u, v;
            cin >> u >> v;
            if (mf * u < v) {
                cout << "NaN" << '\n';
                continue;
            }
            ll sum = 0;
            ll ans = 0;
            for (auto item : res) {
                if (sum + u <= v) {
                    sum += u;
                    ans += item * u;
                } else {
                    ans += (v - sum) * item;
                    break;
                }
            }
            ll g = __gcd(ans, v);
            cout << ans / g << '/' << v / g << '\n';
        }
    }
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    int test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        if (acm_local_for_debug == '$') exit(0);
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
