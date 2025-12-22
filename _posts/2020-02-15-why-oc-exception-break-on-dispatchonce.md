---
layout: post
title: "NSAssert and dispatch_once"
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---

Believe everyone's company code more or less has some assertions (for example NSAssert). A common assertion scenario: SDK developers to avoid SDK's initialization methods and functional interfaces, will judge in functional interfaces if already initialized, otherwise trigger assertion. Of course also various other scenarios.

<!-- more -->

## Exploring NSAssert

This article explores a phenomenon of Objective C's assertion method NSAssert. This phenomenon is quite detailed, not easy to describe, let's directly talk.

Assume has assertion below:

```
NSAssert(NO, @"should not call this");
```

When assertion code has source code, when triggered as below:

![](/media/15817696181069.jpg)

Complete callstack:

![](/media/15817696740923.jpg)

Since has source code, Xcode intelligently positions editor to NSAssert's line. Also we know another information, NSAssert actually produces an Exception, Exception will trigger `objc_exception_throw` this C function.


## Interaction with GCD

But if company promoted converting Pods to static libraries (to speed up compilation, generally teams with many people do this), NSAssert line has no source code, then likely Callstack will be as below:
![](/media/15817699224837.jpg)


Of course not only when no source code will be like above. If assertion in GCD's some blocks, and context also has no source code, will also be like above. For example code below, will cause Xcode can't breakpoint to code line.

![](/media/15817701224885.jpg)


Why like this? Look at detailed Callstack:

![](/media/15817701588263.jpg)

Carefully looked, here doesn't have `objc_exception_throw`. Then we add symbol breakpoint to see.

![](/media/15817706969228.jpg)


No problem, this method is called. We look at `objc_exception_throw`'s implementation.
https://opensource.apple.com/tarballs/objc4/ 
Download latest code. Find this method, as below.

![](/media/15817716916654.jpg)

After reading seems no ideas.

We look at GCD's these two methods again,

![](/media/15817718460206.jpg)


Then find libdispatch's code from here:
https://opensource.apple.com/tarballs/libdispatch/

![](/media/15817719822396.jpg)


Now understand, _dispatch_client_callout catches OC Exception in GCD block, then directly objc_terminate. That is here, causes Callstack to break.

This problem temporarily ends here.

## dispatch_once

For startup optimization, I wrote a launcher's code, to avoid internal code executing multiple times, added a dispatch_once. Launcher executes various startup logic. However, for a period, always people said my code Crash.

Rough situation:

![](/media/15817723562511.jpg)

Left myRunner represents launcher. From figure above, indeed Crashed in my code.

But actual situation?

![](/media/15817724251639.jpg)

Because code in dispatch_once threw OC exception. Generally large companies early stage this situation often encountered, later stage generally will specifically develop some code for assertions to locate Owner, result due to dispatch_once all found me.

Simplest solution is, add an exception breakpoint. (That is symbol breakpoint objc_exception_throw)

![](/media/15817726052193.jpg)

Don't underestimate this operation ha, I've seen many development classmates don't know this operation (this might be small company iOS classmates' first essential skill entering large companies).

Think about reason again, look at Callstack

![](/media/15817728005548.jpg)

Still exists _dispatch_client_callout . But slightly different is, dispatch_once's this method is inline, written in header file

![](/media/15817728648084.jpg)

Xcode will try to find last line with matching code in Callstack, and position to this line, display to developer.

## How to Solve 

Reason clarified. Then how to bypass this problem? Currently seems not using GCD is fine.

For example: C++'s std::call_once.

![](/media/15817731685041.jpg)

Also for example use static variable's built-in lock (this can write an article to explore)

![](/media/15817731588446.jpg)

More methods reference:
https://stackoverflow.com/questions/8412630/how-to-execute-a-piece-of-code-only-once



If everyone likes, follow subscription account to encourage:

![](/images/fun.png)


