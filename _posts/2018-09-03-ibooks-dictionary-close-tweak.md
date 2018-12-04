---
layout: post
title: "iBooks 查单词界面增加关闭按钮"
categories:
  - 逆向
tags:
  - 入门
comments: true
---


地铁时间一直使用iBooks看电子书，不认识的单词太多，也就很喜欢使用iBooks自带的长按单词点击Look Up（查询）按钮来查单词。又由于习惯了左手拿手机，右手扶地铁把手……查完单词后，关闭按钮在右上角。这篇文章就简单讲下怎么在左下角加上个“Done”按钮。如下图：

![screen](/media/screen.jpg)

于是我查单词更勤快了。

<!-- more -->

# 环境

- 越狱的iOS（下面的截图里没有用前两天越狱的iOS11.3.1，但都是通用的）

# 步骤

## 查看iBooks基本信息

用passionfruit，很容易看到。iBooks可执行文件路径和名称。

![](/media/15358613467616.jpg)

## 找到查单词的ViewController

使用cycript 找到 BKLookupViewController。

![](/media/15359889155719.jpg)

![](/media/15358615263059.jpg)

```
   + <BKLookupViewController 0x102a05800>, state: appeared, view: <UILayoutContainerView 0x11827eec0>, presented with: <_UIOverFullscreenPresentationController 0x11827ce60>
   |    | <DDParsecRemoteCollectionViewController 0x102a1f800>, state: appeared, view: <_UISizeTrackingView 0x117a27c80>`
```

## class-dump

scp复制出可执行文件iBooks和Frameworks文件夹下的动态库，`class-dump -S -s -H iBooks -o ibooksheader` dump出头文件，可以看到 BKLookupViewController 继承自 DDParsecCollectionViewController。BKLookupViewController 本身没有多少方法，那么就看下这个类 DDParsecCollectionViewController。


```
#import <DataDetectorsUI/DDParsecCollectionViewController.h>

@interface BKLookupViewController : DDParsecCollectionViewController
{
}

- (void)p_setDarkThemeEnabled:(_Bool)arg1;
- (void)updateForTheme:(id)arg1;

@end
```

然而 DDParsecCollectionViewController 在Frameworks中的动态库中也找不到。搜一下，原来是个私有库 DataDetectorsUI.framework。

头文件已经有了现成的。

<https://github.com/nst/iOS-Runtime-Headers/blob/master/PrivateFrameworks/DataDetectorsUI.framework/DDParsecCollectionViewController.h>

扫一眼，可以hook这个viewWillAppear。

![](/media/15359892415400.jpg)



## MonkeyDev

MonkeyDev大大方便了越狱开发，创建一个CaptainHook Tweak工程。
![](/media/15359891883821.jpg)

viewWillAppear时，左下角加一个UIButton就行了，事件可以调用 DDParsecCollectionViewController的方法doneButtonPressed。

代码参考： <https://github.com/everettjf/iBooksLookUpCloser/blob/master/ibookslookupcloser/ibookslookupcloser.mm>

注意 Other Linker Flags 加上 `-undefined dynamic_lookup`。

## 发布到bigboss


<http://thebigboss.org/hosting-repository-cydia/submit-your-app> 按照提示就上传上去啦。

24-48小时就会审核通过。

这是介绍：
<http://moreinfo.thebigboss.org/moreinfo/depiction.php?file=ibookslookupcloserDp>

这是下载次数：
<http://apt.thebigboss.org/stats.php?dev=everettjf>
![](/media/15359897424719.jpg)

# 源码

<https://github.com/everettjf/iBooksLookUpCloser>


# 总结

这篇文章和性能优化关系不大，但自己总感觉逆向工程和性能优化就是个邻居，相互有影响。

很入门，但解决了自己的需求，很开森。

欢迎关注订阅号《this很有趣》：
![bukuzao](https://everettjf.github.io/images/fun.jpg)





