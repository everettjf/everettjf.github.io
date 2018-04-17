---
layout: post
title: 支付宝语音保存Tweak
categories: Skill
comments: true
---





# 背景
加入了MacTalk作者池院长的支付宝群“攻城狮之路”，已经有了三次分享（昨天第三次），分享是以语音形式进行。近期正好看完了《iOS应用逆向工程》这本书，想来可以试试写个tweak，保存聊天中的语音。

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

参见：https://everettjf.github.io/2015/12/28/simple-ios-antidebugging-and-antiantidebugging/

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


