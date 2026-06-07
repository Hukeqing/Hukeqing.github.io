---
title: Codeforces Round 1101 (Div. 2)
date: 2026-06-07 21:10:51
updated: 2026-06-07 21:10:51
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 1101 (Div. 2) 个人写题记录
index_img: /image/acm/codeforces/CodeforcesRound1101/D-1-2.png
---

# A. Convergence

## 大致题意

有 $n$ 个数轴上的点，每个点的值为 $a\_i$，每次可以选择任意两个点 $i, j$，让这两个点的值变成 $\in [a\_i, a\_j]$

问至少操作几次，才能让所有值相同

## 思路

由于是每次操作会让两个值可以变为其中间的任意值，所以如果要最终值尽可能相同，肯定是建议选定一个值，使得小于等于这个值的数量接近于大于这个值的数量

所以可以考虑排序后，直接取中间那个值作为目标值，如果是奇数那么直接取中间的值，如果为偶数就两个都试一下

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n);
        for (int i = 0; i < n; ++i) cin >> a[i];
        sort(a.begin(), a.end());
 
        const auto check = [&](int target) {
            int l = 0, r = 0;
            for (int i = 0; i < n; ++i) if (a[i] > target) ++r; else if (a[i] < target) ++l;
            return max(l, r);
        };
 
        if (n & 1) cout << check(a[n / 2]) << endl;
        else cout << min(check(a[n / 2]), check(a[n / 2 - 1])) << endl;
 
    }
}
```

# B. Cake Leveling

## 大致题意

有一个蛋糕，每一个位置有一个高度($a\_i$)。现在将一把刀设置在高度 $h$ 上，然后平行挪动刀

- 如果当前位置的值高于刀的位置，那么多余的部分会记入下一个位置
- 如果当前是最后一个位置，那么多余的部分就会被丢弃

问：对于每一个子串 $\forall x \in [1, n], a\_1, a\_2, a\_3, \dots, a\_x$，最大的 $h$ 是多少

## 思路

有点类似括号匹配，对于每一个子串，可以考虑贪心想法：
- 如果上一个位置的答案为 $h\_{i-1}$，那么 $h\_i \leq h\_{i-1}$
- 如果之前剩余的蛋糕部分能够让当前的的位置满足 $h\_{i-1}$，那么就可以得到 $h\_i = h\_{i-1}$
- 如果不满足，则需要考虑降低 $h\_i$，设降低为 $x$，即 $v\_{之前剩余} + a\_i + (i - 1) \times x \geq h\_{i} - x$
- 得到 $x \geq \frac{h\_{i-1} - a\_i - v\_{之前剩余} + i}{1 + i}$

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> a(n);
        for (int i = 0; i < n; ++i) cin >> a[i];
 
        int last = 0, height = a[0];
        for (int i = 0; i < n; ++i) {
            if (a[i] >= height) last += a[i] - height;
            else {
                if (last + a[i] >= height) last -= height - a[i];
                else {
                    const int require = (height - a[i] - last + i) / (1 + i);
                    last += require * i;
                    height -= require;
                    last -= height - a[i];
                }
            }
            cout << height << "\n "[i == n - 1];
        }
    }
}
```

# C2. Seating Arrangement (Hard Version)

## 大致题意

有一个排好队的人，分为下面三类：
- I 人，只允许坐到空桌子上
- E 人，只允许坐到非空的有空桌子上
- A 人，无所谓坐哪

现在给出桌子数量和每张桌子能坐的人数量，问：按照顺序坐下的情况下，如何保证坐下的人最多

## 思路

想清第一个思路：如果当前队伍首位不是 E 人，且当前没有非空的有空桌子，那么就必须找张空桌子给他坐

> 因为如果首个位置要留给后面的 I 人，那么这个 A 人就得放弃（前面没有非空的有空桌子）
> 那为什么不选择让这个 A 人坐下，放弃后面那个 I 人，这样这个 A 人和 I 人之前的 E 人就有机会找到座位
> 这两个方案代价一致，但是带来收益完全可以被覆盖，故上面这条成立

然后只需要从前往后大模拟即可
- 如果是 I 人，尝试找空桌子，否则放弃
- 如果是 E 人，尝试找非空的有空桌子，否则：
  - 拉一个之前坐到非空的有空桌子上的 A 人，让它去找个空桌子，这个 E 人坐到这个 A 人的位置上
