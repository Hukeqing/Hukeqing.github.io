---
title: Codeforces Round 888 (Div. 3)
date: 2023-08-20 22:27:27
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Escalator Conversations

## 大致题意

有一个 $n$ 级台阶，每级 $h$ 高，有 $t$ 个人，问高为 $H$ 的一个人，通过在台阶上的方式，可以和哪些人等高

## 思路

简单题，差值 mod 一下恰好是台阶的倍数，且倍数恰好小于台阶数量，那么就可以了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k, h, ans = 0;
        cin >> n >> m >> k >> h;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            int dif = abs(tmp - h);
            if (dif == 0 || dif % k) continue;
            if (dif / k < m) ans++;
        }
        cout << ans << endl;
    }
}
```

# B. Parity Sort

## 大致题意

有个数组，允许无限次交换两个位置，要求是交换的那两个数字奇偶性必须一致，问最终是否能有序

## 思路

简单题，每个位置最开始是奇数，那么无论怎么换都是奇数，且任何奇数都可以换到这个位置，偶数同理，故所以只需要排序后的每个位置的奇偶性保持即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data1(n), data2(n);
        for (int i = 0; i < n; ++i) cin >> data1[i];
        for (int i = 0; i < n; ++i) data2[i] = data1[i];
        sort(data2.begin(), data2.end());
        bool check = false;
        for (int i = 0; i < n; ++i) if (data1[i] % 2 != data2[i] % 2) check = true;
        cout << (check ? "NO" : "YES") << endl;
    }
}
```

# C. Tiles Comeback

## 大致题意

问能否在一个数列中找到一个子序列，满足

 - 长度恰好是 $k$ 的倍数
 - 将序列每 $k$ 个一段，分成 $x$ 段，每一段内的数字相同
 - 第一个和最后一个必须在序列中

问是否存在即可

## 思路

简单题，分两种情况，第一种，如果开头和结尾的数字相同。那能找到 $k$ 个和首尾相同的数字，直接选出这些数字即可

如果不同，那么只需要和首相同找出 $k$ 个，然后在这 $k$ 个之后再找出 $k$ 个和尾相同的即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        if (data.front() == data.back()) {
            int cnt = 0;
            for (int i = 0; i < n; ++i) cnt += data[i] == data.front();
            cout << (cnt >= k ? "YES" : "NO") << endl;
        } else {
            int cnt1 = 0, cnt2 = 0;
            for (int i = 0; i < n; ++i)
                if (cnt1 >= k) cnt2 += data[i] == data.back();
                else cnt1 += data[i] == data.front();
            cout << (cnt1 >= k && cnt2 >= k ? "YES" : "NO") << endl;
        }
    }
}
```

# D. Prefix Permutation Sums

## 大致题意

给你一个丢了一个数字的前缀和，原数组为 $n$ 的排列，问是否存在可能的原始串

## 思路

前缀和相减就是原始数字了，直接算出所有的前缀差，找出重复的，和没有出现的，算一算加起来是否相同。或者只有一个没有出现的，恰好是最后那个值丢了的情况

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        set<int> st;
        for (int i = 0; i < n; ++i) st.insert(i + 1);
 
        int last = 0, out = -1;
        for (int i = 0; i < n - 1; ++i) {
            int tmp;
            cin >> tmp;
            auto iter = st.find(tmp - last);
            if (iter == st.end()) out = tmp - last;
            else st.erase(iter);
            last = tmp;
        }
 
        if (st.size() == 1 && out == -1) {
            cout << "YES" << endl;
            continue;
        }
 
        if (st.size() != 2) {
            cout << "NO" << endl;
            continue;
        }
 
        int a, b;
        a = *st.begin();
        b = *(++st.begin());
        cout << (a + b == out ? "YES" : "NO") << endl;
    }
}
```

# E. Nastya and Potions

## 大致题意

有 $n$ 种药品，其中部分药品可以通过其他药品合成得到，每种药品的价格已知，且部分药品有库存，即免费，问得到每一种药品需要多少钱

## 思路

