---
layout: post
title: "C++ Thread Pool Implementation"
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---


In startup optimization, try not to be on main thread if possible. Put in child thread and try not to intensively concurrency, one by one, give main thread more execution opportunities. Then one method is to use thread pool.

<!-- more -->


# Introduction

This is definition on Wikipedia:

> In computer programming, a thread pool is a software design pattern for achieving concurrency of execution in a computer program. Often also called a replicated workers or worker-crew model,[1] a thread pool maintains multiple threads waiting for tasks to be allocated for concurrent execution by the supervising program. By maintaining a pool of threads, the model increases performance and avoids latency in execution due to frequent creation and destruction of threads for short-lived tasks.[2] The number of available threads is tuned to the computing resources available to the program, such as parallel processors, cores, memory, and network sockets.[3]


> A thread usage pattern. Too many threads brings scheduling overhead, affecting cache locality and overall performance. Thread pool maintains multiple threads, waiting for supervisor to assign concurrently executable tasks. This avoids cost of creating and destroying threads when handling short-lived tasks. Thread pool not only ensures full utilization of kernel, but also prevents excessive scheduling. Available thread count should depend on available concurrent processors, processor cores, memory, network sockets, etc. For example, thread count generally cpu count + 2 is appropriate, too many threads causes additional thread switching overhead.

- English <https://en.wikipedia.org/wiki/Thread_pool>
- Chinese <https://zh.wikipedia.org/wiki/%E7%BA%BF%E7%A8%8B%E6%B1%A0>


As shown:

![](/media/15340064020238.jpg)



# Implementation

This 2012 article <http://progsch.net/wordpress/?p=81> describes a simple implementation, implemented using C++11. Implementation below slightly optimizes code from this article.

Directly put code.


*ThreadPool.h*

```

#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

class ThreadPool {
public:
    ThreadPool(size_t);
    template<class F>
    void enqueue(F f);
    ~ThreadPool();
private:
    void Task();

    // need to keep track of threads so we can join them
    std::vector< std::thread > workers;
    
    // the task queue
    std::deque< std::function<void()> > tasks;
    
    // synchronization
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool stop;
};

// add new work item to the pool
template<class F>
void ThreadPool::enqueue(F f)
{
    { // acquire lock
        std::unique_lock<std::mutex> lock(queue_mutex);
        
        // add the task
        tasks.push_back(std::function<void()>(f));
    } // release lock
    
    // wake up one thread
    condition.notify_one();
}

```

*ThreadPool.mm*


```

#import "ThreadPool.h"

void ThreadPool::Task()
{
    std::function<void()> task;
    while(true)
    {
        {   // acquire lock
            std::unique_lock<std::mutex>
            lock(this->queue_mutex);
            
            // look for a work item
            while(!this->stop && this->tasks.empty())
            { // if there are none wait for notification
                this->condition.wait(lock);
            }
            
            if(this->stop) // exit if the pool is stopped
                return;
            
            // get the task from the queue
            task = this->tasks.front();
            this->tasks.pop_front();
            
        }   // release lock
        
        // execute the task
        task();
    }
}
// the constructor just launches some amount of workers
ThreadPool::ThreadPool(size_t threads)
:   stop(false)
{
    for(size_t i = 0;i<threads;++i){
        workers.push_back(std::thread([this]{this->Task();}));
    }
}

// the destructor joins all threads
ThreadPool::~ThreadPool()
{
    // stop all threads
    stop = true;
    condition.notify_all();
    
    // join them
    for(size_t i = 0;i<workers.size();++i){
        workers[i].join();
    }
}

```


# Usage

Reference code location: <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/ThreadPoolSample>

```
    ThreadPool pool(2);
    pool.enqueue([]{
        // todo: workload
    });
    
```


Test code:

```
    static ThreadPool pool(2);

    NSInteger idx = 0;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;
    pool.enqueue([idx]{ NSLog(@"begin%@",@(idx)); sleep(arc4random() % 10); NSLog(@"end%@",@(idx)); }); idx++;

```


# Others


iOS has multiple thread creation methods, above is just one C++ implementation. GitHub also has other simple implementations:

- <https://github.com/nbsdx/ThreadPool>
- <https://github.com/tghosgor/threadpool11>


Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)



