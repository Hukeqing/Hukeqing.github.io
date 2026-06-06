---
title: Codeforces Round 1099 (Div. 2)
date: 2026-06-07 01:50:58
updated: 2026-06-07 01:50:58
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1099 (Div. 2) 个人写题记录
#index_img:
---

# A. Construct an Array

## 大致题意

要求构造一个数组，满足：

1. 任意两项不同
2. 任意相邻的两项相加不同
3. 任意相邻的两项相加不等于原数组中任意一个值

## 思路

我的构造思路比较简单：

注意到任意两项奇数相加一定为偶数，所以我们可以令原数组内的每一个元素都为奇数，那么相邻两数之和肯定为偶数，即可以满足第三条

剩下两条就比较好做，原数列保证递增，这样相邻两项相加后肯定不相等，因为一定也是一个递增序列

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        for (int i = 0; i < n; ++i) cout << (i << 1) + 1 << " \n"[i == n -1];
    }
}
```

# B. Another Sorting Problem

## 大致题意

给出一个序列 $a$，允许你选择其中的一个子序列，让子序列上的每一项都执行 $+ k$，其中 $k$ 为任意值。问能否将序列转为非递减序列

## 思路

容易得到，$k$ 不是越大越好，即有一个范围下，$k$ 可以达成目标，所以我们可以考虑找到最小的 $k$

由于需要加的那个值是确定的，且对所有值生效，那么它必定要满足一个条件，即

$\forall i > j, a_i < a_j$ 必然需要一个 $k$ 满足 $a_j + k >= a_i$

所以我们需要先找到最小的 $k$，即找到最大的 $k$，满足前面的等式

然后再带入序列测试一下是否满足，如果满足那就是正确答案

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; ++i) cin >> v[i];
        int l = 0, ml = v[0];
        for (int i = 1; i < n; ++i) {
            if (v[i] >= ml) {
                ml = v[i];
                continue;
            }
 
            l = max(l, ml - v[i]);
        }
 
        for (int i = 1; i < n; ++i) if (v[i] < v[i - 1]) v[i] += l;
        bool ok = true;
        for (int i = 0; i < n - 1; ++i) if (v[i] > v[i + 1]) ok = false;
        cout << (ok ? "YES" : "NO") << endl;
    }
}
```

# C. Chipmunk Theo and Equality

## 大致题意

有一个序列，允许你对任意一项执行以下操作

1. 如果它是偶数，则除以 2
2. 如果它是奇数，则 + 1

问至少需要几步，才能让整个序列里的所有值相同

## 思路

一开始我从二进制角度在考虑，其实这个过程就是不断消去末尾的 $0$，然后再 $+1$ 去消去末尾的 $1$，直到最后只剩下一个 $1$ 在二进制视角上，也就是 $2^n$

但是这道题其实可以很简单完成，由于上面提到的内容（不断消去末尾的 $0$ 和 $1$），实际上每个值不会像冰雹定理一样执行很多次，而是仅仅 $2 \times bits$ 次就可以到 $1$

所以直接枚举所有值到 $1$ 的过程中会产生的数字，并记录步数，找到那些出现次数等于序列长度，且总步数最小的那个就行了

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
 
        unordered_map<int, pair<int, int>> ans;
        for (int i = 0; i < n; ++i) {
            int cnt = 0;
            ans[data[i]].first++;
            if (data[i] == 1) {
                ans[2].first++;
                ans[2].second++;
                continue;
            }
 
            while (data[i] > 1) {
                ++cnt;
                if (data[i] & 1) ++data[i];
                else data[i] >>= 1;
                ans[data[i]].second += cnt;
                ans[data[i]].first++;
            }
        }
        int res = INT_MAX;
 
        for (auto &item: ans) {
            if (item.second.first != n) continue;
            res = min(res, item.second.second);
        }
        cout << res << endl;
    }
}
```

# D. Maximum Prefix Sums

## 大致题意

有一个原始数组 $a$，其中一部分丢失了，需要你还原或者说找到一种可能的 $a$ 的解

对于这个数组 $a$，定义前缀和数组 $b$，满足 $b\_i = \sum\_{n=1}^{i} a\_i$

对于这个数组，再定义前缀和最大值数组 $c$，满足 $c\_i = \max\_{n=1}^{i} b\_i$

现在给你完整的 $c$ 数组和部分 $a$ 数组，询问一种可能的 $a$ 的解

## 思路

首先根据 $c_i$ 去反推每一个 $b_i$ 的范围，即

- 如果 $c\_i \neq c\_{i-1}$ 那么必然 $b_i = c_i$
- 如果 $c\_i = c\_{i-1}$ 那么必然 $b_i \in \left \[ -\infty , c_i \right \]$

然后，如果此时 $a_i$ 已知的话，那么还可以得到

$b\_i \in \left \[ min(b\_{i-1}) + a\_i , max(b\_{i-1}) + a\_i \right \]$

完成一次正向推演后，还需要进行一次逆向推演，如果此时 $a_i$ 已知的话，可以得到：

$b\_{i-1} \in \left \[ min(b\_{i}) - a\_i , max(b\_{i}) - a\_i \right \]$

这三个条件需要同时满足，可以得到一个具体的 $b_i$ 的范围了。接下来就是尝试构造即可，只要在范围内理论上都可以构造出来，最后检查一遍是否满足预期即可

## AC Code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        string s;
        s.resize(n);
        vector<int> a(n), c(n);
        cin >> s;
        for (int i = 0; i < n; ++i) cin >> a[i];
        for (int i = 0; i < n; ++i) cin >> c[i];

        if (s[0] == '1' && a[0] != c[0]) {
            cout << "No" << endl;
            continue;
        }
 
        a[0] = c[0];
 
        vector<pair<int, int>> pb(n);
        // init pb
        int last = INT_MIN;
        for (int i = 0; i < n; ++i) {
            if (last != c[i]) pb[i] = {c[i], c[i]};
            else pb[i] = {INT_MIN, c[i]};
            last = c[i];
 
            if (s[i] == '1' && i != 0) {
                auto [fst, snd] = make_pair(pb[i - 1].first + a[i], pb[i - 1].second + a[i]);
                pb[i] = {max(pb[i].first, fst), min(pb[i].second, snd)};
            }
        }
        // rof
        for (int i = n - 1; i >= 1; --i) {
            if (s[i] == '0') continue;
            auto [fst, snd] = make_pair(pb[i].first - a[i], pb[i].second - a[i]);
            pb[i - 1] = {max(pb[i - 1].first, fst), min(pb[i - 1].second, snd)};
        }
 
        for (int i = 1; i < n; ++i) if (s[i] == '0') a[i] = pb[i].second - pb[i - 1].second;
 
        // check
        int fb = 0, fc = INT_MIN;
        bool flag = true;
        for (int i = 0; i < n; ++i) {
            fb += a[i];
            fc = max(fc, fb);
            if (fc != c[i]) flag = false;
        }
 
        cout << (flag ? "Yes" : "No") << endl;
        if (flag) for (int i = 0; i < n; ++i) cout << a[i] << " \n"[i == n - 1];
    }
}
```
