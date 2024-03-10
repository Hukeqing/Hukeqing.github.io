---
title: Codeforces Round 903 (Div. 3)
date: 2023-11-21 09:17:41
updated: 2023-11-21 09:17:41
categories: ACM&算法
tag:
- ACM
- Codeforces
math: true
---

# A. Don't Try to Count

## 大致题意

给出两个字符串 $n, m$，允许 $n$ 每次往自己拼接在自己后面，使得 $n$ 中出现 $m$ 字符串，问最少需要几次操作

## 思路

因为 $n, m$ 都很小，所以直接保留就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        string str1, str2;
        str1.reserve(25);
        str2.reserve(25);
        cin >> n >> m >> str1 >> str2;
        int i = 0, flag = false;
        for (i = 0; i <= 5; ++i) {
            if (str1.find(str2) != -1) {
                flag = true;
                break;
            }
            str1 += str1;
        }
        cout << (flag ? i : -1) << endl;
    }
}
```

# B. Three Threadlets

## 大致题意

有三根木棍，允许最多切三刀，问能否使得所有木棍都一样长

## 思路

因为只能切三刀，所以就很局限了

- 如果一个棍子切一刀的方案下，那么必然只能中间切开，那么肯定最初大家都是一样的，故不可能存在这个情况
- 如果分别为切 $0, 1, 2$ 的方案下，那么必然第二根棒子的长度得是第一根的两倍，第三根则为三倍
- 如果分别为切 $0, 0, 3$ 的方案下，那么必然第三个棒子的长度得是前两根的四倍，同时第二根和第一个等长
- 如果分别为切 $0, 1, 1$ 的方案下，那么必然第二个和第三个棒子的长度得是第一根的两倍
- 如果分别为切 $0, 0, 2$ 的方案下，那么必然第三个棒子的长度得是前两根的三倍，同时第二根和第一个等长
- 如果分别为切 $0, 0, 1$ 的方案下，那么必然第三个棒子的长度得是前两根的两倍，同时第二根和第一个等长

嗯，枚举所有情况即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        vector<int> data(3);
        cin >> data[0] >> data[1] >> data[2];
        sort(data.begin(), data.end());
        if (data[0] == data[2]) {
            cout << "YES" << endl;
            continue;
        }

        if (data[0] == data[1])
        cout << (data[2] == data[0] * 2 || data[2] == data[0] * 3 || data[2] == data[0] * 4 ? "YES" : "NO") << endl;
        else
        cout << (data[1] == data[0] * 2 && (data[2] == data[0] * 2 || data[2] == data[0] * 3) ? "YES" : "NO") << endl;
    }
}
```

# C. Perfect Square

## 大致题意

矩阵旋转 $90$ 度后仍然相同，每次允许把矩阵中的一个值加一，问最少需要改多少次

## 思路

搞清楚旋转后，的每个位置映射的地方即可，很简单

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<string> data(n);
        for (auto &item : data) item.resize(n);
        for (auto &item : data) cin >> item;

        auto trans = [&](int &x, int &y) {
            swap(x, y);
            y = n - y - 1;
        };

        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                char tmp[4];
                int x = i, y = j;
                for (int l = 0; l < 4; ++l) {
                    tmp[l] = data[x][y];
                    trans(x, y);
                }
                sort(tmp, tmp + 4);
                ans += tmp[3] * 3 - tmp[0] - tmp[1] - tmp[2];
            }
        }

        cout << ans / 4 << endl;
    }
}
```

# D. Divide and Equalize

## 大致题意

有 $n$ 个数字，每次允许你从中挑选两个数字，将其中一个数字除以 $x$，另外一个数字乘以 $x$。注意操作后两数仍然是正整数，问是否能让所有数字相同

## 思路

简单题，把所有数字质因子分解了，然后看看每个质因子的出现次数是不是数组长度的倍数就行了

## AC code

```cpp
#define int long long

