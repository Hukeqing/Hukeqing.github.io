---
title: 【HDU5934】Bomb——有向图强连通分量+重建图
date: 2019-10-13 15:22:03
categories: ACM&算法
tag:
 - ACM
 - HDU
math: true
---

# 题目大意
二维平面上有 n 个爆炸桶，$i-th$爆炸桶位置为 $(x_i, y_i)$ 爆炸范围为 $r_i$ ，且需要 $c_i$ 的价格引爆，求把所有桶引爆所需的钱。

# 分析
通过求有向图的强连通分量，求出所有爆炸块（满足引爆一个块内的任意一个爆炸桶就可以摧毁这个块内的爆炸桶），然后把所有爆炸块视为一个爆炸桶，价值为爆炸块内的价值最小值，然后重建有向图，将新建的有向图所有入度为 0 的点的价值相加，就是答案。

# AC-Code

```cpp
#include <bits/stdc++.h>

using namespace std;

const int MAXN = 1100;  // 点数
const int MAXM = 1000100; // 边数
struct Edge {
    int to, next;
} edge[MAXM]; // 只有这里写的是 MAXM

int head[MAXN], tot;
int Low[MAXN], DFN[MAXN], Stack[MAXN], Belong[MAXN]; //Belong 数组的值是 1 ～ scc
int Index, top;
int scc; // 强连通分量的个数
bool Instack[MAXN];
int num[MAXN]; // 各个强连通分量包含点的个数，数组编号 1 ～ scc
// num 数组不一定需要，结合实际情况

void addedge(int u, int v) {
    edge[tot].to = v;
    edge[tot].next = head[u];
    head[u] = tot++;
}

void Tarjan(int u) {
    int v;
    Low[u] = DFN[u] = ++Index;
    Stack[top++] = u;
    Instack[u] = true;
    for (int i = head[u]; i != -1; i = edge[i].next) {
        v = edge[i].to;
        if (!DFN[v]) {
            Tarjan(v);
            if (Low[u] > Low[v])
                Low[u] = Low[v];
        } else if (Instack[v] && Low[u] > DFN[v])
            Low[u] = DFN[v];
    }
    if (Low[u] == DFN[u]) {
        scc++;
        do {
            v = Stack[--top];
            Instack[v] = false;
            Belong[v] = scc;
            num[scc]++;
        } while (v != u);
    }
}

void solve(int N) {
    memset(DFN, 0, sizeof(DFN));
    memset(Instack, false, sizeof(Instack));
    memset(num, 0, sizeof(num));
    Index = scc = top = 0;
    for (int i = 1; i <= N; i++)
        if (!DFN[i])
            Tarjan(i);
}

void init() {
    tot = 0;
    memset(head, -1, sizeof(head));
}

struct node {
    int x, y, r, c;

    bool in_boom(const node &other) const {
        return hypot(abs(x - other.x), abs(y - other.y)) <= r;
    }
};

node nodeList[1100];
int n;

void init_graph1() {
    init();
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (i == j) continue;
            if (nodeList[i].in_boom(nodeList[j]))
                addedge(i, j);
        }
    }
}

struct Graph {
    struct Node {
        int deg;
        int value;
    };
    Node node[MAXN];

    void init() {
        for (int i = 0; i < n + 5; ++i) {
            node[i].deg = 0;
            node[i].value = INT_MAX;
        }
    }

    void add_edge(int from, int to) {
        if (from != to)
            node[to].deg++;
    }
};

Graph graph;
int ans;

void tp_init() {
    graph.init();
    for (int i = 1; i <= n; ++i) {
        graph.node[Belong[i]].value = min(graph.node[Belong[i]].value, nodeList[i].c);
        for (int j = 1; j <= n; ++j) {
            if (i == j) continue;
            if (nodeList[i].in_boom(nodeList[j]))
                graph.add_edge(Belong[i], Belong[j]);
        }
    }
}

void tp() {
    ans = 0;
    tp_init();

    for (int i = 1; i <= scc; ++i) {
        if (graph.node[i].deg == 0) {
            ans += graph.node[i].value;
        }
    }
}

void solve() {
    int t;
    cin >> t;
    for (int ts = 0; ts < t; ++ts) {
        cin >> n;
        for (int i = 1; i <= n; ++i) {
            cin >> nodeList[i].x >> nodeList[i].y >> nodeList[i].r >> nodeList[i].c;
        }
        init_graph1();
        solve(n);
        tp();
        cout << "Case #" << ts + 1 << ": " << ans << endl;
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
