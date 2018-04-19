---
layout: post
title: "一种 hook objective c +load 的方法"
categories:
  - Skill
tags:
  - hook
  - performance
comments: true
---



iOS有以下四种方法可方便的在premain阶段执行代码：

```
1. Objective C类的+load方法
2. C++ static initializer
3. C/C++ __attribute__(constructor) functions 
4. 动态库中的上面三种方法
```
<!-- more -->


所有类的+load方法是在main函数之前、在主线程，以串行方式调用。
因此，任何一个+load方法的耗时大小将直接影响到App的启动耗时。

# 先看Objective C Runtime

```
/***********************************************************************
* call_class_loads
* Call all pending class +load methods.
* If new classes become loadable, +load is NOT called for them.
*
* Called only by call_load_methods().
**********************************************************************/
static void call_class_loads(void)
{
    int i;
    
    // Detach current loadable list.
    struct loadable_class *classes = loadable_classes;
    int used = loadable_classes_used;
    loadable_classes = nil;
    loadable_classes_allocated = 0;
    loadable_classes_used = 0;
    
    // Call all +loads for the detached list.
    for (i = 0; i < used; i++) {
        Class cls = classes[i].cls;
        load_method_t load_method = (load_method_t)classes[i].method;
        if (!cls) continue; 

        if (PrintLoading) {
            _objc_inform("LOAD: +[%s load]\n", cls->nameForLogging());
        }
        (*load_method)(cls, SEL_load);
    }
    
    // Destroy the detached list.
    if (classes) free(classes);
}


```

直接通过遍历loadable_classes全局变量，逐个调用。

全局变量的定义如下：

```

// List of classes that need +load called (pending superclass +load)
// This list always has superclasses first because of the way it is constructed
static struct loadable_class *loadable_classes = nil;
static int loadable_classes_used = 0;
static int loadable_classes_allocated = 0;

```


# 再看下文档

```
The order of initialization is as follows:
- All initializers in any framework you link to.
- All +load methods in your image.
- All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
- All initializers in frameworks that link to you.
```

# 如何hook

由于+load方法调用时机已经很早，早于 C++ static initializer等，但晚于framework（动态库），那我们就可以把hook的代码写到动态库中，也就可以做到在主程序的 loadable_classes 全局变量初始化之前就把+load hook掉。


# 代码

创建一个动态库，使用CaptainHook （<https://github.com/rpetrich/CaptainHook> ，只有一个头文件，使用也很简单）。


```
#import "CaptainHook.h"


CHDeclareClass(MyClass);
CHClassMethod0(void, MyClass, load){
    CFTimeInterval start = CFAbsoluteTimeGetCurrent();
    
    CHSuper0(MyClass,load);
    
    CFTimeInterval end = CFAbsoluteTimeGetCurrent();
    // output: end - start
}

__attribute__((constructor)) static void entry(){
    NSLog(@"dylib loaded");
    
    CHLoadLateClass(MyClass);
    CHHook0(MyClass, load);
}
```

这样，把这个动态库链接到App主程序，就可以hook主程序中的 MyClass类的+load方法了。

# 如何列出程序所有+load方法

知道了如何Hook，但如何列出所有+load方法呢，代码中搜索太麻烦，那就通过Runtime获取：


```

int numClasses;
Class * classes = NULL;
    
classes = NULL;
numClasses = objc_getClassList(NULL, 0);
    
if (numClasses > 0 )
{
   classes = (Class*)malloc(sizeof(Class) * numClasses);
   numClasses = objc_getClassList(classes, numClasses);
   
   for(int idx = 0; idx < numClasses; ++idx){
       Class cls = *(classes + idx);
       
       const char *className = object_getClassName(cls);
       Class metaCls = objc_getMetaClass(className);
       
       BOOL hasLoad = NO;
       unsigned int methodCount = 0;
       Method *methods = class_copyMethodList(metaCls, & methodCount);
       if(methods){
           for(int j = 0; j < methodCount; ++j){
               Method method = *(methods + j);
               SEL name = method_getName(method);
               NSString *methodName = NSStringFromSelector(name);
               if([methodName isEqualToString:@"load"]){
                   hasLoad = YES;
                   break;
               }
           }
       }
       
       if(hasLoad){
           NSLog(@"has load : %@", NSStringFromClass(cls));
       }else{
//                NSLog(@"not has load : %@", NSStringFromClass(cls));
       }
   }
   
   free(classes);
}

```


# 遗漏

经过测试发现，如果一个类存在Category，则上面的方法只能hook Category中的+load，多个Category也只能hook一个。还需要研究下如何hook所有的。


# TimeProfiler

通过TimeProfiler我们也可以进行分析，但经验告诉我们，日常使用中，用户启动App时，耗时经常存在“浮动”，如何把这些“浮动”的代码找出来，就可以用这个方法了。（当然这种hook本身也对性能有影响，个人或者小范围使用，肯定不要发布的。）


# 总结

这是一种逐个hook较麻烦的方法，一定有更简单的方法，抽时间研究。













