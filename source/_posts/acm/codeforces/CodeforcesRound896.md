---
title: Codeforces Round 896 (Div. 2)
date: 2023-09-16 09:08:44
updated: 2023-09-16 09:08:44
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Make It Zero

## 大致题意

有一个数组，允许你每次选择一个区间，然后将这个区间内的所有值变成他们异或和的结果，问给出一种最多只进行 8 次的操作的可能方法使得整个数组变成 0

## 思路

不要求最小，只要能就行，简单了很多很多

首先，偶数个相同的值进行异或和，结果为 0，如果整个数组长度为偶数，那么直接异或和两次即可

如果为奇数，那么先把前 $n - 1$ 个异或和一下，最后再异或和两次最后两个值即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, tmp;
        cin >> n;
        for (int i = 0; i < n; ++i) cin >> tmp;
        if (n % 2) {
            cout << 4 << endl;
            cout << 1 << ' ' << n << endl;
            cout << 1 << ' ' << n - 1 << endl;
            cout << n - 1 << ' ' << n << endl;
            cout << n - 1 << ' ' << n << endl;
        } else {
            cout << 2 << endl;
            cout << 1 << ' ' << n << endl;
            cout << 1 << ' ' << n << endl;
        }
    }
}
```

# B. 2D Traveling

## 大致题意

有一个棋盘，开始在 $a$ 点，要前往 $b$ 点，只能中途停留在固定的 $n$ 个节点中任意一个

任意两个节点之间的成本是他们的棋盘距离，但是有 $k$ 个节点，他们之间相互的成本是 $0$

问最少成本是多少

## 思路

棋盘距离就意味着，其实中间停留是毫无意义的，直接到终点就行了，没必要停留

但是有一些特殊节点，所以只需要找到距离 $a$ 最近的特殊节点，并计算成本，和距离 $b$ 的特殊节点，并计算成本，然后将两个成本相加和直接前往的成本差异，求较小值就行

## AC code

```cpp
#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, k, a, b;
        cin >> n >> k >> a >> b;
        vector<pair<int, int>> data(n);
        for (auto &item: data) cin >> item.first >> item.second;
        auto dist = [&](int l, int r) {
            return abs(data[l].first - data[r].first) + abs(data[l].second - data[r].second);
        };
        int ans = dist(a - 1, b - 1);
        int ak = INT_MAX * 2LL, bk = INT_MAX * 2LL;
        for (int i = 0; i < k; ++i) {
            ak = min(ak, dist(i, a - 1));
            bk = min(bk, dist(i, b - 1));
        }
        cout << min(ans, ak + bk) << endl;
    }
}
```

# C. Fill in the Matrix

## 大致题意

有一个 $n \times m$ 的矩阵，将其每一行填充为 $m$ 的一个排列，求出每一列的 `MEX`，然后将每一列的 `MEX` 再求一次 `MEX`，问最终结果最大是多少，并给出矩阵

## 思路

构造题，比较简单，如果想看我的构造方案就运行一下打印出来看看吧

需要注意的是，因为矩阵比较大，不能存下来，所以需要提前算出答案输出了，不能等构造完成了再去算

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m;
        cin >> n >> m;
        if (m == 1) {
            cout << 0 << endl;
        } else if (n >= m - 1) {
            cout << m << endl;
        } else {
            cout << n + 1 << endl;
        }
        for (int i = 0; i < min(n, m - 1); ++i) {
            for (int j = 0; j < m; ++j) {
                cout << (j - i - 1 + m) % m << ' ';
            }
            cout << endl;
        }
        for (int i = min(n, m - 1); i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                cout << (j + 1) % m << ' ';
            }
            cout << endl;
        }
    }
}
```

# D1. Candy Party (Easy Version)

## 大致题意

有 $n$ 个人，每个人手上都有一些糖果，现在每个人都必需要给另外一个人 $2^x$ 个糖果，$x$ 可以是任意自然数，且每个人必须从另外一个人那里拿到他给出的糖果，问是否存在一种可能，经过这样一次操作后，所有人糖果数量相同

## 思路

