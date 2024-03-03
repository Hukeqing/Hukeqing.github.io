---
title: Codeforces Round 917 (Div. 2)
date: 2024-02-25 15:12:17
updated: 2024-02-25 15:12:17
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 917 (Div. 2) 个人写题记录
---

# A. Least Product

## 大致题意

有一个数组，允许你将每个值变成比原值更接近 0 的值，问如何操作可以使得整个数组的积最小

## 思路

如果负数是偶数个，那么随便找个值变成 0，如果是奇数个，那就别动

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        bool flag = false, zero = false;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            flag ^= tmp < 0;
            zero |= tmp == 0;
        }
        if (zero || flag) cout << 0 << endl;
        else cout << "1\n1 0" << endl;
    }
}
```

# B. Erase First or Second Letter

## 大致题意

有一个字符串，允许每次删除第一个或者第二个字母，操作无限制次数，问最多可以有多少个不同的字符串

## 思路

可以这样思考，如果是一个长度的字符串，那么必然是有多少种字母就是多少个

如果长度等于 2，那么必然是上面的基础上，再加上最后那个字母，那么应该等于首字母的种类数

三个的情况，那必然是在一个字母的基础上，加上原字符串最后两个字母，那么应该也等于首字母的种类数

所以只需要考虑位置即可，如果一个字母出现的第一个位置就是最后那个了，那么必然没有它开头的两个、三个的字符串了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        cin >> str;
        map<char, int> cnt;
        for (int i = 0; i < n; ++i) ++cnt[str[i]];
        int ans = 0;
        for (int i = n - 1; i >= 0; --i) {
            ans += static_cast<long long>(cnt.size());
            if (const auto iter = cnt.find(str[i]); iter->second == 1) cnt.erase(iter);
            else --iter->second;
        }
        cout << ans << endl;
    }
}
```

# C. Watering an Array

## 大致题意

有两个字符串，$a, b$，长度为 $n, d$，必须要操作 $d$ 次，每次可以选择下面两个其中一个，且必须执行其中一个，假设本次是第 $x$ 次操作

- 将 $\forall i \in [1, d\_x], a\_i \leftarrow a\_i + 1$
- 计算 $a\_i = i$ 的数量，并获得对应的分数，然后再进行 $\forall i \in [1, n], a\_i \leftarrow 0$

问最高分数可以是多少

## 思路

假设某次操作了 2 操作，然后因为每次会让所有值加一，所以无论操作几次，最终最多也只有一个值能满足要求

所以最好的方案是操作一次 1 然后操作一次 2，这样可以稳定拿到一分，等价于两次操作必定能拿到一次

所以核心需要关注的是最开始的 $a$ 数组的情况，因为数组仅有 2000 个，而且 $b$ 数组是一个循环数组

假设我们开始操作了 $x$ 次 1 后再进行操作 2，那么带来的最大分数就是 $n - \frac{x}{k}$
（操作 $k$ 次最多只有一次对整个数组都 +1 的情况下的分值最大，否则最大分值就是 $n - x$ 了）

而如果不那么做，直接按照上面的方案走，可以拿到 $\frac{x}{2}$ 的分数

所以得到 $\frac{x}{2} < n - \frac{x}{k} \rightarrow (1 + \frac{2}{k}) x < 2n \rightarrow x < 2n$

所以考虑 $2n$ 以内的情况即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k, d;
        cin >> n >> k >> d;
        vector<int> data(n), v(k);
        for (auto& i: data) cin >> i;
        for (auto& i: v) cin >> i;
        // init ans
        int ans = 0;
        for (int i = 0; i < n; ++i) if (data[i] == i + 1) ++ans;
        ans += (d - 1) / 2;
        for (int i = 0; i < min(2 * n, d - 1); ++i) {
            int tmp = 0;
            for (int j = 0; j < n; ++j) {
                if (j < v[i % k]) ++data[j];
                if (data[j] == j + 1) ++tmp;
            }
            tmp += (d - 2 - i) / 2;
            ans = max(ans, tmp);
        }
        cout << ans << endl;
    }
}
```

# D. Yet Another Inversions Problem

## 大致题意

给出两个初始的数组 $p, q$，其中 $p$ 数组必定是 $[1, 2n-1]$ 中的所有奇数的排列，而 $q$ 数组一定是 $[0, k - 1]$ 的排列

现在构建一个新的数组 $a\_{i \times k + j} = p\_i \times 2^{q\_j}$

问这个数组有多少个逆序对

## 思路

首先是 $q$ 数组本身的逆序，这种情况下，自己和自己就可以产生逆序对，这个部分可以通过归并排序解决，所以单独处理即可

接下来考虑不同数值之间的情况，显然可以通过 01 字典树完成。注意因为乘法其实就是左移，所以可以直接用每个字符串的最大比特位开始建树，
记录在经过某个节点的时候，剩下多长的比特位。

然后再遍历数组，每次遍历的点从树中移除，并且在遍历到某个节点的时候，需要关注一下它的姐妹节点上有多少数值经过了，
可以根据其剩下的比特位，推算出有多少的组合可以比它大，还需要关注在当前节点结束的数值的情况，
以及如果当前自己已经结束，那么剩下经过这个点的其他字符串的情况

## AC code

```cpp
#define ll long long

