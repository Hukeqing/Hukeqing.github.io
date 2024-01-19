---
title: Educational Codeforces Round 158 (Rated for Div. 2)
date: 2024-01-19 21:39:40
updated: 2024-01-19 21:39:40
categories:
- ACM&算法
tag:
- ACM
- Codeforces
math: true
description: Educational Codeforces Round 158 (Rated for Div. 2) 个人写题记录
---

# A. Line Trip

## 大致题意

有一辆车，需要开到某个目的地，然后再回来，路上有几个加油站，初始的时候或者经过加油站的时候，油可以加满，问油箱的容量最小为多少

## 思路

注意一下最后回来那段是两段折返的路就行了

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, x;
        cin >> n >> x;
        vector<int> data(n);
        for (auto& i: data) cin >> i;
        int ans = max(data.front(), 2 * (x - data.back()));
        for (int i= 1; i < n; ++i) ans = max(ans, data[i] - data[i - 1]);
        cout << ans << endl;
    }
}
```

# B. Chip and Ribbon

## 大致题意

有一个数组，开始的每一个值都是 0，除了第一个值是 1，有一个指针指向其中一个数值

每次允许将当前指针指到下一个值，或者直接传送到另外一个任意位置，必须要进行一次移动，然后将移动后的值 $+1$

问最小的传送次数

## 思路

注意每次移动只能移动到下一个值，也就是要回来删必须传送

所以对于每一个递减的子串，只取决于第一个值的代价，而第一个值的代价又和它前一个值相关，因为只要减少到和前一个值一样就行了

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
        for (auto& i: data) cin >> i;
        int begin = data[0], ans = data[0] - 1;
        for (int i = 1; i < n; ++i)
            if (data[i] > data[i - 1])
                ans += data[i] - data[i - 1];
        cout << ans << endl;
    }
}
```

# C. Add, Divide and Floor

## 大致题意

有一个数组，每次允许将每一个值都加上任选的一个 $x$，然后再向下取整的方式除以 $2$。问最少需要操作多少次才能让所有值一样

## 思路

其实只需要考虑最大和最小的那两个值即可

考虑公式$\left \lfloor \frac{a+x}{2} \right \rfloor = \left \lfloor \frac{a}{2} + \frac{x}{2} \right \rfloor$ 可以得到
实际上 $x$ 应该尽可能小才是，否则差值并不能很快缩小

因为是向下取整，所以当最小的值是奇数的时候，且最大值是偶数的时候，这个时候全部的值加上 $1$ 就可以非常有效的降低差值，
而在其他的时候 $x$ 取 $0$ 即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        int mi = INT_MAX, ma = 0;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            mi = min(mi, tmp);
            ma = max(ma, tmp);
        }
        vector<int> ans;
        while (mi != ma) {
            if (mi % 2 && !(ma % 2)) {
                mi = (mi + 1) / 2;
                ma = (ma + 1) / 2;
                ans.push_back(1);
            } else {
                mi /= 2;
                ma /= 2;
                ans.push_back(0);
            }
        }
        cout << ans.size() << endl;
        if (ans.size() <= n) {
            for (const auto& i: ans) cout << i << ' ';
        }
        cout << endl;
    }
}
```

# D. Yet Another Monster Fight

## 大致题意

有一组怪物，允许选择一个初始的怪物进行攻击，

攻击后，伤害会连锁伤害到其他的怪物上，连锁的顺序是随机选择一个被攻击过的怪物附近的一个没有被攻击的怪物，最终所有怪物都会被连锁到。
而连锁的伤害则是逐步递减

问在可以指定直接攻击的怪物的情况下，最小的初始攻击应该是多少，才能将所有怪都干掉

## 思路

由于连锁的顺序是随机的，所以对于每一个怪物而言，它的最晚承受伤害的时间就是它左边的所有怪都受到过伤害了，或者是它右边所有的怪都受到过伤害了，
至于应该是左边还是右边，那就取决于第一个怪是在它左边还是右边。
那么对于它而言，无论选择哪一个初始的怪，其需要的初始伤害是确定的，即它自身的生命值 + 它左边/右边的怪的数量

那么就可以枚举所有的初始的怪，然后找出左边所有怪里面，最大的需要是多少，和其右边里面，最大的需要是多少，然后在和当前怪的生命值取较大值即可

## AC code

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> data(n);
    for (auto& i: data) cin >> i;
    map<int, int> l, r;
    int ans = INT_MAX;
    for (int i = 0; i < n; ++i) ++r[data[i] + i];
    for (int i = 0; i < n; ++i) {
        if (const auto iter = r.find(data[i] + i); iter->second == 1) r.erase(iter);
        else --iter->second;
        if (i != 0) ++l[data[i - 1] + n - i];
        const int ls = l.empty() ? 0 : l.rbegin()->first, rs = r.empty() ? 0 : r.rbegin()->first;
        ans = min(ans, max(data[i], max(ls, rs)));
    }
    cout << ans << endl;
}
```
