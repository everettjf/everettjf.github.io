---
layout: post
title: "Exploring the Internal Implementation of Availability Checking (@available)"
title_zh: "探索 Availability Checking（@available）的内部实现"
lang_original: zh
categories:
  - 原理
tags:
  - 原理
comments: true
---

In this article we'll explore the essence of `@avaliable` step by step.

In [WWDC 2017: What's New in LLVM](https://developer.apple.com/videos/play/wwdc2017/411/), Apple introduced a new way of doing API availability checking, using syntax like `@avaliable`. For details, see this document: [Marking API Availability in Objective-C
](https://developer.apple.com/documentation/swift/objective-c_and_c_code_customization/marking_api_availability_in_objective-c)

<!-- more -->

Among them, `@available()` can be used in conditional statements, like this:

```
if (@available(iOS 11, *)) {
    // Use iOS 11 APIs.
} else {
    // Alternative code for earlier versions of iOS.
}
```

I believe this is also the one everyone is most familiar with. So what exactly is `@avaliable`?


## The Simplest Example

Let's create a new iOS project, then call the following code in AppDelegate:

```
void test_available() {
    if (@available(iOS 11, *)) {
        // Use iOS 11 APIs.
        NSLog(@"ios11");
    } else {
        // Alternative code for earlier versions of iOS.
        NSLog(@"ios other");
    }
}
```

The example code is [here](https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/avaliabletest/avaliabletest/AppDelegate.m).

## Let's Reverse Engineer It

After compiling (the simulator is fine), open the generated executable with Hopper and find this test_available, as shown:

![](/media/15604434575850.jpg){:width="1600" height="538"}

Look at the decompiled pseudocode:
![](/media/15604436909250.jpg){:width="762" height="254"}

We can see that the `___isOSVersionAtLeast` function is called, where `0xb` is `iOS 11`, and presumably the following two `0x0` values are the second and third version components.

Then Hopper finds this function,

![](/media/15604441390827.jpg){:width="1600" height="956"}

At a glance, the guess is roughly that `dispatch_once` gets the current system version, then assigns it to the three global variables `_GlobalMajor`, `_GlobalMinor` and `_GlobalSubminor`.

So how is the system version obtained inside `dispatch_once`? Hopper's decompiled pseudocode doesn't seem to show what's executed in the `block`. Switching to the assembly code view, we can see:

![](/media/15604447370360.jpg){:width="1376" height="372"}


Here the `_parseSystemVersionPList` function is called. Let's continue looking at this function:
![](/media/15604448185191.jpg){:width="1600" height="693"}

![](/media/15604451451816.jpg){:width="1484" height="266"}


![](/media/15604449285315.jpg){:width="1336" height="700"}


We can see there are operations on the file `/System/Library/CoreServices/SystemVersion.plist`, and there's also an `fopen`. So let's run Xcode and set a breakpoint on this fopen.

![](/media/15604452404549.jpg){:width="1600" height="601"}

The file path is as follows:

```
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/CoreSimulator/Profiles/Runtimes/iOS.simruntime/Contents/Resources/RuntimeRoot/System/Library/CoreServices/SystemVersion.plist
```

Let's open it and take a look,

![](/media/15604453014853.jpg){:width="1044" height="516"}

Now it's clear: in the end it accesses this file, gets the `ProductVersion` from it, and uses `sscanf` to parse out the three values `_GlobalMajor`, `_GlobalMinor` and `_GlobalSubminor`.


> sscanf is so ancient. Seeing it feels like going back to the year I first learned C.


## Interim Summary

From the analysis so far, `@available(iOS 11, *)` will ultimately turn into the following pseudocode:

```
_GlobalMajor
_GlobalMinor
_GlobalSubminor

void _parseSystemVersionPList() {
    char *path = ".../System/Library/CoreServices/SystemVersion.plist";
    fp = fopen(path)
    read from fp
    parse ProductVersion
    sscanf into _GlobalMajor,_GlobalMinor,_GlobalSubminor
}

BOOL ___isOSVersionAtLeast(major,minor,subminor) {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _parseSystemVersionPList();     
    });
    return compare major,minor,subminor with _GlobalMajor,_GlobalMinor,_GlobalSubminor
}
```

## How Does Clang Handle It


We can search for the relevant code here: `https://github.com/llvm-mirror/clang/`.

The AST used to represent available: `AvailabilitySpec`.

https://github.com/llvm-mirror/clang/blob/master/include/clang/AST/Availability.h

![](/media/15604461673229.jpg){:width="962" height="826"}

I also found the code that creates the function,

![](/media/15604462205628.jpg){:width="1296" height="930"}


I'm not too familiar with llvm specifically, so I won't go into detail (I can't really explain it either, ha). If you're interested, search for it yourself.


## Final Summary

Once you understand this essence, you'll use it more confidently from now on. Very interesting.

---

Welcome to subscribe :)

![](/images/fun.png)




<!--ZH-->

这篇文章我们一步一步探索`@avaliable`的本质。

[WWDC 2017: What's New in LLVM](https://developer.apple.com/videos/play/wwdc2017/411/) 中苹果介绍了一种新的API可用性检查方法，使用`@avaliable`等类似的语法。详细可见这篇文档 [Marking API Availability in Objective-C
](https://developer.apple.com/documentation/swift/objective-c_and_c_code_customization/marking_api_availability_in_objective-c)

<!-- more -->

其中 `@available()`可用于判断语句中，如下：

```
if (@available(iOS 11, *)) {
    // Use iOS 11 APIs.
} else {
    // Alternative code for earlier versions of iOS.
}
```

相信这也是大家最熟悉的，那么`@avaliable`到底是什么呢？


## 最简单的例子

我们新建一个iOS工程，然后AppDelegate里调用下如下代码：

```
void test_available() {
    if (@available(iOS 11, *)) {
        // Use iOS 11 APIs.
        NSLog(@"ios11");
    } else {
        // Alternative code for earlier versions of iOS.
        NSLog(@"ios other");
    }
}
```

例子代码[见这里](https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/avaliabletest/avaliabletest/AppDelegate.m)

## 逆向看看

编译（模拟器即可）后，使用Hopper打开生成的可执行文件，找到这个 test_available，如图：

![](/media/15604434575850.jpg){:width="1600" height="538"}

看下反编译的伪代码：
![](/media/15604436909250.jpg){:width="762" height="254"}

可知调用了 `___isOSVersionAtLeast` 这个函数，`0xb`就是`iOS 11`，估计后面两个`0x0`就是第二位和第三位版本了。

然后Hopper找到这个函数，

![](/media/15604441390827.jpg){:width="1600" height="956"}

一眼看去，猜测大概就是`dispatch_once`里获取了当前系统的版本，然后赋值给`_GlobalMajor`、`_GlobalMinor`和`_GlobalSubminor`三个全局变量。

那么`dispatch_once`里是怎么获取的系统版本呢？Hopper的反汇编出的伪代码似乎看不出`block`中执行了什么了。切换到汇编代码视图，可见：

![](/media/15604447370360.jpg){:width="1376" height="372"}


这里调用了 `_parseSystemVersionPList`函数，继续看这个函数：
![](/media/15604448185191.jpg){:width="1600" height="693"}

![](/media/15604451451816.jpg){:width="1484" height="266"}


![](/media/15604449285315.jpg){:width="1336" height="700"}


看到有对这个文件的操作`/System/Library/CoreServices/SystemVersion.plist`，而且有个`fopen`。那我们运行Xcode，断点到这个fopen。

![](/media/15604452404549.jpg){:width="1600" height="601"}

这个文件路径如下：

```
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/CoreSimulator/Profiles/Runtimes/iOS.simruntime/Contents/Resources/RuntimeRoot/System/Library/CoreServices/SystemVersion.plist
```

我们打开看看，

![](/media/15604453014853.jpg){:width="1044" height="516"}

那就明白咯，最终是访问这个文件，获取其中的`ProductVersion`，并通过`sscanf`解析出三个`_GlobalMajor`、`_GlobalMinor`和`_GlobalSubminor`三个数值。


> sscanf 好古老呀，看到他，好像回到了刚学C语言的那一年。


## 阶段总结

从目前的分析来看，`@available(iOS 11, *)`最终将变为如下伪代码：

```
_GlobalMajor
_GlobalMinor
_GlobalSubminor

void _parseSystemVersionPList() {
    char *path = ".../System/Library/CoreServices/SystemVersion.plist";
    fp = fopen(path)
    read from fp
    parse ProductVersion
    sscanf into _GlobalMajor,_GlobalMinor,_GlobalSubminor
}

BOOL ___isOSVersionAtLeast(major,minor,subminor) {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _parseSystemVersionPList();     
    });
    return compare major,minor,subminor with _GlobalMajor,_GlobalMinor,_GlobalSubminor
}
```

## Clang 怎么处理


相关代码我们从这里搜`https://github.com/llvm-mirror/clang/`，

用于表示avaliable的AST：`AvailabilitySpec`。

https://github.com/llvm-mirror/clang/blob/master/include/clang/AST/Availability.h

![](/media/15604461673229.jpg){:width="962" height="826"}

还搜到了创建函数的代码，

![](/media/15604462205628.jpg){:width="1296" height="930"}


具体我对llvm也不是太熟，就不细说了（也说不出来哈），感兴趣自行搜索啦。


## 再总结

了解了这个本质，以后用起来就更自信了哈。很有趣。

---

欢迎订阅 :)

![](/images/fun.png)




