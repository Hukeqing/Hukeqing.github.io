---
title: Codeforces Round 897 (Div. 2)
date: 2023-09-23 00:33:36
updated: 2023-09-23 00:33:36
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. MEXanized Array

## 大致题意

构造一个数组，其长度为 $n$，最大值为 $x$，$MEX$ 为 $k$，问这个数组的所有值的和最大是多少

## 思路

简单题，在 $k > x + 1$ 或 $n < k$ 的场景下无解（不可能构造一个 $MEX$ 不可达的数组），然后就随便构造就行了，保证 $MEX$ 之后，剩下所有值取最大就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k, x;
        cin >> n >> k >> x;
        if (k > x + 1 || n < k) {
            cout << -1 << endl;
            continue;
        }
        int sum = 0;
        for (int i = 0; i < k; ++i) sum += i;
        for (int i = k; i < n; ++i) sum += (x == k ? x - 1 : x);
        cout << sum << endl;
    }
}
```

# B. Friendly Arrays

## 大致题意

给出两个数组 $a, b$，允许选择任意次的 $b$ 数组中的任意一个 $b\_j$，然后让 $\forall i \in [1, len(a)], a\_i = a\_i | b\_j$，问最终得到的数组 $a$ 中所有的异或和最大和最小的可能

## 思路

某个比特为是 $1$ 的情况下，在奇数个值异或和的结果则也是 $1$，而偶数个则为 $0$。而或运算可以让 $a$ 数组的每一个值的某些个位都变成 $1$。基于此，只需要关心 $a$ 的长度即可，若 $a$ 为奇数，那么选尽可能多的 $b$ 使得每个位都尽可能是 $1$，反之则尽可能不选，这样才能达到最大，同理可以得到最小的方案

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        int sa = 0, sb = 0, tmp;
        for (int i = 0; i < n; ++i) {
            cin >> tmp;
            sa ^= tmp;
        }
        for (int i = 0; i < m; ++i) {
            cin >> tmp;
            sb |= tmp;
        }
        cout << (n % 2 ? sa : sa & ~sb) << ' ' << (n % 2 ? sa | sb : sa) << endl;
    }
}
```

# C. Colorful Table

## 大致题意

有一个数组 $a$，长度为 $n$，然后有一个对应的矩阵 $b$，为 $n \times n$，其每一个位置的值 $b\_{i,j}=min(a\_i, a\_j)$

问对于每个数字 $x$，在矩阵 $b$，中能够找到对应一个最小的矩形，此矩形包含了所有出现 $x$ 的位置，求出这个矩形的大小

## 思路

对于任意一个值，假定其第一次在 $a$ 中出现的位置为 $i$，它第一次出现在 $b$ 地点一定是 $b\_{i,i}$，同时其最后一次在矩阵中的位置一定是 $b\_{j,j}$，其中 $j$ 是在数组 $a$，中出现的，最后一个比当前值更大的下标

根据上面的规律，可以求出实际上每个值的位置，一定可以包裹比他大的那个值对应的矩阵，所以只需要根据值的大小排序一下他们在数组中第一次出现的位置，和最后一次出现的位置，然后从大到小遍历，保证小的值的区间能够覆盖到大的值的区间即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<bool> flag(k, false);
        vector<pair<int, int>> data(k, {-1, -1});
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            data[tmp - 1].first == -1 ? data[tmp - 1].first = data[tmp - 1].second = i : data[tmp - 1].second = i;
            flag[tmp - 1] = true;
        }
        for (int i = k - 2; i >= 0; --i) {
            data[i].first = !flag[i] ? data[i + 1].first : (data[i + 1].first != -1 ? min(data[i].first, data[i + 1].first) : data[i].first);
            data[i].second = !flag[i] ? data[i + 1].second : (data[i + 1].first != -1 ? max(data[i].second, data[i + 1].second) : data[i].second);
        }
        for (int i = 0; i < k; ++i)
            cout << (!flag[i] ? 0 : (data[i].second - data[i].first + 1) + (data[i].second - data[i].first + 1)) << ' ';

        cout << endl;
    }
}
```

# D. Prefix Purchase

## 大致题意

有一个初始数组，每一个值都是 $0$，每次你可以选择花费 $c\_i$ 元，使得这个数组前 $i$ 个元素加一，最多只能花费 $k$ 元，问能够得到最大字典序的数组是什么

## 思路

首先需把 $c$ 的值进行单调递增栈处理一下，毕竟价格相同或更低的同时 $i$ 更大肯定有优势

回到题目中的字典序，意味着只有越前面的值越大即可，所以要尽可能满足最前面的值最大，所以直接把 $k$ 丢给处理后的第一个值，看看最多第一个值可以到多少

处理完成第一个值后，那就意味着后面无论怎么贪心，第一个值一定要达到这个，否则肯定不如现在更好。另外，对于字典序而言，约前面的值价值越高，所以要尽可能让前面的值大，贪心一下即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n;
        vector<pair<int, int>> data;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            while (!data.empty() && data.back().first >= tmp) data.pop_back();
            data.emplace_back(tmp, i);
        }
        data.emplace_back(INT_MAX, n - 1);
        cin >> k;
        vector<int> ans(data.size());
        ans[0] = k / data.front().first;
        k %= data.front().first;
        for (int i = 1; i < data.size(); ++i) {
            int diff = data[i].first - data[i - 1].first;
            if (k < diff) {
                break;
            }
            ans[i] = min(ans[i - 1], k / diff);
            k -= diff * ans[i];
        }
        int cur = 0;
        for (int i = 0; i < n; ++i) {
            while (data[cur].second < i) cur++;
            cout << ans[cur] << " \n"[i == n - 1];
        }
    }
}
```
