---
layout: post
title: "Hook All +load Methods (Including Categories)"
title_zh: "Hook 所有 +load 方法（包括 Category）"
lang_original: zh
categories:
  - 性能优化
tags:
  - 性能优化
  - load
  - category
comments: true
---

This article is for learning reference only, but the approach it describes has poor performance. I recommend using <https://github.com/huakucha/TTAnalyzeLoadTime>, which performs better.

---

About two years ago, when I first started doing performance optimization work, in order to hook all +load methods, I used Hopper to first list out all +load methods, then used CaptainHook in a dynamic library to specify each class name one by one to hook each +load method. I wrote an article that was published first internally (ATA) and then on my blog. The blog article URL is: <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/>.

This approach has two drawbacks:
1. You first need static analysis (using Hopper) to see all +load methods, or use the objc runtime methods to get all class names that contain +load methods. Very cumbersome.
2. There's no way to hook +load methods in Categories.

I was aware of these two drawbacks at the time, but due to time constraints it was good enough.

Two years later, I want to fulfill this wish. This article will address these two drawbacks and achieve: hooking all +load methods, including +load methods implemented in Categories.

<!-- more -->

# Goal

Suppose the app contains two auto-linked dynamic libraries, with files as follows:

![](/media/15346134342627.jpg){:width="222" height="71"}

![](/media/15346134592061.jpg){:width="402" height="224"}

Our goal is to hook all Objective-C +load methods in these three Mach-O files, measure the elapsed time, and print it out.

# Adding a New Dynamic Library

In order to make our hook code load earlier than these two dynamic libraries, we need to add a new dynamic library LoadRuler.dylib. The link order is very important — LoadRuler must be linked first (so when the app launches, it's also loaded first, and its Mach-O's +load methods execute first).

![](/media/15346136993280.jpg){:width="224" height="170"}
![](/media/15346137538461.jpg){:width="917" height="283"}

# Getting All Mach-O Files of Our Own App

First, to get all loaded Mach-O files, you can do this:

```
static void AppendAllImagePaths(std::vector<std::string> & image_paths){
    uint32_t imageCount = _dyld_image_count();
    for(uint32_t imageIndex = 0; imageIndex < imageCount; ++imageIndex){
        const char * path = _dyld_get_image_name(imageIndex);
        image_paths.push_back(std::string(path));
    }
}
```

Then, based on the paths, you can distinguish all Mach-O files belonging to our app (dynamic libraries and the main executable binary):

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

Here `Build/Products/` is for adapting to development mode. For example, under the project configuration in the image above, FirstDylib's directory is at

```
/Users/everettjf/Library/Developer/Xcode/DerivedData/LoadCostSample-amfsvwltyimldeaxbquwejweulqd/Build/Products/Debug-iphonesimulator/FirstDylib.framework/FirstDylib
```

To filter out this case, here I simply matched on `Build/Products` (I didn't use DerivedData because the DerivedData directory can be changed in Xcode's settings).

