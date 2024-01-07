---
title: Educational Codeforces Round#152 (Div. 2)
date: 2023-10-02 23:25:36
updated: 2023-10-02 23:25:36
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Rigged!

## 大致题意

有 $n$ 个人，每个人都可以举起最高一定重量的哑铃 $b\_i$ 次，而每个人举的哑铃是同一个，最终举起次数最多的人获胜，裁判希望第一个人获胜，问应该陪多少的哑铃，或者不可能

## 思路

简单题，只要没有人既能举起比第一个人更重的同时，能够举起更多次就行，重量很直接选第一个人能举起的上线就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, s, e;
        cin >> n >> s >> e;
        bool flag = true;
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            if (u >= s && v >= e) {
                flag = false;
            }
        }
 
        cout << (flag ? s : -1) << endl;
    }
}
```

# B. Chips on the Board

## 大致题意

有一个棋盘，每个位置的价值是对应的横坐标价格和纵坐标价格相加。现在可以往棋盘上放棋子，费用上位置的价值。放上数个后，使得棋盘上每一个位置，其所在的行或者所在的列中至少存在一个棋子，问最小费用

## 思路

简单题，容易得出，必定每一行或者每一列都有一个棋子，这是最低的要求，然后就很简单了

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int ma = LONG_LONG_MAX, mb = LONG_LONG_MAX, sa = 0, sb = 0, tmp;
        for (int i = 0; i < n; ++i) {
            cin >> tmp;
            ma = min(ma, tmp);
            sa += tmp;
        }
        for (int i = 0; i < n; ++i) {
            cin >> tmp;
            mb = min(mb, tmp);
            sb += tmp;
        }
 
        cout << min(sa + n * mb, sb + n * ma) << endl;
    }
}
```

# C. Make it Alternating

## 大致题意

有一个 $01$ 串，允许按照一定顺序删除掉一些字符，使得整个字符串没有连续的相同字符，问有多少种删除方式

## 思路

拿一个例子进行考虑，比如 $11000$，明显，我们需要在前两个中删除一个，在后面三个中删除两个，然后这三个值的顺序任意都可，所以就是

{% raw %}
$$
\begin{pmatrix}
2 \\ 1
\end{pmatrix}
 \times 
\begin{pmatrix}
3 \\ 2
\end{pmatrix}
 \times 
A^3_3
$$
{% endraw %}

看懂了公式就能算出来了

## AC code

```cpp
#define int long long
 
void solve() {
    const int mod = 998244353;
    vector<int> p(2e5 + 10);
    p[0] = p[1] = 1;
    for (int i = 2; i < p.size(); ++i) p[i] = (i * p[i - 1]) % mod;
 
    int _;
    cin >> _;
    string str;
    for (int ts = 0; ts < _; ++ts) {
        str.reserve(2e5+10);
        cin >> str;
        int ans = 1, tot = 0, cnt = 1;
        for (int i = 1; i < str.size(); ++i) {
            if (str[i] != str[i - 1]) {
                ans = (ans * cnt) % mod;
                cnt = 1;
            } else {
                cnt++;
                tot++;
            }
        }
 
        ans = (ans * cnt) % mod;
        ans = (ans * p[tot]) % mod;
 
        cout << tot << ' ' << ans << endl;
    }
}
```

# D. Sum of XOR Functions

## 大致题意

有一个数组，需要求算 $\sum^n\_{l=1}\sum^n\_{r=l} f(l,r) \times (r-l+1)$，其中 $f(l,r)$ 表示 $[l, r]$ 区间的异或和

## 思路

首先要明确异或和的本质，对于任意一个比特位而言，若所有值中此比特位为 `1` 的数量为奇数，则最终为奇数。所以需要统计任意区间内的某个比特位的奇偶情况，故可以先做一次前缀异或和，这样得到的就是累积的奇偶情况了。

对于一个区间，如果其左区间（前一个）的前缀异或和的某个位的结果是 `1`（奇数），而右区间则为 `0`（偶数），则说明这个区间内这个比特位出现奇数次，那么就可以计算其贡献，为 $(r-l+1) \times 2^p)$，拆解一下公式可以得到 $r \times 2^p - (l-1) \times 2^p$。

对于每一个比特位，我们考虑遍历所有可能的右区间，对于每一个右区间，要找出左边出现了几次和右区间的前缀和的比特位结果不同的次数，那么就是这个 $r \times 2^p$ 部分的价值出现的次数，同时减去左边所有不同的 $(l-1) \times 2^p$ 的价值，就可以得到当前位置作为右区间的时候，能够带来的价值。而计算后的 $r \times 2^p$ 部分，恰好是其作为左区间的时候的 $(l-1) \times 2^p$ 的价值。

所以只需要遍历一遍，记录左边出现了几次 $0$ 和几次 $1$，同时对于 $0$ 而言，产生了多少价值，同理对 $1$ 也一样，然后作为下一个节点的计算输入

## AC code

```cpp
#define int long long

void solve() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (auto &i: data) cin >> i;
    for (int i = 1; i < n; ++i) data[i] = data[i] ^ data[i - 1];
    const int mod = 998244353;

    int ans = 0;
    for (int e = 0; e <= 32; ++e) {
        int s1 = 0, c1 = 0, s0 = 0, c0 = 1;
        for (int i = 0; i < n; ++i) {
            int rp = ((i + 1) * (1LL << e)) % mod;
            if (data[i] & (1LL << e)) {
                ans = (ans + rp * c0 - s0) % mod;
                s1 = (s1 + rp) % mod;
                c1++;
            } else {
                ans = (ans + rp * c1 - s1) % mod;
                s0 = (s0 + rp) % mod;
                c0++;
            }
        }
    }

    cout << ans << endl;
}
```
