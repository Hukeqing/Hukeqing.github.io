---
title: Codeforces Round#706(Div. 2)-Let's Go Hiking
date: 2022-05-28 07:20:53
tag:
 - ACM
 - Codeforces
math: true
---

# B2. Tokitsukaze and Good 01-String (hard version)

## 大致题意

有一段 01 组成的字符串，保证长度为偶数

你可以选择一个 0 或者 1，将其变为 1 或者 0

问至少需要操作几次，可以使得所有的 0 或者 1 段都为偶数长度。同时，此时，最少有多少段单独段 0 或 1 段

## 分析

首先，因为总长度为偶数，所以奇数段一定是成对出现的，可以简单讨论五种情况

 - 改变一个奇数段内部，可以生成两个偶数段一个奇数段
 - 改变一个偶数段内部，可以生成两个奇数段和一个偶数段
 - 改变两个偶数段边缘，可以生成两个奇数段
 - 改变两个奇数段边缘，可以生成两个偶数段
 - 改变奇偶段边缘，可以交换奇偶关系

这几种方法中，只有改变两个奇数段边缘是有意义的，但是并不一定每次都那么好运。所以必须选择一种方法去将两个离得很远的奇数段靠近

明显只有第一个和最后一个可选，在不产生新的奇数段的前提下改变位置。但是第一个明显有点蠢……因为生成的奇数段在原奇数段内部（仅一个 0 或者 1），所以只能选最后一种方案

所以我们需要选择两个奇数段，然后通过方法五将它们贴近到相邻，然后再用方法四消灭它们，所需要的数量也就是奇数段之间的偶数段个数 + 1

数量解决了，接下来就是分配如何变化使得数量最少了。因为对于每一个奇数段而言，只会改变一个，而对于偶数段而言，两侧边缘都需要发生变化，所以

当奇数段的长度为 1 的时候，变化此奇数段，当偶数段长度为 2 的时候，左右两侧都变化此偶数段。然后再统计不同的奇偶段数量即可

## AC Code

```cpp
#include "bits/stdc++.h"

using namespace std;

#define int long long

void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        string str;
        str.resize(n);
        cin >> str;
        vector<int> st;
        char last = -1;
        for (int i = 0; i < n; ++i) {
            if (str[i] == last) {
                st.back()++;
            } else {
                st.push_back(1);
                last = str[i];
            }
        }
        int isOdd = 0, ans = 0;
        for (int i = 0; i < st.size(); ++i) {
            if (st[i] % 2) {
                isOdd = !isOdd;
                if (st[i] == 1) st[i] = 0;
            } else if (isOdd) {
                if (st[i] == 2) st[i] = 0;
            }
            ans += isOdd;
        }
        int ls = -1, cnt = 0;
        for (int i = 0; i < st.size(); ++i) {
            if (st[i] == 0) continue;
            if (ls != (i % 2)) {
                ls = i % 2;
                cnt++;
            }
        }
        cout << ans << ' ' << max(1LL, cnt) << endl;
    }
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    signed localTestCount = 1, localReadPos = (signed) cin.tellg();
    char localTryReadChar;
    do {
        if (localTestCount > 20)
            throw runtime_error("Check the std input!!!");
        auto startClockForDebug = clock();
        solve();
        auto endClockForDebug = clock();
        cerr << "Test " << localTestCount++ << " Run Time: "
             << double(endClockForDebug - startClockForDebug) / CLOCKS_PER_SEC << "s" << endl;
//        cout << "Test " << localTestCount << " successful" << endl;
//        cout << "--------------------------------------------------" << endl;
    } while (localReadPos != cin.tellg() && cin >> localTryReadChar && localTryReadChar != '$' &&
             cin.putback(localTryReadChar));
#else
    solve();
#endif
    return 0;
}

```
