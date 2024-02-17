---
title: Codeforces Round 915 (Div. 2)
date: 2024-02-17 00:15:24
updated: 2024-02-17 00:15:24
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 915 (Div. 2) 个人写题记录
---

# A. Constructive Problems

## 大致题意

有一个棋盘，允许选择一定数量的方格先进行染色

若某个方格的相邻四个格子中，横向至少有一个已经染色，且纵向至少也有一个已经染色的情况下，那么这个格子也可以被自然染色

问最少最初选择的方格数量是多少

## 思路

对角线即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b;
        cin >> a >> b;
        cout << max(a, b) << endl;
    }
}
```

# B. Begginer's Zelda

## 大致题意

有一棵树，允许每次选择树上的一条路径，然后将路径上的所有的点都挤压到一个点上，问最多需要挤压几次才能让整个树变成一个点

## 思路

其实只需要统计叶子结点数量就行了，然后两两连线挤压即可，必定存在一种方法使得整个树的所有边被遍历

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> deg(n + 1, 0);
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            ++deg[u];
            ++deg[v];
        }

        int cnt = 0;
        for (int i = 1; i <= n; ++i) cnt += deg[i] == 1;
        cout << (cnt + 1) / 2 << endl;
    }
}
```

# C. Largest Subsequence

## 大致题意

有一个字符串，接下来有如下操作

- 找到这个字符串中字典序最大子序列
- 将这个子序列进行右移操作，仅对序列内的值生效

问需要操作几次才能使得整个数组有序

## 思路

因为是字典序最大子序列，那么必然得到的子序列是一个递减的序列。

而要求是右移，即把最后面的值放到最前面，那么必然放到最前面的是最小的那个值，那么必然下一次得到字典序最大子序列的时候，必定不会包含这个值了

也就是说，实际上每次操作后，下一次得到的子序列就是上一次的子序列删掉最开头的位置和最后面的那个值，即排序操作仅对这个子序列生效

所以只需要看这个子序列需要操作几次才能有序，以及是否能够保证整个序列有序

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
        vector<int> st(n);
        int r = 0;
        for (int i = 0; i < n; ++i) {
            while (r > 0 && str[st[r - 1]] < str[i]) --r;
            st[r++] = i;
        }
        int ans = r;
        for (int i = 0; i < r; ++i) if (str[st[i]] == str[st[0]]) --ans;
        --r;
        for (int l = 0; l < r; ++l, --r) swap(str[st[l]], str[st[r]]);
        for (int i = 1; i < n; ++i) if (str[i] < str[i - 1]) ans = -1;
        cout << ans << endl;
    }
}
```

# D. Cyclic MEX

## 大致题意

有一个 $[0, n-1]$ 的排列，允许进行任意次的右移操作

问找到一种的排列，使得 $\sum\_{i=1}^n mex([a\_1, a\_2, \dots a\_{i}])$ 最大

## 思路

这种数组的 $mex$ 其实就等于要求算的那个值后面的值中最小的那个值

考虑每次右移带来的效果

- 首先是最前面的那个 $mex([a\_1])$ 会被删除掉
- 然后影响从最后一个开始，找到第一个比当前值更小的值，这期间的所有值带来的贡献都变成当前值
- 然后再加上固定 $n$ 的贡献

所以可以考虑单调栈的方式去做

但是我觉得这个方案有点累，所以直接用线段树了。虽然说是仅影响了更小的那个值以及后面的值
但是要明确的是，那个更小的值前面的带来的贡献，必然小于等于那个更小的值，所以只需要全局把贡献降低到当前值即可

用样例举个例子

| index  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|:------:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| start  | 2 | 3 | 6 | 7 | 0 | 1 | 4 | 5 |
|  mex   | 0 | 0 | 0 | 0 | 1 | 4 | 5 | 8 |
| rotate | 3 | 6 | 7 | 0 | 1 | 4 | 5 | 2 |
|  mex   | 0 | 0 | 0 | 1 | 2 | 2 | 2 | 8 |

- 可以看到，首先是 $2$ 移动到后面去了，贡献变成了 $8$
- 然后是可以注意到，因为 $2$ 在最后面，所以所有值的贡献是不可能超过 $2$ 的，因为它必然是所有值后面的值

所以直接用线段树暴力即可，注意做好懒处理

## AC code

```cpp
#define ll long long

struct SegTree {
    vector<ll> sum, ma, mi;
    vector<bool> lazy;

    explicit SegTree(const int n) : sum((n << 1) + 10), ma((n << 1) + 10), mi((n << 1) + 10), lazy((n << 1) + 10) {}

    static int get(const int l, const int r) { return (l + r) | (l != r); }

    void up(const int l, const int r) {
        const int mid = (l + r) >> 1;
        const int i = get(l, r), li = get(l, mid), ri = get(mid + 1, r);
        sum[i] = sum[li] + sum[ri];
        ma[i] = max(ma[li], ma[ri]);
        mi[i] = min(mi[li], mi[ri]);
    }

    void push(const int l, const int r) {
        const int mid = (l + r) >> 1;
        const int i = get(l, r), li = get(l, mid), ri = get(mid + 1, r);
        lazy[i] = false;
        lazy[li] = true;
        lazy[ri] = true;
        sum[li] = (mid - l + 1) * mi[i];
        sum[ri] = (r - mid) * mi[i];
        ma[li] = ma[ri] = ma[i];
        mi[li] = mi[ri] = mi[i];
    }

    void update(const int l, const int r, const int x, const ll v) {
        const int i = get(l, r);
        if (l == r) {
            sum[i] = ma[i] = mi[i] = v;
            return;
        }

        if (lazy[i]) push(l, r);
        const int mid = (l + r) >> 1;
        if (x <= mid) update(l, mid, x, v);
        else update(mid + 1, r, x, v);
        up(l, r);
    }

    void update(const int l, const int r, const ll v) {
        int i = get(l, r);
        if (ma[i] <= v) return;
        if (mi[i] > v) {
            ma[i] = mi[i] = v;
            sum[i] = (r - l + 1) * v;
            lazy[i] = true;
            return;
        }

        if (l == r) {
            sum[i] = ma[i] = mi[i] = v;
            return;
        }

        const int mid = (l + r) >> 1;
        update(l, mid, v);
        update(mid + 1, r, v);
        up(l, r);
    }
};

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;

        vector flag(n + 1, false);
        int l = 1, r = n;
        SegTree tree(r);
        // init
        int cur = 0;
        for (int i = 0; i < n; ++i) {
            flag[data[i]] = true;
            while (flag[cur]) ++cur;
            tree.update(l, r, i + 1, cur);
        }
        ll ans = 0;
        for (int i = 0; i < n; ++i) {
            tree.update(l, r, data[i]);
            tree.update(l, r, i + 1, n);

            ans = max(ans, tree.sum[tree.get(l, r)]);
        }
        cout << ans << endl;
    }
}
```
