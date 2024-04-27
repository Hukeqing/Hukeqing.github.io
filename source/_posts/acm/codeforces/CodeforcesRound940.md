---
title: Codeforces Round 940 (Div. 2) and CodeCraft-23
date: 2024-04-27 21:39:12
updated: 2024-04-27 21:39:12
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 940 (Div. 2) and CodeCraft-23 个人写题记录
#index_img:
---

# A. Stickogon

## 大致题意

有 $n$ 根木棍，问最多可以构成多少个等边的多边形，要求每一条边只能用一根木棍

## 思路

构建成三角形就行，统计一下，每种边的数量整除 $3$ 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        map<int, int> mp;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ++mp[tmp];
        }

        int ans = 0;
        for (auto &[a, b]: mp) ans += b / 3;
        cout << ans << endl;
    }
}
```

# B. A BIT of a Construction

## 大致题意

给出一个整数 $k$，要求构造一个数组，其长度为给出的 $n$，每一项都不是负数，且满足 $\sum^n\_{i=1} a\_i = k$

问如何使得整个数组的 $a\_1 | a\_2 | \dots | a\_n$ 的数中，比特位为 $1$ 数量最多

## 思路

由于求和为 $k$，且每一项都不是负数，那么必然可以得到所有值都比 $k$ 小，最大起码也是等于

而题目要求比特位为 $1$ 尽可能多，而尽可能多的值必然是 $2^x - 1$，所以找最大的 $x$ 使得 $2^x \leq k$，然后剩下的数值不重要了，补充满 $k$ 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        if (n == 1) {
            cout << k << endl;
            continue;
        }
        int a = 0;
        for (int i = 31; i >= 0; --i) {
            if (k >= (1 << i) - 1) {
                a = (1 << i) - 1;
                break;
            }
        }
        cout << a << ' ' << k - a;
        for (int i = 2; i < n; ++i) cout << ' ' << 0;
        cout << endl;
    }
}
```

# C. How Does the Rook Move?

## 大致题意

有一个棋盘，现在黑白两方轮着下，其中玩家使用白棋，电脑使用黑棋

电脑下棋的位置固定是根据用户下的位置的相反位置，例如玩家这一步下了 $(i, j)$，那么电脑则会下 $(j, i)$。
如果 $i = j$，那么就跳过电脑的回合

现在下的每一个棋都是城堡（类似中国象棋中的车），需要保证任何一步下的位置都必定不会被出现相互吃的情况，且目前已经有几个位置已经下好了，问剩下的还有几种可能下法

## 思路

容易猜出这是一个递推的题，类似斐波那契数列。当然可以仔细来看

首先，已经下了几步这件事是无意义的，因为去掉已经下的那些行/列，就会回到一个普通的没有下的棋盘，
说白了就是个干扰项，只需要把给出的棋盘大小减去已经下过的位置的行数，就可以得到新的棋盘行数

同样的，不仅是已经下的位置，你现在下的位置也是如此，一旦下好了+电脑下好，再把下好的那几行/列删掉，就是一个新的空棋盘，所以这是一个递推

接下来是如何得到递推公式了，因为下哪一行都一样，删掉之后就是空白的，且根据要求，每一行必定有一个城堡，且求算的总数并不关系下的顺序，只看最后的样子，
那么我们可以只考虑第一行（因为第一行必定有一个城堡，可能是白的也可能是黑的）

如果第一行，我下了最左上角的位置，那么就会得到一个 $n - 1$ 的棋盘（$i = j$，机器人没有地方下）

如果第一行，我下了不是第一个位置，那么机器人必定会下对角线位置，即得到一个 $n - 2$ 的棋盘。因为这样的位置有 $n - 1$ 个，
且第一行可能是黑的也可能是白的，所以递推公式就是

$a\_n = a\_{n-1} + 2 \times (n - 1) \times a\_{n - 2}$

## AC code

```cpp
#define int long long

void solve() {
    vector<int> ans(3e5 + 10);
    ans[0] = 1;
    ans[1] = 1;
    constexpr int mod = 1e9 + 7;
    for (int i = 2; i < ans.size(); ++i) {
        ans[i] = (ans[i - 1] + (ans[i - 2] * (i - 1) * 2) % mod) % mod;
    }

    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k;
        cin >> n >> k;
        set<int> st;
        for (int i = 0; i < k; ++i) {
            int u, v;
            cin >> u >> v;
            st.insert(u);
            st.insert(v);
        }
        cout << ans[n - st.size()] << endl;
    }
}
```

