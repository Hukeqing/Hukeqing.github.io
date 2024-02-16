---
title: Codeforces Round 908 (Div. 2)
date: 2024-01-03 23:14:51
updated: 2024-01-03 23:14:51
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 908 (Div. 2) 个人写题记录
---

# A. Secret Sport

## 大致题意

有 A 和 B 两个人，他们在比赛，每一局比赛中，率先赢得 $n$ 小场的人获胜，最终赢得 $m$ 局的人获胜，给出每一小场的获胜情况，问最终谁获胜了

## 思路

没有那么麻烦，说白了最后一个获胜的人，必定是最终获胜的人

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
        cout << str.back() << endl;
    }
}
```

# B. Two Out of Three

## 大致题意

有一个数组 $a$，希望构建一个数组 $b$，满足下面三条中的任意两条，且仅满足两条

- 存在一个 $i,j \in [1, n]$，满足 $a\_i = a\_j, b\_i = 1, b\_j = 2$
- 存在一个 $i,j \in [1, n]$，满足 $a\_i = a\_j, b\_i = 1, b\_j = 3$
- 存在一个 $i,j \in [1, n]$，满足 $a\_i = a\_j, b\_i = 2, b\_j = 3$

## 思路

注意是要仅满足两条，所以只需要满足任意两组相同的数值对即可。即存在两个数字，他们出现次数至少两次，即可

## AC code

```cpp

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        map<int, int> cnt;
        for (const auto& i: data) ++cnt[i];
        vector<int> two;
        for (auto [fst, snd]: cnt) {
            if (snd >= 2) two.push_back(fst);
        }
        if (two.size() > 1) {
            int flag[2] = {0, 0};
            for (int i = 0; i < n; ++i) {
                if (data[i] == two[0]) {
                    cout << (flag[0] == 0 ? 1 : 2) << ' ';
                    ++flag[0];
                } else if (data[i] == two[1]) {
                    cout << (flag[1] == 0 ? 1 : 3) << ' ';
                    ++flag[1];
                } else cout << 1 << ' ';
            }
            cout << endl;
        } else {
            cout << -1 << endl;
        }
    }
}
```

# C. Anonymous Informant

## 大致题意

有一个初始的数组，未知长什么样子，但是经过 $n$ 次，操作后得到了当前数组，问是否存在原来的数组

操作的方式是，选择一个 $i$，满足 $a\_i = i$，并将整个数组左移 $i$ 次

## 思路

每个值，当其恰好满足 $a\_i = i$ 的时候，即可完成一次固定的移动，从最终结果我们来看，说白了就是可以从某个固定的旋转次数到另外某个固定的移动次数

那么说白了就是一个图，这样我们就可以根据旋转次数作为图的下标，建图

接下来需要找的就是拓扑后，最终旋转次数为 0 次的时候，拓扑长度最多为多少次，或者存在包含 0 节点的环即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n);
        for (auto& i: data) cin >> i;

        struct node {
            int v, n;
        };
        vector<node> edge(n);
        vector head(n, -1), deg(n, 0);

        for (int i = 0; i < n; ++i) {
            if (data[i] > n) continue;
            const int u = (i + 1 - data[i] + n) % n;
            const int v = (u + data[i]) % n;
            edge[i] = {v, head[u]};
            head[u] = i;
            ++deg[v];
        }

        vector<int> vis(n + 1, false);
        bool circle = false;
        int maxLen = -1;
        queue<pair<int, int>> q;
        for (int i = 0; i < n; ++i) if (!deg[i]) q.emplace(i, 0);
        while (!q.empty()) {
            auto [fst, snd] = q.front();
            q.pop();
            if (fst == 0) maxLen = max(maxLen, snd);
            vis[fst] = true;
            for (int i = head[fst]; ~i; i = edge[i].n) {
                --deg[edge[i].v];
                if (!deg[edge[i].v]) q.emplace(edge[i].v, snd + 1);
            }
        }

        if (deg[0]) circle = true;

        cout << (circle || maxLen >= k ? "YES" : "NO") << endl;
    }
}
```

# D. Neutral Tonality

## 大致题意

两个数组，数组 $a$ 是固定顺序，数组 $b$ 可以按照任意顺序插入到 $a$ 数组中，使得整个数组的 LIS 最短

## 思路

这题应该才是 C 题，很简单，插入的顺序按照从大到小插入，每次插入的时候，插入到右边没有比当前值小的值处即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<int> a(n), b(m), ma(n);
        for (auto& i: a) cin >> i;
        for (auto& i: b) cin >> i;
        sort(b.begin(), b.end(), greater<>());
        ma[n - 1] = a[n - 1];
        for (int i = n - 2; i >= 0; --i) ma[i] = max(ma[i + 1], a[i]);
        int j = 0;
        for (int i = 0; i < n; ++i) {
            while (j < m && b[j] >= ma[i]) cout << b[j++] << ' ';
            cout << a[i] << ' ';
        }
        while (j < m) cout << b[j++] << ' ';
        cout << endl;
    }
}
```
