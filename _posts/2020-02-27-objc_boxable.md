---
layout: post
title: "objc_boxable"
categories:
  - discovery
tags:
  - objc
comments: true
---


看头文件发现个 objc_boxable

![](/media/15828726952733.jpg)


<!-- more -->

## 用法

objc_boxable可以让c struct使用 Objective-C Literals 包装成 NSValue。包装成Objc的类型，例如可以放到 NSArray、NSDictionary中了。详见：
https://clang.llvm.org/docs/ObjectiveCLiterals.html

> Boxed expressions support construction of NSValue objects. It said that C structures can be used, the only requirement is: structure should be marked with objc_boxable attribute. To support older version of frameworks and/or third-party libraries you may need to add the attribute via typedef.

例如：

```
typedef struct __attribute__((objc_boxable)) _MySize {
    int width, height;
} MySize;

MySize size1 = { .width = 1, .height = 2};
NSValue *value1 = @(size1);
NSLog(@"value1 = %@", value1);
```


## 实现


把代码放入Hopper，原来 `@(size1)` 就是转换成了 `+[NSValue valueWithBytes:objCType:]`的调用。

![](/media/15828737306649.jpg)


从clang代码中也能搜到如何转换的调用，
https://github.com/llvm-mirror/clang/blob/38c1f7c254e6e699d3e45e446fa4515418a00c9a/lib/Sema/SemaExprObjC.cpp

![](/media/15828742795007.jpg)


## 其他

从这里又发现一堆
https://github.com/llvm-mirror/clang/blob/653a638f94e456b8ad5d979fba814d6e3708f950/tools/libclang/CIndex.cpp

![](/media/15828743188926.jpg)


以及

https://clang.llvm.org/docs/AttributeReference.html

![](/media/15828743551669.jpg)




---


大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.jpg)