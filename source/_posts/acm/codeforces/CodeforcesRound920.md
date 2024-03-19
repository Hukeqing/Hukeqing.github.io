---
title: Codeforces Round 920 (Div. 3)
date: 2024-03-19 09:19:27
updated: 2024-03-19 09:19:27
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 920 (Div. 3) 个人写题记录
---

# A. Square

## 大致题意

告诉你一个正方形的四个顶点的坐标，问正方形的面积

## 思路

记录最大和最小的 x 和 y，很好计算

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int mi = 1000, ma = -1000;
        for (int i = 0; i < 4; ++i) {
            int u, v;
            cin >> u >> v;
            mi = min(mi, v);
            ma = max(ma, v);
        }
        cout << (ma - mi) * (ma - mi) << endl;
    }
}
```

# B. Arranging Cats

## 大致题意

有两个 `01` 字符串，允许对第一个字符串进行如下操作

- 将一个 1 变成 0
- 将一个 0 变成 1
- 将一个 1 和另外一个 0 交换一下位置

问最多操作几次能让两个字符串相同

## 思路

多用第三个方法即可，统计 1 的数量即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str1, str2;
        str1.resize(n);
        str2.resize(n);
        cin >> str1 >> str2;
        int cnt[2][2] = {};
        for (int i = 0; i < n; ++i) {
            if (str1[i] == str2[i]) continue;
            ++cnt[0][str1[i] - '0'];
            ++cnt[1][str2[i] - '0'];
        }
        cout << max(cnt[0][1], cnt[1][1]) << endl;
    }
}
```

# C. Sending Messages

## 大致题意

有一个手机，待机每小时要消耗 $a$ 电量，而每次开机关机则需要消耗 $b$ 电量，最开始有 $f$ 电量

问在固定的 $n$ 个发送信息任务是否能够完成

## 思路

计算两次相邻的信息之间，选择待机还是选择关机即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, f, a, b;
        cin >> n >> f >> a >> b;
        int last = 0;
        for (int i = 0; i < n; ++i) {
            int cur;
            cin >> cur;
            f -= min(b, a * (cur - last));
            last = cur;
        }
        cout << (f > 0 ? "YES" : "NO") << endl;
    }
}
```

# D. Very Different Array

## 大致题意

有两个数组 $a, b$，允许从 $b$ 选择 $x$ 个值，组成和 $a$ 长度相同的字符串，使得和 $a$ 尽可能不一样

## 思路

排序后，大的和小的匹配，小的和大的匹配，注意要同时开始匹配，选择两侧差值较大者

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<int> a(n), b(m);
        for (auto& i: a) cin >> i;
        for (auto& i: b) cin >> i;
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());
        int l = 0, r = 0, ans = 0;
        while (l + r < n) {
            if (abs(a[l] - b[m - l - 1]) > abs(a[n - r - 1] - b[r])) {
                ans += abs(a[l] - b[m - l - 1]);
                ++l;
            } else {
                ans += abs(a[n - r - 1] - b[r]);
                ++r;
            }
        }
        cout << ans << endl;
    }
}
```

# E. Eat the Chip

## 大致题意

有两个棋子在棋盘上，只允许向前、向左前、向右前移动，问是否可能发送吃的可能

## 思路

每个棋子的可能到达的格子可以绘制出来，只需奥看最终的相遇那一行是否是有覆盖关系即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m, ax, ay, bx, by;
        cin >> n >> m >> ax >> ay >> bx >> by;
        if (bx <= ax) {
            cout << "Draw" << endl;
            continue;
        }
        int al = ay, ar = ay, bl = by, br = by;
        const bool flag = (bx - ax) % 2;
        while (ax < bx) {
            al = max(1, al - 1);
            ar = min(m, ar + 1);
            ++ax;
            if (ax == bx) break;
            bl = max(1, bl - 1);
            br = min(m, br + 1);
            --bx;
        }
        if (flag) cout << (al <= bl && ar >= br ? "Alice" : "Draw") << endl;
        else cout << (bl <= al && br >= ar ? "Bob" : "Draw") << endl;
    }
}
```

# F. Sum of Progression

## 大致题意

有一个数组，给出 $s, d, k$，计算 $\sum_{i=0}^{k} (i + 1) \times a\_{s+i \times d}$

## 思路

分两种情况做，如果 $k$ 比较大，那么可以暴力，如果比较小，那么就通过前缀和进行优化计算

而前缀和则需要考虑间隔 $[1, sqrt(n)]$ 的每一种情况 $x$

每一种情况下需要计算 $s\_i = s\_{i-x} + a\_i$ 和 $s\_i = s\_{i-x} + t \times a\_i$

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, q;
        cin >> n >> q;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        const int cap = min(static_cast<int>(sqrt(n)) + 1, n);
        vector<vector<int>> a(cap), b(cap);
        for (int i = 0; i < cap; ++i) {
            a[i].resize(n, 0);
            b[i].resize(n, 0);
            for (int j = 0; j <= i; ++j) a[i][j] = b[i][j] = data[j];
            for (int j = i + 1; j < n; ++j) {
                a[i][j] = a[i][j - i - 1] + (j + i + 1) / (i + 1) * data[j];
                b[i][j] = b[i][j - i - 1] + data[j];
            }
        }
        for (int i = 0; i < q; ++i) {
            int s, d, k;
            cin >> s >> d >> k;
            if (d <= cap) {
                const int start = s - d, end = s + d * (k - 1), cp = (s - 1) / d;
                const int as = a[d - 1][end - 1] - (start <= 0 ? 0 : a[d - 1][start - 1]), bs = cp * (b[d - 1][end - 1] - (start <= 0 ? 0 : b[d - 1][start - 1]));
                cout << as - bs << ' ';
            } else {
                int ans = 0;
                for (int j = 0; j < k; ++j)
                    ans += (j + 1) * data[s + j * d - 1];
                cout << ans << ' ';
            }
        }
        cout << endl;
    }
}
```

