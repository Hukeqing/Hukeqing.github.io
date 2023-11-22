---
title: Codeforces Round 894 (Div. 3)
date: 2023-08-26 01:46:11
updated: 2023-08-26 01:46:11
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Gift Carpet

## 大致题意

从字符串矩阵中依次找出四列，满足依次包含 "vika" 四个字符

## 思路

简单题，不过多赘述

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<string> data(n);
        for (auto &item : data) item.reserve(m);
        for (auto &item : data) cin >> item;
 
        string vika = "vika";
        int cur = 0;
        for (int i = 0; i < m && cur < vika.size(); ++i) {
            for (int j = 0; j < n; ++j) {
                if (data[j][i] == vika[cur]) {
                    cur++;
                    break;
                }
            }
        }
        cout << (cur == vika.size() ? "YES" : "NO") << endl;
    }
}
```

# B. Sequence Game

## 大致题意

有一个原始的序列，将其中的 $a\_0$ 以及 $a\_{i - 1} \leq a\_i$ 的 $a\_i$ 都提取出来给你，问可能的原始序列是什么

## 思路

简单题，如果提取后的某个值不满足上述条件的，在其前面加个 $1$ 就行了

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
 
        int add = 0;
        for (int i = 1; i < n; ++i) add += data[i] < data[i - 1];
        cout << n + add << endl;
 
        cout << data[0];
        for (int i = 1; i < n; ++i) {
            if (data[i] < data[i - 1]) cout << ' ' << 1;
            cout << ' ' << data[i];
        }
        cout << endl;
    }
}
```

# C. Flower City Fence

## 大致题意

判定将木板排序后，横着和竖着放是否完全相同

## 思路

简答题，第 $i$ 块木板的长度，是否恰好都等于 $\leq i$ 的模板数量

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
        bool flag = true;
 
        int ptr = n - 1;
        for (int i = 0; i < n; ++i) {
            while (ptr >= 0 && data[ptr] <= i) ptr--;
            if (data[i] != ptr + 1) {
                flag = false;
                break;
            }
        }
 
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# D. Ice Cream Balls

## 大致题意

制作出恰好 $n$ 个不同的包含两个冰球的冰淇淋，需要多少个冰球（同时制作，两个冰淇淋之间不共用冰球）

## 思路

本题要求的恰好制作出，从最优方案上，肯定是不同的冰球更好，可以得到 $\frac{n \times (n - 1)}{2}$ 种冰淇淋，但是这样难以凑到恰好

通过上面的方案逼近答案后，再加一些重复的冰球，由于需要不同的冰淇淋，所以每种冰球的数量不能超过 $2$ 个，否则是溢出无意义的，不会带来更多方案

而每增加一个额外的重复冰球，仅能带来一种方案，即类似 ${1, 1}$ 这种重复冰球的方案。所以只需要一个简单的减法就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, mid;
        cin >> n;
        mid = (int)sqrt(n * 2);
        int ans = LONG_LONG_MAX;
        for (int i = max(2LL, mid - 10); i < mid + 10; ++i) if (i * (i - 1) / 2 <= n)
            ans = min(ans, i + n - (i * (i - 1) / 2));
        cout << ans << endl;
    }
}
```

# E. Kolya and Movie Theatre

## 大致题意

在 $n$ 天内选出 $m$ 天，其中每一天能够拿到一定的分数，还需要扣除任意两个选出的天之间的分数差（默认选出第 0 天），分数差仅取决于天数差，问最大能拿到多少分

## 思路

这道题第一眼以为是需要 dp

但是仔细读题，会发现其实扣除的分数差就是最后选出的那一天的 $index$，因为恰好把所有区间加上了

那么就变得很简单了，只需要计算到达每天的位置，最大的 $m$ 个分数的值是哪些，用个堆就行了

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, d;
        cin >> n >> m >> d;
        int ans = 0, cur = 0;
        priority_queue<int, vector<int>, greater<>> prq;
        for (int i = 0; i < n; ++i) {
            cur -= d;
            int tmp;
            cin >> tmp;
            if (tmp < 0) continue;
 
            if (prq.size() < m) {
                prq.push(tmp);
                cur += tmp;
            } else if (tmp > prq.top()) {
                cur -= prq.top();
                cur += tmp;
                prq.pop();
                prq.push(tmp);
            }
            ans = max(ans, cur);
        }
 
        cout << ans << endl;
    }
}
```

# F. Magic Will Save the World

## 大致题意

有两种魔法，火魔法和水魔法，每种魔法每秒钟都会积攒对应的法力值，使用 $x$ 点法力值可以打败体力低于等于 $x$ 的怪，怪必须一次打死，问最多需要多少时间才能打死所有的怪

