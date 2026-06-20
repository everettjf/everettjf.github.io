---
layout: post
title: "An Initial Exploration of the Relationship Between iOS LaunchScreen and Process Creation"
title_zh: "初步探索 iOS LaunchScreen 与进程创建的关系"
lang_original: zh
categories:
  - 逆向工程
tags:
  - 逆向工程
  - 性能优化
comments: true
---


# tl;dr

After tapping an app icon, the iOS home screen SpringBoard first creates the LaunchScreen, then creates the process for the app. So we can think of it this way: the loading of the LaunchScreen does not count toward the launch time that the app process itself perceives. The LaunchScreen is shown to the user by SpringBoard ahead of time, before the process starts, for the sake of user experience.

Of course, strictly speaking, the loading of the LaunchScreen does consume system CPU and other resources, and it does have some impact on the app's launch time.

<!-- more -->


Below is a brief account of the exploration process.

# Environment

iOS 11.3.1 jailbroken
For the jailbreak steps see: <https://everettjf.github.io/2018/08/30/ios1131-jailbreak-tutorial/>
Other jailbroken phones can complete the steps below just as well.

*A little plug here: to buy a jailbreakable phone you can contact WeChat "467444". I just bought an iPhone 6S 11.3.1 from him, and everything works fine so far.*


# Basics

The steps use the following basics, which you can refer to when you run into problems:

- iOS11下使用Xcode调试目标进程 (Using Xcode to debug a target process on iOS 11) <http://iosre.com/t/ios-11-app/12838>
- iOS调试速查表 (iOS debugging cheatsheet) <https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/>
- chisel <https://github.com/facebook/chisel>

# Getting Started

