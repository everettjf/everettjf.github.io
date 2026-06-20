---
layout: post
title: "Why Does an Exception Thrown by NSAssert Break at dispatch_once"
title_zh: "为什么 NSAssert 抛出的异常会在 dispatch_once 处中断"
lang_original: zh
categories:
  - tips
tags:
  - oc
  - exception
  - tips
  - ios
comments: true
---

I believe everyone's company codebase has, to some degree, a number of assertions (such as NSAssert). A common assertion scenario is: to avoid the SDK's initialization method and feature interfaces being misused, the SDK developer checks in the feature interface whether initialization has already happened, and otherwise triggers an assertion. Of course there are all kinds of other scenarios.

<!-- more -->

## Exploring NSAssert

This article explores a phenomenon of Objective-C's assertion method NSAssert. This phenomenon is fairly detailed and not easy to describe, so let's just dive in.

Suppose we have the following assertion:

```
NSAssert(NO, @"should not call this");
```

When the assertion code has source available, it looks like this when triggered:

![](/media/15817696181069.jpg)

The full call stack is as follows:

![](/media/15817696740923.jpg)

Since the source is available, Xcode intelligently positions the editor at the NSAssert line. At the same time we also learn another piece of information: NSAssert actually produces an Exception, and the Exception triggers the C function `objc_exception_throw`.


## Interaction with GCD

But if your company has promoted converting Pods into static libraries (to speed up compilation; teams with a lot of people on a product usually do this), then the NSAssert line has no source, and the call stack will very likely look like the image below:
![](/media/15817699224837.jpg)


Of course, this doesn't only happen when there's no source. If the assertion is inside some GCD block and the context also has no source, it will look like the image above too. For example, the following code will cause Xcode to be unable to break at the code line.

![](/media/15817701224885.jpg)


Why does this happen? Let's look at the detailed call stack:

![](/media/15817701588263.jpg)

Looking carefully, there's no `objc_exception_throw` here. So let's add a symbolic breakpoint and check.

![](/media/15817706969228.jpg)


No problem — this method was indeed called. Let's look at the implementation of `objc_exception_throw`.
https://opensource.apple.com/tarballs/objc4/ 
Download the latest code. Find this method, as follows.

![](/media/15817716916654.jpg)

After reading it, I don't really have any ideas.

Let's also look at these two GCD methods,

![](/media/15817718460206.jpg)


Then find the libdispatch code from here:
https://opensource.apple.com/tarballs/libdispatch/

![](/media/15817719822396.jpg)


Now it's clear: _dispatch_client_callout catches the OC Exception in the GCD block, then directly calls objc_terminate. That is, this is the point that causes the call stack to break.

That settles this issue for now.

## dispatch_once

For launch optimization, I wrote some launcher code. To avoid the internal code being executed multiple times, I added a dispatch_once. The launcher executes various kinds of launch logic. However, for a while, people kept saying my code was crashing.

The general situation was as follows:

![](/media/15817723562511.jpg)

myRunner on the left side refers to the launcher. From the image above, it indeed crashed in my code.

But what was the actual situation?

![](/media/15817724251639.jpg)

Because the code inside dispatch_once threw an OC exception. Big companies often run into this situation early on, and later they usually develop code specifically for assertions to locate the Owner — and as a result, because of dispatch_once, everyone ended up tracking it back to me.

The simplest solution is to add an exception breakpoint. (That is, the symbolic breakpoint objc_exception_throw.)

![](/media/15817726052193.jpg)

Don't underestimate this operation, ha. I've seen many developers who don't know about it (this might be the first must-have skill for an iOS engineer moving from a small company to a big one).

Thinking about the cause again, let's look at the call stack

![](/media/15817728005548.jpg)

_dispatch_client_callout is still present. But the slight difference is that dispatch_once's method is inline, written into the header file

![](/media/15817728648084.jpg)

Xcode will try to find the last line in the call stack that has matching code, locate it there, and show it to the developer.

## How to Solve It

The cause is figured out. So how do we work around this problem? For now it seems the answer is just don't use GCD.

For example: C++'s std::call_once.

![](/media/15817731685041.jpg)

Another example is using the built-in lock of a static variable (this could be worth writing an article to explore).

![](/media/15817731588446.jpg)

For more methods, refer to:
https://stackoverflow.com/questions/8412630/how-to-execute-a-piece-of-code-only-once



If you like it, please follow the official account as encouragement:

![](/images/fun.png)


<!--ZH-->

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



大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)


