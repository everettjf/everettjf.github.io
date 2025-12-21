---
layout: post
title: "Thread Identifier Retrieval Methods"
categories:
  - Performance Optimization
tags:
  - Thread
comments: true
---

Performance optimization development often needs to get thread identifiers, this article simply lists and compares four methods to get thread identifiers.

<!-- more -->

# Four Methods

These four methods:

```
// <NSThread: 0x283903000>{number = 1, name = main}
[[NSThread currentThread] description]

// 0x283903000
[NSThread currentThread]

// 0x10268ab80
pthread_t tid = pthread_self()

// 687599 (This is same as thread ID in NSLog)
uint64_t tid;
pthread_threadid_np(NULL, &tid);
```

Formatted output code:

```
NSLog(@"[[NSThread currentThread] description] = %@", [[NSThread currentThread] description]);
NSLog(@"[NSThread currentThread] = %p",[NSThread currentThread]);
NSLog(@"pthread_self = %p",pthread_self());
uint64_t tid;
pthread_threadid_np(NULL, &tid);
NSLog(@"pthread_threadid_np = %llu",tid);
```

# Time Consumption Comparison

This is my time consumption on iPhone7 iOS12 main thread and child thread each 10000 times:

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

Can see, `[[NSThread currentThread] description]` should have more internal string operations, relatively time-consuming. Other three methods all have very little time consumption.

# Reference Code

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/ThreadNumberDemo/ThreadNumberDemo/AppDelegate.m>

# Summary

Then in future happily boldly use these two methods, among them pthread_threadid_np is same as thread ID in NSLog, effect looks better.

```
pthread_t tid = pthread_self()

uint64_t tid;
pthread_threadid_np(NULL, &tid);
```


Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)
