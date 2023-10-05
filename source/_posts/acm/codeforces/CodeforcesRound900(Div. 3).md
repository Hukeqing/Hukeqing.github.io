---
title: Codeforces Round 900 (Div. 3)
date: 2023-10-05 16:24:34
updated: 2023-10-05 16:24:34
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. How Much Does Daytona Cost?

## 大致题意

给出一个数组和一个数字，问数组内是否存在某个子区间，使得给出的值出现次数最多

## 思路

只有一个值也是子区间，只有它出现也是出现，所以只需要判断是否存在即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        bool flag = false;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp == k) flag = true;
        }
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# B. Aleksa and Stack

## 大致题意

要求你构造一个数组，长度为 $n$，严格递增，且满足 $3 \times a\_{i+2} \space mod \space (a\_{i+1} + a\_{i+2}) \neq 0$

## 思路

随便递增就行，要是成立了，就把 $a\_{i+2}$ 再加一不就行了。注意开头两个值不可以是 $1, 2$

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int a = 1, b = 3;
        cout << "1 3";
        for (int i = 2; i < n; ++i) {
            int cur = b + 1;
            while ((cur * 3) % (a + b) == 0) cur++;
            cout << ' ' << cur;
            a = b;
            b = cur;
        }
        cout << endl;
    }
}
```

# C. Vasilije in Cacak

## 大致题意

给出一个 $n$，问能否在 $[1, n]$ 内选出 $k$ 个值，其和恰好为 $x$

## 思路

初始区间是 $[1, n]$，那么肯定最终能够构造出的值必定也是完全连续的，所以只需要考虑最大可能和最小可能即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k, x;
        cin >> n >> k >> x;
        int mi = (1 + k) * k / 2, ma = (n + (n - k + 1)) * k / 2;
        cout << (x >= mi && x <= ma ? "YES" : "NO") << endl;
    }
}
```

# D. Reverse Madness

## 大致题意

这题的题意隐藏得很好，就不写大致题意了，看原文会更有味道一些

## 思路

首先要理清楚题目到底要我们做什么，如果直接按照题目的要求去做，反而完全不知道如何下手

在给出一个 $x$ 后，查找到一个对应的 $i$ 满足 $l\_i \leq x \leq r\_i$，然后翻转 $[min(x, l\_i + r\_i - x), max(x, l\_i + r\_i - x)]$ 这个区间的字符串，问最终结果

首先回来看给出的两个数组的特点，比较有意思的一条 $l\_i = r\_{i-1}+1$。如果把每个 $i$ 对应的区间 $[l\_i, r\_i]$ 单独拎出来看，会发现这些所有的区间是不会重合的，是恰好完美覆盖整个字符串的，所以，查找到一个对应的 $i$ 满足 $l\_i \leq x \leq r\_i$，实际上就是要找到此时的 $x$ 处于哪个区间上

再来看后面的 $[min(x, l\_i + r\_i - x), max(x, l\_i + r\_i - x)]$。因为我们已经知道 $l\_i \leq x \leq r\_i$，所以设 $x = l + m, r = x + n$，故可以得到 $l\_i + r\_i - x \rightarrow l\_i + x + n - x \rightarrow l\_i + n \rightarrow r\_i - m - n + n \rightarrow r\_i - m$，而注意到 $x = l\_i + m$，所以实际上最终的区间恰好是 $[l + m, r - m]$（假定 $m$ 较小的情况下，反之也可以得到类似结果）

很显然，实际上无论怎么翻转，大家的翻转区间要么不会有交集，要么是基于同一个点进行的翻转，所以实际上只需要记录下每个点被翻转了几次即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        string str;
        str.reserve(n);
        cin >> str;
        vector<int> a(k), b(k);
        for (auto &i: a) cin >> i;
        for (auto &i: b) cin >> i;

        int q;
        cin >> q;
        vector<bool> flag(n + 1, false);
        for (int i = 0; i < q; ++i) {
            int x;
            cin >> x;
            int index = int(upper_bound(a.begin(), a.end(), x) - a.begin()) - 1;
            int l = min(a[index] + b[index] - x, x), r = max(a[index] + b[index] - x, x);
            flag[l] = !flag[l];
            if (r != b[index]) flag[r + 1] = !flag[r + 1];
        }

        for (int i = 0; i < k; ++i) {
            bool f = false;
            for (int l = a[i]; l <= b[i]; ++l) {
                f ^= flag[l];
                if (!f) cout << str[l - 1];
                else cout << str[b[i] - (l - a[i]) - 1];
            }
        }
        cout << endl;
    }
}
```

# E. Iva & Pav

## 大致题意

有一个数组，每次给出一个下标 $l$ 和一个目标值 $x$，问能够找到另外一个尽可能大的下标 $r$，满足 $[l, r]$ 内所有值进行 $&$ 计算后仍然大于 $x$

## 思路

建了一棵线段树，然后二分答案，然后没了

## AC code

```cpp
struct SegTree {
    vector<int> data;