# Getting All Classes


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
                    // If adding succeeds, it means no load exists. But a dynamically added load won't be called — this relates to how load is invoked.
                    if(!addSuccess){
                        // Already exists, so add a new selector
                        BOOL didAddSuccess = class_addMethod(cls, swizzledSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
                        if(didAddSuccess){
                            // Then swap
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


# Handling Categories

The FirstLoader class and several of its Categories in the project look like this:
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

When looking at the +load in Categories in Hopper, the final symbols don't reflect them.

![](/media/15346144105739.jpg){:width="303" height="190"}


In order to hook all the load methods of a class and its corresponding Categories, the code above uses `class_copyMethodList` to enumerate all class methods, then replaces them one by one.

Finally, to keep the implementation simple, I created methods like LoadRulerSwizzledLoad0 1 2 3 4 to handle the case of N Categories.


# Project Code

The complete project and code is here <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/LoadCostSample/LoadRuler/LoadRuler/LoadRuler.mm>

When I first wrote the code, I referenced the code of my classmate Jiale <https://github.com/joy0304/Joy-Demo/blob/master/HookLoad/LDAPMLoadMonitor.m>, but Jiale's code didn't handle the Category case.


# Summary

Two years, gone in the blink of an eye, and yet all the ups and downs are still vivid. A single thought rises and a thousand mountains and rivers appear; a single thought fades and seas turn to fields. Press on bravely, young one.

Welcome to follow the WeChat official account "客户端技术评论":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

# Addendum

*A colleague told me there's a better-performing way to hook all +load, but it's not convenient to make it public. Ha.*


<!--ZH-->

本文仅供学习参考，但介绍的方法性能不好。推荐使用 <https://github.com/huakucha/TTAnalyzeLoadTime> ，这个性能会更好。

---

大概两年前刚开始做性能优化工作，为了Hook所有+load方法，是用Hopper先列出所有+load，然后使用CaptainHook在动态库中逐个指定类名来Hook每一个+load方法。写了一篇文章，先后发表到了内网（ATA）和博客，博客文章地址是： <https://everettjf.github.io/2017/01/06/a-method-of-hook-objective-c-load/> 。

这个方法有两个缺点：
1. 需要先静态分析（使用Hopper）来看到所有+load方法，或者使用objc runtime的方法获取所有包含+load方法的类名。很麻烦。
2. 对Category中的+load方法，没有办法Hook。

当时也意识到了这两个缺点，但迫于时间也凑合够用了。

时隔两年，想来了结这个心愿。这篇文章就把这两个缺点弥补上，实现：Hook所有的+load方法，包括Category中实现的+load方法。

<!-- more -->

# 目的

假设App包含两个自动链接的动态库，文件如下：

![](/media/15346134342627.jpg){:width="222" height="71"}

![](/media/15346134592061.jpg){:width="402" height="224"}

我们的目的是hook这三个MachO文件中的所有Objective C +load方法，并统计出耗时，打印出来。

# 新增动态库

为了让我们的Hook代码加载的比这两个动态库早，我们需要新增一个动态库LoadRuler.dylib，链接的顺序很重要，要把LoadRuler第一个链接（App启动时也就会第一个加载，以及第一个执行macho中的+load方法）。

![](/media/15346136993280.jpg){:width="224" height="170"}
![](/media/15346137538461.jpg){:width="917" height="283"}

# 获取我们自己App的所有macho

首先获取所有加载的macho可以这样：

```
static void AppendAllImagePaths(std::vector<std::string> & image_paths){
    uint32_t imageCount = _dyld_image_count();
    for(uint32_t imageIndex = 0; imageIndex < imageCount; ++imageIndex){
        const char * path = _dyld_get_image_name(imageIndex);
        image_paths.push_back(std::string(path));
    }
}
```

然后可以根据路径区分出我们App中的所有macho（动态库和可执行的主二进制文件）

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

其中 `Build/Products/` 是为了适配开发模式，例如，上图的工程配置下 FirstDylib 的目录是在

```
/Users/everettjf/Library/Developer/Xcode/DerivedData/LoadCostSample-amfsvwltyimldeaxbquwejweulqd/Build/Products/Debug-iphonesimulator/FirstDylib.framework/FirstDylib
```

为了把这种情况过滤出来，这里简单的通过 `Build/Products` 匹配了下（没有用 DerivedData 是考虑到 DerivedData 目录在Xcode的设置中是可修改的）

# 获取所有类


```
        unsigned int classCount = 0;
        const char ** classNames = objc_copyClassNamesForImage(path.c_str(),&classCount);

        for(unsigned int classIndex = 0; classIndex < classCount; ++classIndex){
            NSString *className = [NSString stringWithUTF8String:classNames[classIndex]];
            Class cls = object_getClass(NSClassFromString(className));
```


# 关键代码

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
            
            // 不要把自己hook了
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
                    // 添加成功，则说明不存在load。但动态添加的load，不会被调用。与load的调用方式有关。
                    if(!addSuccess){
                        // 已经存在，则添加新的selector
                        BOOL didAddSuccess = class_addMethod(cls, swizzledSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
                        if(didAddSuccess){
                            // 然后交换
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


# Category的处理

工程中 FirstLoader 的类及几个Category是这样
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

Hopper中看到Category中的+load，最终的符号没有体现出来。

![](/media/15346144105739.jpg){:width="303" height="190"}


为了把一个类及对应Category中的所有load都hook，上面的代码使用了`class_copyMethodList` 或许所有类方法，然后逐个替换。

最后为了代码实现的简单，创建了LoadRulerSwizzledLoad0 1 2 3 4这样的方法，适配N个Category的情况。


# 工程代码

完成工程及代码在这里 <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/LoadCostSample/LoadRuler/LoadRuler/LoadRuler.mm>

代码初期编写时参考了佳乐同学的代码 <https://github.com/joy0304/Joy-Demo/blob/master/HookLoad/LDAPMLoadMonitor.m>，但佳乐同学的代码没有处理Category的情况。


# 总结

两年，眨眼而过，而是是非非，却历历在目。一念起万水千山，一念灭沧海桑田。勇往直前，少年。

欢迎关注订阅号「客户端技术评论」：
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

# 补充

*同事告知Hook所有+load有性能更好的方法，但不便于公开了了。哈。*

