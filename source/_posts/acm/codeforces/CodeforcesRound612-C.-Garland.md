---
title: Codeforces Round 612 (Div. 2) C. Garland——DP
date: 2020-01-06 14:01:40
updated: 2020-01-06 14:01:40
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

[题目链接](http://codeforces.com/contest/1287/problem/C)
贪心模拟了半天，最后放弃了

# 题意
给你一串从$1-n$的序列，其中部分未知（表示为0），补全序列使得相邻数值奇偶性相反的数量最少
相邻数值的奇偶性相反：两个相邻的两个数值，其中一个为奇数另外一个为偶数

# 分析
一开始用了贪心，结果卡在第十二个样例，然后改成dp
定义dp数组如下

```cpp
int dp[120][60][2];
// dp[i][j][0/1] 表示第i+1个位置放了偶/奇数，且到第i+1处总共放了j个奇数，有多少个奇偶性相反
```

得到状态转移方程

```cpp
dp[i][j][1] = min(dp[i - 1][j - 1][0] + 1, dp[i - 1][j - 1][1]);
dp[i][j][0] = min(dp[i - 1][j][1] + 1, dp[i - 1][j][0]);
```
当然这得看这个位置本身是不是已经有了数值，如果为0则两个都需要，如果已经有数值了就按照原来的数值进行dp

# AC代码
```cpp
#include <bits/stdc++.h>

using namespace std;

void solve() {
    int n;
    int dp[120][60][2], value[120];
    cin >> n;
    for (int i = 0; i < n; ++i) {
        cin >> value[i];
    }
    memset(dp, 0x3f, sizeof(dp));
    if (value[0] == 0)
        dp[0][1][1] = dp[0][0][0] = 0;
    else
        dp[0][value[0] & 1][value[0] & 1] = 0;
    for (int i = 1; i < n; ++i) {
        for (int j = 0; j <= min(i + 1, (n + 1) / 2); ++j) {
            if ((value[i] & 1 || value[i] == 0) && j > 0)
                dp[i][j][1] = min(dp[i - 1][j - 1][0] + 1, dp[i - 1][j - 1][1]);
            if (!(value[i] & 1))
                dp[i][j][0] = min(dp[i - 1][j][1] + 1, dp[i - 1][j][0]);
        }
    }
    cout << min(dp[n - 1][(n + 1) / 2][1], dp[n - 1][(n + 1) / 2][0]) << endl;
}

int main() {
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
