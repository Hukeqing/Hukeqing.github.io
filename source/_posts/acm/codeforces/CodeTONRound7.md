---
title: CodeTON Round 7 (Div. 1 + Div. 2, Rated, Prizes!)
date: 2024-01-28 14:32:43
updated: 2024-01-28 14:32:43
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: CodeTON Round 7 (Div. 1 + Div. 2, Rated, Prizes!) 个人写题记录
---

# A. Jagged Swaps

## 大致题意

有一个数组，允许选择一个值，其左右两边都是大于当前值的情况下，将当前值和后面的那个值交换一下位置。问是否可能把整个数组排序好

## 思路

可以从插入排序的方式去考虑，只需要第一个值是对的就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        cout << (data.front() == 1 ? "YES" : "NO") << endl;
    }
}
```

# B. AB Flipping

## 大致题意

有一个 AB 组成的数组，若存在 AB 这样的子字符串，则翻转 AB，且每个下标只能被翻转一次，问最多可以翻转多少次

## 思路

若存在一堆连续的 `AAAABBB` 这样的字符串，那么仅最后一个不能进行翻转，其他所有位置都能发生翻转，所以只需要找出这样的连续对数量即可

需要注意的是，如果是 `AABBAABB` 这种两组的，虽然对于每一个单独的组而言，最后一个不能翻转，但是整体上，除了最后的最后那个，其他也都可以翻转

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
        int ans = 0, cntB = 0, flag = 0;
        for (auto iter = str.rbegin(); iter != str.rend(); ++iter) {
            if (*iter == 'B') {
                flag = 1;
                cntB++;
            } else {
                ans += flag + cntB;
                cntB = 0;
            }
        }
        cout << max(ans - 1, 0) << endl;
    }
}
```

# C. Matching Arrays

## 大致题意

有 AB 两个数组，每次任意排序 B 数组，问是否存在一个排列，使得 $a\_i > b\_i$ 的 $i$ 的数量恰好是 $x$

## 思路

很简单的一个想法：两个数组排序后，然后将 B 数组的前 $x$ 个值放到后面去即可。然后再判断是否符合预期

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x;
        cin >> n >> x;
        vector<pair<int, int>> a(n);
        vector<int> b(n);
        for (auto& [fst, snd]: a) cin >> fst;
        for (int i = 0; i < n; ++i) a[i].second = i;
        for (auto& i: b) cin >> i;
        sort(b.begin(), b.end());
        sort(a.begin(), a.end());
        int res = 0;
        for (int i = 0; i < n; ++i) {
            res += a[i].first > b[(i + x) % n];
        }
        if (res == x) {
            cout << "YES" << endl;
            for (int i = 0; i < n; ++i) a[a[i].second].first = b[(i + x) % n];
            for (int i = 0; i < n; ++i) cout << a[i].first << " \n"[i == n - 1];
        } else cout << "NO" << endl;
    }
}
```

# D. Ones and Twos

## 大致题意

有一个仅有 $1, 2$ 组成数组，每次有两种操作：将其中一个值改成 $1, 2$，问是否存在一个子串，满足求和等于 $x$（x 是每次询问给出的值）

## 思路

因为数组仅有 $1, 2$ 组成，那么必然，如果总值是 $s$，那么必然可以得到 $s - 2$ 的字串（删掉一侧的值或者删掉两侧的值），
同理也可以得到 $s-4, s-6, \dots$ 直到等于 $0 or 1$

所以只需要维护总和就能解决一般的值了。

而如果需要奇偶性和之和不同，那么必然需要减去一个 $1$，那么只需要找到左右两边最近的 $1$，
然后减去那一侧的 $2$ 和第一个 $1$，就可以得到最大可以满足的和全部之和奇偶性不同的值了，然后可以继续按照上面的推论

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, q;
        cin >> n >> q;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int sum = 0;
        set<int> s;
        for (const auto& i: data) sum += i;
        for (int i = 0; i < n; ++i) if (data[i] == 1) s.insert(i);
        for (int qs = 0; qs < q; ++qs) {
            int op;
            cin >> op;
            if (op == 1) {
                int x;
                cin >> x;
                if (x > sum) cout << "NO" << endl;
                else if ((x & 1) == (sum & 1)) cout << "YES" << endl;
                else {
                    if (s.empty()) {
                        cout << "NO" << endl;
                        continue;
                    }
                    const int m = min(*s.begin(), n - *s.rbegin() - 1);
                    const int tmp = sum - m * 2 - 1;
                    cout << (x <= tmp ? "YES" : "NO") << endl;
                }
            } else {
                int a, b;
                cin >> a >> b;
                if (data[a - 1] == 1) s.erase(a - 1);
                if (b == 1) s.insert(a - 1);
                sum -= data[a - 1] - b;
                data[a - 1] = b;
            }
        }
    }
}
```

