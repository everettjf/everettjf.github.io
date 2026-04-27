---
layout: post
title: "线程标识获取方法"
categories:
  - 性能优化
tags:
  - 线程
comments: true
---

性能优化的开发中经常需要获取线程标识，这篇文章简单罗列和对比了四种获取线程标识的方法。

<!-- more -->

# 四种方法

这四种方法如下：

```
// <NSThread: 0x283903000>{number = 1, name = main}
[[NSThread currentThread] description]

// 0x283903000
[NSThread currentThread]

// 0x10268ab80
pthread_t tid = pthread_self()

// 687599 （这与NSLog中的线程ID相同）
uint64_t tid;
pthread_threadid_np(NULL, &tid);
```

格式化输出的代码如下：

```
NSLog(@"[[NSThread currentThread] description] = %@", [[NSThread currentThread] description]);
NSLog(@"[NSThread currentThread] = %p",[NSThread currentThread]);
NSLog(@"pthread_self = %p",pthread_self());
uint64_t tid;
pthread_threadid_np(NULL, &tid);
NSLog(@"pthread_threadid_np = %llu",tid);
```

# 耗时对比

这是我在 iPhone7 iOS12 下主线程和子线程各10000次的耗时:

```
-----main thread-----
45.33674998674542ms - NSThread description
0.2739583433140069ms - NSThread
0.04708333290182054ms - pthread_self
0.05629166844300926ms - pthread_threadid_np
-----child thread-----
46.34449999139179ms - NSThread description
0.1779583399184048ms - NSThread
0.04004167567472905ms - pthread_self
0.04883333167526871ms - pthread_threadid_np
```

可见，`[[NSThread currentThread] description]` 应该是内部字符串操作较多，相对耗时。其他三种方法耗时都很少。

# 参考代码

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/ThreadNumberDemo/ThreadNumberDemo/AppDelegate.m>

# 总结

那么以后就开心大胆的用这两个方法咯，其中 pthread_threadid_np 与 NSLog 中的线程ID相同，效果看来更佳。

```
pthread_t tid = pthread_self()

uint64_t tid;
pthread_threadid_np(NULL, &tid);
```


欢迎关注订阅号「客户端技术评论」：
![](/images/fun.png)

