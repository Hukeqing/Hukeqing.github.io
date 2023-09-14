---
title: 2020牛客暑期多校训练营（第二场）H-Happy Triangle——动态开点线段树+STL+区间化点
date: 2020-07-15 19:34:31
categories: ACM&算法
tag:
 - ACM
 - NowCoder
math: true
---

在WA了好多发之后，终于找到了我不小心写错的bug……~~我是SB~~

我的写法与网络上很多人的差异较大，但是个人觉得比其他人的更容易理解。第一次写动态开点的线段树，直接稍微改动了一下原本自己习惯的线段树板子，所以可能与其他板子不同。同时因为是改了线段树的板子，所以反而更容易看懂。其次就是个人感觉我的写法比题解要简单很多，而且码量很小

# 题意

对于一个可重复集合，进行Q次操作。集合起始的时候为空，操作类型如下
 - 往集合中加入一个元素
 - 从集合中删除一个元素（保证其存在）
 - 给定一个元素 $x$ ，问集合中是否存在另外两个元素$a, b$（允许值相同但是不允许元素相同），使得$a, b, x$三条边可以组成一个非退化三角形（即满足任意两边之和大于第三边，或任意两边之差小于第三边）。

# 分析

## 分析三角形公式

首先根据公式$a + b > c$ 转为 $c - b<a$ （假定$a \leq b \leq c$），那么我们可以得到，下面的结论：

假定存在 $a \leq b$ 满足 $a, b, c$ 三边能够组成三角形，那么对于 $a \leq a' \leq b$ 必定存在 $a', b, c$ 可以组成三角形（由 $c - b<a \leq a'$ 证得）

那么我们可以指定如下规定：

- 对于输入的 $x$ ，我们找到两条长度分别为 $a, b$ 的边，使得 $a, b, x$ 能够组成三角形，且不存在 $a'$ 满足 $a < a' \leq b$，这里我们暂时称 $a, b$ 相邻（这点非常重要！！！）

即 $a, b$ 在整个集合排序后，在数组中的下标差为 $1$ 

接下来考虑如何找到 $a, b$。题解中提到类似分类讨论，但是我觉得没有必要。我们仅考虑通过 $a, b$ 的运算后的结果与 $x$ 来比较，最终得到我们的结果是否符合。根据 $a, b, x$ 的大小关系讨论三种情况：（前提 $a \leq b$）

1. $x$ 为最大值时，我们只需要保证 $a + b > x$ 即可
2. $a \leq x \leq b$ 时，我们需要保证 $a + x > b$ ，转换后得到 $b - a < x$
3. $x \leq a \leq b$ 时，我们需要保证 $x + a > b$ ，转换后得到 $b - a < x$

总结：我们只需要保证我们选出来的$a, b$ 保证 $a + b > x \space and \space b - a < x$。由于 $a \leq b$ 所以$b \geq x / 2$（请先记住这个结论，将会在之后用到）

接下来是解决 $a + b$ 和 $b - a$ 的数据存储和更新问题（由于询问是在线询问，而 $a, b$ 相邻，所以随着插入新的数据，这两个值都会发生变化）。

## 对于 $a + b$ 的处理：

我们将所有当前在集合中的数据进行排序，可以使用 `multiset` 来实现，但是我个人不太喜欢 `multi` 的数据结构，所以我选择了 `map` ，`first` 保存数据的值，`second` 保存了数据重复的个数。**从此开始，我们暂时不讨论重复值的情况**。对于排序好的数据，我们可以通过二分数值来得到 $x / 2$ 在数组中的哪个位置。由于 $a \leq b$ ，所以只有两种可能

 - $a < x/2 \space and \space b > x / 2$
 - $a, b \geq x / 2$

后者很好解决，只需要取值的时候，数组下标大于 $x/2$ 所在的下标位置即可。而前者因为 $a, b$ 相邻，所以我们可以使用 `upper_bound` 轻松解决（`b = *map.upper_bound(x / 2), a = *(map.upper_bound(x / 2) - 1)`）

