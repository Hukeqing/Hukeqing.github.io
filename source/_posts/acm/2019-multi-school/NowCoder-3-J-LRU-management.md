---
title: 【2019牛客暑期多校第三场】J题LRU management
date: 2019-07-26 13:12:19
categories: ACM&算法
tag:
 - ACM
 - NowCoder
math: true
---

[题目链接](https://ac.nowcoder.com/acm/contest/883/J)

# 题意
好吧，这道题我其实看都没看过，队友跟我说了说这道题是模拟题，卡时间。然后我就上了……
大致就是维护一个线性表，然后有两种操作：插入、查询
插入时，如果这个值（string）之前出现过，则把之前那个值（string）放到线性表的表尾（删去原来那个），但是保存的值（int）仍是之前那个值（int）。如果没有出现过，则把它插入到表尾。如果插入后发现线性表长度超过 m ，则弹出表头的元素。
查询时，如果有这个值（string），然后根据要求查询这个值（string）的上一个或者下一个，再返回它的值（int），如果没有（没有上一个或者下一个也是）则输出：Invalid

# 分析
一开始觉得这个……应该就是拿STL可以暴力过的（当然不能太暴力）我选择了 unordered_map + list
听说用 map 会 T，没试过……
unordered_map 是哈希表，而 map 是红黑树，相对而言， map 的查询、插入、删除的时间比较稳定，都是 O(logN)，而 unordered_map 的时间不确定性比较大，运气好就是 O(1) 的查询，运气差就是 O(N)

> 复杂度
> 平均为常数，最坏情况与容器大小成线性。
> 摘自[cppreference](https://zh.cppreference.com/w/cpp/container/unordered_map/count)

unordered_map 用 string 作为索引，保存了 list 的迭代器
list 保存了值的顺序情况，包括了 string 和 int 两个变量
但是我第一发居然T了，然后加了快读就AC了，感觉就是被卡常了……

# AC代码

```c
#include <bits/stdc++.h>

using namespace std;

typedef list<pair < int, string>>
::iterator pl;
unordered_map <string, pl> ump;
list <pair<int, string>> lists;
char catchmessage[100];

struct ioss {
#define endl '\n'
    static const int LEN = 20000000;
    char obuf[LEN], *oh = obuf;
    std::streambuf *fb;

    ioss() {
        ios::sync_with_stdio(false);
        cin.tie(NULL);
        cout.tie(NULL);
        fb = cout.rdbuf();
    }

    inline char gc() {

        static char buf[LEN], *s, *t, buf2[LEN];
        return (s == t) && (t = (s = buf) + fread(buf, 1, LEN, stdin)), s == t ? -1 : *s++;
    }

    inline ioss &operator>>(long long &x) {
        static char ch, sgn, *p;
        ch = gc(), sgn = 0;
        for (; !isdigit(ch); ch = gc()) {
            if (ch == -1)
                return *this;
            sgn |= ch == '-';
        }
        for (x = 0; isdigit(ch); ch = gc())
            x = x * 10 + (ch ^ '0');
        sgn && (x = -x);
        return *this;
    }

    inline ioss &operator>>(int &x) {
        static char ch, sgn, *p;
        ch = gc(), sgn = 0;
        for (; !isdigit(ch); ch = gc()) {
            if (ch == -1)
                return *this;
            sgn |= ch == '-';
        }
        for (x = 0; isdigit(ch); ch = gc())
            x = x * 10 + (ch ^ '0');
        sgn && (x = -x);
        return *this;
    }

    inline ioss &operator>>(char &x) {
        static char ch;
        for (; !isalpha(ch); ch = gc()) {
            if (ch == -1)
                return *this;
        }
        x = ch;
        return *this;
    }

    inline ioss &operator>>(string &x) {
        static char ch, *p, buf2[LEN];
        for (; !isalpha(ch) && !isdigit(ch); ch = gc())
            if (ch == -1)
                return *this;
        p = buf2;
        for (; isalpha(ch) || isdigit(ch); ch = gc())
            *p = ch, p++;
        *p = '\0';
        x = buf2;
        return *this;
    }

    inline ioss &operator<<(string &c) {
        for (auto &p: c)
            this->operator<<(p);
        return *this;
    }

    inline ioss &operator<<(const char *c) {
        while (*c != '\0') {
            this->operator<<(*c);
            c++;
        }
        return *this;
    }

    inline ioss &operator<<(const char &c) {
        oh == obuf + LEN ? (fb->sputn(obuf, LEN), oh = obuf) : 0;
        *oh++ = c;
        return *this;
    }

    inline ioss &operator<<(int x) {
        static int buf[30], cnt;
        if (x < 0)
            this->operator<<('-'), x = -x;
        if (x == 0)
            this->operator<<('0');
        for (cnt = 0; x; x /= 10)
            buf[++cnt] = x % 10 | 48;
        while (cnt)
            this->operator<<((char) buf[cnt--]);
        return *this;
    }

    inline ioss &operator<<(long long x) {
        static int buf[30], cnt;
        if (x < 0)
            this->operator<<('-'), x = -x;
        if (x == 0)
            this->operator<<('0');
        for (cnt = 0; x; x /= 10)
            buf[++cnt] = x % 10 | 48;
        while (cnt)
            this->operator<<((char) buf[cnt--]);
        return *this;
    }

    ~ioss() {
        fb->sputn(obuf, oh - obuf);
    }
} io;

int main() {
#ifdef ACM_LOCAL
    freopen("./in.txt", "r", stdin);
    freopen("./out.txt", "w", stdout);
#endif
    ios::sync_with_stdio(false);
    int t;
    io >> t;
    while (t--) {
        ump.clear();
        lists.clear();
        int q, m;
        io >> q >> m;
        string s;
        int op, val;
        for (int i = 0; i < q; i++) {
            pl cur;
            io >> op >> s >> val;
            if (op) {
                if (!ump.count(s)) {
                    cout << "Invalid" << endl;
                    continue;
                }
                cur = ump[s];
                if (val == 1) {
                    cur++;
                    if (cur == lists.end()) {
                        cout << "Invalid" << endl;
                        continue;
                    }
                } else if (val == -1) {
                    if (cur == lists.begin()) {
                        cout << "Invalid" << endl;
                        continue;
                    }
                    cur--;
                }
                cout << (*cur).first << endl;
            } else {
                if (!ump.count(s)) {
                    pair<int, string> newnode = make_pair(val, s);
                    lists.push_back(newnode);
                    pl tmp = lists.end();
                    tmp--;
                    ump.insert(make_pair(s, tmp));
                    if (lists.size() > m) {
                        ump.erase(lists.front().second);
                        lists.pop_front();
                    }
                    cout << val << endl;
                    continue;
                }
                cur = ump[s];
                pair<int, string> newnode = make_pair((*cur).first, s);
                lists.push_back(newnode);
                pl tmp = lists.end();
                tmp--;
                ump[s] = tmp;
                lists.erase(cur);
                cout << newnode.first << endl;
            }
        }
    }
    return 0;
}
```