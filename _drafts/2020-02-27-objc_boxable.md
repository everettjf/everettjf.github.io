---
layout: post
title: "探索系列: objc_boxable"
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

看起来这样可以写一年了。。



---

广告时间到。

一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流，当然群内也可以发一些招聘广告。群内已经有200多位盆友，已经不能扫码加了。如需加入，加我微信 everettjf，备注：加群。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`抖音iOS App的业务、性能、稳定性等方方面面`的开发。`入职后的方向看你的兴趣`。

如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)