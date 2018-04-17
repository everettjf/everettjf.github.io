---
layout: post
title: 探索 facebook iOS 客户端 - section FBInjectable
categories: Skill
comments: true
---
 



---
 
# 现象
 
 MachOView查看Facebook的可执行文件，发现 FBInjectable 和 fbsessiongks 的数据段，这篇文章就探索下 FBInjectable 数据段的产生与用途。
 
![](/media/14713701978671.jpg)

<!-- more -->

# 如何定位

设备：iPhone5 越狱 iOS8.4 armv7

## 砸壳

Clutch 或 dumpdecrypted，获取到未加密的Facebook armv7 可执行文件。

## 初步查找 strings

使用strings 搜搜关键词FBInjectable，可知可以通过字符串作为切入点。

![](/media/14713711043679.jpg)


## 使用Hopper和IDA分析

使用Hopper和IDA分析好。两个App各有优缺点，配合使用。

分析较慢，我的MBP CPU2.2 i7 分析1个小时以上。

分析完成后就可以畅游arm了。

## Hopper中初步定位

搜索字符串FBInjectable

![](/media/14713715442206.jpg)

查看存在交叉引用的一个

![](/media/14713716052181.jpg)

![](/media/14713716295066.jpg)

跳转过去查看，可知地址在 0x0334cc1c，且FBInjectable是作为 getsectiondata 的第三个参数。

![](/media/14713716878000.jpg)

getsectiondata 的调用地址为 0x0334cc20。

getsectiondata 的定义如下：

![](/media/14713897883425.jpg)

反汇编：

![](/media/14713901424795.jpg)


需要重点关注下，r11这个变量。Hopper反汇编的代码貌似丢掉一些很关键的r2的信息。但看完能大概知道这里在遍历 getsectiondata的返回值，每4个字节做了一些处理。

如果IDA 有F5 反汇编功能，可以看到下图。这里没有丢掉关键的信息。v19作为返回值，转换为DWORD指针（做Windows开发比较熟悉，double word，word 是双字节，DWORD就是四字节），然后又把这个指针解引用。

也就是把getsectiondata的返回值buffer中的前四个字节当做字符串的内存地址。

![](/media/14713904842654.jpg)

## MachOView 确认FBInjectable含义

再次看 FBInjectable 段的前四个字节，B8DB8404，由于little-endian的原因，内存地址为0x0484DBB8。

![](/media/14715339253688.jpg)

Hopper中跳转到这个地址：
![](/media/14715347620860.jpg)

其他四个字节都是这样。




## lldb 确认getsectiondata返回值含义

为确认Facebook启动后是否调用了 getsectiondata，并传入了FBInjectable，可以先条件断点。

使用debugserver启动App：

```
everettjfs-iPhone:~ root# debugserver -x backboard *:1234 /var/mobile/Containers/Bundle/Application/A7811200-13B6-4053-BAED-8D3E8DE7C929/Facebook.app/Facebook
```

添加条件断点：

```
70 = F
95 = _

(lldb) br set -n getsectiondata -c '(int)*(char*)$r2 == 70'
```

继续运行，发现可以断下来。

单步运行，打印返回值 r0的数据。
![](/media/14713916594647.jpg)

![](/media/14713916821535.jpg)

 到这里我们发现个问题，与FBInjectable section的数据不一样。
 
 ![](/media/14713917406057.jpg)

但发现个规律，每4位相减正好是 ASLR 偏移地址。（例如： 0x0488bbb8 - 0x0484dbb8 = 0x3e000）

也就是说 FBInjectable 数据段 的数据在调用getsectiondata之前就被修改了。这里暂且忽略修改的方法（下文会介绍一种修改方法），继续探索。

打印当前方法的 返回值。
![](/media/14713924113293.jpg)

可见这里与开始strings查找FBInjectable时的结果很相似，
![](/media/14713711043679.jpg)

PS：这一步使用条件断点会导致启动特别慢。但条件断点的目的只是为了确认是否有这个调用。由于调试中要多次启动App，也可以直接断点到目标地址。（启动时，先断点到start，然后image list 查看ASLR偏移地址，再计算出getsectiondata的地址，然后 br s -a ADDRESS）

## 初步结论

由此可知，FBInjectable中存储的是
![](/media/14713945376097.jpg)

