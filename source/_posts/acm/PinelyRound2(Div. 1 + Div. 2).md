---
title: Pinely Round 2 (Div. 1 + Div. 2)
date: 2023-09-01 22:41:20
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Channel

## 大致题意

你是一个频道的频道主，然后发了一条消息，同时你能知道订阅者上下线的消息（不知道具体是谁），上线的人必定看你的消息，问有没有可能所有人都看过你的消息了

## 思路

简单题，统计最大同时在线，和最多多少在线，就可以了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, a, q;
        cin >> n >> a >> q;
        string str;
        str.reserve(q);
        cin >> str;
        int ma = a, tot = a, cur = a;
        for (auto &item: str) {
            if (item == '+') {
                cur++;
                tot++;
                ma = max(ma, cur);
            } else cur--;
        }
        cout << (ma >= n ? "YES" : tot >= n ? "MAYBE" : "NO") << endl;
    }
}
```

# B. Split Sort

## 大致题意

有一个 $n$ 的排列，每次选择一个数组中的一个值，将小于它的值放左边，大于等于的放右边，顺序不变，问最多操作几次后数组有序

## 思路

第一反应就是归并排序，太像了，只需要算出归并排序需要几次就行了

但是这个值可以说是确定的，即几乎等于 $n$，这是归并的性质决定的。而实际上已经基本排序好的数组，压根不需要那么多次

再仔细思考操作带来的意义，实际上本身顺序并没有发生太大变动，假如移动的是 $x$，那么对于除开 $x$ 以外的所有值而言，在 $[1, x)$ 内都没有发生相对位置变化，同理对于 $[x, n]$ 也是，但是跨 $x$ 的相对位置都变成正确的了。即当对任意的 $x$ 进行操作后，实际上就解决掉了 $x$ 关联的全部的逆序对问题，以及跨越 $x$ 的逆序对。

综上可以得到，若不选择 $x$ 的情况下，那么若 $x - 1$ 在 $x$ 的右侧情况下，那么必然永远不能消除此逆序对。所以只需要找出这样的逆序对，然后进行操作即可。至于剩下的逆序对，在完成上述操作后，自然已经满足要求了，这里不再详细证明

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        set<int> flag;
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (flag.count(tmp + 1)) ans++;
            flag.insert(tmp);
        }
        cout << ans << endl;
    }
}
```

# C. MEX Repetition

## 大致题意

给一个长度为 $n$ 的数组，其值在 $[0, n]$ 内，且没有重复

每次操作，需要依次对每一个值进行 $MEX$ 计算，并代替当前的值，问进行 $x$ 次操作后，数组变成什么样

## 思路

在数组最后补上没有的那个值，然后你就会发现只是在旋转数组罢了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n + 1);
        set<int> flag;
        for (int i = 0; i <= n; ++i) flag.insert(i);
        for (int i = 0; i < n; ++i) cin >> data[i];
        for (int i = 0; i < n; ++i) flag.erase(data[i]);
        data[n] = *flag.begin();
        k %= (n + 1);
        for (int i = 0; i < n; ++i) cout << data[(i + n + 1 - k) % (n + 1)] << " \n"[i == n - 1];
    }
}
```

# D. Two-Colored Dominoes

## 大致题意

有一个 $n \times m$ 的矩阵，矩阵上放着很多小木板，一块木板一定恰好占用两个相邻的格子，木板之间不重叠。

现在要给木板上色，黑色和白色，一块木板占用的两个格子，必须不同颜色。矩阵内任意一行一列都必须黑白色相同数量，给出一种上色法

## 思路

要相同，必然占用的格子数量是偶数

结论很简单，竖着的木板在同行的数量（或者横着的木板在同列的数量）一定是偶数

可以简单画一下错开的情况，就会发现无解了

知道这个结论之后随便画一下就好了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<string> ans(n);
        for (auto &row: ans) {
            row.reserve(m);
            cin >> row;
        }
 
        bool flag = true;
        for (int i = 0; i < n; ++i) {
            int last = -1;
            for (int j = 0; j < m; ++j) {
                // for U
                if (ans[i][j] != 'U') continue;
                if (last == -1) last = j;
                else {
                    ans[i][j] = 'W';
                    ans[i + 1][j] = 'B';
                    ans[i][last] = 'B';
                    ans[i + 1][last] = 'W';
                    last = -1;
                }
            }
            if (last != -1) {
                flag = false;
                break;
            }
        }
 
        for (int j = 0; j < m; ++j) {
            int last = -1;
            for (int i = 0; i < n; ++i) {
                // for L
                if (ans[i][j] != 'L') continue;
                if (last == -1) last = i;
                else {
                    ans[i][j] = 'W';
                    ans[i][j + 1] = 'B';
                    ans[last][j] = 'B';
                    ans[last][j + 1] = 'W';
 
                    last = -1;
                }
            }
            if (last != -1) {
                flag = false;
                break;
            }
        }
 
        if (!flag) {
            cout << -1 << endl;
            continue;
        }
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) cout << ans[i][j];
            cout << endl;
        }
    }
}
```

