---
title: Codeforces Round#889 (Div. 2)
date: 2023-8-5 10:37:43
tag:
 - ACM
 - Codeforces
math: true
---

**退役入职后的首次刷题，确实感觉对题目的敏感度下降了很多**

# A. Dalton the Teacher

## 题面概要

有一个长度为 $n$ 的打乱序列 $a$，每次操作可以将 $a[i]$ 和 $a[j]$ 进行交换位置，问至少多少次操作才能让满足 $\forall i \in [1, n], i \ne a[i]$

## 思考

因为每次操作会影响到两个位置的值，而本身已经满足条件的可以不用操作，故结果就是 $\left \lceil x / 2 \right \rceil $ 其中 $x$ 为仍然不满足条件的位置数量

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int cnt = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp == i + 1) cnt++;
        }
        cout << (cnt + 1) / 2 << endl;
    }
}
```

# B. Longest Divisors Interval

## 题面概要

一个大的整数 $n$，找到一个区间 $[l, r]$，满足 $\forall x \in [l, r], n mod x = 0$，求出最大的 $r - l + 1$

## 思考

因为一连串的数字，很容易产生很多大量的互质数，导致如果要满足条件的话，则需要非常非常大的值。因此，考虑互质数出现频率最低的区间，即从 $1$ 开始的区间，可以用测试代码得到，$[1, 100]$ 的情况下，目标值最小为 $9223372036854775807$

```cpp
void solve() {
    map<int, int> cnt;
    for (int i = 1; i < 100; ++i) {
        for (int j = 1; j <= i / 2; ++j) {
            if (i % j == 0) {
                cnt[j]++;
            }
        }
    }
    int res = 1;
    for (auto item : cnt) {
        res *= pow(item.first, item.second);
    }
    cout << res << endl;
}
```

所以最大区间长度不可能超过 100

我们假定此区间为 $[l, r]$，满足 $r - l + 1 = n$，那么我们容易得到，$\forall i \in [1, n], \exists j \in [l, r], j % i == 0$

而这个公式说明了，假定存在 $[l, r], l \ne 1$ 满足 $\forall x \in [l, r], n mod x = 0$上述条件，那么同时必然满足 $\forall x \in [1, r - l + 1], n mod x = 0$

所以我们只需要考虑从 $1$ 开始的区间内，最大能够满足到哪个值即可，此时得到的一定是最优解

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int cnt = 0;
        for (int i = 1; i <= 100; ++i) {
            if (n % i == 0) {
                cnt++;
            } else {
                break;
            }
        }
        cout << cnt << endl;
    }
}
```

# C2. Dual (Hard Version)

题意完全一致，就直接做 Hard Version 了

## 题面概要

有 $n (n \leq 20)$ 个值的序列 $a$，每个值都在 $[-20, 20]$ 内，每次操作可以选择任意两个值，进行 $a[i] += a[j], i \in [1, n], j \in [1, n]$。求出一种可行的解，最多进行 31 次操作，使得整个序列不存在非递减对，即满足 $\forall i \in [1, n - 1], a[i] \leq a[i + 1]$

## 思路

最简单的方式就是将所有值变成非负数，做一次前缀和，或者所有值变成非正数，然后做一次后缀和。两种方案思路是完全相同的，最差情况下都需要 $n - 1$ 步操作

接下来就是需要考虑如何将所有值变成非负数（非正数，下同，后续只强调非负数）

如果需要将所有值变成非负数，前提是必须要有一个正数（不考虑都是 0 的情况，可以特判解决），需要在这个前提下考虑才有意义

那么最简单的方式就是将最大的正数通过累加的方式实现幂次放大，直到和最小值相加也能满足大于等于 $0$ 即可。此时可以得到最终需要的操作数：$n - 1 + \left \lceil log_2 \frac{abs(maxValue)}{abs(minValue)} \right \rceil + cnt_-$（其中的 $cnt_-$ 表示负数个数）


同样，可以得到非正数需要的操作数 $n - 1 + \left \lceil log_2 \frac{abs(minValue)}{abs(maxValue)} \right \rceil + cnt_+$（其中的 $cnt_+$ 表示负数个数）

最终，我们可以取其中的较小值，得到公式

$$
\begin{align}
= & min(n - 1 + \left \lceil log_2 \frac{abs(maxValue)}{abs(minValue)} \right \rceil + cnt_-, n - 1 + \left \lceil log_2 \frac{abs(minValue)}{abs(maxValue)} \right \rceil + cnt_+) \\
\leq & n - 1 + min(\left \lceil log_2 \frac{abs(maxValue)}{abs(minValue)} \right \rceil + cnt_-, \left \lceil log_2 \frac{abs(minValue)}{abs(maxValue)} \right \rceil + n - cnt_-) \\
= & n - 1 + min(\left \lceil log_2 abs(maxValue) - log_2 abs(minValue) \right \rceil + cnt_-, \left \lceil log_2 abs(minValue) - log_2 abs(maxValue) \right \rceil + n - cnt_-) \\
= & \begin{cases}
n - 1 + min(\left \lceil log_2 abs(maxValue) - log_2 abs(minValue) \right \rceil + cnt_-, 0 + n - cnt_-), abs(maxValue) >= abs(minValue) \\ 
n - 1 + min(0 + cnt_-, \left \lceil log_2 abs(minValue) - log_2 abs(maxValue) \right \rceil + n - cnt_-), abs(maxValue) <= abs(minValue)
\end{cases} \\
\leq & \begin{cases}
n - 1 + min(5 + cnt_-, 0 + n - cnt_-)\\ 
n - 1 + min(0 + cnt_-, 5 + n - cnt_-)
\end{cases} \because max(log_2 abs(maxValue) - log_2 abs(minValue)) = max(log_2 abs(minValue) - log_2 abs(maxValue)) \leq 5(2^5 = 32 > 20) \\
\leq & \begin{cases}
20 - 1 + min(5 + cnt_-, 20 - cnt_-) \\ 
20 - 1 + min(cnt_-, 5 + 20 - cnt_-)
\end{cases} \\
= & \begin{cases}
19 + min(5 + cnt_-, 20 - cnt_-) \\ 
19 + min(cnt_-, 25 - cnt_-)
\end{cases} \\
\leq & \begin{cases}
19 + 12 \\ 
19 + 12
\end{cases} \because \left \lceil cnt_- \right \rceil = cnt_- \\
= & 31
\end{align}
$$

