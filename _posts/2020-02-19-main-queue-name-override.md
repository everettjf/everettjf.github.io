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



## 交流群

是的，我又创建交流群了～一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。如果群满了，加我微信 everettjf，备注：加群。

![](/media/15817739945151.jpg)


广告时间到。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`抖音iOS App的业务、性能、稳定性等方方面面`的开发。`入职后的方向看你的兴趣`。

如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)