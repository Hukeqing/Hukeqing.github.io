---
title: Educational Codeforces Round 157 (Rated for Div. 2)
date: 2024-01-01 15:29:31
updated: 2024-01-01 15:29:31
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Educational Codeforces Round 157 (Rated for Div. 2) 个人写题记录
---

# A. Treasure Chest

## 大致题意

有一条路上，有一个宝箱(x)和一个钥匙(y)，开始人在  0  号位置，可以携带钥匙、宝箱进行移动，但是最多只能同时携带宝箱走 $k$ 步

问最多需要走几步才能同时拥有宝箱和钥匙

## 思路

说白了就是钥匙可以在 $[y, \inf]$ 范围内移动，而宝箱只能在 $[x-k, x+k]$ 范围内，所以需要至少走到 $max(x, y)$ 后 ，再回到 $[x-k, x+k]$ 区间内

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int x, y , k;
        cin >> x >> y >> k;
        cout << max(x, y) + max(0, y - x - k) << endl;
    }
}
```

# B. Points and Minimum Distance

## 大致题意

有一堆的数字，需要两两组合，变成平面上的点，然后在再逐个通过棋盘距离来连接所有点，要尽可能让线短

## 思路

就是要避免反复走，即一会往左一会往右，另外要尽可能短。

我的构造方法是这样的，将数组按照大小拆成两半，小一点的一半和大一点的一半，然后 x 只取小一点的，然后从最小开始取，y 则从大一点的开始，然后从最小开始取即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n * 2);
        for (auto& i: data) cin >> i;
        sort(data.begin(), data.end());
        vector<pair<int, int>> res(n);
        for (int i = 0; i < n; ++i) res[i] = {data[i], data[n + i]};
        int ans = 0;
        for (int i = 1; i < n; ++i) ans += abs(res[i].first - res[i - 1].first) + abs(res[i].second - res[i - 1].second);
        cout << ans << endl;
        for (const auto& [fst, snd]: res) cout << fst << ' ' << snd << endl;
    }
}
```

# C. Torn Lucky Ticket

## 大致题意

有一个字符串组，每个字母都是数字，每个字符串的最大长度不超过 $5$ 个。

任选两个字符串连在一块，使得整个字符串的长度恰好为偶数，且拆成两半之后，再把两边的每一个数字加起来，使得两边相等

问有多少种可能

## 思路

看数组量级，说明需要查找的方式来找匹配的值

两个字符串相同长度的时候，非常的简单统计一下即可

如果不等长，那么就有几种组合 $1+3,1+5,2+4,3+5$

最简单的方式就是枚举所有的拆法，去枚举那些长度较长的部分，并将结果写入到统计表里，然后查找即可

## AC code

```cpp
#define int long long

void solve() {
    int n;
    cin >> n;
    vector<string> data(n);
    for (auto& i: data) cin >> i;
    map<pair<int, int>, int> cnt;
    for (auto& i: data) {
        int sum = 0;
        for (const char l: i) sum += l - '0';
        cnt[{sum, i.size()}]++;
        if (i.size() == 3 || i.size() == 5 || i.size() == 4) {
            cnt[{sum - (i.front() - '0') * 2, i.size() - 2}]++;
            cnt[{sum - (i.back() - '0') * 2, i.size() - 2}]++;
        }
        if (i.size() == 5) {
            cnt[{sum - (i[4] - '0' + i[3] - '0') * 2, 1}]++;
            cnt[{sum - (i[0] - '0' + i[1] - '0') * 2, 1}]++;
        }
    }
    int ans = 0;
    for (auto& i: data) {
        int sum = 0;
        for (const char l: i) sum += l - '0';
        if (auto iter = cnt.find({sum, i.length()}); iter != cnt.end()) ans += iter->second;
    }
    cout << ans << endl;
}
```

# D. XOR Construction

## 大致题意

有一个数组 $a$，长度 $n-1$，需要构造出一个数组长度为 $n$ 的数组，满足数组是 $[0,n-1]$ 的排列，且 $b\_i \oplus b\_{i+1} = a\_i$

## 思路

显然可以得到，$b\_i = b\_1 \oplus a\_1 \oplus a\_2 \oplus a\_3 \dots \oplus a\_{i-1}$

那么只需要枚举 $b\_1$ 的值，然后去判断是否能够保证所有的 $b\_i \le n$ 即可

如果找到了，那么就是答案，并不需要判断是否满足是 $[0,n-1]$ 的排列。

原因也很简单

- 题目说明必定有答案，那么必然有一个解
- 假如当前值能够满足所有结果值都在 $[0, n-1]$ 后并不是正确的解（即存在重复的值了）
  - 那么必然还存在另外一个解不存在重复的解，假定错误的解为 $b\_1$，正确的为 $b\_1'$
  - 那么必定存在一个 $i,j(i \le j)$，满足 $b\_i = b\_j$
  - 那么可以得到 $b\_j = b\_i \oplus a\_{i} \oplus a\_{i+1} \oplus a\_{i+2} \dots \oplus a\_{j-1} = b\_i$
  - 即 $a\_{i} \oplus a\_{i+1} \oplus a\_{i+2} \dots \oplus a\_{j-1}$
  - 那么必然就可以得到 $b\_i' \oplus a\_{i} \oplus a\_{i+1} \oplus a\_{i+2} \dots \oplus a\_{j-1} = b\_j'$
  - 即两个解都不是正确的解

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> data(n - 1);
    for (auto& i: data) cin >> i;

    struct node {
        int cnt, n[2];
    };

    vector<node> tree(n * 32);
    int len = 0;

    auto build = [&] {
        tree[len] = {0, -1, -1};
        return len++;
    };

    const auto root = build();

    auto add = [&](const int x) {
        int cur = root;
        for (int i = 30; i >= 0; --i) {
            const auto v = x & (1 << i) ? 1 : 0;
            if (tree[cur].n[v] == -1) tree[cur].n[v] = build();
            cur = tree[cur].n[v];
        }
    };

    auto find = [&](const int x) {
        int cur = root, ans = 0;
        for (int i = 30; i >= 0; --i) {
            const auto v = x & 1 << i ? 1 : 0;
            if (const auto u = v ^ 1; tree[cur].n[u] != -1) {
                cur = tree[cur].n[u];
                ans += 1 << i;
            } else cur = tree[cur].n[v];
        }

        return ans;
    };

    int tmp = 0;
    for (const auto& i: data) {
        tmp ^= i;
        add(tmp);
    }

    for (int i = 0; i < n; ++i) {
        tmp = find(i);
        if (tmp >= n) continue;
        tmp = i;
        cout << tmp;
        for (const auto& j: data) {
            tmp ^= j;
            cout << ' ' << tmp;
        }
        cout << endl;
        return;
    }
}
```
