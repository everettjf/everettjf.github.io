---
layout: post
title: "background fetch internal"
categories:
  - 
tags:
  - 
comments: true
---



<!-- more -->

# 列出所有进程

```
ps -ef
```

```
  UID   PID  PPID   C     STIME TTY           TIME CMD
    0     1     0   0   0:00.00 ??         0:28.73 /sbin/launchd
    0    21     1   0   0:00.00 ??         0:02.77 /usr/sbin/syslogd
    0    42     1   0   0:00.00 ??         0:14.75 /usr/libexec/logd
    ...
  501  1479     1   0   0:00.00 ??         0:00.38 /System/Library/PrivateFrameworks/SyncedDefaults.framework/Support/syncdefaultsd
  501  1485     1   0   0:00.00 ??         0:02.34 /Applications/Preferences.app/Preferences
  501  1487     1   0   0:00.00 ??         0:00.22 /System/Library/Frameworks/VideoSubscriberAccount.framework/XPCServices/com.apple.VideoSubscriber
    0  1490     1   0   0:00.00 ??         0:00.03 /System/Library/Frameworks/SystemConfiguration.framework/SCHelper
  501  1493     1   0   0:00.00 ??         0:00.81 /var/containers/Bundle/Application/8BF0DD11-B41A-43DA-A46A-8E8797358BC6/Bumblebee.app/Bumblebee
```




# 调试器启动

```
  501  1369     1   0   0:00.00 ??         0:00.51 /Developer/usr/bin/debugserver --lockdown --launch=frontboard
```



# 点击图标以及BackgroundFetch

```
    0     1     0   0   0:00.00 ??         0:28.73 /sbin/launchd
```


![](/media/15346629175862.jpg)