至此，在保证数据有序的情况下，我们已经第一步缩小了数据范围，得到了一个数组下标范围 `[map.upper_bound(x / 2), map.end()]`。注意，这里的右区间始终为最大值（$INF$）

## 对于 $b - a$ 的处理

由于求算 $b - a$ 的过程本身需要排序，而上面对 $a + b$ 的处理的时候已经排完序了。所以我们能够较快的得到 $b - a$ 的值（ $a, b$ 相邻）但是此时的更新的操作过于复杂，而且我们并不需要知道哪个区间的值能够满足条件（即小于 $x$ ），我们可以只需要知道我们已经缩小后的区间内，是否**存在** $a, b$ 满足 $b - a < x$，即 $min(b - a) < x$。

区间最小值，单点更新，此时我们想到了线段树（主要是我不知道有没有动态树状数组这个感觉不太可能存在的东西，于是就写了线段树，实际上需要将线段树的空间动态化，不然空间会爆炸）。

对于整个集合，假如有 $n$ 个不同的元素，则只会产生 $n - 1$ 个不同的插值（由于 $a, b$ 相邻，每个元素只会产生一个，假定最后一个元素不产生）

那么我们建立一棵长度为 $1e9$ 的线段树，对于每个不同的==值（x）==，将其产生的差值保存在节点 $x -x$ 下，其他没有值的节点，则保持 $INF$

举一个例子，假如我们有如下值在集合中

> 1, 3, 4, 10, 123, 423

则此时得到的差值为

> 2, 1, 6, 113, 300

则我们对如下数组`a`建立线段树

```
a[1] = 2;
a[3] = 1;
a[4] = 6;
a[10] = 113;
a[123] = 300;
```
由于输入的 $1 \leq x \leq 1e9$，所以我们开不起这么大的线段树，而实际上最多只会有 $1e5$ 个叶子节点，所以线段树最多的节点个数为 $1e5 \space lg 1e5 < 1e7$，所以只需要准备 $1e7$ 个节点，然后动态开点即可满足整个线段树的需要。

至于这里为什么选择将每个差值产生的较小者（即 $a$ ）作为下标的存储位置。由于之后会遇到前面 $a + b$ 得到的区间恰好从 $a, b$ 中间穿过，如果保存的是在 $b$ 下，则会出现 $a + b < x$ 但是仍然被选出来作为 $min(b - a)$。

接下来是线段树的更新操作。

### 插入
由于值保存在较小值处，所以需要更新较小值的值，和当前新插入的节点的下的值

### 删除
由于删除操作难以实现，不如直接把被删除的点的值设置为 $INF$，以及，被删掉的点前面一个点的值需要更新

注意一下各种边界情况。

## 查询的操作
首先从已经排序好的数组中，得到 $x / 2$ 所在数组中的区间，然后拿着这个区间去找线段树，询问区间最小值，将最小值与 $x$ 比较，如果最小值比 $x$ 小，则输出 `Yes` ，否则输出 `No`

## 处理重复的数据
这里就相当简单了，对于相同的数据，只需要保证 $a + a > x$ 即可满足 $a, a, x$ 能够组成三角形。我选择再创建了一个 `set` 将所有满足个数大于等于 $2$ 的值均保存在数组中，然后去寻找是否存在 `set` 中是否存在 $a$ 满足 $a > x / 2$，则可以得到解

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

#define MAXN 8000000

const int maxn = 1e9;

struct SegTree {
    int tot;
    int sub[MAXN]; // 保存了差值
    int lson[MAXN], rson[MAXN];

    void init() {
        for (int i = 0; i < MAXN; ++i)
            sub[i] = INT_MAX;
        memset(lson, 0xff, sizeof(int) * MAXN);
        memset(rson, 0xff, sizeof(int) * MAXN);
        tot = 1;
    }

    inline void up(int cur) {
        if (lson[cur] == -1 && rson[cur] == -1) sub[cur] = INT_MAX;
        else if (lson[cur] == -1) sub[cur] = sub[rson[cur]];
        else if (rson[cur] == -1) sub[cur] = sub[lson[cur]];
        else sub[cur] = min(sub[lson[cur]], sub[rson[cur]]);
    }

