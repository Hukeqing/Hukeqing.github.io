---
title: Codeforces Round 1102 (Div. 2)
date: 2026-06-13 19:53:46
updated: 2026-06-13 19:53:46
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1102 (Div. 2) 个人写题记录
#index_img:
---

# A. Euclid, Sequence and Two Numbers

## 大致题意

定义一种特殊的序列，满足 $\forall 1 \leq i \leq n - 2, a\_{i+2} = a\_i \space mod \space a\_{i+1}$

现在给出一个数组，确认其是否满足

## 思路

注意到：我们只需要检查一下数组是否满足就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; ++i) cin >> v[i];
        sort(v.begin(), v.end(), greater<int>());
 
        bool flag = true;
        for (int i = 0; i < n - 2; ++i) flag &= v[i] % v[i + 1] == v[i + 2];
        if (flag) cout << v[0] << ' ' << v[1] << endl;
        else cout << -1 << endl;
    }
}
```

# B. Palindrome, Twelve and Two Terms

## 大致题意

给出一个 $n$，要求找到两个数字 $a, b$，满足: $a$ 为回文串，$b$ 为 $12$ 的 $x$ 倍

## 思路

注意到：$1, 2, 3 \dots 9, 11$ 就是回文串，而一个数去掉一个 $12$ 的倍数的数字后，必定是 $1, 2, 3 \dots 11$

我们可以注意到其中只有 $10$ 不满足回文，其他数字均满足回文，所以如果 $n = 12x + y, y \in \left \{ 1, 2, 3, \dots 9, 11 \right \} $

我们直接把 $b$ 设置为最大可能值，即 $n % 12$ 的结果为 $a$ 即可

接下来讨论 $y = 10$ 的情况，显然，如果我们可以从 $b$ 让一个 $12$ 出来，我们就可以得到 $22$ 这个回文串。所以仅当 $n = 10$ 的时候无解

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        if (n == 10) {
            cout << -1 << endl;
        } else if (n % 12 != 10) {
            const int x = n / 12;
            cout << n - x * 12 << ' ' << x * 12 << endl;
        } else {
            const int x = n / 12 - 1;
            cout << n - x * 12 << ' ' << x * 12 << endl;
        }
    }
}
```

# D. XOR, Expression and Two Binary Numbers

## 大致题意

有 $2^k + 1$ 个数组 $a$，其中第 $1, 2^k + 1$ 两个值已知，其他值未知

剩余值可以通过如下公式算出：如果 $a\_i, a\_j$ 已知，则 $a\_{\frac{i + j}{2}} = a\_i XOR a\_j$

接下来定义 $x\_i$ 为 $a\_i$ 这个数值在二进制上，$1$ 的数量，同样的 $y\_i$ 为 $0$ 的数量（注意，固定二进制长度为 $n$，即有可能存在前导 0）

问 $\sum_{i=1}^n x\_i \times y\_i$ 是多少

## 思路

$XOR$ 运算的性质考察：$A XOR A = 0$，所以我们定义最开始的两个值分别为 $A, B$，那么他们异或结果为 $C = A \space XOR \space B$

那么 $A \space XOR \space B = C$, $A \space XOR \space C = B$, $B \space XOR \space C = A$

那么当 $k = 1$ 时，数组为：$A, C, B$
当 $k = 2$ 时，数组为 $A, B, C, A, B$
当 $k = 3$ 时，数组为 $A, C, B, A, C, B, A, C, B$

