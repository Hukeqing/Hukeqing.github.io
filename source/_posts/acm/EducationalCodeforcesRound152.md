---
title: Educational Codeforces Round#152 (Div. 2)
date: 2023-08-06 13:02:41
categories: ACM
tag:
 - ACM
 - Codeforces
math: true
---

# A. Morning Sandwich

## 大致题意

有 $a$ 个面包片，$b$ 个奶酪片，$c$ 个火腿片，要保证奶酪片和火腿片必须被两块面包片直接夹，问最多可以造多大的汉堡

## 思路

很简单，就不讲了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tss = 0; tss < _; ++tss) {
        int a, b, c;
        cin >> a >> b >> c;
        int m = min(a - 1, b + c);
        cout << m * 2 + 1 << endl;
    }
}
```

# B. Monsters

## 大致题意

有 $n$ 个怪物，每个怪物有一定生命值 $a[i]$，每次攻击一定是对着生命值最高的怪物，并减少其生命值 $k$，若有多个则选择最左边的，问怪物的死亡顺序

## 思路

当有任何怪物的生命值大于 $k$ 的时候，那就意味着不会有怪物死亡，所以可以先对所有怪物进行 `mod k` 操作

此时，就会有怪物出现死亡，因为会恰好降低到 $0$，需要先输出为 $0$ 的怪物，从左往右输出即可

后面，再根据剩余生命值从大到小，从左往右输出即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tss = 0; tss < _; ++tss) {
        int n, k;
        cin >> n >> k;
        map<int, vector<int>> res;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            tmp %= k;
            res[tmp].push_back(i);
        }
        auto zero = res[0];
        for (auto i : zero) cout << i + 1 << ' ';
        for (auto iter = res.rbegin(); iter != res.rend(); ++iter) {
            if (iter->first == 0) continue;
            for (auto i : iter->second) cout << i + 1 << ' ';
        }
        cout << endl;
    }
}
```

# C. Binary String Copying

**这题老坑人了QAQ**

## 大致题意

有一个初始字符串 $s$，仅有 `0` 和 `1` 组成。

有 $k$ 次操作，每次操作都是在这个初始字符串上进行的。每次操作选择一个区间 $[l, r]$，并使得这个区间内的值进行排序，即 $0101010 \rightarrow 0000111$

问，得到的这 $k$ 个字符串，有多少种不同的

## 思路

有点蒙，但还是得找找思路

考虑到字符串种类，第一反应是做字符串 hash，这非常简单，因为字符串仅有 `0` 和 `1`，为了方便，如果当前位为 `1` 则取这一位的权制，否则不取，这样就有点类似 $mod$ 进制数了

接下来是如何计算 $k$ 个字符串的 hash 值，根据题目给出的数据量，看起来必须在 O(sqrt(n)) 时间之内完成。我们可以发现，每次操作后实际上有三个区间

 - $[1, l)$ 和原来的 hash 值相同
 - $[l, r]$ 不知道！
 - $(r, n]$ 和原来的 hash 值相同

即然某段区间存在和之前 hash 值相同的情况，那么可以通过对 hash 值前缀和的方式，使得能够快速求出任意区间的 hash 值，那么就只剩下中间的区间了

有意思的是，排序后的值恰好是一个前面为 `0` 后面为 `1` 的字符串，所以计算单独计算这段区间内的 hash 结果非常简单，只需要有一个每一位的 hash 值的前缀和，并且知道 `1` 从哪一位开始即可，因为最后一个一定也是 `1`（当然需要排除一下压根没有 1 的情况）

而需要计算某个区间内的 `1` 的数量，好像又可以做一次前缀和

最终，只需要三个前缀和就可以简单解决问题了

但是试了两个 hash 值都不通过，一气之下直接同时计算两个 hash 值，然后就过了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tss = 0; tss < _; ++tss) {
        int n, k;
        cin >> n >> k;
        map<int, vector<int>> res;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            tmp %= k;
            res[tmp].push_back(i);
        }
        auto zero = res[0];
        for (auto i : zero) cout << i + 1 << ' ';
        for (auto iter = res.rbegin(); iter != res.rend(); ++iter) {
            if (iter->first == 0) continue;
            for (auto i : iter->second) cout << i + 1 << ' ';
        }
        cout << endl;
    }
}
```

# D. Array Painting

## 大致题意

有一段数组 $a$，每个值必定是 $0, 1, 2$ 其中一个，开始的时候所有值都是蓝色的，你可以进行如下操作

 - 选择一个蓝色的值，把它变成红色，同时支付一块钱
 - 选择一个红色的值，若其大于 $0$，则将其减少 $1$，并将一个相邻它的值改为红色

问，你最少需要支付多少钱才能把所有值变成红色

## 大致思路

容易明白的是，无论如何先随便找个 $2$ 染色的一定不亏，然后这个 $2$ 就会向两侧染色，直到遇到 $0$。那么这样处理完成后，再找下一个没有被染色的 $2$，直到 $2$ 被全部耗尽

然后是 $0, 1$ 的问题了，很明显的是，在一段连续没有被染色的区间下，可以分类讨论

 - 如果只有 $1$，那么恭喜，染色一个端点，就可以染色全部
 - 如果只有 $0$，那么就得一个个染色
 - 如果同时有 $1$ 和 $0$
     * 因为每一段连续的 $1$ 可以附带染色一个相邻的 $0$，实际上操作几个 $1$ 等于也染色了几个 $0$，所以最终结果一般还是得跟 $0$ 数量相同
     * 但是从第一条种可以得到，因为一段 $1$ 就得花费一次染色，不能只看 $0$ 的数量，例如 $101$ 这种情况下，虽然只有一个 $0$，但是 $1$ 有两端，则至少需要染色 $2$ 次（实际上就是因为第二段 $1$ 不会染色任何其他 $0$）

所以结论为，每一段没有染色的区间，需要 $max(cnt_0, cnt_part1)$ 的花费

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> data(n);
    vector<bool> vis(n, false);
    int res = 0;
    for (int i = 0; i < n; ++i) cin >> data[i];

    // 先处理 2 的情况
    for (int i = 0; i < n; ++i) {
        if (vis[i] || data[i] != 2) continue;
        res++;
        vis[i] = true;
        for (int j = i - 1; j >= 0; --j) {
            if (!vis[j]) {
                vis[j] = true;
                if (data[j] == 0) break;
            } else break;
        }
        for (; i < n; ++i) {
            vis[i] = true;
            if (data[i] == 0) break;
        }
    }

    // 再处理 1 的情况
    int last = -1;
    int zero = 0;
    int oneP = 0;
    for (int i = 0; i < n; ++i) {
        if (vis[i]) {
            res += max(oneP, zero);
            zero = 0;
            oneP = 0;
            last = -1;
        } else if (data[i] == 0) {
            zero++;
            last = 0;
        } else if (last != 1) {
            last = 1;
            oneP++;
        }
    }
    res += max(oneP, zero);

    cout << res << endl;
}
```

