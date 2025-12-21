---
layout: post
title: iOS Debug Cheatsheet
categories: Skill
comments: true
---



Too many commands to remember during reverse engineering, so organized this cheatsheet, sharing with everyone. I only finished reading the little yellow book "iOS Application Reverse Engineering", haven't deeply researched reverse engineering in these months. Recently wanted to reverse a few apps again to learn how they're implemented, found I forgot many commands. So organized this table. Copy and paste to happily learn other apps' implementations.

Commands are all basic, simple, common, mainly because I only learned this much.

<!-- more -->


## common

ssh passwordless:

```
ssh-copy-id -i /Users/everettjf/.ssh/id_rsa root@localhost -p 2222
```

Find process:

```
ps aux | grep /App
ps -e | grep /Applications
```

Find file:

```
grep -r ToBeFind /System/Library/
```

Split fat binary

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

References

- <https://github.com/iosre/iOSAppReverseEngineering>
- <http://objccn.io/issue-19-2/>

Help

```
help frame
```

Print UI structure

```
po [[[UIWindow keyWindow] rootViewController] _printHierarchy]    (iOS 8)
po [[UIWindow keyWindow] recursiveDescription]
```

Stack info

```
bt (backtrace)
bt all (all threads)
```

objc_msgSend parameter printing

```
po $r0
p (char*)$r1
p (SEL)$r1
```

Return address

```
p/x $lr
```

Breakpoint

```
br s -a 0x0023234f
breakpoint set -F "-[NSArray objectAtIndex:]"

br s -a 0x02107730+0x000ab000 -c '(BOOL)[(NSString *)$r2 isEqualToString:@"snakeninny"]'

b ptrace
```

List modules

```
image list -o -f
```

lldb basic commands

```
c
n
s
frame info
expr

thread return
breakpoint command add 1
```

Remote debugging

```
debugserver *:1234 -a AlipayWallet
debugserver -x backboard *:1234 /var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app/AlipayWallet
```

lldb connect remote debugging

```
(lldb) process connect connect://192.168.199.164:1234
```

lldb expr examples

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

Watchpoint

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

Reference: <http://www.cycript.org/manual/>

Start

```
cycript -p BinaryName
```

Print UI structure

```
[[UIWindow keyWindow] recursiveDescription].toString()
[[[UIWindow keyWindow] rootViewController] _printHierarchy].toString()
```

Print sandbox Documents path

```
[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask]
```

Basic usage

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

Output bundle id

```
/var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app root# cat Info.plist | grep com.
    <string>com.alipay.iphoneclient</string>
```


## dumpdecrypted

<https://github.com/stefanesser/dumpdecrypted>

Example

```
scp -P 2222 Security/dumpdecrypted-master/dumpdecrypted.dylib root@localhost:/var/mobile/Containers/Data/Application/BA2644DB-450F-4DB0-A71F-A38F65488A48/Documents/

scp ~/sec/dumpdecrypted-master/dumpdecrypted.dylib root@192.168.199.164:/var/mobile/Containers/Data/Application/72AB36DD-2E9B-47C0-9695-099235E40C3C/Documents/
dumpdecrypted.dylib

everettjfs-iPhone:/var/mobile/Containers/Data/Application/72AB36DD-2E9B-47C0-9695-099235E40C3C/Documents root# DYLD_INSERT_LIBRARIES=dumpdecrypted.dylib /var/mobile/Containers/Bundle/Application/2DAD493D-6275-4CED-8242-BDEF27F36740/AlipayWallet.app/AlipayWallet
```

## theos

<https://github.com/theos/theos>

Start

```
everettjf@e WeChatVoiceSaver (master)]$ ~/sec/theos/bin/nic.pl
```

## chisel

Reference: <https://github.com/facebook/chisel>


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

PS: [Article first published on iosre.com](http://iosre.com/t/debug/3778)

