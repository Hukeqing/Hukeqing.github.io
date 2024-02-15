---
title: Codeforces Round 914 (Div. 2)
date: 2024-02-15 17:35:14
updated: 2024-02-15 17:35:14
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 914 (Div. 2) 个人写题记录
---

# A. Forked!

## 大致题意

棋盘上有一个皇后和一个国王，且骑士的移动方式是给出的 “日” 字形式，存在几个位置，使得骑士可以同时吃国王和皇后

## 思路

虽然不是 “日” 字，但是一个骑士最多也就只能走 8 个位置，所以暴力枚举就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b, xk, yk, xq, yq;
        cin >> a >> b >> xk >> yk >> xq >> yq;
        const int arr[4][2] = {1, 1, 1, -1, -1, 1, -1, -1};
        set<pair<int, int>> s;
        for (const auto ar: arr) {
            s.insert({xk + a * ar[0], yk + b * ar[1]});
            s.insert({xk + b * ar[0], yk + a * ar[1]});
        }
 
        int ans = 0;
        for (const auto ar: arr) {
            if (s.count({xq + a * ar[0], yq + b * ar[1]})) {
                s.erase({xq + a * ar[0], yq + b * ar[1]});
                ++ans;
            }
            if (s.count({xq + b * ar[0], yq + a * ar[1]})) {
                s.erase({xq + b * ar[0], yq + a * ar[1]});
                ++ans;
            }
        }
 
        cout << ans << endl;
    }
}
```

# B. Collecting Game

## 大致题意

有一个数组，选择其中的一个值作为初始值，然后每次进行如下操作：

1. 选择一个剩下的值，满足其小于当前的值
2. 删除它，并把其值加到当前值上

问每一位的值作为初始值的情况下，最多可以干掉多少值

## 思路

因为每一个值都可以干掉它以及比它小的值，所以只需要这些值加起来比恰好大于它的值还要大的话，那么就可以继续增大

而最终的结果一定是卡在某个值处，使得所有逼比它小的值加起来都没有它大，那么这个时候，比它小的那个值必然只能消除到这个位置

依次类推，只需要依次找到满足 $\sum\_{i=1}^x a\_i < a\_{x+1}$ 即可，那么必然可以类似前缀和一样处理就行

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<pair<int, int>> data(n);
        for (auto& [fst, snd]: data) cin >> fst;
        for (int i = 0; i < n; ++i) data[i].second = i;
        sort(data.begin(), data.end());
        vector<int> ans(n);
        int l = 0, sum = 0;
        while (l < n) {
            int r = l + 1;
            sum += data[l].first;
            while (r < n && sum >= data[r].first) {
                sum += data[r].first;
                ++r;
            }
            for (int i = l; i < r; ++i) ans[data[i].second] = r - 1;
 
            l = r;
        }
        for (int i = 0; i < n; ++i) cout << ans[i] << " \n"[i == n - 1];
    }
}
```

# C. Array Game

## 大致题意

有一个数组，允许你每次选择其中的两个值，把它们的差值加入到队列中，问经过 $k$ 次操作后，数组中最小的值最小可能是多少

## 思路

如果操作三次，那么可以连续两次拿同两个值，然后再让结果的那两值的差值加入数组，那么必然得到 $0$，即最小的值

所以问题只需要考虑一次操作和两次操作即可

一次操作很简单，$n^2$ 暴力扫就行了

二次操作也很简单，$n^2$ 暴力扫的同时，将结果和原始数组中看看，是否有足够相近的值

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        set<int> s;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            data[i] = tmp;
            s.insert(tmp);
        }
        if (k >= 3) {
            cout << 0 << endl;
            continue;
        }
        if (k == 0) {
            cout << *s.begin() << endl;
            continue;
        }
        int ans1 = *s.begin(), ans2 = *s.begin();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                int tmp = abs(data[i] - data[j]);
                auto riter = s.upper_bound(tmp);
                auto liter = riter;
                if (liter != s.begin()) --liter;
                if (riter == s.end()) --riter;
                ans1 = min(ans1, tmp);
                ans2 = min(min(ans2, tmp), min(abs(*riter - tmp), abs(*liter - tmp)));
            }
        }
        if (k == 1) cout << ans1 << endl;
        else cout << ans2 << endl;
    }
}
```

# D2. Set To Max (Hard Version)

## 大致题意

有一个数组，允许每次操作选择一个区间 $[l, r]$，使得 $a\_i \leftarrow max(a\_{l \dots r}), \all i \in [l, r]$

问只操作数组 $a$ 的情况下是否有可能做到

## 思路

首先，数组 $a$ 里面的每一个值，必然有其最大的作用范围，毕竟是取区间最大，可以通过两次单调栈的方式来找到每个值可以作用到的最大区间

然后只需要找到每一个值所来自哪个值的效果即可，可以用双指针在两个数组上移动即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> a(n), b(n), la(n, 0), ra(n, n);
        int r = n - 1;
        for (auto& i: a) cin >> i;
        for (auto& i: b) cin >> i;
        stack<int> st;
        for (int i = 0; i < n; ++i) {
            while (!st.empty() && a[st.top()] < a[i]) {
                ra[st.top()] = i;
                st.pop();
            }
            st.push(i);
        }
        while (!st.empty()) st.pop();
 
        for (int i = n - 1; i >= 0; --i) {
            while (!st.empty() && a[st.top()] < a[i]) {
                la[st.top()] = i + 1;
                st.pop();
            }
            st.push(i);
        }
        while (!st.empty()) st.pop();
 
        bool flag = true;
        for (int i = n - 1; i >= 0; --i) {
            while (r >= 0 && (a[r] != b[i] || la[r] > i || ra[r] <= i)) --r;
            if (a[r] != b[i] || la[r] > i || ra[r] <= i) {
                flag = false;
                break;
            }
        }
 
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```