- 如果是 A 人，尝试找非空的有空桌子，否则直接坐到空桌子上

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x, s;
        cin >> n >> x >> s;
        string p;
        p.resize(n);
        cin >> p;
 
        int ans = 0, ms = 0, ma = 0;
        for (int i = 0; i < n; ++i) {
            if (p[i] == 'A') {
                if (ms) {
                    --ms;
                    ++ma;
                    ++ans;
                } else if (x) {
                    --x;
                    ms += s - 1;
                    ++ans;
                }
            } else if (p[i] == 'I') {
                if (x) {
                    --x;
                    ms += s - 1;
                    ++ans;
                }
            } else {
                if (ms) {
                    --ms;
                    ++ans;
                } else if (ma && x) {
                    --ma;
                    --x;
                    ms += s - 1;
                    ++ans;
                }
            }
        }
        cout << ans << endl;
    }
}
```

# D. Magical Tiered Cake

## 大致题意

这是一个汉诺塔题，但是，正常情况下，每一个块必须是上面没有其他块的时候才可以移动，而这里变成了：
上面必须恰好要有 $a\_i$ 块的时候，$i$ 才能移动，且仅移动 $i$ 本身（不移动其上面的部分）

## 思路

要解决这道题，必须想明白汉诺塔本身的原理，以下是我对汉诺塔的理解

> 我们定义当前汉诺塔有三个柱子：base(当前所在的), tmp(用来华容道的), target(目标移动到的)
> 对于有 $n$ 个块的汉诺塔，我们可以得到两个显而易见的结论：
> > 1. 对于方块 $n$，无论它在哪，并不影响其他的方块移动：因为它是最大的那个方块，任何方块都可以放到它上面，它相当于基座
> > 2. 汉诺塔的三座塔等价，即在任何时候，如果 $\exists$ 一种操作，可以将 $x$ 高度的汉诺塔从 base 移动到 target，那么必然存在几乎相同的操作将其移动到 tmp
>
> 所以我们可以得到如下的汉诺塔递推公式：
> - 假定有一种方式，可以将 $n - 1$ 的汉诺塔，从 base 移动到 target
> - 那么对于 $n$ 而言，可以先将 $n - 1$ 按照之前的方式移动到 tmp
> - 然后将 $n$ 移动到 target
> - 最后将之前移动到 tmp 的 $n - 1$ 再执行一次 $n - 1$ 的汉诺塔操作，移动到 target，即块 $n$ 上
> - 得到汉诺塔的递归公式：$a\_i = 2 \times a\_{i-1} + 1$
> - 其中 $a\_1 = 1$
>
> 通常情况下，我们会使用递推公式直接计算通项公式或者直接算出目标值，事实上，我们仍然可以使用递归来真实计算

本题我们会使用汉诺塔的递归计算的方式来解决这个问题

普通汉诺塔中，我们定义 $f(x)$ 表示：若需要将 $1 \to x$ 这 $x$ 块从 base 移动到 target 需要的步数

这里由于需要考虑到拆分（需要保留一些块在当前块上，当前块才可以移动）
所以我们定义一个新的 $g(i, j)$ 表示：初始且保持 $1 \to (j - 1)$ 在 tmp 的情况下，让 $j \to i$ 这 $i - j + 1$ 块从 base 移动到 target 需要的步数

显然，问题的答案为 $g(n, 1)$

接下来我们来定义如何移动来达成目标：

### 场景1（$i - j \geq a\_{i}$）

此时我们可以得到类似如下图的结构

![D-1-1.png](/image/acm/codeforces/CodeforcesRound1101/D-1-1.png)

注意：其中除了 X 行单独指代第 $i$ 行汉诺塔，其他每一行可以理解为一个独立的汉诺塔

此时 A 块表示的就是 $1 \to (j - 1)$ 块部分，而 B + C + X 表示 $j \to i$ 部分
其中 X 表示就是第 $i$ 行， C 表示 $a\_i$ 部分，而 B 就是多出来的部分

现在我们需要达成：A 保持在原地，B + C + X 移动到 target

那么，显然的移动方式是：

{% raw %}
$$
\begin{matrix}
A \to target \\
B \to tmp \\
A \to tmp \\
X \to target \\
C \to target \\
A \to base \\
B \to target\\
A \to tmp
\end{matrix}
$$
{% endraw %}

![D-1-2.png](/image/acm/codeforces/CodeforcesRound1101/D-1-2.png)

注意，我们需要让 A 保持在原地（tmp）否则不满足我们 $g(i, j)$ 的定义了

### 场景2（$i - j < a\_{i}$）

那么此时就要反过来，我们需要找别人借一些方块才能移动

![D-2-1.png](/image/acm/codeforces/CodeforcesRound1101/D-2-1.png)

注意：其中除了 X 行单独指代第 $i$ 行汉诺塔，其他每一行可以理解为一个独立的汉诺塔

其中 X 表示就是第 $i$ 行，此时 C + X 块表示的就是 $j \to i$ 块部分
而 A + C 恰好为 $a\_i$，A + B 为 $1 \to (j - 1)$，B 为剩余部分

那么我们应该如下操作

{% raw %}
$$
\begin{matrix}
A \to base \\
X \to target \\
A \to tmp \\
C \to target
\end{matrix}
$$
{% endraw %}

![D-2-2.png](/image/acm/codeforces/CodeforcesRound1101/D-2-2.png)

### 场景3（$0 = a\_{i}$）

这个就交给各位考虑了，这种其实就是原始的汉诺塔了，根据上面的方法给出推论也非常简单，这里不再赘述

至于 A、B、C 内部怎么操作，那么就交给递归来完成吧

最后，需要根据实际执行的步骤，合并相同操作中，重复的部分：同一块从 base 移动到 tmp 又移动到 target 这种操作，即可得到答案

## AC code

```cpp
using namespace std;
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; ++i) cin >> v[i];

        bool ok = true;
        for (int i = 0; i < n; ++i) if (v[i] > i) ok = false;
        if (!ok) {
            printf("NO\n");
            continue;
        }
 
        vector<tuple<int, int, int>> ans;
        ans.reserve(1 << (n + 1));
        // if [j, i] is on base, [0, (j - 1)] on tmp, make [j, i] into target and [0, (j - 1)] into base
        int deep = 0;
        const function<void(int, int, int, int, int)> mv = [&](int i, int j, int base, int target, int tmp) {
            if (i < j) return;
            ++deep;
            // if (i != j) cerr << deep << ' ' << i << ' ' << j << ' ' << base << ' ' << target << endl;
            if (i == j && v[i] == 0) {
                ans.emplace_back(i, base, target);
            } else if (v[i] == 0) {
                mv(j - 1, 0, tmp, target, base);
                mv(i - 1, j, base, tmp, target);
                mv(j - 1, 0, target, tmp, base);
                ans.emplace_back(i, base, target);
                mv(j - 1, 0, tmp, base, target);
                mv(i - 1, j, tmp, target, base);
                mv(j - 1, 0, base, tmp, target);
            } else if (i - j >= v[i]) {
                mv(j - 1, 0, tmp, target, base);
                mv(i - 1 - v[i], j, base, tmp, target);
                mv(j - 1, 0, target, tmp, base);
                // cerr << "MOV" << ans.size() << ' ' << i << ' ' << base << ' ' << target << endl;
                ans.emplace_back(i, base, target);
                mv(i - 1, i - v[i], base, target, tmp);
                mv(j - 1, 0, tmp, base, target);
                mv(i - 1 - v[i], j, tmp, target, base);
                mv(j - 1, 0, base, tmp, target);
            } else {
                const int need = v[i] - (i - j);
                mv(need - 1, 0, tmp, base, target);
                ans.emplace_back(i, base, target);
                mv(need - 1, 0, base, tmp, target);
                mv(i - 1, j, base, target, tmp);
            }
            --deep;
        };
 
        mv(n - 1, 0, 1, 3, 2);
        // merge
        int r = 0;
        for (int i = 1; i < ans.size(); ++i) {
            if (get<0>(ans[i]) != get<0>(ans[r])) {
                ++r;
                ans[r] = ans[i];
            } else {
                ans[r] = {get<0>(ans[r]), get<1>(ans[r]), get<2>(ans[i])};
                if (get<1>(ans[r]) == get<2>(ans[r])) --r;
            }
        }

        printf("YES\n%d\n", r + 1);
        for (int i = 0; i <= r; ++i) {
            auto [a, b, c] = ans[i];
            printf("%d %d %d\n", a + 1, b, c);
        }
    }
}
```
