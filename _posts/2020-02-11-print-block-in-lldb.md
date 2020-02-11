---
layout: post
title: "lldb快速打印Objective-C方法中block参数的签名"
categories:
  - lldb
tags:
  - zlldb
  - block
  - oc
comments: true
---


iOS逆向时经常会遇到参数为block类型，本文介绍一个lldb script，可快速打印出Objective-C方法中block参数的类型。


<!-- more -->

class-dump出的头文件中经常包含如下方法签名：

```
- (void)doSomethingWithCompletionHandler:(CDUnknownBlockType)arg1;
```

CDUnknownBlockType 就是block类型的参数。当我们要调用这个方法，就需要知道这个参数类型。

网上搜了下，发现一篇好文章，文章讲解了使用lldb命令找到参数类型的方法。连接如下：

http://www.swiftyper.com/2016/12/16/debuging-objective-c-blocks-in-lldb/

但每次都需要lldb逐个命令的敲打，很是麻烦。于是又搜到一个lldb脚本，

https://github.com/ddeville/block-lldb-script

然而年久失修，不怎么能工作。

那就尝试修复这个脚本吧！

```
-> debugging .
-> debugging ..
-> debugging ...
-> ....
-> fixed, yeah :)
```

## 安装

安装lldb script

```
cd ~
git clone git@github.com:everettjf/zlldb.git
```

然后在 `~/.lldbinit` 文件中添加下行内容：

```
command script import ~/zlldb/main.py
```

![](/media/15814330985851.jpg)

## 使用

例如我们有如下block方法
```
@interface Hello : NSObject
@end
@implementation Hello
+ (void)say:(NSString*)text callback:(void(^)(NSString *text,int x, NSString *y, double z, BOOL m))callback {
}
@end
```

调用如下：

```
[Hello say:@"world" callback:^(NSString *text, int x, NSString *y, double z, BOOL m) {
    }];
```

那么我们断点到这个调用行：

![](/media/15814334097519.jpg)

如果是逆向工作的话，没有代码，那可以断点到 `objc_msgSend`这行，如下：

![](/media/15814334651010.jpg)


block是第二个参数，那么打印出`$arg4`

![](/media/15814335220546.jpg)

然后执行命令 `zblock 0x100588080` （block的地址传给 zblock命令），然后block的参数就出来啦。

![](/media/15814336103069.jpg)

根据每一行的 `type encoding` 对照苹果的文档即可知道block的参数都有什么。

https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html


## 代码

https://github.com/everettjf/zlldb

由于Xcode11内置的lldb script开始默认Python3版本，facebook的chisel还有些支持问题（可能现在解决了）。zlldb就是把我自己常用的几个命令放到了这里，支持Python3（也就是最新版Xcode）。除了zblock外，还有几个简单的命令，大家可以参考README。


## 参考

- http://www.swiftyper.com/2016/12/16/debuging-objective-c-blocks-in-lldb/
- https://maniacdev.com/2013/11/tutorial-an-in-depth-guide-to-objective-c-block-debugging
- https://github.com/ddeville/block-lldb-script
- https://store.raywenderlich.com/products/advanced-apple-debugging-and-reverse-engineering

---

Enjoy :)


---

广告：抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ）。如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)
