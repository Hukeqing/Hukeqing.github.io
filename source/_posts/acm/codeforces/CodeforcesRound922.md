---
title: Codeforces Round 922 (Div. 2)
date: 2024-03-24 15:35:50
updated: 2024-03-24 15:35:50
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 922 (Div. 2) 个人写题记录
---

# A. Brick Wall

## 大致题意

有一堵砖墙，由砖块组成，每一个砖块都是 $1 \times k$ （$k$ 可以是任意值，每一块砖块的 $k$ 可以不一样）的方块，可以横放或者纵向放

问横放和纵放的最大差值是多少

## 思路

那全都横放不就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        cout << n * (m / 2) << endl;
    }
}
```

# B. Minimize Inversions

## 大致题意

有两个数组，每次允许操作选择两个下标，在两个数组中分别操作交换这两个下标的值

问让这两个数组的逆序对数量之和最小，应该如何操作

## 思路

大胆猜测，把其中一个数组排序好就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<pair<int, int>> data(n);
        for (auto& [fst, snd]: data) cin >> fst;
        for (auto& [fst, snd]: data) cin >> snd;
        sort(data.begin(), data.end());
        for (int i = 0; i < n; ++i) cout << data[i].first << " \n"[i == n - 1];
        for (int i = 0; i < n; ++i) cout << data[i].second << " \n"[i == n - 1];
    }
}
```

# C. XOR-distance

## 大致题意

有两个数，现在希望找到一个 $x$，使得 $\left | (a \oplus x) - (b \oplus x)\right |$ 最小，且 $x \in [0, r]$

## 思路

由于是异或运算，且最后取了绝对值，实际上对于每一个比特位而言，$x$ 取什么毫无意义。因为对于这个比特位而言，$x$ 取任意值，不同的则还是不同，相同的则还是相同

所以考虑的情况是，某个高的比特位发生了 $a \neq b$ 的情况，这个时候需要努力去构造另外一个值的下面的比特位，使得高位的这个差值带来的影响尽可能小

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int a, b, r;
        cin >> a >> b >> r;

        auto f = [&](const int v, int i) {
            int rs = r, res = 0;
            for (; i >= 0; --i) {
                if ((a & 1LL << i) == (b & 1LL << i)) res += 1LL << i;
                else if (v & 1LL << i) {
                    if (rs >= 1LL << i) rs -= 1LL << i;
                    else res += 2 * (1LL << i);
                }
            }
            return res;
        };

        int ans = 0;
        for (int i = 63; i >= 0; --i) {
            if ((a & 1LL << i) == (b & 1LL << i)) continue;
            ans = 1 + f(a & 1LL << i ? a : b, i - 1);
            break;
        }
        cout << ans << endl;
    }
}
```

# D. Blocking Elements

## 大致题意

从一个数组中，取出一部分值，将整个数组拆成 $n$ 份，将每一份内进行求和，同时取出的值也作为单独的一份进行求和，这些求和值中最大的就是这个数组的代价

问代价最小是多少

## 思路

显然，可以二分，问题是如何检查二分的答案是否合法，这里设二分得到的答案是 $v$

可以通过 dp 的方式来计算，令 `dp[i]` 作为第 $i$ 个值被选中后，$[1, i]$ 中被选中的那些值的总代价

可以得到 $dp[i] = dp[j] + a[i]$，其中 $j \in [l, i), \sum\_{x=l}^{i-1} a\_x \leq v$

故搞个优先队列维护一下即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> data(n), dp(n);
        for (auto& i: data) cin >> i;
        auto check = [&](const int v) {
            priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
            pq.emplace(0, -1);
            int l = 0, tot = 0;
            for (int i = 0; i < n; ++i) {
                if (pq.empty()) dp[i] = data[i];
                else dp[i] = pq.top().first + data[i];
                tot += data[i];
                while (tot > v) {
                    tot -= data[l];
                    ++l;
                }
                pq.emplace(dp[i], i);
                while (!pq.empty() && pq.top().second + 1 < l) pq.pop();
            }
            while (!pq.empty()) {
                if (pq.top().first <= v) return true;
                pq.pop();
            }
            return false;
        };

        int l = 0, r = 1e18;
        while (l + 1 < r) {
            if (const int mid = l + r >> 1; check(mid)) r = mid;
            else l = mid;
        }
        cout << r << endl;
    }
}
```

# E. ace5 and Task Order

## 大致题意

有一个未知的数组 $a$ 和一个未知的初始值 $x$

每次允许你询问一个 $i$，若

- $a\_i < x$，则返回 `<`，且 $x \leftarrow x - 1$
- $a\_i > x$，则返回 `>`，且 $x \leftarrow x + 1$
- $a\_i = x$，则返回 `=`

要求求出原始数组

## 思路

因为不断轮询同一个值，必然最后 $x$ 和它相同

这之后再询问别的值，可以得到它们的关系，同时再询问一次之前的那个值，就可以恢复回来

可以考虑类似快排的方式进行操作即可。注意可以考虑随机函数避免被数据恶心

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        vector<int> pos(n + 1);
        for (int i = 1; i <= n; ++i) pos[i] = i;

        auto pre = [&](const int i) {
            while (true) {
                cout << "? " << i << endl;
                cout.flush();
                char tmp;
                cin >> tmp;
                if (tmp == '=') return;
            }
        };

        auto check = [&](const int i, const int base) {
            cout << "? " << i << endl;
            cout.flush();
            char tmp, temp;
            cin >> tmp;
            cout << "? " << base << endl;
            cout.flush();
            cin >> temp;
            return tmp == '<';
        };

        function<void(int, int)> qs = [&](const int l, const int r) {
            if (l >= r) return;
            swap(pos[rand() % (r - l) + l], pos[r]);
            pre(pos[r]);
            int c = l;
            for (int i = l; i < r; ++i) if (check(pos[i], pos[r])) swap(pos[c++], pos[i]);
            swap(pos[c], pos[r]);
            qs(l, c - 1);
            qs(c + 1, r);
        };
        qs(1, n);
        vector<int> ans(n + 1);
        for (int i = 1; i <= n; ++i) ans[pos[i]] = i;
        cout << "! ";
        for (int i = 1; i <= n; ++i) cout << ans[i] << " \n"[i == n];
        cout.flush();
    }
}
```
