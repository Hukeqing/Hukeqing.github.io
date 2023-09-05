---
title: Codeforces Round 890 (Div. 2)
date: 2023-08-12 01:13:51
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Tales of a Sort

## 大致题意

有个数列，每次操作可以将所有值减少 $1$，除非它已经是 $0$ 了，问需要多少次操作，才能将整个数列变成非递减数列

## 思路

很明显的一点，如果发现一对不满足条件的相邻对，即 $a\_i > a_{i + 1}$，如果不把他们都减少到 $0$ 的情况下，永远无法满足题目条件，故只需要找到不满足的对，然后取最大的那个值即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, last = 0, mx = 0, tmp;
        bool ans = false;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            cin >> tmp;
            if (tmp < last) mx = max(mx, last);
            else last = tmp;
        }
        cout << mx << endl;
    }
}
```

# B. Good Arrays

## 大致题意

题目给出一个数组 $a$，要你判定是否存在另外一个数组 $b$，满足 $\sum\_{i=1}^n a\_i = \sum_{i=1}^n b\_i, \forall i \in [1, n], a\_i \neq b\_i, a\_i > 0, b\_i > 0$

## 思路

读题易得：若原来的值是 $1$，那么必须找别的值借 $1$ 才能保证 $a\_i \neq b\_i$，而其他值则都可以简单变成 $1$ 解决。故只需要计算有多少可以冗余调配的值即可

需要特判一下只有一个值的情况

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, cnt = 0, sum = 0;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            cnt += tmp == 1;
            sum += tmp;
        }
        cout << (cnt + n > sum || n == 1 ? "NO" : "YES") << endl;
    }
}
```

# C. To Become Max

## 大致题意

有一个初始数组 $a$，每次可以选择一个 $i \in [1, n - 1]$，若 $a[i] \leq a[i + 1]$ 则使得 $a[i] = a[i] + 1$，问在最多操作 $k$ 次的情况下，数组的最大值可以为多少

## 思路

注意到数据量，$n$ 仅有 $1000$，意味着复杂度可以达到 $n^2 log(1e9)$ 的级别，然后再做思考

按照公式，那么最终得到的数组，必定存在一个恰好递减的阶梯。另外很明显的是，数组的最后一个值必定不可动，那就意味着实际上最大值的可行性是被最后一个值限定的，最大值为 $a\_n + n - 1$

由于复杂度有非常大的冗余，故可以作出如下的暴力搜索

 - 遍历所有可能为最大值的下标 $i$
 - 二分查找最终的最大值
 - 尝试构建最大值的可能性，是否能够在 $k$ 消耗内，完成构建一个阶梯

这样下来恰好复杂度满足预期

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        int ans = 0;
        for (int i = 0; i < n; ++i) ans = max(ans, data[i]);

        for (int l = 0; l < n; ++l) {
            int b = ans, e = ans + k + 1;
            while (b + 1 < e) {
                int mid = (b + e) / 2;
                int cost = 0;
                bool keyPoint = false;
                for (int i = l; i < n && !keyPoint && cost <= k; ++i) {
                    if (data[i] >= mid - (i - l)) keyPoint = true;
                    else cost += mid - data[i] - (i - l);
                }
                if (keyPoint && cost <= k) b = mid;
                else e = mid;
            }
            ans = max(ans, b);
        }

        cout << ans << endl;
    }
}
```

# D. More Wrong

## 大致题意

交互题

有一个 $n$ 的排列 $a$，只知道长度 $n$，每次可以询问 $[l, r]$ 区间下，逆序对数量，每次询问的代价是 $(r - l)^2$，问如何在 $5 \times n^2$ 的代价下，找到最大值的下标

## 思路

区间逆序对，很容易想到归并排序

先得到两个简单的结论：

 - 若已知一个区间的逆序对数量，再最后加入一个元素，且没有改变逆序对数量，那么这个加入的元素必定是当前区间的最大值
 - 若已知一个区间的逆序对数量，再最前面加入一个元素，且增加了恰好等于原来元素个数的逆序对，则新加入的元素必定是当前区间的最大值

这两个结论显而易见，就不再解释

从归并排序的视角看，我们假定找到了一个区间前半部分的最大值的下标，又找到了后半部分最大值的下标，那么需要判断这两个值谁更大的时候，就可以通过上面的定律来判定，只需要两次查询即可

如此递归下去，可以得到最终的查询费用为
$$
2(n - 1)^2 + 2 \times 2(0.5n - 1)^2 + 2 \times 4(0.25n - 1)^2 + \dots \\
\leq 2n^2 + 4(0.5n)^2 +  8(0.25n)^2 + \dots \\
= 2(n^2 + 0.5n^2 + 0.25n^2 + \dots) \leq 4n^2 \leq 5n^2
$$

可以证得这个方法的消耗低于要求

## AC code

```
map<pair<int, int>, int> m;

