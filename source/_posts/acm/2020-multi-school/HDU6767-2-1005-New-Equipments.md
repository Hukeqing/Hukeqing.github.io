---
title: 【2020HDU多校】第二场1005（HDU6767）New Equipments——费用流
date: 2020-07-24 13:12:42
updated: 2020-07-24 13:12:42
categories: ACM&算法
tag:
- ACM
- HDU
math: true
description: 【2020HDU多校】第二场1005（HDU6767）New Equipments 题解思路，主要是用了费用流
---

[题目链接](http://acm.hdu.edu.cn/showproblem.php?pid=6767)
# 题目大意
给出 $n$ 个工人和 $m$ 件装备，装备的编号为 $1, 2, 3 ... m$。
对于工人 $i$ ，他有三个参数 $a_i, b_i, c_i$，当为这个工人装备了第 $j$ 个装备时，需要花费 $a_i * j ^ 2+ b_i * j + c_i$ 的费用。
当为 $k$ 个工人装备上装备时，最小花费是多少。
对所有的 $k$ 的情况均需要输出
# 分析
费用流
将每个员工与源点链接，取每个员工的二次函数曲线的最小值附近的 $n$ 个点，与员工相连，所有的在二次函数曲线上的点与汇点相连，员工连接到二次函数的线需要设定费用，其他线费用均为 $0$，所有线的流量均为 $1$

输出每次 spfa 过程中得到的费用即可

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const ll maxn = 3000;
const ll INF = 0x3f3f3f3f3f3f3f3f;

bool flag;

struct Edge {
    ll from, to, cap, flow, cost;

    Edge(ll u, ll v, ll c, ll f, ll cc)
            : from(u), to(v), cap(c), flow(f), cost(cc) {}
};

struct MCMF {
    ll n, m;
    vector<Edge> edges;
    vector<ll> G[maxn];
    ll inq[maxn];  //是否在队列中
    ll d[maxn];    //bellmanford
    ll p[maxn];    //上一条弧
    ll a[maxn];    //可改进量
    void init(ll nn) {
        this->n = nn;
        for (ll i = 0; i <= n; ++i) G[i].clear();
        edges.clear();
    }

    void addEdge(ll from, ll to, ll cap, ll cost) {
        edges.emplace_back(Edge(from, to, cap, 0, cost));
        edges.emplace_back(Edge(to, from, 0, 0, -cost));
        m = (ll) (edges.size());
        G[from].emplace_back(m - 2);
        G[to].emplace_back(m - 1);
    }

    bool spfa(ll s, ll t, ll &flow, ll &cost) {
        for (ll i = 1; i <= n; ++i) d[i] = INF;
        memset(inq, 0, sizeof(inq));
        d[s] = 0;
        inq[s] = 1;
        p[s] = 0;
        queue<ll> q;
        a[s] = INF;
        q.push(s);
        while (!q.empty()) {
            ll u = q.front();
            q.pop();
            inq[u] = 0;
            for (ll i = 0; i < (ll) (G[u].size()); ++i) {
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
        cout << (flag ? " " : "") << cost;
        flag = true;
        for (ll u = t; u != s; u = edges[p[u]].from) {
            edges[p[u]].flow += a[t];
            edges[p[u] ^ 1].flow -= a[t];
        }
        return true;
    }

    ll MincostMaxflow(ll s, ll t, ll &cost) {
        ll flow = 0;
        cost = 0;
        while (spfa(s, t, flow, cost));
        return flow;
    }
} mcmf;

struct Node {
    ll a, b, c;
    ll l, r;

    ll cal(ll x) {
        return a * x * x + b * x + c;
    }

    void make(ll n, ll m) {
        ll mid = -b / 2 / a;
        l = mid - n / 2 - 1;
        r = mid + n / 2 + 1;
        l = max(1ll, l);
        r = min(m, r);
        if (r == m) {
            l = r - n - 2;
        } else if (l == 1) {
            r = l + n + 2;
        }
    }
} node[60];

void solve() {
    ll T;
    cin >> T;
    for (ll ts = 0; ts < T; ++ts) {
        flag = false;
        unordered_map<ll, ll> trans;
        ll n, m;
        cin >> n >> m;
        ll ind = 51;
        for (ll i = 1; i <= n; ++i) {
            cin >> node[i].a >> node[i].b >> node[i].c;
            node[i].make(n, m);
            ll l = node[i].l;
            ll r = node[i].r;
            assert(r - l < 60);
            for (ll j = l; j <= r; ++j) {
                if (trans.count(j)) continue;
                trans.insert({j, ind++});
            }
        }
        ll source = ind + 10, target = ind + 11;
        mcmf.init(target + 10);
#ifdef ACM_LOCAL
        cerr << target + 10 << endl;
#endif
        for (auto &item : trans)
            mcmf.addEdge(item.second, target, 1, 0);
        for (ll i = 1; i <= n; ++i) {
            mcmf.addEdge(source, i, 1, 0);
            for (ll j = node[i].l; j <= node[i].r; ++j) {
                mcmf.addEdge(i, trans[j], 1, node[i].cal(j));
            }
        }
        ll cost;
        mcmf.MincostMaxflow(source, target, cost);
        cout << endl;
    }
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    signed test_index_for_debug = 1;
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
