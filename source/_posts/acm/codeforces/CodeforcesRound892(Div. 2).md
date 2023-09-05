---
title: Codeforces Round 892 (Div. 2)
date: 2023-08-13 19:06:11
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. United We Stand

## 大致题意

有一个数组，你需要把里面的值分成两个数组 $a, b$，保证 $a$ 数组中不存在任何一个值，除 $b$ 数组中的任何一个值后，余数为 0

## 思路

这里强制要求 $a$ 除以 $b$，而且也没有要求数量均分之类的，只要得到任意解就行。那把最大的那个值放到 $b$，剩下的都放到 $a$ 就行了，因为除以一个比你大的值，那么一定没办法除尽的

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        int mx = 0, cnt = 0;
        for (int i = 0; i < n; ++i) {
            if (data[i] == mx) cnt++;
            else if (data[i] > mx) {
                cnt = 1;
                mx = data[i];
            }
        }
        if (n == cnt) {
            cout << -1 << endl;
            continue;
        }
        cout << n - cnt << ' ' << cnt << endl;
        for (int i = 0; i < n; ++i) if (data[i] != mx) cout << data[i] << ' ';
        cout << endl;
        for (int i = 0; i < n; ++i) if (data[i] == mx) cout << data[i] << ' ';
        cout << endl;
    }
}
```

# B. Olya and Game with Arrays

## 大致题意

有 $n$ 个数组，允许你将每一个数组的其中一个值移动到另外一个数组，操作必须同时进行，即每个数字仅可以被移动一次，然后再将每个数组的最小值相加，问最大可以是多少

## 思路

首先，每次移动一个值，要使这个数组的最小值提升，那么必定是移动最小的那个值，因为只能移动一次，所以必定是最小的那个值被移动，此时整个数组的最小值就是原来的次小值了

最终所有最小值都会被移动到其他的数组，而为了避免影响到整体最终结果值，那么肯定需要移动到一个数组本来的最小值就比这个被移动过来的小的数组上，而恰好的是，那个全局最小值所在的数组也需要移动最小值，那么必然这个全局最小值都会被移动到某个特定的数组，而其他数组的最小值如果也移动到那个数组，那么一定不会产生影响

所以需要计算最小值移动到哪个数组，那么应该选择移动后影响最小的，影响就是每个数组因为移动会减少的最小值差异，和不被移动所能够变成倒数第二小值带来的增量

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, mi = LONG_LONG_MAX;
        cin >> n;
        vector<pair<int, int>> data(n);
        for (int i = 0; i < n; ++i) {
            int m, tmp;
            cin >> m;
            int u = LONG_LONG_MAX, v = LONG_LONG_MAX;
            for (int j = 0; j < m; ++j) {
                cin >> tmp;
                mi = min(mi, tmp);
                if (tmp < u) {
                    v = u;
                    u = tmp;
                } else if (tmp < v) v = tmp;
            }
            data[i] = {u, v};
        }
        int t = 0;
        for (int i = 0; i < n; ++i) {
            int cur = (data[i].second - data[i].first) + (data[i].first - mi);
            int lst = (data[t].second - data[t].first) + (data[t].first - mi);
            if (cur < lst) t = i;
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            if (i == t) ans += mi;
            else ans += data[i].second;
        }
        cout << ans << endl;
    }
}
```

# C. Another Permutation Problem

## 大致题意

一个 $n$ 的排列数组，将每一个值和它的下标（从 $1$ 开始）相乘，然后去掉最大的值之后求和，问在哪种排列下，这个求和的值最大可以是多少，不需要计算出具体的数组，只需要给出结果就行了

## 思路

因为数据量级很小，所以可以暴力扫

假定当前计算乘积完成后，所有结果数中最大值为 $x$，然后从大到小遍历每一个值，计算出此时每个值下标可以是多少，尽可能取较大的，就可以算出当前情况下的结果是多少