其实这是一个 Dag 图，拓扑一下，然后不断计算更小的值，替换掉原来的价格即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> cost(n + 1);
        for (int i = 1; i <= n; ++i) cin >> cost[i];
        for (int i = 0; i < k; ++i) {
            int tmp;
            cin >> tmp;
            cost[tmp] = 0;
        }
 
        vector<vector<int>> from(n + 1);
        vector<vector<int>> to(n + 1);
        vector<int> in(n + 1, 0);
        queue<int> q;
        for (int i = 1; i <= n; ++i) {
            int cnt;
            cin >> cnt;
            if (cnt == 0) q.push(i);
            for (int j = 0; j < cnt; ++j) {
                int tmp;
                cin >> tmp;
                from[i].push_back(tmp);
                to[tmp].push_back(i);
                in[i]++;
            }
        }
 
        while (!q.empty()) {
            auto cur = q.front();
            q.pop();
            if (!from[cur].empty()) {
                int c = 0;
                for (auto &item: from[cur]) c += cost[item];
                cost[cur] = min(cost[cur], c);
            }
            for (auto &item : to[cur])
                if (--in[item] == 0) q.push(item);
        }
 
        for (int i = 1; i <= n; ++i) cout << cost[i] << " \n"[i == n];
    }
}
```

# F. Lisa and the Martians

## 大致题意

给定一个 $k$，然后给出 $n$ 个数字，保证每个数字都是 $[1, 2^k)$ 内，需要找到一个值 $x$，并取出这些数字中的两个 $a, b$，计算 $(a \oplus x) \& (b \oplus x)$ 的最大值

## 思路

根据公式，我们可以推导出：若 $a$ 和 $b$ 在二进制上重合度越大，则结果越大，相同即可以得到 $1$，否则这个 bit 只能是 $0$。而其中，高位的价值最高，故需要先满足高位相同

这时可以想到 01字典树，然后从根开始往下 dfs 找，找到重合度尽可能大的，然后再计算分歧部分的代价。

定义 01字典树的结构

```cpp
struct node {
    int zero = -1, one = -1, cnt = 0;
    vector<int> index;
};
```

其中 `zero` 表示接下来为 `0` 的字典树节点，同样 `one` 为接下来为 `1` 的字典树节点。`cnt` 表示这个节点下有多少值，`index` 则是为了求解，需要保留下数值原始的下标

比如当前正在某个 01字典树的节点上，已知下面的 `0` 节点下至少有两个值，那么就可以考虑更具体的情况，`1` 也相同，此时并不需要考虑两个值分散在两边的可能，因为这样的话，下个 bit 就只能得到 `0`，而相同可以得到 `1`，故不需要考虑分散的情况

如果某个节点下面只有一个值，那就毫无意义，不需要考虑下去了，理论上也不应该走到这种分支

如果某个节点上恰好有两个值，且左边有一个右边有一个，这个时候是分歧点，故可以在此节点取出下面的那两个值，然后计算结果

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        struct node {
            int zero = -1, one = -1, cnt = 0;
            vector<int> index;
        };
 
        int n, k;
        cin >> n >> k;
        vector<node> tree(n * 40);
        int rNode = 1, root = 0;
 
        auto newNode = [&]() {
            return rNode++;
        };
        auto add = [&](int x, int index) {
            tree[root].cnt++;
            int cur = root;
            for (int i = k - 1; i >= 0; --i) {
                if (x & (1 << i)) {
                    cur = tree[cur].one == -1 ? tree[cur].one = newNode() : tree[cur].one;
                    tree[cur].cnt++;
                } else {
                    cur = tree[cur].zero == -1 ? tree[cur].zero = newNode() : tree[cur].zero;
                    tree[cur].cnt++;
                }
            }
            tree[cur].index.push_back(index);
        };
 
        auto find = [&](int cur, int &x, int deep) {
            while (cur != -1) {
                if (tree[cur].zero == -1 && tree[cur].one == -1) return tree[cur].index[0];
                if (tree[cur].zero == -1) {
                    x |= 1 << deep;
                    cur = tree[cur].one;
                } else cur = tree[cur].zero;
                deep--;
            }
 
            return -1;
        };
 
        int res = INT_MIN, resX, l, r;
        function<void(int, int x, int)> dfs = [&](int cur, int x, int deep) {
            if (tree[cur].zero == -1 && tree[cur].one == -1) {
                assert(tree[cur].cnt >= 2 && tree[cur].index.size() >= 2);
 
                res = (1 << k) - 1;
                l = tree[cur].index[0];
                r = tree[cur].index[1];
                resX = x;
                return;
            }
            if (tree[cur].zero == -1) dfs(tree[cur].one, x, deep - 1);
            else if (tree[cur].one == -1) dfs(tree[cur].zero, x | (1 << deep), deep - 1);
            else {
                if (tree[tree[cur].zero].cnt >= 2) dfs(tree[cur].zero, x | (1 << deep), deep - 1);
                if (tree[tree[cur].one].cnt >= 2) dfs(tree[cur].one, x, deep - 1);
 
                if (tree[tree[cur].zero].cnt == 1 && tree[tree[cur].one].cnt == 1) {
                    int lv = 0, rv = 1 << deep;
                    int li = find(tree[cur].zero, lv, deep - 1);
                    int ri = find(tree[cur].one, rv, deep - 1);
                    int tmp = 0;
                    for (int i = k - 1; i > deep; --i) tmp |= 1 << i;
                    for (int i = deep; i >= 0; --i) if ((lv & (1 << i)) == (rv & (1 << i))) {
                        tmp |= 1 << i;
                        x |= (lv & (1 << i)) ? 0 : 1 << i;
                    }
                    if (tmp > res) {
                        l = li;
                        r = ri;
                        resX = x;
                        res = tmp;
                    }
                }
            }
        };
 
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            add(tmp, i + 1);
        }
 
        dfs(0, 0, k - 1);
        cout << l << ' ' << r << ' ' << resX << endl;
    }
}
```

