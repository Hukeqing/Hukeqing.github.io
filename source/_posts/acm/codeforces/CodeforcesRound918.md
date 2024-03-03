---
title: Codeforces Round 918 (Div. 4)
date: 2024-03-03 09:50:11
updated: 2024-03-03 09:50:11
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 918 (Div. 4) 个人写题记录
---

# A. Odd One Out

## 大致题意

找出三个值中不同的那个

## 思路

把三个值异或一下就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b, c;
        cin >> a >> b >> c;
        cout << (a ^ b ^ c) << endl;
    }
}
```

# B. Not Quite Latin Square

## 大致题意

有一个矩阵，每一行每一列由 ABC 组成，问缺少的那个是什么

## 思路

直接统计所有 ABC 数量，少的那个就是

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        string str;
        int cnt[3] = {};
        for (int i = 0; i < 3; ++i) {
            cin >> str;
            for (const auto& c: str)
                if (c != '?') ++cnt[c - 'A'];
        }
        cout << (cnt[0] == 2 ? 'A' : (cnt[1] == 2 ? 'B' : 'C')) << endl;
    }
}
```

# C. Can I Square?

## 大致题意

给一个数组，问所有值加起来是否是一个平方数

## 思路

二分一下就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        int sum = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            sum += tmp;
        }
        int l = 1, r = 1e9 + 10;
        while (l + 1 < r) {
            if (const int mid = (l + r) >> 1; mid * mid <= sum) l = mid;
            else r = mid;
        }
        cout << (l * l == sum ? "YES" : "NO") << endl;
    }
}
```

# D. Unnatural Language Processing

## 大致题意

已知一段话仅有 `abcde` 组成，且组成的每个单词都是“辅音+元音”或者“辅音+元音+辅音”的格式，要求分割一下字符串

## 思路

把所有元音前面那个作为开头就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        cin >> str;
        cout << str[0];
        for (int i = 1; i < n; ++i) {
            if (i + 1 < n && (str[i + 1] == 'a' || str[i + 1] == 'e')) cout << '.';
            cout << str[i];
        }
        cout << endl;
    }
}
```

# E. Romantic Glasses

## 大致题意

有一个原始数组，选取它的一段区间，这段区间内的偶数位和奇数位各自相加恰好相等，问是否存在

## 思路

把原始数组的奇数位置和偶数位置各自累加，做前缀和，然后再求差值，找是否存在差值相同的情况

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int pre[2] = {};
        map<int, int> mp;
        ++mp[0];
        for (int i = 0; i < n; ++i) {
            pre[i % 2] += data[i];
            ++mp[pre[1] - pre[0]];
        }
        bool flag = false;
        for (auto [fst, snd]: mp) if (snd >= 2) flag = true;
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# F. Greetings

## 大致题意

每个人都从 $a\_i$ 走到 $b\_i$ 问是否会发生几次相撞

## 思路

对着 $a$ 排序后，对 $b$ 求逆序对即可

## AC code

```cpp
#define ll long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<pair<int, int>> data(n);
        vector<int> b(n);
        for (auto& [fst, snd]: data) cin >> fst >> snd;
        for (int i = 0; i < n; ++i) b[i] = data[i].second;
        sort(data.begin(), data.end());

        function<ll(vector<int>&, vector<int>&, int, int)> mergeSort = [&](vector<int>& record, vector<int>& tmp, const int l, const int r) {
            if (l >= r) return 0ll;
            const int mid = (l + r) / 2;
            ll inv_count = mergeSort(record, tmp, l, mid) + mergeSort(record, tmp, mid + 1, r);
            int i = l, j = mid + 1, poss = l;
            while (i <= mid && j <= r) {
                if (record[i] <= record[j]) {
                    tmp[poss] = record[i];
                    ++i;
                    inv_count += j - (mid + 1);
                } else {
                    tmp[poss] = record[j];
                    ++j;
                }
                ++poss;
            }
            for (int ind = i; ind <= mid; ++ind) {
                tmp[poss++] = record[ind];
                inv_count += j - (mid + 1);
            }
            for (int ind = j; ind <= r; ++ind) {
                tmp[poss++] = record[ind];
            }
            copy(tmp.begin() + l, tmp.begin() + r + 1, record.begin() + l);
            return inv_count;
        };

        vector<int> record(n), tmp(n);
        for (int i = 0; i < n; ++i) record[i] = data[i].second;
        cout << mergeSort(record, tmp, 0, n - 1) << endl;
    }
}
```

# G. Bicycles

## 大致题意

每个城市都有不同速度的车，从 1 号城市出发，问走到 n 号城市需要多久

## 思路

计算到达每一个城市，且用 $i$ 辆车的情况下，最小费用是多少，然后在图上不断 bfs 即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    // bool flag = false;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<int> head(n + 1, -1), s(n + 1);
        vector<tuple<int, int, int>> edges(m * 2);
        for (int i = 0; i < m; ++i) {
            int u, v, w;
            cin >> u >> v >> w;
            edges[i << 1] = {u, w, head[v]};
            edges[i << 1 | 1] = {v, w, head[u]};
            head[v] = i << 1;
            head[u] = i << 1 | 1;
        }
        for (int i = 1; i <= n; ++i) cin >> s[i];

        vector<vector<int>> last(n + 1);
        for (auto &i: last) i.resize(n + 1, LONG_LONG_MAX);
        last[1][1] = 0;
        queue<int> q;
        q.push(1);
        while (!q.empty()) {
            auto c = q.front();
            q.pop();
            int e = head[c];
            while (~e) {
                const auto& [to, w, next] = edges[e];
                e = next;
                bool flag = false;
                for (int i = 1; i <= n; ++i) {
                    if (last[c][i] == LONG_LONG_MAX) continue;
                    if (const int nc = last[c][i] + w * s[i]; last[to][i] > nc) {
                        flag = true;
                        last[to][i] = nc;
                        last[to][to] = min(last[to][to], last[to][i]);
                    }
                }
                if (flag) q.push(to);
            }
        }
        int ans = LONG_LONG_MAX;
        for (int i = 1; i <= n; ++i) ans = min(ans, last[n][i]);
        cout << ans << endl;
    }
}
```
