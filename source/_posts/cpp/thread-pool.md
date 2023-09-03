---
title: C++ 语言实现动态变化的线程池
date: 2021-10-13 21:52:28
categories: 学习&开发&实现
tag:
 - C++
 - 线程池
---

# 线程池
## Job
Job 作为任务的类型

```cpp
class Job {
    void *data;
    function<void(void *data)> func;
public:
    Job(void *data, function<void(void *data)> func);

    void exec();
};
```

其中定义两个变量，`data`，和 `func`。

`func` 用来保存需要调用的方法，当执行任务时，调用此函数即可。考虑到需要传递参数的可能，所以定义参数为一个指针，而另一个变量 data 则为需要传递给 func 的参数指针

函数的实现为

```cpp
Job::Job(void *data, function<void(void *)> func) {
    this->data = data;
    this->func = move(func);
}

void Job::exec() {
    func(data);
}
```

## 线程池核心代码
```cpp
class ThreadPool {
private:
    Mutex<map<pthread_t, thread *>> threadPool;             // 线程池
    Mutex<queue<Job *>> enqueue;                            // 任务队列
    Mutex<vector<thread *>> deathThread;                    // 已经死亡的线程
    Mutex<int> needKill;                                    // 需要杀死的线程数量
    condition_variable noTaskCv;                            // 无任务时的条件信号量
    mutex noTaskCvMutex;                                    // 无任务的条件信号量的锁
    int maxCore;                                            // 核心线程数
    bool killed;                                            // 已经终止了

    Job *takeJob();                                         // 获取一个任务

    virtual void addThread();                               // 添加一个线程

    void clean();                                           // 清理所有死亡的线程

public:
    explicit ThreadPool(int core);                          // 构造函数

    void submit(Job *job);                                  // 提交任务，需要提交一个指针类型，且不需要主动 delete，当任务完成后，会被线程池 delete 掉

    int getAccumulation();                                  // 获取当前堆积任务数量

    void updateCore(int newCount);                          // 更新核心线程数，若增加则会新增线程，若减少则会在空闲时间关闭部分线程

    void wait();                                            // 设定线程池为终止，不再可以提交任务，并等待所有任务完成

    void close();                                           // 强制关闭线程池，不等待任务完成
};
```

 - 首先通过 init 函数初始化核心线程数
 - 通过 submit 的函数提交任务，必须是一个 job 指针，且必须是单独 new 出来的，线程池会自动清理已经完成的任务
 - 可以随时通过 getAccumulation 来获取到当前堆积的任务，使得可以手动调整线程池数量
 - 使用 upateCore 来调整核心线程数量
 - 建议通过 wait 来实现终止线程池

 ```cpp
 ThreadPool::ThreadPool(int core) : maxCore(core), killed(false), needKill(0) {
    for (int i = 0; i < core; ++i) addThread();
}

Job *ThreadPool::takeJob() {
    Job *cur = nullptr;
    enqueue.run([&](queue<Job *> &q) {
        if (q.empty()) return;
        cur = q.front();
        q.pop();
    });
    return cur;
}

void ThreadPool::addThread() {
    auto work = [&]() {
        while (true) {
            Job *cur = takeJob();
            if (cur != nullptr) {
                cur->exec();
                delete cur;
            } else {
                bool dead = false;
                needKill.run([&](int &count) {
                    if (count <= 0) return;
                    dead = true;
                    count--;
                });
                if (dead) break;

                clean();
                unique_lock<mutex> lk(noTaskCvMutex);
                noTaskCv.wait(lk);
            }
        }
        threadPool.run([&](map<pthread_t, thread *> &data) {
            auto iter = data.find(pthread_self());
            deathThread.run([&](vector<thread *> &data) {
                data.push_back(iter->second);
            });
            data.erase(iter);
        });
    };

    auto *newThread = new thread(work);
    threadPool.run([&](map<pthread_t, thread *> &data) {
        data.insert({newThread->native_handle(), newThread});
    });
}

void ThreadPool::clean() {
    if (deathThread.get().empty()) return;
    deathThread.run([&](vector<thread *> &data) {
        for (auto &item: data) delete item;
    });
}

void ThreadPool::submit(Job *job) {
    if (killed) return;
    enqueue.run([&](queue<Job *> &q) {
        q.push(job);
        noTaskCv.notify_one();
    });
}

int ThreadPool::getAccumulation() {
    return (int) enqueue.get().size();
}

void ThreadPool::updateCore(int newCount) {
    if (killed) return;
    needKill.run([&](int &cleaned) {
        if (newCount > this->maxCore)
            for (int i = this->maxCore; i < newCount; ++i)
                addThread();
        else {
            cleaned += this->maxCore - newCount;
            noTaskCv.notify_all();
        }
    });
}

void ThreadPool::wait() {
    updateCore(0);
    killed = true;
    map<pthread_t, thread *> tmp = threadPool.get();
    for (auto &item: tmp)
        item.second->join();
}

void ThreadPool::close() {
    killed = true;
    map<pthread_t, thread *> tmp = threadPool.get();
    for (auto &item: tmp) {
        pthread_kill(item.first, SIGKILL);
        delete item.second;
    }
}
 ```

## 线程任务流程
 - 尝试获取一个任务
 - 若有任务
     * 执行任务
     * 删除任务
 - 若无任务
     * 检查是否有需要杀死的线程
     * 若有需要杀死的线程
         + 将当前线程添加进入已经结束线程组
         + 将当前线程从线程池中移除
     * 若无需要杀死的线程
         + 清理需要删除的任务
         + 进入等待状态