然后暴力扫所有可能的最大值就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;

        int ans = 0;
        auto cal = [&](int mx) {
            int total = 0, big = 0;
            set<int> s;
            for (int i = 1; i <= n; ++i) s.insert(i);
            for (int i = n; i > 0; --i) {
                int mi = mx / i;
                auto iter = s.upper_bound(mi);
                if (iter == s.begin()) return;
                iter--;
                total += *iter * i;
                big = max(big, *iter * i);
                s.erase(iter);
            }
            ans = max(ans, total - big);
        };

        int mi = ((n + 1) / 2) * ((n + 2) / 2);
        for (int i = 1; i <= n; ++i) {
            for (int j = (mi + i - 1) / i; j <= n; ++j) {
                int maxValue = i * j;
                cal(maxValue);
            }
        }
        cout << ans << endl;
    }
}
```

# D. Andrey and Escape from Capygrad

## 大致题意

有一条射线，起点是 $0$

射线上有一些传送门，对于每一个传送门，可以用四个数字表示 $l, r, a, b$，表示如果你在 $[l, r]$ 这个区间内的话，就可以传送到 $[a, b]$ 这个区间的任意一个位置。问从某个点开始，可以使用无限次数传送门，最远可以到哪里

强调，对于任意一个传送门，都满足 $l \leq a \leq b \leq r$

## 思路

很明显的是，实际上只有 $[l ,b]$ 这段传送门是有意义的，因为对于 $[b, r]$ 这段，实际上进入这个传送门之后，只能回到更小的值。当然有人可能会担心，是不是存在可以通过回到更小的值，导致可以进入实际上能够传送到更远的传送门了。假定当前传送门为 $l\_0, r\_0, a\_0, b\_0$ 另外一个可以进入且更好的传送门为 $l\_1, r\_1, a\_1, b\_1$，当前位置为 $x$，根据给出的现象可以得到 $b\_0 < b\_1$，且 $l\_1 \leq b\_0$，且 $b\_0 < x \leq r\_0$，这样才能满足进入之后能够进入到另外一个传送门，且更远。但是根据题意又可以得到 $b\_0 \leq r\_0$，所以组合上述的表达式就可以得到 $l\_1 \leq b\_0 \leq x \leq r\_0$ 此时 $x$ 明明可以直接进入第二个传送门，压根不需要回来绕一下

明确这一点后，只需要维护所有传送门的 $l, b$ 这两个节点即可 $l$ 表示进入的节点，$b$ 表示出去的节点，做 hash 后按照从大到小的下标遍历，维护当前下标涉及到的传送门，若当前时间内有任何传送门，则进入，否则留在原地，若当前所有传送门都已经结束了，那么还在传送门中的都需要出来

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, q;
        cin >> n;
        vector<pair<int, pair<int, int>>> event;
        event.reserve(4 * n);
        for (int i = 0; i < n; ++i) {
            int l, r, a, b;
            cin >> l >> r >> a >> b;
            event.push_back({l, {1, i}});
            event.push_back({b, {2, i}});
        }
        cin >> q;
        event.reserve(4 * n + q);
        for (int i = 0; i < q; ++i) {
            int tmp;
            cin >> tmp;
            event.push_back({tmp, {3, i}});
        }

        sort(event.begin(), event.end());

        vector<int> ans(q);
        stack<int> query;
        set<int> len;
        for (auto &item: event) {
            switch (item.second.first) {
                case 1:
                    len.insert(item.second.second);
                    break;
                case 2:
                    len.erase(item.second.second);
                    if (len.empty()) {
                        while (!query.empty()) {
                            ans[query.top()] = item.first;
                            query.pop();
                        }
                    }
                    break;
                case 3:
                    if (len.empty()) ans[item.second.second] = item.first;
                    else query.push(item.second.second);
                    break;
            }
        }

        for (auto &item: ans) cout << item << ' ';
        cout << endl;
    }
}
```