# E. Speedrun

## 大致题意

有 $n$ 个任务，每个任务完成需要的时间可以忽略不计，但是每个任务都有指定的完成时间点。时间是循环的，即类似自然时间，23 点之后又是 0 点。任务之间也有依赖关系

问最短需要多少时间完成这些任务

## 思路

一开始写了一个拓扑排序找，然后三分了所有可能的开始时间点（$[0, k]$），理论上时间应该来得及，但是不知道为什么 TLE 了

后面开始仔细思考其他解决方案

实际上每个节点的时间可以看成是 $h\_i + x * k$，即需要求出最大和最小值之差。然后对于第一批没有依赖的任务，他们可以是第一天完成的，也可以是第二天完成的，但是不可能是第三天完成的。故可以考枚举无依赖的任务是否是第二天完成的，然后计算此时最大的完成时间。由于无依赖任务本身也是有时间的，根据时间排序后遍历的话，若当前是第二天完成的，那么前面的也都是第二天完成的了，就不需要每次单独计算了，可以让下一次的状态是从上一次变化过来的，这样计算成本非常小

## AC code


```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k;
        cin >> n >> m >> k;
 
        struct node {
            int v, n;
 
            bool operator<(const node &rhs) const {
                return rhs.v < v;
            }
        };
 
        vector<int> cost(n);
        vector<int> head(n, -1);
        vector<node> edge(m);
        vector<int> deg(n, 0);
        for (auto &item: cost) cin >> item;
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
            edge[i] = {v - 1, head[u - 1]};
            head[u - 1] = i;
            deg[v - 1]++;
        }
 
        queue<int> q;
        vector<int> begin;
        for (int i = 0; i < n; ++i)
            if (deg[i] == 0) {
                q.push(i);
                begin.push_back(i);
            }
 
        int mx = 0, ans = LONG_LONG_MAX;
        while (!q.empty()) {
            int cur = q.front();
            q.pop();
 
            mx = max(mx, cost[cur]);
            for (int i = head[cur]; i != -1; i = edge[i].n) {
                --deg[edge[i].v];
                cost[edge[i].v] += ((max(0LL, cost[cur] - cost[edge[i].v]) + k - 1) / k) * k;
                if (deg[edge[i].v] == 0) q.push(edge[i].v);
            }
        }
        sort(begin.begin(), begin.end(), [&](const int &lhs, const int &rhs) {
            return cost[lhs] < cost[rhs];
        });
 
        ans = min(ans, mx - cost[begin.front()]);
 
        function<void(int)> add = [&](int x) {
            mx = max(mx, cost[x]);
            for (int i = head[x]; i != -1; i = edge[i].n) {
                if (cost[edge[i].v] - cost[x] >= 0) continue;
                cost[edge[i].v] += ((max(0LL, cost[x] - cost[edge[i].v]) + k - 1) / k) * k;
                add(edge[i].v);
            }
        };
 
        for (auto &item : begin) {
            ans = min(ans, mx - cost[item]);
            cost[item] += k;
            add(item);
        }
 
        ans = min(ans, mx - cost[begin.front()]);
 
        cout << ans << endl;
    }
}
```