Open the phone to the home screen, connect it to the computer, open an empty project, attach Xcode to SpringBoard, and print the ViewControllers and Views (chisel's pvc and pviews commands).

![](/media/15368514201663.jpg)


![](/media/15368514662364.jpg)

You can see just a few key pieces of information:
SBIconController
SBHomeScreenViewController
SBRootIconListView
SBIconView

class-dump SpringBoard and dig around.

Through SBIconView you can see this Delegate's `- (void)iconTapped:(SBIconView *)arg1;`

![](/media/15372804209839.jpg)

Print out the delegate

![](/media/15368521079726.jpg)

We learn that SBIconController is the delegate, and indeed, the implementation can be seen in the header file.

![](/media/15372805530299.jpg)


Open SpringBoard in IDA and look at the implementation of iconTapped:

![](/media/15372805997145.jpg)

Search the header file for prepareToLaunchTappedIcon:completionHandler:

![](/media/15372806353243.jpg)


Back to IDA

![](/media/15372806969756.jpg)


From sub_10017A874 above,

![](/media/15372807139428.jpg)


Then look at _launchFromIconView


![](/media/15372807382658.jpg)


-[[FBWorkspaceEventQueue sharedInstance] executeOrAppendEvent:]


# FrontBoard

A web search for FBWorkspaceEventQueue immediately tells us that we've now reached FrontBoard.framework.

Find it in this directory: /Users/everettjf/Library/Developer/Xcode/iOS DeviceSupport/11.3.1 (15E302)/Symbols/System/Library/PrivateFrameworks

![](/media/15370071911618.jpg)


Analyze FrontBoard separately in IDA,
![](/media/15372808864772.jpg)

Lots of code that can't be analyzed. So let's debug with lldb.


# Continuing to Debug

First a symbolic breakpoint

![](/media/15372809320131.jpg)

Find those unidentifiable BL instructions, and set address breakpoints:

![](/media/15372810094474.jpg)
![](/media/15372810160502.jpg)

Looks like it's arrayWithObjects, then passed to executeOrInsertEvents:atPosition:

Keep going

![](/media/15372810336405.jpg)

Still lots of unidentifiable stuff. Set an address breakpoint on each one and repeat `po $x0 , p (char*)$x1 , po $x2`

![](/media/15372810418000.jpg)



```
<FBSynchronizedTransactionGroup: 0x1c0574c40>
    Completed: NO
    Milestones pending: 
        synchronizedCommit
    Audit history: 
        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
        TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
        TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <SBSceneLayoutWorkspaceTransaction: 0x151d125d0>
    Concurrent child transactions: 
        <SBApplicationSceneUpdateTransaction: 0x151c85a70>
            Completed: NO
            Application: <SBDeviceApplicationSceneEntity: 0x1c0c9a810; ID: com.meituan.imeituan; layoutRole: primary>
            SceneID: com.meituan.imeituan
            Display: Main
            Launch Suspended: NO
            Milestones pending: 
                synchronizedCommit
            Audit history: 
                TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                TIME: 22:42:45.626; DESCRIPTION: Beginning scene updates.
                TIME: 22:42:45.626; DESCRIPTION: Adding child transaction: <FBUpdateSceneTransaction: 0x1c41beae0>
                TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
                TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <FBSynchronizedTransactionGroup: 0x1c0574c40>
            Concurrent child transactions: 
                <FBApplicationProcessLaunchTransaction: 0x1c0388c90>
                    Completed: NO
                    Process: <FBApplicationProcess: 0x14f684580; imeituan (com.meituan.imeituan); pid: 1168>
                    Milestones pending: 
                        processWillBeginLaunching
                        processDidFinishLaunching
                    Audit history: 
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.524; DESCRIPTION: Milestones added: processWillBeginLaunching
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                        TIME: 22:42:45.626; DESCRIPTION: Milestones added: processDidFinishLaunching
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
                <FBUpdateSceneTransaction: 0x1c41beae0>
                    Completed: NO
                    SceneID: com.meituan.imeituan
                    Scene Visibility: Foreground
                    Wait for Commit: YES
                    Milestones pending: 
                        synchronizedCommit
                    Audit history: 
                        TIME: 22:42:45.626; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.627; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
            Serial child transactions: (none)
    Serial child transactions: (none)
graph-base64-encoded: 

```


![](/media/15371092275313.jpg)


![](/media/15371100390744.jpg)

![](/media/15371100883844.jpg)
![](/media/15371102270464.jpg)


.... omitted here ....


# Finally

In the end I found `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]` and `-[FBApplicationUpdateScenesTransaction _performSynchronizedCommit:]`
and `+[FBSceneManager synchronizeChanges:]`

![](/media/15371976746085.jpg)
![](/media/15371981536631.jpg)


# Pausing for Now

Alright, let's not continue for now.

# Writing a Tweak

After various hooks, I eventually found that if we hook `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]` and return directly.

Or have `-[FBSynchronizedTransactionGroup addSynchronizedTransaction:]` return directly.

Both can achieve one effect:

1. The LaunchScreen starts, but doesn't disappear.
2. The app's process doesn't exist. (You can't see the app's process in `ps ax`)

# Conclusion

So we can conclude:

> After tapping an app icon, the iOS home screen SpringBoard first creates the LaunchScreen, then creates the process for the app. So we can think of it this way: the loading of the LaunchScreen does not count toward the launch time that the app process itself perceives. The LaunchScreen is shown to the user by SpringBoard ahead of time, before the process starts, for the sake of user experience.


# Code 

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/AppFrequencyReport/AppFrequencyReport/AppFrequencyReport.xm>

# dyld_shared_cache

 ![](/media/15372810336405.jpg)

Actually IDA can recognize these BLs just fine; it's only because I only analyzed the single dynamic library FrontBoard. In fact you can directly analyze `/System/Library/Caches/com.apple.dyld/dyld_shared_cache_arm64`, but I hear analyzing this requires over 30GB of space. I also tried analyzing it with IDA and Hopper, but because it's too large, every approach failed to finish — either it errored out, or it got stuck forever.

But it's okay for now, I got this one conclusion. I'll continue exploring when I have time.


# A Small Snippet

Still these unidentifiable BLs

![](/media/15372823772453.jpg)


After step-in, it's like this

![](/media/15372824009233.jpg)

Another step-in and it's like this

![](/media/15372824261308.jpg)


After two jumps, this seems to be a feature of dyld_shared_cache; I haven't dug into the references yet. It looks like this can save the dynamic binding process.

This is why fishhook can't hook the objc_msgSend of system libraries like UIKit.

I'll continue researching when I have time :)

# Summary

Actually I originally wanted to continue exploring all the way to the app process creation flow — how launchd is notified to start the app process — but dyld_shared_cache could never finish analyzing, so I'll leave it at this for now. Keep moving forward; I'll revisit when I have time.

Interesting, but also quite time-consuming, heh~



Welcome to follow the WeChat official account "客户端技术评论":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)


