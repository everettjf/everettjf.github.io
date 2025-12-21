---
layout: post
title: "Hook Objective C +load"
categories:
  - Skill
tags:
  - hook
  - performance
comments: true
---



iOS has the following four methods to conveniently execute code in premain stage:

```
1. Objective C class's +load method
2. C++ static initializer
3. C/C++ __attribute__(constructor) functions 
4. The above three methods in dynamic libraries
```
<!-- more -->


All classes' +load methods are called before main function, on main thread, in serial manner.
Therefore, any +load method's execution time will directly affect App's startup time.

# First Look at Objective C Runtime

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

Directly iterates through loadable_classes global variable, calls one by one.

Global variable definition:

```

// List of classes that need +load called (pending superclass +load)
// This list always has superclasses first because of the way it is constructed
static struct loadable_class *loadable_classes = nil;
static int loadable_classes_used = 0;
static int loadable_classes_allocated = 0;

```


# Look at Documentation

```
The order of initialization is as follows:
- All initializers in any framework you link to.
- All +load methods in your image.
- All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
- All initializers in frameworks that link to you.
```

# How to Hook

Since +load method call timing is already very early, earlier than C++ static initializer, etc., but later than frameworks (dynamic libraries), we can write hook code in dynamic library, can hook +load before main program's loadable_classes global variable is initialized.


# Code

Create a dynamic library, use CaptainHook (<https://github.com/rpetrich/CaptainHook> , only one header file, simple to use).


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

This way, linking this dynamic library to App main program, can hook main program's MyClass class's +load method.

# How to List All +load Methods

Know how to Hook, but how to list all +load methods? Searching code is too troublesome, so get through Runtime:


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


# Omission

After testing found, if a class has Category, above method can only hook Category's +load, multiple Categories can only hook one. Still need to research how to hook all.


# TimeProfiler

Through TimeProfiler we can also analyze, but experience tells us, in daily use, user App startup time often has "fluctuation", how to find these "fluctuating" code, can use this method. (Of course this hook itself also has performance impact, personal or small scope use, definitely don't release.)


# Summary

This is a method of hooking one by one which is troublesome, there must be simpler methods, will research when there's time.




