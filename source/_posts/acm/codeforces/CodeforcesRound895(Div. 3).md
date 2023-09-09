---
title: Codeforces Round 895 (Div. 3)
date: 2023-09-09 00:59:39
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Two Vessels

## 大致题意

有 A，B 两个水池，用大小为 $c$ 的勺子舀，最少需要几次才能让这两个水池相同

## 思路

简单题，每次变化 $2c$，不要求平均数，不然精度不好算

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int a, b, c;
        cin >> a >> b >> c;
        int diff = abs(a - b);
        cout << (diff + 2 * c - 1) / (2 * c) << endl;
    }
}
```

# B. The Corridor or There and Back Again

## 大致题意

有一条射线，射线上有一些点有夹子，夹子会在人经过后 $x$ 秒触发，问从顶点出发，然后折返，问最远可以到哪里

## 思路

也是简单题，每个夹子就意味着单独的最远可达距离，然后取最小就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int ans = INT_MAX;
        for (int i = 0; i < n; ++i) {
            int a, b;
            cin >> a >> b;
            ans = min(ans, a + (b - 1) / 2);
        }
        cout << ans << endl;
    }
}
```

# C. Non-coprime Split

## 大致题意

给出 $[l, r]$ 这个区间，目的找到两个值 $a, b$，满足

 - $a + b \in [l, r]$
 - $gcd(a, b) \neq 1$

## 思路

第一反应就是偶数，毕竟任意两个偶数很容易达到，而且可以足够小，只要 $[l, r]$ 中存在偶数区间即可。当然，同时 $r \geq 4$，否则肯定没戏

如果还不行怎么办，那此时必然满足 $l = r, r \space mod \space 2 == 1$。这个时候，反正也只有一个数可以选了，强行找因子吧，找不到就算失败

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int l, r;
        cin >> l >> r;
        if (r < 4) {
            cout << -1 << endl;
            continue;
        }
        if (l != r || r % 2 == 0) {
            cout << 2 << ' ' << ((r >> 1) << 1) - 2 << endl;
            continue;
        }
        int mid = (int) sqrt(r) + 10;
        int gcd = -1;
        for (int i = 2; i <= mid; ++i) {
            if (r - i <= 0) break;
            if (r % i == 0) {
                gcd = i;
                break;
            }
        }
        if (gcd == -1) {
            cout << -1 << endl;
        } else {
            cout << gcd << ' ' << r - gcd << endl;
        }
    }
}
```

# D. Plus Minus Permutation

## 大致题意

给定 $n, x, y$，你需要找到一个 $n$ 的排列，满足

$$((p_{1x}+p_{2x}+p_{3x}+ \dots + p_{\left \lfloor \frac{n}{x} \right \rfloor x}) - (p_{1y}+p_{2y}+p_{3y}+ \dots + p_{\left \lfloor \frac{n}{y} \right \rfloor y})$$

尽可能大，问最终结果是

## 思路

计算出 $x$ 单独占了几个，$y$ 单独占了几个，然后把大数给 $x$，小数给 $y$ 即可

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x, y;
        cin >> n >> x >> y;
        int g = gcd(x, y), l = (x * y) / g;
        int cntL = n / l, cntX = n / x - cntL, cntY = n / y - cntL;
        int sumX = (n + (n - cntX + 1)) * cntX / 2, sumY = (1 + cntY) * cntY / 2;
        cout << sumX - sumY << endl;
    }
}
```

# E. Data Structures Fan

## 大致题意

这题实在不想写题意了，已经把线段树这三个字拍脸上了

## 思路

维护两个值即可，为 $0$ 的异或和，为 $1$ 的异或和，然后每次改就是交换这两个值

## AC code

```cpp
const int N = 1e5 + 10;
 
struct SegTree {
 
    int cnt[2][N << 1];
    bool lazy[N << 1];
 
    inline int static get(int l, int r) {
        return (l + r) | (l != r);
    }
 
    inline void up(int l, int r) {
        int mid = (l + r) >> 1;
        cnt[0][get(l, r)] = cnt[0][get(l, mid)] ^ cnt[0][get(mid + 1, r)];
        cnt[1][get(l, r)] = cnt[1][get(l, mid)] ^ cnt[1][get(mid + 1, r)];
    }
 
    void build(int l, int r) { // NOLINT(*-no-recursion)
        lazy[get(l, r)] = false;
        if (l == r) {
            return;
        }
        int mid = (l + r) >> 1;
        build(l, mid);
        build(mid + 1, r);
        up(l, r);
    }
 
    inline void push(int l, int r) {
        int k = get(l, r);
        if (lazy[k]) {
            int mid = (l + r) >> 1;
            int left = get(l, mid), right = get(mid + 1, r);
            swap(cnt[0][left], cnt[1][left]);
            swap(cnt[0][right], cnt[1][right]);
            lazy[left] = !lazy[left];
            lazy[right] = !lazy[right];
            lazy[k] = false;
        }
    }
 
    void update(int l, int r, int x, int y) { // NOLINT(*-no-recursion)
        if (l == x && y == r) {
            swap(cnt[0][get(l, r)], cnt[1][get(l, r)]);
            lazy[get(l, r)] = !lazy[get(l, r)];
            return;
        }
        push(l, r);
        int mid = (l + r) >> 1;
        if (y <= mid) {
            update(l, mid, x, y);
        } else if (x > mid) {
            update(mid + 1, r, x, y);
        } else {
            update(l, mid, x, mid);
            update(mid + 1, r, mid + 1, y);
        }
        up(l, r);
    }
 
    int query(int l, int r, int x, int y, int p) { // NOLINT(*-no-recursion)
        if (l == x && y == r) {
            return cnt[p][get(l, r)];
        }
        push(l, r);
        int mid = (l + r) >> 1;
        if (y <= mid) {
            return query(l, mid, x, y, p);
        } else if (x > mid) {
            return query(mid + 1, r, x, y, p);
        } else {
            return query(l, mid, x, mid, p) ^ query(mid + 1, r, mid + 1, y, p);
        }
    }
} seg;
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i) {
            cin >> seg.cnt[0][SegTree::get(i, i)];
            seg.cnt[1][SegTree::get(i, i)] = 0;
        }
        string str;
        str.reserve(n);
        cin >> str;
        for (int i = 0; i < n; ++i)
            if (str[i] == '1')
                swap(seg.cnt[0][SegTree::get(i + 1, i + 1)], seg.cnt[1][SegTree::get(i + 1, i + 1)]);
        seg.build(1, n);
 
        int q;
        cin >> q;
        for (int i = 0; i < q; ++i) {
            int o;
            cin >> o;
            if (o == 1) {
                int l, r;
                cin >> l >> r;
                seg.update(1, n, l, r);
            } else {
                int x;
                cin >> x;
                cout << seg.query(1, n, 1, n, x) << ' ';
            }
        }
        cout << endl;
    }
}
```

