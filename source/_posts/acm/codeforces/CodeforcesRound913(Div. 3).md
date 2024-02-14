---
title: Codeforces Round 913 (Div. 3)
date: 2024-02-14 13:25:18
updated: 2024-02-14 13:25:18
categories:
  - ACM&算法
tag:
  - ACM
  - Codeforces
math: true
description: Codeforces Round 913 (Div. 3) 个人写题记录
---

# A. Rook

## 大致题意

有一个棋盘，上有一个城堡，问这个城堡能走到哪些格子

## 思路

把横向和纵向的都枚举出来就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        string str;
        cin >> str;
        for (int i = 0; i < 8; ++i) {
            if (str[0] != 'a' + i) cout << static_cast<char>('a' + i) << str[1] << endl;
 
            if (str[1] != '1' + i) cout << str[0] << i + 1 << endl;
        }
    }
}
```

# B. YetnotherrokenKeoard

## 大致题意

有一个键盘，如果输入 `B` 则删除最后输入的大写字母，如果输入的是 `b` 则删除最后输入的小写字母，给出输入的字母，问最终输出什么

## 思路

从后往前遍历去做就比较简单了，统计还有一个 `B`/`b` 没有处理过即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    string str;
    str.reserve(1e6 + 10);
    for (int tc = 0; tc < _; ++tc) {
        cin >> str;
        list<char> l;
        int cnt[2] = {0, 0};
        for (auto iter = str.rbegin(); iter != str.rend(); ++iter) {
            if (iter.operator*() == 'b') ++cnt[0];
            else if (iter.operator*() == 'B') ++cnt[1];
            else {
                if (iter.operator*() >= 'A' && iter.operator*() <= 'Z' && cnt[1]) --cnt[1];
                else if (iter.operator*() >= 'a' && iter.operator*() <= 'z' && cnt[0]) --cnt[0];
                else l.push_front(iter.operator*());
            }
        }
        for (const auto& c: l) cout << c;
        cout << endl;
    }
}
```

# C. Removal of Unattractive Pairs

## 大致题意

每次可以选择两个相邻的字符，如果不同则同时删除，问最后最少是多少个字符

## 思路

简单题，如果有一个字符的数量超过一半，那就不行

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    string str;
    str.reserve(1e5 + 10);
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n >> str;
        int cnt[26] = {};
        for (const auto& c: str) ++cnt[c - 'a'];
        bool flag = false;
        for (const int i : cnt) {
            if (i * 2 > n) {
                cout << i * 2 - n << endl;
                flag = true;
            }
        }
        if (!flag) cout << (n % 2 ? 1 : 0) << endl;
    }
}
```

# D. Jumping Through Segments

## 大致题意

有 $n$ 个线段，落在 x 轴上，要求从 $0$ 点开始，每次允许往前或者往后走至多 $k$ 步，使得当走完第 $i$ 步的时候，恰好落在第 $i$ 个线段上，问最小的 $k$

## 思路

二分 $k$ 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<pair<int, int>> data(n);
        for (auto& [fst, snd]: data) cin >> fst >> snd;
        int ml = 0;
        for (const auto& [fst, snd]: data) ml = max(fst, ml);
        if (ml == 0) {
            cout << 0 << endl;
            continue;
        }
 
        int l = 0, r = 1e9 + 10;
        auto check = [&](const int x) {
            int bl = 0, br = 0;
            for (const auto& [fst, snd]: data) {
                bl -= x;
                br += x;
                bl = max(bl, fst);
                br = min(br, snd);
                if (bl > br) return false;
            }
            return true;
        };
        while (l + 1 < r) {
            if (const int mid = (l + r) >> 1; check(mid)) r = mid;
            else l = mid;
        }
        cout << r << endl;
    }
}
```

# E. Good Triples

## 大致题意

定义 $digsum(x)$ 等于其每一位的数值相加的结果

问是否存在组合 $(a, b, c)$，使得 $a + b + c = n$ 且 $digsum(a) + digsum(b) + digsum(c) = digsum(n)$

其中 $n$ 为给出的值

## 思路

从十进制角度考虑问题，从每一位看，三个值每一位可以是 $[0, 9]$。

可以考虑从高位开始逐位枚举当前位的值，因为任意位置最多只能是 $27$，所以每一个位置，可能被下面的位置借走两个值，
所以每一个位置的可能的值是 $x, x-1, x-2$，而同时也需要把下面的位置加上对应的借位的值

