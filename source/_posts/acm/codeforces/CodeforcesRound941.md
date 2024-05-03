---
title: Codeforces Round 941 (Div. 2)
date: 2024-05-03 23:47:21
updated: 2024-05-03 23:47:21
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 941 (Div. 2) 个人写题记录
#index_img:
---

**从本篇开始，代码仅包含核心逻辑部分，多组数据的逻辑也将不再包含**

# A. Card Exchange

## 大致题意

有开始的 $n$ 张牌，每张牌有点数，可能相同也可能不同

允许进行如下操作：选择 $k$ 张相同的牌，弃掉，然后再摸进来 $k-1$ 张任意点数的牌

问最少可以剩下多少张牌

## 思路

每次操作就可以整来 $k - 1$ 张的任意牌，所以只需要将任意牌单独计数，暴力循环找可以进行操作的点数，在包含任意牌的情况下，是否可以进行操作，能操作就操作

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, k, cnt[101] = {};
        cin >> n >> k;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            ++cnt[tmp];
        }

        int tot = 0;
        while (true) {
            bool flag = true;
            for (int i = 1; i < 101; ++i) {
                if (cnt[i] + tot >= k) {
                    if (k - cnt[i] % k <= tot) {
                        tot -= k - cnt[i] % k;
                        cnt[i] += k - cnt[i] % k;
                    }
                    flag = false;
                    tot += (cnt[i] / k) * (k - 1);
                    cnt[i] %= k;
                }
            }

            if (flag) break;
        }

        for (int i: cnt) tot += i;
        cout << tot << endl;
    }
}
```

# B. Rectangle Filling

## 大致题意

有一个矩阵，每个位置有黑色和白色两种情况，允许进行如下操作

在矩阵里选择两个相同的颜色的节点，将这两个节点组成的矩阵内的所有颜色变成和这两个节点的颜色相同

问是否能够通过任意次数的操作，使得整个矩阵变成完全相同的颜色的矩阵

## 思路

容易得出如下结论：

- 若一个矩阵的一个对角顶点颜色相同，则必然可以通过一次操作完成
- 若一个矩阵的一条边的两端颜色相同，且对边存在一个点的颜色和这两端相同，则可以通过两次操作完成

其他情况均不可能

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<string> mp(n);
        for (auto &i: mp) {
            i.resize(m);
            cin >> i;
        }
        if (mp[0][0] == mp[n - 1][m - 1] || mp[n - 1][0] == mp[0][m - 1]) {
            cout << "YES" << endl;
            continue;
        }
        bool flag = false;
        if (mp[0][0] == mp[n - 1][0]) for (int i = 0; i < n; ++i) if (mp[0][0] == mp[i][m - 1]) flag = true;
        if (mp[0][m - 1] == mp[n - 1][m - 1]) for (int i = 0; i < n; ++i) if (mp[0][m - 1] == mp[i][0]) flag = true;

        if (mp[0][0] == mp[0][m - 1]) for (int i = 0; i < m; ++i) if (mp[0][0] == mp[n - 1][i]) flag = true;
        if (mp[n - 1][0] == mp[n - 1][m - 1]) for (int i = 0; i < m; ++i) if (mp[n - 1][0] == mp[0][i]) flag = true;

        cout << (flag ? "YES" : "NO") << endl;

    }
}
```

# C. Everything Nim

## 大致题意

有 $n$ 个石头堆，Alice 和 Bob 玩游戏，轮流进行取石子，
每次取的时候，必须选择一个 $k$，满足现在有石头的石头堆中，石头数量最少的那个堆也有 $k$ 个石头
然后在每一堆里都同时取走 $k$ 个石头

谁最后没办法取石头，谁就输了，问最后谁赢了

## 思路

首先，每次从所有堆里进行删除，可以等价将所有的石头堆排序后，变成差值堆，且必须从第一个石头堆开始取

那么问题就变成了：有一组石头堆，必须从第一个石头堆里开始取，每次可以取任意个数，问最后谁会取最后一次

这就很简单了，因为如果这个石头堆是 $1$ 个，那么大家都没得选，就是交换一下先后手，但是如果不是一个，那么就必然此时操作的人，可以是否要先手还是后手了，
因为此时他可以选择取到只剩下一个或者一个都不剩下，就可以实现交换先后手
所以核心是谁拿到了第一个先后手交换权，谁就能操纵整个游戏

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (auto &i: data) cin >> i;
    sort(data.begin(), data.end());
    if (data[0] != 1) {
        cout << "Alice" << endl;
        return;
    }
    int cnt = 1;
    for (int i = 1; i < n; ++i) if (data[i] - data[i - 1]) {
        if (data[i] - data[i - 1] == 1) ++cnt;
        else {
            ++cnt;
            break;
        }
    }
    cout << (cnt % 2 ? "Alice" : "Bob") << endl;
}
```

# D. Missing Subsequence Sum

## 大致题意

需要构造一个数列，满足

- 对于 $k$，无法从数组中找到任何一个子序列，使得序列之和等于 $k$
- 对于 $i \in [1, n] \space and \space i \neq k$，必定从数组中找到任何一个子序列，使得序列之和等于 $k$

## 思路

如果不考虑不能构造 $k$ 的情况，其实相当简单，即都是 $2^x$ 即可，即二进制上考虑

接下来是考虑如何构造不出 $k$。首先假定一下 $k > 1$，后面再单独讨论 $1$ 的情况

那么必然可以分为两个部分 $[1, k - 1]$ 和 $[k + 1, n]$

我们很容易得到这样一个结论：假如可以组成 $1$ 和 $k - 1$ 的话，如果组合一下必然可以得到 $k$，如果要组合不出来，
必定 $k - 1$ 中包含了 $1$ 的必要元素，同理，$k - 2$ 也可以如此推理，这样可以得到非常多的关系链

但是这些关系链重要吗，并不，因为太多太乱太无意义了，但是反而可以得到这样一个结论：如果所有小于 $k$ 的值之和是超过 $k$ 的，那么很容易能够找到一个组合，可以得到 $k$

所以只需要背着这条结论走即可，即刚好将比 $k$ 小的所有值加起来都比 $k$ 小即可，这样就可以构造出 $[1, k - 1]$ 的全部值了，
然后再加入一个 $k + 1$ 即可完成后面部分

不过稍微可能需要注意的需要再加入一个值，因为 $k$ 本身被排除在外了，所以这可能会导致原来依赖 $k$ 的值无法组成，
例如，如果 $k = 4$，那么 $6$ 就是一个很难组成的值，因为唯一包含第 $3$ 个比特位是 $1$ 的值就被干掉了，所以需要补充一个来避免这个问题

## AC code

```cpp
void solve() {
    int n, k, tot = 0, nxt = 1;
    cin >> n >> k;
    vector<int> ans;
    ans.reserve(25);
    bool flag = true;
    while (tot < n) {
        if (flag && tot + nxt >= k) {
            ans.push_back(k - tot - 1);
            ans.push_back(k + 1);
            ans.push_back(k + (nxt << 1));
            flag = false;
        } else ans.push_back(nxt);

        tot += nxt;
        nxt <<= 1;
    }
    cout << ans.size() << endl;
    for (int i = 0; i < ans.size(); ++i) cout << ans[i] << " \n"[i == ans.size() - 1];
}
```