# F. Selling a Menagerie

## 大致题意

你决定逐个出售动物园里的动物，每个动物都有其价格，出售可以获得对应价格。

每个动物都有其唯一害怕的动物，如果你出售的时候，其害怕的动物还没有被出售，那么你可以获得双倍的价格奖励

给出一个出售顺序，使得最终价值最高

## 思路

很明显是一个 dag 的拓扑排序问题。可惜的是，这个并不是 dag，是有环的。而每次解开一个环，就要消耗一定代价。

可以直接将原来拓扑用的入度改成代价，即所有指向（害怕）这个节点的价格之和，因为如果这个节点先被拓扑了，那么这些指向它的节点就拿不到双倍的价值了，即损失了他们价格之和的代价

然后搞个优先队列拓扑就好了

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        struct node {
            int v, n;
        };
 
        int n;
        cin >> n;
        vector<int> cost(n);
        vector<int> link(n);
        vector<int> deg(n, 0);
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            link[i] = tmp - 1;
        }
        for (auto &item: cost) cin >> item;
        for (int i = 0; i < n; ++i) deg[link[i]] += cost[i];
 
        vector<bool> visit(n, false);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> prq;
        for (int i = 0; i < n; ++i) prq.emplace(deg[i], i);
        while (!prq.empty()) {
            auto cur = prq.top();
            prq.pop();
            if (visit[cur.second]) continue;
            visit[cur.second] = true;
            cout << cur.second + 1 << ' ';
            int nxt = link[cur.second];
            if (visit[nxt]) continue;
            deg[nxt] -= cost[cur.second];
            prq.emplace(deg[nxt], nxt);
        }
        cout << endl;
    }
}
```

# G. Replace With Product

## 大致题意

给你一个数组，允许你选择其中一段，将其换成这些值的乘积，问数组最大的和是多少。需要给出选择的那一段

## 思路

由于乘法的增长通常都会远大于求和，我们需要寻找一个临界点，使得 $\prod_{i=1}^n a_i \geq \sum _{i=1}^n a_i$，这样就可以无脑乘起来了

假定数组中只有两个值是 $> 1$ 的，为 $x, y$，那么可以得到

$$
\begin{align*}
xy       & \geq n+x+y-2 \\
         & \geq n+2\sqrt{xy}-2 \\
let \space t & \rightarrow \sqrt{xy} \\
t^2-2t+1 & \geq n - 1 \\
t-1      & \geq \sqrt{n-1} \\
t        & \geq \sqrt{n-1}+1 \\
xy       & \geq n-1+2\sqrt{n-1}+1 \\
         & \geq n+2\sqrt{n-1}  \\
         & \geq n+n-1+1 \\
         & \geq 2n
\end{align*}
$$

所以只要对于 $xy > 2n$ 的情况，则可以无脑选尽可能全部的即可，因为相加一定不如相乘，当然，是尽可能，不是一定全部

那对于那些不满足的，可以得到 $\prod_{i=1}^n a_i < 2n$，这是一个很难达到的，假定有 $x$ 个数值不为 $1$ 的值，那么必然平均值为 $\sqrt[x]{2n}$，当 $x = 100$ 的时候，平均值就一定 $< 2$ 了，就意味着有 $1$ 的存在，那更不可能乘起来达到目标值了，所以此时非 $1$ 的值数量极少，可以暴力求解

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
        for (auto &item: data) cin >> item;
        int tot = 1;
        for (auto &item : data) {
            tot *= item;
            if (tot > 2 * n) break;
        }
 
        if (tot > 2 * n) {
            // make 1 less
            int l = 0, r = n - 1;
            while (data[l] == 1) l++;
            while (data[r] == 1) r--;
            cout << l + 1 << ' ' << r + 1 << endl;
            continue;
        }
 
        vector<int> not1;
        for (int i = 0; i < n; ++i) if (data[i] != 1) not1.push_back(i);
 
        if (not1.empty()) {
            cout << 1 << ' ' << 1 << endl;
            continue;
        }
 
        int mx = 0, l = 0, r = 0;
        for (int i = 0; i < not1.size() - 1; ++i) {
            int curP = data[not1[i]], curS = data[not1[i]] - 1;
            for (int j = i + 1; j < not1.size(); ++j) {
                curP *= data[not1[j]];
                curS += data[not1[j]] - 1;
                int realS = curS + not1[j] - not1[i] + 1;
                if (mx < curP - realS) {
                    mx = curP - realS;
                    l = not1[i];
                    r = not1[j];
                }
            }
        }
        cout << l + 1 << ' ' << r + 1 << endl;
    }
}
```
