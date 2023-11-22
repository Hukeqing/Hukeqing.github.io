---
title: Codeforces Round#706(Div. 2)-Let's Go Hiking
date: 2021-03-11 15:57:53
updated: 2021-03-11 15:57:53
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# Let's Go Hiking
## 大致题意

有一个数组，两个人，第一步，两个人先后选择数组中的两个下标，要求两个人选择的下标不可以相同。随后按照选择顺序以此进行选择，要求选择一个新的下标，使得新的下标是原来下标的左边或者右边，且不超出数组边界，其中第一个选择的人需要保证新的下标对应的值严格小于原来的下标对应的值，而第二个选择的人则相反，需要选择严格大于的，且保证两人在任意时刻选择的下标不相同，第一个不能选择的人为失败，问第一个人第一次选择哪些下标能够使得他必赢，仅需要输出下标个数

## 解题思路
按照题目要求，肯定是尽量让第一个人去选择最长的严格单调的子串的最大端，这样第一个人的可选个数最多。而若仅仅如此选择，那么作为第二手，他必定可以选择与这个下标相邻的且比第一个人选的值小的，则可以堵死第一个人的下一步选择

> 例如
> 1, 2, 3, 4, 5, 6, 7
> 对于第一个人而言，他肯定是选择 7 比较好，因为他接下来可以走 6、5、4、3、2、1，拥有最多的步数
> 但是第二个人完全可以直接选择 6，使得第一个人无法走，因为不能选择相同下标

既然单调的子串会因为第二个人的直接掐断而注定失败，那必定需要为第一个人做第二手的准备，也就是必须要构造一个峰，使得左右两侧都可以下坡，避免出现上述的情况

由于上面得到的结论，假定这个峰左侧的坡较长，而右侧较短。此时第二个人必然选择左侧的峰底，或者峰底以上的一个值。这样无论第一个人往左走还是往右走，都可以保证第一个人会率先遇到无法选择的问题

> 例如
> 1, 2, 3, 4, 5, 4, 3, 2
> 作为第一个人，必定应该选 5
> 那么第二个人可以直接选 2 （左坡峰底以上的一个值）
> 若选择往左坡走，那么恰好第一个人遇到无法选择
> 若往右坡走，那么第一个人必定会把 5 腾出来，使得第二个人拥有和第一个人一样的路程，第一个人仍然输

那么可以很简单的想到，这个峰必须是左右坡长度相同的，但似乎不一定，例如下面这个例子

> 例如
> 1, 2, 3, 4, 3, 2, 1
> 作为第一个人，则必定是选 4
> 第二个人也没太多选择的余地，肯定是选 1
> 这时会发现仍然第一个人输了

而如果是下面这个例子

> 例如
> 1, 2, 3, 4, 5, 4, 3, 2, 1
> 可以容易得出，第一个人能够赢的结论

所以答案就是找出存在的一个峰，使得它的左坡和右坡的长度恰好相等且为奇数，则为答案

但是似乎并不是很完整，如果出现下面这样的情况

> 例如
> 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5
> 按照上面的规律，第一个人只能选择 4
> 而实际上有更长的坡可以使用，所以第二个人会选择更长的坡，所以第一个人仍然输

同时，还需要保证这个峰是独一无二的，没有其他的坡比他的要大，或者相等

## AC code
```cpp
#include <bits/stdc++.h>

using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> data(n), l(n), r(n);
    for (int i = 0; i < n; ++i) cin >> data[i];

    int cur = 1;
    l[0] = l[n - 1] = r[0] = r[n - 1] = 1;
    for (int i = 1; i < n; ++i) {
        if (data[i] > data[i - 1]) cur++;
        else cur = 1;
        l[i] = cur;
    }
    cur = 1;
    for (int i = n - 2; i >= 0; --i) {
        if (data[i] > data[i + 1]) cur++;
        else cur = 1;
        r[i] = cur;
    }

    int maxLen = 0, count = 0;
    for (int i = 0; i < n; ++i) if (l[i] == r[i] && l[i] & 1) maxLen = max(maxLen, l[i]);
    for (int i = 0; i < n; ++i) count += (l[i] == maxLen) + (r[i] == maxLen);
    cout << (count == 2 ? 1 : 0) << endl;
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    signed localTestCount = 1, localReadPos = cin.tellg();
    char localTryReadChar;
    do {
        if (localTestCount > 20)
            throw runtime_error("Check the stdin!!!");
        auto startClockForDebug = clock();
        solve();
        auto endClockForDebug = clock();
        cout << "Test " << localTestCount << " successful" << endl;
        cerr << "Test " << localTestCount++ << " Run Time: "
             << double(endClockForDebug - startClockForDebug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "--------------------------------------------------" << endl;
    } while (localReadPos != cin.tellg() && cin >> localTryReadChar && localTryReadChar != '$' &&
             cin.putback(localTryReadChar));
#else
    solve();
#endif
    return 0;
}
```
