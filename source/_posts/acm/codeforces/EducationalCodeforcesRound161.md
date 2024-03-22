---
title: Educational Codeforces Round 161 (Rated for Div. 2)
date: 2024-03-22 23:20:12
updated: 2024-03-22 23:20:12
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Educational Codeforces Round 161 (Rated for Div. 2) 个人写题记录
---

# A. Tricky Template

## 大致题意

设定一种模式串，对于模式串中的每一个字符，如果是小写，则表示必须匹配这个小写字母，如果是大写，则表示必定不匹配对应的那个小写字母

再给出三个字符串，问是否存在一个模式串，恰好匹配前面两个字符串，同时不匹配第三个字符串

## 思路

只要有一个位置的字母，前两个字符串和第三个字符串都不同即可，这样只要那个位置的模式串是大写的第三个字符串的字符即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string a, b, c;
        a.resize(n);
        b.resize(n);
        c.resize(n);
        cin >> a >> b >> c;
        bool flag = false;
        for (int i = 0; i < n; ++i) if (a[i] != c[i] && b[i] != c[i]) flag = true;
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# B. Forming Triangles

## 大致题意

有 n 条边，每条边的长度都是 $2^x$，问可以组成多少个使用了不同边的三角形

## 思路

因为 $2^x$ 恰好满足一个特点：$2^{a} + 2^{b} < 2^c$，当 $a < b < c$ 时，也就是容易得到，至少有两条边相同才有可能

所以只需要讨论一下两条边相同和三条边相同的情况即可，当然也可以一起讨论了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        map<int, int> cnt;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ++cnt[tmp];
        }
        int tot = 0, ans = 0;
        for (const auto [fst, snd]: cnt) {
            if (snd == 2) ans += tot;
            else if (snd > 2) ans += tot * snd * (snd - 1) / 2 + snd * (snd - 1) * (snd - 2) / 6;
            tot += snd;
        }
        cout << ans << endl;
    }
}
```

# C. Closest Cities

## 大致题意

有一排城市，每个城市都有一个坐标，每个城市都可以前往其他的城市。而一个城市距离较近的那个城市的花费成本为 1，而前往其他城市的成本就是距离

计算任意两个城市之间的距离

## 思路

因为移动移动是从左移动到右边，或者从右边移动到左边，路径只有一条，所以可以前后做两次前缀和解决

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n), cl(n), cr(n);
        for (auto& i: data) cin >> i;
        cl[0] = cr[n - 1] = 0;
        for (int i = 1; i < n; ++i) {
            if (i == 1 || data[i - 1] - data[i - 2] >= data[i] - data[i - 1]) cl[i] = cl[i - 1] + 1;
            else cl[i] = cl[i - 1] + data[i] - data[i - 1];
        }
        for (int i = n - 2; i >= 0; --i) {
            if (i == n - 2 || data[i + 2] - data[i + 1] >= data[i + 1] - data[i]) cr[i] = cr[i + 1] + 1;
            else cr[i] = cr[i + 1] + data[i + 1] - data[i];
        }
        int m;
        cin >> m;
        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;
            if (u <= v) cout << cl[v - 1] - cl[u - 1] << endl;
            else cout << cr[v - 1] - cr[u - 1] << endl;
        }
    }
}
```

# D. Berserk Monsters

## 大致题意

有一排怪物，每一个怪物都有一定攻击力和防御力，当一个怪物一次性受到的攻击大于其防御力的时候，将会死亡

现在每个怪物将会同时攻击它相邻的两个怪物，经过 $n$ 轮次后，问每一轮死了多少怪物

## 思路

首先是非常容易计算是否会死亡，即只要相邻两个怪物的攻击力高于其防御力即可，由于不是生命值，所以很容易统计

而每轮只有死亡怪物后，其相邻的怪物才会有可能死亡，所以只需要考虑每次发生变化的怪物附近即可，不需要考虑全部怪物

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> a(n), d(n);
        for (auto& i: a) cin >> i;
        for (auto& i: d) cin >> i;
        map<int, pair<int, int>> mp;
        for (int i = 0; i < n; ++i) mp[i] = {a[i], d[i]};
        auto check = [&](map<int, pair<int, int>>::iterator& cur) {
            int cost = 0;
            if (cur != mp.begin()) {
                --cur;
                cost += cur->second.first;
                ++cur;
            }
            ++cur;
            if (cur != mp.end()) cost += cur->second.first;
            --cur;

            return cost > cur->second.second;
        };

        set<int> s[2];
        for (auto iter = mp.begin(); iter != mp.end(); ++iter) if (check(iter)) s[0].insert(iter->first);
        int cur = 0, nxt = 1, tot = 0;
        vector ans(n, 0);
        while (!s[cur].empty()) {
            for (const int& c: s[cur]) {
                ++ans[tot];
                mp.erase(c);
            }
            for (const int& c: s[cur]) {
                auto iter = mp.upper_bound(c);
                if (iter != mp.end()) if (check(iter)) s[nxt].insert(iter->first);
                if (iter != mp.begin()) {
                    --iter;
                    if (check(iter)) s[nxt].insert(iter->first);
                }
            }
            s[cur].clear();
            swap(cur, nxt);
            ++tot;
        }
        for (int i = 0; i < n; ++i) cout << ans[i] << " \n"[i == n - 1];
    }
}
```

# E. Increasing Subsequences

## 大致题意

请构造一个字符串，使其内部的递增子序列的数量恰好是 $n$ 个

## 思路

容易得到，如果是简单的递增序列，其长度子序列数量的关系是

| len | count | addition |
|:---:|:-----:|:--------:|
|  0  |   1   |    -     |
|  1  |   2   |    1     |
|  2  |   4   |    2     |
|  3  |   8   |    4     |
|  4  |  16   |    8     |

很明显与 $2^x$ 有关，如果已经存在一个从 1 开始的递增序列，往其后面添加一个数值 $x$，则可以带来 $2^{x-1}$ 个数量的增加

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        --n;
        vector<int> ans;
        int cur = 62;
        while (n < (1LL << cur) - 1) --cur;
        for (int i = 1; i <= cur; ++i) ans.push_back(i);
        n -= (1LL << cur) - 1;
        while (n) {
            while (n >= 1LL << cur - 1) {
                n -= 1LL << cur - 1;
                ans.push_back(cur);
            }
            --cur;
        }
        cout << ans.size() << endl;
        for (int i = 0; i < ans.size(); ++i) cout << ans[i] << " \n"[i == ans.size() - 1];
    }
}
```
