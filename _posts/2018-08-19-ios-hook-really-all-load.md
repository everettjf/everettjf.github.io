---
layout: post
title: "Hook All +load Methods (Including Category)"
categories:
  - Reverse Engineering
tags:
  - hook
  - reverse-engineering
  - iOS
  - runtime
  - method-swizzling

comments: true
---

This article is for learning reference only, but method introduced has poor performance. Recommend using <https://github.com/huakucha/TTAnalyzeLoadTime> , this has better performance.

---

About two years ago just started performance optimization work, to Hook all +load methods, used Hopper to first list all +load, then used CaptainHook in dynamic library to specify class names one by one to Hook each +load method. Wrote an article, published to internal network (ATA) and blog, blog article address: <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/> .

This method has two drawbacks:
1. Need to first statically analyze (using Hopper) to see all +load methods, or use objc runtime method to get all class names containing +load methods. Very troublesome.
2. For +load methods in Category, no way to Hook.

At the time also realized these two drawbacks, but due to time constraints it was sufficient.

Two years later, want to fulfill this wish. This article fixes these two drawbacks, implements: Hook all +load methods, including +load methods implemented in Category.

<!-- more -->

# Goal

Assume App contains two automatically linked dynamic libraries, files as below:

![](/media/15346134342627.jpg)

![](/media/15346134592061.jpg)

Our goal is to hook all Objective C +load methods in these three MachO files, and count time consumption, print out.

# Add Dynamic Library

