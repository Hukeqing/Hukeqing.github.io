---
title: 【bzoj2049】[Sdoi2008]Cave 洞穴勘测——线段树上bfs求可撤销并查集
date: 2020-01-08 19:56:18
categories: ACM&算法
tag:
 - ACM
 - BZOJ
 - SDOI
math: true
---

# 题面

2049: [Sdoi2008]Cave 洞穴勘测

Time Limit: 10 Sec  Memory Limit: 259 MB
Submit: 12030  Solved: 6024

## Description

辉辉热衷于洞穴勘测。某天，他按照地图来到了一片被标记为JSZX的洞穴群地区。经过初步勘测，辉辉发现这片区域由n个洞穴（分别编号为1到n）以及若干通道组成，并且每条通道连接了恰好两个洞穴。假如两个洞穴可以通过一条或者多条通道按一定顺序连接起来，那么这两个洞穴就是连通的，按顺序连接在一起的这些通道则被称之为这两个洞穴之间的一条路径。洞穴都十分坚固无法破坏，然而通道不太稳定，时常因为外界影响而发生改变，比如，根据有关仪器的监测结果，123号洞穴和127号洞穴之间有时会出现一条通道，有时这条通道又会因为某种稀奇古怪的原因被毁。辉辉有一台监测仪器可以实时将通道的每一次改变状况在辉辉手边的终端机上显示：如果监测到洞穴u和洞穴v之间出现了一条通道，终端机上会显示一条指令 Connect u v 如果监测到洞穴u和洞穴v之间的通道被毁，终端机上会显示一条指令 Destroy u v 经过长期的艰苦卓绝的手工推算，辉辉发现一个奇怪的现象：无论通道怎么改变，任意时刻任意两个洞穴之间至多只有一条路径。因而，辉辉坚信这是由于某种本质规律的支配导致的。因而，辉辉更加夜以继日地坚守在终端机之前，试图通过通道的改变情况来研究这条本质规律。然而，终于有一天，辉辉在堆积成山的演算纸中崩溃了……他把终端机往地面一砸（终端机也足够坚固无法破坏），转而求助于你，说道：“你老兄把这程序写写吧”。辉辉希望能随时通过终端机发出指令 Query u v，向监测仪询问此时洞穴u和洞穴v是否连通。现在你要为他编写程序回答每一次询问。已知在第一条指令显示之前，JSZX洞穴群中没有任何通道存在。

## Input

第一行为两个正整数n和m，分别表示洞穴的个数和终端机上出现过的指令的个数。以下m行，依次表示终端机上出现的各条指令。每行开头是一个表示指令种类的字符串s（"Connect”、”Destroy”或者”Query”，区分大小写），之后有两个整数u和v (1≤u, v≤n且u≠v) 分别表示两个洞穴的编号。

## Output

对每个Query指令，输出洞穴u和洞穴v是否互相连通：是输出”Yes”，否则输出”No”。（不含双引号）

## Sample Input

样例输入1 cave.in
```
200	5
Query	123	127
Connect	123	127
Query	123	127
Destroy	127	123
Query	123	127
```

样例输入2 cave.in
```
3 	5
Connect	1	2
Connect	3	1
Query	2	3
Destroy	1	3
Query	2	3
```

## Sample Output

样例输出1 cave.out
```
No
Yes
No
```

样例输出2 cave.out
```
Yes
No
```

## HINT

数据说明 10%的数据满足n≤1000, m≤20000 20%的数据满足n≤2000, m≤40000 30%的数据满足n≤3000, m≤60000 40%的数据满足n≤4000, m≤80000 50%的数据满足n≤5000, m≤100000 60%的数据满足n≤6000, m≤120000 70%的数据满足n≤7000, m≤140000 80%的数据满足n≤8000, m≤160000 90%的数据满足n≤9000, m≤180000 100%的数据满足n≤10000, m≤200000 保证所有Destroy指令将摧毁的是一条存在的通道本题输入、输出规模比较大，建议c\c++选手使用scanf和printf进行I\O操作以免超时

# 分析
一条边的存在的时间其实就是一段连续的时间（我们这里指定每一行命令就是一个单位的时间），这样我们就可以把问题离线化。

那么我们可以用线段树来保存整个状态，这并不是什么难事，我们在线段树的每一个节点上保存一个边的集合，表示这个节点下所有的子节点都包含了这条边。

那么我们对于任意一个叶子节点，从根节点到叶子节点的全过程遍历到的所有的边组成的集合就是当前的图

由于如果每次询问都是从根节点出发的话效率太低，我们采用直接在线段树上移动的方式来解决效率问题。

通过可撤销并查集的性质，来实现在线段树上移动

# AC code

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
const int MAXN = 10100;
const int MAXM = 200100;
 
typedef pair<int, int> pii;
 
struct UFS {
    int f[MAXN];
    stack<pii> s;
 
    int finds(int x) {
        while (x ^ f[x])
            x = f[x];
        return x;
    }
 