    explicit SegTree(int size) : data((size << 1) + 10) {}

    static inline int get(int l, int r) { return (l + r) | (l != r); }

    void up(int l, int r) {
        int mid = (l + r) >> 1;
        data[get(l, r)] = data[get(l, mid)] & data[get(mid + 1, r)];
    }

    // NOLINTNEXTLINE(*-no-recursion)
    void build(int l, int r) {
        if (l == r) return;
        int mid = (l + r) >> 1;
        build(l, mid);
        build(mid + 1, r);
        up(l, r);
    }

    // NOLINTNEXTLINE(*-no-recursion)
    int query(int l, int r, int x, int y) {
        if (l == x && r == y) return data[get(l, r)];
        int mid = (l + r) >> 1;
        if (y <= mid) return query(l, mid, x, y);
        else if (x > mid) return query(mid + 1, r, x, y);
        else return query(l, mid, x, mid) & query(mid + 1, r, mid + 1, y);
    }
};

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        SegTree tree(n);
        for (int i = 0; i < n; ++i) cin >> tree.data[(i + 1) << 1];
        tree.build(1, n);
        int q;
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int l, k;
            cin >> l >> k;
            if (tree.data[l << 1] < k) {
                cout << -1 << ' ';
                continue;
            }

            int ll = l, rr = n + 1;
            while (ll + 1 < rr) {
                int mid = (ll + rr) >> 1;
                if (tree.query(1, n, l, mid) >= k) ll = mid;
                else rr = mid;
            }
            cout << ll << ' ';
        }
        cout << endl;
    }
}
```

# F. Vasilije Loves Number Theory

## 大致题意

初始有一个值 $n$，有两种操作

- 给出一个 $x$，使得 $n \leftarrow n \times x$，然后询问是否存在数字 $a$，满足 $gcd(a, n) = 1$ 的同时 $d(n \times a) = n$
- 将 $n$ 改为初始值

其中 $d(x)$ 表示 $x$ 的因子数（非质因子数）

## 思路

首先，$n$ 几乎可以增长到非常大，所以肯定不能保存下来，当然，麻烦的事情肯定不止这个。

首先是 $d(n \times a)$ 如何计算，已知两个数的所有因子，且因子没有重复（$gcd(a, n) = 1$）则此时 $d(n \times a) = d(n) \times d(a)$，而这个等式还需要 $=n$，故得到 $d(a) = \frac{n}{d(n)}$，而因为 $d(a)$ 一定是正整数，所以只需要满足右边的分数是整数即可。至于 $a$ 具体如何构造，可以直接拿一个足够大的素数的 $\frac{n}{d(n)} - 1$ 次幂即可

计算 $d(n)$ 则只需要对 $n$ 进行质因子分解即可，根据每次的乘法，进行累加质因子。而需要计算 $\frac{n}{d(n)}$ 是否是整数，则可以再对 $d(n)$ 进行质因子分解，看看两边的质因子是否有包含关系即可

## AC code

```cpp
#define int long long

