---
title: Educational Codeforces Round#154 (Div. 2)
date: 2023-09-02 12:42:08
updated: 2023-09-02 12:42:08
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

# A. Prime Deletion

## 大致题意

给一个 9 位数的数字，其中 $1-9$ 恰好各出现一次，允许删除一些位置，并保持原来的顺序不变，然后最终结果需要是一个素数。给出一个可能的素数，要求至少两位数

## 思路

看起来很难的问题，实际上很容易解决。因为至少两位数，且每个数字都有，那么我只要找到几个万能的解不就行了

我选择了 $13$ 和 $31$，只需要观察原数组中 $1, 3$ 的相对位置，选择其中一个输出即可

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string str;
        str.reserve(9);
        cin >> str;
        int pos1 = 0, pos3 = 0;
        for (int i = 0; i < str.size(); ++i) {
            if (str[i] == '1') pos1 = i;
            if (str[i] == '3') pos3 = i;
        }

        if (pos1 < pos3) cout << "13" << endl;
        else cout << "31" << endl;
    }
}
```

# B. Two Binary Strings

## 大致题意

给你两个 01 字符串 $s$，长度为 $n$，允许你对任何一个字符串进行无数次如下操作，问是否可能这两个字符串相同

 - 选择 $l, r$ 满足，$1 \leq l < r \leq n$
 - 且 $s\_l = s\_r$
 - 使得 $\forall i \in [l, r], s\_i \rightarrow s\_l$

## 思路

看似很头痛的问题，实际上很简单

如果一个字符串首尾是相同的，那么直接全选，就可以让这个字符串变成完全相同的字符串了，那就不用那么操心了。而反过来可以发现，字符串的首尾是一定不会变化的，因为它必定是被选择的 $l, r$，所以这两个字符串的首尾必须相互映射。如果同时顺便首尾相同了，那也不用思考更多了

接下来考虑首尾不同的情况，也就是一定同时存在 $0, 1$

那么必定存在一个位置，出现 $01$ 或者 $10$ 相邻的情况，为了方便起见，也为了避免出现混乱，这里假定原字符串开头为 $0$，结束为 $1$，那么我们去找 $01$ 即可，因为必定存在。反之依然，证明同理

那么就有两种可能：1、两个字符串都在这个位置出现这个相邻，2、两个字符串不存在同时出现这个相邻情况

前者比较好办，直接从这个位置将字符串拆分成两半，每一半都是相同的即可

后者则可以证明无解决方案。方法也很简单：因为一旦有一个不相同，那么必然需要处理成相同的，而一旦需要处理，则需要外部的来把她们抹成相同（每次操作后 01 段数量一定减少，所以只能抹去）而外部本身也没有匹配上，故需要外部的外部来抹去，依此类推，可以得到无法解决

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string a, b;
        a.reserve(5000);
        b.reserve(5000);
        cin >> a >> b;
        if (a.front() != b.front() || a.back() != b.back()) {
            cout << "NO" << endl;
            continue;
        }

        if (a.front() == a.back()) {
            cout << "YES" << endl;
            continue;
        }

        bool flag = false;
        for (int i = 0; i < a.size() - 1; ++i) {
            if (a[i] == a.front() && a[i + 1] == a.back() && b[i] == b.front() && b[i + 1] == b.back()) {
                flag = true;
                break;
            }
        }

        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# C. Queries for the Array

## 大致题意

一个数组，开始的时候是空的，有三种操作

 - 在数组最后加一个值
 - 移去数组最后的一个值
 - 询问数组是否有序

现在告诉你操作的顺序，以及是否有序的结果，但是不告诉你具体加了什么值，问是否可能

## 思路

简单题，用栈模拟即可，只要记住两个原则即可

 - 若当前有序，那么删除最后一个值仍然有序
 - 若当前无序，那么加入一个值仍然无序

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    string str;
    str.reserve(200010);
    for (int ts = 0; ts < _; ++ts) {
        cin >> str;
        stack<int> flag;
        bool res = true;
        for (char i : str) {
            switch (i) {
                case '+':
                    if (!flag.empty() && flag.top() == 2) {
                        flag.push(2);
                    } else {
                        flag.push(0);
                    }
                    break;
                case '-':
                    if (flag.size() >= 2 && flag.top() == 1) {
                        flag.pop();
                        flag.top() = 1;
                    } else {
                        flag.pop();
                    }
                    break;
                case '1':
                    if (!flag.empty() && flag.top() == 2) {
                        res = false;
                        break;
                    }
                    if (!flag.empty()) {
                        flag.top() = 1;
                    }
                    break;
                case '0':
                    if (flag.empty() || flag.size() == 1 || flag.top() == 1) {
                        res = false;
                        break;
                    }
                    if (!flag.empty()) {
                        flag.top() = 2;
                    }
                    break;
            }
        }

        cout << (res ? "YES" : "NO") << endl;
    }
}
```

