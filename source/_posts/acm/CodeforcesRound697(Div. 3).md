---
title: Codeforces Round#697 (Div. 3)
date: 2021-01-26 02:19:22
tag:
 - ACM
 - Codeforces
math: true
---

*自南京区域赛结束之后就一直在准备期末考试，直到最近结束考试之后开始了复建的生活，这场 Div3 除了 D 题因为爆了 int 然后卡了，G题真的没在比赛期间想出来，其他题目都是非常顺利的解决掉了，且只用了一个小时*

# A. Odd Divisor
## 题目大意
给你一个整数，请问它是否存在一个不为 1 的奇因子

## 题解
因为除 1 以外的所有奇因子都可以分解出至少一个奇质因子，那么只需要找到那些不包含奇质因子的数进行排查就行。而不包含奇质因子的数字很明显就是所有的 2 的幂次，所以打表就可以了。注意别忘记范围超过了 int

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

#define int long long

int main() {
    set<int> err;
    int cur = 2;
    for (int i = 0; i < 62; ++i) {
        err.insert(cur);
        cur <<= 1;
    }
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int tmp;
        cin >> tmp;
        cout << (err.count(tmp) ? "NO" : "YES") << endl;
    }
}
```

# B. New Year's Number
## 题目大意
给你一个数，请问它是不是 n 个 2020 和 m 个 2021 相加得到的

## 题解
把 2021 看成 2020 + 1，那么就变成了 (n + m) 个 2020 和 m 个 1 相加得到，由于 n 肯定是自然数，则只要满足这个数除以 2020 的商(也就是 n + m 部分)大于等于余数(也就是 m)即可

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int tmp;
        cin >> tmp;
        cout << (tmp / 2020 >= tmp % 2020 ? "YES" : "NO") << endl;
    }
}
```

# C. Ball in Berland
## 题目大意
有两组人，分别为 a 和 b ，有 k 对组合，每对组合都是从 a 中选出一个，从 b 中选出一个。你现在需要选出两对组合，使得这两对组合不会发生冲突，即不会出现 a 中的人同时参与了这两个组合或者 b 中的人同时参与了这两个组合或者两者都同时参与

## 题解
可以用类似容斥的办法解决。因为保证了每一对组合都不同，所以当我选出一对的时候，那么还有 `k - cnt[a] - cnt[b] + 1` 对我可以选，其中的 `cnt` 为这个人参与的组合数量。只需要遍历所有的组合，然后对于每对组合进行求解即可

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, k;
        cin >> a >> b >> k;
        vector<int> ca(a + 1), cb(b + 1);
        vector<pair<int, int>> p(k);
        for (int i = 0; i < k; ++i) {
            int u;
            cin >> u;
            p[i].first = u;
            ca[u]++;
        }
        for (int i = 0; i < k; ++i) {
            int u;
            cin >> u;
            p[i].second = u;
            cb[u]++;
        }
        long long ans = 0;
        for (int i = 0; i < k; ++i) ans += k - ca[p[i].first] - cb[p[i].second] + 1;
        cout << ans / 2 << endl;
    }
}
```

# D. Cleaning the Phone
## 大致题意
有一组物品，他们有各自的代价和价值，其中代价只有 1 或者 2 两种，请问如何选择物品，使得代价尽可能小的情况下满足所需要的价值

## 题解
直接考虑枚举，比如枚举选择了 x 件代价为 1 的物品，求出这时候至少需要多少件代价为 2 的物品，然后枚举所有情况，输出最小的情况即可。

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

#define int long long

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<int> mem(n);
        vector<int> data[2];
        for (int i = 0; i < n; ++i) cin >> mem[i];
        for (int i = 0; i < n; ++i) {
            int op;
            cin >> op;
            data[op - 1].push_back(mem[i]);
        }
        sort(data[0].begin(), data[0].end(), greater<int>());
        sort(data[1].begin(), data[1].end(), greater<int>());
        int ans = INT_MAX;
        for (int i = 1; i < data[0].size(); ++i) data[0][i] += data[0][i - 1];
        for (int i = 1; i < data[1].size(); ++i) data[1][i] += data[1][i - 1];

        auto iter = lower_bound(data[1].begin(), data[1].end(), m);
        if (iter != data[1].end()) ans = min(ans, (int) (iter - data[1].begin() + 1) * 2);

        iter = lower_bound(data[0].begin(), data[0].end(), m);
        if (iter != data[0].end()) ans = min(ans, (int) ((iter - data[0].begin() + 1)));

        for (int i = 0; i < data[0].size(); ++i) {
            iter = lower_bound(data[1].begin(), data[1].end(), m - data[0][i]);
            if (iter != data[1].end()) ans = min(ans, (int) ((iter - data[1].begin() + 1) * 2 + i + 1));
        }

        for (int i = 0; i < data[1].size(); ++i) {
            iter = lower_bound(data[0].begin(), data[0].end(), m - data[1][i]);
            if (iter != data[0].end()) ans = min(ans, (int) ((iter - data[0].begin() + 1) + 2 * (i + 1)));
        }
        cout << (ans == INT_MAX ? -1 : ans) << endl;
    }
}
```

