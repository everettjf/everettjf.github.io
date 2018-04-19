---
layout: post
title: "一种延迟 premain code 的方法"
categories:
  - Skill
tags:
  - FBInjectable
  - performance
comments: true
---




下面三种方法可以让代码在main函数之前执行：

1. All +load methods
2. All C++ static initializers 
3. All C/C++ __attribute__(constructor) functions


# main函数之前执行的问题

1. 无法Patch
2. 不能审计耗时
3. 调用UIKit相关方法会导致部分类提早初始化
4. 主线程执行，完全阻塞式执行


<!-- more -->

# 如何解决这些问题

能否提供一种便捷的方法把main函数之前的代码移植到main函数之后。

## 想法来源

发现 Facebook 有个新增的段 FBInjectable ，学习这个段的含义可以知道：可以在编译及链接时期把一些数据放到自定义段中，然后程序中获取段的数据。

如果这个数据是字符串，我们可以通过字符串获取类名；如果是函数地址，我们可以直接调用。

（关于 Facebook 的段 FBInjectable 的含义，可以参考文章 <https://everettjf.github.io/2016/08/20/facebook-explore-section-fbinjectable> ）

那么如何创建FBInjectable段呢？

可以使用 __attribute((used,section("segmentname,sectionname"))) 关键字把某个变量的放入特殊的section中。

（attribute 参考 <http://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Variable-Attributes.html> ）

例如：

```
char * kString1 __attribute((used,section("__DATA,FBInjectable"))) = "string 1";
char * kString2 __attribute((used,section("__DATA,FBInjectable"))) = "string 2";
char * kString3 __attribute((used,section("__DATA,FBInjectable"))) = "string 3";
```

编译后，可以在程序的 DATA segment下新建 FBInjectable section，并把kString1,kString2,kString3 三个变量的地址作为 FBInjectable section 内容。

## 如何应用

模仿Facebook的代码，下面这段代码可以把函数地址（varSampleObject的值）的地址放到QWLoadable段中。

```
typedef void (*QWLoadableFunctionTemplate)();
static void QWLoadableSampleFunction(){
    // Do something
}
static QWLoadableFunctionTemplate varSampleObject __attribute((used, section("__DATA,QWLoadable"))) = QWLoadableSampleFunction;
```

然后主程序在启动时通过getsectiondata获取到QWLoadable的内容，并逐个调用。

## 进一步完善

为了能标记每个函数的名字，可以让函数内部传出，如下：

```
typedef int (*QWLoadableFunctionCallback)(const char *);
typedef void (*QWLoadableFunctionTemplate)(QWLoadableFunctionCallback);

static void QWLoadableSampleFunction(QWLoadableFunctionCallback QWLoadableCallback){
    if(0 != QWLoadableCallback("SampleObject")) return;

    // Do something
}

static QWLoadableFunctionTemplate varSampleObject __attribute((used, section("__DATA,QWLoadable"))) = QWLoadableSampleFunction;

```

这样函数通过 QWLoadableCallback 告诉外部自己的“标识”，并给予外部过滤自己（不调用）的能力。


## 启动时调用

```

static int QWLoadableFunctionCallbackImpl(const char *name){
    // filter by name
    return 0;
}

static void QWLoadableRun(){
    CFTimeInterval loadStart = CFAbsoluteTimeGetCurrent();
    
    Dl_info info;
    int ret = dladdr(QWLoadableRun, &info);
    if(ret == 0){
        // fatal error
    }
    
#ifndef __LP64__
    const struct mach_header *mhp = (struct mach_header*)info.dli_fbase;
    unsigned long size = 0;
    uint32_t *memory = (uint32_t*)getsectiondata(mhp, QWLoadableSegmentName, QWLoadableSectionName, & size);
#else /* defined(__LP64__) */
    const struct mach_header_64 *mhp = (struct mach_header_64*)info.dli_fbase;
    unsigned long size = 0;
    uint64_t *memory = (uint64_t*)getsectiondata(mhp, QWLoadableSegmentName, QWLoadableSectionName, & size);
#endif /* defined(__LP64__) */
    
    CFTimeInterval loadComplete = CFAbsoluteTimeGetCurrent();
    NSLog(@"QWLoadable:loadcost:%@ms",@(1000.0*(loadComplete-loadStart)));
    if(size == 0){
        NSLog(@"QWLoadable:empty");
        return;
    }
    
    for(int idx = 0; idx < size/sizeof(void*); ++idx){
        QWLoadableFunctionTemplate func = (QWLoadableFunctionTemplate)memory[idx];
        func(QWLoadableFunctionCallbackImpl);
    }
    
    NSLog(@"QWLoadable:callcost:%@ms",@(1000.0*(CFAbsoluteTimeGetCurrent()-loadComplete)));
}
```

## 改造

调用方可以像下面这样，把原来在+load中的代码移植到两个宏（QWLoadableFunctionBegin 和 QWLoadableFunctionEnd）之间。

```
QWLoadableFunctionBegin(FooObject)
[BarObject userDefinedLoad];
// anything here
QWLoadableFunctionEnd(FooObject)
```


# 动态库

动态库是独立的个体，所以需要单独处理动态库中的QWLoadable的段。


# 性能

把+load等main函数之前的代码移植到了main函数之后，但也新增了一个读取section的耗时。

经过测试，100个函数地址的读取，在iPhone5的设备上读取不到1ms。新增了这不到1ms的耗时（这1ms也是可审计的），带来了所有启动阶段行为的可审计，以及最重要的Patch能力。

# 参考代码

<https://github.com/everettjf/Yolo/tree/master/LoadableMacro>


