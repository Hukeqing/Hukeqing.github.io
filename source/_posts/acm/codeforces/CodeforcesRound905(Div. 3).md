---
title: Codeforces Round 904 (Div. 2)
date: 2023-11-27 09:10:52
updated: 2023-11-27 09:10:52
categories: ACM&算法
tag:
- ACM
- Codeforces
math: true
---

# A. Morning

## 大致题意

需要依次打出四个数字，键盘上有十个按钮，每个按钮对应一个数字，每次允许按下当前按钮，或者移动到相邻的按钮上，问至少需要多少次才能打出来

## 思路

暴力扫都行，模拟顺序然后找路径即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int x;
        cin >> x;

        int d[5], ans = 0;
        for (int &i: d) {
            i = x % 10;
            if (i == 0) i = 10;
            x /= 10;
        }
        d[4] = 1;
        for (int i = 3; i >= 0; --i) ans += abs(d[i] - d[i + 1]) + 1;
        cout << ans << endl;
    }
}
```

# B. Chemistry

## 大致题意

给你一个字符串，在恰好删除掉 $k$ 个字母之后，再重新排列，能否得到一个回文串

## 思路

只要 $k$ 至少比字母出现次数为基数次的字母个数 $- 1$ 还要多就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;

    string str;
    str.reserve(1e5 + 10);
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k >> str;
        map<char, int> cnt;
        for (auto &item: str) cnt[item]++;
        int edd = 0;
        for (auto &item: cnt) edd += item.second % 2;
        cout << ((k >= edd - 1) ? "YES" : "NO") << endl;
    }
}
```

# C. Raspberries

## 大致题意

有一个数组，和一个 $k$，每次操作可以将数组上的某一个值 $+ 1$，问至少需要操作几次，才能让数组的所有值乘积是 $k$ 的倍数

## 思路

注意题目给出的 $k$ 的范围，仅有可能是 $[2, 5]$，这其中还恰好基本都是素数，仅 $4$ 不是，所以基本上都是其中单个值满足倍数关系了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        vector<int> data(n);
        for (auto &i: data) cin >> i;
        if (k != 4) {
            int mi = k, ma = 0;
            for (auto &i: data) {
                mi = min(mi, i % k);
                ma = max(ma, i % k);
            }
            if (mi == 0) cout << 0 << endl;
            else cout << (k - ma) << endl;
        } else {
            int even = 0, ma = 0;
            for (auto &i: data) {
                even += i % 4 == 0 ? 2 : i % 2 == 0;
                ma = max(ma, i % 4);
            }
            cout << min(max(0, 2 - even), 4 - ma) << endl;
        }
    }
}
```

# D. In Love

## 大致题意

有一个线段的集合，每次往里面加一个线段或者删除一个线段，问每次操作后，是否存在两个线段他们不重叠

## 思路

也很简单，维护好线段右边最小的和线段左边最大的两个堆即可

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    priority_queue<pair<int, int>, vector<pair<int, int>>, less<>> prq1;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> prq2;
    map<int, int> mvd1, mvd2;

    for (int i = 0; i < n; ++i) {
        char op;
        int l, r;
        cin >> op >> l >> r;
        if (op == '+') {
            prq1.emplace(l, i);
            prq2.emplace(r, i);
        } else {
            mvd1[l]++;
            mvd2[r]++;
        }

        while (!prq1.empty()) {
            auto item = prq1.top();
            auto iter = mvd1.find(item.first);
            if (iter != mvd1.end()) {
                while (iter->second--) prq1.pop();
                mvd1.erase(iter);
            } else break;
        }
        while (!prq2.empty()) {
            auto item = prq2.top();
            auto iter = mvd2.find(item.first);
            if (iter != mvd2.end()) {
                while (iter->second--) prq2.pop();
                mvd2.erase(iter);
            } else break;
        }

        if (prq1.empty() || prq2.empty() || prq1.size() == 1 || prq2.size() == 1) cout << "NO" << endl;
        else cout << (prq1.top().first > prq2.top().first ? "YES" : "NO") << endl;
    }
}
```

# E. Look Back

## 大致题意

有一个数组，每次可以让其中一个值翻倍，问至少操作多少次，才能让整个数组不递减

## 思路

这道题从二进制角度考虑就很简单。

翻倍其实就是左移一位，所以如果两个值本身的最高的比特位置相同，那么如果这两个值仍然存在前者大于后者的情况，那么后者需要在前者左移的基础上，再左移一位即可。反之则和前者左移次数相同即可

问题是如何构造最高比特位相同的数组。我们可以先人工把所有值都左移到某个位置，到时候再右移回来即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n), p(n, 0), ans(n, 0);
        for (auto &i: data) cin >> i;
        for (int i = 0; i < n; ++i) {
            while (data[i] <= INT_MAX) {
                p[i]++;
                data[i] <<= 1;
            }
        }
        for (int i = 1; i < n; ++i) ans[i] = ans[i - 1] + (data[i] >= data[i - 1] ? 0 : 1);
        int last = p[0] + ans[0], tot = 0;
        for (int i = 0; i < n; ++i) {
            ans[i] += p[i];
            last = min(ans[i], last);
            ans[i] -= last;
            tot += ans[i];
        }

        cout << tot << endl;
    }
}
```

# F. You Are So Beautiful

## 大致题意

给你一个数组，问是否存在这样的一个**子串**，满足不同时存在两个**子序列**和这个子串相同，问有多少个这样的**子串**

## 思路

注意题目要找的是子串。说白了也很简单，只需要这个子串最左边的值是原串中这个值最左边的，右边也同样，即可

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
        for (auto &i: data) cin >> i;
        map<int, int> cnt[2];
        for (auto &i: data) cnt[1][i]++;
        int ans = 0;
        for (auto &i: data) {
            auto iter = cnt[1].find(i);
            iter->second--;
            if (iter->second == 0) cnt[1].erase(iter);

            // left has
            if (cnt[0].count(i)) continue;
            ans += (int) cnt[1].size();

            // single
            if (iter->second == 0) ans++;

            cnt[0][i]++;
        }

        cout << ans << endl;
    }
}
```

# G2. Dances (Hard Version)

直接看 hard 版本吧，其实都挺简单的，感觉这场最有意思的应该是是 E 题

## 大致题意

有两个数组，其中数组 $a$ 的某一个值可以是 $[1, m]$ 中任意一个。允许你每次操作同时从数组中删除掉一个值，操作完成后再重新排列数组，问是否可以满足数组 $b$ 的每一项都 $> a$

## 思路

贪心一下就行了，说白了就是从 $b$ 里找第一个大于等于每一个 $a$ 的值即可。然后剩下的值都删掉

至于那个特殊的值？可以在剩下要删掉的里面取最大的那个，如果那个特殊值小于它的时候，则不用删，否则删除

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        vector<int> a(n - 1), b(n);
        for (auto &i: a) cin >> i;
        for (auto &i: b) cin >> i;
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());

        int lastB = -1, base = 0, cur = 0;
        for (int &i: a) {
            while (cur < n && i >= b[cur]) lastB = b[cur++];
            if (cur >= n) base++;
            cur++;
        }
        if (lastB == -1) lastB = b.back();

        cout << 1LL * base * m + max(0, m - lastB + 1) << endl;
    }
}
```
