---
title: 2019年-西北大学集训队选拔赛——D温暖的签到题
date: 2019-07-11 10:30:53
categories: ACM&算法
tag:
 - ACM
math: true
---

[题目链接](https://ac.nowcoder.com/acm/contest/892/D)

一道珂朵莉树题，非常有意思

```c
#include <bits/stdc++.h>

#define NUM
#define ll long long
using namespace std;

int n, m;

struct node {
    int l;
    int sta;//第一个值
    int r;//长度

    ll sum(int l, int r) {        // 区间求和
        if (l < this->l) l = this->l;
        if (r > this->r) r = this->r;
        return (((l - this->l) + sta + (r - this->l) + sta)) * ((ll) r - l + 1) / 2;
    }
};

map<int, node> mp;    // 利用map自动排序，形成一个一维的块链，每一个块为一个给定规则的数据组成

ll cal(int l, int r) {        // 计算区间和，直接调用块内的自定义函数求和
    map<int, node>::iterator itl = mp.upper_bound(l);
    itl--;
    map<int, node>::iterator itr = mp.upper_bound(r);
    ll ans = 0;
    while (itl != itr) {
        ans += (*itl).second.sum(l, r);
        itl++;
    }
    return ans;
}

void update(int l, int r) {        // 更新块，删除被覆盖的块，形成新块
    if (r == 1)
        return;
    map<int, node>::iterator itl = mp.upper_bound(l);
    itl--;
    map<int, node>::iterator itr = mp.upper_bound(r);
    itr--;
    node templ = (*itl).second;
    node tempr = (*itr).second;
    tempr.sta = tempr.sta + (r + 1 - tempr.l);
    templ.r = l - 1;
    tempr.l = r + 1;
    itr++;
    while (itl != itr) {
        auto tmp = itl++;
        mp.erase(tmp);
    }
    node newnode;
    newnode.l = l;
    newnode.r = r;
    newnode.sta = 1;
    mp[l] = newnode;
    if (templ.l <= templ.r) {
        mp[templ.l] = templ;
    }
    if (tempr.l <= tempr.r) {
        mp[tempr.l] = tempr;
    }
}

int main() {
    scanf("%d%d", &n, &m);
    int opt, l, r;
    node tot;
    tot.l = 1;
    tot.r = n;
    tot.sta = 1;
    mp[1] = tot;
    while (m--) {
        scanf("%d%d%d", &opt, &l, &r);
        if (opt == 1)
            update(l, r);
        else
            printf("%lld\n", cal(l, r));
    }
    return 0;
}
```