以此类推可以发现规律

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        string a, b, c;
        a.reserve(n);
        b.reserve(n);
        cin >> a >> b;
        c.resize(n);
        for (int i = 0; i < n; ++i) c[i] = a[i] == b[i] ? '0' : '1';
        int ca[2] = {0, 0}, cb[2] = {0, 0}, cc[2] = {0, 0};
        for (int i = 0; i < n; ++i) {
            ++ca[a[i] - '0'];
            ++cb[b[i] - '0'];
            ++cc[c[i] - '0'];
        }
        int va = 0, vb = 0, vc = 0;
        va = ca[0] * ca[1];
        vb = cb[0] * cb[1];
        vc = cc[0] * cc[1];
 
        if (k & 1) cout << ((2LL << (k - 1)) + 1) / 3 * (va + vb + vc) << endl;
        else cout << va + vb + (va + vb + vc) * ((2LL << (k - 1)) - 1) / 3 << endl;
 
    }
}
```

# F. Vessels, Heights and Two Versions (Hard Version)

## 大致题意

有一个 $n$ 个柱子组成的一个环形的接水容器，现在要求计算：要求某两个相邻的柱子之间没有水，整个容器最多可以承接多少水

## 思路

首先，观察数据量，显然这道题至少需要在 $O(n log n)$ 时间内，完成 $n$ 个数据计算，那么可以得到，只有两种可能：

1. 纯离线计算出所有结果
2. 前一个数据可以通过一定代码推导至下一个结果，且耗时不超过 $O(log n)$

显然看起来 2 方案更可靠一些，我们需要往这个方向考虑。

首先环状的柱子理解较为困难，实际上我们可以考虑将其拆开：沿着不允许有水的两根柱子之间的位置剪开后，可以得到一个水平的柱子图

由于恰好这两个边缘的柱子虽然本来相邻，但是因为他们中间不允许有水，那么其实问题就变成了：

- 计算当前的水平柱子群能最多维持多少水不往两侧流出（两侧其实就是那个不允许的装水的两个柱子之间的部分）
- 将第一个柱子挪到最后，重新计算

单独计算一次（独立一次计算）非常容易，就像普通的接雨水那样做就行，那么显然，我们需要计算清楚：

- 第一个柱子移开后，会导致多少水丢失
- 第一个柱子放到最后后，会带来多少水

接下来是关于这个问题的一些重要的分析思路

### 柱子贡献

我们需要计算每一根柱子的贡献，我们有两种方式，以下面的例子为例

方案一：

> 柱高:  5   3   1   5
> 水高:    5   5   5
> 贡献:  9   5   1   0

方案二：

> 柱高:  5   3   1   5
> 水高:    5   5   5
> 贡献: 15   0   0   0

显然方案二下，计算贡献更简单，且适合单调数列来完成计算，但是每次移动柱子则需要更多的计算成本：即还原回方案一

而方案一的计算代价则较大。我选择了方案二进行计算

### 单调数组

所有的水池会呈现一种抛物曲线形状，例如：$123454321$ 的两端矮，中间高的情况。所以我们在计算的过程中，必然需要从原始数组中提取双向的单调数组

显然，我们取最高的那一个（如果有多个则任取其一）作为固定的点：
左边采用递增数组，右边使用递减数组，就可以很好的维护当前的水位——对于单调数组的每两项相邻值
使用这两个值的下标之差 $\times$ 两个值中的较小者，就是这块维护起来的水池

### 偏移法

首先，显然，计算每次需要解散、新增的水池，需要做两个事情：计算高度、计算距离。
- 距离非常容易，即相邻单调数组的相邻两个值的下标差。
- 但是高度却比较难。
  - 虽然看起来，在单调数组内，我们直接取相邻数据中，较小的那个就行。
  - 但是实际操作中会发现一种情况，即被认为最高的那个柱子发生移动
  - 此时，所有的单调数组就都无效，且需要全部重建：
  - 因为左边肯定已经空了，而右边又突然增加了一个最大的值导致递减数列变成唯一项了（我们的递减数列要求最后一项必须在数组中）

这显然不符合简单设计原则，我的做法是：考虑到循环问题，我们直接将数组拷贝一份，将原来的 $n$ 长度的数组变为 $2n$ 长度，这样循环的过程，就变成了在这个 $2n$ 上截取一度 $n$ 长度的内容，每次移动及将窗口右移一格

同样的，我们可以直接强制设定初始的 $n$ 为 $i \to j$，其中 $j$ 为最大值的下标，这样我们就不存在将这个最大值进行挪动了：它开始在最后面，结束在最前面，恰好完成一轮答案计算

那么我们可知：所有数据最开始都在左边的递增单调数组，右边的为空数组

### 还原贡献

> 柱高:  5   3   1   5
> 水高:    5   5   5
> 贡献: 15   0   0   0

回到刚刚这个问题，我们还需要解决一个事情是：如何在将 $5$ 移动到最后的过程中，正确还原 $3$、$1$ 的贡献：

这个办法就在最初构建左侧的单调数组的过程中：因为当 $5$ 加入的时候 $3$ 被移除。我们只需要记录这个移除的事件，当 $5$ 被移除的时候，还原这些被移除的值就行。

而因为我们选择了方案二，贡献计算非常简单：当 $3$ 被移回的时候，左边的数组变成 $3(index: 1), 5(index: 3)$，那么可以直接用最小高度 $\times$ 下标差来实时计算贡献

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
        for (int i = 0; i < n; ++i) cin >> data[i];
        int max_index = 0;
        for (int i = 1; i < n; ++i) max_index = data[i] >= data[max_index] ? i : max_index;
        max_index += max_index == n - 1 ? 0 : n;
        vector<int> l, r, ans(n);
        vector<list<int>> pops(n);
        l.reserve(n);
        r.reserve(n);
 
        auto c_len = [&](int x, int y) {
            x %= n;
            y %= n;
            if (y > x) return y - x;
            else return y - x + n;
        };
 
        // push left
        int cur = 0;
        for (int i = max_index - 1, j = 1; j < n; --i, ++j) {
            while (!l.empty() && data[i % n] > data[l.back() % n]) {
                const int p = l.back();
                pops[i % n].push_back(p);
                l.pop_back();
                const int hei = data[p % n];
                const int len = c_len(p, l.empty() ? max_index : l.back());
                cur -= hei * len;
            }
 
            const int hei = data[i % n];
            const int len = c_len(i, l.empty() ? max_index : l.back());
            cur += hei * len;
            l.push_back(i);
        }
        ans[(max_index + 1) % n] = cur;
        for (int i = max_index + 1 - n, j = 1; j < n; ++i, ++j) {
            // remove l
            l.pop_back();
            int hei = data[i % n];
            int len = c_len(i, l.empty() ? max_index : l.back());
            cur -= hei * len;
 
            // add pops
            for (auto iter = pops[i % n].rbegin(); iter != pops[i % n].rend(); ++iter) {
                hei = data[*iter % n];
                len = c_len(*iter, l.empty() ? max_index : l.back());
                cur += hei * len;
                l.push_back(*iter);
            }
 
            // add r
            while (!r.empty() && data[r.back() % n] < data[i % n]) {
                const int p = r.back();
                r.pop_back();
                hei = data[p % n];
                len = c_len(r.empty() ? max_index : r.back(), p);
                cur -= hei * len;
            }
 
            hei = data[i % n];
            len = c_len(r.empty() ? max_index : r.back(), i);
            cur += hei * len;
            r.push_back(i % n + n);
            ans[(i + 1) % n] = cur;
        }
 
        for (int i = 0; i < n; ++i) cout << ans[i] << " \n"[i == n - 1];
    }
}
```
