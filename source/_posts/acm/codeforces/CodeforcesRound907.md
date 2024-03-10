---
title: Codeforces Round 907 (Div. 2)
date: 2023-12-24 00:18:59
updated: 2023-12-24 00:18:59
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 907 (Div. 2) 个人写题记录
---

# A. Sorting with Twos

## 大致题意

每次可以从前往后选择 $2^x$ 个值，每个值减少一，问进行无数次操作后，是否可能让整个数组变成无递减

## 思路

简单题，只要原数组中，那些盲区仍然保持非递减即可。例如 $[3, 4]$ 这种区间，要么一起减少要么一起不减少

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
        bool flag = true;
        pair<int, int> arr[4] = {{2, 3}, {4, 7}, {8, 15}, {16, 31}};
        for (auto [l, r]: arr) {
            for (; l < min(r, n - 1); ++l) {
                if (data[l] > data[l + 1]) {
                    flag = false;
                    break;
                }
            }
        }

        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# B. Deja Vu

## 大致题意

给出两个数组，对于第一个数组 $a$ 的每一个值，进行如下操作：

- 从前往后遍历数组 $b$
- 若 $a\_i \space mod \space 2^{b\_i} = 0$ 则 $a\_i \leftarrow a\_i + 2^{b\_i - 1}$

求最终数组

## 思路

数据量很大，但是有技巧

因为一旦满足 $a\_i \space mod \space 2^{b\_i} = 0$ 之后，会加上的是 $2^{b\_i - 1}$。
这也就意味着，如此操作之后，其必然可以被 $2^{b\_i - 1}$ 整除，且最大只能被它整除了。
也就是说，每次能够加上的值一定是不断变小的

题目中给出的 $b\_i \in [1, 30]$ 所以其实第二个数组最多只能有 30 个有效值。处理之后暴力即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, q;
        cin >> n >> q;
        vector<int> data(n), query;
        query.reserve(30);
        for (auto& i: data) cin >> i;
        for (int i = 0; i < q; ++i) {
            int tmp;
            cin >> tmp;
            if (i == 0 || tmp < query.back()) query.push_back(tmp);
        }

        for (auto& i: data) for (long long j: query) if (i % (1 << j) == 0) i += 1 << j - 1;
        for (int i = 0; i < n; ++i) cout << data[i] << " \n"[i == n - 1];
    }
}
```

# C. Smilo and Monsters

## 大致题意

有一堆怪物窝，每个怪物窝里有一定数量的怪物。你有一个累计的技能点数，初始值为 0，每次可以选择不同的技能

- 找一个怪物窝，打死里面的一只怪物，积累一点技能点数
- 找一个怪物窝，里面的怪物数量不大于你的技能点数，消耗全部的技能点数释放大招，消灭这个窝里的全部怪物

问最少需要几次操作

## 思路

对于一个窝而言，只需要打死里面的一半的怪物，再加上一次使用技能，就可以实现打败这个窝了，此时成本为 $\left \lceil \frac{x}{2} \right \rceil + 1$

如果有两个窝，假设都这样操作，那么代价就是 $\left \lceil \frac{x}{2} \right \rceil + \left \lceil \frac{y}{2} \right \rceil + 2$

假如我将小一点的那个窝全部一只只打死，然后打几只大窝里的怪，再对大一点对窝释放大招，也就是只使用一次技能，代价就是 $x + (\left \lceil \frac{y+x}{2} \right \rceil - x) + 1 = \left \lceil \frac{y+x}{2} \right \rceil + 1$

显然，后者价值更高，所以要考虑按照后者的操作进行，即多用小窝的怪刷技能点，然后对大窝放技能。用双指针做就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        sort(data.begin(), data.end());
        int l = 0, r = n - 1, x = 0, ans = 0;
        while (l <= r) {
            if (x >= data[r]) {
                data[r] = 0;
                x = 0;
                --r;
                ++ans;
            } else {
                const int tmp = l == r ? (x + data[l] + 1) / 2 - x : min(data[l], data[r] - x);
                x += tmp;
                ans += tmp;
                data[l] -= tmp;
                if (!data[l]) ++l;
            }
        }

        cout << ans << endl;
    }
}
```

# D. Suspicious logarithms

## 大致题意

定义两个函数，$f(x) = y, g(x) = z$，满足 $2^y \leq x, y^z \leq z$，且 $y, z$ 都尽可能大

给出一个区间，求 $\sum\_{i=l}^{r} g(i)$

## 思路

虽然看起来很难，但是观察可以发现，$y \in [1, 64]$，而 $z \in [0, 10]$，所以只需要枚举所有的 $y, z$ 即可

## AC code

```cpp
#define int long long

void solve() {
    map<pair<int, int>, int> mp;
    for (int i = 2; i < 60; ++i) {
        const __int128 ml = 1ll << i, mr = 1ll << i + 1;
        __int128 base = 1;
        for (int j = 0; j <= 10; ++j) {
            if (base >= mr) break;
            if (base * i <= ml) {
                base *= i;
                continue;
            }
            mp.insert({{max(ml, base), min(mr, base * i) - 1}, j});
            base *= i;
        }
    }

    constexpr int mod = 1e9 + 7;

    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int l, r;
        cin >> l >> r;
        int ans = 0;
        for (auto& [fst, snd]: mp) {
            const int len = min(fst.second, r) - max(fst.first, l) + 1;
            if (len <= 0) continue;
            ans = (ans + len * snd % mod) % mod;
        }
        cout << ans << endl;
    }
}
```
