---
title: Codeforces Round 911 (Div. 2)
date: 2024-02-03 12:43:44
updated: 2024-02-03 12:43:44
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 911 (Div. 2) 个人写题记录
---

# A. Cover in Water

## 大致题意

有一个区域，有些地方有空有些地方有墙，可以进行如下操作

1. 选择一个空的区域，放上水
2. 选择已经已经有水的区域，把水移动到别的地方

如果一个地方是空的，且它的两边都是水，那么这个地方自然也有水

问最少操作多少次 1 操作，能让所有空的地方都有水

## 思路

由于 2 操作不计入成本，所以要多移动，而因为两个水中间会无限生成水，所以可以不断移走中间的水来实现

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
        int tot = 0, ma = 0, cur = 0;
        for (const auto& item: str) {
            if (item == '.') {
                ++tot;
                ++cur;
            } else {
                ma = max(ma, cur);
                cur = 0;
            }
        }
        ma = max(ma, cur);
        if (ma >= 3) cout << 2 << endl;
        else cout << tot << endl;
    }
}
```

# B. Laura and Operations

## 大致题意

有三个值，$a, b, c$，每次允许减少其中两个 $x$，然后增加剩下的那个 $x$，问是否可能最后只剩下其中一个值

## 思路

反过来思考，一个值可以变成剩下两个值。

如果希望最后留下的是 $a$，那么必然 $b = c$，那么可以考虑不断减少 $b/c$ 使得 $b/c$ 相同，也就是说，只要 $b+c$ 是偶数即可

同理可以得到剩下两个的解

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, c;
        cin >> a >> b >> c;
        cout << ((b + c) % 2 ? 0 : 1) << ' ' << ((a + c) % 2 ? 0 : 1) << ' ' << ((b + a) % 2 ? 0 : 1) << endl;
    }
}
```

# C. Anji's Binary Tree

## 大致题意

有一颗二叉树，每个节点上都有 `LRU` 三个字母的其中一个，分别表示当到达这个节点的时候如何移动，比如 `L` 表示移动到它的左孩子

问至少修改几个，可以从根节点出发到任意一个叶子节点

## 思路

树上找路径就行，每个节点选择左边和右边的代价里选较小的即可

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
        vector<pair<int, int>> node(n);
        cin >> str;
        for (auto& [fst, snd]: node) cin >> fst >> snd;
        for (auto& [fst, snd]: node) {
            --fst;
            --snd;
        }

        function<int(int)> dfs = [&](const int x) {
            if (node[x].first == -1 && node[x].second == -1) return 0;
            if (node[x].first == -1) {
                return dfs(node[x].second) + (str[x] != 'R');
            }
            if (node[x].second == -1) {
                return dfs(node[x].first) + (str[x] != 'L');
            }
            const int l = dfs(node[x].first) + (str[x] != 'L'), r = dfs(node[x].second) + (str[x] != 'R');
            return min(l, r);
        };

        cout << dfs(0) << endl;
    }
}
```