求的上述方法最大操作次数一定满足要求

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

        int maxIndex = 0;
        int minIndex = 0;
        int maxValue = data[0];
        int minValue = data[0];
        for (int i = 0; i < n; ++i) {
            if (maxValue <= data[i]) {
                maxValue = data[i];
                maxIndex = i;
            }
            if (minValue > data[i]) {
                minValue = data[i];
                minIndex = i;
            }
        }

        if (maxValue == minValue) {
            cout << 0 << endl;
            continue;
        }

        if (maxValue > 0) {
            vector<int> copy = data;
            vector<pair<signed, signed>> op;
            while (maxValue + minValue < 0) {
                copy[maxIndex] += maxValue;
                maxValue += maxValue;
                op.emplace_back(maxIndex, maxIndex);
            }
            for (int i = 0; i < copy.size(); ++i) {
                if (copy[i] < 0) {
                    copy[i] += maxValue;
                    op.emplace_back(i, maxIndex);
                }
            }
            for (int i = 1; i < copy.size(); ++i) {
                if (copy[i] < copy[i - 1]) {
                    copy[i] += copy[i - 1];
                    op.emplace_back(i, i - 1);
                }
            }
            if (op.size() <= 31) {
                cout << op.size() << endl;
                for (auto o : op) {
                    cout << o.first + 1 << ' ' << o.second + 1 << endl;
                }
                continue;
            }
        }

        if (minValue < 0) {
            vector<int> copy = data;
            vector<pair<signed, signed>> op;
            while (maxValue + minValue > 0) {
                copy[minIndex] += minValue;
                minValue += minValue;
                op.emplace_back(minIndex, minIndex);
            }
            for (int i = 0; i < copy.size(); ++i) {
                if (copy[i] > 0) {
                    copy[i] += minValue;
                    op.emplace_back(i, minIndex);
                }
            }
            for (int i = (int)copy.size() - 2; i >= 0; --i) {
                if (copy[i] > copy[i + 1]) {
                    copy[i] += copy[i + 1];
                    op.emplace_back(i, i + 1);
                }
            }
            if (op.size() <= 31) {
                cout << op.size() << endl;
                for (auto o : op) {
                    cout << o.first + 1 << ' ' << o.second + 1 << endl;
                }
                continue;
            }
        }
    }
}
```

# D. Earn or Unlock

## 大致题意

有一个数组 $a$，长度为 $n$，其中所有数字都是锁定状态，仅第一个（最左边的）是解锁状态。

你必须从左往右遍历这个数组，然后对于当前的值，如果是锁定状态，则结束，否则你可以选择

1. 获得等同于当前值的分数
2. 从左往右依次解锁 m 张锁定状态的值，m 为当前值，直到所有值都被解锁

## 思路

假如最终解锁了 x 个值（数组长度无限的情况下考虑）那么最终的分数为 $prefixSum(x) - x + 1$，因为有 $x - 1$ 的分数被用来解锁了

可以发现，如果能够明确最终解锁的位置，那么就可以确定分数，而并不需要去关注到底哪些值用来解锁了，哪些值用来记分了

考虑 dp 的方式解决，定义 `dp[i]` 表示从第一位到第 $i$ 位时，能够解锁 `dp[i]` 内的所有位置的集合，那么可以得到状态转移公式 $dp[i + 1] = dp[i] \cup (dp[i] + a[i]) - i$，即下一个位置能够解锁到的位置就是当前能够解锁到的位置*并*如果当前值作为解锁使用能够到达的位置，再去除掉当前位置，毕竟不能回头走

由于可以解锁过头，为了方便计算，故需要 dp 的范围是 $max(a[i]) + n$

用 `bitset` 维护最终可以解锁到的位置即可

## AC code

```cpp
void solve() {
    const int N = 2e5 + 10;

    int n;
    cin >> n;
    vector<int> data(n);
    for (int i = 0; i < n; ++i) cin >> data[i];

    bitset<N> bit;
    bit.set(0, true);
    int res = 0;
    int prefix = 0;
    for (int i = 0; i < n * 2; ++i) {
        if (i < n) {
            prefix += data[i];
        }

        if (bit.test(i)) {
            res = max(res, prefix - i);
        }

        if (i < n) {
            bit |= bit << data[i];
            bit.set(i, false);
        }
    }

    cout << res << endl;
}
```