To make our Hook code load earlier than these two dynamic libraries, we need to add a dynamic library LoadRuler.dylib, link order is important, need to link LoadRuler first (App startup will also first load, and first execute macho's +load methods).

![](/media/15346136993280.jpg)
![](/media/15346137538461.jpg)

# Get All machos of Our Own App

First get all loaded machos can do:

```
static void AppendAllImagePaths(std::vector<std::string> & image_paths){
    uint32_t imageCount = _dyld_image_count();
    for(uint32_t imageIndex = 0; imageIndex < imageCount; ++imageIndex){
        const char * path = _dyld_get_image_name(imageIndex);
        image_paths.push_back(std::string(path));
    }
}
```

Then can distinguish all machos in our App (dynamic libraries and executable main binary) based on path

```
static void AppendProductImagePaths(std::vector<std::string> & product_image_paths){
    NSString *mainBundlePath = [NSBundle mainBundle].bundlePath;
    std::vector<std::string> all_image_paths;
    AppendAllImagePaths(all_image_paths);
    for(auto path: all_image_paths){
        NSString *imagePath = [NSString stringWithUTF8String:path.c_str()];
        if([imagePath containsString:mainBundlePath] ||[imagePath containsString:@"Build/Products/"]){
            product_image_paths.push_back(path);
        }
    }
}
```

Among them `Build/Products/` is to adapt development mode, for example, under project configuration in figure above FirstDylib's directory is at

```
/Users/everettjf/Library/Developer/Xcode/DerivedData/LoadCostSample-amfsvwltyimldeaxbquwejweulqd/Build/Products/Debug-iphonesimulator/FirstDylib.framework/FirstDylib
```

To filter out this situation, here simply matched through `Build/Products` (didn't use DerivedData considering DerivedData directory is modifiable in Xcode settings)

# Get All Classes


```
        unsigned int classCount = 0;
        const char ** classNames = objc_copyClassNamesForImage(path.c_str(),&classCount);

        for(unsigned int classIndex = 0; classIndex < classCount; ++classIndex){
            NSString *className = [NSString stringWithUTF8String:classNames[classIndex]];
            Class cls = object_getClass(NSClassFromString(className));
```


# Key Code

```

@interface LoadRuler : NSObject
@end
@implementation LoadRuler


+(void)LoadRulerSwizzledLoad0{
    LoadRulerBegin;
    [self LoadRulerSwizzledLoad0];
    LoadRulerEnd;
}

+(void)LoadRulerSwizzledLoad1{
    LoadRulerBegin;
    [self LoadRulerSwizzledLoad1];
    LoadRulerEnd;
}
+(void)LoadRulerSwizzledLoad2{
    LoadRulerBegin;
    [self LoadRulerSwizzledLoad2];
    LoadRulerEnd;
}
+(void)LoadRulerSwizzledLoad3{
    LoadRulerBegin;
    [self LoadRulerSwizzledLoad3];
    LoadRulerEnd;
}
+(void)LoadRulerSwizzledLoad4{
    LoadRulerBegin;
    [self LoadRulerSwizzledLoad4];
    LoadRulerEnd;
}

+(void)load{
    PrintAllImagePaths();
    
    
    SEL originalSelector = @selector(load);
    Class rulerClass = [LoadRuler class];
    
    std::vector<std::string> product_image_paths;
    AppendProductImagePaths(product_image_paths);
    for(auto path : product_image_paths){
        unsigned int classCount = 0;
        const char ** classNames = objc_copyClassNamesForImage(path.c_str(),&classCount);

        for(unsigned int classIndex = 0; classIndex < classCount; ++classIndex){
            NSString *className = [NSString stringWithUTF8String:classNames[classIndex]];
            Class cls = object_getClass(NSClassFromString(className));
            
            // Don't hook ourselves
            if(cls == [self class]){
                continue;
            }

            unsigned int methodCount = 0;
            Method * methods = class_copyMethodList(cls, &methodCount);
            NSUInteger currentLoadIndex = 0;
            for(unsigned int methodIndex = 0; methodIndex < methodCount; ++methodIndex){
                Method method = methods[methodIndex];
                std::string methodName(sel_getName(method_getName(method)));

                if(methodName == "load"){
                    SEL swizzledSelector = NSSelectorFromString([NSString stringWithFormat:@"LoadRulerSwizzledLoad%@",@(currentLoadIndex)]);
                    
                    Method originalMethod = method;
                    Method swizzledMethod = class_getClassMethod(rulerClass, swizzledSelector);
                    
                    BOOL addSuccess = class_addMethod(cls, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
                    // Add success, means load doesn't exist. But dynamically added load, won't be called. Related to load's calling method.
                    if(!addSuccess){
                        // Already exists, then add new selector
                        BOOL didAddSuccess = class_addMethod(cls, swizzledSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
                        if(didAddSuccess){
                            // Then exchange
                            swizzledMethod = class_getClassMethod(cls, swizzledSelector);
                            method_exchangeImplementations(originalMethod, swizzledMethod);
                        }
                    }
                    
                    ++currentLoadIndex;
                }
            }
        }
    }
}

@end
```


# Category Handling

In project FirstLoader's class and several Categories are like this
```
@implementation FirstLoader

+ (void)load{
    NSLog(@"first +load");
    usleep(1000 * 15);
}
@end
@implementation FirstLoader (FirstCategory)

+(void)load{
    NSLog(@"first category +load for FirstLoader");
    usleep(1000 * 45);
}

@end
@implementation  FirstLoader (SecondCategory)

+ (void)load{
    NSLog(@"second category +load for FirstLoader");
    usleep(1000 * 55);
}

@end
```

In Hopper seeing +load in Category, final symbol doesn't show.

![](/media/15346144105739.jpg)


To hook all loads in a class and corresponding Categories, code above uses `class_copyMethodList` to get all class methods, then replace one by one.

Finally for code implementation simplicity, created LoadRulerSwizzledLoad0 1 2 3 4 such methods, adapt N Category situations.


# Project Code

Complete project and code here <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/LoadCostSample/LoadRuler/LoadRuler/LoadRuler.mm>

Code initial writing referenced Jiale's code <https://github.com/joy0304/Joy-Demo/blob/master/HookLoad/LDAPMLoadMonitor.m>, but Jiale's code didn't handle Category situations.


# Summary

Two years, passed in a blink, but right and wrong, still vivid. One thought starts thousands of mountains and rivers, one thought ends vast sea and fields. Forge ahead, young one.

Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

# Addition

*Colleague informed hooking all +load has better performance method, but not convenient to make public. Ha.*

