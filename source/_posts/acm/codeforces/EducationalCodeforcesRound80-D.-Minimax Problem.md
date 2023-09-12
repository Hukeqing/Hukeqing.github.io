---
title: Educational Codeforces Round 80 D. Minimax Problem——二分+二进制处理
date: 2020-02-04 00:21:10
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

[题目链接](http://codeforces.com/contest/1288/problem/D)

# 题目大意

有n个维度为m的向量，取其中两个进行合并，合并时每个维度取两者之间的较大者，得到的新的向量中，维度值最小者最大为多少

# 分析
首先最需要注意的是m的取值，m最大只有8，那么我们可以二分答案，对于每一个二分值，进行下面的操作，将整个矩阵的每一个元素，如果这个元素大于二分值，则变成1，反正则变成0，把每一个向量压缩为单个二进制数，这样我们最多只会得到$2^8 = 256$种不同的二进制数，然后暴力的遍历所有可能的二进制数的组合，得到是否满足当前二分值

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

const int NUM = 3e5 + 100;

int data[NUM][10];

bool check(int value, int n, int m, pair<int, int> &ans) {
    map<unsigned, int> s;
    for (int i = 0; i < n; ++i) {
        unsigned temp = 0;
        for (int j = 0; j < m; ++j) {
            temp <<= 1u;
            temp |= data[i][j] > value;
        }
        s.insert({temp, i});
    }
    unsigned tar = -1u >> (sizeof(int) * 8 - m);
    for (auto iter1 = s.begin(); iter1 != s.end(); ++iter1) {
        for (auto iter2 = iter1; iter2 != s.end(); ++iter2) {
            if ((iter1->first | iter2->first) == tar) {
                ans.first = iter1->second;
                ans.second = iter2->second;
                return true;
            }
        }
    }
    return false;
}

void solve() {
    int n, m;
    cin >> n >> m;
    int l = INT_MAX, r = 0;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            cin >> data[i][j];
            l = min(l, data[i][j]);
            r = max(r, data[i][j]);
        }
    }
    int mid, cnt = r - l;
    pair<int, int> ans;
    while (cnt > 0) {
        int step = cnt / 2;
        mid = l + step;
        if (check(mid, n, m, ans)) {
            l = mid + 1;
            cnt -= step + 1;
        } else
            cnt /= 2;
    }
    cout << ans.first + 1 << " " << ans.second + 1 << endl;
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
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
