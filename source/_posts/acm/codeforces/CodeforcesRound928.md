---
title: Codeforces Round 928 (Div. 4)
date: 2024-04-20 13:00:44
updated: 2024-04-20 13:00:44
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 928 (Div. 4) 个人写题记录
#index_img:
---

# A. Vlad and the Best of Five

## 大致题意

给出五个字母，其中只有 A/B，问那个字母出现次数多

## 思路

简单题，统计一下就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        string str;
        str.resize(5);
        cin >> str;
        int cnt[2] = {};
        for (auto &i: str) ++cnt[i - 'A'];
        cout << (cnt[0] > cnt[1] ? 'A' : 'B') << endl;
    }
}
```

# B. Vlad and Shapes

## 大致题意

检查一个图案是不是正方形还是三角形

## 思路

三角形不好检查，检查正方形就行，即四个角落都是染色的即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<string> data(n);
        for (auto &i: data) i.resize(n), cin >> i;
        int d[4] = {0, n, 0, n};
        for (int i = 0; i < n; ++i) for (int j = 0; j < n; ++j) {
            if (data[i][j] == '0') continue;
            d[0] = max(d[0], i);
            d[1] = min(d[1], i);
            d[2] = max(d[2], j);
            d[3] = min(d[3], j);
        }
        if (data[d[0]][d[2]] == '1' && data[d[1]][d[2]] == '1' && data[d[0]][d[3]] == '1' && data[d[1]][d[3]] == '1')
            cout << "SQUARE" << endl;
        else cout << "TRIANGLE" << endl;
    }
}
```

# C. Vlad and a Sum of Sum of Digits

## 大致题意

计算 $1, n$ 之间的所有值，将其的每一个 10 进制的值相加后再相加得到的结果

## 思路

暴力即可，注意打表

## AC code

```cpp
using namespace std;

void solve() {
    vector<int> data(2e5 + 10, 0);
    for (int i = 1; i < data.size(); ++i) {
        data[i] = data[i - 1];
        int t = i;
        while (t) {
            data[i] += t % 10;
            t /= 10;
        }
    }

    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        cout << data[n] << endl;
    }
}
```

# D. Vlad and Division

## 大致题意

给出 $n$ 个值，将其变成多个组，满足任意一个组内的任意两个值，满足他们两个值的任意比特位都不一样

## 思路

每个组里最多两个值，即必须是 $a\_i ^ a\_j = 0x7fffffff$

## AC code

```cpp
using namespace std;

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        map<int, int> st;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ++st[tmp];
        }

        int ans = 0;
        while (!st.empty()) {
            auto iter = st.begin();
            int a = iter->first;
            if (iter->second == 1) st.erase(iter);
            else --iter->second;

            int b = (~a) ^ (1 << 31);
            iter = st.find(b);
            if (iter != st.end()) --iter->second;
            if (iter != st.end() && iter->second == 0) st.erase(iter);
            ++ans;
        }

        cout << ans << endl;
    }
}
```

# E. Vlad and an Odd Ordering

## 大致题意

有 $1, 2, 3, \dots, n$ 个数，先从小到大取出所有的奇数排成一排，
然后再取出剩下值中的，满足是一个奇数乘上一个 $2$ 的值，从小到大排成一排
然后再取出剩下值中的，满足是一个奇数乘上一个 $3$ 的值，从小到大排成一排

依此类推，直到用完，问第 $k$ 个值是多少

## 思路

实际上没有 $3$ 的机会了，同样的也没有 $5$ 的机会了

其实就是二进制里，把最后一位是 $1$ 的取走，然后取倒数第二位是 $1$ 的，依此类推

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        int s = 1;
        while (true) {
            int t = (n + 1) / 2;
            if (k <= t) {
                break;
            }
            k -= t;
            n -= t;
            s <<= 1;
        }
        cout << (k * 2 - 1) * s << endl;
    }
}
```

# F. Vlad and Avoiding X

## 大致题意

一个 $7 \times 7 的矩阵，开始的时候一些方格已经被染成黑色，要让中间不出现 X 形状的图案，问至少需要染白多少个方格$

## 思路

暴力就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        vector<string> data(7);
        for (auto &i: data) i.resize(7);
        for (auto &i: data) cin >> i;
        constexpr int arr[3][2] = {0, 0, 1, -1, 1, 1};
        int ans = 49;
        function<void(int)> dfs = [&](int s) {
            if (s >= ans) return;
            for (int i = 1; i < 6; ++i) for (int j = 1; j < 6; ++j)
                if (data[i - 1][j - 1] == 'B' && data[i - 1][j + 1] == 'B' &&
                    data[i + 1][j - 1] == 'B' && data[i + 1][j + 1] == 'B' && data[i][j] == 'B') {
                    for (auto &ar: arr) {
                        data[i + ar[0]][j + ar[1]] = 'W';
                        dfs(s + 1);
                        data[i + ar[0]][j + ar[1]] = 'B';
                    }
                    return;
                }
            ans = min(ans, s);
        };

        dfs(0);
        cout << ans << endl;
    }
}
```

# G. Vlad and Trouble at MIT

## 大致题意

有一棵树，有些节点上的人要播放音乐，有一些节点上的人要睡觉，有一些则无所谓

现在需要创建一些墙使得放英语的人不会吵到睡觉的人，音乐会随着树的边传播，墙只能创建在边上，问最少需要多少个墙

## 思路

树上搜索即可，如果当前节点是要播放音乐的，那么和它的所有要播放音乐或者无所谓的节点都可以连在一块，反之也一样。
但是如果是无所谓的人，那么就要看它的直接孩子节点中要播放音乐的多还是要睡觉的多了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<vector<int>> g(n);
        string str;
        str.resize(n);
        for (int i = 1; i < n; ++i) {
            int tmp;
            cin >> tmp;
            g[tmp - 1].push_back(i);
        }
        cin >> str;

        int ans = n - 1;
        function<int(int)> dfs = [&](int c) {
            if (g[c].empty()) {
                return str[c] == 'P' ? 1 : (str[c] == 'C' ? 2 : 0);
            }
            int cnt[3] = {};
            for (const auto &n: g[c]) ++cnt[dfs(n)];
            if (str[c] == 'P') {
                ans -= cnt[1] + cnt[2];
                return 1;
            } else if (str[c] == 'S') {
                ans -= cnt[0] + cnt[2];
                return 0;
            } else {
                if (cnt[0] > cnt[1]) {
                    ans -= cnt[0] + cnt[2];
                    return 0;
                } else if (cnt[1] > cnt[0]) {
                    ans -= cnt[1] + cnt[2];
                    return 1;
                } else {
                    ans -= cnt[0] + cnt[2];
                    return 2;
                }
            }
        };
        dfs(0);
        cout << ans << endl;
    }
}
```
