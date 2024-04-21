---
title: Codeforces Round 939 (Div. 2)
date: 2024-04-21 16:39:26
updated: 2024-04-21 16:39:26
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 939 (Div. 2) 个人写题记录
#index_img:
---

# A. Nene's Game

## 大致题意

有一排士兵，按照 $1,2,3,4 \dots n$ 的顺序喊，每次喊道 $a\_i$ 的位置就踢出队伍，问最后剩下几个人

## 思路

只需要关注第一个被踢出去的人就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int k, q, s;
        cin >> k >> q;
        cin >> s;
        for (int i = 1; i < k; ++i) {
            int tmp;
            cin >> tmp;
        }
        for (int i = 0; i < q; ++i) {
            int n;
            cin >> n;
            cout << min(n, s - 1) << " \n"[i == q - 1];
        }
    }
}
```

# B. Nene and the Card Game

## 大致题意

有一组牌，每种数字只出现在两张牌上

现在将这组牌打散后分给两个人，并进行游戏。游戏的每一轮，当前的出牌手需要出一张牌，如果这张牌上的数值的另外一张已经在场上了，那么就会获得 1 份

现在给你其中一个人的手牌，问最多可以得到多少分

## 思路

两边的牌是映射的，所以先手出一张，后手跟一张，这样是刚刚好的，所以先手只能赚到那些两张牌都在自己手里的分数

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        set<int> st;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            st.insert(tmp);
        }
        cout << n - st.size() << endl;
    }
}
```

# C. Nene's Magical Matrix

## 大致题意

有一个矩阵，现在允许每次往一行或者一列上覆盖写 $1, 2, 3 \dots n$ 的某一个排列，问最终的整个矩阵的求和是多少

## 思路

每个位置都能变成它的横坐标和纵坐标里的较大者，简单模拟即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        int ans = 0;
        for (int i = 0; i < n; ++i) for (int j = 0; j < n; ++j) ans += max(i, j) + 1;
        cout << ans << ' ' << 2 * n << endl;
        for (int i = n - 1; i >= 0; --i) {
            cout << 1 << ' ' << i + 1;
            for (int j = 0; j < n; ++j) cout << ' ' << j + 1;
            cout << endl;
            cout << 2 << ' ' << i + 1;
            for (int j = 0; j < n; ++j) cout << ' ' << j + 1;
            cout << endl;
        }
    }
}
```

# D. Nene and the Mex Operator

## 大致题意

有一个初始数组，允许你每次选择一个子串，将其的每一个值变成这个子串的 $MEX$，问可以让整个数组的所有位置之和最大是多少

## 思路

注意这个数组最大只能是 18 个数值，所以可以随意暴力

容易得到，最终一定可以把选择的区间都变成和当前区间长度相同的那个值，比如区间长度为 $3$，那么最终这个区间可以变成三个 $3$

首先通过 dp 计算出哪些区间要进行上面的操作，然后再递归构建即可

比如我通过一定手段能够构建 $0, 1, 2, 3, 4, x$，就能通过一次 $MEX$ 得到 $5, 5, 5, 5, 5, 5$，
这个时候如果我再去尝试构建 $0, 1, 2, 3, 4$ 就可以重复之前的构建过程了，重复构建前五个值，相当于递归两次即可

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> data(n), dp(n), dr(n);
    for (auto &i: data) cin >> i;
    dp[0] = data[0] >= 1 ? data[0] : 1;
    dr[0] = data[0] >= 1 ? -1 : 0;
    for (int i = 1; i < n; ++i) {
        dp[i] = dp[i - 1] + data[i];
        dr[i] = -1;
        for (int j = i; j >= 1; --j)
            if (dp[j - 1] + (i - j + 1) * (i - j + 1) > dp[i]) {
                dp[i] = dp[j - 1] + (i - j + 1) * (i - j + 1);
                dr[i] = j;
            }
        if ((i + 1) * (i + 1) > dp[i]) {
            dr[i] = 0;
            dp[i] = (i + 1) * (i + 1);
        }
    }
    vector<pair<int, int>> ans;
    ans.reserve(2e5);
 
    auto zero = [&](int l, int r) {
        bool flag = true;
        for (int i = l; i <= r; ++i) if (data[i] == 0) flag = false;
        if (flag) ans.emplace_back(l, r);
        else {
            ans.emplace_back(l, r);
            ans.emplace_back(l, r);
        }
        for (int i = l; i <= r; ++i) data[i] = 0;
    };
    function<void(int, int)> dfs = [&](int l, int r) {
        if (l == r) {
            if (data[l] == 0) return;
            ans.emplace_back(l, l);
            return;
        }
        dfs(l, r - 1);
        ans.emplace_back(l, r);
        ans.emplace_back(l, r - 1);
        data[r] = r - l;
        dfs(l, r - 1);
    };
 
    auto f = [&](int l, int r) {
        zero(l, r);
        dfs(l, r);
        ans.emplace_back(l, r);
    };
    vector<pair<int, int>> lr;
    for (int i = n - 1; i >= 0; --i) {
        if (dr[i] == -1) continue;
        f(dr[i], i);
        i = dr[i];
    }
 
    cout << dp[n - 1] << ' ' << ans.size() << endl;
    for (auto &[a, b]: ans) cout << a + 1 << ' ' << b + 1 << endl;
}
```
