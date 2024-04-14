---
title: Codeforces Round 927 (Div. 3)
date: 2024-04-14 19:55:07
updated: 2024-04-14 19:55:07
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Codeforces Round 927 (Div. 3) 个人写题记录
#index_img:
---

# A. Thorns and Coins

## 大致题意

有一条路，有些地方有陷阱，有些地方有金币，每次只能向前走一步或者跳到第二步，在不踩到陷阱的情况下，最多可以收集多少金币

## 思路

最早出现连续两个陷阱的地方就是结束，统计前面的金币数量即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.resize(n);
        cin >> str;
        int cnt = 0;
        for (int i = 0; i < n; ++i) {
            cnt += str[i] == '@';
            if (i > 0 && str[i] == '*' && str[i - 1] == '*') break;
        }
        cout << cnt << endl;
    }
}
```

# B. Chaya Calendar

## 大致题意

有 $n$ 个预兆，每个预兆都有出现的周期

且如果出现了第一个预兆后出现了第二个预兆，且在这个第二个预兆后又出现了第三个预兆，以此类推，当出现最后一个预兆的时候，就是末日，问末日是哪一天

## 思路

不断找合法的倍数即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        int cur = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            int c = (cur + tmp) / tmp;
            cur = c * tmp;
        }
        cout << cur << endl;
    }
}
```

# C. LR-remainders

## 大致题意

有一个数组，现在每次删除掉最左边和最右边的值，问此时剩余的所有值的乘积与 $m$ 的取模值，已知了删除顺序，问所有次的取模的值

## 思路

反向操作即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<int> data(n);
        for (auto &i: data) cin >> i;
        string str;
        str.resize(n);
        cin >> str;

        vector<int> order(n);
        int l = 0, r = n - 1;
        for (int i = 0; i < n; ++i) {
            if (str[i] == 'L') order[i] = data[l++];
            else order[i] = data[r--];
        }

        int cur = 1;
        for (int i = n - 1; i >= 0; --i) {
            cur = (cur * order[i]) % m;
            data[i] = cur;
        }
        for (int i = 0; i < n; ++i) cout << data[i] << " \n"[i == n - 1];
    }
}
```

# D. Card Game

## 大致题意

有一副扑克牌，其中有一个花色是王牌，王牌的牌大于其他花色的牌，相同花色的牌，则数值越大越大

现在有 $2 \times n$ 张牌，问是否恰好存在 $n$ 对牌，使得每一对都是可以比较出大小的值

## 思路

模拟即可，不是很难

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, sp;
        char s;
        cin >> n >> s;
        sp = (s == 'C' ? 0 : (s == 'D' ? 1 : (s == 'H' ? 2 : 3)));
        vector<int> data[4];
        string str;
        str.resize(2);
        for (int i = 0; i < n * 2; ++i) {
            cin >> str;
            if (str[1] == 'C') data[0].push_back(str[0]);
            if (str[1] == 'D') data[1].push_back(str[0]);
            if (str[1] == 'H') data[2].push_back(str[0]);
            if (str[1] == 'S') data[3].push_back(str[0]);
        }
        sort(data[0].begin(), data[0].end(), greater<>());
        sort(data[1].begin(), data[1].end(), greater<>());
        sort(data[2].begin(), data[2].end(), greater<>());
        sort(data[3].begin(), data[3].end(), greater<>());
        vector<pair<pair<int, char>, pair<int, char>>> ans;
        ans.reserve(n);
        bool flag = true;
        for (int i = 0; i < 4; ++i) {
            if (i == sp) continue;
            for (int j = (int)data[i].size() - 1; j >= 1; j -= 2) ans.push_back({{i, data[i][j]}, {i, data[i][j - 1]}});
            if (data[i].size() % 2 && !data[sp].empty()) {
                ans.push_back({{i, data[i][0]}, {sp, data[sp].back()}});
                data[sp].pop_back();
            } else if (data[i].size() % 2) flag = false;
        }
        for (int j = (int)data[sp].size() - 1; j >= 1; j -= 2) ans.push_back({{sp, data[sp][j]}, {sp, data[sp][j - 1]}});

        if (!flag) cout << "IMPOSSIBLE" << endl;
        else {
            auto to_char = [](int i) {
                switch (i) {
                    case 0: return 'C';
                    case 1: return 'D';
                    case 2: return 'H';
                    case 3: return 'S';
                }
                return 'A';
            };
            for (const auto &[a, b]: ans)
                cout << a.second << to_char(a.first) << ' ' << b.second << to_char(b.first) << endl;
        }
    }
}
```

# E. Final Countdown

## 大致题意

有一个倒计时，但是它每次减少的时候，需要的耗时与改变的值的数量相同，比如 $10 \rightarrow 9$ 需要 $2$ 秒

问当前的倒计时值实际需要多少秒

## 思路

