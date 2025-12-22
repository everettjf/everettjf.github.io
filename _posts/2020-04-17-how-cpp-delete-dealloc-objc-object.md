---
layout: post
title: "When Does ObjC Object in C++ Class dealloc"
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---

When using Objective C++, can use C++'s struct or class to store Objective C objects.


<!-- more -->


For example:

```
struct CppStruct {
    MyObject *obj;
};
```

Then suddenly think, if CppStruct destructs, will MyObject dealloc? Don't need to think much, definitely will. But how is it done?

Write code to verify,

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

Output below

![](/media/15871350384682.jpg)

Can know, MyObject indeed dealloced.

Then, breakpoint at dealloc, see how called.

![](/media/15871351008102.jpg)

See figure above has two `~CppStruct()`, one called `objc_storeStrong`, objc_storeStrong further triggered MyObject's dealloc.

![](/media/15871352168452.jpg)

From figure above can know, compiler must generated objc_storeStrong call code.

![](/media/15871352826095.jpg)

Look at Disassembly, indeed generated objc_storeStrong call code.
![](/media/15871353987126.jpg)

Further confirmed.

How LLVM generates this logic, won't search ha.

## References

Above debugging used compilable objc runtime, GitHub has many, can search corresponding objc version:

https://github.com/search?q=objc+779.1
https://github.com/LGCooci/objc4_debug


## Summary

In future can boldly use C++ struct to store Objective C objects.


---


Very interesting :)

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
