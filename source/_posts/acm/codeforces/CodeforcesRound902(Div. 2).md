---
title: Codeforces Round 902 (Div. 2, based on COMPFEST 15 - Final Round)
date: 2023-10-29 22:01:49
updated: 2023-10-29 22:01:49
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
---

# A. Goals of Victory

## 大致题意

有 $n$ 只队伍，所有队伍两两对战，两个队伍因此得分之和一定为 0。将每个队伍的所有得分之和相加，现在已知其中 $n-1$ 个队伍的得分情况，问最后一个队伍的得分情况是

## 思路

简单题，说白了就是所有人分数之和肯定是 $0$，那就把剩下的人都加起来，取负数就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int tot = 0;
        for (int i = 0; i < n - 1; ++i) {
            int tmp;
            cin >> tmp;
            tot += tmp;
        }
        cout << -tot << endl;
    }
}
```

# B. Helmets in Night Light

## 大致题意

村长需要通知村里的所有人一个消息，村长每通知一个人，就要花费 $k$ 的成本，而听到消息的村民也可以相互通知，每个村民最多再通知 $a\_i$ 个其他村民，同时每通知一个其他村民就要花费 $b\_i$ 的费用，问最少的费用

## 思路

村长可以无限通知，但是成本固定，所以能让成本低的村民通知的情况下，村长只需要通知一次即可，当成本低的村民的通知机会都用完了之后，剩下的都村长通知一下就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, p;
        cin >> n >> p;
        vector<pair<int, int>> data(n);
        for (auto &i: data) cin >> i.second;
        for (auto &i: data) cin >> i.first;
        int cost = p, cnt = 1;
        sort(data.begin(), data.end());
        for (auto &i: data) {
            if (i.first >= p) break;
            int c = min(n - cnt, i.second);
            cnt += c;
            cost += c * i.first;
            if (cnt == n) break;
        }
        cost += p * (n - cnt);
        cout << cost << endl;
    }
}
```

# C. Joyboard

## 大致题意

有一个数组 $a$，其长度为 $n+1$，现在需要往第 $n+1$ 这个位置上放上一个在 $[0, m]$ 的整数，然后对于每一个 $a\_i = a\_{i+1} % i$ 问，如果希望整个数组中恰好有 $k$ 种不同的数字，则 $n+1$ 这个位置上的选择有多少

## 思路

首先，无论最终填上的值有多大，最终只要经过第一层 $mod$ 操作后，其值一定在 $[0, n)$ 之间了，且经历第二次 $mod$ 操作后，一定会变成 $0$（因为计算是从大到小进行计算的，所以一定会遇到相同的值，否则都是大于当前值的，不会改变 $mod$ 的结果）。所以最终一定最多只能存在 $3$ 个不同的数字。

那么什么时候为 $1$ 个呢，也很简单，因为最终一定为 $0$，故开始值也必须为 $0$

然后是两个的情况，那么如果我一开始的值就是在 $[0, n)$ 之内，那么必然也可以满足，因为遇到的第一个可以 $mod$ 的值就是它自己

但是要考虑一种特殊情况，那就是恰好是 ${n, 2 \times n, 3 \times n \dots}$ 的情况，因为虽然不在 $[0, n)$ 之内，但是第一次 $mod$ 会直接变成 $0$

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k;
        cin >> n >> m >> k;
        if (k == 1) cout << 1 << endl;
        else if (k == 2) cout << min(m, n) + (m > n ? (m / n) - 1 : 0) << endl;
        else if (k == 3) cout << max(0, m - n) - (m > n ? (m / n) - 1 : 0) << endl;
        else cout << 0 << endl;
    }
}
```

# D. Effects of Anti Pimples

## 大致题意

有一个数组 $a$，开始的时候都是白色，每次可以任意选择一个或者几个数字，将其染上黑色。然后将每个黑色的位置下标的倍数处，染成绿色。最后从不是白色的块中选出值最高的。问所有的选择情况下，所有得到的值之和是多少

## 思路

看起来很简单，但是实际上也非常简单的题

如果一个值被染成黑色，那么其能够带来的效果是确定的，即其倍数上的节点中最大的那个，我们将其先成为可能最大值

接下来是统计每个最大值的出现的次数，简单来说就是相同的可能最大值中挑选任意几个（至少一个），然后在剩下的可能最大值小于当前值中挑选 $0$ 个或者多个即可，即 $\sum_{i=1}^{t} \binom{i}{t} * \sum_{i=0}^{n-t} \binom{i}{n-t}$

而这里的求和又非常的简单，因为 $\sum_{i=0}^{x} \binom{i}{x} = 2^x$，所以，就非常简单了

## AC code

```cpp
#define int long long

void solve() {
    const int mod = 998244353;
    vector<int> c0(1e5+10), c1(1e5+10);
    c0[0] = 1;
    c1[0] = 0;
    for (int i = 1; i < c0.size(); ++i) {
        c0[i] = (c0[i - 1] * 2) % mod;
        c1[i] = (c0[i] + mod - 1) % mod;
    }

    int n;
    cin >> n;
    vector<int> data(n), top(n);
    for (auto &i: data) cin >> i;
    for (int i = 0; i < n; ++i) {
        top[i] = data[i];
        for (int j = i + 1; j <= n; j += i + 1)
            top[i] = max(top[i], data[j - 1]);
    }
    map<int, int> cnt;
    for (auto &i: top) cnt[i]++;
    int last = n, ans = 0;
    for (auto iter = cnt.rbegin(); iter != cnt.rend(); ++iter) {
        last -= iter->second;
        ans = (ans + ((iter->first * ((c1[iter->second] * c0[last]) % mod)) % mod)) % mod;
    }
    cout << ans << endl;
}
```