void solve() {
    vector<bool> notPrime(1e6 + 10, false);
    vector<int> prime;
    notPrime[1] = true;
    for (int i = 2; i < 1e6 + 10; ++i) {
        if (notPrime[i]) continue;
        prime.push_back(i);
        for (int j = i * i; j <= 1e6 + 10; j += i) notPrime[j] = true;
    }

    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        map<int, int> mp;
        for (auto item: data) {
            for (auto p : prime) {
                while (item % p == 0) {
                    mp[p]++;
                    item /= p;
                }
                if (item == 1) break;
                if (!notPrime[item]) {
                    mp[item]++;
                    break;
                }
            }
        }

        bool flag = true;
        for (auto iter = mp.begin(); iter != mp.end(); ++iter)
        if (iter->second % n != 0) flag = false;

        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# E. Block Sequence

## 大致题意

有一个数组，希望能删掉一些值，使得整个数组满足一个特征：

整个数组可以拆分成几个连续的块，每个块第一个数字表示这个块内后面的数字个数

问最少需要删掉几个

## 思路

很容易想到用 dp 解决

假定当前位置为某个块的开头，那么带来的价值就是 `dp[i + a[i]] = dp[i]`

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int i = 0; i < _; ++i) {
        int n;
        cin >> n;
        vector<int> data(n), ans(n + 1, INT_MAX);
        for (auto &item : data) cin >> item;
        ans[0] = 0;
        if (data[0] + 1 <= n) ans[data[0] + 1] = 0;
        for (int i = 1; i < n; ++i) {
            ans[i] = min(ans[i], ans[i - 1] + 1);
            if (i + data[i] + 1 <= n) ans[i + data[i] + 1] = min(ans[i], ans[i + data[i] + 1]);
        }
        ans[n] = min(ans[n], ans[n - 1] + 1);
        cout << ans[n] << endl;
    }
}
```

# F. Minimum Maximum Distance

## 大致题意

有一棵树，有些节点是红色的。求算树上的每一个节点到达最远的那个红色节点所需要的距离中，最小的那个值是多少

## 思路

树上做两次 dfs 就行了，第一次求出每个节点它下面最深的红色节点距离的位置，第二次做类似换根操作即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k, ans = INT_MAX;
        cin >> n >> k;
        vector<int> deep(n + 1), mDeep(n + 1);
        set<int> mark;
        vector<vector<int>> edge(n + 1);
        for (int i = 0; i < k; ++i) {
            int tmp;
            cin >> tmp;
            mark.insert(tmp);
        }
        for (int i = 0; i < n - 1; ++i) {
            int u, v;
            cin >> u >> v;
            edge[u].push_back(v);
            edge[v].push_back(u);
        }

        if (n == 1) {
            cout << 0 << endl;
            continue;
        }
        function<void(int, int)> dfs1 = [&](int x, int p) {
            for (auto &i: edge[x]) {
                if (p == i) continue;
                deep[i] = deep[x] + 1;
                dfs1(i, x);
            }
            mDeep[x] = mark.count(x) ? 0 : INT_MIN;
            for (auto &i: edge[x]) {
                if (p == i) continue;
                mDeep[x] = max(mDeep[x], mDeep[i] + 1);
            }
        };
        function<void(int, int, int)> dfs2 = [&](int x, int p, int v) {
            ans = min(ans, max(v, mDeep[x]));
            if (edge[x].size() == 1 && p != -1) return;
            if (p != -1 && edge[x].size() == 2) {
                dfs2(edge[x][0] == p ? edge[x][1] : edge[x][0], x, mark.count(x) ? max(v + 1, 1) : v + 1);
                return;
            }
            if (p == -1 && edge[x].size() == 1) {
                dfs2(edge[x][0], x, mark.count(x) ? max(v + 1, 1) : v + 1);
                return;
            }
            sort(edge[x].begin(), edge[x].end(), [&](const int &u, const int &v) {
                if (u == p) return false;
                if (v == p) return true;
                return mDeep[u] > mDeep[v];
            });
            int base = mark.count(x) ? 1 : INT_MIN;
            for (int i = 0; i < edge[x].size() - 1; ++i)
            dfs2(edge[x][i], x, max(base, max(v, mDeep[(i == 0 ? edge[x][1] : edge[x][0])] + 1) + 1));
        };

        deep[1] = 0;
        dfs1(1, -1);
        dfs2(1, -1, INT_MIN);
        cout << ans << endl;
    }
}
```

# G. Anya and the Mysterious String

## 大致题意

有一个字符串，每次可以选择其中一段区间，为每一个字母加上一个值，即 `a + 1 = b, b + 2 = d` 这种循环编码，然后同时询问某一段内是否存在回文串

## 思路

回文串可以考虑最小单位，即两个相邻的相同字母就是回文，或者间隔一个的相同字母，目的就是查找到这些

由于有区间加法操作，所以考虑到线段树

在线段树上每个节点，都记录它下面最前面两个字母和最后两个字母，然后合并的时候可以计算因为合并，贴在一起的那一段内是否出现了回文即可

## AC code

