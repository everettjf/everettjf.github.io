---
layout: post
title: "iOS中的多进程，下拉关闭系统的词典界面"
categories:
  - 逆向工程
tags:
  - 逆向工程
comments: true
---


iOS中的App也存在多进程架构，而且是从iOS6就开始了，只是苹果一直自己在用。

# 需求来源

iBooksLookUpCloser 发布到bigboss后的第二天，一位老外朋友就发来邮件，让我看看这个一个月前reddit的提问 <https://www.reddit.com/r/jailbreak/comments/95vjgd/request_please_some_one_fulfill_this_request_pull/?st=JLMLKHHM&sh=093359ff> 。

关于iBooksLookUpCloser参考上篇文章 <https://everettjf.github.io/2018/09/03/ibooks-dictionary-close-tweak/> 。

<!-- more -->

很清楚，是想实现下拉关闭。我瞬间感觉“这个想法好啊，比左下角加个Done按钮体验好多了“。如下图所示。

![](/media/15364165356473.jpg)


当时不假思索回复了一句：

![](/media/15364173953971.jpg)



# Remote View Controller

iBooks打开查单词的界面，cycript查看VC，如下：

![6F59426B-EFD3-42E7-A5E4-8FE94C702](/media/6F59426B-EFD3-42E7-A5E4-8FE94C702C71.png)

仍然是看到了 DDParsecRemoteCollectionViewController 这个类。这个类是个私有类。

<https://github.com/nst/iOS-Runtime-Headers/blob/master/PrivateFrameworks/DataDetectorsUI.framework/DDParsecRemoteCollectionViewController.h>

可以看到定义如下：

```
@interface DDParsecRemoteCollectionViewController : _UIRemoteViewController <DDParsecHostVCInterface> {

```

_UIRemoteViewController 是个什么鬼？搜索貌似只发现了这三篇2012年的文章：

<https://oleb.net/blog/2012/10/remote-view-controllers-in-ios-6/>

![](/media/15364176746020.jpg)


原来苹果早在iOS6就实现了这种远程进程ViewController的机制。颇有类似Android多进程机制，比如微信小程序的Android端多进程架构。想必如今的WKWebView也是类似机制。

就这样，我发现回复太早了（装X装早了）。

![](/media/15364178167505.jpg)

# 找到目标进程

经《iOS应用逆向工程》某位大佬提示，说“记得这个类里包含远程进程的ID”。顿时豁然开朗，既然是多进程架构，这么顺理成章的事情，当时怎么没想到呢。

在 _UIRemoteViewController 中找到了这两个属性。

<https://github.com/nst/iOS-Runtime-Headers/blob/master/Frameworks/UIKit.framework/_UIRemoteViewController.h>

```
@property (nonatomic, readonly) NSString *serviceBundleIdentifier;
@property (nonatomic, readonly) int serviceProcessIdentifier;
```

打印出来，啊哈。

![F8740182-41AA-44EA-828C-92C3ADD3BAD1](/media/F8740182-41AA-44EA-828C-92C3ADD3BAD1.png)

啊哈，bundle id `com.apple.datadetectors.DDActionsService`

开另一个shell，`ps aux` 果然找到了这个进程。

![A2E75283-F257-4C05-8E8A-73E1AD3D70A9](/media/A2E75283-F257-4C05-8E8A-73E1AD3D70A9.png)

# 目标转移到了新进程

至此，我们的动态库需要注入到新的进程 DDActionsService。 修改tweak的注入bundle id 为 `com.apple.datadetectors.DDActionsService` 。

既然是另一个进程，那带来了一个新的好处。hook了这一个进程，那iBooks和Safari以及其他使用这个进程服务的App都间接加上了这个“下拉关闭”的功能。

嗯不错，有意思，继续。

# 找到字典首页

由于这个进程没有keyWindow, 上文打印VC树的方式无效了。但总有办法啦。

先马上scp出来一份，看看究竟，class-dump。

![](/media/15364185280989.jpg)

很多Protocol，真实有效的类并不多，那就随便hook几个看看哪个类是字典的首页。使用 MonkeyDev 的Logos Tweak （或CaptainHook Tweak） ，最终发现 `DDParsecTableViewController` 是首页。

```
#import <UIKit/UITableViewController.h>

@interface DDParsecTableViewController : UITableViewController
{
}

- (void)loadView;

@end
```

看下头文件，确认是一个UITableViewController的子类。


# 找到delegate

那么为了实现下拉关闭，大概需要知道“触摸按下，移动，松开”三个时间，UITableViewDelegate 实现了 UIScrollViewDelegate , UIScrollViewDelegate 有我们需要的三个事件。

那么需要找到 UITableViewController 中tableView的delegate是谁。由于不方便在cycript中快速通过keyWindow获取VC栈，那就先通过 hook DDParsecTableViewController 的viewWillAppear事件（或者viewDidAppear等任意事件），打印出 DDParsecTableViewController 的self地址。

```
NSLog(@"%p",self);
```

知道了地址，然后cycript快速找到delegate

![E4EE9916-9961-46D8-99C7-C1F0668C7EDF](/media/E4EE9916-9961-46D8-99C7-C1F0668C7EDF.png)

找到了 DDParsecServiceCollectionViewController 这个类就接近完工了。

```
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset{

- (void)scrollViewDidScroll:(UIScrollView *)scrollView;
```

分别通过hook或者category的方式，加上下拉关闭的逻辑代码。终于实现了。

# 完工

具体代码参考：

<https://github.com/everettjf/DictionaryPullDownToClose/blob/master/DictionaryPullDownToClose/DictionaryPullDownToClose.mm>

# 实现效果视频

没找到微博的视频怎么分享，也放推特的吧 <https://twitter.com/everettjf/status/1038359512384585729>

# 上传bigboss

估计2018年9月10日就能在cydia的bigboss源里搜到 DictionaryPullDownToClose 了。

# 总结

1. 世界上总有和你一样需求的人。
2. 或许他有更好的实现方法。
3. 努力找寻。
4. 找不到的话，要么这个需求没价值，要么就是无价。

上面四条纯属瞎掰掰。

实现了这个功能，用iBooks或Safari看英文更愉快了，开森。


欢迎关注订阅号「客户端技术评论」：
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

