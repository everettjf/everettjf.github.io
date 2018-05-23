---
layout: post
title: "iOS应用启动性能优化方法汇总(Part1)"
excerpt: 总结常用iOS应用的启动性能优化方法
categories:
  - 性能优化
tags:
  - 性能优化
comments: true
---


> 工作中一直在做App的启动性能，也看了很多关于“优化App启动性能”的文章。这篇文章对看过的文章做个汇总，加上一些自己的理解，没有什么新的内容。工作中近期也是遇上一些困难和瓶颈，在此总结下顺便梳理下思路。


# 概况

App的启动过程可以简单的分为2大阶段：

1. pre-main阶段：main函数之前执行的代码。
2. main到首页UIViewController的viewDidAppear。

## pre-main

这里分为三部分：

1. 加载自动链接的动态库，并先后执行动态库中的2、3项。
2. 执行 `+load` 方法
3. 执行 `C++ static initializers` and `C/C++ __attribute__(constructor) functions` 。

由于这部分代码时完全在`主线程`中执行，必须谨慎编写。

### +load

Objective C 的+load方法：dyld会在pre-main阶段，逐个调用当前image的所有Objective C类的+load方法（调用顺序与链接时顺序有关）。

+load代码一般有几类：
1. 各种Hook代码（或者叫Swizzle Method）。
2. NSNotificationCenter，常见于多人合作开发的代码。
3. 各类单例初始化代码。

对于+load方法，可以通过“删除” 或者移动到+initialize方法中。对于 NSNotificationCenter 则需要框架提供一个统一的机制让其他代码接入，避免大家各自监听。

如何统计+load方法的耗时，可以参考文章<http://everettjf.com/2017/01/06/a-method-of-hook-objective-c-load/>

如何看到所有+load方法，最手动的方法可以是：通过hopper查看。如下图：
![](/media/15270382965409.jpg)



### `C++ static initializers` 和 `C/C++ __attribute__(constructor) functions`

这类代码在+load方法之后执行。

`C++ static initializers` ： 是在使用C++ （或者Objective C++）编写的代码中容易产生的，参考[这篇文章](http://everettjf.com/2017/02/06/a-method-of-hook-static-initializers/) 中的”有哪些方法可以产生Initializer？“。


`C/C++ __attribute__(constructor) functions`  ：参考代码如下，

```
__attribute__((constructor)) void calledFirst(){
    // todo
}
```
参考 <https://stackoverflow.com/questions/2053029/how-exactly-does-attribute-constructor-work>

如何统计这类initializers的耗时，可以参考文章<http://everettjf.com/2017/02/06/a-method-of-hook-static-initializers/>

### pre-main代码的替代方案

为了实现这类代码的“可审计耗时”，有个或许可行的替代方案，参考文章<http://everettjf.com/2017/03/06/a-method-of-delay-premain-code/>



## main


# 注意事项

1. 启动阶段，避免主线程IO。
2. 启动阶段，子线程避免CPU密集的代码。

# 工具


## TimeProfiler(Instruments)


## AppleTrace



# 参考

- [手淘iOS性能优化探索](https://github.com/EverettFavorites/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf)
- [今日头条iOS客户端启动速度优化](https://techblog.toutiao.com/2017/01/17/iosspeed/)

