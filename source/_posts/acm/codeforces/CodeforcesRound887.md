---
title: Codeforces Round 887 (Div. 2)
date: 2023-09-09 23:05:21
updated: 2023-09-09 23:05:21
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Desorting

## 大致题意

有一个非递减数列，每次可以选择一个下标 $i$，使得 $\forall i \in [1, i], a\_i \rightarrow a\_i + 1$，同时 $\forall i \in [i + 1, n], a\_i \rightarrow a\_i - 1$

问最少需要几次操作

## 思路

简单题，找到差一点最小的，和 $2$ 做向上取整的除法就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, last, diff = INT_MAX;
        cin >> n;
        cin >> last;
        for (int i = 0; i < n - 1; ++i) {
            int tmp;
            cin >> tmp;
            diff = min(diff, tmp - last);
            last = tmp;
        }

        cout << max(0, (diff + 2) / 2) << endl;
    }
}
```

# B. Fibonaccharsis

## 大致题意

有一个 $k$ 的长度的数组，已知 $a\_k = n$，问这个数组满足斐波那契数列的种数有多少

## 思路

在长度较长的情况下，$k \le n$ 是显然的，那么就可以排除掉一些

然后暴力计算出，假定初项 $x, y$，计算 $n = ax + by$ 中的 $a, b$，然后在暴力遍历所有可能即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        if (k >= n && k > 10) {
            cout << 0 << endl;
            continue;
        }

        int x[3] = {0, 1, 0}, y[3] = {0, 0, 1};
        for (int i = 2; i < k; ++i) {
            x[0] = x[1];
            x[1] = x[2];
            y[0] = y[1];
            y[1] = y[2];

            x[2] = x[0] + x[1];
            y[2] = y[0] + y[1];
        }

        int tx = x[2], ty = y[2], ans = 0;
        for (int i = 0; i < n; ++i) {
            if (tx * i > n) break;
            if ((n - tx * i) % ty == 0 && (n - tx * i) / ty >= i) ans++;
        }
        cout << ans << endl;
    }
}
```

# C. Ntarsis' Set

## 大致题意

有一个无限长的数组，然后每次报数然后去掉其中一部分，去掉的报数下标为给出的 $a$ 数组，总共进行 $k$ 轮，问最终剩下的第一个值是原来下标多少的

## 思路

模拟一下，假设 $a = [1, 5, 10]$，且 $k$ 无限大，那么可以得到

| 下标 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 被去掉的报数 | 1 | 1 | 1 | 1 | 5 | 1 | 5 | 1 | 5 | 10 | 1 | 5 | 10 | 1 | 5 | 10 | 1 | 5 | 10 | 1 |

规律就是当只有一个值的时候，都是 `1` 的循环，然后两个值的时候变成两个值的循环，依次类推。

因为每次 `1` 就意味着一个新的开始，所以当 `1` 不能再覆盖的地方就是答案

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        int j = 0, x = 1;
        while (k--) {
            while (j < n && a[j] <= x + j) j++;
            x += j;
        }

        cout << x << endl;
    }
}
```

# D. Imbalanced Arrays

## 大致题意

给出一个数组 $a$，长度为 $n$，构造一个数组 $b$，其长度为 $n$，使得满足如下条件

 - $\forall i \in [1, n], -n \leq b\_i \leq n$
 - $\forall i \in [1, n], j \in [1, n], b\_i + b\_j \neq 0$
 - 对于 $i$，计算 $\forall j \in [1, n]$，满足 $b\_i + b\_j > 0$ 的数量恰好为 $a\_i$

## 思路

我也不知道咋过的，只是冥冥之中写了这个构造方案，过了，但是实在没能证明出来我是怎么对的

为了满足第一条和第二条，定下一个简答的原则：$b$ 数组的每一项取 $abs$ 后，得到的新数组恰好是 $n$ 的排列，这样可以直接满足前两项了

而后根据 $a$ 的大小，从大到小排序后遍历，如果当前值和上一个值相同，那么就取上一个值 $-1$，否则再减去它们两个值的差值（因为中间这些跳过的值肯定是负数，这样恰好可以满足对应的整数部分的要求），直到试图给当前值赋值为非正整数时，停止即可

然后再根据 $a$ 的大小，从小到大排序后遍历，取出剩下没有给的值中最大的，将其变成负值后就是对应的值，同时验证一下是否准确，若不准确就是无解

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        vector<int> ans(n);

        vector<int> usePos;
        set<int> notUse;
        for (int i = 1; i <= n; ++i) notUse.insert(i);
        vector<pair<int, int>> sorted(n);
        for (int i = 0; i < n; ++i) sorted[i] = {data[i], i};
        sort(sorted.begin(), sorted.end(), greater<>());
        int cur = n, last = n;
        for (auto &item: sorted) {
            cur -= last - item.first;
            if (cur <= 0) break;
            ans[item.second] = cur;
            notUse.erase(cur);
            usePos.push_back(cur);
            --cur;
            last = item.first;
        }
        sort(usePos.begin(), usePos.end(), greater<>());
        sort(sorted.begin(), sorted.end());
        int i = 0;
        bool flag = true;
        for (auto iter = notUse.rbegin(); iter != notUse.rend(); ++iter) {
            int cnt = int(upper_bound(usePos.begin(), usePos.end(), *iter, greater<>()) - usePos.begin());
            if (cnt != sorted[i].first) {
                flag = false;
                break;
            }
            ans[sorted[i].second] = -*iter;
            i++;
        }
        if (!flag) {
            cout << "NO" << endl;
            continue;
        }

        cout << "YES" << endl;
        for (auto &item : ans) cout << item << ' ';
        cout << endl;
    }
}
```
