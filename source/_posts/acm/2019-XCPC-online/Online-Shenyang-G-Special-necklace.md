---
title: 【2019沈阳网络赛】G、Special necklace——自闭的物理题
date: 2019-09-14 17:06:39
categories: ACM&算法
tag:
 - ACM
 - XCPC
math: true
---

**这道题让我差点怀疑自己高考没考过物理**

题意中

> he measures the resistance of any two endpoints of it, the resistance values are all $2a$

指的是在三角形中电阻为 $2a$ 而不是边上的电阻为 $2a$
实际上每条边的电阻R为

$\frac{1}{R} + \frac{1}{2R} = 2a$

可以求得$R = 3a$

所以可以得到递推公式

$a_{n+1} = \frac{1}{ \frac{1}{ \frac{1}{ \frac{1}{a_{n}} + \frac{4}{3}} + 3} + \frac{1}{3}}$

通过python打表

```python
res = 5 / 3
print('%.20f' % res)
for i in range(20):
    res = 1 / ((1 / (1 / (1 / res + 4 / 3) + 3)) + 1 / 3)
    print('%.20f' % res)
```

得到

> 1.66666666666666674068
> 1.61904761904761906877
> 1.61805555555555535818
> 1.61803444782168193150
> 1.61803399852180329610
> 1.61803398895790206957
> 1.61803398875432269399
> 1.61803398874998927148
> 1.61803398874989712297
> 1.61803398874989490253
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048
> 1.61803398874989468048

这是 $a = 1$ 的情况，最后乘上 a 就行
很明显了，直接打表就行，借助一下字符串流

```c
#include <bits/stdc++.h>

using namespace std;

vector<double> res;

void init() {
    res.push_back(1.66666666666666674068);
    res.push_back(1.61904761904761906877);
    res.push_back(1.61805555555555535818);
    res.push_back(1.61803444782168193150);
    res.push_back(1.61803399852180329610);
    res.push_back(1.61803398895790206957);
    res.push_back(1.61803398875432269399);
    res.push_back(1.61803398874998927148);
    res.push_back(1.61803398874989712297);
    res.push_back(1.61803398874989468048);
    res.push_back(1.61803398874989468048);
    res.push_back(1.61803398874989468048);
    res.push_back(1.61803398874989468048);
    res.push_back(1.61803398874989468048);
    res.push_back(1.61803398874989468048);
}

void solve() {
    int t;
    cin >> t;
    init();
    while (t--) {
        string str;
        double a;
        cin >> str >> a;
        if (str.length() > 2) {
            cout << fixed << setprecision(10) << res.back() * a << endl;
            continue;
        }
        stringstream ss(str);
        int n;
        ss >> n;
        if (n > res.size() - 1) {
            cout << fixed << setprecision(10) << res.back() * a << endl;
        } else {
            cout << fixed << setprecision(10) << res[n - 1] * a << endl;
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    long long test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        cin.putback(acm_local_for_debug);
        if (test_index_for_debug > 20) {
            throw runtime_error("Check the stdin!!!");
        }
        auto start_clock_for_debug = clock();
        solve();
        auto end_clock_for_debug = clock();
        cout << "Test " << test_index_for_debug << " successful" << endl;
        cerr << "Test " << test_index_for_debug++ << " Run Time: "
             << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
        cout << "--------------------------------------------------" << endl;
    }
#else
    solve();
#endif
    return 0;
}
```
