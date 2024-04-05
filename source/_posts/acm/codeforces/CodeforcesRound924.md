---
title: Codeforces Round 924 (Div. 2)
date: 2024-04-05 21:01:16
updated: 2024-04-05 21:01:16
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 924 (Div. 2) 个人写题记录
---

# A. Rectangle Cutting

## 大致题意

有一个矩型，将其切割成两半，然后再拼接起来，问是否可能得到另外一个矩型

## 思路

简单题，直接尝试一下就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b;
        cin >> a >> b;
        bool flag = false;
        if (a % 2 == 0) {
            int ra = a / 2, rb = b * 2;
            if (ra != b || rb != a) flag = true;
        }
        if (b % 2 == 0) {
            int ra = a * 2, rb = b / 2;
            if (ra != b || rb != a) flag = true;
        }
        cout << (flag ? "YES" : "No") << endl;
    }
}
```

# B. Equalize

## 大致题意

已知一个数组，现在将一个等长的排列加到这个数组上，问最多出现多少个相同的值

## 思路

等价于在长度为 $n$ 的值范围内，原始数组有多少个不同的值

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        sort(data.begin(), data.end());
        int end = (int)(unique(data.begin(), data.end()) - data.begin());
        int l = 0, ans = 0;
        for (int r = 0; r < end; ++r) {
            while (data[r] - data[l] >= n) ++l;
            ans = max(ans, r - l + 1);
        }
        cout << ans << endl;
    }
}
```

# C. Physical Education Lesson

## 大致题意

有一个数组，其值类似一个波长为 $x$ 的波，从 $1 \rightarrow k \rightarrow 1$，现在只知道第 $n$ 的位置是 $x$，问有多种不同的波的可能

## 思路

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int x, n, v[2];
        cin >> x >> n;
        // upside
        v[0] = x - n;
        // downside
        v[1] = x + n - 2;
        set<int> st;

        auto add = [&](int x) {
            if (x % 2 || x < n * 2 - 2) return;
            st.insert(x);
        };
        auto cal = [&](int x) {
            int r = min((int)sqrt(x) + 10, x);
            for (int i = 1; i < r; ++i) if (x % i == 0) {
                add(i);
                add(x / i);
            }
        };

        cal(v[0]);
        cal(v[1]);

        cout << st.size() << endl;
    }
}
```

# D. Lonely Mountain Dungeons

## 大致题意

有 $n$ 个不同的种族，每个种族有不同数量的士兵，现在需要将它们组成 $k$ 只军队，每个士兵必定属于某一个军队

每多创建一个军队，其就要减少 $x$ 的战斗力，而当同一个种族的两个士兵被分配到不同的队伍的情况下，则会增加 $b$ 单位的战斗力

问最大的战斗力可能是多少

## 思路

三分一下队伍数量即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, b, x;
        cin >> n >> b >> x;
        vector<int> c(n);
        for (auto &i: c) cin >> i;
        int l = 1, r = 2e5 + 10;

        auto check = [&](int mid) {
            int res = -x * (mid - 1);
            for (const auto &i: c) {
                int v = i / mid, c1 = i % mid, c2 = mid - c1;
                res += b * c1 * (v + 1) * (i - v - 1) / 2;
                res += b * c2 * v * (i - v) / 2;
            }
            return res;
        };

        while (l + 10 < r) {
            int ml = (2 * l + r) / 3, mr = (l + 2 * r) / 3;
            int rl = check(ml), rr = check(mr);
            if (rl < rr) l = ml;
            else r = mr;
        }

        int ans = 0;
        for (int i = l; i <= r; ++i)
            ans = max(ans, check(i));
        cout << ans << endl;
    }
}
```

# E. Modular Sequence

## 大致题意

有一个数组，第一个值已经确定，其后的每一个值的，等于前一个值 $+ y$ 或者等于 $mod \space y$，且已知长度和总和，问是否存在这样的数组

## 思路

容易得到，最终因为变化都和 $y$ 有关，所以 $x \space y$ 这部分的值，必然会被每一个单位所保留，即每一个值必定等价于 $t \times y + x \space mod \space y$

所以可以先 $s \leftarrow $，那么所有值就等于 $t \times y$

再统一除以 $y$ 可以得到 $s \leftarrow \frac{s - n \times (x \space mod \space y)}{y}$ 而数组则是几个递增的阶梯（$0, 1, 2, \dots$）组成

所以只需要求解阶梯的数量和每个阶梯的长度即可

容易得到一个简单的结论：最长的阶梯不超过 $650$，因为 $(1 + 650) \times 650 / 2 = 211575$，所以可以通过暴力的手段解决

定义 `dp[i]` 表示当前 $s$ 还剩下 $i$ 个值需要处理的时候，已经消耗了多少个位置，对于每一个 $i$，暴力遍历 $650$ 种可能性即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, x, y, s;
        cin >> n >> x >> y >> s;

        if ((s - n * (x % y)) % y || (x % y) * n > s || x > s) {
            cout << "NO" << endl;
            continue;
        }
        int rs = (s - n * (x % y)) / y;
        int st = x / y - 1;
        if (x / y > rs) {
            cout << "NO" << endl;
            continue;
        }

        vector<pair<int, int>> dp(rs + 1, {0x3fffffff, -1});
        dp[rs] = {0, -1};
        for (int i = st + 1, tmp = 0; i <= s; ++i) {
            tmp += i;
            if (tmp == 0) continue;
            if (rs - tmp < 0) break;
            dp[rs - tmp] = {i, rs};
        }
        for (int i = rs - 1; i >= 1; --i)
            for (int j = 1; j < 623; ++j) {
                if (i - (1 + j) * j / 2 < 0) break;
                if (dp[i - (1 + j) * j / 2].first <= dp[i].first + j + 1) continue;
                dp[i - (1 + j) * j / 2] = {dp[i].first + j + 1, i};
            }
        if (st + n < dp[0].first) {
            cout << "NO" << endl;
            continue;
        }
        cout << "YES" << endl;
        int cur = 0;
        vector<int> res;
        while (~cur) {
            if (dp[cur].second != -1) res.push_back(dp[cur].second - cur);
            cur = dp[cur].second;
            if (res.size() > 100) {
                cerr << 1;
            }
        }
        reverse(res.begin(), res.end());
        int index = 0;
        for (int i = 0; i < res.size(); ++i) {
            int cost = 0, j = i == 0 ? st + 1 : 0;
            while (cost <= res[i]) {
                cout << j * y + x % y << ' ';
                ++index;
                ++j;
                cost += j;
            }
        }
        while (index < n) {
            cout << x % y << ' ';
            ++index;
        }
        cout << endl;
    }
}
```