这类字符串的地址，armv7（32位）下每个地址占用4个字节，上图18个地址总共占用72个字节。通过FBInjectable的数据可以获取到这18个字符串。


## class-dump查看

在头文件中搜索fb_injectable，

![](/media/14713926308331.jpg)


## 再看lldb调用栈


![](/media/14713930823544.jpg)

图中看到好多folly的符号，folly是Facebook开源的专注于性能的C++ Library，但不知为何会对lldb的符号有这么大的影响。（有时间需要进一步了解下lldb的符号如何查找的）。不过，地址都是正确的。可以通过frame中的地址减去ASLR偏移地址，得到文件中的地址。

根据调用堆栈，可以跟踪到如下位置：

这里跨度可能有点大，但根据调用栈中的那些frame的地址，很容易看到下图内容（这只是18个配置中的一个）。

![](/media/14713937815940.jpg)
![](/media/14713938170666.jpg)

大概流程如下：

FBNavigationBarSearchFieldLayout 类的

```
+ (float)_calculateLeftOffsetForController:(id)arg1 isRoot:(BOOL)arg2 hasLeftMessengerButton:(BOOL)arg3;
```

调用了 FBIntegrationManager 类的

```
+ (Class)classForProtocol:(id)arg1;
```

进一步调用了

```
+ (id)classesForProtocol_internal:(id)arg1;
```

classesForProtocol_internal 会在首次调用时（dispatch_once）时加载FBInjectable的内容并获取这18个字符串，进而转化为对应的类。

classForProtocol的参数是 协议 FBNavigationBarConfiguration，通过这个协议获取到 类FBNavigationBarDefaultConfiguration。

最终调用静态方法，
![](/media/14715360284429.jpg)


## 再看头文件

这18个类有几个共同点

1. 都包含方法 fb_injectable。
2. 都包含方法 integrationPriority。
3. 都是静态方法。
4. 都会实现一个类似名称的协议。例如：FBNavigationBarDefaultConfiguration 实现协议 FBNavigationBarConfiguration。
    ![](/media/14715363734149.jpg)

5. 第4条提到的协议都会继承另一个协议 FBIntegrationToOne。
    ![](/media/14715363409527.jpg)



# 结论

至此，基本能知道FBInjectable的作用了，可以得出如下结论。

FBInjectable section用于在打包阶段更改一些配置。这个配置可能影响到界面（UI）、功能（Policy）等各个方面。

```
FBNewAccountNUXPYMKVCFactory,
FBPersonContextualTimelineHeaderDataSourceDefaultConfiguration,
FBTimelineActionBarDefaultConfiguration,
FBTimelineActionBarNuxPresentersDefaultConfiguration,
FBTimelineNavTilesFriendsFollowersDefaultConfiguration,
FBGroupsModuleDefaultConfiguration,
FBGroupsLandingWildeCoordinator,
FBEventsModuleDefaultConfiguration,
FBEventMessageGuestsDefaultCapability,
FBPhotoModuleDefaultConfiguration,
FBGrowthModuleDefaultConfiguration,
FBEventComposerKitDefaultConfiguration,
FBComposerDestinationOptionsDefaultPolicy,
FBBookmarksDownloaderConfiguration,
FBGroupCreationViewControllerDefaultStepsFactory,
FBNavigationBarDefaultConfiguration,
FBPersonalAppSuiteDefinitionProvider,
WildeKeys
```

这些类有以下共同信息：

1. +(void)fb_injectable 方法。
	- 这个方法只是个标记。
	- 用于方便的查找到这个类。
2. 都会实现一个与当前类对应的协议。
	- 例如：FBNewAccountNUXPYMKVCFactory类 对应 FBNewAccountNUXPYMKVCFactory协议。
	- 再例如：FBNavigationBarDefaultConfiguration类 对应 FBNavigationBarConfiguration协议。
	- 再例如：FBEventsModuleDefaultConfiguration类 对应 FBEventsModuleConfiguration协议。
3. 这个对应的协议一定会实现 FBIntegrationToOne。也就是说当前类还包括 + (unsigned int)integrationPriority; 方法。
	- 例如：FBNewAccountNUXPYMKVCFactory、FBNavigationBarConfiguration、FBEventsModuleConfiguration都会继承 FBIntegrationToOne 协议。就导致 FBNewAccountNUXPYMKVCFactory等类也都包含  + (unsigned int)integrationPriority;  方法。
	- 这个方法用于指定查找优先级。
	- FBIntegrationToOne 从名称看，只能集成1个。就是根据优先级选择1个的意思。

