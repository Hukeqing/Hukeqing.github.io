---
title: Codeforces Round 921 (Div. 2)
date: 2024-03-23 20:18:29
updated: 2024-03-23 20:18:29
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 921 (Div. 2) 个人写题记录
---

# A. We Got Everything Covered!

## 大致题意

有一个字符串长度为 $n$，其最多包含 $k$ 种不同的字母，你需要给出一个序列，使得这个字符串一定是你给出的序列的子序列

## 思路

就是要满足 $k$ 种字母，长度为 $n$ 下的所有可能的组合，即每一个位置都可能是 $k$ 个值

所以最简单的方式就是把 $k$ 个字母依次输出，重复 $n$ 次即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) cout << static_cast<char>('a' + j);
        cout << endl;
    }
}
```

# B. A Balanced Problemset?

## 大致题意

把一个数值 $x$，拆成 $n$ 份，问它们的 `gcd` 最大可以是多少

## 思路

因为 `gcd` 意味着所有值都有这个因子，那么它们加起来之后，也一定有这个因子。故这个值必定是最初的值的因子

所以找一个够分成 $n$ 份的即可，不需要均分

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        const int r = static_cast<int>(sqrt(n)) + 1;
        int ans = 1;
        for (int i = 1; i <= min(r, n); ++i) {
            if (n % i != 0) continue;
            if (i >= m) ans = max(ans, n / i);
            else if (n / i >= m) ans = max(ans, i);
        }
        cout << ans << endl;
    }
}
```

# C. Did We Get Everything Covered?

## 大致题意

和 A 题刚好相反，找一个不满足的字符串，使得不是给出的字符串的子序列即可

## 思路

考虑最差的情况，即每次都取从左到右最后出现的那个字母的值，即可尽可能的往后选取

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k, m;
        cin >> n >> k >> m;
        string str;
        str.resize(m);
        cin >> str;
        set<char> st;
        int tot = 0;
        vector<char> ans;
        for (const auto& c: str) {
            if (c < 'a' || c >= 'a' + k) continue;
            st.insert(c);
            if (st.size() == k) {
                st.clear();
                ++tot;
                ans.push_back(c);
            }
        }
        if (tot >= n) cout << "YES" << endl;
        else {
            cout << "NO" << endl;
            char c = 'a';
            for (char i = 0; i < k; ++i) if (!st.count(i + 'a')) c = i + 'a';
            for (int i = 0; i < n; ++i) if (i < ans.size()) cout << ans[i]; else cout << c;
            cout << endl;
        }
    }
}
```

# D. Good Trip

## 大致题意

有 $n$ 个人，其中有 $m$ 对朋友，每对朋友都有一个亲密度 $f\_i$。

每次随机选择两个人，如果它们是朋友，则得到对应亲密度的积分，然后使得他们的亲密度 +1

选择 $k$ 次后，期望积分是多少

## 思路

容易得到任何一种组合的选取的概率是 $\frac{2}{n \times (n-1)}$，故单次提供的共享应该是 $f\_i \times \frac{2}{n \times (n-1)}$

而每次结束之后，被选中的朋友的积分会加一，而对于期望而言，相当于每一对朋友的积分都增加 $\frac{2}{n \times (n-1)}$

依次可以得到，最终每一对的共享就是 $f\_i \times \frac{2}{n \times (n-1)} + (f\_i + \frac{2}{n \times (n-1)}) \times \frac{2}{n \times (n-1)} + \dots + (f\_i + (k - 1) \times \frac{2}{n \times (n-1)}) \times \frac{2}{n \times (n-1)}$

再化简一下，取一下逆元即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        constexpr int mod = 1e9 + 7;
        auto qp = [&](int a, int p) {
            int ans = 1;
            while (p) {
                if (p & 1) ans = ans * a % mod;
                a = a * a % mod;
                p >>= 1;
            }
            return ans;
        };
        int n, m, k;
        cin >> n >> m >> k;
        const int i = qp(n * (n - 1) / 2 % mod, mod - 2);
        vector<tuple<int, int, int>> data(m);
        for (auto& [l, r, v]: data) cin >> l >> r >> v;
        int ans = 0;
        for (const auto [_l, _r, v]: data) {
            const int l = v * k % mod;
            const int r = i * ((k - 1) * k / 2 % mod) % mod;
            const int t = (l + r) * i % mod;
            ans = (ans + t) % mod;
        }
        cout << ans << endl;
    }
}
```
