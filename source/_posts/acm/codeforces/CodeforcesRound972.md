---
title: Codeforces Round 972 (Div. 2)
date: 2024-09-16 19:14:15
updated: 2024-09-16 19:14:15
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 972 (Div. 2) 个人写题记录
#index_img:
---

# A. Simple Palindrome

## 大致题意

只允许使用 `aeiou` 构建一个字符串，使得其中的回文子序列尽可能少

## 思路

注意是回文子序列，所以比如 `aeioua` 这种，看起来一个回文串都没有，实际上 `aea`, `aia`, `aoa` 等等都是可以构造出来的

显然，如果存在间隔的方式，那么带来的回文串一定会更多，毕竟 `aea` 里面还可以再提取出一个 `aa`。所以应该保证尽可能不要出现间隔字母即可，同时联系的字母也要少

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    int cnt[5] = {0, 0, 0, 0, 0};
    for (int i = 0; i < n; ++i) ++cnt[i % 5];
    for (int i = 0; i < 5; ++i) for (int j = 0; j < cnt[i]; ++j) cout << "aiueo"[i];
    cout << endl;
}
```

# B2. The Strict Teacher

## 大致题意

有一排方格，其中一部分格子上有老师，老师希望抓住某个学生，且老师和学生每次都会停留在当前的格子或者走到相邻的格子，给出老师的初始位置，询问如果学生的初始位置在某个值时，需要多久才能抓到

## 思路

只需要考虑在所有老师最左边或者在最右边，或者在某两个中间这三种情况即可，简单题

## AC code

```cpp
void solve() {
    int n, m, q;
    cin >> n >> m >> q;
    vector<int> data(m);
    for (auto &item: data) cin >> item;
    sort(data.begin(), data.end());
    while (q--) {
        int t;
        cin >> t;
        if (t < data[0]) cout << data[0] - 1 << endl;
        else if (t > data.back()) cout << n - data.back() << endl;
        else {
            auto iter = upper_bound(data.begin(), data.end(), t);
            int r = iter.operator*();
            --iter;
            int l = iter.operator*();
            cout << (r - l) / 2 << endl;
        }
    }
}
```

# C. Lazy Narek

## 大致题意

有 $n$ 个字符串，每个字符串长度为 $m$，允许选择其中几个（或者一个都不选），并按照原来的顺序拼接起来，
然后再从拼接后的字符串提取出一个子序列，使得这个子序列恰好是多个连续的 `narek` 这个字符串
将此子序列的长度减去提取走子序列后的 `narek` 字母数量，得到分数，问分数最大是多少

## 思路

对于每一个字符串，当需要使用这个字符串的时候，当前状态只有 5 种可能的开始，即当前需要匹配 `n`/`a`/`r`/`e`/`k` 的时候，同时也只有 5 种结束状态

所以只需要枚举每一个字符串在不同的字母结束的时候的最优分数，然后做一下动态规划即可

## AC code

```cpp
void solve() {
    signed _;
    cin >> _;
    for (signed tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        string str = "narek";
        vector<string> data(n);
        for (auto &item: data) item.reserve(m);
        for (auto &item: data) cin >> item;
        vector<vector<int>> dp(n);
        for (int i = 0; i < n; ++i) {
            dp[i].resize(5, -1000000);
            for (int k = 0; k < 5; ++k) {
                int cur = k, soc = 0;
                for (auto &c: data[i]) {
                    if (c == str[cur]) {
                        ++cur;
                        if (cur == 5) {
                            soc += 5;
                            cur = 0;
                        }
                    } else if (c == 'n' || c == 'a' || c == 'r' || c == 'e' || c == 'k') --soc;
                }
                if (k == 0) dp[i][cur] = max(dp[i][cur], soc);
                if (i > 0) {
                    dp[i][k] = max(dp[i - 1][k], dp[i][k]);
                    dp[i][cur] = max(dp[i - 1][k] + soc, dp[i][cur]);
                }
            }
        }
        int ans = 0;
        for (int j = 0; j < n; ++j) for (int i = 0; i < 5; ++i) ans = max(ans, dp[j][i] - i);
        cout << ans << endl;
    }
}
```
