---
title: Codeforces Round 1103 (Div. 3)
date: 2026-07-12 15:31:07
updated: 2026-07-12 15:31:07
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1103 (Div. 3) 个人写题记录
#index_img:
---

# A. Games on the Train

## 大致题意

有一个数组 $h$，每一项已经确定。接下来需要你生成一个新的数组 $x$，使得新的数组 $a\_i = h\_i + x\_i$，且新的数组每一项都相同。问数组 $x$ 中最大的项目最小是多少

## 思路

非常简单的题目，其实就是 $max(h) - min(h) + 1$

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int mi = INT_MAX, ma = INT_MIN;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mi = min(mi, tmp);
            ma = max(ma, tmp);
        }
 
        cout << ma - mi + 1 << endl;
    }
}
```

# B. Tatar TV Show

## 大致题意

有一个 01 的串，每次可以选择两个下标相差恰好 $k$ 的两个位进行翻转，为是否可能把所有值变成 $0$

## 思路

从头开始试一下就行了，前面 $n - k$ 项目都可以操作，操作完成后看下最后无法主动操作的 $k$ 项目是否恰好都归零了

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        string s;
        s.resize(n);
        cin >> s;
        for (int i = 0; i + k < n; ++i) {
            if (s[i] == '1') {
                s[i] = '0';
                s[i + k] = s[i + k] == '0' ? '1' : '0';
            }
        }
        bool ok = true;
        for (int i = 0; i < n; ++i) if (s[i] == '1') ok = false;
        cout << (ok ? "YES" : "NO") << endl;
    }
}
```

# C. Omsk Programmers

## 大致题意

有两个数字 $a, b$，允许你每次选择其中一个数字，进行下面两个操作其中一项

- $+ 1$
- $/ x$

问最少多少次操作，可以让这两个数字相同

## 思路

我的做法是不断让最大的值 $/ x$，然后每次除完之后看下这两个值之差，也就是此时需要相同需要多少次 $+ 1$，然后计算最小就行

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, x;
        cin >> a >> b >> x;
        int ans = abs(a - b), cur = 0;
        while (a != b) {
            ++cur;
            if (a > b) a /= x;
            else b /= x;
            ans = min(ans, cur + abs(a - b));
        }
 
        cout << ans << endl;
    }
}
```

# D. Brand New Tatar TV Show

## 大致题意

有一个数组，接下来两个人需要进行博弈，每个人需要选择一个值拿走

- 如果为第一次取数，则可以随意选择
- 如果为非第一次取数，假定上次取走的为 $x$，那么这次只可以取走 $[x, x + k]$ 内的一个数值

谁无法取走数字谁失败。

要博弈的两个人（A，B），A 先行动，但是无论是 A 还是 B，都是希望 B 赢，请问是否存在可能让 B 赢

## 思路

首先，由于 $k$ 的限制，所有的数字都被拆分为多个候选集合段，每个集合满足其中的最大值 $+ k$ 仍然小于下一段的最小值

假如说，可选的数字都相同，且为奇数（例如示例 1）那么显然 A 无论如何取，B 都不可能胜利

所以作为 A 绝对不可以选那些候选集合为奇数的。而因为 B 也是希望 B 赢，所以只需要考虑 A 首选是否正确就行

那么显然如果一个候选集合段只有一个值且数量恰好为奇数，那么这个候选段选了肯定不行

如果这个候选段最大的那个数值为奇数，但是其不只有一个数值，那么可以从前面借一个数值来完成奇数变偶数

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> v(n);
        for (int i = 0; i < n; ++i) cin >> v[i];
        sort(v.begin(), v.end());
        if (n == 1) {
            cout << "NO" << endl;
            continue;
        }
 
        auto check = [&](const int r) {
            int l = r;
            while (l >= 0 && v[l] == v[r]) --l;
            if ((r - l) % 2 == 0 || (l >= 0 && v[l] + k >= v[r])) return true;
            return false;
        };
 
        bool flag = false;
        for (int i = 1; i < n && !flag; ++i) {
            if (v[i - 1] + k >= v[i]) continue;
            flag |= check(i - 1);
        }
        flag |= check(n - 1);
 
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# E. Friendly Gifts

## 大致题意

给出一个数组，需要你从数组中找到两段长度相同的子串，满足

- 排序子串后，其每一项恰好等于前一项 + 1
- 将两个子串拼接后得到的新的串，也能满足上面的要求

找到这样最长的子串

## 思路

注意数量，总共也只有 6000 个值，所以我们直接枚举所有区间的两边，然后确认区间是否满足子串要求，如果满足就记录下来

然后对于所有找到满足的子串，找找看之前找到的子串里，有没有恰好能和它拼起来仍然满足条件的子串，如果有的话就找到一个答案

要注意优化不必要的循环和常数

## AC Code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; ++i) cin >> v[i];
        vector<vector<bool>> m;
        m.resize(n + 1);
        for (auto &item: m) item.resize(n + 1, false);
        int ans = 0;
        for (int i = 0; i < n; ++i) {
        vector<bool> flag(n + 1, false);
            int mi = v[i], ma = v[i];
            for (int j = i; j < n; ++j) {
                if (flag[v[j]]) break;
                flag[v[j]] = true;
                mi = min(mi, v[j]);
                ma = max(ma, v[j]);
                if (ma - mi + 1 == j - i + 1) {
                    m[mi][ma] = true;
                    if (ma + 1 + ma - mi <= n && m[ma + 1][ma + 1 + ma - mi]) ans = max(ans, ma - mi + 1);
                    if (mi - 1 - ma + mi >= 0 && m[mi - 1 - ma + mi][mi - 1]) ans = max(ans, ma - mi + 1);
                }
            }
        }
        cout << ans << endl;
    }
}
```

# F1. Elections in Saransk (easy version)

## 大致题意

给出一个数组，允许对每一项进行修改，可以不修改或者改为原来项的因子

使得最终的数组 $p$ 满足 $lcm(p\_1, p\_2, p\_3, dots p\_n) = p\_1 \times p\_2 \times p\_3 \times dots \times p\_n$

## 思路

由于 $lcm$ 性质，我们可以知道，需要做到任何一个质因子只存在于一个值上，我们只需要合理安排质因子存在的地方就行

## AC Code

```cpp
#define int long long
 
void solve() {
    vector<bool> notPrime(5e5 + 10, false);
    vector<int> prime;
    for (int i = 2; i < notPrime.size(); i++) {
        if (notPrime[i]) continue;
        prime.push_back(i);
        for (auto j = i * i; j < notPrime.size(); j += i) notPrime[j] = true;
    }
 
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x;
        cin >> n >> x;
        map<int, int> ans;
        for (int i = 0; i < n; i++) {
            int tmp;
            cin >> tmp;
            for (int j = 0; j < prime.size(); j++) {
                if (tmp % prime[j] == 0) {
                    int cnt = 0;
                    while (tmp % prime[j] == 0) {
                        cnt++;
                        tmp /= prime[j];
                    }
                    if (ans.find(j) != ans.end()) ans[j] += cnt;
                    else ans[j] = cnt + 1;
                }
                if (tmp == 1) break;
                if (!notPrime[tmp]) {
                    if (int index = lower_bound(prime.begin(), prime.end(), tmp) - prime.begin(); ans.find(index) != ans.end()) ans[index] += 1;
                    else ans[index] = 2;
                    break;
                }
            }
        }
 
        int res = 1;
        for (auto [fst, snd] : ans) res = res * snd % 1000000007;
        cout << res << endl;
    }
}
```
