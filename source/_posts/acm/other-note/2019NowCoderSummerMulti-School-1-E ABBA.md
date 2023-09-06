---
title: 2019 牛客暑期多校第一场 E题 ABBA
date: 2019-07-22 00:15:01
categories: ACM&算法
tag:
 - ACM
 - NowCoder
math: true
---

[题目链接](https://ac.nowcoder.com/acm/contest/881/E)

# 大致题意
有$(n + m)$个字母A和$(n + m)$个字母B，组成一个长度为 $2*(n + m)$的字符串，并且使得字符串中有$n$个“AB”和$m$个“BA”，求出可能的组合数（mod 1e9+7）
例如，n = 1 m = 2时，可以有这样的字符串（并不是全部的字符串）：
ABBABA
ABBBAA
BBABAA
上面三个字符串均满足条件
# 解题思路
考虑递推，假设已经有一个字符串满足一定的“先决条件”（此处应当理解为数学归纳法，及假设n - 1时满足）
下面考虑==在字符串最后加入一个字符==的情况。仅有两种可能：加A或者加B(~~这不是白说吗~~)
但是考虑一下极端情况，我们可以得到一些简单的且明显的条件（N~A~表示已经在字符串中的A个数，N~B~同理）
假如字符串的组成类似这样：

> AAAAABBBBBBBB

则此字符串中，只能组合出 AB 而不可能组合出 BA
此时，我们假设 $n$ 为 5
而这个字符只能且必定要组合成 5 个AB，也就是说，我们接下来加入字符，只能加入 A 而不能加入 B 
此时我们往前推，如果出现了这样一个字符串，则在之前，必定出现如下状态：

> AAAAA

也即是 5 个A的情况，此时我们可以得到一个确定的关系式：

> N~B~ = 0 and N~A~ <= n

推广到有B的情况，最优的情况就是**所有的B都是用来组成BA**，那么可以得到我们真正需要的关系式：

> N~A~ - N~B~ <= n

同理，相对于 B 而言，我们可以得到

> N~B~ - N~A~ <= m

合并上述两式

> -n < N~A~ - N~B~ <= m

所以根据下标为 N~A~ - N~B~ 建立DP数组，下标范围为 -n 到 m （均包含）DP的内容为方案数量（mod 1e9 + 7），递推公式为
$dp[i] = dp[i - 1] + dp [i + 1]$
其中，dp[i - 1]指的是加入一个B（增加一个B使得N~A~ - N~B~变小）。而dp[i + 1]指的是加入一个A
当考虑到无论是正向dp还是逆向dp，均有值优先于dp[i]先更新（dp[i - 1]和dp[i + 1]会比dp[i]先更新），所以采用两个dp数组的方式，初始值dp[0]=1。每两次dp完后，dp[0]的值及为答案。

# AC代码
```c
#include <bits/stdc++.h>

using namespace std;

#define MAXN 2100
#define MOD (int)(1e9 + 7)
typedef long long ll;

ll dp[MAXN][2];

int trans(int x) {
    return x + 1000;
}

int main() {
#ifdef ACM_LOCAL
    freopen("debug.txt", "r", stdin);
#endif
    ios::sync_with_stdio(false);
    int n, m;
    while (cin >> n >> m) {
        memset(dp, 0, sizeof(dp));
        dp[n][1] = 1;
        int cur = 0;
        int last = 1;
        for (int i = 0; i < 2 * (n + m); i++) {
            for (int j = -n; j <= m; j++) {
                if (j != -n) {
                    dp[j + n][cur] += dp[j - 1 + n][last];
                    dp[j + n][cur] %= MOD;
                }
                if (j != m) {
                    dp[j + n][cur] += dp[j + 1 + n][last];
                    dp[j + n][cur] %= MOD;
                }
            }
            for (int j = -n; j <= m; j++) {
                dp[j + n][last] = 0;
            }
            swap(cur, last);
        }
        cout << dp[n][last] << endl;
    }
    return 0;
}
```
