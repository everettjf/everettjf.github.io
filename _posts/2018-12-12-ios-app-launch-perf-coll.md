---
layout: post
title: "过去一段时间的iOS启动优化文章目录"
categories:
  - 性能优化
tags:
  - 汇总
comments: true
---

过去两年多的时间里，我写了一些iOS应用启动性能优化的文章，这篇文章整理个简单的目录。


<!-- more -->

## SpringBoard 阶段

这个阶段是iOS系统的SpringBoard启动App的阶段，App本身进程还未启动。

- [初步探索LaunchScreen](https://everettjf.github.io/2018/09/18/launch-screen-async-with-process-creation/)
- [使用AppleTrace探索SpringBoard](https://everettjf.github.io/2018/10/28/appletrace-springboard/)

## pre-main 阶段

App自身进程中，main函数之前的阶段。

- [一种 hook objective c +load 的方法](https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/)
- [一种 hook C++ static initializers 的方法](https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/)
- [一种延迟 premain code 的方法](https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/)
- [iOS应用启动性能优化(1)-premain](https://everettjf.github.io/2018/05/26/ios-app-launch-performance-part1/)
- [Hook所有+load方法（包括Category）](https://everettjf.github.io/2018/08/19/ios-hook-really-all-load/)

## main 阶段

main函数到didFinishLaunching，再到首页显示完成的阶段。

- [iOS时间获取方法](https://everettjf.github.io/2018/08/07/get-current-time-on-ios-platform/)
- [C++实现简单的线程池](https://everettjf.github.io/2018/08/12/a-simple-cpp-thread-pool/)
- [瞜一眼 mmap](https://everettjf.github.io/2018/09/01/mmap/)
- [FastImageCache 原理](https://everettjf.github.io/2018/09/11/fastimagecache/)
- [MMKV中的简单LRU缓存(LRUCache)](https://everettjf.github.io/2018/09/27/lrucache-in-mmkv/)
- [线程标识获取方法](https://everettjf.github.io/2018/11/12/ios-thread-number/)
- [最简单的启动任务分类](https://everettjf.github.io/2018/08/24/most-simple-task-queue-model/)

## 工具

工具好了，分析起来就愉快了。

- [AppleTrace 性能分析工具](https://everettjf.github.io/2017/09/21/appletrace/)
- [AppleTrace 搭配 MonkeyDev Trace任意App](https://everettjf.github.io/2017/10/12/appletrace-dancewith-monkeydev/)
- [VSCode Extension Filter Line](https://everettjf.github.io/2018/07/03/vscode-extension-filter-line/)
- [os_signpost API 尝鲜](https://everettjf.github.io/2018/08/13/os-signpost-tutorial/)
- Instruments (TimeProfiler) 一直想写篇文章，但没写。网上很多，就不写了。
- dtrace 一直想写篇文章，但没写。可以参考这本书 [Advanced Apple Debugging & Reverse Engineering](https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering)

## 热启动

- [Background Fetch](https://juejin.im/post/5bee3825e51d456d6b6f9486)

这篇文章90%的内容是两年前我于阿里内网写的，在我离开蚂蚁后，mPaaS项目的同事整理发出（虽然没有我的署名😓）。其中最有价值的就是Background Fetch这一段。但这一段只是冰山一角，或者说是万里长征的第一步。若想了解更多，欢迎加入美团。


## 资料收集

- [iOS应用启动性能优化资料](https://everettjf.github.io/2018/08/06/ios-launch-performance-collection/)

## 手册

- [iOS调试速查表 (iOS Debug Cheatsheet)](https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/)

## 可探索

- Profile-Guided Optimization (PGO) 
- Improving Locality of Reference

这两点仅仅提下名字，如果要执行，还是很有意思的，可自行搜索。

## 总结

最近一个多月杂事较多，未写文章，这篇文章做个目录，凑个数。也是给过去零散的文章分个类。

iOS应用的启动优化思路，本文至少涵盖了大多数了。当然上面的很多文章都比较简单，部分优化方向仅仅开了个头，深入研究就交给读者啦。业务治理与技术突破需要双管齐下，也要同步搭建起各类自动化分析和监控平台，细水长流，可持续发展，绿色地球（扯远了哈）……

Emmmmm...this很有趣。


欢迎关注订阅号《this很有趣》：
![](/images/fun.jpg)

