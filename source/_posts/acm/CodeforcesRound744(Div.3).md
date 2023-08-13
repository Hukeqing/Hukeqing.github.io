---
title: Codeforces Round#744 (Div. 3)
date: 2021-09-29 12:40:22
categories: ACM&算法
tag:
 - ACM
 - Codeforces
math: true
---

*自从退役之后，打了三个月的工，然后再来打这一场 Div3，庆幸自己还能打打，在最后还剩 4 分钟的时候 A 掉了 G 题，终于在比赛期间 AK*

# A. Casimir's String Solitaire
## 大致题意
给你一个字符串，仅还有 `'A', 'B', 'C'` 三个字符，每次可以同时删除任意两个 `'A', 'B'`，也可以同时删除两个 `'B', 'C'`。判断一个字符串能过上述操作变为空字符串

## 题解
统计了一下所有字符串中每个字符串的数量，然后若 `'B'` 的数量和 `'A'` 和 `'C'` 的数量之和相同，则 OK

## AC Code

```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        string str;
        cin >> str;
        int a = 0, b = 0, c = 0;
        for (auto &item : str) {
            switch (item) {
                case 'A':
                    a++;
                    break;
                case 'B':
                    b++;
                    break;
                case 'C':
                    c++;
                    break;
            }
        }
        cout << (a + c == b ? "YES" : "NO") << endl;
    }
}
```

# B. Shifting Sort
## 大致题意
一个字符串，每次允许选择其中一个区间，对这个区间进行移位运算，使得这个数组最终有序，使用此操作不能超过整个数组长度次数

## 题解
这已经把插入排序写在脸上了

## AC Code
```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        vector<pair<int, int>> ans;

        for (int i = 1; i < n; ++i) {
            int l = i + 1, r = i + 1;
            for (int j = i - 1; j >= 0; --j) {
                if (data[j] > data[j + 1]) {
                    l--;
                    swap(data[j], data[j + 1]);
                }
                else break;
            }
            if (l != r) ans.emplace_back(l, r);
        }
        cout << ans.size() << endl;
        for (auto &item: ans) {
            cout << item.first << ' ' << item.second << " " << item.second - item.first << endl;
        }
    }
}
```

# C. Ticks
## 大致题意
一个矩形网格，在上面画 `'V'` 字形，问，当前对矩形网格上，是否是可以通过画若干个至少为 `'k'` 大的 `'V'` 来满足

## 思路
首先所有 `'V'` 的特点是最下面的点，每个 `'V'` 都可以用最下面的点来标记 `'V'`，而其两臂则可以有多长就多长即可。所以可以很轻松得出，应该从下往上遍历来解决问题

如果从下向上遍历，那么若遇到一个 `'*'` 点，有可能是之前 `'V'` 的臂，也有可能是新的 `'V'`，同时也可以是两者的结合。所以需要一个标记数组，表示每个点是否已经被下面的 `'V'` 给画过了，若没有，则这里必定是 `'V'` 的起点。
但是若为画过，则需要同时考虑两种情况

## AC Code
```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<string> data(n);
        vector<vector<bool>> vis(n);
        for (int i = 0; i < n; ++i) {
            cin >> data[i];
            vis[i].resize(m, false);
        }
        bool flag = true;

        auto findCell = [&](int x, int y) {
            int cur = -1;
            for (int i = 0; i < n; ++i) {
                bool left = x >= i && y >= i && data[y - i][x - i] == '*';
                bool right = x + i < m && y >= i && data[y - i][x + i] == '*';
                if (left && right) {
                    cur++;
                    vis[y - i][x - i] = true;
                    vis[y - i][x + i] = true;
                } else break;
            }
            if (cur < k) flag = false;
        };

        auto tryCell = [&](int x, int y) {
            int cur = -1;
            for (int i = 0; i < n; ++i) {
                bool left = x >= i && y >= i && data[y - i][x - i] == '*';
                bool right = x + i < m && y >= i && data[y - i][x + i] == '*';
                if (left && right) {
                    cur++;
                } else break;
            }
            if (cur >= k) {
                for (int i = 0; i < cur + 1; ++i) {
                    vis[y - i][x - i] = true;
                    vis[y - i][x + i] = true;
                }
            }
        };

        for (int i = n - 1; i >= 0; --i)
            for (int j = 0; j < m; ++j)
                if (data[i][j] == '*') {
                    if (!vis[i][j]) findCell(j, i);
                    else tryCell(j, i);
                }
        cout << (flag ? "YES" : "NO") << endl;
    }
}
```

