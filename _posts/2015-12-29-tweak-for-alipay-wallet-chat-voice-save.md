---
layout: post
title: "Developing a Tweak to Save Alipay Chat Voice Messages"
title_zh: "保存支付宝聊天语音的 Tweak 开发"
lang_original: zh
categories: Skill
comments: true
---




# Background
Alipay group voice. I had just finished reading the book "iOS App Reverse Engineering", and I figured I could try writing a tweak to save the voice messages in chats.

# Environment

1. iPhone 5, iOS 8.3, jailbroken.
2. Alipay 9.3.

I mainly used the iPhone 5 because its CPU is 32-bit, 32-bit ARM assembly. The free version of IDA can't disassemble 64-bit programs. Also, I'm a beginner, and the examples in this book are all 32-bit assembly, which is simpler for me.

<!-- more -->

# Removing the Protection

## Get the AppBundleIdentifier

Enter the AlipayWallet.app directory,

~~~
everettjfs-iPhone:/var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app root# cat Info.plist | grep com.
    <string>com.alipay.iphoneclient</string>
~~~

## Remove the ptrace and __RESTRICT section Protections

See: <https://everettjf.github.io/2015/12/28/simple-ios-antidebugging-and-antiantidebugging/>

After breaking the protections, you can use cycript.


# Analysis

## Decrypting
Use dumpdecrypted

