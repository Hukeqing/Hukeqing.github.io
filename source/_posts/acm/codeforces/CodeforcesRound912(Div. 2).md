---
title: Codeforces Round 912 (Div. 2)
date: 2024-02-11 01:46:31
updated: 2024-02-11 01:46:31
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 912 (Div. 2) 个人写题记录
---

# A. Halloumi Boxes

## 大致题意

有一个数组，每次允许选择其中一段长度不超过 $k$ 的字串进行翻转，问是否可能将其排序好

## 思路

最有用的翻转就是两个值，那就是冒泡了，所以要么本身有序，要么 $k \geq 2$ 就行了

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
        bool sorted = true;
        for (int i = 1; i < n; ++i) if (data[i] < data[i - 1]) sorted = false;
        cout << (sorted || k >= 2 ? "YES" : "NO") << endl;
    }
}
```

# B. StORage room

## 大致题意

有一个矩阵，其中的每一项 $M\_{i,j} = a\_i | a\_j$，问是否能得到原始数组的其中一种可能

## 思路

即然是 $M\_{i,j} = a\_i | a\_j$，那么反过来可以得到 $a\_i = M\_{i,0} & M\_{i,1} & M\_{i,2} \dots$

这不一定是原始解，但是一定是正确的解。还原后再验证一下矩阵对不对就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<vector<int>> data(n);
        for (auto& i: data) i.resize(n);
        for (auto& i: data) for (auto& j: i) cin >> j;
        vector ans(n, -1);
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < n; ++j)
                if (j != i) ans[i] &= data[i][j];
        bool check = true;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i == j) continue;
                if (data[i][j] != (ans[i] | ans[j])) check = false;
            }
        }
        if (!check) cout << "NO" << endl;
        else {
            cout << "YES" << endl;
            for (int i = 0; i < n; ++i) cout << (ans[i] == -1 ? 1 : ans[i]) << " \n"[i == n -1];
        }
    }
}
```

# C. Theofanis' Nightmare

## 大致题意

一个数组，其中有负值，将其拆成多个字串，然后按照原始顺序从左往右编号，从 1 开始编号

然后将每个字串内求和，乘上其的编号，最后再相加，问如何拆最大

## 思路

从最后一个值看，假如其为 $c$，那么如果其独立出去，和不独立出去，和前面的段合并，那么得到的差值就是 $c$，因为 $(n + 1) \times c - (n) \times c$

所以，如果 $c > 0$ 那么这样做是有意义的，反之则应该尽力避免拆

类推可以得到，如果当前值即之后的所有值加起来是 $< 0$，那么不要拆，反之则拆即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int sum = 0;
        for (auto& i: data) sum += i;
        int seg = 0, ans = 0;
        for (auto& i: data) {
            if (sum < 0) {
                if (seg == 0) seg = 1;
                ans += seg * i;
            }
            else {
                ++seg;
                ans += seg * i;
            }
            sum -= i;
        }
        cout << ans << endl;
    }
}
```

# D1. Maximum And Queries (easy version)

## 大致题意

有一个数组，允许每次给其中一个值 $+1$，最多执行 $k$ 次，问最终得到的数组的每一项进行位与运算，问最大值可以是多少

## 思路

要从位运算上下思路

如果一个值的某个位不是 `1`，那么如果通过 $+1$ 的方式把它变成 `1`，带来的后果就是更低位置的都会归零

所以我们需要从高位开始枚举位置，假设把这个位置大家都变成 `1`，那么就可以带来结果上的增长，但是会需要消耗一定的 $k$

注意一旦消耗过 $k$，那么再试图对这个值进行累加的时候，要把低位都认为是 `0` 了

## AC code

```cpp
#define int long long
 
void solve() {
    int n, q;
    cin >> n >> q;
    vector<int> data(n);
    for (auto& i: data) cin >> i;
    while (q--) {
        int k, ans = 0;
        cin >> k;
        vector flag(n, false);
        for (int i = 62; i >= 0; --i) {
            // try this bit
            int cost = 0;
            const int p = 1LL << i;
            vector tmp(n, false);
            for (int j = 0; j < n; ++j) {
                if (flag[j]) cost += p;
                else {
                    if (data[j] & p) continue;
                    cost += p - data[j] % p;
                    tmp[j] = true;
                }
 
                if (cost < 0) {
                    cost = k + 1;
                    break;
                }
            }
            if (k >= cost) {
                k -= cost;
                ans += p;
                for (int j = 0; j < n; ++j) flag[j] = tmp[j] | flag[j];
            }
        }
        cout << ans << endl;
    }
}
```

# E. Geo Game

## 大致题意

有两个人博弈，二维屏幕上有一些点，其中一个固定为起始点，两个人轮流指定下一个点，不可以是之前选中的点，直到所有点都被走到

然后求算路径的欧几里得距离的平方和，问能否保证是偶数或者是奇数

## 思路

仔细思考就会发现很像是一笔画问题

如果某个点与开始点的欧几里得距离是奇数，我将其归为一类 A，另外的点为另外一类 B。那么显然，同一个类内的点相互走并不会变化结果的奇偶性。
但是不同类的路径就会变化奇偶性。非常巧的是，因为每个点都会被进入一次和出去一次，
所以理论如果要回到开始点，那么最终一定是偶数，因为一旦进入 A 类，就一定要回去 B 类，即每个 A 类的点会产生两条路径，也就是最终没有变化奇偶性

那么我们可以得到，如果 A 类点作为最后一个点，那么路径就是奇数的，否则就是偶数，然后再根据博弈再去模拟即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, sx, sy;
        cin >> n >> sx >> sy;
        set<int> data[2];
        for (int i = 0; i < n; ++i) {
            int u, v;
            cin >> u >> v;
            const int cost = abs(u - sx) + abs(v - sy);
            data[cost % 2].insert(i + 1);
        }
 
        if (data[0].size() >= data[1].size()) {
            // chose first
            cout << "First" << endl;
            for (int i = 0; i < n; ++i) {
                if (data[1].empty()) {
                    auto iter = data[0].begin();
                    cout << *iter << endl;
                    data[0].erase(iter);
                } else {
                    auto iter = data[1].begin();
                    cout << *iter << endl;
                    data[1].erase(iter);
                }
 
                ++i;
                if (i < n) {
                    // read
                    int tmp;
                    cin >> tmp;
                    data[0].erase(tmp);
                    data[1].erase(tmp);
                }
            }
        } else {
            // chose second
            cout << "Second" << endl;
            for (int i = 0; i < n; ++i) {
                int tmp;
                cin >> tmp;
                data[0].erase(tmp);
                data[1].erase(tmp);
                ++i;
 
                if (i < n) {
                    if (data[0].empty()) {
                        auto iter = data[1].begin();
                        cout << *iter << endl;
                        data[1].erase(iter);
                    } else {
                        auto iter = data[0].begin();
                        cout << *iter << endl;
                        data[0].erase(iter);
                    }
                }
            }
        }
    }
}
```
