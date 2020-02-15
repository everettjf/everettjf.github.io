---
layout: post
title: "探索系列: dispatch_once与NSAssert"
categories:
  - tips
tags:
  - oc
  - exception
  - tips
  - ios
comments: true
---

相信大家公司的代码中多多少少存在一些断言（例如NSAssert）。一种常见的断言场景是：SDK的开发者为了避免SDK的初始化方法与功能接口，会在功能接口中判断是否已经初始化，否则就触发断言。当然还有各种各样其他场景。

<!-- more -->

## 探索 NSAssert

本文探索下Objective C的断言方法NSAssert的一种现象。这个现象比较细节，不太好描述，咱们就直接聊吧。

假设有下面的断言：

```
NSAssert(NO, @"should not call this");
```

当断言代码有源码时，触发时如下图：

![](/media/15817696181069.jpg)

完整的callstack如下：

![](/media/15817696740923.jpg)

由于有源码，Xcode很智能的把编辑器定位到了NSAssert的那一行。同时我们也知道了另一个信息，NSAssert其实就是产生了一个Exception，Exception会触发 `objc_exception_throw` 这个c函数。


## 与GCD作用

但如果公司内推行过把Pod转为静态库（为了加快编译速度，一般团队人数多的产品都会这么做），NSAssert那一行没有源码，那很可能Callstack会如下图：
![](/media/15817699224837.jpg)


当然并不是只有没源码时会像上图这样。如果断言在GCD的一些block中，而且上下文也没有源码，也会像上图这样。例如下面的代码，就会导致Xcode不能断点到代码行。

![](/media/15817701224885.jpg)


为什么会这样呢？看下详细的Callstack：

![](/media/15817701588263.jpg)

仔细看了看，这里并没有 `objc_exception_throw`。那我们加上符号断点看下。

![](/media/15817706969228.jpg)


没问题，这个方法是调用了的。我们看下`objc_exception_throw`的实现。
https://opensource.apple.com/tarballs/objc4/ 
下载最新的代码。找到这个方法，如下。

![](/media/15817716916654.jpg)

看完似乎没啥想法。

我们再看看GCD的这两个方法，

![](/media/15817718460206.jpg)


再从这里找到 libdispatch 的代码：
https://opensource.apple.com/tarballs/libdispatch/

![](/media/15817719822396.jpg)


这下就明白了，_dispatch_client_callout 把GCD block中的OC Exception捕获了，然后直接 objc_terminate。也就是这里，导致Callstack断开了。

这个问题暂告于段落。

## dispatch_once

为了启动优化，我写了一个启动器的代码，为了避免内部代码执行多次，增加了一个 dispatch_once。启动器中执行各类启动逻辑。然而，有一段时间，总有人说我的代码Crash。

大概情况如下：

![](/media/15817723562511.jpg)

左侧myRunner表示启动器。从上图看，确实Crash到了我的代码中。

然而实际情况呢？

![](/media/15817724251639.jpg)

因为dispatch_once中的代码throw了OC异常。一般大公司初期这种情况经常遇到，后期一般都会针对断言专门开发一些代码用来定位Owner，结果由于 dispatch_once 导致都找到了我。

最简单的解决方法是，加个异常断点。（也就是符号断点 objc_exception_throw）

![](/media/15817726052193.jpg)

别小看这个操作哈，我见过很多开发同学不知道这个操作（这可能是小公司iOS同学进入大公司的第一个必备技能）。

再想下原因，看下Callstack

![](/media/15817728005548.jpg)

还是存在 _dispatch_client_callout 。但稍微不同之处是，dispatch_once的这个方法是inline的，写到了头文件里

![](/media/15817728648084.jpg)

Xcode会尝试在Callstack中找到最后一个有匹配代码的行，并定位到这行，显示给开发者。

## 怎么解决 

原因弄清楚了。那怎么绕过这个问题呢？目前看来不是用GCD即可。

例如：C++的std::call_once。

![](/media/15817731685041.jpg)

再例如利用static变量的自带锁（这个可以写篇文章探索一下）

![](/media/15817731588446.jpg)

更多方法参考：
https://stackoverflow.com/questions/8412630/how-to-execute-a-piece-of-code-only-once


## 交流群

是的，我又创建交流群了～一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。如果群满了，加我微信 everettjf，备注：加群。

![](/media/15817739945151.jpg)




## 总结

好了，今天的探索到此结束，很有趣。广告时间到。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ）。如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)





