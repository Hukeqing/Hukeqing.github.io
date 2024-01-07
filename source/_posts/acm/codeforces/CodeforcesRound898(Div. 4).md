---
title: Codeforces Round 898 (Div. 4)
date: 2023-09-24 01:33:45
updated: 2023-09-24 01:33:45
categories: 
 - ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Short Sort

## 大致题意

有三张卡片，分别为 $a, b, c$，已经在桌面上乱序排好，最多交换两张卡片的位置，问是否能够变成有序的 $a, b, c$

## 思路

简单题，判断一下是不是至少有一位是保持 $a, b, c$ 的顺序即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string  str;
        str.reserve(3);
        cin >> str;
        int cnt = 0;
        for (int i = 0; i < 3; ++i) cnt += str[i] == i + 'a';
        cout << (cnt == 1 || cnt == 3 ? "YES" : "NO") << endl;
    }
}
```

# B. Good Kid

## 大致题意

有一个数组，允许你给其中一个值加一，问最终所有值的乘积最大是多少

## 思路

简单题，如果有两个及以上的 $0$，那么最终结果一定还是 $0$。如果只有一个 $0$，那就等于忽略这个 $0$ 即可，剩下的情况，因为加了之后的效果是 $\frac{x+1}{x}$，所以 $x$ 越小越好，那么让最小的值 $+1$ 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int p = 1, zero = 0, mi = INT_MAX;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            p *= (tmp == 0 ? 1 : tmp);
            zero += tmp == 0;
            mi = min(mi, tmp);
        }

        if (zero >= 2) cout << 0 << endl;
        else if (zero == 1) cout << p << endl;
        else cout << (p / mi * (mi + 1)) << endl;
    }
}
```

# C. Target Practice

## 大致题意

有一个飞镖靶，根据结果计算总分

## 思路

简单题，根据当前的下标距离四个边最小值是多少即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string str;
        str.reserve(10);
        int ans = 0;
        for (int i = 0; i < 10; ++i) {
            cin >> str;
            for (int j = 0; j < 10; ++j) {
                if (str[j] == '.') continue;
                int code = min(min(i + 1, 10 - i), min(j + 1, 10 - j));
                ans += code;
            }
        }
        cout << ans << endl;
    }
}
```

# D. 1D Eraser

## 大致题意

有一个串，其中有白色和黑色方块，每次可以选择连续 $k$ 个块让其变成白色，问最少几步可以全部变成白色

## 思路

简单题，从左往右考虑即可，毕竟最左边遇到的第一个黑色方块肯定需要消耗一次操作，为了最大化使用必定会让 $k$ 个的左边界是当前的黑色方块

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k;
        cin >> n >> k;
        string str;
        str.reserve(n);
        cin >> str;
        int last = -k - 1, ans = 0;
        for (int i = 0; i < n; ++i) {
            if (str[i] == 'W') continue;
            if (i - last + 1 <= k) continue;
            last = i;
            ans++;
        }
        cout << ans << endl;
    }
}
```

# E. Building an Aquarium

## 大致题意

有一个线性水池，水池底部形状已知，最多可以使用 $x$ 个单位的水，问水池两边应该造多高才能尽可能容纳更多的水的同时，在水池满的时候不会使用超过给出的水

## 思路

简单题，二分答案即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x;
        cin >> n >> x;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        int l = 0, r = 2e9 + 10LL;
        while (l + 1 < r) {
            int mid = (l + r) >> 1;
            int sum = 0;
            for (auto &item: data) sum += item >= mid ? 0 : mid - item;
            if (sum > x) r = mid;
            else l = mid;
        }
        cout << l << endl;
    }
}
```

# F. Money Trees

## 大致题意

给出一个数组，其每个值都有两个属性：$a, h$，需要找到一个连续的子数组，使得这个连续的子数组 $[l, r]$的 $h$ 值满足 $\forall i \in [l, r], h\_{i-1} \space mod \space h\_i = 0$，同时 $\sum_{i=l}^{r} a\_i \leq x$

问最长的子数组的长度

## 思路

也是二分答案即可，毕竟在确定要找的最终串的长度的情况下，只需要 $O(n)$ 即可求出是否符合预期，注意平移区间的时候状态的转化

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k, ans = 0;
        cin >> n >> k;
        vector<int> a(n), h(n);
        for (auto &item: a) cin >> item;
        for (auto &item: h) cin >> item;
        for (auto &item: a) if (item <= k) ans = 1;
        int l = 0, r = n + 1;
        while (l + 1 < r) {
            int mid = (l + r) >> 1;
            if (mid == 1) {
                if (ans >= 1) l = mid;
                else r = mid;
                continue;
            }
            int x = 0, y = 0, sum = 0;
            bool flag = false;

            auto findNext = [&]() {
                x = y;
                y += 1;
                sum = a[x];
                while (y - x != mid && x < n && y < n) {
                    if (h[y - 1] % h[y] != 0) {
                        x = y;
                        y += 1;
                        sum = a[x];
                    } else {
                        sum += a[y];
                        y++;
                    }
                }

                if (y - x == mid && sum <= k) {
                    ans = max(ans, mid);
                    flag = true;
                }
                return y - x == mid;
            };
            auto move = [&]() {
                if (y == n) return false;
                if (h[y - 1] % h[y] != 0) return false;
                sum -= a[x];
                sum += a[y];
                y++;
                x++;
                if (sum <= k) {
                    ans = max(ans, mid);
                    flag = true;
                }
                return true;
            };

            while (findNext()) while (move());
            if (flag) l = mid;
            else r = mid;
        }

        cout << ans << endl;
    }
}
```