## 思路

题意中很容易看出是一个背包问题，类似均分为两堆，但是这里不是均分，而是有比例分，所以可以分别计算一次，避免出错

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int f, w;
        cin >> f >> w;
        int n, sum = 0;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        for (int i = 0; i < n; ++i) sum += data[i];
 
        if (f >= sum || w >= sum) {
            cout << 1 << endl;
            continue;
        }
 
        int p = (sum + f + w - 1) / (f + w), ans;
        {
            int target = f * p;
            vector<int> dp(target + 1);
            for (int i = 0; i < n; ++i)
                for (int j = target; j >= data[i]; --j)
                    dp[j] = max(dp[j], dp[j - data[i]] + data[i]);
 
            int maxDp = 0;
            for (int i = 0; i <= target; ++i) maxDp = max(maxDp, dp[i]);
            if (sum - maxDp <= p * w) ans = p;
            else ans = (sum - maxDp + w - 1) / w;
            dp.clear();
        }
 
        {
            int target = w * p;
            vector<int> dp(target + 1);
            for (int i = 0; i < n; ++i)
                for (int j = target; j >= data[i]; --j)
                    dp[j] = max(dp[j], dp[j - data[i]] + data[i]);
 
            int maxDp = 0;
            for (int i = 0; i <= target; ++i) maxDp = max(maxDp, dp[i]);
            if (sum - maxDp <= p * f) ans = min(ans, p);
            else ans = min(ans, (sum - maxDp + f - 1) / f);
            dp.clear();
        }
 
        cout << ans << endl;
 
    }
}
```

# G. The Great Equalizer

## 大致题意

每次，将数组排序后，为一个数组中的每个值加上 $n, n - 1, n - 2 \dots, 1$，然后去重，重复，直到只剩下一个值，问最后这个值是什么。

不直接需要原数组的答案，是依次回答的，每次会修改数组中的值，然后询问，修改操作是继承的

## 思路

观察可以得到，最终结果实际上是 $max(a\_i) - min(a\_i) + max(a\_i - a\_{i-1}) + min(a\_i)$，化简得到 $max(a\_i) + max(a\_i - a\_{i-1})$。只需要维护好这两值即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item : data) cin >> item;
 
        vector<int> copy = data;
        sort(copy.begin(), copy.end());
 
        map<int, int> dif, cnt;
        for (int i = 0; i < n; ++i) cnt[data[i]]++;
        for (int i = 1; i < n; ++i) dif[copy[i] - copy[i - 1]]++;
 
        int total = 0;
        for (int i = 1; i < n; ++i) total += copy[i] - copy[i - 1];
 
        int q;
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int index, x;
            cin >> index >> x;
            if (n == 1) {
                data[0] = x;
                cout << x << ' ';
                continue;
            }
            int old = data[index - 1];
 
            const auto oldIter = cnt.find(old);
            int al, ar, am, bl, br, bm;
            if (oldIter->second > 1) {
                oldIter->second--;
                bl = br = bm = 0;
            } else {
                int lv, rv;
                if (oldIter == cnt.begin()) lv = -1;
                else {
                    auto left = oldIter;
                    left--;
                    lv = left->first;
                }
                auto right = oldIter;
                right++;
                if (right == cnt.end()) rv = -1;
                else rv = right->first;
                bl = lv == -1 ? 0 : old - lv;
                br = rv == -1 ? 0 : rv - old;
                bm = lv == -1 || rv == -1 ? 0 : bl + br;
                cnt.erase(oldIter);
            }
            data[index - 1] = x;
 
            const auto newIter = cnt.upper_bound(x);
            if (newIter == cnt.end()) {
                ar = am = 0;
                auto iter = newIter;
                iter--;
                al = x - iter->first;
            } else if (newIter == cnt.begin()) {
                al = am = 0;
                ar = newIter->first - x;
            } else {
                int lv, rv = newIter->first;
                auto tmp = newIter;
                --tmp;
                lv = tmp->first;
                al = x - lv;
                ar = rv - x;
                am = rv - lv;
            }
            cnt[x]++;
 
            auto del = [&](int t) {
                auto iter = dif.find(t);
                if (iter == dif.end()) return;
                if (iter->second == 1) dif.erase(iter);
                else iter->second--;
            };
 
            dif[al]++;
            dif[ar]++;
            dif[bm]++;
            del(bl);
            del(br);
            del(am);
 
            cout << cnt.rbegin()->first + dif.rbegin()->first << ' ';
        }
        cout << endl;
    }
}
```