<!--ZH-->


# tl;dr

点击App图标后，iOS系统的桌面SpringBoard会先创建LaunchScreen，然后创建App对应的进程。那么可以这样认为：LaunchScreen的加载是不占用App进程自身感知到的启动时间的。LaunchScreen是SpringBoard为了用户体验，提前在进程启动之前展示给用户看的。

当然严格来说，LaunchScreen的加载占用了系统的CPU等资源，也会对App的启动时间有一定的影响。

<!-- more -->


下面是简要的探索过程。

# 环境

iOS 11.3.1 越狱
越狱步骤见：<https://everettjf.github.io/2018/08/30/ios1131-jailbreak-tutorial/>
其他越狱手机一样可以完成下面的步骤。

*这里打个小广告：购买可越狱的手机可以联系微信“467444"，我刚从他这买了个iPhone6S 11.3.1，目前使用一切正常。*


# 基础

步骤中用到了下面的基础，可以在遇到问题时参考这三个链接：

- iOS11下使用Xcode调试目标进程 <http://iosre.com/t/ios-11-app/12838>
- iOS调试速查表 <https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/>
- chisel <https://github.com/facebook/chisel>

# 开始

手机打开到桌面，连接到电脑，打开一个空工程，Xcode attach 到 SpringBoard，打印ViewControllers和Views（chisel 的 pvc 和 pviews 命令）。

![](/media/15368514201663.jpg)


![](/media/15368514662364.jpg)

可以看到就几个关键信息：
SBIconController
SBHomeScreenViewController
SBRootIconListView
SBIconView

class-dump出SpringBoard 翻一翻。

通过 SBIconView 可以看到这个Delegate的 `- (void)iconTapped:(SBIconView *)arg1;`

![](/media/15372804209839.jpg)

打印出delegate

![](/media/15368521079726.jpg)

得知 SBIconController 就是delegate，果然头文件中看到了实现。

![](/media/15372805530299.jpg)


IDA打开SpringBoard，看iconTapped的实现：

![](/media/15372805997145.jpg)

头文件搜索下prepareToLaunchTappedIcon:completionHandler:

![](/media/15372806353243.jpg)


再IDA

![](/media/15372806969756.jpg)


从上面的sub_10017A874中，

![](/media/15372807139428.jpg)


再看_launchFromIconView


![](/media/15372807382658.jpg)


-[[FBWorkspaceEventQueue sharedInstance] executeOrAppendEvent:]


# FrontBoard

网络搜索FBWorkspaceEventQueue可马上知道，现在到了FrontBoard.framework。

在这个目录找到 /Users/everettjf/Library/Developer/Xcode/iOS DeviceSupport/11.3.1 (15E302)/Symbols/System/Library/PrivateFrameworks

![](/media/15370071911618.jpg)


IDA单独分析FrontBoard，
![](/media/15372808864772.jpg)

很多分析不出的代码。那么就lldb调试。


# 继续调试

先符号断点

![](/media/15372809320131.jpg)

找到那几个不能识别的BL的指令，地址断点：

![](/media/15372810094474.jpg)
![](/media/15372810160502.jpg)

看来就是arrayWithObjects，然后传给executeOrInsertEvents:atPosition:

再继续

![](/media/15372810336405.jpg)

还是好多不识别的，挨个地址断点，重复 `po $x0 , p (char*)$x1 , po $x2`

![](/media/15372810418000.jpg)