首先，糖果没有新增或者丢弃，那么必然总糖果数量不变，所以很容易计算出最终每个人应该是多少糖果。那么就可以算出差值（应该最终增加/减少多少）

其次思考一个问题，由于给出/收到的糖果数量满足 $2^x$ 的形式，那么必然差值定是两个 $2^x$ 之差。例如 $3 = 4 - 1$，$7 = 8 - 1$，$4 = 8 - 4$ 等等就是合法的值，而例如 $5$ 就是一个非法的值。所以这样就可以先排除掉一部分了

很显然，每个值都只有一种可能的拆法，又因为每个人只能从一个人那里拿到糖果，那么必然所有的给出和拿到的可能性只有这些，他们必然完全相等

## AC code

```cpp
#define int long long

void solve() {
    vector<int> mi(40);
    for (int i = 0; i < 40; ++i) mi[i] = 1LL << i;
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        int sum = 0;
        for (auto &item: data) sum += item;
        if (sum % n != 0) {
            cout << "No" << endl;
            continue;
        }
        sum /= n;

        auto lowBit = [](int x) { return x & -x; };
        vector<int> p[2];
        p[0].reserve(n);
        p[1].reserve(n);
        bool flag = true;
        for (int i = 0; i < n; ++i) {
            int diff = data[i] - sum;
            if (diff == 0) continue;
            int l = diff > 0 ? 0 : 1, r = 1 ^ l;
            diff = abs(diff);
            int b = *upper_bound(mi.begin(), mi.end(), diff);
            int s = b - diff;
            if (*lower_bound(mi.begin(), mi.end(), s) != s) {
                flag = false;
                break;
            }
            p[l].push_back(b);
            p[r].push_back(s);
        }
        sort(p[0].begin(), p[0].end());
        sort(p[1].begin(), p[1].end());
        cout << (flag && p[0] == p[1] ? "YES" : "NO") << endl;
    }
}
```

# D2. Candy Party (Hard Version)

## 大致题意

和上一题类似，只不过从必须给一个人改成了至多给一个人，从一个人那拿到变成了至多从一个那里拿到。即可以不再一定要给出/收到了

## 思路

那么唯一的区别就在于那些差值本来就符合 $2^x$ 的人，因为他们既可以选择同时有给出收到，也可以选择只给出/收到。而那些不满足的则必定有给出和收到阶段

而那些本来就符合 $2^x$ 的值，如果它又同时选择有给出收到，那么称其为拆开后的，而拆开后必然得到一个更大的值。

那么可以按照下面的步骤进行模拟

1. 将所有值分成两类：已经拆过了的，没有拆过的
2. 对于每个差值，如果它满足 $2^x$，那么放入到没有拆过的组里，而不满足的，则将拆开后的两个 $2^x$ 值放入已经拆过的组里
3. 判断一下，已经拆过的里面 $abs$ 最大的值和没有拆过的里面 $abs$ 最大的值，哪个大，如果后者大，那么就把那些大的值放入已经拆过的队列（因为他们再拆开就会创造更大的值，没有必要再拆了）
4. 每次取出 $abs$ 最大的拆过的值，然后尝试在已经拆过里面为它找配对上的，即 $abs$ 相同，但是正负号相反的值，并将其消除
5. 如果找不到，那么就再去没有拆过里面找相同的条件的，并消除
6. 如果还找不到，那么再去没有拆过里面找符号相同但是值恰好为 $abs$ 的一半的，将其拆开，将 $abs$ 较大的删除，较小的放入已经拆开的队列中
7. 回到 3 步，除非两个队列都空了

## AC code

