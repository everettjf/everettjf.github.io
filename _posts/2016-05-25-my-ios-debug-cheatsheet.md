---
layout: post
title: iOS调试速查表
categories: Skill
comments: true
---




逆向过程中命令太多记不住，就整理了这个速查表，分享给大家。我只是看完了小黄书《iOS应用逆向工程》，这几个月没有再深入研究逆向。最近又想逆向几个app学习下怎么实现，发现很多命令都忘记了。于是整理了这个表。copy and paste就可以愉快的学习其他app的实现了。

命令都很基础、简单、常用，主要是我也只学了这么多哈。

<!-- more -->


## common



查找进程：

```
ps aux | grep /App
ps -e | grep /Applications
```

查找文件：

```
grep -r ToBeFind /System/Library/
```

分离fat binary

```
lipo -thin armv7 WeChat.decrypted -output WeChat_armv7.decrypted
lipo -thin armv64 xxx.decrypted -output xxx_arm64.decrypted
```

class dump

```
class-dump --list-arches AlipayWallet.decrypted

class-dump -S -s -H WeChat_armv7.decrypted -o dumparmv7
class-dump -s -S -H --arch armv7 AlipayWallet.decrypted -o dumpAlipay
```

## lldb

参考

- <https://github.com/iosre/iOSAppReverseEngineering>
- <http://objccn.io/issue-19-2/>

帮助

```
help frame
```

打印UI结构

```
po [[[UIWindow keyWindow] rootViewController] _printHierarchy]    (iOS 8)
po [[UIWindow keyWindow] recursiveDescription]
```

栈信息

```
bt (backtrace)
bt all (all threads)
```

objc_msgSend 参数打印

```
po $r0
p (char*)$r1
p (SEL)$r1
```

返回地址

```
p/x $lr
```

断点

```
br s -a 0x0023234f
breakpoint set -F "-[NSArray objectAtIndex:]"

br s -a 0x02107730+0x000ab000 -c '(BOOL)[(NSString *)$r2 isEqualToString:@"snakeninny"]'

b ptrace
```

列举模块

```
image -o -f
```

lldb基础命令

```
c
n
s
frame info
expr

thread return
breakpoint command add 1
```

远程调试

```
debugserver *:1234 -a AlipayWallet
debugserver -x backboard *:1234 /var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app/AlipayWallet
```

lldb连接远程调试

```
(lldb) process connect connect://192.168.199.164:1234
```

lldb expr例子

```
(lldb) expr char *$str = (char *)malloc(8)
(lldb) expr (void)strcpy($str, "munkeys")
(lldb) expr $str[1] = 'o'
(char) $0 = 'o'
(lldb) p $str
(char *) $str = 0x00007fd04a900040 "monkeys"

(lldb) x/4c $str
(lldb) x/1w `$str + 3`
(lldb) expr (void)free($str)

(lldb) expr id $myView = (id)0x7f82b1d01fd0
(lldb) expr (void)[$myView setBackgroundColor:[UIColor blueColor]]
(lldb) expr (void)[CATransaction flush]

(lldb) po [$myButton allTargets]

(lldb) p (ptrdiff_t)ivar_getOffset((struct Ivar *)class_getInstanceVariable([MyView class], "_layer"))

```

观察点

```
(lldb) watchpoint set expression -- (int *)$myView + 8

```

arm64

```
param1 $x0
param2 $x1

po $x0
p (char*)$x1
```

## cycript

参考： <http://www.cycript.org/manual/>

开始

```
cycript -p BinaryName
```

打印UI结构

```
[[UIWindow keyWindow] recursiveDescription].toString()
[[[UIWindow keyWindow] rootViewController] _printHierarchy].toString()
```

打印沙盒Documents路径

```
[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask]
```

基本使用

```
cy# [#0xb226710 url]
@"ww4fd1rfRDShBo_4K6rqfwAAACMAAQED"

cy# c = #0x1752d8c0
cy#"<FavAudioPlayerController: 0x1752d8c0; frame = (0 0; 290 60); autoresize = W; layer = <CALayer: 0x172dc2b0>>"
cy# c->m_audioInfo
cy#"<FavAudioInfo: 0x172b2a30>"
cy# c->m_audioInfo.m_nsAudioPath
```

## linker

```
-Wl,-sectcreate,__RESTRICT,__restrict,/dev/null
into Other link flag
```

## Anti

```
iHex replace RESTRICT , restrict
ldid -S AppName
AppSync
```

## Info.plist

输出bundle id

```
/var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app root# cat Info.plist | grep com.
    <string>com.alipay.iphoneclient</string>
```


## dumpdecrypted

<https://github.com/stefanesser/dumpdecrypted>

例子

```
scp -P 2222 Security/dumpdecrypted-master/dumpdecrypted.dylib root@localhost:/var/mobile/Containers/Data/Application/BA2644DB-450F-4DB0-A71F-A38F65488A48/Documents/

scp ~/sec/dumpdecrypted-master/dumpdecrypted.dylib root@192.168.199.164:/var/mobile/Containers/Data/Application/72AB36DD-2E9B-47C0-9695-099235E40C3C/Documents/
dumpdecrypted.dylib

everettjfs-iPhone:/var/mobile/Containers/Data/Application/72AB36DD-2E9B-47C0-9695-099235E40C3C/Documents root# DYLD_INSERT_LIBRARIES=dumpdecrypted.dylib /var/mobile/Containers/Bundle/Application/2DAD493D-6275-4CED-8242-BDEF27F36740/AlipayWallet.app/AlipayWallet
```

## theos

<https://github.com/theos/theos>

开始

```
everettjf@e WeChatVoiceSaver (master)]$ ~/sec/theos/bin/nic.pl
```

## chisel

参考：<https://github.com/facebook/chisel>


## usbmuxd

- <https://cgit.sukimashita.com/usbmuxd.git/snapshot/usbmuxd-1.0.8.tar.gz>
- <https://cgit.sukimashita.com/usbmuxd.git/>

First:

```
cd python-client
python tcprelay.py -t 22:2222
```

Then:

```
ssh root@localhost -p 2222
```

---

PS：[文章首次发布于iosre.com](http://iosre.com/t/debug/3778)
