---
layout: post
title: "iOS App Launch Performance Optimization Articles Directory"
categories:
  - Performance Optimization
tags:
  - Collection
comments: true
---

Over past two plus years, I wrote some iOS app launch performance optimization articles, this article organizes a simple directory.


<!-- more -->

## SpringBoard Stage

This stage is iOS system's SpringBoard launching App stage, App's own process hasn't started yet.

- [Preliminary Exploration of LaunchScreen](https://everettjf.github.io/2018/09/18/launch-screen-async-with-process-creation/)
- [Exploring SpringBoard Using AppleTrace](https://everettjf.github.io/2018/10/28/appletrace-springboard/)

## pre-main Stage

App's own process, stage before main function.

- [A Method to Hook Objective C +load](https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/)
- [A Method to Hook C++ Static Initializers](https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/)
- [A Method to Delay premain Code](https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/)
- [iOS App Launch Performance Optimization (1) - premain](https://everettjf.github.io/2018/05/26/ios-app-launch-performance-part1/)
- [Hook All +load Methods (Including Category)](https://everettjf.github.io/2018/08/19/ios-hook-really-all-load/)

## main Stage

main function to didFinishLaunching, to home page display completion stage.

- [iOS Time Retrieval Methods](https://everettjf.github.io/2018/08/07/get-current-time-on-ios-platform/)
- [A Simple C++ Thread Pool Implementation](https://everettjf.github.io/2018/08/12/a-simple-cpp-thread-pool/)
- [A Glance at mmap](https://everettjf.github.io/2018/09/01/mmap/)
- [FastImageCache Principles](https://everettjf.github.io/2018/09/11/fastimagecache/)
- [Simple LRU Cache (LRUCache) in MMKV](https://everettjf.github.io/2018/09/27/lrucache-in-mmkv/)
- [Thread Identifier Retrieval Methods](https://everettjf.github.io/2018/11/12/ios-thread-number/)
- [Simplest Startup Task Classification](https://everettjf.github.io/2018/08/24/most-simple-task-queue-model/)

## Tools

Tools good, analyzing becomes pleasant.

- [AppleTrace Performance Analysis Tool](https://everettjf.github.io/2017/09/21/appletrace/)
- [AppleTrace with MonkeyDev Trace Any App](https://everettjf.github.io/2017/10/12/appletrace-dancewith-monkeydev/)
- [VSCode Extension Filter Line](https://everettjf.github.io/2018/07/03/vscode-extension-filter-line/)
- [os_signpost API First Look](https://everettjf.github.io/2018/08/13/os-signpost-tutorial/)
- Instruments (TimeProfiler) always wanted to write article, but didn't. Online many, won't write.
- dtrace always wanted to write article, but didn't. Can reference this book [Advanced Apple Debugging & Reverse Engineering](https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering)

## Hot Launch

- [Background Fetch](https://juejin.im/post/5bee3825e51d456d6b6f9486)

This article 90% content I wrote on Alibaba internal network two years ago, after I left Ant, mPaaS project colleagues organized and published (although no my signature😓). Among them most valuable is Background Fetch section. But this section is just tip of iceberg, or first step of long march. If want to learn more, welcome to join Meituan.


## Resource Collection

- [iOS App Launch Performance Resources](https://everettjf.github.io/2018/08/06/ios-launch-performance-collection/)

## Handbook

- [iOS Debugging Cheatsheet (iOS Debug Cheatsheet)](https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/)

## Can Explore

- Profile-Guided Optimization (PGO) 
- Improving Locality of Reference

These two points just mention names, if want to execute, very interesting, can search yourself.

## Summary

Recently over a month many miscellaneous things, didn't write articles, this article makes a directory, make up numbers. Also categorizes past scattered articles.

iOS app's launch optimization ideas, this article at least covers most. Of course many articles above are relatively simple, some optimization directions just started, in-depth research left to readers. Business governance and technical breakthroughs need both hands, also need to simultaneously build various automated analysis and monitoring platforms, steady stream, sustainable development, green earth (went too far ha)…

Future I probably won't like before "so focus on App's launch optimization", "launch optimization" although contains lots of content, but still too narrow. Directions can explore still many many, let's do it... formally... set sail～


Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)
