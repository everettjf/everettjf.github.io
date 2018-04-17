---
layout: post
title: 探索 Facebook iOS 客户端 - Section RODATA
categories: Skill
comments: true
---
 




# 现象

使用 MachOView 查看 Facebook 的 iOS 二进制文件时，发现有几个 Section 与其他大多数 App 不同。

下图是 Facebook ：

![Facebook](/media/14712760652964.jpg)

下图是微信：

![](/media/14712762093391.jpg)

<!-- more -->

# 初步分析

```
    __TEXT
    The __TEXT segment contains our code to be run. It’s mapped as read-only and executable. The process is allowed to execute the code, but not to modify it. The code can not alter itself, and these mapped pages can therefore never become dirty.
    __DATA
    The __DATA segment is mapped read/write but non-executable. It contains values that need to be updated.
    __RODATA   :  read only data ， still non-executable.
```

TEXT 是代码段，DATA是数据段，RODATA是只读数据段。Facebook把代码段中的部分内容移动到只读段，可知这些内容是不需要执行的，从下图也可看出都是常量。

![](/media/14712778296998.jpg)



# 为什么

看 Facebook 的各个段大小，如下图：
![](/media/14712790779062.jpg)

把 TEXT 段的内容移到 RODATA 段，也就是减少了 TEXT 段的大小。

查看Apple的审核要求：

https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SubmittingTheApp.html

![](/media/14712795366819.jpg)

可知，如果要支持 iOS7.x或8.x，TEXT段的大小最大为 60MB（每个架构的TEXT段）。 Facebook 的 TEXT段马上就到 60MB。

# 如何做

如果我们的App的TEXT大小马上到60MB，如何处理成Facebook这样呢？

man ld：
![](/media/14712799872260.jpg)

加入链接选项：

```
-Wl,-rename_section,__TEXT,__cstring,__RODATA,__cstring
-Wl,-rename_section,__TEXT,__gcc_except_tab,__RODATA,__gcc_except_tab
-Wl,-rename_section,__TEXT,__const,__RODATA,__const
-Wl,-rename_section,__TEXT,__objc_methname,__RODATA,__objc_methname
-Wl,-rename_section,__TEXT,__objc_classname,__RODATA,__objc_classname
-Wl,-rename_section,__TEXT,__objc_methtype,__RODATA,__objc_methtype
```

如图：
![](/media/14712804570512.jpg)

![](/media/14712804466103.jpg)

# 影响App运行吗？

经过在自己的App中测试，没有任何影响。

# 真正可以吗？

还有个小小担心，Objective C Runtime与这些常量有什么关系吗？修改了常量的段（segment）名字为什么对程序运行没有影响。

代码：https://opensource.apple.com/tarballs/objc4/objc4-680.tar.gz

代码中搜索 methname methtype 都没有相关信息，大概推测 runtime 没有对这些常量的获取做针对性的处理。

在 https://github.com/llvm-mirror/llvm 搜索 objc_methname 或 objc_methtype ， objc_methtype只在一些test中搜索到。而 objc_methname 除了test中使用，还在 ARC 的优化器中使用。

修改segment会影响这个优化器吗？

![](/media/14712826297536.jpg)

进一步查找 GlobalVariable::getSection() 的来源。
getSection 来自 GlobalVariable的父类 GlobalObject。

![](/media/14712828749695.jpg)

从目前信息看来，section可能的内容是 `__TEXT,__objc_methname` 或  `__RODATA,__objc_methname` ，而上面的代码是 Section.find，是在字符串中查找，也就能自动适配segment的修改。

其他一些段大概使用类似的方式，可以确定不会有影响了。

# TEXT段能瘦身多少

以 Facebook armv7 为例，RODATA segment大小约14MB。

![](/media/14713639408868.jpg)



# 历史想法

开始以为把 TEXT段中不需要马上加载的数据移到RODATA中是为了加快App启动速度，但想想内存映射 mmap 的优势就是可以快速处理大文件，一起加载并不会有什么性能影响。

# 参考工程

代码： https://github.com/everettjf/Yolo/tree/master/FBInjectableTest

![](/media/14717179771404.jpg)


# 补充补充

segment的权限，可以通过下面的链接参数改为VM_PROT_READ.

```
-Wl,-segprot,__RODATA,r,r
```


# 其他资料

- http://stackoverflow.com/questions/4753100/max-size-of-an-ios-application
- WWDC App 瘦身： https://developer.apple.com/videos/play/wwdc2015/404/
- 《程序员的自我修养-链接、装载与库》
- 《链接器与加载器》
- https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/MachOTopics/0-Introduction/introduction.html
- OS X ABI Mach-O File Format Reference https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/MachORuntime/index.html











 


