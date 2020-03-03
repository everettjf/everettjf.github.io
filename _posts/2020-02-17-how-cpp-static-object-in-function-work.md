---
layout: post
title: "探索系列: 函数中的C++静态变量是线程安全吗？"
categories:
  - cpp
tags:
  - cpp
  - threadsafe
  - local-object
comments: true
---


先说结论，是线程安全，而且有double-checked locking，性能还不错。


<!-- more -->

## 探索

通常写C++ Singleton模式时，会很流畅的写下如下代码：

```
class Hello {
public:
    static Hello & instance() {
        static Hello obj;
        return obj;
    }
    
    Hello() {
        printf("constructor");
    }
    ~Hello() {
        printf("destructor");
    }
    
public:
    int x = 0;
};
```

那么当使用 `Hello::instance()` 时，是线程安全吗？ Hello 的构造函数能确保执行一次吗？

把代码扔到 Hopper 看一下

![-w1201](/media/15819530050437.jpg)


看来是有锁。那就是线程安全咯 :)

## 进一步

看到这几个方法

```
__cxa_guard_acquire
__cxa_atexit
__cxa_guard_release
```


`__cxa_atexit` 可以是为了在进程结束时调用析构函数。

一番搜索可以找到这个源码 `cxa_guard.cxx`

https://opensource.apple.com/source/libcppabi/libcppabi-14/src/cxa_guard.cxx

![-w609](/media/15819532682759.jpg)


通过obj_guard 实现了一个double-checked locking

![-w647](/media/15819533607278.jpg)

inUse会通过obj_guard指向内存的第一个地址存取0和1，实现第一次check。

Hopper中找到这个obj_guard

![](/media/15819535672052.jpg)


![-w705](/media/15819535936394.jpg)

这个guard variable 是个全局变量。


---

## 总结

以后可以愉快的使用这个写法了

```
    static Hello & instance() {
        static Hello obj;
        return obj;
    }
```

## 交流群

是的，我又创建交流群了～一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。如果群满了，加我微信 everettjf，备注：加群。

![](/media/15817739945151.jpg)


广告时间到。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`抖音iOS App的业务、性能、稳定性等方方面面`的开发。`入职后的方向看你的兴趣`。

如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)