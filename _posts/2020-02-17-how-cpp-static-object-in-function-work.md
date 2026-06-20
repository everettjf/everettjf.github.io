---
layout: post
title: "Is C++ Static Variable Initialization Inside a Function Thread-Safe?"
title_zh: "函数中的 C++ 静态变量初始化是线程安全的吗？"
lang_original: zh
categories:
  - cpp
tags:
  - cpp
  - threadsafe
  - local-object
comments: true
---


Conclusion first: yes, it's thread-safe, and it even uses double-checked locking, so performance is pretty good.


<!-- more -->

## Exploration

When writing the C++ Singleton pattern, you'll usually just smoothly write code like this:

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

So when you call `Hello::instance()`, is it thread-safe? Can the constructor of Hello be guaranteed to run exactly once?

Let's throw the code into Hopper and take a look.

![-w1201](/media/15819530050437.jpg){:width="1600" height="237"}


Looks like there's a lock. So it's thread-safe :)

## Going Further

Notice these few methods:

```
__cxa_guard_acquire
__cxa_atexit
__cxa_guard_release
```


`__cxa_atexit` is likely there to call the destructor when the process exits.

After some searching, you can find this source file `cxa_guard.cxx`:

https://opensource.apple.com/source/libcppabi/libcppabi-14/src/cxa_guard.cxx

![-w609](/media/15819532682759.jpg){:width="1218" height="740"}


It implements a double-checked locking via obj_guard.

![-w647](/media/15819533607278.jpg){:width="1294" height="956"}

inUse stores 0 and 1 in the first address pointed to by obj_guard, implementing the first check.

Found this obj_guard in Hopper:

![](/media/15819535672052.jpg){:width="1600" height="786"}


![-w705](/media/15819535936394.jpg){:width="1410" height="462"}

This guard variable is a global variable.


---

## Summary

From now on you can happily use this pattern:

```
    static Hello & instance() {
        static Hello obj;
        return obj;
    }
```

---

If you like it, follow the official account to show your support:

![](/images/fun.png)

<!--ZH-->



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

![-w1201](/media/15819530050437.jpg){:width="1600" height="237"}


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

![-w609](/media/15819532682759.jpg){:width="1218" height="740"}


通过obj_guard 实现了一个double-checked locking

![-w647](/media/15819533607278.jpg){:width="1294" height="956"}

inUse会通过obj_guard指向内存的第一个地址存取0和1，实现第一次check。

Hopper中找到这个obj_guard

![](/media/15819535672052.jpg){:width="1600" height="786"}


![-w705](/media/15819535936394.jpg){:width="1410" height="462"}

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

---

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)