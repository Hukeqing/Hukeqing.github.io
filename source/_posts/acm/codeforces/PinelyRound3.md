---
title: Pinely Round 3 (Div. 1 + Div. 2)
date: 2024-02-24 10:12:35
updated: 2024-02-24 10:12:35
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Pinely Round 3 (Div. 1 + Div. 2) 个人写题记录
---

# A. Distinct Buttons

## 大致题意

初始在 $(0, 0)$ 点，问是否可能只往三个方向移动的情况下，到达所有给出的点位，不需要按照顺序

## 思路

看看所有点是不是都在两个相邻的象限内即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        bool flag[4] = {true, true, true, true};
        for (int i = 0; i < n; ++i) {
            int u, v;
            cin >> u >> v;
            if (u > 0) flag[0] = false;
            if (u < 0) flag[1] = false;
            if (v > 0) flag[2] = false;
            if (v < 0) flag[3] = false;
        }
        cout << (flag[0] || flag[1] || flag[2] || flag[3] ? "YES" : "NO") << endl;
    }
}
```

# B. Make Almost Equal With Mod

## 大致题意

有一个数组，允许你挑选一个值，让所有值 mod 它之后，剩下的值中至少有两个不一样的，问可能的选择

## 思路

从二进制角度看，找到最后一位大家都不一样的，然后取比它大一点的那个 $2^n$ 即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int k = 2;
        while (true) {
            set<int> tmp;
            for (int i = 0; i < n; ++i) tmp.insert(data[i] % k);
            if (tmp.size() > 1) {
                cout << k << endl;
                break;
            }
            k <<= 1;
        }
    }
}
```

# C. Heavy Intervals

## 大致题意

有一堆区间$[l\_i, r\_i]$和相同数量的以及数组 $c$，问是否可以通过重新排列每个区间的 $l$, $r$ 以及 $c$，使得

$\sum\_{i=1}^n c\_i \times (r\_i - l\_i)$ 最小

## 思路

可以得到，要让最大的 $c$ 去匹配最小的区间即可，所以要尽可能制造 $(r\_i - l\_i)$ 之和不变的情况下，区间差异最大

所以可以从大到小遍历 $r$ 去找对应第一个匹配的 $l$ 即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> l(n), c(n);
        map<int, int> r;
        for (auto& i: l) cin >> i;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ++r[tmp];
        }
        for (auto& i: c) cin >> i;
        sort(l.begin(), l.end(), greater<>());
        sort(c.begin(), c.end());
        vector<int> len(n);
        for (int i = 0; i < n; ++i) {
            const auto iter = r.upper_bound(l[i]);
            len[i] = iter->first - l[i];
            if (iter->second == 1) r.erase(iter);
            else --iter->second;
        }
        sort(len.begin(), len.end());
        int ans = 0;
        for (int i = 0; i < n; ++i) ans += len[i] * c[n - 1 - i];
        cout << ans << endl;
    }
}
```

# D. Split Plus K

## 大致题意

有一个初始的数组，允许每次选择其中的一个值，让其加上给出的 $k$，然后拆成两个，

问经过多少次操作后，整个数组的所有值相同

## 思路

假设最终的值为 $m$，可以得到

$a\_i = m \times t\_i - (t\_i - 1) \times k$

化简得到 $a\_i - k = t\_i \times (m - k)$

由于都是整数，且所有 $i$ 的 $m - k$ 相同，则可以得到 $m - k$ 可以是 $gcd_{i=1}^n (a\_i - k)$

那么就简单了

## AC code

```cpp
#define int long long
 
// NOLINTNEXTLINE(*-no-recursion)
auto gcd(const int a, const int b) -> int {
    if (b == 0) return a;
    return gcd(b, a % b);
}
 
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
 
        if (n == 1) {
            cout << 0 << endl;
            continue;
        }
        int mk = data[0] - k;
        for (int i = 1; i < n; ++i) mk = gcd(mk, data[i] - k);
        if (mk == 0) {
            cout << 0 << endl;
            continue;
        }
 
        int ans = LONG_LONG_MAX;
        auto check = [&](int m) {
            if (m == k) return false;
            bool flag = true;
            int tmp = 0;
            for (int i = 0; i < n; ++i) {
                if ((data[i] - m) % (m - k) != 0 || (data[i] - m) / (m - k) < 0) {
                    flag = false;
                    break;
                }
                tmp += (data[i] - m) / (m - k);
            }
            if (flag) ans = min(ans, tmp);
            return flag;
        };
 
        check(mk + k);
        cout << (ans == LONG_LONG_MAX ? -1 : ans) << endl;
    }
}
```
