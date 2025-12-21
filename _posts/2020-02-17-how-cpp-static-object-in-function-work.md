---
layout: post
title: "Are C++ Static Variables in Functions Thread Safe?"
categories:
  - cpp
tags:
  - cpp
  - threadsafe
  - local-object
comments: true
---


First conclusion, is thread safe, and has double-checked locking, performance quite good.


<!-- more -->

## Exploration

Usually when writing C++ Singleton pattern, will smoothly write code below:

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

Then when using `Hello::instance()`, is thread safe? Can Hello's constructor ensure executing once?

Throw code into Hopper to see

![-w1201](/media/15819530050437.jpg)


Looks like has lock. Then is thread safe :)

## Further

See these methods

```
__cxa_guard_acquire
__cxa_atexit
__cxa_guard_release
```


`__cxa_atexit` can be to call destructor when process ends.

After searching can find this source code `cxa_guard.cxx`

https://opensource.apple.com/source/libcppabi/libcppabi-14/src/cxa_guard.cxx

![-w609](/media/15819532682759.jpg)


Through obj_guard implements a double-checked locking

![-w647](/media/15819533607278.jpg)

inUse will through obj_guard point to memory's first address access 0 and 1, implement first check.

Find this obj_guard in Hopper

![](/media/15819535672052.jpg)


![-w705](/media/15819535936394.jpg)

This guard variable is a global variable.


---

## Summary

In future can happily use this writing

```
    static Hello & instance() {
        static Hello obj;
        return obj;
    }
```

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