# E. Advertising Agency
## 大致题意
给你一组数据，要求你从中取出 k 个数据，使得这 k 个数据的之和最大，问有几种取法

## 题解
首先取最大必然只能从大到小取，直到取满 k 个。但是在取最后几个相同的值的时候，由于有多个选择，则可以产生多个方案。而这个方案数量很明显即为组合数。

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long ll;
const int mod = 1e9 + 7;
const int N = 1100;

ll qpow(ll a, ll b) {
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}

ll fac[N], ifac[N];

void init(int siz) {
    fac[0] = 1;
    for (int i = 1; i <= siz; i++)
        fac[i] = i * fac[i - 1] % mod;
    ifac[siz] = qpow(fac[siz], mod - 2);
    for (int i = siz; i >= 1; i--) ifac[i - 1] = ifac[i] * i % mod;
}

ll C(ll n, ll m) {
    if (m == 0 || n == m) return 1;
    if (m > n) return 0;
    if (m == 1) return n;
    return fac[n] * ifac[m] % mod * ifac[n - m] % mod;
}

int main() {
    init(1050);
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        map<int, int> mp;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mp[tmp]++;
        }

        auto iter = mp.rbegin();
        while (iter != mp.rend()) {
            if (k > iter->second) {
                k -= iter->second;
                iter++;
            } else {
                cout << C(iter->second, k) << endl;
                break;
            }
        }
    }
}
```

# F. Unusual Matrix
## 大致题意
给你两个 01 矩阵，问能否通过下面两个方式将第一个矩阵转为和第二个矩阵一样

 - 将一行的值翻转
 - 将一列的值翻转

## 题解
由于是翻转相同，那么首先直接对这两个矩阵做异或，可以得到一个矩阵，接下来只需要把这个矩阵给转为只有 0 或者只有 1 的矩阵即可

这时候其实可以模拟，假定这行第一个值为 1 则翻转，否者不翻转，然后最后判定是否为纯 0 矩阵

但是这样太麻烦了，其实可以直接判断相邻两行之间是否相同或者相异，即任意两行或者两列的异或结果全为 0 或者 全为 1 则可以，否则不可以

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<string> data1(n), data2(n);
        for (int i = 0; i < n; ++i) cin >> data1[i];
        for (int i = 0; i < n; ++i) cin >> data2[i];
        for (int i = 0; i < n; ++i) for (int j = 0; j < n; ++j) data1[i][j] = (data1[i][j] - '0') ^ (data2[i][j] - '0');
        bool flag = true;
        for (int i = 1; i < n; ++i) {
            char tmp = data1[i][0] ^ data1[i - 1][0];
            for (int j = 0; j < n; ++j) {
                if ((data1[i][j] ^ data1[i - 1][j]) != tmp) {
                    flag = false;
                    break;
                }
            }
            if (!flag) break;
        }
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# G. Strange Beauty
## 大致题意
给你一组数列，请问至少需要删除几个数字，使得整个数列的任意两个值满足大数取模小数为 0

## 题解
利用素数筛的方式来 dp 求算最多能有多少个值能满足此条件，相减就能得到答案

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> cnt(2e5 + 1), dp(2e5 + 1);
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            cnt[tmp]++;
        }
        int ans = 0;
        for (int i = 1; i <= 2e5; ++i) {
            dp[i] += cnt[i];
            for (int j = i + i; j <= 2e5; j += i) dp[j] = max(dp[j], dp[i]);
            ans = max(ans, dp[i]);
        }
        cout << n - ans << endl;
    }
}
```