# D. Productive Meeting
## 大致题意
有 $n$ 堆石头，每堆石头有若干数量，每次从两堆不同堆石头中取出各一个，如何取使得最后所有堆的石头和最少

## 题解
第一反应过来以为是背包问题，就是普通的分为两组然后尽可能均分。但是很快意识到不对，因为可以一个人在两堆中变换。然后就简单了，简单的不断取出最大的两堆，各取一个，直到不能取出两个即可

## AC Code
```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        priority_queue<pair<int, int>> prq;
        for (int i = 0; i < n; ++i) {
            int tmp;
            cin >> tmp;
            if (tmp == 0) continue;
            prq.push({tmp, i});
        }
        vector<pair<int, int>> ans;
        while (prq.size() >= 2) {
            auto a = prq.top();
            prq.pop();
            auto b = prq.top();
            prq.pop();
            ans.emplace_back(a.second, b.second);
            if (a.first > 1) prq.push({a.first - 1, a.second});
            if (b.first > 1) prq.push({b.first - 1, b.second});
        }
        cout << ans.size() << endl;
        for (auto &item : ans) cout << item.first + 1 << ' ' << item.second + 1 << endl;
    }
}
```

# E1. Permutation Minimization by Deque
## 大致题意
一个双向队列，按照一定顺序往其中插入一组值，在已知接下来要插入的值的顺序后，如何确定每一次插入队列前面还是后面，使得整个序列的字典序最小

## 题解
设计的逻辑很简单，其实每次插入时，若比第一个值大，那么插入到后面，否则一定会使整体值增加，反正则插入到前面即可

## AC Code
```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        list<int> res;
        res.push_back(data[0]);
        for (int i = 1; i < n; ++i) {
            if (res.front() > data[i]) res.push_front(data[i]);
            else res.push_back(data[i]);
        }
        for (auto &item : res) {
            cout << item << ' ';
        }
        cout << endl;
    }
}
```

# E2. Array Optimization by Deque
## 大致题意
和上一题差不多的同时，这次需要的是使得逆序对尽可能少

## 题解
贪心解决了，每次插入的时候，若插入到最前面产生的逆序对数量少于最后面，则插入到前面，否则后面。而计算数量，应该是很久没训练了，一下子只能想到线段树，所以就直接上一个动态开点的线段树解决了

## AC code
```cpp
#include "bits/stdc++.h"

using namespace std;

const int N = 3e6;
const int L = -1e9 - 10;
const int R = 1e9 + 10;

struct SegTree {
    int s[N], l[N], r[N];
    int tot;

    void init() {
        tot = 1;
        s[0] = 0;
        l[0] = -1;
        r[0] = -1;
    }

    int newNode() {
        s[tot] = 0;
        l[tot] = -1;
        r[tot] = -1;
        return tot++;
    }

    int lc(int x) {
        if (l[x] == -1)
            l[x] = newNode();
        return l[x];
    }

    int rc(int x) {
        if (r[x] == -1)
            r[x] = newNode();
        return r[x];
    }

    void up(int x) {
        s[x] = 0;
        if (l[x] != -1) s[x] += s[l[x]];
        if (r[x] != -1) s[x] += s[r[x]];
    }

    void add(int x, int cur, int ll, int rr) {
        if (ll == rr) {
            s[cur]++;
            return;
        }
        int mid = (ll + rr) >> 1;
        if (x <= mid) add(x, lc(cur), ll, mid);
        else add(x, rc(cur), mid + 1, rr);
        up(cur);
    }

    int query(int x, int y, int cur, int ll, int rr) {
        if (ll == x && rr == y) {
            return s[cur];
        }
        if (s[cur] == 0) return 0;
        int mid = (ll + rr) >> 1;
        if (y <= mid) {
            return query(x, y, lc(cur), ll, mid);
        } else if (x > mid) {
            return query(x, y, rc(cur), mid + 1, rr);
        } else {
            return query(x, mid, lc(cur), ll, mid) + query(mid + 1, y, rc(cur), mid + 1, rr);
        }
    }
} segTree;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        long long ans = 0;
        segTree.init();
        segTree.add(data[0], 0, L, R);
        for (int i = 1; i < n; ++i) {
            int left = segTree.query(data[i] + 1, R, 0, L, R);
            int right = segTree.query(L, data[i] - 1, 0, L, R);
            ans += min(left, right);
            segTree.add(data[i], 0, L, R);
        }
        cout << ans << endl;
    }
}
```