# E. Permutation Sorting

## 大致题意

有一个 $n$ 的排列的数组，每次按照如下操作进行

- 选出其中 $a\_i \neq i$ 的 $i$，得到一个由 $i$ 组成的数组 $s$
- $a\_{s\_{i \space mod \space k+1}} \leftarrow a\_{s\_i}$

重复进行后，直到整个数组排序完成，问每一个下标完成排序需要操作几次

## 思路

从题意来看，其实就是每次将没有满足条件的值，右移一格，直到大家都满足了

由于在正常情况下，每次只移动一格，所以需要的成本就等于位置差值

但是因为有别的值会因为满足位置了，就不需要再路过这个节点了，也就可以省去一次移动成本，例如

| index  |  1  |  2  |  3  |  4  |  5  |
|:------:|:---:|:---:|:---:|:---:|:---:|
| start  |  3  |  5  |  4  |  1  |  2  |
| turn 1 |  2  |  3  |  5  | (4) |  1  |
| turn 2 | (1) | (2) | (3) | (4) | (5) |

注意到，本来初始为 $5$ 的值，本应该走 $3$ 次才能到目标地点的，但是因为 $4$ 提前到达目标地点，
所以 $5$ 只需要走两次即可，为了方便表示，我们把 $4$ 的移动描述成 $[3,4]$，同理，那么 $5$ 就是 $[2,5]$

故我们需要找到的是，每个值要进行横跨的时候，会同时跨越的其他区间数量，即有哪些节点，他们开始的位置比当前值晚的同时，结束位置还比当前值早

我们可以用线段树来维护这样的值，如果存在一个 $[l,r]$，那么必然可以对所有 $[<l, >r]$ 的区间产生减少一次移动成本的效果
那么我们可以将 $[r+1,n]$ 的区间都 $+1$，而如何表示 $<l$，则可以通过访问顺序来控制，我们保证从左往右访问即可，
每次访问后，将当前节点带来的区间进行删除

需要注意的是，因为移动是环形的，所以需要维护两倍区间长度，不然可能会出错

## AC code

```cpp
struct SegTree {
    vector<int> s, laz;

    explicit SegTree(int n): s((n << 1) + 10), laz((n << 1) + 10) {}

    int static get(const int l, const int r) {
        return (l + r) | (l != r);
    }

    void up(const int l, const int r) {
        const int mid = (l + r) >> 1;
        s[get(l, r)] = s[get(l, mid)] + s[get(mid + 1, r)];
    }

    void build(const int l, const int r) {
        laz[get(l, r)] = 0;
        if (l == r) {
            s[get(l, r)] = 0;
            return;
        }
        const int mid = (l + r) >> 1;
        build(l, mid);
        build(mid + 1, r);
        up(l, r);
    }

    void push(const int l, const int r) {
        const int k = get(l, r);
        if (laz[k]) {
            const int mid = (l + r) >> 1;
            s[get(l, mid)] += laz[k] * (mid - l + 1);
            s[get(mid + 1, r)] += laz[k] * (r - mid);
            laz[get(l, mid)] += laz[k];
            laz[get(mid + 1, r)] += laz[k];
            laz[k] = 0;
        }
    }

    void update(const int l, const int r, const int x, const int y, const int w) {
        if (l == x && y == r) {
            s[get(l, r)] += w * (r - l + 1);
            laz[get(l, r)] += w;
            return;
        }
        push(l, r);
        if (const int mid = (l + r) >> 1; y <= mid) {
            update(l, mid, x, y, w);
        } else if (x > mid) {
            update(mid + 1, r, x, y, w);
        } else {
            update(l, mid, x, mid, w);
            update(mid + 1, r, mid + 1, y, w);
        }
        up(l, r);
    }

    int query(const int l, const int r, const int x) {
        if (l == r) {
            return s[get(l, r)];
        }
        push(l, r);
        const int mid = (l + r) >> 1;
        if (x <= mid) {
            return query(l, mid, x);
        }

        return query(mid + 1, r, x);
    }
};

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n), ans(n);
        SegTree tree(2 * n);
        for (auto& i: data) cin >> i;
        for (int i = 0; i < n; ++i) {
            const int target = data[i] > i ? data[i] : data[i] + n;
            tree.update(1, 2 * n, target, 2 * n, 1);
            if (target < n) tree.update(1, 2 * n, target + n, 2 * n, 1);
        }
        for (int i = 0; i < n; ++i) {
            const int target = data[i] > i ? data[i] : data[i] + n;
            tree.update(1, 2 * n, target, 2 * n, -1);
            ans[data[i] - 1] = target - (i + 1) - tree.query(1, 2 * n, target);
        }
        for (int i = 0; i < n; ++i) cout << ans[i] << " \n"[i == n - 1];
    }
}
```