    void unite(int x, int y) {
        x = finds(x);
        y = finds(y);
        if (x != y) {
            s.push({x, f[x]});
            f[x] = y;
        }
    }
 
    void init(int b, int e) { // 初始化函数，范围为 [b, e)
        for (int i = b; i < e; i++)
            f[i] = i;
    }
 
    void undo() {
        f[s.top().first] = s.top().second;
        s.pop();
    }
};
 
struct SegTree {
    vector<pii> data[MAXM << 2];
 
    static inline int lson(int k) { return k << 1; }
 
    static inline int rson(int k) { return (k << 1) | 1; }
 
    static inline int fat(int l, int r) { return (l + r) >> 1; }
    // add 函数对应于正常的线段树的 insert，但是稍微有些不同
    void add(int k, int l, int r, int x, int y, const pii &value) {
        if (l == x && r == y) {
            data[k].push_back(value);
            return;
        }
        int mid = fat(l, r);
        if (y <= mid) {
            add(lson(k), l, mid, x, y, value);
        } else if (x > mid) {
            add(rson(k), mid + 1, r, x, y, value);
        } else {
            add(lson(k), l, mid, x, mid, value);
            add(rson(k), mid + 1, r, mid + 1, y, value);
        }
    }
};
 
UFS ufs;
SegTree segTree;
vector<pair<pii, int> > que;
int tar;
// 通过 dfs 的方式在线段树上移动
bool dfs(int k, int l, int r) {
    // 当完成一次询问之后，需要跳出当前的叶子，即回溯。通过 goto 来使得回溯的过程会自动进入正确的叶子节点
    rejudge:
    int target = que[tar].second;
    if (target == r && l == r) {
        if (ufs.finds(que[tar].first.first) == ufs.finds(que[tar].first.second))
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
        tar++;
        return tar == que.size();// true 表示所有的询问已经结束，退出 dfs
    }
    int mid = SegTree::fat(l, r);
    if (target <= mid) {
//        for (auto &item: segTree.data[SegTree::lson(k)])
//            ufs.unite(item.first, item.second);
        for (int i = 0; i < segTree.data[SegTree::lson(k)].size(); ++i)
            ufs.unite(segTree.data[SegTree::lson(k)][i].first, segTree.data[SegTree::lson(k)][i].second);
        if (dfs(SegTree::lson(k), l, mid))
            return true;
//        for (auto &item: segTree.data[SegTree::lson(k)])
        for (int i = 0; i < segTree.data[SegTree::lson(k)].size(); ++i)
            ufs.undo();
        if (que[tar].second > r)
            return false;
        goto rejudge;
    } else {
//        for (auto &item: segTree.data[SegTree::rson(k)])
//            ufs.unite(item.first, item.second);
        for (int i = 0; i < segTree.data[SegTree::rson(k)].size(); ++i)
            ufs.unite(segTree.data[SegTree::rson(k)][i].first, segTree.data[SegTree::rson(k)][i].second);
        if (dfs(SegTree::rson(k), mid + 1, r))
            return true;
//        for (auto &item: segTree.data[SegTree::rson(k)])
        for (int i = 0; i < segTree.data[SegTree::rson(k)].size(); ++i)
            ufs.undo();
        if (que[tar].second > r)
            return false;
        goto rejudge;
    }
}
 
void solve() {
    int n, m;
    cin >> n >> m;
    map<pii, int> mp;
    for (int i = 0; i < m; ++i) {
        string s;
        int u, v;
        cin >> s >> u >> v;
        if (u > v) swap(u, v);
        switch (s[0]) {
            case 'Q':
//                que.push_back({{u, v}, i + 1});
                que.push_back(make_pair(make_pair(u, v), i + 1));
                break;
            case 'C':
//                mp.insert({{u, v}, i + 1});
                mp.insert(make_pair(make_pair(u, v), i + 1));
                break;
            case 'D': {
//                auto iter = mp.find({u, v});
                map<pii, int>::iterator iter = mp.find(make_pair(u, v));
//                segTree.add(1, 1, m, iter->second, i, {u, v});
                segTree.add(1, 1, m, iter->second, i, make_pair(u, v));
                mp.erase(iter);
                break;
            }
        }
    }
    map<pii, int>::iterator iter = mp.begin();
    while (iter != mp.end()) {
        segTree.add(1, 1, m, iter->second, m, iter->first);
        iter++;
    }
    ufs.init(0, n + 1);
    tar = 0;
//    for (auto &item: segTree.data[1])
    for (int i = 0; i < segTree.data[1].size(); ++i)
        ufs.unite(segTree.data[1][i].first, segTree.data[1][i].second);
//        ufs.unite(item.first, item.second);
    dfs(1, 1, m);
    return;
}
 
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
//    cin.tie(nullptr);
//    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    long long test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug) {
        if (acm_local_for_debug == '$') exit(0);
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
