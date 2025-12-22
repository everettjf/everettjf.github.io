---
layout: post
title: "LaunchScreen Analysis"
categories:
  - Performance Optimization
tags:
  - performance
  - launch
  - optimization
  - iOS
  - startup

comments: true
---


# tl;dr

After clicking App icon, iOS system's desktop SpringBoard will first create LaunchScreen, then create App's corresponding process. Then can think: LaunchScreen's loading doesn't occupy App process's own perceived startup time. LaunchScreen is SpringBoard showing to users in advance before process startup for user experience.

Of course strictly speaking, LaunchScreen's loading occupies system CPU and other resources, also has certain impact on App's startup time.

<!-- more -->


Below is brief exploration process.

# Environment

iOS 11.3.1 Jailbroken
Jailbreak steps see: <https://everettjf.github.io/2018/08/30/ios1131-jailbreak-tutorial/>
Other jailbroken phones can also complete steps below.

*Small ad here: To purchase jailbreakable phone can contact WeChat "467444", I just bought an iPhone6S 11.3.1 from him, currently using everything normal.*


# Basics

Steps use basics below, can reference these three links when encountering problems:

- Using Xcode to debug target process on iOS11 <http://iosre.com/t/ios-11-app/12838>
- iOS Debugging Cheatsheet <https://everettjf.github.io/2016/05/25/my-ios-debug-cheatsheet/>
- chisel <https://github.com/facebook/chisel>

# Start

Phone open to desktop, connect to computer, open an empty project, Xcode attach to SpringBoard, print ViewControllers and Views (chisel's pvc and pviews commands).

![](/media/15368514201663.jpg)


![](/media/15368514662364.jpg)

Can see just a few key information:
SBIconController
SBHomeScreenViewController
SBRootIconListView
SBIconView

class-dump SpringBoard browse.

Through SBIconView can see this Delegate's `- (void)iconTapped:(SBIconView *)arg1;`

![](/media/15372804209839.jpg)

Print delegate

![](/media/15368521079726.jpg)

Know SBIconController is delegate, indeed saw implementation in header file.

![](/media/15372805530299.jpg)


IDA open SpringBoard, look at iconTapped implementation:

![](/media/15372805997145.jpg)

Header file search prepareToLaunchTappedIcon:completionHandler:

![](/media/15372806353243.jpg)


IDA again

![](/media/15372806969756.jpg)


From sub_10017A874 above,

![](/media/15372807139428.jpg)


Look at _launchFromIconView


![](/media/15372807382658.jpg)


-[[FBWorkspaceEventQueue sharedInstance] executeOrAppendEvent:]


# FrontBoard

Network search FBWorkspaceEventQueue can immediately know, now at FrontBoard.framework.

Find in this directory /Users/everettjf/Library/Developer/Xcode/iOS DeviceSupport/11.3.1 (15E302)/Symbols/System/Library/PrivateFrameworks

![](/media/15370071911618.jpg)


IDA separately analyze FrontBoard,
![](/media/15372808864772.jpg)

Many code can't analyze. Then lldb debug.


# Continue Debugging

First symbol breakpoint

![](/media/15372809320131.jpg)

Find those unrecognized BL instructions, address breakpoint:

![](/media/15372810094474.jpg)
![](/media/15372810160502.jpg)

Looks like arrayWithObjects, then pass to executeOrInsertEvents:atPosition:

Continue

![](/media/15372810336405.jpg)

Still many unrecognized, address breakpoint one by one, repeat `po $x0 , p (char*)$x1 , po $x2`

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


.... Omitted here ....


# Finally

Finally found `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]` and `-[FBApplicationUpdateScenesTransaction _performSynchronizedCommit:]`
and `+[FBSceneManager synchronizeChanges:]`

![](/media/15371976746085.jpg)
![](/media/15371981536631.jpg)


# Temporarily Stop

OK stop for now.

# Write tweak

After various hooks, finally discovered, if we hook `-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]`, directly return.

Or `-[FBSynchronizedTransactionGroup addSynchronizedTransaction:]` directly return.

Can both achieve an effect:

1. LaunchScreen started, but doesn't disappear.
2. App's process doesn't exist. (Can't see App's process in `ps ax`)

# Conclusion

Then we can think:

> After clicking App icon, iOS system's desktop SpringBoard will first create LaunchScreen, then create App's corresponding process. Then can think: LaunchScreen's loading doesn't occupy App process's own perceived startup time. LaunchScreen is SpringBoard showing to users in advance before process startup for user experience.


# Code 

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/AppFrequencyReport/AppFrequencyReport/AppFrequencyReport.xm>

# dyld_shared_cache

 ![](/media/15372810336405.jpg)

Actually these BL IDA can normally recognize, just because I only analyzed FrontBoard one dynamic library. Actually can directly analyze `/System/Library/Caches/com.apple.dyld/dyld_shared_cache_arm64` , but rumor says analyzing this needs 30+ GB space. I also tried using IDA and Hopper to analyze, but because too large, various postures all can't finish analyzing, either error, or stuck.

But currently OK, got this conclusion. Will continue exploring when there's time.


# Small Fragment

Still these unrecognized BL

![](/media/15372823772453.jpg)


step-in after is like this

![](/media/15372824009233.jpg)

step-in again is like this

![](/media/15372824261308.jpg)


Through two jumps, seems this is dyld_shared_cache's characteristic, haven't deeply searched materials. Looks like this can save dynamic binding process.

This is why fishhook can't hook UIKit and other system libraries' objc_msgSend.

Will continue researching when there's time :)

# Summary

Actually originally wanted to continue exploring to App process creation flow, how to notify launchd to start App process, but dyld_shared_cache always can't finish analyzing, just temporarily like this, continue forward, will review when there's time.

Interesting, but also quite time-consuming～




Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)


