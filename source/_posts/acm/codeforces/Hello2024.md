---
title: Hello 2024
date: 2024-03-10 10:31:31
updated: 2024-03-10 10:31:31
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Hello 2024 个人写题记录
---

# A. Wallet Exchange

## 大致题意

Alice 和 Bob 博弈，有两个钱包，每次可以选择一个钱包取走一块钱，问谁会没有办法操作

## 思路

求和对 2 取模就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b;
        cin >> a >> b;
        cout << ((a + b) % 2 ? "Alice" : "Bob") << endl;
    }
}
```

# B. Plus-Minus Split

## 大致题意

有一个 `-+` 组成的字符串，允许将其拆成任意数量段，将 `-` 视为 `-1` 然后将 `+` 视为 `1`，然后对每一段单独求和

再将每一段的和乘上其长度，得到段的成本，所有段的成本之和就是总成本，问让成本最低怎么办

## 思路

易得，除了之和等于 `0` 的情况，其他情况都不要合成一个段，所以最终就是求和成 `0` 的段以外部分成本

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.resize(n);
        cin >> str;
        int cnt[2] = {};
        for (const auto& c: str) ++cnt[c == '+'];
        cout << abs(cnt[0] - cnt[1]) << endl;
    }
}
```

# C. Grouping Increases

## 大致题意

将一个字符串拆成两个子序列，每个子序列内，每有一对相邻的正序对就算一个成本，问如何拆让拆成本最小

## 思路

贪心模拟即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        int data[2] = {0, 0};
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp > data[0] && tmp > data[1]) {
                data[data[0] > data[1] ? 1 : 0] = tmp;
                ++ans;
            } else if (tmp <= data[0] && tmp <= data[1])
                data[data[0] > data[1] ? 1 : 0] = tmp;
            else data[data[0] > data[1] ? 0 : 1] = tmp;
        }
        cout << max(ans - 2, 0) << endl;
    }
}
```

# D. 01 Tree

## 大致题意

有一个 01 字典树，已知每个叶子节点的值中 `1` 的数量，以及所有叶子节点的顺序

问是否存在这样的字典树

## 思路

因为每个值必然有一个相邻的节点和它差 `1`（那个节点不一定是叶子节点）

所以可以从最大值开始，每次找它相邻的值上是否有一个恰好比它小 1 的值，那么可以删除这两个值，把他们的父节点的值加进去（恰好就是它们两个中的较小者）

注意相邻的两个相同相邻的值的时候，它们可以合并

整个过程有点类似哈夫曼编码的过程

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        map<int, int> mp;
        vector<vector<int>> index(n);
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mp.emplace(i, tmp);
            index[tmp].push_back(i);
        }
        for (int t = n - 1; t > 0; --t) {
            auto& v = index[t];
            if (v.empty()) continue;
            for (int i: v) {
                const auto iter = mp.find(i);
                // check near same
                auto riter = iter;
                ++riter;
                if (riter != mp.end() && riter->second == t) {
                    mp.erase(iter);
                    continue;
                }
                // check near - 1
                if (riter->second == t - 1) {
                    mp.erase(iter);
                    continue;
                }
                if (auto liter = iter; liter != mp.begin()) {
                    --liter;
                    if (liter->second == t - 1) {
                        mp.erase(iter);
                        continue;
                    }
                }
            }
        }
        cout << (mp.size() == 1 && mp.begin()->second == 0 ? "YES" : "NO") << endl;
    }
}
```