```cpp
struct SegTree {
    vector<int> data1, data2, data3, data4, lazy;
    vector<bool> flag;
    int atom;

    explicit SegTree(int n) : data1((n << 1) + 10), data2((n << 1) + 10),
    data3((n << 1) + 10), data4((n << 1) + 10),
    lazy((n << 1) + 10), flag((n << 1) + 10, false), atom(-1) {}

    static inline int get(int l, int r) {
        return (l + r) | (l != r);
    }

    void up(int l, int r) {
        if (l == r) return;

        int mid = (l + r) >> 1;
        int cur = get(l, r), lx = get(l, mid), rx = get(mid + 1, r);
        flag[cur] = flag[lx] || flag[rx];
        data1[cur] = data1[lx];
        data2[cur] = data2[lx];
        data3[cur] = data3[rx];
        data4[cur] = data4[rx];
        if (data2[cur] < 0) data2[cur] = data1[rx];
        if (data3[cur] < 0) data3[cur] = data4[lx];
        if (flag[cur]) return;

        if (data4[lx] == data1[rx] || data4[lx] == data2[rx] || data3[lx] == data1[rx]) flag[cur] = true;
        else flag[cur] = false;
    }

    void build(int l, int r) {
        int cur = get(l, r);
        lazy[cur] = 0;
        if (l == r) {
            data2[cur] = atom--;
            data3[cur] = atom--;
            return;
        }
        int mid = (l + r) >> 1;
        build(l, mid);
        build(mid + 1, r);
        up(l, r);
    }

    void push(int l, int r) {
        int cur = get(l, r);
        if (!lazy[cur]) return;
        int mid = (l + r) >> 1;
        int lx = get(l, mid), rx = get(mid + 1, r);
        data1[lx] = (data1[lx] + lazy[cur]) % 26;
        data2[lx] = data2[lx] < 0 ? data2[lx] : (data2[lx] + lazy[cur]) % 26;
        data3[lx] = data3[lx] < 0 ? data3[lx] : (data3[lx] + lazy[cur]) % 26;
        data4[lx] = (data4[lx] + lazy[cur]) % 26;
        lazy[lx] = (lazy[lx] + lazy[cur]) % 26;

        data1[rx] = (data1[rx] + lazy[cur]) % 26;
        data2[rx] = data2[rx] < 0 ? data2[rx] : (data2[rx] + lazy[cur]) % 26;
        data3[rx] = data3[rx] < 0 ? data3[rx] : (data3[rx] + lazy[cur]) % 26;
        data4[rx] = (data4[rx] + lazy[cur]) % 26;
        lazy[rx] = (lazy[rx] + lazy[cur]) % 26;

        lazy[cur] = 0;
    }

    void update(int l, int r, int x, int y, int w) {
        if (l == x && y == r) {
            int cur = get(l, r);
            data1[cur] = (data1[cur] + w) % 26;
            data2[cur] = data2[cur] < 0 ? data2[cur] : (data2[cur] + w) % 26;
            data3[cur] = data3[cur] < 0 ? data3[cur] : (data3[cur] + w) % 26;
            data4[cur] = (data4[cur] + w) % 26;
            lazy[cur] = (lazy[cur] + w) % 26;
            return;
        }
        push(l, r);
        int mid = (l + r) >> 1;
        if (y <= mid) update(l, mid, x, y, w);
        else if (x > mid) update(mid + 1, r, x, y, w);
        else {
            update(l, mid, x, mid, w);
            update(mid + 1, r, mid + 1, y, w);
        }
        up(l, r);
    }

    bool query(int l, int r, int x, int y) {
        if (l == x && y == r) {
            return flag[get(l, r)];
        }
        push(l, r);
        int mid = (l + r) >> 1;
        if (y <= mid) return query(l, mid, x, y);
        else if (x > mid) return query(mid + 1, r, x, y);
        else {
            bool tmp = query(l, mid, x, mid) || query(mid + 1, r, mid + 1, y);
            if (tmp) return true;
            int lx = get(l, mid), rx = get(mid + 1, r);
            if (data4[lx] == data1[rx]) return true;
            if (x <= mid - 1 && data3[lx] == data1[rx]) return true;
            if (y > mid + 1 && data4[lx] == data2[rx]) return true;
        }
        return false;
    }

    void debug(int l, int r) {
        #ifdef ACM_LOCAL
        int cur = get(l, r);
        cerr << '[' << l << '-' << r << "]: " << flag[cur] << "\t"
        << (data1[cur] >= 0 ? char(data1[cur] + 'a') : ' ')
        << (data2[cur] >= 0 ? char(data2[cur] + 'a') : ' ')
        << (data3[cur] >= 0 ? char(data3[cur] + 'a') : ' ')
        << (data4[cur] >= 0 ? char(data4[cur] + 'a') : ' ') << endl;
        if (l == r) return;
        int mid = (l + r) >> 1;
        debug(l, mid);
        debug(mid + 1, r);
        #endif
    }
};

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, q;
        cin >> n >> q;
        string str;
        str.reserve(n);
        SegTree tree(n);
        cin >> str;
        for (int i = 0; i < n; ++i) tree.data4[(i + 1) << 1] = tree.data1[(i + 1) << 1] = (str[i] - 'a');
        tree.build(1, n);
        for (int i = 0; i < q; ++i) {
            int o, l, r, w;
            cin >> o >> l >> r;
            if (o == 1) {
                cin >> w;
                tree.update(1, n, l, r, w % 26);
            } else
            cout << (tree.query(1, n, l, r) ? "NO" : "YES") << endl;
        }
        tree.debug(1, n);
    }
}
```
