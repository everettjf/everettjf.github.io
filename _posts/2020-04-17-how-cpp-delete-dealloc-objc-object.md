---
layout: post
title: "When Does an Objective-C Object Held by a C++ Class Get dealloc'd?"
title_zh: "C++ 类中持有的 Objective-C 对象何时 dealloc"
lang_original: zh
categories:
  - 探索
tags:
  - objc
  - dealloc
comments: true
---

When using Objective-C++, you can store Objective-C objects in a C++ struct or class.


<!-- more -->


For example:

```
struct CppStruct {
    MyObject *obj;
};
```

So I suddenly wondered: if CppStruct is destructed, will MyObject be dealloc'd? No need to overthink it — of course it will. But how is that achieved?

Let's write some code to verify it:

```

@interface MyObject : NSObject
@end
@implementation MyObject
- (instancetype)init {
    self = [super init];
    if (self) {
        NSLog(@"MyObject init");
    }
    return self;
}
- (void)dealloc {
    NSLog(@"MyObject dealloc");
}
@end

struct CppStruct {
    MyObject *obj;
    CppStruct() {
        NSLog(@"CppStruct constructor");
    }
    ~CppStruct() {
        NSLog(@"CppStruct destructor");
    }
};

CppStruct * CreateStruct() {
    CppStruct * s = new CppStruct();
    s->obj = [[MyObject alloc] init];
    return s;
}

void FreeStruct(CppStruct *s) {
    delete s;
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        CppStruct *s = CreateStruct();
        FreeStruct(s);
    }
    return 0;
}
```

It produces the following output:

![](/media/15871350384682.jpg){:width="292" height="87"}

As you can see, MyObject indeed got dealloc'd.

So, let's set a breakpoint on dealloc and see how it gets called.

![](/media/15871351008102.jpg){:width="331" height="289"}

In the image above there are two `~CppStruct()`, one of which calls `objc_storeStrong`, and objc_storeStrong in turn triggers MyObject's dealloc.

![](/media/15871352168452.jpg){:width="721" height="266"}

From the image above, it must be the compiler that generated the code calling objc_storeStrong.

![](/media/15871352826095.jpg){:width="753" height="310"}

Looking at the Disassembly, it indeed generated the objc_storeStrong call code.
![](/media/15871353987126.jpg){:width="289" height="103"}

Solid confirmation.

As for how LLVM generates this logic — I won't dig into that here.

## References

The debugging above used a compilable objc runtime. There are many on GitHub; you can just search for the corresponding objc version like this:

https://github.com/search?q=objc+779.1
https://github.com/LGCooci/objc4_debug


## Summary

From now on you can boldly use C++ structs to store Objective-C objects.


---


Pretty interesting :)

---

If you like it, follow the official account to show your support:

![](/images/fun.png)

<!--ZH-->


在使用Objective C++时，可以用C++的struct或者class存储Objective C对象。


<!-- more -->


例如：

```
struct CppStruct {
    MyObject *obj;
};
```

那么突然想，如果CppStruct析构了，MyObject会dealloc吗？不用多想，肯定也会。但如何做到的呢？

写段代码验证下，

```

@interface MyObject : NSObject
@end
@implementation MyObject
- (instancetype)init {
    self = [super init];
    if (self) {
        NSLog(@"MyObject init");
    }
    return self;
}
- (void)dealloc {
    NSLog(@"MyObject dealloc");
}
@end

struct CppStruct {
    MyObject *obj;
    CppStruct() {
        NSLog(@"CppStruct constructor");
    }
    ~CppStruct() {
        NSLog(@"CppStruct destructor");
    }
};

CppStruct * CreateStruct() {
    CppStruct * s = new CppStruct();
    s->obj = [[MyObject alloc] init];
    return s;
}

void FreeStruct(CppStruct *s) {
    delete s;
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        CppStruct *s = CreateStruct();
        FreeStruct(s);
    }
    return 0;
}
```

如下输出

![](/media/15871350384682.jpg){:width="292" height="87"}

可知，MyObject确实dealloc了。

那么，断点到dealloc，看看怎么调用到的。

![](/media/15871351008102.jpg){:width="331" height="289"}

看到上图有两个 `~CppStruct()`，其中一个调用了 `objc_storeStrong`，objc_storeStrong 进一步触发了MyObject的dealloc。

![](/media/15871352168452.jpg){:width="721" height="266"}

从上图可知，一定是编译器生成了objc_storeStrong调用的代码。

![](/media/15871352826095.jpg){:width="753" height="310"}

看下Disassembly，确实生成了objc_storeStrong调用代码。
![](/media/15871353987126.jpg){:width="289" height="103"}

进一步实锤。

LLVM 怎么去生成的这个逻辑，就不去翻了哈。

## 参考

上面调试中用了可编译的objc runtime，GitHub上有很多，可以如下搜索对应objc版本即可：

https://github.com/search?q=objc+779.1
https://github.com/LGCooci/objc4_debug


## 总结

以后可以大胆的用C++ struct 存储Objective C对象了。


---


很有趣 :)

---

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)