类似不同的进制值，进制分别是 $1, 11, 111, 1111, 11111, 11111 \dots$

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n;
        cin >> n;
        string str;
        str.resize(n);
        cin >> str;
        vector<int> ans(n + 1, 0);
        int tmp = 0;
        for (int i = 0; i < n; ++i) {
            ans[i + 1] = str[i] - '0' + tmp;
            tmp += str[i] - '0';
        }
        for (int i = n; i > 0; --i) {
            ans[i - 1] += ans[i] / 10;
            ans[i] %= 10;
        }
        int start = 0;
        while (!ans[start]) ++start;
        for (int i = start; i <= n; ++i) cout << ans[i];
        cout << endl;
    }
}
```

# F. Feed Cats

## 大致题意

有 $m$ 只猫，每只猫可以出现在 $[l\_i, r\_i]$ 的范围内，每只猫只允许吃一次食物，吃多了就会死。

问现在在不同的格子上放食物（每次放的食物量足够任意数量的猫吃），在保证不会出现吃死的情况下，最多可以喂饱多少只小猫

## 思路

其实就是取几个点，使得他们之间没有跨越相同的区间，同时总跨越的区间足够多

简单 dp 一下即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        int n, m;
        cin >> n >> m;
        vector<pair<int, int>> data(m), rdata;
        for (auto &[a, b]: data) cin >> a >> b;
        rdata = data;
        sort(data.begin(), data.end());
        sort(rdata.begin(), rdata.end(), [&](const pair<int, int> &lhs, const pair<int, int> &rhs) {
            return lhs.second != rhs.second ? lhs.second < rhs.second : lhs.first < rhs.first;
        });
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> q;
        vector<int> ans(n + 1, 0);
        int l = 0, res = 0, r = 0, cnt = 0;
        for (int i = 1; i <= n; ++i) {
            while (l < m && data[l].first <= i) {
                q.push(data[l++]);
                ++cnt;
            }
            while (r < m && rdata[r].second < i) {
                ++r;
                cnt--;
            }
            while (!q.empty() && q.top().second < i) q.pop();
            if (q.empty()) ans[i] = ans[i - 1];
            else ans[i] = ans[q.top().first - 1] + cnt;
            ans[i] = max(ans[i], ans[i - 1]);
            res = max(res, ans[i]);
        }
        cout << res << endl;
    }
}
```

# G. Moving Platforms

## 大致题意

有一个图，其中每一个点都有一个权值 $l\_i$，一个步长 $s\_i$。
每个单位时间后，每个点的权值变成 $l\_i \leftarrow (l\_i + s\_i) \space mod \space H$

如果两个点之间有边，且他们权值此时相同，则连通，否则边不可用，且走过一个边需要花费一个单位时间

问从第 1 个节点走到第 n 个节点需要多少时间

## 思路

容易得到，实际上每一条边的可通行时间是一个 $ax + b$ 函数的值，其中 $x \in [0, \inf)$，如果能够求出所有边的函数，那么就很容易了

接下来是如何计算边的 $a, b$ 了

首先 $a$ 很容易，因为都是累加，所以需要满足 $s\_i \times t - s\_j \times t \equiv 0 (mod \space H)$

容易得到方程 $a \leftarrow \frac{lcm(s\_i - s\_j, H)}{s\_i - s\_j}$

接下来是如何算 $b$ 了，即第一次需要走多少步，他们才会相同

容易得到 $l\_i + t\_1 \times s\_i \equiv l\_j + t\_1 \times s\_j (mod \space H)$

变换可以得到 $t\_1 \times (s\_i - s\_j) + t\_2 \times H = l\_j - l\_i$

这很显然可以使用扩展欧几里得去做，求算出 $t\_1$ 是多少，再通过计算得到 $b$ 即可

然后正常的图上求最短路径即可

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int tc = 0; tc < _; ++tc) {
        function<int(int, int, int &, int &)> exGcd = [&exGcd](int a, int b, int &x, int &y) {
            if (!b) {
                x = 1, y = 0;
                return a;
            }
            int ret = exGcd(b, a % b, y, x);
            y -= a / b * x;
            return ret;
        };
        struct edge { int a, b, v, n; };

        int n, m, H;
        cin >> n >> m >> H;
        vector<int> l(n), s(n);
        vector<edge> edges(m * 2);
        vector<int> head(n + 1, -1);
        for (auto &i: l) cin >> i;
        for (auto &i: s) cin >> i;

        for (int i = 0; i < m; ++i) {
            int u, v;
            cin >> u >> v;

            int a = s[u - 1] - s[v - 1], b = H, x, y;
            int g = exGcd(a, b, x, y);
            if (abs(l[v - 1] - l[u - 1]) % abs(g)) continue;

            a = abs(b / g);
            b = (a - (((l[u - 1] - l[v - 1]) / g * x) % a + a) % a) % a;
            edges[i << 1] = {a, b, v, head[u]};
            edges[i << 1 | 1] = {a, b, u, head[v]};
            head[u] = i << 1;
            head[v] = i << 1 | 1;
        }

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> q;
        vector<bool> visit(n + 1, false);
        q.emplace(0, 1);
        int ans = -1;
        while (!q.empty()) {
            auto [cost, cur] = q.top();
            q.pop();
            if (visit[cur]) continue;
            visit[cur] = true;
            if (cur == n) {
                ans = cost;
                break;
            }
            for (int e = head[cur]; ~e; e = edges[e].n) {
                int tmp = (cost - edges[e].b + edges[e].a - 1) / edges[e].a;
                int nc = tmp * edges[e].a + edges[e].b;
                q.emplace(nc + 1, edges[e].v);
            }
        }
        cout << ans << endl;
    }
}
```