int interactive(int l, int r) {
    auto iter = m.find({l, r});
    if (iter != m.end()) {
        return iter->second;
    }
    int temp;
    cout << "? " << l << ' ' << r << endl;
    cout.flush();
    cin >> temp;
    m.insert({{l, r}, temp});
    return temp;
}

int dfs(int l, int r) {
    if (l == r) {
        return l;
    }
    if (l + 1 == r) {
        return interactive(l, r) == 1 ? l : r;
    }
    if (l + 2 == r) {
        int lm = dfs(l,  l + 1);
        if (lm == l) {
            return interactive(l, r) == 1 ? r : l;
        } else return dfs(lm, r);
    }

    int mid = (l + r) >> 1;
    int lm = dfs(l, mid);
    int rm = dfs(mid + 1, r);
    if (lm + 2 >= rm) return dfs(lm, rm);

    int t1 = interactive(lm + 1, rm - 1);
    int t2 = interactive(lm, rm);
    return t2 >= t1 + rm - lm ? lm : rm;

}

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        m.clear();
        int n;
        cin >> n;
        int ans = dfs(1, n);
        cout << "! " << ans << endl;
    }
}
```

# E1. PermuTree (easy version)

## 大致题意

有一个树和一个 $n$ 的排列 $a$，求出使得满足 $a\_u < a_{lca(u, v)} < a\_v$ 这个等式的最多的排列下，满足多少次

## 思路

在树上并没有 $u, v$ 之分，实际上可以相互对掉，所以这棵树实际上需要尽可能满足二叉搜索树的结构才行，即每个节点下，左边的值都小于当前节点，右边的值都大于当前节点。

但是这不一定是一颗二叉树，而是多叉树，而在满足上述等式的情况下，则需要人为的将所有子节点划分为两份，一份大于一份小于。即，假如一个节点有 $3$ 个直接子节点，那么必定存在有两个直接的子节点的下的所有值都小于当前节点，同时另外一个直接子节点下的所有值都要大于此节点，那么最终的满足等式的量级为 $(cnt_1 + cnt_2) \times cnt_3$

而又因为划分的时候，总共的子节点数量之和是确定的，故需要尽可能对半分，那么就需要背包运算

而这又是树结构，所以只需要在树上 dp 上做背包 dp 即可

## AC code

```cpp
struct node {
    int v, nxt;
};

vector<node> edge(5010);
vector<int> head(5010);

int dp(vector<int> &pack) {
    if (pack.size() == 0) {
        return 0;
    }
    if (pack.size() == 1) {
        return 0;
    }
    if (pack.size() == 2) {
        return pack[0] * pack[1];
    }
    int sum = 0;
    for (int i : pack) sum += i;

    vector<int> dp(sum / 2 + 1, 0);
    for (int i : pack)
        for (int w = sum / 2; w >= i; --w)
            dp[w] = max(dp[w], dp[w - i] + i);

    int left = 0;
    for (auto i : dp) left = max(left, i);
    return left * (sum - left);
}

int tree(int index, int &cal) {
    int res = 1;
    vector<int> temp;
    for (int i = head[index]; i != -1; i = edge[i].nxt) {
        temp.push_back(tree(edge[i].v, cal));
    }
    cal += dp(temp);
    for (int i : temp) res += i;
    return res;
}

void solve() {
    int n;
    cin >> n;

    for (int i = 0; i <= n; ++i) head[i] = -1;
    for (int i = 1; i < n; ++i) {
        int tmp;
        cin >> tmp;
        edge[i] = {i + 1, head[tmp]};
        head[tmp] = i;
    }

    int ans = 0;
    tree(1, ans);
    cout << ans << endl;
}
```

