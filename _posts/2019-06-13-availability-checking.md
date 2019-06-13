---
layout: post
title: "Availability Checking 内部实现"
categories:
  - 原理
tags:
  - 原理
comments: true
---

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

例子代码[见这里](https://github.com/bukuzao/bukuzao/blob/master/sample/avaliabletest/avaliabletest/AppDelegate.m)

## 逆向看看

编译（模拟器即可）后，使用Hopper打开生成的可执行文件，找到这个 test_available，如图：

![](/media/15604434575850.jpg)

看下反编译的代码：
![](/media/15604436909250.jpg)

可知调用了 `___isOSVersionAtLeast` 这个函数，`0xb`就是`iOS 11`，估计后面两个`0x0`就是第二位和第三位版本了。

然后Hopper找到这个函数，

![](/media/15604441390827.jpg)

一眼看去，猜测大概就是`dispatch_once`里获取了当前系统的版本，然后赋值给`_GlobalMajor`、`_GlobalMinor`和`_GlobalSubminor`三个全局变量。

那么`dispatch_once`里是怎么获取的系统版本呢？Hopper的反汇编出的伪代码似乎看不出`block`中执行了什么了。切换到汇编代码视图，可见：

![](/media/15604447370360.jpg)


这里调用了 `_parseSystemVersionPList`函数，继续看这个函数：
![](/media/15604448185191.jpg)

![](/media/15604451451816.jpg)


![](/media/15604449285315.jpg)


看到有对这个文件的操作`/System/Library/CoreServices/SystemVersion.plist`，而且有个`fopen`。那我们运行Xcode，断点到这个fopen。

![](/media/15604452404549.jpg)

这个文件路径如下：

```
/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/CoreSimulator/Profiles/Runtimes/iOS.simruntime/Contents/Resources/RuntimeRoot/System/Library/CoreServices/SystemVersion.plist
```

我们打开看看，

![](/media/15604453014853.jpg)

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

![](/media/15604461673229.jpg)

还搜到了创建函数的代码，

![](/media/15604462205628.jpg)


具体我对llvm也不是太熟，就不细说了（也说不出来哈），感兴趣自行搜索啦。


## 再总结

了解了这个本质，以后用起来就更自信了。很有趣。

---

欢迎订阅 :)

![](/images/fun.jpg)