~~~
everettjfs-iPhone:~ root# cycript -p AlipayWallet
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask]
@[#"file:///var/mobile/Containers/Data/Application/F3E3A318-3E42-40BB-B1AC-2DE3CD8ACB00/Documents/"]

~~~

## class-dump

~~~
$ class-dump --list-arches AlipayWallet.decrypted
$ class-dump -s -S -H --arch armv7 AlipayWallet.decrypted -o dumpAlipay
~~~


## Find the UITableViewCell Corresponding to the Voice

Open Alipay and switch to the chat screen. Keep a voice message from the other party in the chat conversation.

~~~
everettjfs-iPhone:~ root# cycript -p AlipayWallet
cy# ?expand
expand == true
cy# [[UIApp keyWindow] recursiveDescription]
@"<UIWindow: 0x2db3ae0; frame = (0 0; 320 568); gestureRecognizers = <NSArray: 0x2db3f60>; layer = <UIWindowLayer: 0x2db3c30>>
   | <UILayoutContainerView: 0xb4662d0; frame ....
   ......
~~~

You can use the voice duration as a keyword, for example searching for `1''`, and you can find:

~~~
<UILabel: 0xe2a1900; frame = (141 65.316; 15 14); text = '1'''; userInteractionEnabled = NO; layer = <_UILabelLayer: 0xe2a19e0>>
~~~

And from there you can find the corresponding UITableViewCell:

~~~
<CTMessageCell: 0x39ecc00; baseClass = UITableViewCell; frame = (0 285; 320 99); ......
~~~

So, find the header file of CTMessageCell from the class-dump output:
This is where you need sharp eyes. I found the following information:

~~~
@property(retain, nonatomic) APChatMedia *voiceObj; // @synthesize voiceObj=_voiceObj;
@property(copy, nonatomic) NSString *timeLine; // @synthesize timeLine=_timeLine;

- (void)playAudio;
~~~

You can call these directly in cycript to verify whether the data is what you're looking for.

This APChatMedia is very interesting. Let's look at its header file.

~~~
@interface APChatMedia : NSObject
@property(retain, nonatomic) NSData *data; // @synthesize data=_data;
@property(retain, nonatomic) NSString *url; // @synthesize url=_url;
~~~

url can give you a string. When I first saw url I was very happy — could it be this simple? Could this be the url to download the voice file? Sadly, it isn't.

~~~
cy# [#0x3022400 voiceObj]
#"<APChatMedia: 0xb226710>"
cy# [#0xb226710 url]
@"ww4fd1rfRDShBo_4K6rqfwAAACMAAQED"
~~~

Then I saw APChatMedia's data — could this be the voice data? Sadly this value is always nil.

It seems I need to find another way. Let's look at the playAudio method.

## Bring in lldb and IDA

In lldb, find the address of CTMessageCell playAudio, set a breakpoint, tap a voice message, and sure enough it breaks.

Analyzing the playAudio code, internally it calls APPlayManager's play:FinishCallback.

![playFinishCallback](http://d.pr/i/1jTaR+)

APChatMedia is passed in as the first argument.

~~~
(lldb) br s -a 0x00D3EFD6
Breakpoint 1: where = AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118, address = 0x00d3efd6
(lldb) c
error: Process is running.  Use 'process interrupt' to pause execution.
Process 6235 stopped
* thread #1: tid = 0x58da9, 0x00d3efd6 AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00d3efd6 AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118
AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet:
->  0xd3efd6 <+118>: blx    0xe0bb50                  ; ___lldb_unnamed_function73268$$AlipayWallet
    0xd3efda <+122>: mov    r0, r6
    0xd3efdc <+124>: blx    0xe0bb4c                  ; ___lldb_unnamed_function73267$$AlipayWallet
    0xd3efe0 <+128>: mov    r0, r5
(lldb) po $r0
<APPlayManager: 0xce984f0>

(lldb) p (char*)$r1
(char *) $1 = 0x021535fd "play:finishCallback:"
(lldb) po $r2
<APChatMedia: 0xc7e7b90>
~~~

Going to APPlayManager's play:FinishCallback, I found it gets the audio data from VoiceCache.

~~~
- (id)queryVoiceDataForKey:(id)arg1 formatType:(unsigned int)arg2;
~~~

~~~
> VoiceCache.queryVoiceDataForKey:formatType:
lldb) p (char*)$r1
(char *) $18 = 0x020f55b3 "queryVoiceDataForKey:formatType:"
(lldb) po $r2
9atdHG1cSFKJyb8yqntaaQAAACMAAQED

(lldb) p $r3
(unsigned int) $20 = 1
~~~

![VoiceCache](http://d.pr/i/13z9A+)

Actually, by this point, the NSData returned by queryVoiceDataForKey is the audio data we want. Save it, get it onto the computer, and you're done.

## Step Summary

1. CTMessageCell.playAudio
2. APPlayManager.playFinishCallback  (param : [CTMessageCell voiceObj])
3. APVoiceManager.playAudioWithCloudId:resumeActive:downLoadHandler:playHandler:
4. VoiceCache.queryVoiceDataForKey:formatType:


## How to Get the Voice's Timestamp

Now that we have the voice data, how to save it with an appropriate name. Because a share will have lots of voice messages, you need to distinguish the order of the voices (Alipay's "favorites" feature is also a very poor experience).

So look at CTMessageCell's header file, then look at the parent class PKCell, where you can see there's information about the chat partner,

~~~
@property(retain, nonatomic) APContactInfo *contactInfo; // @synthesize contactInfo=_contactInfo;
~~~

Then look at the parent class PKBaseCell, and you'll find there's a

~~~
@property(retain, nonatomic) NSDictionary *chatDataSource; // @synthesize chatDataSource=_chatDataSource;
~~~

Printing it out in cycript:

~~~
chatDataSource
cy# [#0x319c400 chatDataSource]
@{"alignmentType":0,"templateData":@{"l":12,"v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED"},"id":"12","originId":"12","data":@{"displayName":"everettjf","sessionId":"2088002664597371","bizImage":"Local_Image_CHAT.left","hintName":"everettjf","timeLine":#"2015-12-24 15:56:27 +0000","HeadIcon":"http://tfs.alipayobjects.com/images/partner/T1IJphXc4XXXXXXXXX_160X160","action":"0","seed":"2088002664597371@145097258940385","cellSelected":"0","userType":"1","userID":"2088122631212590","v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED","bizMemo":"[\xe8\xaf\xad\xe9\x9f\xb3]","fromUId":"2088002664597371","l":12,"fromLoginId":"eve***@outlook.com","bizType":"CHAT","bizRemind":"","toUId":"2088122631212590","clientMsgID":"2088002664597371@145097258940385","link":"","msgID":151224235627370001,"toLoginId":"","localId":6},"headerText":"Thursday 11:56 PM","msgType":0}
~~~

As you can see, `timeLine` is the timestamp of this message.


# Source Code

Alright, mission accomplished, let's write a tweak.

I put the saving code into the favorite button. Hook the favorite method `- (void)collectMenu:(id)arg1`.

See the code:

[https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver)

# Addendum

## Audio Format
The voice format: after copying the voice out and opening it with the binary editing tool iHex, you can see it's wav format.

## Auto-downloading Voice over Wifi

Above we got the audio data from VoiceCache every time, which should be because over Wifi the voice is automatically downloaded, and after downloading it's automatically placed in VoiceCache.

By setting a breakpoint on the following method of APVoiceManager, you can find that it auto-downloads every time. I won't analyze the details.

~~~
- (void)downLoadAudioWithCloudId:(id)arg1 downLoadHandler:(CDUnknownBlockType)arg2;
~~~


# Summary

Although this is far from as complex as the example in the last chapter of "iOS App Reverse Engineering", let it serve as a small little period at the end of my reading of this book. And while it's a period, it's also a new starting point. The content of this book only guided me through the door of iOS reverse engineering — just getting started, that's all.

Looking forward to the future...


<!--ZH-->




# 背景
支付宝群语音。近期正好看完了《iOS应用逆向工程》这本书，想来可以试试写个tweak，保存聊天中的语音。

# 环境

1. iPhone 5，iOS 8.3，越狱。
2. 支付宝9.3 。

使用iPhone5主要是因为CPU是32位，32位arm汇编。IDA免费版不能反汇编64位程序。其次也是我初学，这本书中的例子也都是32位汇编，对我来说更简单点。

<!-- more -->

# 去掉保护

## 获取 AppBundleIdentifier

进入 AlipayWallet.app 目录，

~~~
everettjfs-iPhone:/var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app root# cat Info.plist | grep com.
    <string>com.alipay.iphoneclient</string>
~~~

## 去掉 ptrace 和 __RESTRICT section 两个保护

参见：<https://everettjf.github.io/2015/12/28/simple-ios-antidebugging-and-antiantidebugging/>

破掉保护后就可以使用cycript了。


# 分析

## 砸壳
使用 dumpdecripted

~~~
everettjfs-iPhone:~ root# cycript -p AlipayWallet
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask]
@[#"file:///var/mobile/Containers/Data/Application/F3E3A318-3E42-40BB-B1AC-2DE3CD8ACB00/Documents/"]

~~~

## class-dump

~~~
$ class-dump --list-arches AlipayWallet.decrypted
$ class-dump -s -S -H --arch armv7 AlipayWallet.decrypted -o dumpAlipay
~~~


## 找到语音对应的UITableViewCell

打开支付宝，切换到聊天界面。保持聊天对话的对方有语音消息。

~~~
everettjfs-iPhone:~ root# cycript -p AlipayWallet
cy# ?expand
expand == true
cy# [[UIApp keyWindow] recursiveDescription]
@"<UIWindow: 0x2db3ae0; frame = (0 0; 320 568); gestureRecognizers = <NSArray: 0x2db3f60>; layer = <UIWindowLayer: 0x2db3c30>>
   | <UILayoutContainerView: 0xb4662d0; frame ....
   ......
~~~

可以把语音时长作为关键字，例如搜索`1''`，可以找到：

~~~
<UILabel: 0xe2a1900; frame = (141 65.316; 15 14); text = '1'''; userInteractionEnabled = NO; layer = <_UILabelLayer: 0xe2a19e0>>
~~~

进而可以找到对应的UITableViewCell：

~~~
<CTMessageCell: 0x39ecc00; baseClass = UITableViewCell; frame = (0 285; 320 99); ......
~~~

于是，从class-dump的文件中找到CTMessageCell的头文件：
这时就要火眼金睛啦。找到以下信息：

~~~
@property(retain, nonatomic) APChatMedia *voiceObj; // @synthesize voiceObj=_voiceObj;
@property(copy, nonatomic) NSString *timeLine; // @synthesize timeLine=_timeLine;

- (void)playAudio;
~~~

可以直接在cycript中调用来验证数据是不是要找的。

这个APChatMedia，很有意思。看下头文件。

~~~
@interface APChatMedia : NSObject
@property(retain, nonatomic) NSData *data; // @synthesize data=_data;
@property(retain, nonatomic) NSString *url; // @synthesize url=_url;
~~~

url可以获取到一个字符串。开始看到url我还很高兴，难道就这么简单，难道这就是下载语音文件的url，可惜不是啊）

~~~
cy# [#0x3022400 voiceObj]
#"<APChatMedia: 0xb226710>"
cy# [#0xb226710 url]
@"ww4fd1rfRDShBo_4K6rqfwAAACMAAQED"
~~~

又看到APChatMedia的data，难道这就是语音数据，可惜这个值总是nil。

看来得找别的办法，看看playAudio这个方法吧。

## 上lldb和IDA

lldb中找到 CTMessageCell playAudio 的地址，下断点，点击一条语音，果然断下来。

分析playAudio的代码，内部会调用 APPlayManager 的play:FinishCallback。

![playFinishCallback](http://d.pr/i/1jTaR+)

APChatMedia会作为第一个参数传进入。

~~~
(lldb) br s -a 0x00D3EFD6
Breakpoint 1: where = AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118, address = 0x00d3efd6
(lldb) c
error: Process is running.  Use 'process interrupt' to pause execution.
Process 6235 stopped
* thread #1: tid = 0x58da9, 0x00d3efd6 AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00d3efd6 AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet + 118
AlipayWallet`___lldb_unnamed_function68838$$AlipayWallet:
->  0xd3efd6 <+118>: blx    0xe0bb50                  ; ___lldb_unnamed_function73268$$AlipayWallet
    0xd3efda <+122>: mov    r0, r6
    0xd3efdc <+124>: blx    0xe0bb4c                  ; ___lldb_unnamed_function73267$$AlipayWallet
    0xd3efe0 <+128>: mov    r0, r5
(lldb) po $r0
<APPlayManager: 0xce984f0>

(lldb) p (char*)$r1
(char *) $1 = 0x021535fd "play:finishCallback:"
(lldb) po $r2
<APChatMedia: 0xc7e7b90>
~~~

到APPlayManager的play:FinishCallback看下，发现会从VoiceCache中获取音频数据。

~~~
- (id)queryVoiceDataForKey:(id)arg1 formatType:(unsigned int)arg2;
~~~

~~~
> VoiceCache.queryVoiceDataForKey:formatType:
lldb) p (char*)$r1
(char *) $18 = 0x020f55b3 "queryVoiceDataForKey:formatType:"
(lldb) po $r2
9atdHG1cSFKJyb8yqntaaQAAACMAAQED

(lldb) p $r3
(unsigned int) $20 = 1
~~~

![VoiceCache](http://d.pr/i/13z9A+)

其实到这里，queryVoiceDataForKey 返回的 NSData 就是要获取的音频数据了。保存下来，拿到电脑上就行啦。

## 步骤总结

1. CTMessageCell.playAudio
2. APPlayManager.playFinishCallback  (param : [CTMessageCell voiceObj])
3. APVoiceManager.playAudioWithCloudId:resumeActive:downLoadHandler:playHandler:
4. VoiceCache.queryVoiceDataForKey:formatType:


## 如何获取语音的时间戳

有了语音数据，如何保存个合适的名字。因为分享会有很多语音，需要区分出语音的先后（支付宝的收藏又是体验很差）。

于是看CTMessageCell的头文件，再看父类PKCell，可以看到有聊天对方的信息，

~~~
@property(retain, nonatomic) APContactInfo *contactInfo; // @synthesize contactInfo=_contactInfo;
~~~

再看父类PKBaseCell，会发现有个

~~~
@property(retain, nonatomic) NSDictionary *chatDataSource; // @synthesize chatDataSource=_chatDataSource;
~~~

cycript打印出来：

~~~
chatDataSource
cy# [#0x319c400 chatDataSource]
@{"alignmentType":0,"templateData":@{"l":12,"v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED"},"id":"12","originId":"12","data":@{"displayName":"everettjf","sessionId":"2088002664597371","bizImage":"Local_Image_CHAT.left","hintName":"everettjf","timeLine":#"2015-12-24 15:56:27 +0000","HeadIcon":"http://tfs.alipayobjects.com/images/partner/T1IJphXc4XXXXXXXXX_160X160","action":"0","seed":"2088002664597371@145097258940385","cellSelected":"0","userType":"1","userID":"2088122631212590","v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED","bizMemo":"[\xe8\xaf\xad\xe9\x9f\xb3]","fromUId":"2088002664597371","l":12,"fromLoginId":"eve***@outlook.com","bizType":"CHAT","bizRemind":"","toUId":"2088122631212590","clientMsgID":"2088002664597371@145097258940385","link":"","msgID":151224235627370001,"toLoginId":"","localId":6},"headerText":"Thursday 11:56 PM","msgType":0}
~~~

可以看到 `timeLine` 就是这条信息的时间戳。


# 源码

好了，大功告成，写个tweak吧。

把保存的代码放到了收藏按钮中。hook 收藏的方法 `- (void)collectMenu:(id)arg1`。

参见代码：

[https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver)

# 补充

## 音频格式
语音格式，把语音复制出来后，用二进制编辑工具iHex打开，可以看到是wav格式。

## Wifi下自动下载语音

上面我们每次都从VoiceCache中获取音频数据，应该是因为在Wifi下，语音会自动下载，下载后自动就放到了VoiceCache中。

通过可以在 APVoiceManager 的下面方法增加断点，就可以发现每次都自动下载，具体就不分析了。

~~~
- (void)downLoadAudioWithCloudId:(id)arg1 downLoadHandler:(CDUnknownBlockType)arg2;
~~~


# 总结

虽然远没有《iOS应用逆向工程》最后一章的例子复杂，但也作为自己看完这本书的小小的句号吧，既是句号，也是新的起点。这本书的内容也只是引导自己走进了iOS逆向的大门，入门而已。

期待未来……

