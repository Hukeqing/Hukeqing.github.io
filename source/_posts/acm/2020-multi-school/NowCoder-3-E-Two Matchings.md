---
title: 2020牛客暑期多校训练营（第三场）E-Two Matchings——复杂思维与简单dp
date: 2020-07-18 17:01:23
categories:
  - ACM&算法
tag:
  - ACM
  - NowCoder
math: true
---

# E-Two Matchings

~~比赛期间写博文，队友我家挖祖坟~~

~~数论只会g c d，队友AC我挂机~~

[题目连接](https://ac.nowcoder.com/acm/contest/5668/E)  

**注意本文中的部分字母和原文稍有不同，请注意！**

# 题意
定义序列 $a$ ，满足如下要求

 - 长度为 $n$ 的序列 $a$ 由 $1, 2, 3... n$ 组成
 - $a_{a_i} = i$
 - $a_i \neq i$

定义一个字符串的费用为$\sum\_{i=1}^{n}w\_i - w\_{a\_i}/2$ ， $w$ 为给出的权值数组

求两个满足上述对序列 $a$ 的描述的序列 $p, q$，同时还要满足 $p\_i \neq q\_i$ 对于每一个 $i$ 都成立

则这两个序列的费用和的最小值是多少

# 分析
根据条件

 - 长度为 $n$ 的序列 $a$ 由 $1, 2, 3... n$ 组成
 - $a_{a_i} = i$
 - $a_i \neq i$

可以得到序列是由基础序列 $1, 2, 3...n$ 通过进行两两对调得到，且每个值进行且只进行一次对调。（这里就不仔细证明了，应该……在打这个比赛的人应该都能理解吧）

而我们需要得到的就是两个费用最小的串，即最小串和次小串

**注意，接下来的讨论仅讨论排序后的下标，即如果写着 $1$ 则指代 sort 后的数组 $w$ 中最小的值**

## 最小值

首先是最小的值，那很明显，把 `w` 数组排序后，间隔着相减就可以得到，例如下面已经排序后的**下标**序列：
$$1, 2, 3, 4, 5, 6$$
我们可以得到其最小的解为
$$(2 - 1) + (4 - 3) + (6 - 5)$$
我们暂时不去处理这个解，保留原样

## 次小值

接下来是次优解，首先应当保证其每一位的值不相同

由于我们已经将最小值的组合取完了，则次优解就有了非常多的限制

我们可以“旋转”这个数列得到

$$2, 3, 4, 5, 6, 1\rightarrow (3 - 2) + (5 - 4) + (6 - 1)$$

把这个“旋转”暂时称为 $6-rotation$，指代 $6$ 个元素的旋转

而此时即为次优的解。

## 证明
我们以六个数字的数列来证明上述操作

首先用 $-$ 表示这个值作为其所在的交换中的较小值， $+$ 表示这值作为其所在的交换中的较大值

例如最小值可以表示为
| 1 | 2 | 3 | 4 | 5 | 6 |
|--|--|--|--|--|--|
| - | + | - | + | - | + |

我们并不需要具体考虑哪个值与哪个值交换，因为最终的求和结果是一样的，即上面的值与下面的符号结合后相加就是最终结果。

除去最小解后，我们只有以下两种组合方法

| 下标 | 1 | 2 | 3 | 4 | 5 | 6 |
|--|--|--|--|--|--|--|
| 最小值 | - | + | - | + | - | + |
| 方案1 | - | - | + | - | + | + |
| 方案2 | - | - | - | + | + | + |
| 错误方案 | - | - | + | + | - | + |

这里举例一个错误的方案，虽然看起来此方案是与最小值方案不同，但是注意一下最后两个值，无论这个错误方案怎么组合，$5-6$ 必然要发生组合并发生交换，则与最小值的方案出现重复，则不行。

那么我们比较一下这两个方案哪个更优

$$\frac{方案1}{方案2} = \frac{-1-2+3-4+5+6}{-1-2-3+4+5+6} = \frac{-1}{1} $$

**（使用分数线仅用于视觉上更好的体现上下的对比效果，并无除法运算思想，下同）**

注意，这里不能取 $abs$ 因为在配对的时候我们已经保证了右边的加号匹配左边的减号，即必定为正数

很明显，方案1更优，即上方的次优解

（感谢 [@yyymmmi](https://www.nowcoder.com/profile/248983965) 和 [@hnust_zhangpeng](https://www.nowcoder.com/profile/841902884) 指出错误，现已更正）

## 合并最小值和次小值

我们将两个解相加发现最终结果为

$$[(2 - 1) + (4 - 3) + (6 - 5)] + [(3 - 2) + (5 - 4) + (6 - 1)] =2 * (6 - 1)$$

## 长度不及 $6$ 的时候

而对于长度仅为 $4$ 的串，只能 $4-rotation$ ，即

$$1, 2, 3, 4  \rightarrow (4-rotation)\rightarrow 2, 3, 4, 1 \rightarrow (3 - 2) + (4 - 1)$$

此时的最终结果为（过程忽略）

$$2 * (4 - 1)$$

## 长度为$8$的时候

那么我们再往长度增长的方向考虑，当 $n  = 8$ 时，我们有两个方案，

1. 两个 $4-rotation$ （ $1234$ 和 $5678$ ）来旋转它
2. 两个 $4-rotation$ （ $1278$ 和 $3456$ ）来旋转它
3. 一个 $8-rotation$ 来旋转它

**注意，此题是不存在 $2-rotation$ 的，因为这毫无意义，所以 $n = 8$ 时，没有一个 $6-rotation$ 和一个 $2-rotation$ 这样的组合。**

先比较一下两个 $4-rotation$：

$$\frac{方案1}{方案2} = \frac{2 * [(4 - 1) + (8 - 5)]}{2 * [(8 - 1) + (6 - 3)]} = \frac{12}{20}$$

我们选择使用方案 $1$

接下来是方案 $1$ 和方案 $3$ 的比较

$$\frac{方案1}{方案3} = \frac{2 * [(4 - 1) + (8 - 5)]}{2 * [(8 - 1)]} = \frac{12}{14}$$

此时证明得到方案 $1$ 在三个方案内最优，此时 $n  =8$ 时的答案为：

$$2 * [(4 - 1) + (8 - 5)]$$

同时我们得到了一个结论：仅存在 $4-rotation$ 和 $6-rotation$ 两种旋转，如果存在 $8-rotation$ 则可以将此 $8-rotation$ 分解为两个 $4-rotation$ 可以更优。

## 长度更长的时候

当 $n \geq 10$ 时，即可以将整个串分解成多个 $4-rotation$ 和多个 $6-rotation$ 组成。

那么得到了 $dp$ 的递推公式：`dp[i] = min(dp[i - 4] + v[i - 1] - v[i - 4], dp[i - 6] + v[i - 1] - v[i - 6])` 

注意 $dp$ 的初始值有三个：$n = 4, n = 6, n = 8 \space (防止n = 8的时候出现2-rotation)$

# AC code

```cpp
#include <bits/stdc++.h>

using namespace std;

long long dp[200100];

void solve() {
    int T;
    cin >> T;
    for (int ts = 0; ts < T; ++ts) {
        int n;
        cin >> n;
        vector<long long> v;
        for (int i = 0; i < n; ++i) {
            long long tmp;
            cin >> tmp;
            v.push_back(tmp);
        }
        sort(v.begin(), v.end());

        dp[0] = 0;
        dp[4] = v[3] - v[0];
        dp[6] = v[5] - v[0];
        dp[8] = v[7] - v[4] + dp[4];
        for (int i = 10; i <= n; i += 2)
            dp[i] = min(dp[i - 4] + v[i - 1] - v[i - 4], dp[i - 6] + v[i - 1] - v[i - 6]);
        cout << dp[n] * 2 << endl;
    }
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    int test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        if (acm_local_for_debug == '$') exit(0);
        cin.putback(acm_local_for_debug);
        if (test_index_for_debug > 20) {
            throw runtime_error("Check the stdin!!!");
        }
        auto start_clock_for_debug = clock();
        solve();
        auto end_clock_for_debug = clock();
        cout << "Test " << test_index_for_debug << " successful" << endl;
        cerr << "Test " << test_index_for_debug++ << " Run Time: "
             << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "--------------------------------------------------" << endl;
    }
#else
    solve();
#endif
    return 0;
}
```

~~事后发现其实代码有越界的问题……但是它AC了~~ 