```
<FBSynchronizedTransactionGroup: 0x1c0574c40>
    Completed: NO
    Milestones pending: 
        synchronizedCommit
    Audit history: 
        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
        TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
        TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <SBSceneLayoutWorkspaceTransaction: 0x151d125d0>
    Concurrent child transactions: 
        <SBApplicationSceneUpdateTransaction: 0x151c85a70>
            Completed: NO
            Application: <SBDeviceApplicationSceneEntity: 0x1c0c9a810; ID: com.meituan.imeituan; layoutRole: primary>
            SceneID: com.meituan.imeituan
            Display: Main
            Launch Suspended: NO
            Milestones pending: 
                synchronizedCommit
            Audit history: 
                TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                TIME: 22:42:45.626; DESCRIPTION: Beginning scene updates.
                TIME: 22:42:45.626; DESCRIPTION: Adding child transaction: <FBUpdateSceneTransaction: 0x1c41beae0>
                TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
                TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <FBSynchronizedTransactionGroup: 0x1c0574c40>
            Concurrent child transactions: 
                <FBApplicationProcessLaunchTransaction: 0x1c0388c90>
                    Completed: NO
                    Process: <FBApplicationProcess: 0x14f684580; imeituan (com.meituan.imeituan); pid: 1168>
                    Milestones pending: 
                        processWillBeginLaunching
                        processDidFinishLaunching
                    Audit history: 
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.524; DESCRIPTION: Milestones added: processWillBeginLaunching
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                        TIME: 22:42:45.626; DESCRIPTION: Milestones added: processDidFinishLaunching
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
                <FBUpdateSceneTransaction: 0x1c41beae0>
                    Completed: NO
                    SceneID: com.meituan.imeituan
                    Scene Visibility: Foreground
                    Wait for Commit: YES
                    Milestones pending: 
                        synchronizedCommit
                    Audit history: 
                        TIME: 22:42:45.626; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.627; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
            Serial child transactions: (none)
    Serial child transactions: (none)
graph-base64-encoded: 

```


![](/media/15371092275313.jpg)


![](/media/15371100390744.jpg)

![](/media/15371100883844.jpg)
![](/media/15371102270464.jpg)


.... 此处省略 ....


# 最后

最后找到了 `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]` 和 `-[FBApplicationUpdateScenesTransaction _performSynchronizedCommit:]`
和 `+[FBSceneManager synchronizeChanges:]`

![](/media/15371976746085.jpg)
![](/media/15371981536631.jpg)


# 暂时停止一下

好了先不继续了。

# 编写tweak

经过各种hook，最终发现，如果我们把 `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]` hook了，直接返回。

或者 `-[FBSynchronizedTransactionGroup addSynchronizedTransaction:]` 直接返回。

都能实现一个效果：

1. LaunchScreen启动了，但不消失。
2. App的进程不存在。（`ps ax` 中看不到App的进程）

# 结论

那么我们可以这么认为：

> 点击App图标后，iOS系统的桌面SpringBoard会先创建LaunchScreen，然后创建App对应的进程。那么可以这样认为：LaunchScreen的加载是不占用App进程自身感知到的启动时间的。LaunchScreen是SpringBoard为了用户体验，提前在进程启动之前展示给用户看的。


# 代码 

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/AppFrequencyReport/AppFrequencyReport/AppFrequencyReport.xm>

# dyld_shared_cache

 ![](/media/15372810336405.jpg)

其实这些BL IDA是可以正常识别的，只是因为我只分析了FrontBoard一个动态库。其实可以直接分析 `/System/Library/Caches/com.apple.dyld/dyld_shared_cache_arm64` ，但据说分析这个要30多GB的控件。我也试着用IDA和Hopper来分析，但由于太大，各种姿势都是分析不完，要么出错，要么一直卡住了。

不过目前还好，得出这一个结论哈。有空再继续探索。


# 小片段

还是这些不识别的BL

![](/media/15372823772453.jpg)


step-in 之后是这样

![](/media/15372824009233.jpg)

再step-in 是这样

![](/media/15372824261308.jpg)


通过两个跳转，貌似这是dyld_shared_cache的特性，还没深入查找资料。看起来这样是可以省去动态绑定的过程了。

这就是fishhook 不能hook UIKit等系统库的objc_msgSend的原因啦。

有空继续研究啦 :)

# 总结

其实本来是想继续探索到App进程的创建流程，是怎么通知launchd把App进程启动的，但dyld_shared_cache总是不能分析完成，就暂时这样吧，继续前行，有空再回顾。

有趣，但也挺耗费时间的额～



欢迎关注订阅号「客户端技术评论」：
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