# G. ABBC or BACB

## 大致题意

有一个字符串，由 $A, B$ 两个字母组成，每次可以将 $AB$ 转为 $BC$，或者将 $BA$ 转为 $CB$，问最多可以操作几次

## 思路

很显然，如果是一串联系的 $A$，然后其中一侧有一个 $B$，那么这种情况下的答案就是 $A$ 的数量

那么将整个数组拆成所有连续的 $A$ 段，然后为每个 $A$ 段找合理的 $B$ 即可。比如如果整个字符串开头或者结尾是 $B$，那么必然可以为每个 $A$ 段找到一个 $B$。除开上面的情况，只需要看看 $B 的数量是否大于等于 $A$ 段的数量即可，因为如果等于或者超过也必然可以分割。如果还不行，那么只能舍弃价值最低的 $A$ 串了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    string str;
    str.reserve(2e5 + 10);
    for (int ts = 0; ts < _; ++ts) {
        cin >> str;
        if (str.front() == 'B' || str.back() == 'B') {
            int cnt = 0;
            for (auto &item: str) cnt += item == 'A';
            cout << cnt << endl;
            continue;
        }

        vector<int> part(1, 0);
        int cntB = 0;
        for (char &i: str) {
            cntB += i == 'B';
            if (i == 'B') {
                if (part.back() != 0) part.push_back(0);
            } else part.back()++;
        }

        int tot = 0, mi = INT_MAX;
        for (auto &item: part) {
            tot += item;
            mi = min(mi, item);
        }
        if (cntB < part.size()) tot -= mi;
        cout << tot << endl;
    }
}
```

# H. Mad City

## 大致题意

有一个图，$n$ 个点，$n$ 条边，有两个人分别从 $a, b$ 出发，其中前者希望追赶后者，而后者希望摆脱前者的追捕，问能否追上

## 思路

首先，$n$ 个点和 $n$ 条边，那就意味着必然图中必然存在环。而两人速度相同，如果同时都在环上，那肯定追不到。所以必须要在后者进入环之前抓到，也就是提前或者刚好到达环上的某一个点。所以只需要找出后者刚进入环的时间点和位置，看看前者能否在指定时间内达到即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, a, b;
        cin >> n >> a >> b;
        vector<int> deg(n + 1, 0);
        vector<bool> vis(n + 1, false);
        struct node {
            int v, n;
        };
        vector<node> edge(n * 2);
        vector<int> head(n + 1, -1);
        for (int i = 0; i < n; ++i) {
            int u, v;
            cin >> u >> v;
            edge[i << 1] = {v, head[u]};
            edge[(i << 1) | 1] = {u, head[v]};
            head[u] = i << 1;
            head[v] = (i << 1) | 1;
            deg[u]++;
            deg[v]++;
        }

        // find circle
        queue<int> q;
        for (int i = 1; i <= n; ++i) if (deg[i] == 1) q.push(i);
        while (!q.empty()) {
            int cur = q.front();
            q.pop();
            vis[cur] = true;
            for (int i = head[cur]; i != -1; i = edge[i].n)
                if ((--deg[edge[i].v]) == 1 && !vis[edge[i].v]) q.push(edge[i].v);
        }

        // begin for b run away
        int cost1, cost2 = INT_MAX, target;
        queue<pair<int, int>> qs;
        vector<bool> flag(n + 1, false);
        qs.emplace(b, 0);
        flag[b] = true;
        while (!qs.empty()) {
            auto cur = qs.front();
            qs.pop();
            if (!vis[cur.first]) {
                cost1 = cur.second;
                target = cur.first;
                break;
            }
            for (int i = head[cur.first]; i != -1; i = edge[i].n)
                if (!flag[edge[i].v]) {
                    qs.emplace(edge[i].v, cur.second + 1);
                    flag[edge[i].v] = true;
                }
        }

        while (!qs.empty()) qs.pop();
        for (int i = 0; i <= n; ++i) flag[i] = false;

        qs.emplace(a, 0);
        flag[a] = true;
        while (!qs.empty()) {
            auto cur = qs.front();
            qs.pop();
            if (cur.first == target) {
                cost2 = cur.second;
                break;
            }
            for (int i = head[cur.first]; i != -1; i = edge[i].n)
                if (!flag[edge[i].v]) {
                    qs.emplace(edge[i].v, cur.second + 1);
                    flag[edge[i].v] = true;
                }
        }

        cout << (cost1 < cost2 ? "YES" : "NO") << endl;
    }
}
```

