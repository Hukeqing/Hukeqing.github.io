---
title: Codeforces Round 919 (Div. 2)
date: 2024-03-16 01:16:39
updated: 2024-03-16 01:16:39
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 919 (Div. 2) 个人写题记录
---

# A. Satisfying Constraints

## 大致题意

给出一堆条件，包括是否大于、小于且不等于某个值，问最终有几个值符合条件

## 思路

先记录最小的那个区间，然后再过滤掉不满足的，就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        int l = 0, r = INT_MAX;
        set<int> s;
        for (int i = 0; i < n; ++i) {
            int o, x;
            cin >> o >> x;
            if (o == 1) l = max(l, x);
            else if (o == 2) r = min(r, x);
            else s.insert(x);
        }
        int cnt = r - l + 1;
        for (auto& v: s) if (v <= r && v >= l) --cnt;
        cout << max(0, cnt) << endl;
    }
}
```

# B. Summation Game

## 大致题意

两个人博弈，一个人先移除最多 $k$ 个值，另外一个人将会把最多 $x$ 个值变成负数，问最终所有值加起来最大是多少

## 思路

显然，删除最大的最有利，所以枚举删除几个即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k, x;
        cin >> n >> k >> x;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        sort(data.begin(), data.end(), greater<>());
        int total = 0, fx = 0;
        for (int i = 0; i < n; ++i) {
            total += data[i];
            fx += i < x ? data[i] : 0;
        }
        int cur = 0, ma = 0;
        for (int l = 0, r = x; l < k; ++l, ++r) {
            cur -= r < n ? 2 * data[r] : 0;
            cur += data[l];
            ma = max(ma, cur);
        }
        cout << total - fx - fx + ma << endl;
    }
}
```

# C. Partitioning the Array

## 大致题意

一个数组，对于每个值再找一个特殊值取模，将其拆成 $n$ 等分，得到的每一个等分的数组相同，问有几种拆法

## 思路

拆法必然是数组长度的因子，暴力枚举即可。因为一个树的因子一定不会很多

## AC code

```cpp
int gcd(const int a, const int b) {
    return b == 0 ? a : gcd(b, a % b);
}
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        auto check = [&](const int x) {
            const int len = n / x;
            int tmp = 0;
            for (int i = 1; i < x; ++i)
                for (int j = 0; j < len; ++j)
                    tmp = gcd(abs(data[i * len + j] - data[(i - 1) * len + j]), tmp);
            return tmp != 1;
        };
        int ans = 0;
        for (int i = 1; i * i <= n; ++i) {
            if (n % i) continue;
            ans += check(i);
            if (i * i != n) ans += check(n / i);
        }
        cout << ans << endl;
    }
}
```

# D. Array Repetition

## 大致题意

开始有一个空的数组，有两种操作：

- 往数组最后加一个元素 $x$
- 把整个数组复制 $x$ 次

问最终的数组中，第 $i$ 位是什么

## 思路

最终的数值一定是第一个操作得到的，所以可以考虑不断递归逆向整个操作过程，看看目标位置最终是被哪一次加入元素带来的

## AC code

```cpp
#define int long long
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, q;
        cin >> n >> q;
        vector<pair<int, int>> data(n);
        for (auto& [fst, snd]: data) cin >> fst >> snd;
        map<int, list<int>> mp;
        int maxK = 0;
        for (int i = 0; i < q; ++i) {
            int tmp;
            cin >> tmp;
            mp[tmp].push_back(i);
            maxK = max(maxK, tmp);
        }
        int tot = 0, i = 0;
        for (; i < n; ++i) {
            if (data[i].first == 1) ++tot;
            else {
                if ((maxK + tot - 1) / tot <= 1 + data[i].second)
                    data[i].second = (maxK + tot - 1) / tot;
                tot *= 1 + data[i].second;
            }
            if (tot >= maxK) break;
        }
        vector<int> ans(q);
        for (; i >= 0; --i) {
            if (data[i].first == 1) {
                if (const auto iter = mp.find(tot); iter != mp.end())
                    for (const auto& v: iter->second) ans[v] = data[i].second;
                mp.erase(tot);
                --tot;
            } else {
                const int len = tot / (1 + data[i].second);
                for (auto iter = mp.upper_bound(len); iter != mp.end(); ) {
                    list<int>& l = mp[(iter->first - 1) % len + 1];
                    l.splice(l.end(), iter->second);
                    auto nxtIter = iter;
                    ++nxtIter;
                    mp.erase(iter);
                    iter = nxtIter;
                }
                tot = len;
            }
        }
        for (int i = 0; i < q; ++i) cout << ans[i] << " \n"[i == q - 1];
    }
}
```