每一位的值可能是 $[0, 27]$，每个值所能得到的可能的排列是确定的，只需要将每个位置的排列可能性乘起来就行，做个 dfs 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    int base[28] = {};
    for (int a = 0; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 0; c < 10; ++c) ++base[a + b + c];
 
    for (int tc = 0; tc < _; ++tc) {
        int n, tot = 0;
        cin >> n;
        int tmp = n, index = 7, arr[8] = {};
        while (tmp) {
            arr[index--] = tmp % 10;
            tot += tmp % 10;
            tmp /= 10;
        }
 
        long long ans = 0, cur = 1;
        function<void(int)> dfs = [&](const int i) {
            if (arr[i] > 27) return;
            if (i == 7) {
                int sum = 0;
                for (const auto& x: arr) sum += x;
                if (sum == tot) ans += cur * base[arr[i]];
            } else {
                for (int d = 0; d < 3; ++d) {
                    if (arr[i] < d) continue;
                    arr[i] -= d;
                    arr[i + 1] += d * 10;
                    cur *= base[arr[i]];
 
                    dfs(i + 1);
 
                    cur /= base[arr[i]];
                    arr[i] += d;
                    arr[i + 1] -= d * 10;
                }
            }
        };
 
        dfs(0);
 
        cout << ans << endl;
    }
}
```

# F. Shift and Reverse

## 大致题意

有一个数组，每次操作允许进行两个操作其中之一

- 把最后一个值放到最前面
- 翻转整个数组

问是否可能通过操作，使得数组变得非递减

## 思路

有点类似切牌的操作，这么搞最终都是数组原序列的翻转，所以需要数组本身基本有序才行

所以只需要搞清楚是把后面的数直接往前拿，还是说是先翻转后再拿即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int cnt[2] = {};
        for (int i = 1; i < n; ++i) if (data[i - 1] > data[i]) ++cnt[0]; else if (data[i - 1] < data[i]) ++cnt[1];
        if (cnt[0] > 1 && cnt[1] > 1) {
            cout << -1 << endl;
            continue;
        }
 
        if (cnt[0] == 0) {
            cout << 0 << endl;
            continue;
        }
        if (cnt[1] == 0) {
            cout << 1 << endl;
            continue;
        }
 
        int ans = INT_MAX;
        if (cnt[0] == 1) {
            if (data.back() <= data.front()) {
                int key = 0;
                for (int i = 1; i < n; ++i) if (data[i - 1] > data[i]) key = i;
                ans = min(min(n - key, key + 2), ans);
            }
        }
        if (cnt[1] == 1) {
            if (data.back() >= data.front()) {
                int key = 0;
                for (int i = 1; i < n; ++i) if (data[i - 1] < data[i]) key = i;
                ans = min(min(n - key + 1, key + 1), ans);
            }
        }
        cout << (ans == INT_MAX ? -1 : ans) << endl;
    }
}
```

# G. Lights

## 大致题意

有 $n$ 盏灯，$n$ 个开关，每个开关管理两个灯，$i, a\_i$，每次使用开关可以把这两盏灯的状态翻转，
问是否存在一种开关方法，使得所有灯被关闭

## 思路

因为一个开关必定可以改变当前灯的状态，以及改变另外一个灯的状态，所以可以得到一张图，
然后根据拓扑序，如果当前节点是开灯的，那么必然得使用这盏灯的开关，因为这是最后能改变灯状态的开关了，最后可能会成环，没办法拓扑序了

因为每次关灯，会影响到两个灯的状态，所以一个环上必须要恰好还剩下偶数盏灯没有被关闭才行，然后再环上找小弧即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        vector<int> nxt(n), deg(n, 0), ans;
        cin >> str;
        for (auto& i: nxt) cin >> i;
        for (auto& i: nxt) ++deg[--i];
 
        queue<int> q;
        for (int i = 0; i < n; ++i) if (!deg[i]) q.push(i);
        while (!q.empty()) {
            const auto cur = q.front();
            q.pop();
            if (str[cur] == '1') {
                ans.push_back(cur);
                str[cur] = '0';
                str[nxt[cur]] = str[nxt[cur]] == '0' ? '1' : '0';
            }
            --deg[nxt[cur]];
            if (!deg[nxt[cur]]) q.push(nxt[cur]);
        }
 
        bool ret = true;
        for (int i = 0; i < n; ++i) {
            if (!deg[i] || str[i] == '0') continue;
            int len = 1, half = 1, cur = nxt[i], flag = str[cur] == '0', cnt = str[cur] == '0' ? 0 : 1;
            while (cur != i) {
                cur = nxt[cur];
                ++len;
                half += flag;
                if (str[cur] == '1') {
                    flag ^= 1;
                    ++cnt;
                }
            }
            if (cnt % 2) {
                ret = false;
                break;
            }
            cur = i;
            if (half * 2 <= len) flag = 1;
            else flag = 0;
            while (len--) {
                if (flag) ans.push_back(cur);
                str[cur] = '0';
                cur = nxt[cur];
                if (str[cur] == '1') flag ^= 1;
            }
        }
        if (!ret) {
            cout << -1 << endl;
            continue;
        }
        cout << ans.size() << endl;
        for (int i = 0; i < ans.size(); ++i) cout << ans[i] + 1 << " \n"[i == ans.size() - 1];
    }
}
```
