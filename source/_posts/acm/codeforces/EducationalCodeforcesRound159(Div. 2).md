---
title: Educational Codeforces Round 159 (Rated for Div. 2)
date: 2024-02-13 02:05:00
updated: 2024-02-13 02:05:00
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Educational Codeforces Round 159 (Rated for Div. 2) 个人写题记录
---

# A. Binary Imbalance

## 大致题意

有一个 `01` 字符串，每次允许选择两个相邻的字母中间插入一个 `01` 字符，如果相邻的两个字母不同则插入 `0` 否则插入 `1`

问是否可能经过任意次数操作后，字符串中的 `0` 比 `1` 多

## 思路

只要有 `0` 就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        string str;
        str.reserve(n);
        cin >> str;
        int cnt[2] = {0, 0};
        for (const auto& c: str) ++cnt[c - '0'];
        cout << (cnt[0] ? "YES" : "NO") << endl;
    }
}
```

# B. Getting Points

## 大致题意

有 $n$ 天的学期，每一天都可以选择是学习还是休息，学习的话，会得到 $l$ 分，同时可以完成至多两个任务，每个任务可以得到 $t$ 分

任务每隔 $7$ 天会生成一个，第一个任务在第 $1$ 天生成，每个任务一旦被完成就不能再次得到分数

问在至少得到 $p$ 分的情况下，最多可以休息多少天

## 思路

因为任务每 $7$ 天才有一个，而每天可以完成 $2$ 个，所以必然可以把任务做完。即然要休息时间足够久，那么必然是最后几天完成任务即可

所以只需要考虑最后需要多少天进行学习即可。

当然也可以考虑分类讨论，比如所有天都是完成两个任务的学习，或者个别天是不做任何任务的学习

## AC code

```cpp
#define int long long
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, p, l, t;
        cin >> n >> p >> l >> t;
        const int cnt = (n + 6) / 7, d = (cnt + 1) / 2;
        if (d * l + t * cnt >= p)
            cout << n - ((2 * t + l + p - 1) / (2 * t + l)) << endl;
        else
            cout << n - ((p - cnt * t + l - 1) / l) << endl;
    }
}
```

# C. Insert and Equalize

## 大致题意

有一个初始的数组，每个值不同，需要往里面加入一个任选的值，让数组仍然保持不同

然后进行 $t$ 次操作，每次操作是选择一个值并将其加上 $x$，问让所有值都相同的，最少多少的 $t$

## 思路

先不管加入一个值这个事情，如果只是纯粹的做加法，那么非常简单，只需要找到所有差值的最大公约数就行了，那么这个公约数就是 $x$

那么也就可以得到 $t$ 了，即所有值变成 $a\_{max}$ 所需要的步数

接下来是加入一个值的部分，因为必须要和原来的数组不同，所以可以考虑尝试 $a\_{max} - c \times x$，而 $c$ 就是需要额外增加的成本，所以要尽可能小即可

## AC code

```cpp
#define int long long
 
int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}
 
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        if (n == 1) {
            cout << 1 << endl;
            continue;
        }
        sort(data.begin(), data.end());
        set<int> dif;
        for (int i = 0; i < n - 1; ++i) dif.insert(data[i + 1] - data[i]);
        int g = dif.begin().operator*();
        for (const auto& s: dif) g = gcd(g, s);
        int ans = 0;
        for (const auto& i: data) ans += (data[n - 1] - i) / g;
        if (dif.size() == 1) ans += n;
        else {
            for (int i = n - 2; i >= 0; --i) {
                if (const int tmp = n - 1 - i; data[i] + tmp * g != data[n - 1]) {
                    ans += tmp;
                    break;
                }
            }
        }
        cout << ans << endl;
    }
}
```

# E. Collapsing Strings

## 大致题意

有一堆的字符串，使用 $\left | x \right |$ 表示 $x$ 的字符串长度

定义一个函数，$C(a, b)$，其中 $a, b$ 都是字符串

{% raw %}
$$
C(a, b) =
\left\{\begin{matrix}
a, & \left | b \right |  = 0 \\
b, & \left | a \right |  = 0 \\
C(a_{1 \dots \left | a \right | - 1}, b_{2 \dots \left | b \right |}), & a_{\left | a \right |} = b_1 \\
a + b, & others
\end{matrix}\right.
$$
{% endraw %}

问 

{% raw %}
$$\sum_{i=1}^{n} \sum_{j=1}^{n} \left | C(s_i, s_j) \right |$$
{% endraw %}

## 思路

其实就是要找出任意两个字符串之间，前后重叠的部分即可

可以考虑用字典树做，每个字典树的节点上记录下当前节点有多少字符串在这里结束了，又有多少字符串经过了这个节点，总共有多少个字符在其子节点上即可

然后再扫一遍全部的字符串即可

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    string str;
    str.resize(1e6 + 10, -1);
 
    struct node {
        int arr[26]{};
        int len = 0, cnt = 0, end = 0;
 
        node() { memset(arr, -1, sizeof arr); }
    };
    vector<node> tree(1e6 + 10);
    constexpr int root = 0;
    int nxt = 1;
 
    vector<string> data;
    for (int i = 0; i < n; ++i) {
        cin >> str;
        int cur = root;
        for (int l = 0; l < str.size(); ++l) {
            if (!~tree[cur].arr[str[l] - 'a']) {
                tree[cur].arr[str[l] - 'a'] = nxt++;
            }
            cur = tree[cur].arr[str[l] - 'a'];
            tree[cur].len += static_cast<int>(str.size()) - l;
            ++tree[cur].cnt;
        }
        ++tree[cur].end;
        data.push_back(str);
    }
 
    long long ans = 0;
    for (int i = 0; i < n; ++i) {
        string &s = data[i];
        int cur = root;
        for (int l = static_cast<int>(s.size()) - 1; l >= 0; --l) {
            for (int x = 0; x < 26; ++x) if (x != s[l] - 'a' && tree[cur].arr[x] != -1)
                ans += tree[tree[cur].arr[x]].len + 1LL * (l + 1) * tree[tree[cur].arr[x]].cnt;
            ans += 1LL * (l + 1) * tree[cur].end;
            cur = tree[cur].arr[s[l] - 'a'];
            if (!~cur) break;
        }
        if (cur != -1) for (const int x : tree[cur].arr) if (x != -1) ans += tree[x].len;
    }
    cout << ans << endl;
}
```