```cpp
#define int long long

void solve() {
    vector<int> mi(40);
    for (int i = 0; i < 40; ++i) mi[i] = 1LL << i;
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        int sum = 0;
        for (auto &item: data) sum += item;
        if (sum % n != 0) {
            cout << "No" << endl;
            continue;
        }
        sum /= n;

        struct cmp {
            bool operator()(const int &lhs, const int &rhs) const {
                return abs(lhs) < abs(rhs);
            }
        };

        priority_queue<int, vector<int>, cmp> depart;
        map<int, int, greater<>> pos, neg;
        bool flag = true;
        for (int i = 0; i < n; ++i) {
            int dif = data[i] - sum;
            if (dif == 0) continue;
            if (abs(dif) == *lower_bound(mi.begin(), mi.end(), abs(dif))) {
                // good gay
                (dif > 0 ? pos : neg)[abs(dif)]++;
            } else {
                // bad gay
                int b = *upper_bound(mi.begin(), mi.end(), abs(dif));
                b *= dif > 0 ? 1 : -1;
                int s = dif - b;
                if (abs(s) != *lower_bound(mi.begin(), mi.end(), abs(s))) {
                    flag = false;
                    break;
                }
                depart.push(b);
                depart.push(s);
            }
        }

        if (!flag) {
            cout << "NO" << endl;
            continue;
        }

        while (!depart.empty() || !pos.empty() || !neg.empty()) {
            if (depart.empty()) {
                auto posIter = pos.begin(), negIter = neg.begin();
                if (posIter->first == negIter->first) {
                    int tmp = min(posIter->second, negIter->second);
                    posIter->second -= tmp;
                    negIter->second -= tmp;
                    if (posIter->second == 0) pos.erase(posIter);
                    if (negIter->second == 0) neg.erase(negIter);
                    continue;
                }

                auto &iter = posIter->first > negIter->first ? posIter : negIter;
                auto mx = posIter->first > negIter->first ? 1 : -1;
                auto &u = posIter->first > negIter->first ? pos : neg;
                auto &v = posIter->first > negIter->first ? neg : pos;
                auto tIter = v.find(iter->first / 2);
                if (tIter == v.end()) {
                    flag = false;
                    break;
                }
                int tmp = min(iter->second, tIter->second);
                for (int i = 0; i < tmp; ++i) depart.push(mx * iter->first / 2);
                iter->second -= tmp;
                tIter->second -= tmp;
                if (iter->second == 0) u.erase(iter);
                if (tIter->second == 0) v.erase(tIter);
            }

            while (!pos.empty() || !neg.empty()) {
                auto posIter = pos.begin();
                auto negIter = neg.begin();

                bool posWin = negIter == neg.end() || (posIter != pos.end() && posIter->first > negIter->first);
                auto &maxIter = posWin ? posIter : negIter;
                auto &maxLink = posWin ? pos : neg;
                auto mx = posWin ? 1 : -1;
                if (maxIter->first > abs(depart.top())) {
                    for (int i = 0; i < maxIter->second; ++i) depart.push(mx * maxIter->first);
                    maxLink.erase(maxIter);
                } else {
                    break;
                }
            }

            int cnt[2] = {depart.top() < 0, depart.top() > 0};
            int cur = abs(depart.top());
            depart.pop();

            while (!depart.empty() && abs(depart.top()) == cur) {
                cnt[0] += depart.top() < 0;
                cnt[1] += depart.top() > 0;
                depart.pop();
            }

            // receives from not good gay
            int tmp = min(cnt[0], cnt[1]);
            cnt[0] -= tmp;
            cnt[1] -= tmp;
            if (cnt[0] == 0 && cnt[1] == 0) continue;

            int left = cnt[0] > 0 ? 0 : 1;
            auto &link = cnt[0] > 0 ? pos : neg;
            int mx = cnt[0] > 0 ? -1 : 1;

            // find in pos which is equals to this gay
            auto iter = link.find(cur);
            if (iter != link.end()) {
                tmp = min(cnt[left], iter->second);
                iter->second -= tmp;
                cnt[left] -= tmp;
                if (iter->second == 0) link.erase(iter);
            }
            if (cnt[left] == 0) continue;

            // not enough, find in pos which is half of this gay
            iter = link.find(cur / 2);
            if (iter != link.end()) {
                tmp = min(cnt[left], iter->second);
                for (int i = 0; i < tmp; ++i) depart.push(mx * cur / 2);
                iter->second -= tmp;
                cnt[left] -= tmp;
                if (iter->second == 0) link.erase(iter);
            }

            if (cnt[left] != 0) {
                flag = false;
                break;
            }
        }

        cout << (flag ? "YES" : "NO") << endl;
    }
}
```