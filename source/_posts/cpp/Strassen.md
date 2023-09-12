---
title: Strassen算法代码
date: 2021-10-13 21:52:28
categories: 学习&开发&实现
tag:
 - C++
 - 线程池
---

**本文仅代码，无理论解释**

实话实说，我觉得这个算法在C系列的语言下，简直垃圾到爆炸……毕竟是一群完全不懂程序数学家对着纸弄出来的，看起来好像非常的有用，实际上耗时是非常爆炸的。

但是《算法导论》里有啊……然后上课又要求手写一个

于是我就手写了一个……我尽可能的减少使用的空间同时加快速度了，而且是通过递归实现 Strassen 算法

其中，in.txt 已经预先准备了 3000000 个范围在 0-100 随机数，避免程序在运算过程中爆 int（虽然完全可以取1000）

```cpp
/**
 * Created by Mauve on 3/29/2020.
 * Copyright © 2020 Mauve, All Rights Reserved
 */

#include <bits/stdc++.h>

using namespace std;

/**
 * 矩阵相乘
 * 最终结果耗时结果保存至
 * https://www.desmos.com/calculator/gl4tm5i1zu
 */

struct mat {
    unsigned row, col;

    mat(unsigned r, unsigned c) : row(r), col(c) {}

    virtual int &pos_ref(unsigned i, unsigned j) = 0;

    virtual int pos(unsigned i, unsigned j) const = 0;
};

struct base_mat;
struct sub_mat;

stack<sub_mat *> sub_data;

struct base_mat : mat {
    int *data;

    base_mat(unsigned r, unsigned c) : mat(r, c), data(new int[row * col]) {}

    ~base_mat() {
        delete[] data;
    }

    inline int &pos_ref(unsigned i, unsigned j) override {
        return *(data + i * col + j);
    }

    inline int pos(unsigned i, unsigned j) const override {
        return *(data + i * col + j);
    }
};

unsigned min_mul;

struct sub_mat : mat {
    mat *a, *b;
    bool is_add;
    unsigned offset_ai, offset_aj, offset_bi, offset_bj;

    explicit sub_mat(mat *data) : mat(data->row, data->col), a(data), b(nullptr),
                                  is_add(false), offset_ai(0), offset_aj(0),
                                  offset_bi(0), offset_bj(0) { sub_data.push(this); }

    sub_mat(mat *data, bool of_i, bool of_j) : mat(data->row >> 1u, data->col >> 1u), a(data), b(nullptr),
                                               is_add(false), offset_ai(of_i ? data->row >> 1u : 0),
                                               offset_aj(of_j ? data->col >> 1u : 0),
                                               offset_bi(0), offset_bj(0) { sub_data.push(this); }

    inline int &pos_ref(unsigned i, unsigned j) override {
        assert(b == nullptr);
        return a->pos_ref(i + offset_ai, j + offset_aj);
    }

    inline int pos(unsigned i, unsigned j) const override {
        if (b == nullptr)
            return a->pos(i + offset_ai, j + offset_aj);
        return a->pos(i + offset_ai, j + offset_aj) + (is_add ? 1 : -1) * b->pos(i + offset_bi, j + offset_bj);
    }

    inline sub_mat *operator+(sub_mat &other) {
        auto res = new sub_mat(this);
        res->b = &other;
        res->is_add = true;
        return res;
    }

    inline sub_mat *operator-(sub_mat &other) {
        auto res = new sub_mat(this);
        res->b = &other;
        res->is_add = false;
        return res;
    }

    mat *operator*(sub_mat &other) {
        assert(col == other.row);
        auto res = new base_mat(row, other.col);
        if (col & 1u || row & 1u || other.col & 1u || col <= min_mul || row <= min_mul || other.col <= min_mul) {
            memset(res->data, 0, sizeof(int) * res->row * res->col);
            for (int k = 0; k < col; k++)
                for (int i = 0; i < row; ++i)
                    for (int j = 0; j < other.col; ++j)
                        res->pos_ref(i, j) += pos(i, k) * other.pos(k, j);
        } else {
            size_t sub_data_size = sub_data.size();
#define a(i, j) (*new sub_mat(this, i == 2 , j == 2))
#define b(i, j) (*new sub_mat(&other, i == 2 , j == 2))
            auto m1 = *(a(1, 1) + a(2, 2)) * *(b(1, 1) + b (2, 2));
            auto m2 = *(a(2, 1) + a(2, 2)) * b(1, 1);
            auto m3 = a(1, 1) * *(b(1, 2) - b(2, 2));
            auto m4 = a(2, 2) * *(b(2, 1) - b(1, 1));
            auto m5 = *(a(1, 1) + a(1, 2)) * b(2, 2);
            auto m6 = *(a(2, 1) - a(1, 1)) * *(b(1, 1) + b(1, 2));
            auto m7 = *(a(1, 2) - a(2, 2)) * *(b(2, 1) + b(2, 2));
#undef a
#undef b
            unsigned half_row = row >> 1u, half_col = col >> 1u;
#define m(t) (m##t->pos(i, j))
            // C11
            for (unsigned i = 0; i < half_row; ++i)
                for (unsigned j = 0; j < half_col; ++j)
                    res->pos_ref(i, j) = m(1) + m(4) - m(5) + m(7);
            // C12
            for (unsigned i = 0; i < half_row; ++i)
                for (unsigned j = 0; j < half_col; ++j)
                    res->pos_ref(i, j + half_col) = m(3) + m(5);
            // C21
            for (unsigned i = 0; i < half_row; ++i)
                for (unsigned j = 0; j < half_col; ++j)
                    res->pos_ref(i + half_row, j) = m(2) + m(4);
            // C22
            for (unsigned i = 0; i < half_row; ++i)
                for (unsigned j = 0; j < half_col; ++j)
                    res->pos_ref(i + half_row, j + half_col) = m(1) - m(2) + m(3) + m(6);
#undef m
            delete dynamic_cast<base_mat *>(m1);
            delete dynamic_cast<base_mat *>(m2);
            delete dynamic_cast<base_mat *>(m3);
            delete dynamic_cast<base_mat *>(m4);
            delete dynamic_cast<base_mat *>(m5);
            delete dynamic_cast<base_mat *>(m6);
            delete dynamic_cast<base_mat *>(m7);
            while (sub_data.size() > sub_data_size) {
                delete sub_data.top();
                sub_data.pop();
            }
        }
        return res;
    }
};

unsigned N = 2;

void solve() {
    cerr << "N = " << N << endl;
    base_mat a(N, N), b(N, N);
    for (int i = 0; i < N; ++i)
        for (int j = 0; j < N; ++j)
            cin >> a.pos_ref(i, j);
    for (int i = 0; i < N; ++i)
        for (int j = 0; j < N; ++j)
            cin >> b.pos_ref(i, j);

    for (int t = 1; t < min(10u, N); t += 3) {
        auto x = new sub_mat(&a), y = new sub_mat(&b);
        min_mul = t;

        auto time_1 = clock();
        auto z = *x * *y;
        auto time_2 = clock();

        cerr << "t = " << t << " time: " << double(time_2 - time_1) / CLOCKS_PER_SEC << endl;
        delete dynamic_cast<base_mat *>(z);
        while (!sub_data.empty()) {
            delete sub_data.top();
            sub_data.pop();
        }
    }

    auto x = new sub_mat(&a), y = new sub_mat(&b);
    min_mul = 10000;

    auto time_1 = clock();
    auto z = *x * *y;
    auto time_2 = clock();

    cerr << "tradition: " << double(time_2 - time_1) / CLOCKS_PER_SEC << endl;
    delete dynamic_cast<base_mat *>(z);
    while (!sub_data.empty()) {
        delete sub_data.top();
        sub_data.pop();
    }
    N *= 2;
    if (N >= 1000) exit(0);
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
#ifdef ACM_LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    long long test_index_for_debug = 1;
    char acm_local_for_debug;
    while (cin >> acm_local_for_debug && acm_local_for_debug != '~') {
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
