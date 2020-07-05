---
layout: post
title: "主线程queue名称变了"
categories:
  - source
tags:
  - libdispatch
comments: true
---


通常情况下，主线程的queue是 `com.apple.main-thread`，如下图：

<!-- more -->

![](/media/15821272807884.jpg)


## 现象

前段时间解决一个问题时，发现主线程名称变成 `com.apple.UIKit.pasteboard.cache-queue` 了，如下图：

![](/media/15821258844491.jpg)



今天一想，试了试这段代码。如下图

```
    dispatch_queue_t g_queue = dispatch_queue_create("my-own-queue", DISPATCH_QUEUE_SERIAL);
    dispatch_sync(g_queue, ^{
        NSLog(@"in serial queue");
    });
```

![](/media/15821274736575.jpg)


果然主线程queue name 会变~ `dispatch_sync` 直接在当前线程执行了block。


## 总结

具体要去看libdispatch的代码了。。。这里就不（想）看了~


大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.jpg)