例如：

```
float __cdecl +[FBNavigationBarSearchFieldLayout _calculateLeftOffsetForController:isRoot:hasLeftMessengerButton:]

FBNavigationBarConfiguration

循环判断哪个类实现了这个协议，最后找到FBNavigationBarDefaultConfiguration，然后获取shouldShowBackButton。
```

# FBInjectable的创建

可以使用 `__attribute((used,section("segmentname,sectionname")))` 关键字把某个变量的放入特殊的section中。 

attribute 参考 http://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Variable-Attributes.html

例如：

```
char * kString1 __attribute((used,section("__DATA,FBInjectable"))) = "string 1";
char * kString2 __attribute((used,section("__DATA,FBInjectable"))) = "string 2";
char * kString3 __attribute((used,section("__DATA,FBInjectable"))) = "string 3";
```

PS:文章修改：上面代码unused改为used。不需要引用，即可避免release下被优化掉。


# 概括

编译时的配置选择机制。

编译时期选择某些配置类加入编译（精确说是，链接时期选择某些配置类的目标文件加入链接）或者配置优先级，App运行时通过FBInjectable获取到所有配置类，并使用每个配置类对应的协议获取当前使用的具体配置。


# 例子及进一步说明

Demo中模仿了这个机制。

代码： https://github.com/everettjf/Yolo/tree/master/FBInjectableTest

![](/media/14717165824862.jpg)


Demo中实现了三种配置类，每个配置类使用类似下面的代码自动创建FBInjectable 段。 （~~printf只是为了防止被编译器优化掉，应该有其他方法防止优化掉，暂时没找到，如果你知道，请告诉我哈~~ ，感谢iOS逆向工程群内的vr2d同学，attribute的第一个参数改为used，就可以避免release下被优化掉。还需认真呀，当时看到unused就感觉有点怪，但没有仔细查找含义。）

```
#define FBInjectableDATA __attribute((used, section("__DATA,FBInjectable")))
```

```
char * kNoteDisplayDefaultConfiguration FBInjectableDATA = "+[NoteDisplayDefaultConfiguration(FBInjectable) fb_injectable]";

@implementation NoteDisplayDefaultConfiguration

+ (void)fb_injectable{
}
+ (NSUInteger)integrationPriority{
    return 0;
}

+ (BOOL)showDeleteButton{
    return YES;
}
+ (UIColor *)noteBackgroundColor{
    return [UIColor blackColor];
}

@end
```

读取FBInjectable段：

```
        Dl_info info;
        dladdr(readConfigurationClasses, &info);
        
#ifndef __LP64__
//        const struct mach_header *mhp = _dyld_get_image_header(0); // both works as below line
        const struct mach_header *mhp = (struct mach_header*)info.dli_fbase;
        unsigned long size = 0;
        uint32_t *memory = (uint32_t*)getsectiondata(mhp, "__DATA", InjectableSectionName, & size);
#else /* defined(__LP64__) */
        const struct mach_header_64 *mhp = (struct mach_header_64*)info.dli_fbase;
        unsigned long size = 0;
        uint64_t *memory = (uint64_t*)getsectiondata(mhp, "__DATA", InjectableSectionName, & size);
#endif /* defined(__LP64__) */
```


最后使用方式如下：

```
    Class config = [FBIntegrationManager classForProtocol:@protocol(NoteDisplayConfiguration)];
    NSLog(@"cls = %@",config);
    NSLog(@"color = %@",[config noteBackgroundColor]);
```

# 这样有什么好处

配置文件可分散在各自文件中，省去了统一注册配置文件的代码。这样配置文件更容易添加和删除。

# 探索中遇到的困难

http://iosre.com/t/facebook-app-fbinjectable-section/4685

当时还没有些Demo，以为需要手动修改，但写Demo的过程中才恍然大悟。

# 总结

以上步骤只是我在探索后重新整理的步骤，真正探索过程中可能步骤相互穿插。

奇怪的是Facebook 貌似没有在任何文章中提到这个“配置选择”的小方法。Twitter和Google都没有搜到任何关于FBInjectable的信息。还好可以通过逆向来探索。




