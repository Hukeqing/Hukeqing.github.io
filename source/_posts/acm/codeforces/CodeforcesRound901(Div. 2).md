---
title: Codeforces Round 901 (Div. 2)
date: 2023-10-29 00:30:02
updated: 2023-10-29 00:30:02
categories: 
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
---

*最近双十一加班严重，难得有一个完整的周末假期，来写点题稍微恢复一下脑子吧*

# A. Jellyfish and Undertale

## 大致题意

有一个炸弹，有倒计时在缓慢减少，你有 $n$ 个道具，每次你可以花费 1s 的时间来使用，使得倒计时增加 $v\_i$
秒，但是由于一些故障，每次加完后，不能超过上限 $a$，否则就会变成 $a$。问最多可以让炸弹坚持到几秒

## 思路

注意操作可以是任何时候进行的，所以当每次只剩下 1s 的时候操作就是最好的，不然就炸了，因为是先完成加时间，再扣除当前操作的
1s，故只需要考虑每个都在 1s 的时候操作即可，即对每个值取 $min(v\_i, a - 1)$ 然后求和就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, n;
        cin >> a >> b >> n;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            b += min(tmp, a - 1);
        }
        cout << b << endl;
    }
}
```

# B. Jellyfish and Game

## 大致题意

A 有 $n$ 个苹果，每个都有重量，B 有 $m$ 个，每次交换，A 或者 B 可以选择自己的一个苹果给对方，同时从对方那边拿来一个苹果，两人都希望自己的苹果重量之和最大，问依次交换
$x$ 次后，$A$ 的苹果重量之和是多少

## 思路

模拟就行了，说白了交换了两次之后，就是纯粹的互换相同的那两个苹果，只需要考虑最开始的两次即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<int> a(n), b(m);
        for (auto &i: a) cin >> i;
        for (auto &i: b) cin >> i;
        auto sort_all = [&]() {
            sort(a.begin(), a.end());
            sort(b.begin(), b.end());
        };
        sort_all();
        if (a.front() < b.back()) {
            swap(a.front(), b.back());
        }
        if (k >= 2) {
            sort_all();
            if (b.front() < a.back()) {
                swap(b.front(), a.back());
            }
            if (k % 2) {
                sort_all();
                if (a.front() < b.back()) {
                    swap(a.front(), b.back());
                }
            }
        }
        int tot = 0;
        for (auto &i : a) tot += i;
        cout << tot << endl;
    }
}
```

# C. Jellyfish and Green Apple

## 大致题意

有 $n$ 个苹果，要平均分给 $m$ 个人，每次可以把一片苹果平均切成两份，问至少要切几刀才能平分

## 思路

其实是一个小数二进制问题，根据小数二进制方式去解决，从高位开始，一步步减去需要的苹果块，每一步减完之后，就可以将剩下来的苹果块全部对切开，因为不会再用到更大的苹果块了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        n %= m;
        if (n == 0) {
            cout << 0 << endl;
            continue;
        }
        // check m is or not the power of 2
        int tmp = gcd(m, n);
        tmp = m / tmp;
        bool flag = true;
        while (tmp != 1) {
            if (tmp % 2 == 1) {
                flag = false;
                break;
            }
            tmp >>= 1;
        }
        if (!flag) {
            cout << -1 << endl;
            continue;
        }

        int ans = n;
        n <<= 1;
        while (n) {
            n %= m;
            ans += n;
            n <<= 1;
        }

        cout << ans << endl;
    }
}
```

# D. Jellyfish and Mex

## 大致题意

有一个数组，每次可以从中删除一个值，然后得到对应的 $mex$，问直到整个数组被完整删除后，所有得到的 $mex$，相加最小可能是多少

## 思路

举个例子来看

> 0 0 0 1 1 2 3 3 3 4 4 4 5 5 5

首先要让 $mex$ 尽可能小，那么就应该尽量挑小的开始删除，显然，如果我把 $0$ 删除完那就会使得后面所有的操作都是无代价的，即随便删的
$mex$ 都是 $0$。但是直接删除 $0$ 的代价非常大，因为前两次删除都会导致代价为 $6$ 的 $mex$。这是因为 $0$ 出现了 $3$ 次。如果我们先删除
$2$，然后再删除 $0$ 那么就会发现，只需要额外增加 $2$ 的代价，就能让后面删除 $0$ 的两次操作的代价从 $6$ 减少到 $2$。

所以可以得到，我们尽量应该删除越少越小的值，即如果值增加的情况下，数量还不减少，那么肯定没有必要优先做删除了，可以等 $mex$ 变成
$0$ 之后再动手。而对于这些值，当然也应该从较大者开始删除，这样可以尽快减小 $mex$
的值（因为在上面的前提下，最大值的出现次数一定比较小值少）但是不能每个值都要操作，例如例子中的 $1$
就是不需要操作的，即使其恰好在这条单调栈上，即需要从一个序列中取出最优的子序列

我们考虑最多会出现多少个这样的需要考虑的数字，假设刚好递减的情况，且数量为 $n$，那么总占用的数字数量就是 $n * (n + 1) /
2$。故对于长度为 $5000$ 的数组，实际上 $n < 100$。即 $n^2$ 暴力去找子序列是可以的

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        map<int, int> mp;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mp[tmp]++;
        }

        int mex = 0;
        while (mp.count(mex)) mex++;

        if (mex == 0) {
            cout << 0 << endl;
            continue;
        }

        vector<pair<int, int>> data;
        for (auto &iter: mp) {
            if (iter.first > mex) break;
            if (data.empty() || data.back().second > iter.second)
                data.emplace_back(iter);
        }
        reverse(data.begin(), data.end());
        vector<int> dp(data.size());
        for (int i = 0; i < data.size(); ++i) {
            dp[i] = (data[i].second - 1) * mex + data[i].first;
            for (int j = 0; j < i; ++j)
                dp[i] = min(dp[i], (data[i].second - 1) * data[j].first + data[i].first + dp[j]);
        }

        cout << dp.back() << endl;
    }
}
```
