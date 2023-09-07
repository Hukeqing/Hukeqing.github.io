---
title: 【2019HDU多校】第九场1006/HDU6685-Rikka with Coin——位运算打表
date: 2019-08-21 18:32:29
categories: ACM&算法
tag:
 - ACM
 - HDU
math: true
---

[题目链接](http://acm.hdu.edu.cn/showproblem.php?pid=6685)

# 题目大意
使用10、20、50、100元面额的硬币能分别组成题目给出的面额，需要最少的硬币个数

# 分析
一开始队友想用一堆if-else解决问题，然后WA了无数发……

我想到了一种比较简单的打表法来解决这个问题，而这个表长度只有==13个int==

==在开始分析之前，我们先不考虑出现 -1 的解。即出现某种情况 mod 10不等于0，因为这个判断非常简单==

## 定律
开始推这个表之前先确定一个显而易见的定律

**若存在两种方案的需要的硬币数一样，且第一种的方案能组成的面额第二种都可以组成，则第一种方案不可取。**

证明：如果我使用了第一组方案，则我必定可以使用第二种方案，即使第二种方案不能组成其他更多的面额，这样的选择也是完全没有错误的

## 推论
根据定律，可以得到下面这些推论

**1、不存在一种方案包含两个10元、同理有两个50元也不存在**

证明：如果存在一个方案包含两个10元，则我们可以选择用一个10元和一个20元代替这个方案。我们可以确定，两个10元只能组成10、20这两个面额。而10元和20元可以组成10元、20元、30元三个面额。根据定律，则确定此方案不可行。同理，两个50元可以用50+100代替

**2、仅使用4个非100元的硬币，只有两种组成方案：10、20、20、50和20、20、20、50**

证明：对于4个硬币，方案10、20、20、50可以组成10-100的所有情况，所以任何其他方案如果合理，则必须能组成有超过100元的情况。根据推论1，则50元不可以重复，所以能组成的最大的值就是用20、20、20、50组成110。

**3、不存在使用5个非100元的硬币的情况**

证明：首先如果使用了5个硬币，根据推论1，可以得到的组合仅两种：10、20、20、20、50即120元，和20、20、20、20、50即130元。那么无论这个组合怎么样，通过推论2的结论，都不如10、20、20、50、100这个组合，因为这个组合能完成10-200以内的所有解。那么根据定律，上述两个组合都是错误的组合。

**4、大于110元的面额必须要通过一个或者数个100元的硬币来组成**

证明：这个很简单，通过推理3可以直接推出。所以对于大于110元的面额都应不断的-100直到满足上述情况

## 打表
那么我们知道了最多只有4个非100元的硬币，那么我们就可以得到所有的组合情况（省略0）

> 1
> 2
> 5
> 1 2
> 1 5
> 2 2
> 2 5
> 1 2 2
> 1 2 5
> 2 2 2
> 2 2 5
> 1 2 2 5
> 2 2 2 5

那么我们可以把这些情况能组成的数字打表出来

> 1
> 2
> 5
> 1 2 3
> 1 5 6
> 2 4
> 2 5 7
> 1 2 3 4 5
> 1 2 3 5 6 7 8
> 2 4 6
> 2 4 5 7 9
> 1 2 3 4 5 6 7 8 9 10
> 2 4 6 7 9 11

借助位运算，我们可以这样做：

```python
print(1 << 1)
print(1 << 2)
print(1 << 5)
print((1 << 1) + (1 << 2) + (1 << 3))
print((1 << 1) + (1 << 5) + (1 << 6))
print((1 << 2) + (1 << 4))
print((1 << 2) + (1 << 5) + (1 << 7))
print((1 << 1) + (1 << 2) + (1 << 3) + (1 << 4) + (1 << 5))
print((1 << 1) + (1 << 2) + (1 << 3) + (1 << 5) + (1 << 6) + (1 << 7) + (1 << 8))
print((1 << 2) + (1 << 4) + (1 << 6))
print((1 << 2) + (1 << 4) + (1 << 5) + (1 << 7) + (1 << 9))
print((1 << 1) + (1 << 2) + (1 << 3) + (1 << 4) + (1 << 5) + (1 << 6) + (1 << 7) + (1 << 8) + (1 << 9) + (1 << 10))
print((1 << 2) + (1 << 4) + (1 << 5) + (1 << 6) + (1 << 7) + (1 << 9) + (1 << 11))
```

可以尝试理解这个表的原理，==即将每一个bite作为表的一个元素==


可以看到最大值只有110元。而注意到面额最大的硬币为100。而110元可以用非100元组成也可以通过10元+100元组成，同理100元也有两种组合方式。所以需要考虑四个情况：
1、100元用100元组成、110元用100元组成
2、100元用100元组成、110元用非100元组成
3、100元用非100元组成、110元用100元组成
4、100元用非100元组成、110元用非100元组成

那么都考虑一下，取较小者
# AC-Code
```c
#include<bits/stdc++.h>

using namespace std;

vector<int> res;

void init() {
    res.push_back(0);
    res.push_back(2);
    res.push_back(4);
    res.push_back(32);
    res.push_back(14);
    res.push_back(98);
    res.push_back(20);
    res.push_back(164);
    res.push_back(62);
    res.push_back(494);
    res.push_back(84);
    res.push_back(692);
    res.push_back(2046);
    res.push_back(2804);
}

int get_ans(int as) {
    int t = -1;
    for (int i = 0; i < res.size(); ++i) {
        if ((res[i] ^ as) + (res[i] & as) == res[i]) {
            t = i;
            break;
        }
    }
    switch (t) {
        case 0:
            return 0;
        case 1:
        case 2:
        case 3:
            return 1;
        case 4:
        case 5:
        case 6:
        case 7:
            return 2;
        case 8:
        case 9:
        case 10:
        case 11:
            return 3;
        case 12:
        case 13:
            return 4;
    }
    return 1000;
}

int main() {
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    auto start_clock_for_debug = clock();
#endif
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin.tie(0);

    int t;
    cin >> t;
    init();
    while (t--) {
        int n;
        cin >> n;

        int hun[4];
        int cnt[4][15];
        memset(cnt, 0, sizeof(cnt));
        memset(hun, 0, sizeof(hun));
        bool flag = false;

        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;

            if (flag) continue;

            if (tmp % 10) {
                flag = true;
                continue;
            }
            // 100 + 110
            int tmp0 = tmp;
            if (tmp0 % 100 > 10 and tmp0 > 100) {
                hun[0] = max(tmp0 / 100, hun[0]);
                tmp0 %= 100;
                cnt[0][tmp0 / 10]++;
            } else if (tmp0 > 100) {
                hun[0] = max((tmp0 - 100) / 100, hun[0]);
                tmp0 %= 100;
                cnt[0][tmp0 / 10 + 10]++;
            } else {
                cnt[0][tmp0 / 10]++;
            }
            // 100
            int tmp1 = tmp;
            if (tmp1 % 100 == 0 and tmp1 > 100) {
                hun[1] = max((tmp1 - 100) / 100, hun[1]);
                cnt[1][10]++;
            } else {
                hun[1] = max(tmp1 / 100, hun[1]);
                cnt[1][(tmp1 % 100) / 10]++;
            }
            // 110
            int tmp2 = tmp;
            if (tmp2 % 100 == 10 and tmp2 > 100) {
                hun[2] = max((tmp2 - 100) / 100, hun[2]);
                cnt[2][11]++;
            } else {
                hun[2] = max(tmp2 / 100, hun[2]);
                cnt[2][(tmp2 % 100) / 10]++;
            }
            // None
            int tmp3 = tmp;
            hun[3] = max(tmp3 / 100, hun[3]);
            cnt[3][(tmp3 % 100) / 10]++;
        }
        if (flag) {
            cout << -1 << endl;
            continue;
        }
        int ans;
        int get_ans[4];

        for (int j = 0; j < 4; ++j) {
            ans = 0;
            for (int k = 1; k < 13; ++k) {
                if (cnt[j][k]) {
                    ans += 1 << k;
                }
            }
            get_ans[j] = get_ans(ans) + hun[j];
        }
        sort(get_ans, get_ans + 4);
        cout << get_ans[0] << endl;
    }
#ifdef ACM_LOCAL
    auto end_clock_for_debug = clock();
    cerr << "Run Time: " << double(end_clock_for_debug - start_clock_for_debug) / CLOCKS_PER_SEC << "s" << endl;
#endif
    return 0;
}
```
