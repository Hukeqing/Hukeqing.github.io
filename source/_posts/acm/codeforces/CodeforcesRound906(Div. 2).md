---
title: Codeforces Round 906 (Div. 2)
date: 2023-12-03 15:50:28
updated: 2023-12-03 15:50:28
categories: ACM&算法
tag:
- ACM
- Codeforces
math: true
---

# A. Doremy's Paint 3

## 大致题意

有一个数组，重排之后，是否能够满足任意两个相邻值的只和都相同

## 思路

只有两种可能，只有两个值，且数量相同或者恰好差一个，或者只有一个值

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        map<int, int> mp;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mp[tmp]++;
        }

        if (mp.size() == 1) cout << "YES" << endl;
        else if (mp.size() > 2) cout << "NO" << endl;
        else {
            cout << (abs(mp.begin()->second - mp.rbegin()->second) <= 1 ? "YES" : "NO")<< endl;
        }
    }
}
```

# B. Qingshan Loves Strings

## 大致题意

有两个 $01$ 字符串，希望把 $A$ 字符串变成任意相邻两个字母不同的，每次操作允许将 $B$ 字符串插入到 $A$ 字符串的任意位置，问是否有可能

## 思路

- 首先，如果 $A$ 本来就是，那么就不用插入了
- 其次，若 $B$ 本身不是，那肯定不行，毕竟最后插入的字符串一定是完整的，那么最终必然会不是
- 然后，如果要插入，那必然是插入到两个相邻的字符内，那么必然 $B$ 的前后必须相同，且与要插入的部分不同

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        string str1, str2;
        str1.reserve(n);
        str2.reserve(m);
        cin >> str1 >> str2;

        // check str 1
        bool f[2] = {false, false};
        for (int i = 1; i < n; ++i) if (str1[i] == str1[i - 1]) f[str1[i] - '0'] = true;
        if (f[0] && f[1]) {
            cout << "NO" << endl;
            continue;
        }

        if (!f[0] && !f[1]) {
            cout << "YES" << endl;
            continue;
        }

        // check str 2
        bool flag = true;
        for (int i = 1; i < m; ++i) if (str2[i] == str2[i - 1]) flag = false;
        if (!flag) {
            cout << "NO" << endl;
            continue;
        }

        if (f[str2[0] - '0']) {
            cout << "NO" << endl;
            continue;
        }

        if (f[str2[m - 1] - '0']) {
            cout << "NO" << endl;
            continue;
        }

        cout << "YES" << endl;
    }
}
```

# C. Qingshan Loves Strings 2

## 大致题意

有一个 $01$ 字符串，希望将这个字符串的中间对称位置字符不同，每次操作允许往任何位置插入一个 $01$ 字符串

## 思路

用 `list` 模拟一下就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        cin >> str;

        if (n % 2) {
            cout << -1 << endl;
            continue;
        }

        list<char> l;
        for (auto &item : str) l.push_back(item);
        int lp = 0, rp = n;
        auto li = l.begin(), ri = l.end();
        --ri;

        bool flag = true;
        vector<int> ans;
        while (li != ri && lp < rp) {
            if (*li != *ri) {
                ++li;
                --ri;
                ++lp;
                --rp;
                continue;
            }

            if (*li == '0') {
                ans.push_back(rp);
                l.insert(++ri, '0');
                l.insert(ri, '1');
                --ri;
                rp += 2;
            } else if (*ri == '1') {
                ans.push_back(lp);
                l.insert(li, '1');
                --li;
                l.insert(li, '0');
                --li;
                rp += 2;
            }

            if (ans.size() > 300) {
                flag = false;
                break;
            }
        }

        if (!flag) {
            cout << -1 << endl;
        } else {
            cout << ans.size() << endl;
            for (int i = 0; i < ans.size(); ++i) cout << ans[i] << " \n"[i == ans.size() - 1];
        }
    }
}
```

# D. Doremy's Connecting Plan

## 大致题意

有一个城市，每个城市都有一定的人数，现在希望在城市之间建立连接，如果满足 $\sum\_{k \in S} a\_k \geq i \times j \times c$，则可以建立链接，其中 $S$ 为节点 $i$ 和 $j$ 已经连通部分的所有节点集合

## 思路

考虑所有的节点按照一定顺序和 $1$ 城市建连

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, c;
        cin >> n >> c;
        vector<pair<int, int>> data(n);
        for (auto&item: data) cin >> item.first;
        for (int i = 0; i < n; ++i) data[i].second = i + 1;

        int tot = data[0].first;

        sort(data.begin(), data.end(), [&](const pair<int, int>&lhs, const pair<int, int>&rhs) {
            return lhs.first - lhs.second * c > rhs.first - rhs.second * c;
        });

        bool flag = true;
        for (auto&item: data) {
            if (item.second == 1) continue;
            if (tot + item.first >= item.second * c) tot += item.first;
            else flag = false;
        }

        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# E1. Doremy's Drying Plan (Easy Version)

## 大致题意

有一个城市，天气预报会预报未来 $m$ 天的下雨情况，允许选择其中两天不下雨，问最多可以有多少个城市这 $m$ 天不下雨

## 思路

根据起始和结束位置的下雨，标记数组，然后统计即可。因为只能选择两天，所以基本上是半暴力即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<vector<int>> start(n + 1), end(n + 1);
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
            start[u].push_back(i);
            end[v].push_back(i);
        }

        set<int> s;
        map<pair<int, int>, int> ans1;
        map<int, int> ans2;
        int ans3 = 0;
        for (int i = 1; i <= n; ++i) {
            for (auto&item: start[i]) s.insert(item);

            if (s.empty())
                ans3++;
            else if (s.size() == 1)
                ans2[*s.begin()]++;
            else if (s.size() == 2)
                ans1[{*s.begin(), *s.rbegin()}]++;

            for (auto&item: end[i]) s.erase(item);
        }

        int res = ans3;
        for (auto&item: ans1) {
            int tmp = item.second + ans3;
            auto l = ans2.find(item.first.first), r = ans2.find(item.first.second);
            if (l != ans2.end()) tmp += l->second;
            if (r != ans2.end()) tmp += r->second;
            res = max(res, tmp);
        }

        vector<int> ans2v;
        ans2v.reserve(ans2.size());
        for (auto&item: ans2) ans2v.push_back(item.second);
        sort(ans2v.begin(), ans2v.end(), greater<>());
        if (ans2v.size() == 1) res = max(res, ans2v[0] + ans3);
        else if (ans2v.size() > 1) res = max(res, ans2v[0] + ans2v[1] + ans3);

        cout << res << endl;
    }
}
```
