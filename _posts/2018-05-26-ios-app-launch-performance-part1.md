---
layout: post
title: "iOS App Launch Performance Optimization (Part 1): The premain Stage"
title_zh: "iOS 应用启动性能优化（一）：premain 阶段"
lang_original: zh
categories:
  - 性能优化
tags:
  - 性能优化
comments: true
---

> At work I've been continuously working on app launch performance, and I've also read many articles about "optimizing app launch performance." This article summarizes the articles I've read, plus some of my own understanding — there's nothing really new here. I've recently run into some difficulties and bottlenecks at work too, so I'm summarizing here while also organizing my thoughts.

The plan is to have five short articles:

1. iOS App Launch Performance Optimization (1) - premain
2. iOS App Launch Performance Optimization (2) - main
3. iOS App Launch Performance Optimization (3) - tools
4. iOS App Launch Performance Optimization (4) - principles
5. iOS App Launch Performance Optimization (5) - summary

**The articles are all very short. This is the first one, so don't have any high expectations :)**

<!-- more -->


# Introduction

The app launch process can be simply divided into 2 major stages:

1. The premain stage: code executed before the main function.
2. From main to the viewDidAppear of the home page UIViewController.

Among these, the premain stage is divided into three parts:

1. Loading the auto-linked dynamic libraries, and executing items 2 and 3 within the dynamic libraries first.
2. Executing `+load` methods
3. Executing `C++ static initializers` and `C/C++ __attribute__(constructor) functions`.

Since this code runs entirely on the `main thread`, it must be written carefully.

# +load

Objective C's +load method: during the pre-main stage, dyld calls the +load methods of all Objective C classes in the current image one by one (the call order is related to the link order).

+load code generally falls into a few categories:
1. Various Hook code (or Swizzle Method).
2. NSNotificationCenter, commonly seen in code developed collaboratively by multiple people.
3. Various singleton initialization code.

For +load methods, you can "delete" them or move them into the +initialize method. For NSNotificationCenter, you need the framework to provide a unified mechanism for other code to plug into, avoiding everyone listening separately.

To see all +load methods, the manual approach is to filter Labels in hopper. As shown below:
![](/media/15270382965409.jpg){:width="830" height="440"}


For how to measure the time cost of +load methods, refer to the article <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>


# static initializers

To be precise: `C++ static initializers` and `C/C++ __attribute__(constructor) functions`

This kind of code runs after +load methods and before the main method.

`C++ static initializers`: these are easily produced in code written in C++ (or Objective C++). Refer to the section "What methods can produce an initializer?" in [this article](http://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/).

`C/C++ __attribute__(constructor) functions`: see the reference code below,

```
__attribute__((constructor)) void calledFirst(){
    // todo
}
```
Refer to <https://stackoverflow.com/questions/2053029/how-exactly-does-attribute-constructor-work>

To see all initializers, in hopper you can:

![](/media/15273514962124.jpg){:width="964" height="806"}


For how to measure the time cost of this kind of initializer, refer to the article <https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/>


# An alternative to pre-main

To make this kind of code's time cost "auditable," there's a possibly-viable alternative. Refer to the article <https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/>


# References

- [Taobao iOS Performance Optimization Exploration](https://github.com/izhangxb/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf)
- [Toutiao iOS Client Launch Speed Optimization](https://techblog.toutiao.com/2017/01/17/iosspeed/)

<!--ZH-->

> 工作中一直在做App的启动性能，也看了很多关于“优化App启动性能”的文章。这篇文章对看过的文章做个汇总，加上一些自己的理解，没有什么新的内容。工作中近期也是遇上一些困难和瓶颈，在此总结下同时梳理下思路。

计划中会有五篇简短的文章：

1. iOS应用启动性能优化(1)-premain
2. iOS应用启动性能优化(2)-main
3. iOS应用启动性能优化(3)-工具
4. iOS应用启动性能优化(4)-原理
5. iOS应用启动性能优化(5)-总结

**文章都很简短，这是第一篇文章，不要有什么期望哈**

<!-- more -->


# 简介

App的启动过程可以简单的分为2大阶段：

1. premain阶段：main函数之前执行的代码。
2. main到首页UIViewController的viewDidAppear。

其中，premain阶段分为三部分：

1. 加载自动链接的动态库，并先后执行动态库中的2、3项。
2. 执行 `+load` 方法
3. 执行 `C++ static initializers` and `C/C++ __attribute__(constructor) functions` 。

由于这部分代码时完全在`主线程`中执行，必须谨慎编写。

# +load

Objective C 的+load方法：dyld会在pre-main阶段，逐个调用当前image的所有Objective C类的+load方法（调用顺序与链接时顺序有关）。

+load代码一般有几类：
1. 各种Hook代码（或者叫Swizzle Method）。
2. NSNotificationCenter，常见于多人合作开发的代码。
3. 各类单例初始化代码。

对于+load方法，可以通过“删除” 或者移动到+initialize方法中。对于 NSNotificationCenter 则需要框架提供一个统一的机制让其他代码接入，避免大家各自监听。

如何看到所有+load方法，手动的方法可以通过hopper过滤Labels。如下图：
![](/media/15270382965409.jpg){:width="830" height="440"}


如何统计+load方法的耗时，可以参考文章<https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>


# static initializers

准确的说是：`C++ static initializers` 和 `C/C++ __attribute__(constructor) functions`

这类代码在+load方法之后，main方法之前执行。

`C++ static initializers` ： 是在使用C++ （或者Objective C++）编写的代码中容易产生的，参考[这篇文章](http://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/) 中的”有哪些方法可以产生initializer？“。

`C/C++ __attribute__(constructor) functions`  ：参考代码如下，

```
__attribute__((constructor)) void calledFirst(){
    // todo
}
```
参考 <https://stackoverflow.com/questions/2053029/how-exactly-does-attribute-constructor-work>

如何看到所有initializers，hopper中可以：

![](/media/15273514962124.jpg){:width="964" height="806"}


如何统计这类initializers的耗时，可以参考文章<https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/>


# pre-main的替代方案

为了实现这类代码的“可审计耗时”，有个或许可行的替代方案，参考文章<https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/>


# 参考

- [手淘iOS性能优化探索](https://github.com/izhangxb/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf)
- [今日头条iOS客户端启动速度优化](https://techblog.toutiao.com/2017/01/17/iosspeed/)
