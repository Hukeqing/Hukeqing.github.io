---
title: Harbour.Space Scholarship Contest 2023-2024 (Div. 1 + Div. 2)
date: 2023-08-27 17:27:45
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Increasing and Decreasing

## 大致题意

给出数列的第一个和最后一个值，构造一个数列，保证

 - 数列严格递增
 - 数列的递增速率严格递减

找出任意一个即可

## 思路

简单题，倒着构造即可，最后判断是否符合

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int x, y, n;
        cin >> x >> y >> n;
        vector<int> data(n);
        data[0] = x;
        data[n - 1] = y;
        for (int i = 1; i < n - 1; ++i) data[n - i - 1] = data[n - i] - i;
        if (data[0] >= data[1] || data[1] - data[0] <= data[2] - data[1]) {
            cout << -1 << endl;
            continue;
        }
 
        for (int i = 0; i < n; ++i) cout << data[i] << " \n"[i == n - 1];
    }
}
```

# B. Swap and Reverse

## 大致题意

有一个字符串，长度为 $n$，允许你进行如下操作

 - 选择一个合理的 $i$，交换 $a\_i$ 和 $a\_{i + 2}$
 - 选择一段连续的字符串，其长度为 $k$（为给出固定值），翻转这段字符串

问操作无数次可以到达的最小字符串是什么

## 思路

大胆猜测，小心求证。大概模拟了几个 case，猜测如果 $k$ 为奇数，则奇偶位置单独排序后输出就行了，否则就全部排序一下输出就好了

为奇数的情况比较简单，说白了就是奇偶位不会交换，就不再证明了

为偶数的情况，其实只需要隔一个位置进行翻转即可，因为题目说明了 $k < n$。例如 $123456$，且 $k = 4$，则翻转一次后为 $432156$，再取 $1-5$ 翻转，得到 $451236$，可以观察到其实仅仅开头两位的奇偶得到了翻转，后面的奇偶性不变，故此可以实现任意连续两位的翻转，即全字符串都可以排序好

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
        if (k % 2) {
            string tmp1, tmp2;
            tmp1.resize((n + 1) / 2);
            tmp2.resize(n / 2);
            for (int i = 0; i < n; ++i) {
                if (i % 2) tmp2[i / 2] = str[i];
                else tmp1[(i + 1) / 2] = str[i];
            }
            sort(tmp1.begin(), tmp1.end());
            sort(tmp2.begin(), tmp2.end());
            for (int i = 0; i < n; ++i) {
                if (i % 2) cout <<  tmp2[i / 2];
                else cout << tmp1[(i + 1) / 2];
            }
            cout << endl;
        } else {
            sort(str.begin(), str.end());
            cout << str << endl;
        }
    }
}
```

# C. Divisor Chain

## 大致题意

给出一个初始值，每次可以减去它的整除数，直到其变成 $1$，给出一条合理的整除数路径，要求其中 $1$ 至多出现两次

## 思路

首先第一反应就是偶数的一半，因为这样一定可以快速减少。但是免不了出现大量的奇数，导致很容易撞上多个 $1$ 的情况

由于实际上是减法，所以理论上一个偶数不断的减去偶数，那么肯定还是偶数。所以可以让初始值根据情况先减去 $1$，变成偶数，然后不断的减去偶数，最后变成 $2$ 了之后，再减去 $1$ 变成 $1$

之后就需要不断的找到可以作为整除数的偶数，当然首先 $2$ 肯定可以，毕竟 $2$ 一定是任何偶数的除数，但是只用 $2$ 的话又太多了，所以还得用大一点的。这就让人很容易想到 $2^x$。

从二进制的角度看，实际上任何一个值都可以被它的 `lowbit` 整除，不断的减去 `lowbit`，似乎就符合预期了。再只剩下最后一个 bit 位后，再持续减去 `lowbit / 2` 就可以实现不断减少

## AC code

```cpp
void solve() {
    auto lb = [&](int x) { return x & -x; };
 
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> ans;
        ans.reserve(1000);
 
        ans.push_back(n);
        while (n != 1) {
            int tmp = lb(n);
            if (tmp != n) n -= tmp;
            else n -= tmp >> 1;
            ans.push_back(n);
        }
 
        cout << ans.size() << endl;
        for (int i = 0; i < ans.size(); ++i) cout << ans[i] << " \n"[i == ans.size() - 1];
    }
}
```

# D. Matrix Cascade

## 大致题意

有一个 $01$ 矩阵，每次可以选择一个位置，然后以这个位置作为三角形的顶点，向下所有三角形以内的的都进行翻转，问最少几次操作可以把这个矩阵都变成 $0$

## 思路