# D. A BIT of an Inequality

## 大致题意

给出一个数组，要求找到一个元祖 $(x, y, z)$，满足 $0 \leq x \leq y \leq z \leq n, f(x, y) \oplus f(y, z) > f(x, z)$

其中 $f(l, r) = a\_l \oplus a\_{l+1} \oplus a\_{l+2} \oplus \dots \oplus a\_{r}$

问有多少个不同的元组

## 思路

很容易得到，$f(x, z) \oplus a\_y = f(x, y) \oplus f(y, z)$，就是再异或上一边 $a\_y$ 能让值变大

那么必然，原来 $a\_y$ 中，最大的为 $1$ 那个比特位，$f(x, z)$ 为 $0$，毕竟如果是 $1$ 的话，肯定就变小了

接下来从这个角度分析，由于 $x \leq y \leq z$，所以 $f(x, z)$ 中一定已经异或过一次 $a\_y$ 了，
而已知一个比特位 $a\_y$ 是 $1$ 但是 $f(x, z)$ 是 $0$，那么必然在 $[x, z]$ 中，这个比特位为 $1$ 的，出现了偶数次，且至少 $2$ 次

所以只需要对于每一个可能的 $y$，找这个 $y$ 最大的为 $1$ 的那个比特位，为 $1$ 的次数恰好为偶数，且包含 $y$ 的区间数量即可。我采用了双向的奇偶标记

例如第三个例子，可以得到如下的表格

| index | origin | 2^2 | forward | back | 2^1 | forward | back | 2^0 | forward | back |
|:-----:|:------:|:---:|:-------:|:----:|:---:|:-------:|:----:|:---:|:-------:|:----:|
|   0   |   7    |  1  |   odd   | even |  1  |   odd   | even |  1  |   odd   | even |
|   1   |   3    |  0  |   odd   | odd  |  1  |  even   | odd  |  1  |  even   | odd  |
|   2   |   7    |  1  |  even   | odd  |  1  |   odd   | even |  1  |   odd   | even |
|   3   |   2    |  0  |  even   | even |  1  |  even   | odd  |  0  |   odd   | odd  |
|   4   |   1    |  0  |  even   | even |  0  |  even   | even |  1  |  even   | odd  |

这个表格的制作方式：

- 先计算出每个值的每个比特位，放在 $2^x$ 列上
- 单独计算每一列 forward，从上往下走，初始值为 even，如果当前的 $2^x$ 是 $1$，则将前一个 forward 翻转后填入，反之则超过来
- 然后单独计算每一列 back，从下往上走，初始值为 forward 最后的值，填入逻辑同上

然后统计某个位置，左边的 back 下不同类型的数量和右边的 forward 不同的类型数量，再做乘法即可

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
        for (auto &i: data) cin >> i;
        vector<bool> flag[32][2];
        int cntR[32][2] = {}, cntL[32][2] = {}, ans = 0;
        bool cf[43] = {};
        for (auto &i: flag) i[0].resize(n);
        for (auto &i: flag) i[1].resize(n);
        for (int v = 0; v < n; ++v) {
            for (int i = 0; i < 32; ++i) {
                if (data[v] & (1ll << i)) cf[i] = !cf[i];
                flag[i][0][v] = cf[i];
                ++cntR[i][cf[i]];
            }
        }
        for (int v = n - 1; v >= 0; --v) {
            for (int i = 0; i < 32; ++i) {
                if (data[v] & (1ll << i)) cf[i] = !cf[i];
                flag[i][1][v] = cf[i];
            }
        }
        for (int v = 0; v < n; ++v) {
            for (int i = 0; i < 32; ++i) ++cntL[i][flag[i][1][v]];
            for (int i = 31; i >= 0; --i) if (data[v] & (1ll << i)) {
                ans += cntL[i][0] * cntR[i][0] + cntL[i][1] * cntR[i][1];
                break;
            }
            for (int i = 0; i < 32; ++i) --cntR[i][flag[i][0][v]];
        }
        cout << ans << endl;
    }
}
```
