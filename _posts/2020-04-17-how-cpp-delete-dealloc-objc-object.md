---
layout: post
title: "C++类中的ObjC对象什么时候dealloc"
categories:
  - 探索
tags:
  - objc
  - dealloc
comments: true
---

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

![](/media/15871350384682.jpg)

可知，MyObject确实dealloc了。

那么，断点到dealloc，看看怎么调用到的。

![](/media/15871351008102.jpg)

看到上图有两个 `~CppStruct()`，其中一个调用了 `objc_storeStrong`，objc_storeStrong 进一步触发了MyObject的dealloc。

![](/media/15871352168452.jpg)

从上图可知，一定是编译器生成了objc_storeStrong调用的代码。

![](/media/15871352826095.jpg)

看下Disassembly，确实生成了objc_storeStrong调用代码。
![](/media/15871353987126.jpg)

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

