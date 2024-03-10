---
title: Codeforces Round 904 (Div. 2)
date: 2023-11-25 15:04:24
updated: 2023-11-25 15:04:24
categories: ACM&算法
tag:
- ACM
- Codeforces
math: true
---

*D 题有点难，数论确实不会，本着只是为了练习回复脑子的角度考虑，就不写了*

# A. Simple Design

## 大致题意

有两值，$x, k$，找到最小的 $y$ 满足 $y \geq x, y \space mod \space k = 0$

## 思路

因为 $k$ 很小，所以暴力枚举就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int x, k;
        cin >> x >> k;

        auto cal = [&](int x) {
            int ans = 0;
            while (x) {
                ans += x % 10;
                x /= 10;
            }
            return ans;
        };

        while (true) {
            int tmp = cal(x);
            if (tmp % k == 0) {
                cout << x << endl;
                break;
            }
            x++;
        }
    }
}
```

# B. Haunted House

## 大致题意

有一个 $01$ 字符串，每次允许交换两个相邻的值，问交换多少次，就可以是 $2^i$ 的倍数（对于所有可能的 $i$）

## 思路

都告诉你二进制了，保证最后几个为 $0$ 的方案而已，简单模拟一下就行了

## AC code

```cpp
#define int long long

void solve() {
    string str;
    str.reserve(1e5);

    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n >> str;
        int l = (int) str.size(), ans = 0;
        for (int r = (int) str.size() - 1; r >= 0; --r) {
            l--;
            while (l >= 0 && str[l] == '1') l--;
            if (l >= 0) ans += r - l;
            if (l < 0) cout << -1 << ' ';
            else cout << ans << ' ';
        }
        cout << endl;
    }
}
```

# C. Medium Design

## 大致题意

有一堆区间，可以选出其中一部分，对这些区间内的值 +1 问这样操作之后的区间的最大值降去最小值的最大差值可以是多少

## 思路

排序一下，然后遍历，因为最小值一定出现在第一个值或者最后一个值

## AC code

```cpp
vector<pair<int, int>> v;

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        v.resize(n);
        for (auto &i: v) cin >> i.first >> i.second;

        struct cmp {
            bool operator()(const int &lhs, const int &rhs) const {
                return v[lhs].second > v[rhs].second;
            }
        };

        priority_queue<int, vector<int>, cmp> prq;
        sort(v.begin(), v.end());

        int l = 0, r = 0, cur = 0, ans = 0;
        for (int i = 0; i < v.size(); ++i) {
            auto &item = v[i];
            prq.push(i);
            cur++;
            if (item.first <= 1) l++;
            if (item.second >= m) r++;
            while (!prq.empty()) {
                if (v[prq.top()].second < item.first) {
                    if (v[prq.top()].first <= 1) l--;
                    prq.pop();
                    cur--;
                } else break;
            }
            ans = max(ans, max(cur - l, cur - r));
        }
        cout << ans << endl;
    }
}
```