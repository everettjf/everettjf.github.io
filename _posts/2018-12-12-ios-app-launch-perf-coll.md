---
layout: post
title: "Table of Contents for the iOS Launch Performance Optimization Series"
title_zh: "iOS 启动性能优化系列文章目录"
lang_original: zh
categories:
  - 性能优化
tags:
  - 汇总
comments: true
---

Over the past two-plus years, I've written a number of articles on iOS app launch performance optimization. This article puts together a simple table of contents.


<!-- more -->

## The SpringBoard Stage

This is the stage where the iOS system's SpringBoard launches the app; the app's own process hasn't started yet.

- [A First Look at LaunchScreen](https://everettjf.github.io/2018/09/18/launch-screen-async-with-process-creation/)
- [Exploring SpringBoard with AppleTrace](https://everettjf.github.io/2018/10/28/appletrace-springboard/)

## The pre-main Stage

The stage within the app's own process, before the main function.

- [A Method for Hooking Objective-C +load](https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/)
- [A Method for Hooking C++ static initializers](https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/)
- [A Method for Delaying premain code](https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/)
- [iOS App Launch Performance Optimization (1) - premain](https://everettjf.github.io/2018/05/26/ios-app-launch-performance-part1/)
- [Hooking All +load Methods (Including Categories)](https://everettjf.github.io/2018/08/19/ios-hook-really-all-load/)

## The main Stage

The stage from the main function to didFinishLaunching, and on to when the home screen finishes displaying.

- [Methods for Getting the Current Time on iOS](https://everettjf.github.io/2018/08/07/get-current-time-on-ios-platform/)
- [A Simple Thread Pool in C++](https://everettjf.github.io/2018/08/12/a-simple-cpp-thread-pool/)
- [A Glance at mmap](https://everettjf.github.io/2018/09/01/mmap/)
- [How FastImageCache Works](https://everettjf.github.io/2018/09/11/fastimagecache/)
- [The Simple LRU Cache (LRUCache) in MMKV](https://everettjf.github.io/2018/09/27/lrucache-in-mmkv/)
- [Methods for Getting the Thread Identifier](https://everettjf.github.io/2018/11/12/ios-thread-number/)
- [The Simplest Launch Task Classification](https://everettjf.github.io/2018/08/24/most-simple-task-queue-model/)

## Tools

With good tools, analysis becomes a pleasure.

- [AppleTrace Performance Analysis Tool](https://everettjf.github.io/2017/09/21/appletrace/)
- [AppleTrace Combined with MonkeyDev to Trace Any App](https://everettjf.github.io/2017/10/12/appletrace-dancewith-monkeydev/)
- [VSCode Extension Filter Line](https://everettjf.github.io/2018/07/03/vscode-extension-filter-line/)
- [Trying Out the os_signpost API](https://everettjf.github.io/2018/08/13/os-signpost-tutorial/)
- Instruments (TimeProfiler): I always wanted to write an article but never did. There's plenty online, so I won't bother.
- dtrace: I always wanted to write an article but never did. You can refer to this book [Advanced Apple Debugging & Reverse Engineering](https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering)

## Warm Launch

- [Background Fetch](https://juejin.im/post/5bee3825e51d456d6b6f9486)

90% of the content of this article was written by me two years ago on Alibaba's intranet. After I left Ant, colleagues on the mPaaS project organized and published it (though without my byline 😓). The most valuable part is the Background Fetch section. But that section is just the tip of the iceberg, or rather just the first step of a long march. If you want to learn more, you're welcome to join Meituan.


## Resource Collection

- [iOS App Launch Performance Optimization Materials](https://everettjf.github.io/2018/08/06/ios-launch-performance-collection/)

## Cheatsheet

- [iOS Debug Cheatsheet](https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/)

## Areas to Explore

- Profile-Guided Optimization (PGO) 
- Improving Locality of Reference

I'll just mention these two by name; if you want to actually pursue them, they're quite interesting — search for them yourself.

## Summary

Over the past month or so I've had a lot of miscellaneous things going on and haven't written articles, so this article serves as a table of contents to pad the count. It also gives those scattered past articles a classification.

As for ideas on iOS app launch optimization, this article covers most of them at least. Of course, many of the articles above are fairly simple, and some optimization directions are just barely scratched the surface — going deeper is left as an exercise for the reader. Business governance and technical breakthroughs need to go hand in hand, and you also need to build various automated analysis and monitoring platforms in parallel — slow and steady, sustainable development, green planet (okay, I'm getting off track)...

In the future I probably won't focus "so intensely on app launch optimization" the way I used to. Although "launch optimization" covers a lot of content, it's still too narrow. There are many, many more directions to explore. Let's get going... to put it more formally... let's set sail~


Welcome to follow the official account "Client Tech Review":
![](/images/fun.png)

<!--ZH-->

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

这两点仅仅提下名字吧，如果要执行，还是很有意思的，可自行搜索。

## 总结

最近一个多月杂事较多，未写文章，这篇文章做个目录，凑个数。也是给过去零散的文章分个类。

iOS应用的启动优化思路，本文至少涵盖了大多数了。当然上面的很多文章都比较简单，部分优化方向仅仅开了个头，深入研究就交给读者啦。业务治理与技术突破需要双管齐下，也要同步搭建起各类自动化分析和监控平台，细水长流，可持续发展，绿色地球（扯远了哈）……

未来我应该不会像以前那样“如此关注App的启动优化”，“启动优化”虽然包含很多内容，但还是太窄了。可以探索的方向还有很多很多，搞起来……正式点……启航吧～


欢迎关注订阅号「客户端技术评论」：
![](/images/fun.png)