想办法维护好下一行有哪些是被翻转了的，奇数次翻转才有意义，题目其实不难

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<string> data(n);
        for (auto &item: data) item.reserve(n);
        for (auto &item: data) cin >> item;
        vector<int> l(n), r(n);
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            int flag = false;
            for (int j = 0; j < n; ++j) {
                flag = (l[j] + r[j]) % 2 == 0 ? flag : !flag;
                if (flag == (data[i][j] == '1')) continue;
                else {
                    l[j]++;
                    if (j + 1 < n) r[j + 1]++;
                    flag = !flag;
                    ans++;
                }
            }
            l[0] += l[1];
            for (int j = 1; j < n - 1; ++j) l[j] = l[j + 1];
            l[n - 1] = 0;
            for (int j = n - 1; j > 0; --j) r[j] = r[j - 1];
            r[0] = 0;
        }
 
        cout << ans << endl;
    }
}
```

# E. Guess Game

## 大致题意

Alice、Bob、Carol 玩游戏

首先有一个数组，仅 Carol 可见，然后 Carol 从中随机选出两个值 $x, y$，可以相同位置

Carol 将这两个值进行 OR 计算，计算后得到 $z$，然后将 $x, z$ 给 Alice 看，$y, z$ 给 Bob 看

然后 Alice 和 Bob 轮流猜测 $x > y$ 还是 $x < y$ 还是 $x = y$。若不确定，可以选择不知道，如果能够确定，那么一定需要答出来

问期望的猜测次数是多少

## 思路

首先要理清楚，为什么回答不知道反而可以确定。比较好的是，题目中已经给出了比较详细的说明。这里也给一个例子

> 例如 $x = 2, y = 3$，那么 Alice 可以拿到 $x = 2, z = 3$ 而 Bob 拿到的是 $y = 3, z = 3$。
> 那么此时，Alice 可以知道，Bob 只有可能是 $3, 1$ 其中一个，故判断不出来，Alice 只能回复不确定
> 轮到 Bob 的时候，Bob 知道 Alice 可以是 $3, 2, 1, 0$ 中任意一个。但是 Alice 回复不知道，对于 Bob 而言，如果 Alice 是 $1, 0$ 的话，当她看到 $z = 3$，说明 Bob 至少为 $2$，故 Alice 应该可以确定，故可以排除掉这两个，所以 Alice 可以是 $3, 2$ 其中一个，但是还是不确定是否是相同还是 Alice 的更小，故也回复不知道
> 再轮到 Alice 了，如果 Bob 无法判断的话，那么 Bob 一定不是 $1$，理由同上了。故此时 Alice 才可以确定 Bob 一定是 $3$，那么就可以确定了
> 综上，需要 3 轮

这道题因为涉及到 OR 运算，所以很自然从二进制角度考虑问题，二进制的比较，无非就是从最高的 bit 位开始，谁先不是 1 了，谁就小了。

从 OR 运算考虑，若“我”拿到的那个值某一个 bit 位是 `0`，但是 OR 的结果是 `1`，那么显然，对方这一位是 `1`。同理，若 OR 的结果为 `0`，那么对方和我一样都是 `0`。问题就在“我”和 OR 的结果都是 `1` 的那些 bit 位。这个时候我并不确定对方是否是 `1`，这也是需要多轮博弈的地方。

如果这两个选择的值，在某个 bit 位之前都是相同的，且通过一段博弈之后相互确认相同了，但是在这个 bit 位下是是不同的，即一个为 `0`，一个是 `1`。那么对于那个为 `0` 的而言，必然可以立刻回答出答案，而那个为 `1` 的则仍然不确定，所以此时需要再加上 $1, 2$ 次判定，这取决于谁先回答。

而对于前面相同的部分，若为 `0` 的，不用猜疑也能知道对方的情况，故可以跳过，不需要猜，而为 `1` 的部分，则需要进行一次不确定的回答，才可以确认对方也是 `1`。注意，这里只需要一次回答，就可以让双方都知道对方那一位是 `1` 了。如果不确定，可以将上面的 case 反过来，让 Bob 先猜，则可以理解原因了。

综上，给出两个数字，这两个数字要猜需要的轮次就是：(第一个不同的位置中，`0` 先回答 ? $0$ : $1$) + 不同的位置前有多少个 `1`

而因为要计算整个数列的情况，所以可以考虑建一棵 01字典树，然后在树上计算。树上每个节点表示如果当前节点就是那个不一样的位置，那么需要多少轮。结果就是：(当前节点上面为 1 的节点数量 * 2 + 1) * 当前节点为 `0` 的数量 * 当前节点为 `1` 的数量

需要考虑一下如果数字相同的情况，这里就不再详细说明了

## AC code

```cpp
#define int long long
 
struct node {
    int cnt, zero, one;
};
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, mod = 998244353;
        cin >> n;
        vector<node> tree(n * 50);
        int mx = 0;
        auto newNode = [&]() {
            tree[mx].cnt = 0;
            tree[mx].zero = -1;
            tree[mx].one = -1;
            return mx++;
        };
 
        int root = newNode();
        auto add = [&](int x) {
            int cur = root;
            for (int i = 31; i >= 0; --i) {
                if (x & (1 << i)) cur = tree[cur].one == -1 ? tree[cur].one = newNode() : tree[cur].one;
                else cur = tree[cur].zero == -1 ? tree[cur].zero = newNode() : tree[cur].zero;
                tree[cur].cnt++;
            }
        };
 
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            add(tmp);
        }
 
        int ans = 0, total = n * n;
        function<void(int, int)> dfs = [&](int cur, int deep) {
            if (tree[cur].zero == -1 && tree[cur].one == -1) {
                ans += deep * tree[cur].cnt * tree[cur].cnt;
                ans %= mod;
                return;
            }
            if (tree[cur].zero == -1) dfs(tree[cur].one, deep + 1);
            else if (tree[cur].one == -1) dfs(tree[cur].zero, deep);
            else {
                ans += (2 * deep + 1) * tree[tree[cur].one].cnt * tree[tree[cur].zero].cnt;
                ans %= mod;
                dfs(tree[cur].one, deep + 1);
                dfs(tree[cur].zero, deep);
            }
        };
 
        auto qp = [&](int a, int b) {
            if (b < 0) return 0LL;
            int ret = 1;
            a %= mod;
            while (b) {
                if (b & 1) ret = (ret * a) % mod;
                b >>= 1;
                a = (a * a) % mod;
            }
            return ret;
        };
        auto inv = [&](int a) { return qp(a, mod - 2); };
 
        dfs(0, 1);
        cout << (ans * inv(total) % mod) << endl;
    }
}
```