# G. Mischievous Shooter

## 大致题意

可以在一个图上绘制固定形状的一个三角形，问最多能覆盖多少个目标点

## 思路

也是前缀和，用斜向的前缀和即可

至于四种方向，可以考虑翻转图，而不是翻转形状

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<string> map(n);
        for (auto& s: map) {
            s.resize(m);
            cin >> s;
        }
 
        vector<vector<int>> h(n), v(n), r(n);
        for (auto& i: h) i.resize(m, 0);
        for (auto& i: v) i.resize(m, 0);
        for (auto& i: r) i.resize(m, 0);
        auto cal = [&](vector<vector<bool>> &mp) {
            for (int i = 0; i < n; ++i) {
                h[i][0] = v[i][0] = r[i][0] = mp[i][0];
                h[i][m - 1] = v[i][m - 1] = r[i][m - 1] = mp[i][m - 1];
            }
            for (int j = 0; j < m; ++j) {
                h[0][j] = v[0][j] = r[0][j] = mp[0][j];
                h[n - 1][j] = v[n - 1][j] = r[n - 1][j] = mp[n - 1][j];
            }
 
            for (int i = 0; i < n; ++i) for (int j = 1; j < m; ++j) h[i][j] = h[i][j - 1] + mp[i][j];
            for (int j = 0; j < m; ++j) for (int i = 1; i < n; ++i) v[i][j] = v[i - 1][j] + mp[i][j];
            for (int i = 1; i < n; ++i) for (int j = m - 2; j >= 0; --j) r[i][j] = r[i - 1][j + 1] + mp[i][j];
 
            vector<vector<int>> ans(n);
            for (auto& i: ans) i.resize(m, 0);
            int res = 0;
 
            // tl
            ans[0][0] = 0;
            for (int i = 0; i <= min(k, n - 1); ++i) for (int j = 0; j <= min(k - i, m - 1); ++j) ans[0][0] += mp[i][j];
            for (int i = 0; i < n; ++i) {
                if (i != 0) {
                    ans[i][0] = ans[i - 1][0];
                    ans[i][0] -= h[i - 1][min(k, m - 1)];
                    const int out = max(i + k - n + 1, 0);
                    if (out >= m) continue;
                    ans[i][0] += r[i + k - out][out] - (k + 1 >= m ? 0 : r[i - 1][k + 1]);
                }
                for (int j = 1; j < m; ++j) {
                    ans[i][j] = ans[i][j - 1];
                    ans[i][j] -= v[min(i + k, n - 1)][j - 1] - (i == 0 ? 0 : v[i - 1][j - 1]);
                    if (j + k >= m + n - 1 - i) continue;
                    const int out = max(i + k - n + 1, 0);
                    ans[i][j] += r[i + k - out][j + out] - (i == 0 || j + k + 1 >= m ? 0 : r[i - 1][j + k + 1]);
                }
            }
            for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) res = max(res, ans[i][j]);
#ifdef ACM_LOCAL
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < m; ++j) {
                    int tmp = 0;
                    for (int a = 0; i + a < n && a <= k; ++a) for (int b = 0; b + a <= k && j + b < m; ++b) tmp += mp[i + a][j + b];
                    if (tmp != ans[i][j]) cerr << "tl: " << i << ' ' << j << ' ' << tmp << '-' << ans[i][j] << endl;
                }
            }
#endif
            return res;
        };
 
        vector<vector<bool>> mp;
        mp.resize(n);
        for (auto &i: mp) i.resize(m);
        int ans = 0;
 
        // 1
        for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) mp[i][j] = map[i][j] == '#';
        ans = max(cal(mp), ans);
 
        // 2
        for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) mp[i][j] = map[i][m - j - 1] == '#';
        ans = max(cal(mp), ans);
 
        // 3
        for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) mp[i][j] = map[n - i - 1][j] == '#';
        ans = max(cal(mp), ans);
 
        // 4
        for (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) mp[i][j] = map[n - i - 1][m - j - 1] == '#';
        ans = max(cal(mp), ans);
 
        cout << ans << endl;
    }
}
```
