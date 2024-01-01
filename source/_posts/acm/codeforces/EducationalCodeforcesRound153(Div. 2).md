---
title: Educational Codeforces Round#153 (Div. 2)
date: 2023-08-20 00:02:09
updated: 2023-08-20 00:02:09
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Not a Substring

## 大致题意

需要构建一个只有小括号构成的字符串，既满足括号匹配，同时不存在一个子串等同于给出的一个字符串

## 思路

实际上很简单，只需要取 `()()()()` 模式 和 `(((())))` 这两种即可，因为这两种模式的唯一相同的子串就只有一对 `()`，而若需要一个满足括号匹配的字符串，那么必然存在 `()`，故这两种模式就可以应对所有情况

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string str, ans;
        cin >> str;
        ans.resize(str.size() << 1);
        for (int i = 0; i < str.size(); ++i) ans[i] = '(';
        for (int i = 0; i < str.size(); ++i) ans[i + str.size()] = ')';
        if (strstr(ans.c_str(), str.c_str()) == nullptr) {
            cout << "YES" << endl;
            cout << ans << endl;
            continue;
        }
        for (int i = 0; i < str.size(); ++i) ans[i * 2] = '(';
        for (int i = 0; i < str.size(); ++i) ans[i * 2 + 1] = ')';
        if (strstr(ans.c_str(), str.c_str()) == nullptr) {
            cout << "YES" << endl;
            cout << ans << endl;
            continue;
        }
        cout << "NO" << endl;
    }
}
```

# B. Fancy Coins

## 大致题意

有 $a1$ 个 $1$ 元，$a2$ 个 $k$ 元，同时你可以“借来”无限量的 $1$ 元和 $k$ 元，问组成 $m$ 元最多需要借多少硬币

## 思路

简单卡一下边界，多一个 $k$ 元和少一个 $k$ 元的两种情况考虑一下即可，比较简单

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int m, k, a1, a2;
        cin >> m >> k >> a2 >> a1;
        m -= min(m / k, a1) * k;
        if (m <= a2) {
            cout << 0 << endl;
            continue;
        }
 
        int ls = (m - a2) / k;
        int ans = ls + (m - a2 - ls * k);
        if (m - (ls + 1) * k >= 0) ans = min(ans, ls + 1);
        cout << ans << endl;
    }
}
```

# C. Game on Permutation

## 大致题意

有一个数组，开始位置可以是任意的一个下标，每次可以移动到当前位置左边的任意一个值小于当前的位置。

两个人依次操作，谁最后无法进行操作了，谁胜利，问放在哪些位置，可以保证第二个开始操作的胜利

## 思路

假如说我摆放在一个位置，然后可以通过 $3$ 个依次操作达到最终无法移动（例如 $a \rightarrow b \rightarrow c \rightarrow d$），那么此时应该说第二个移动的人胜利

但是这个操作是可跳过的，因为你可以移动 $3$ 次，那么就必然可以一次移动到底，因为一定也符合题意，那么第一个移动的人为什么要遵循一个个移动呢，他完全可以直接 $a \rightarrow c$，然后第二个操作的人只能移动到 $d$，然后输了游戏

所以必须卡在一些只能移动一次的地方，否则就有可乘之机。

那么就必须保证选择的点满足

 - 大于左边最小的值
 - 小于左边之前确认的满足条件的点

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, ans = 0, curMin = INT_MAX, curMax = INT_MAX;
        cin >> n;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp < curMin) curMin = tmp;
            else if (tmp > curMin && tmp < curMax) {
                ans++;
                curMax = tmp;
            }
        }
        cout << ans << endl;
    }
}
```