void solve() {
    vector<int> prime;
    vector<int> flag(1e6 + 10, true);
    flag[0] = flag[1] = false;
    for (int i = 2; i < flag.size(); ++i) {
        if (!flag[i]) continue;
        for (int j = i * i; j < flag.size(); j += i) flag[j] = false;
    }
    for (int i = 2; i < flag.size(); ++i) if (flag[i]) prime.push_back(i);
    auto div = [&](int x, const function<void(int, int)> &callback) {
        for (int i: prime) {
            if (x % i != 0) continue;
            int cnt = 0;
            while (x % i == 0) {
                cnt++;
                x /= i;
            }
            callback(i, cnt);
            if (flag[x]) {
                callback(x, 1);
                return;
            }
        }
    };

    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, q;
        cin >> n >> q;
        map<int, int> cnt;
        int dn = 1;
        auto add = [&](int v, int c) {
            auto iter = cnt.find(v);
            if (iter == cnt.end()) {
                cnt.insert({v, 0});
                iter = cnt.find(v);
            }
            dn /= iter->second + 1;
            iter->second += c;
            dn *= iter->second + 1;
        };
        div(n, add);

        for (int i = 0; i < q; ++i) {
            int o;
            cin >> o;
            switch (o) {
                case 1LL: {
                    int x;
                    cin >> x;
                    div(x, add);
                    bool f = true;
                    div(dn, [&](int v, int c) {
                        if (cnt[v] < c) f = false;
                    });
                    cout << (f ? "YES" : "NO") << endl;
                    break;
                }
                case 2LL:
                    cnt.clear();
                    dn = 1;
                    div(n, add);
                    break;
                default:
                    break;
            }
        }
        cout << endl;
    }
}
```

# G. wxhtzdy ORO Tree

## 大致题意

有一棵树，树上每个点上都有值，每次询问给出两个点 $u, v$，需要寻找一个 $z$，使得

- $z$ 在 $u, v$ 的树上路径上，即最短路径上
- $g(u, z) + g(z, v)$ 的值尽可能大

其中 $g(x, y)$ 表示在树上的 $x, y$ 两点的最短路径上的所有值进行或运算，得到的结果的值在二进制上，有多少个 bit 位是 `1`

## 思路

首先要找树上路径，大概率会用到 lca 算法。接下来因为要求算树上路径的或和，所以还可以在 lca 上加一个父节点的或运算的倍增表

而要寻找的点一定在两者的倍增节点上，由于目标节点一定是恰好可以产生一个比特位从 $o \rightarrow 1$ 的变化的，所以可以再记录下一个点的所有比特位，在其的最近的哪个父亲那完成了 $o \rightarrow 1$ 的变化

然后遍历所有的可能计算即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n + 1);
        for (int i = 1; i <= n; ++i) cin >> a[i];
        struct node {
            int v, n;
        };
        vector<node> edge(n * 2);
        vector<int> head(n + 1, -1);
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            edge[i << 1] = {v, head[u]};
            edge[(i << 1) | 1] = {u, head[v]};
            head[u] = i << 1;
            head[v] = (i << 1) | 1;
        }

        // dep is the depth of node
        vector<int> dep(n + 1);
        // fa for lca, orFa for calculate 'or sum' faster, miB for the deepest node `x` which (x & (1 << i)) is true
        vector<vector<int>> fa(n + 1), orFa(n + 1), miB(n + 1);

        for (auto &i: fa) i.resize(20);
        for (auto &i: orFa) i.resize(20);
        for (auto &i: miB) i.resize(30);

        // build lca
        function<void(int, int)> dfs = [&](int u, int p) {
            dep[u] = dep[p] + 1;

            fa[u][0] = p;
            orFa[u][0] = a[p];
            for (int i = 1; i < 20; ++i) {
                fa[u][i] = fa[fa[u][i - 1]][i - 1];
                orFa[u][i] = orFa[u][i - 1] | orFa[fa[u][i - 1]][i - 1];
            }
            for (int i = 0; i < 30; ++i) miB[u][i] = (a[p] & (1 << i)) ? p : miB[p][i];
            for (int i = head[u]; ~i; i = edge[i].n) if (edge[i].v != p) dfs(edge[i].v, u);
        };
        // lca
        function<int(int, int)> lca = [&](int u, int v) {
            if (dep[u] < dep[v]) swap(u, v);
            int diff = dep[u] - dep[v];
            for (int i = 0; i < 20; ++i) if (diff & (1 << i)) u = fa[u][i];
            if (u == v) return u;
            for (int i = 19; i >= 0; --i) {
                if (fa[u][i] == fa[v][i]) continue;
                u = fa[u][i];
                v = fa[v][i];
            }
            return fa[u][0];
        };
        // calculate the 'or sum' from u to v
        function<int(int, int)> ors = [&](int u, int v) {
            int p = lca(u, v);
            // -1 to avoid 'or' the parent double times
            int ld = dep[u] - dep[p] - 1, rd = dep[v] - dep[p] - 1;
            int ls = 0, rs = 0, ru = u, rv = v;

            if (ld > 0)
                for (int i = 0; i < 20; ++i)
                    if (ld & (1 << i)) {
                        ls |= orFa[ru][i];
                        ru = fa[ru][i];
                    }
            if (rd > 0)
                for (int i = 0; i < 20; ++i)
                    if (rd & (1 << i)) {
                        rs |= orFa[rv][i];
                        rv = fa[rv][i];
                    }
            return ls | rs | a[p] | (p == u ? 0 : a[u]) | (p == v ? 0 : a[v]);
        };
        // calculate the bit count
        function<int(int)> bitCount = [&](int u) {
            int res = 0;
            while (u) {
                res += u & 1;
                u >>= 1;
            }
            return res;
        };
        // find on the path (u -> p)
        function<int(int, int, int)> cal = [&](int u, int v, int p) {
            int ans = bitCount(a[u]) + bitCount(ors(u, v));
            for (int i = 0; i < 30; ++i) {
                if (miB[u][i] == 0 || miB[u][i] == u) continue;
                if (dep[p] > dep[miB[u][i]]) continue;
                ans = max(ans, bitCount(ors(u, miB[u][i])) + bitCount(ors(v, miB[u][i])));
            }
            return ans;
        };
        dfs(1, 0);

        int q;
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int u, v;
            cin >> u >> v;
            int p = lca(u, v);
            cout << max(cal(u, v, p), cal(v, u, p)) << ' ';
        }
        cout << endl;
    }
}
```


