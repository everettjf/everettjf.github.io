---
layout: post
title: "iOS App Launch Performance Optimization (1) - premain"
tags:
  - iOS
  - development
  - mobile

comments: true
---

> Been working on App launch performance, also read many articles about "optimizing App launch performance". This article summarizes articles read, plus some own understanding, nothing new. Work recently also encountered some difficulties and bottlenecks, summarize here and organize thoughts.

Planned to have five short articles:

1. iOS App Launch Performance Optimization (1) - premain
2. iOS App Launch Performance Optimization (2) - main
3. iOS App Launch Performance Optimization (3) - Tools
4. iOS App Launch Performance Optimization (4) - Principles
5. iOS App Launch Performance Optimization (5) - Summary

**Articles are all very short, this is the first article, don't have high expectations**

<!-- more -->


# Introduction

App's startup process can be simply divided into 2 major stages:

1. premain stage: Code executed before main function.
2. main to first page UIViewController's viewDidAppear.

Among them, premain stage is divided into three parts:

1. Load automatically linked dynamic libraries, and execute 2, 3 items in dynamic libraries sequentially.
2. Execute `+load` methods
3. Execute `C++ static initializers` and `C/C++ __attribute__(constructor) functions` .

Since this part of code executes completely on `main thread`, must write carefully.

# +load

Objective C's +load method: dyld will in pre-main stage, call all Objective C classes' +load methods in current image one by one (call order related to link-time order).

+load code generally has several types:
1. Various Hook code (or called Swizzle Method).
2. NSNotificationCenter, common in multi-person collaborative development code.
3. Various singleton initialization code.

For +load methods, can "delete" or move to +initialize method. For NSNotificationCenter need framework to provide unified mechanism for other code to integrate, avoid everyone listening separately.

How to see all +load methods, manual method can filter Labels through hopper. As below:
![](/media/15270382965409.jpg)


How to count +load method time consumption, can reference article <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>


# static initializers

Precisely: `C++ static initializers` and `C/C++ __attribute__(constructor) functions`

This type of code executes after +load methods, before main method.

`C++ static initializers` : Easily produced in code written using C++ (or Objective C++), reference [this article](http://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/)'s "What methods can produce initializer?".

`C/C++ __attribute__(constructor) functions` : Reference code below,

```
__attribute__((constructor)) void calledFirst(){
    // todo
}
```
Reference <https://stackoverflow.com/questions/2053029/how-exactly-does-attribute-constructor-work>

How to see all initializers, in hopper can:

![](/media/15273514962124.jpg)


How to count this type of initializers' time consumption, can reference article <https://everettjf.github.io/2017/02/06/a-method-of-hook-static-initializers/>


# pre-main Alternative Solution

To achieve "auditable time consumption" for this type of code, there's a perhaps feasible alternative solution, reference article <https://everettjf.github.io/2017/03/06/a-method-of-delay-premain-code/>


# References

- [Taobao iOS Performance Optimization Exploration](https://github.com/izhangxb/GMTC/blob/master/%E5%85%A8%E7%90%83%E7%A7%BB%E5%8A%A8%E6%8A%80%E6%9C%AF%E5%A4%A7%E4%BC%9AGMTC%202017%20PPT/%E6%89%8B%E6%B7%98iOS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8E%A2%E7%B4%A2%20.pdf)
- [Toutiao iOS Client Startup Speed Optimization](https://techblog.toutiao.com/2017/01/17/iosspeed/>

