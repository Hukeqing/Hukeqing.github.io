---
title: Educational Codeforces Round 156 (Rated for Div. 2)
date: 2023-11-20 08:45:34
updated: 2023-11-20 08:45:34
categories: ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Educational Codeforces Round 156 (Rated for Div. 2) 个人写题记录
---

# A. Sum of Three

## 大致题意

将一个数拆成三个数，要求这三个数不同且都不是 $3$ 的倍数，给出一种拆法即可

## 思路

要拆成三个不同的数，且都不是 $3$ 的倍数，那么最小之能拆成 $1, 2, x$ 且 $x \geq 4$，而且还得保证 $x$ 不是 $3$ 的倍数。若这样拆了之后 $x$ 还是 $3$ 的倍数，那就只能 $1, 4, x$ 这样拆

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        if (n <= 6 || n == 9) {
            cout << "NO" << endl;
        } else if (n % 3) {
            cout << "YES" << endl;
            cout << "1 2 " << n - 3 << endl;
        } else {
            cout << "YES" << endl;
            cout << "1 4 " << n - 5 << endl;
        }
    }
}
```

# B. Fear of the Dark

## 大致题意

笛卡尔坐标系上有两个灯，一个目标点，现在需要从 $(0, 0)$ 出发，走到目标点，路径完全任意，但是必须在灯光下走，问这两盏灯的最小灯光范围是多少

## 思路

比较简单，只有两种可能：1、只用一盏灯，2、同时用两盏灯

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int px, py, ax, ay, bx, by;
        cin >> px >> py >> ax >> ay >> bx >> by;
        auto dist = [&](int a, int b, int x, int y) {
            return sqrt((a - x) * (a - x) + (b - y) * (b - y));
        };

        double a0 = dist(0, 0, ax, ay);
        double b0 = dist(0, 0, bx, by);
        double ap = dist(px, py, ax, ay);
        double bp = dist(px, py, bx, by);
        double ab = dist(ax, ay, bx, by);

        double ans = max(ap, a0);
        ans = min(ans, max(bp, b0));
        ans = min(ans, max(max(min(a0, b0), min(ap, bp)), ab / 2));
        cout << setprecision(10) << ans << endl;
    }
}
```

# C. Decreasing String

## 大致题意

有一个初始的字符串，每次删除一个，使其每次都保证是字典序最小的方案，将每一次的结果字符串拼接，得到一个最终结果字符串，问这个字符串的第 $x$ 位的字母是什么

## 思路

也是比较简单的题，要保证字典序最小，那就得使得字符串前缀尽可能保证非递减即可。用单调栈模拟一下就行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;

    string str;
    str.reserve(1e6 + 10);
    for (int ts = 0; ts < _; ++ts) {
        int pos;
        cin >> str >> pos;

        // bs
        if (pos <= str.size()) {
            cout << str[pos - 1];
            continue;
        }

        int l = 0, r = str.size();
        while (l + 1 < r) {
            int mid = (l + r) >> 1;
            int tot = (str.size() + (str.size() - mid)) * (mid + 1) / 2;
            if (tot < pos) l = mid;
            else r = mid;
        }
        pos -= (str.size() + (str.size() - l)) * (l + 1) / 2 + 1;

        vector<char> st;
        int cur = 0;
        l++;
        while (l--) {
            while (cur < str.size() && (st.empty() || st.back() <= str[cur])) st.push_back(str[cur++]);
            if (cur == str.size()) st.pop_back();
            else if (!st.empty() && st.back() > str[cur]) st.pop_back();
        }
        while (cur < str.size()) st.push_back(str[cur++]);

        cout << st[pos];
    }
}
```
