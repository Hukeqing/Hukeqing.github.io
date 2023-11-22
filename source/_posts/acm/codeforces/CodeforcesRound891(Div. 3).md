---
title: Codeforces Round 891 (Div. 3)
date: 2023-08-12 15:05:12
updated: 2023-08-12 15:05:12
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Array Coloring

## 大致题意

把一个数组里的值分成两组，让这两组的所有元素求和后，奇偶性一致

## 思路

只要判定原数组中奇数的个数就行了，奇数个数的奇数就肯定不行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, ans = 0;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ans += tmp % 2;
        }
        cout << (ans % 2 ? "NO" : "YES") << endl;
    }
}
```

# B. Maximum Rounding

## 大致题意

可以对一个数字进行无数次任意位置的四舍五入，问最大值可以是多少

## 思路

也是比较简单的，只需要从左往右找到第一个 $\geq 5$ 的值，并从此值开始往前一致进位，然后再判断进位后的是否 $\geq 5$，然后无限制的进位即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string str;
        cin >> str;
        for (int i = 0; i < str.size(); ++i) {
            str[i] -= '0';
            if (str[i] >= 5) {
                for (int j = i - 1; j >= 0; --j) {
                    if (str[j + 1] >= 5) {
                        str[j]++;
                        str[j + 1] = 0;
                    }
                    else break;
                }
                for (int j = i; j < str.size(); ++j) str[j] = 0;
                break;
            }
        }
        if (str[0] == 5) str[0] = 0;
        if (str[0] == 0) cout << '1';
        for (char i : str) cout << char(i + '0');
        cout << endl;
    }
}
```

# C. Assembly via Minimums

## 大致题意

有一个数组长度为 $n$，暂时不知道具体的内容，通过这个数组得到一个新数组，其中的每一项为 $\forall i \in [1, n], \forall j \in [1, n], min(a\_i, a\_j)$，求出一个可能的原数组

## 思路

反过来思考，假如一个原数组已经从小到大排序好了，那么通过这个方法会得到 $(n - 1)$ 个 $a\_0$，$(n - 2)$ 个 $a\_1$，$0$ 个 $a\_n$……以此类推，所以按照此规律反推即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, n2;
        cin >> n;
        n2 = n * (n - 1) / 2;
        map<int, int> cnt;
        for (int i = 0; i < n2; ++i) {
            int tmp;
            cin >> tmp;
            cnt[tmp]++;
        }

        int des = n - 1;
        vector<int> res;
        for (auto & iter : cnt) {
            while (iter.second > 0) {
                iter.second -= des;
                res.push_back(iter.first);
                des--;
            }
        }
        for (int re : res) cout << re << ' ';
        cout << res.back() << endl;
    }
}
```

# D. Strong Vertices

## 大致题意

给出两个数组 $a, b$，对于 $i \in [1, n], j \in [1, n], a\_i - a\_j \geq b\_i - b\_j$ 则在一个图中绘制边 $i \rightarrow j$ 的有向边，求问图中存在多少个点，满足这些点可以通过一条或者几条路径到达所有其他节点

## 思路

这道题迷惑性很强

首先需要变形一下公式，得到 $a\_i - b\_i \geq a\_j - b\_j$，这样是否存在边的情况，就直接和当前下标相关了。根据公式容易可以得到，若存在一个节点的 $a\_i - b\_i \geq max\_{j=1}^n(a\_j - b\_j)$ 的时候，那么就等于直接和所有其他点有边了

另外，通过上述公式还可以明显直到，压根不可能存在需要走两条路径的情况，因为所有点的可达点都必定满足 $a\_i - b\_i \leq a\_j - b\_j$（$i$ 为当前节点，$j$ 为可以达到的点），故只需要考虑最大的差值项即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data1(n), data2(n);
        for (int i = 0; i < n; ++i) cin >> data1[i];
        for (int i = 0; i < n; ++i) cin >> data2[i];
        vector<int> ans;
        int tmp = LONG_LONG_MIN;
        for (int i = 0; i < n; ++i) {
            if (data1[i] - data2[i] > tmp) {
                tmp = data1[i] - data2[i];
                ans.clear();
                ans.push_back(i);
            } else if (data1[i] - data2[i] == tmp) ans.push_back(i);
        }
        cout << ans.size() << endl;
        for (auto i : ans) cout << i + 1 << ' ';
        cout << endl;
    }
}
```

# E. Power of Points

## 大致题意

有一个数组 $a$

接下来需要计算一个值 `f(x)`，这个值的是这样计算的：

 - 对于数组中的每一项，求算一个区间 $[x, a\_i]$，可以得到 $n$ 个区间
 - 求出所有可能的正整数所命中的区间数量的和

需要求算 $\sum\_{i=0}^n f(a\_i)$

## 思路

排序一下