# F. Array Stabilization (AND version)
## 大致题意
给你一个 `01` 字符串，每次进行对此字符串的某个移位运算后的值进行 `AND` 运算的，直到此字符串不再改变，需要多少次才能使得整个字符串变为纯 `0` 的字符串

## 题解
根据移位操作，建图，然后在拓扑，找出最长链就行了，若不能完整拓扑，则不能

## AC code
```cpp
#include "bits/stdc++.h"

using namespace std;

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n, d;
        cin >> n >> d;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        bool flag = false;
        for (int i = 0; i < n; ++i) {
            if (data[i] == 1) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            cout << 0 << endl;
            continue;
        }

        vector<int> to(n, -1);
        vector<bool> deg(n, false);
        for (int i = 0; i < n; ++i) {
            int nxt = (i + n - d) % n;
            if (data[i] == 1 && data[nxt] == 1) {
                to[i] = nxt;
                deg[nxt] = true;
            }
        }

        queue<pair<int, int>> q;
        for (int i = 0; i < n; ++i) if (!deg[i]) q.push({i, 0});
        int ans = 0;
        int vis = 0;
        while (!q.empty()) {
            auto cur = q.front();
            q.pop();
            vis++;
            ans = max(ans, cur.second + 1);
            if (to[cur.first] == -1) continue;
            deg[to[cur.first]] = false;
            q.push({to[cur.first], cur.second + 1});
        }

        if (vis == n)
            cout << ans << endl;
        else cout << "-1" << endl;
    }
}
```

# G. Minimal Coverage
## 大致题意
有 $n$ 段线段，首尾相连，连接处可以折叠，求出折叠后，这些线段占用的最小总长度

## 题解
借用一下数据量并不大的特点，可以直接暴力找所有可能的情况。创建一个布尔数组，若此处为 true 则表示可以从这里开始，否则不能。通过滚动的方式进行 dp 最后找到任意一处为 true 则为成功。

当然此方法仅适合用于 check，所以加一个二分就能解决了

## AC Code
```cpp
#include "bits/stdc++.h"

using namespace std;

bool vis[2][3100];

int main() {
    int _;
    cin >> _;
    for (int ts = 0; ts < _; ++ts) {
        int n;
        cin >> n;
        vector<int> data(n);
        for (int i = 0; i < n; ++i) cin >> data[i];
        int l = 0, r = 2000;

        auto cal = [&](int len) {
            int cur = 0, nxt = 1;
            memset(vis[nxt], true, sizeof(vis[nxt]));
            for (auto &item: data) {
                memset(vis[cur], false, sizeof(vis[cur]));
                for (int i = 0; i < len; ++i) {
                    if (vis[nxt][i]) {
                        if (i - item >= 0) vis[cur][i - item] = true;
                        if (i + item < len) vis[cur][i + item] = true;
                    }
                }
                swap(cur, nxt);
            }
            for (int i = 0; i < len; ++i) if (vis[nxt][i]) return true;
            return false;
        };

        while (l + 3 < r) {
            int mid = (l + r) >> 1;
            if (cal(mid + 1)) r = mid;
            else l = mid;
        }
        for (int i = l + 5; i >= l - 5; --i) {
            if (!cal(i + 1)) {
                cout << i + 1 << endl;
                break;
            }
        }
    }
}
```
