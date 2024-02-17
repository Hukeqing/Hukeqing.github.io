---
title: Educational Codeforces Round 160 (Rated for Div. 2)
date: 2024-02-17 13:04:43
updated: 2024-02-17 13:04:43
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Educational Codeforces Round 160 (Rated for Div. 2) 个人写题记录
---

# A. Rating Increase

## 大致题意

有两个分数，并列写在一起了，已知第一个分数一定小于第二个分数，问是否可能，并给出一种拆法

## 思路

找到第二个非 `0` 的值前面拆开就行，就是最优的情况

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        string str;
        str.reserve(10);
        cin >> str;
        int a[2] = {str.front() - '0', 0}, cur = 0;
        for (int i = 1; i < str.size(); ++i) {
            if (cur == 0 && str[i] != '0') {
                cur = 1;
            }
            a[cur] *= 10;
            a[cur] += str[i] - '0';
        }
        if (a[0] < a[1]) cout << a[0] << ' ' << a[1] << endl;
        else cout << -1 << endl;
    }
}
```

# B. Swap and Delete

## 大致题意

有一个 $01$ 字符串，允许选择一个字符进行删除（并消耗一点成本），或者交换两个值（不消耗成本），
问是否可以经过任意次数操作后，使得新的字符串和原来的字符串没有一个字符相同

## 思路

从头开始尽力使用交换即可，如果遇到一个字符不能靠交换解决了，那么其后面的字符都得删掉

因为是要与原始字符串不同，仅删掉这个字符，后面的字符就到这个字符的位置了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    string str;
    str.reserve(2e5 + 10);
    for (int tc = 0; tc < _; ++tc) {
        cin >> str;
        int cnt[2] = {};
        for (const auto& c: str) ++cnt[c - '0'];
        int ans = 0;
        for (int i = 0; i < str.size(); ++i) {
            if (cnt[(str[i] - '0') ^ 1]) --cnt[(str[i] - '0') ^ 1];
            else {
                ans = static_cast<int>(str.size()) - i;
                break;
            }
        }
        cout << ans << endl;
    }
}
```

# C. Game with Multiset

## 大致题意

有一个有 $2^n$ 组成的集合，每次允许往里面添加值，问是否可以靠这几个值相加得到某个具体的值

## 思路

从二进制角度考虑即可，为每一个位置进行凑，不足就让下面的位置进上来

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    int cnt[30] = {};
    for (int q = 0; q < n; ++q) {
        int op, v;
        cin >> op >> v;
        if (op == 1) ++cnt[v];
        else {
            int last = 0;
            for (int i = 29; i >= 0; --i) {
                last <<= 1;
                int cur = last + ((v & (1 << i)) ? 1 : 0);
                last = max(0, cur - cnt[i]);
            }
            cout << (last == 0 ? "YES" : "NO") << endl;
        }
    }
}
```