然后遍历数组，维护从这个值到下一个值，左右区间带来的贡献即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<pair<int, int>> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i].first;
        for (int i = 0; i < n; ++i) data[i].second = i;
        sort(data.begin(), data.end());
        int left = 0;
        int right = 0;
        for (int i = 0; i < n; ++i) right += abs(data[i].first - data[0].first) + 1;

        vector<pair<int, int>> res;
        res.emplace_back(data[0].second, left + right);
        for (int i = 1; i < n; ++i) {
            left += 1;
            right -= 1;
            int cap = abs(data[i].first - data[i - 1].first);
            left += cap * i;
            right -= cap * (n - i);
            res.emplace_back(data[i].second, left + right);
        }
        sort(res.begin(), res.end());
        for (auto i : res) cout << i.second << ' ';
        cout << endl;
    }
}
```

# F. Sum and Product

## 大致题意

有一个数组 $a$，给出 $q$ 次询问，每次询问 $x, y$ 两个值，问有多少对不同的 $i, j$ 满足 $i < j, a\_i + a\_j = x, a\_i \times a\_j = y$

## 思路

把公式化简了，其实就是二元一次方程求解，实际上很简单

## AC code

```cpp
#define int long long

int bf(int x) {
    int l = 0, r = 1e10 + 10;
    while (l + 1 < r) {
        int mid = (l + r) / 2;
        if (mid * mid == x) return mid;
        if (mid * mid < x) l = mid;
        else r = mid;
    }
    return l;
}

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        map<int, int> mp;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mp[tmp]++;
        }

        int q;
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int x, y;
            cin >> x >> y;
            int inner = x * x - 4 * y;

            int outer = bf(inner);
            if (outer * outer != inner) {
                cout << 0 << ' ';
                continue;
            }

            if ((x + outer) % 2 != 0) {
                cout << 0 << ' ';
                continue;
            }
            int l = (x + outer) / 2;
            int r = (x - outer) / 2;
            auto lIter = mp.find(l);
            auto rIter = mp.find(r);
            if (l == r) {
                int cnt = lIter == mp.end() ? 0 : lIter->second;
                cout << cnt * (cnt - 1) / 2 << ' ';
            } else cout << (lIter == mp.end() ? 0 : lIter->second) * (rIter == mp.end() ? 0 : rIter->second) << ' ';
        }
        cout << endl;

    }
}
```

# G. Counting Graphs

## 大致题意

这道题还是很不错的～

给出一颗树，树的边有权重

问在保证任意边权重不超过 $S$ 的情况下，有多少种不同的图，满足它的最小生成树一定是给出的树

## 思路

最小生成树很容易让人想到是否和边排序后 + 并查集操作有关

我们需要往图里加入一些无意义的边，比如权值大于树上最大权值的情况下，无论怎么加都是合理的

而核心需要考虑的就是，当使用的边权值小于等于树上的最大权值的情况下，还能加到哪里

回到这里提到的第二段：无意义的边。如果我们提取出这个生成树的子树，对于每一个子树，是否都可以使用这一条，即使这个权值小于树上的最大权值，但是只要它大于子树本身的最大权值即可

如此“分治”，只需要根据权值从小到大排序边，然后一条条加入图中，然后通过并查集来确认新多了多少条可以加的边，然后再考虑上可以加的权值种类，得到解

## AC code

```cpp
#define int long long

void solve() {
    int mod = 998244353;

    struct node {
        int u, v, c;
    };

    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, s;
        cin >> n >> s;
        vector<node> data(n - 1);
        for (int i = 0; i < n - 1; ++i) cin >> data[i].u >> data[i].v >> data[i].c;
        sort(data.begin(), data.end(), [&](node a, node b) { return a.c < b.c; });

        vector<int> fa(n + 1);
        vector<int> cnt(n + 1);

        for (int i = 0; i < fa.size(); ++i) {
            fa[i] = i;
            cnt[i] = 1;
        }

        function<int(int)> find = [&](int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); };
        function<int(int, int)> join = [&](int x, int y) {
            int fx = find(x), fy = find(y);
            if (fx == fy) return 0ll;

            fa[fx] = fy;
            int res = (cnt[fx] * cnt[fy] - 1);
            cnt[fy] += cnt[fx];
            return res;
        };

        function<int(int, int)> pow = [&](int n, int p) {
            int ans = 1, buff = n;
            while (p) {
                if (p & 1) ans = (ans * buff) % mod;
                buff = (buff * buff) % mod;
                p >>= 1;
            }
            return ans;
        };

        int ans = 1;
        for (int i = 0; i < n - 1; ++i) {
            int cCap = s - data[i].c, nC = join(data[i].u, data[i].v);
            ans *= pow(cCap + 1, nC);
            ans %= mod;
        }

        cout << ans << endl;
    }
}
```
