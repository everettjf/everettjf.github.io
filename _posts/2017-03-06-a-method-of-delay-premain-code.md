---
layout: post
title: "Delay premain Code"
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---




The following three methods can make code execute before main function:

1. All +load methods
2. All C++ static initializers 
3. All C/C++ __attribute__(constructor) functions


# Problems with Code Executing Before main Function

1. Cannot Patch
2. Cannot audit time consumption
3. Calling UIKit related methods causes some classes to initialize early
4. Executes on main thread, completely blocking execution


<!-- more -->

# How to Solve These Problems

Can we provide a convenient method to migrate code before main function to after main function.

## Idea Source

Found Facebook has a new segment FBInjectable, learning this segment's meaning can know: can put some data into custom segment at compile and link time, then program gets segment's data.

If this data is string, we can get class name through string; if function address, we can directly call.

(About Facebook's segment FBInjectable meaning, can reference article <https://everettjf.github.io/2016/08/20/facebook-explore-section-fbinjectable> )

Then how to create FBInjectable segment?

Can use __attribute((used,section("segmentname,sectionname"))) keyword to put a variable into special section.

(attribute reference <http://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Variable-Attributes.html> )

For example:

```
char * kString1 __attribute((used,section("__DATA,FBInjectable"))) = "string 1";
char * kString2 __attribute((used,section("__DATA,FBInjectable"))) = "string 2";
char * kString3 __attribute((used,section("__DATA,FBInjectable"))) = "string 3";
```

After compilation, can create FBInjectable section under program's DATA segment, and put kString1,kString2,kString3 three variables' addresses as FBInjectable section content.

## How to Apply

Imitating Facebook's code, code below can put function address (varSampleObject's value)'s address into QWLoadable segment.

```
typedef void (*QWLoadableFunctionTemplate)();
static void QWLoadableSampleFunction(){
    // Do something
}
static QWLoadableFunctionTemplate varSampleObject __attribute((used, section("__DATA,QWLoadable"))) = QWLoadableSampleFunction;
```

Then main program at startup gets QWLoadable's content through getsectiondata, and calls one by one.

## Further Improvement

To mark each function's name, can let function internally pass out, as below:

```
typedef int (*QWLoadableFunctionCallback)(const char *);
typedef void (*QWLoadableFunctionTemplate)(QWLoadableFunctionCallback);

static void QWLoadableSampleFunction(QWLoadableFunctionCallback QWLoadableCallback){
    if(0 != QWLoadableCallback("SampleObject")) return;

    // Do something
}

static QWLoadableFunctionTemplate varSampleObject __attribute((used, section("__DATA,QWLoadable"))) = QWLoadableSampleFunction;

```

This way function tells external its "identifier" through QWLoadableCallback, and gives external ability to filter itself (not call).


## Call at Startup

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

## Refactoring

Caller can like below, migrate code originally in +load to between two macros (QWLoadableFunctionBegin and QWLoadableFunctionEnd).

```
QWLoadableFunctionBegin(FooObject)
[BarObject userDefinedLoad];
// anything here
QWLoadableFunctionEnd(FooObject)
```


# Dynamic Libraries

Dynamic libraries are independent entities, so need to separately handle QWLoadable segments in dynamic libraries.


# Performance

Migrated +load and other code before main function to after main function, but also added a time cost for reading section.

After testing, reading 100 function addresses, on iPhone5 device reads less than 1ms. Added this less than 1ms time cost (this 1ms is also auditable), brings auditability of all startup stage behaviors, and most importantly Patch capability.

# Reference Code

<https://github.com/everettjf/Yolo/tree/master/LoadableMacro>