# D. Sorting By Multiplication

## 大致题意

给你一个数组，开始的时候都是正整数，允许你进行如下操作，让整个数组变成严格递增，至少需要几次

 - 选择数组上任意的一个区间
 - 选择一个任意整数，可以是负数
 - 将区间内的每一个值都乘上选择的素数

## 思路

第一感觉是可以用 dp 解决，也索性从这个方向考虑了。

每个数字其实可以是正数 or 负数，这很明显，也是这个题目要考虑的重点

定义 $dp[i][j]$，其中 $i$ 表示位置，$j$ 表示当前值是正数还是负数，$0$ 表示正数，$1$ 表示负数

- 任何一个值，如果它前面是负值，那么它自身不需要任何操作就能满足局部严格递增
- 如果当前值和前一个值在初始值上已经严格递增了，且前一个值不是负数的情况下，那么只需要跟着前一个值进行一样的乘 $x$ 运算即可，最终也保持严格递增
- 如果当前值和前一个值已经在初始值上递减了，那么要么让前一个值变成负数，要么就需要自身乘以一个更高的系数来放大

根据上述三条，可以得到状态转移方程

{% raw %}
$$
\left\{\begin{matrix}
 dp_{i,0} = &
\left\{\begin{matrix}
min(dp_{i-1,0}, dp_{i-1,1}), & a_{i-1} < a_i \\
min(dp_{i-1,0} + 1, dp_{i-1,1}), & a_{i-1} = a_i \\
min(dp_{i-1,0} + 1, dp_{i-1,1}), & a_{i-1} > a_i
\end{matrix}\right.
\\
dp_{i,1} = &
\left\{\begin{matrix}
dp_{i-1, 1} + 1, & a_{i-1} < a_i
dp_{i-1, 1} + 1, & a_{i-1} = a_i
dp_{i-1, 1}, & a_{i-1} > a_i
\end{matrix}\right.
\end{matrix}\right.
$$
{% endraw %}

## AC code

```cpp
void solve() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (auto &item: data) cin >> item;
        vector<int> dp[2];
        for (auto &row: dp) row.resize(n);

        dp[0][0] = 0;
        dp[1][0] = 1;
        for (int i = 1; i < n; ++i) {
            if (data[i - 1] < data[i]) {
                dp[0][i] = min(dp[0][i - 1], dp[1][i - 1]);
                dp[1][i] = dp[1][i - 1] + 1;
            } else if (data[i - 1] == data[i]) {
                dp[0][i] = min(dp[0][i - 1] + 1, dp[1][i - 1]);
                dp[1][i] = dp[1][i - 1] + 1;
            } else {
                dp[0][i] = min(dp[0][i - 1] + 1, dp[1][i - 1]);
                dp[1][i] = dp[1][i - 1];
            }
        }
        cout << min(dp[0][n - 1], dp[1][n - 1]) << endl;
    }
}
```