void solve() {
    int _;
    cin >> _;
    vector<vector<int>> tree(2e5 * 2), next(2e5 * 2);
    vector<int> end(2e5 * 2);
    for (auto& i: tree) i.resize(20, 0);
    for (auto& i: next) i.resize(2, 0);

    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        vector<int> p(n), q(k), cache(k);
        for (auto& i: p) cin >> i;
        for (auto& i: q) cin >> i;

        int root, tail = 0;
        auto build = [&] {
            for (int i = 0; i < 20; ++i) tree[tail][i] = 0;
            next[tail][0] = next[tail][1] = -1;
            end[tail] = 0;
            assert(tail < tree.size());
            return tail++;
        };

        root = build();

        auto move = [&](const int x, const int v) {
            int i = 20;
            while (i >= 0 && (x & 1 << i) == 0) --i;
            int cur = root;
            while (i >= 0) {
                const int flag = x & 1 << i ? 1 : 0;
                if (next[cur][flag] == -1) next[cur][flag] = build();
                cur = next[cur][flag];
                tree[cur][i] += v;
                --i;
            }
            end[cur] += v;
        };

        for (const auto& pi: p) move(pi, 1);

        ll ans = 0;
        constexpr ll mod = 998244353;
        auto pos = [&](const int gap, const int cnt) {
            if (gap >= k) return;
            const ll ps = 1ll * (k - gap + 1) * (k - gap) / 2 % mod;
            const ll tmp = ps * cnt % mod;
            ans = (ans + tmp) % mod;
        };

        auto neg = [&](int gap, const int cnt) {
            gap += 1;
            if (gap > k) return;
            const ll ps = 1ll * (k - gap + 1) * (k - gap) / 2 % mod;
            const ll all = 1ll * (k + 1) * k / 2 % mod;
            const ll tmp = (all - ps - k) * cnt % mod;
            ans = (ans + tmp) % mod;
        };

        for (const auto& pi: p) {
            move(pi, -1);
            int i = 20;
            while (i >= 0 && (pi & 1 << i) == 0) --i;
            int cur = root;
            while (i >= 0) {
                const int flag = pi & 1 << i ? 1 : 0;

                if (const int other = next[cur][flag ^ 1]; other != -1)
                    for (int ind = 0; ind < 20; ++ind)
                        if (tree[other][ind] > 0) {
                            const int gap = ind + (flag ^ 1) - i;
                            pos(max(0, gap), tree[other][ind]);
                            if (gap < 0) neg(-gap, tree[other][ind]);
                        }

                cur = next[cur][flag];
                const int gap = max(-i, -k + 1);
                pos(max(0, gap), end[cur]);
                if (gap < 0) neg(-gap, end[cur]);
                --i;
            }

            auto cal = [&](const int node) {
                if (node == -1) return;
                for (int ind = 0; ind < 20; ++ind)
                    if (tree[node][ind] > 0) {
                        const int gap = ind + 2;
                        pos(max(0, gap), tree[node][ind]);
                        if (gap < 0) neg(-gap, tree[node][ind]);
                    }
            };
            cal(next[cur][0]);
            cal(next[cur][1]);
        }

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

        const ll cnt = mergeSort(q, cache, 0, k - 1);
        const ll tmp = cnt * n % mod;
        ans = (ans + tmp) % mod;

        cout << ans << endl;
    }
}
```
