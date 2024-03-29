---
title: HDU2883 kebab——最大流
date: 2019-07-11 12:08:04
categories: ACM&算法
tag:
 - ACM
 - HDU
math: true
---

[题目链接](http://acm.hdu.edu.cn/showproblem.php?pid=2883)

**把“时间粒子”作为最大流的计算结果**

设置超级源点为 0
顾客点范围为 1 - 204
时间点       205 - 610
超级汇点     615
超级源点与所有顾客连线，容量为需求的烤肉数 * 需求的每块烤肉的时间（即此顾客需要占用的总时间粒子）
顾客与时间点进行连线，仅当此时间点在顾客等待的时间段内，容量为INF
每个时间点与汇点连线，容量为 m 

```cpp
#include <bits/stdc++.h>

using namespace std;

/*
 * 最大流 SAP 算法，用 GAP 优化后
 * 先把流量限制赋值到 maps 数组
 * 然后调用 SAP 函数求解
 * 可选：导出路径
 */

#define MAXN 620

int maps[MAXN][MAXN]; // 存图
int pre[MAXN];        // 记录当前点的前驱
int level[MAXN];      // 记录距离标号
int gap[MAXN];        // gap常数优化

// vector<int> roads[MAXN]; // 导出的路径（逆序）
// int curRoads;            // 导出的路径数

// 入口参数vs源点，vt汇点
int SAP(int vs, int vt) {
    memset(pre, -1, sizeof(pre));
    memset(level, 0, sizeof(level));
    memset(gap, 0, sizeof(gap));
    gap[0] = vt;
    int v, u = pre[vs] = vs, maxflow = 0, aug = INT_MAX;
    // curRoads = 0;
    while (level[vs] < vt) {
        // 寻找可行弧
        for (v = 1; v <= vt; v++) {
            if (maps[u][v] > 0 && level[u] == level[v] + 1) {
                break;
            }
        }
        if (v <= vt) {
            pre[v] = u;
            u = v;
            if (v == vt) {
                // int neck = 0;        // Dnic 多路增广优化，下次增广时，从瓶颈边(后面)开始
                aug = INT_MAX;
                // 寻找当前找到的一条路径上的最大流  (瓶颈边)
                for (int i = v; i != vs; i = pre[i]) {
                    // roads[curRoads].push_back(i);    // 导出路径——可选
                    if (aug > maps[pre[i]][i]) {
                        aug = maps[pre[i]][i];
                        // neck = i;        // Dnic 多路增广优化，下次增广时，从瓶颈边(后面)开始
                    }
                }
                // roads[curRoads++].push_back(vs);         // 导出路径——可选
                maxflow += aug;
                // 更新残留网络
                for (int i = v; i != vs; i = pre[i]) {
                    maps[pre[i]][i] -= aug;
                    maps[i][pre[i]] += aug;
                }
                // 从源点开始继续搜
                u = vs;
                // u = neck;    // Dnic 多路增广优化，下次增广时，从瓶颈边(后面)开始
            }
        } else {
            // 找不到可行弧
            int minlevel = vt;
            // 寻找与当前点相连接的点中最小的距离标号
            for (v = 1; v <= vt; v++) {
                if (maps[u][v] > 0 && minlevel > level[v]) {
                    minlevel = level[v];
                }
            }
            gap[level[u]]--; // (更新gap数组）当前标号的数目减1；
            if (gap[level[u]] == 0)
                break; // 出现断层
            level[u] = minlevel + 1;
            gap[level[u]]++;
            u = pre[u];
        }
    }
    return maxflow;
}

// 超级源点     0
// 顾客点       1 - 204
// 时间点       205 - 610
// 超级汇点     615
int n, m;
const int MaxPeople = 210;
const int Ed = 615;
struct costman {
    int b, e, need, time;
};
set<int> timelist;
costman costmanlist[MaxPeople];

void init() {
    memset(maps, 0, sizeof(maps));
    set<int>::iterator iterl = timelist.begin();
    set<int>::iterator iterr = timelist.begin();
    iterr++;
    int curiter = 0;
    for (size_t i = 0; i < n; i++) {
        maps[0][i + 1] = costmanlist[i].need * costmanlist[i].time;
    }
    while (iterr != timelist.end()) {
        maps[205 + curiter][Ed] = ((*iterr) - (*iterl)) * m;
        for (size_t i = 0; i < n; i++) {
            if (costmanlist[i].b <= *iterl && costmanlist[i].e >= *iterr) {
                maps[i + 1][curiter + 205] = INT_MAX;
            }
        }
        iterl++;
        iterr++;
        curiter++;
    }
}

int main() {
#ifdef ACM_LOCAL
    freopen("./in.txt", "r", stdin);
    freopen("./out.txt", "w", stdout);
#endif
    ios::sync_with_stdio(false);
    while (cin >> n >> m) {
        timelist.clear();
        long long sum = 0;
        for (size_t i = 0; i < n; i++) {
            cin >> costmanlist[i].b >> costmanlist[i].need >> costmanlist[i].e >> costmanlist[i].time;
            sum += costmanlist[i].need * costmanlist[i].time;
            timelist.insert(costmanlist[i].b);
            timelist.insert(costmanlist[i].e);
        }
        init();
        cout << (sum == SAP(0, Ed) ? "Yes" : "No") << endl;
    }
    return 0;
}
```