# G. Vlad and the Mountains

## 大致题意

有 $n$ 座山，山之间有桥，从 $a$ 山到 $b$ 山的代价为 $h\_b - h\_a$，注意，可以为负数。代价超过上限则不能走

询问 $q$ 次，问能否从 $a$ 山到 $b$ 山，在能够消耗最大 $e$ 的代价情况下

## 思路

首先不能在线做，只能离线，毕竟在线就只剩下预处理求出任意两点的代价了

题意解析也很简单的，就是需要找到一条路径，满足最大值小于等于 $h\_a + e$ 即可

询问是否可达，很容易想到了并查集去做，毕竟在一个集合里就是可达

接下来，我们根据海拔的高低进行排序，然后从低海拔开始，将山加入集合，并将可以使用的边加入并查集

因为每个询问能够到达最大高度是确定的，所以同时可以遍历所有询问，若最大高度已经到达了，下一个加入的山会超出最大高度了，此时这两个山还没有在一个集合中，那么必然不可达

## AC code

```cpp
void solve() {
    struct node {
        int v, n;
    };
 
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<pair<int, int>> h(n + 1);
        vector<node> edge(m);
        vector<int> head(n + 1, -1);
        for (int i = 1; i <= n; ++i) cin >> h[i].first;
        for (int i = 1; i <= n; ++i) h[i].second = i;
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
            if (h[u].first > h[v].first) {
                edge[i] = {v, head[u]};
                head[u] = i;
            } else {
                edge[i] = {u, head[v]};
                head[v] = i;
            }
        }
        int q;
        cin >> q;
        struct query {
            int u, v, e, i;
        };
        vector<query> ql(q);
        vector<bool> ans(q);
        for (int i = 0; i < q; ++i) cin >> ql[i].u >> ql[i].v >> ql[i].e;
        for (int i = 0; i < q; ++i) ql[i].e += h[ql[i].u].first;
        for (int i = 0; i < q; ++i) ql[i].i = i;
 
        sort(h.begin() + 1, h.end());
        sort(ql.begin(), ql.end(), [&](const query &a, const query &b) { return a.e < b.e; });
 
        vector<int> fa(n + 1);
        for (int i = 0; i < fa.size(); ++i) fa[i] = i;
        function<int(int)> find = [&](int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); };
        auto join = [&](int x, int y) {
            int rx = find(x), ry = find(y);
            if (rx == ry) return;
            fa[rx] = ry;
        };
 
        int last = 0, qPtr = 0;
        for (int i = 1; i <= n; ++i) {
            if (last != h[i].first) {
                while (qPtr < q && ql[qPtr].e < h[i].first) {
                    auto &que = ql[qPtr];
                    int ru = find(que.u), rv = find(que.v);
                    ans[que.i] = ru == rv;
                    qPtr++;
                }
            }
            last = h[i].first;
            for (int j = head[h[i].second]; j != -1; j = edge[j].n) join(h[i].second, edge[j].v);
        }
 
        while (qPtr < q) {
            auto &que = ql[qPtr];
            int ru = find(que.u), rv = find(que.v);
            ans[que.i] = ru == rv && ql[qPtr].e >= last;
            qPtr++;
        }
 
        for (auto item: ans) cout << (item ? "YES" : "NO") << endl;
        cout << endl;
    }
}
```