    inline int getLson(int cur) {
        assert(tot < MAXN);
        if (lson[cur] == -1)
            lson[cur] = tot++;
        return lson[cur];
    }

    inline int getRson(int cur) {
        assert(tot < MAXN);
        if (rson[cur] == -1)
            rson[cur] = tot++;
        return rson[cur];
    }

    void update(int x, int value, int cur = 0, int l = 1, int r = maxn) {
        if (x == l && l == r) {
            sub[cur] = value;
            return;
        }
        int mid = (l + r) >> 1u;
        if (x <= mid) {
            update(x, value, getLson(cur), l, mid);
        } else {
            update(x, value, getRson(cur), mid + 1, r);
        }
        up(cur);
    }

    int query(int x, int y, int cur = 0, int l = 1, int r = maxn) {
        if (x == l && y == r) return sub[cur];
        int mid = (l + r) >> 1u;
        if (y <= mid) {
            return query(x, y, getLson(cur), l, mid);
        } else if (x > mid) {
            return query(x, y, getRson(cur), mid + 1, r);
        } else {
            return min(query(x, mid, getLson(cur), l, mid),
                       query(mid + 1, y, getRson(cur), mid + 1, r));
        }
    }
} segTree;

void solve() {
    int q;
    cin >> q;
    segTree.init();
    map<int, int> pool; // 当前集合中的数据
    set<int> multi;	// 用于处理重复数据
    for (int i = 0; i < q; ++i) {
        int op, x;
        cin >> op >> x;
        switch (op) {
            case 1: {
                auto iter = pool.find(x);
                if (iter != pool.end()) {
                    iter->second++;
                    if (iter->second == 2)
                        multi.insert(x);
                } else {
                    pool.insert({x, 1});
                    auto cur = pool.find(x);
                    auto lower = cur, up = cur;
                    up++;
                    if (lower != pool.begin()) {
                        lower--;
                        segTree.update(lower->first, x - lower->first);
                    }
                    if (up != pool.end()) {
                        segTree.update(x, up->first - x);
                    }
                }
            }
                break;
            case 2: {
                auto cur = pool.find(x);
                if (cur == pool.end()) break;
                cur->second--;
                if (cur->second == 1) {
                    multi.erase(x);
                } else if (cur->second == 0) {
                    auto lower = cur, up = cur;
                    up++;

                    segTree.update(x, INT_MAX);
                    if (lower != pool.begin()) {
                        lower--;
                        if (up != pool.end())
                            segTree.update(lower->first, up->first - lower->first);
                        else
                            segTree.update(lower->first, INT_MAX);
                    }

                    pool.erase(cur);
                }
            }
                break;
            case 3: {
                auto iter = pool.upper_bound(x / 2);
                if (iter == pool.end()) {  // 没有值比 x / 2 更大了，则不存在 a + b > x 了
                    cout << "No" << endl;
                    break;
                }

                auto lower = iter;
                if (lower != pool.begin()) {
                    lower--;
                    if (lower->first + iter->first <= x) {
                        lower++;
                    }
                }

                auto mu = multi.lower_bound(iter->first);
                if (mu != multi.end()) {
                    cout << "Yes" << endl;
                } else {
                    int res = segTree.query(lower->first, maxn);
                    if (res < x)
                        cout << "Yes" << endl;
                    else
                        cout << "No" << endl;
                }
            }
                break;
        }
    }
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    int test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        if (acm_local_for_debug == '$') exit(0);
        cin.putback(acm_local_for_debug);
        if (test_index_for_debug > 20) {
            throw runtime_error("Check the stdin!!!");
        }
        auto start_clock_for_debug = clock();
        solve();
        auto end_clock_for_debug = clock();
        cout << "Test " << test_index_for_debug << " successful" << endl;
        cerr << "Test " << test_index_for_debug++ << " Run Time: "
             << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "--------------------------------------------------" << endl;
    }
#else
    solve();
#endif
    return 0;
}
```
