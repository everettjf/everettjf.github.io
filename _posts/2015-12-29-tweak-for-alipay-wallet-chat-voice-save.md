---
layout: post
title: Alipay Wallet Chat Voice Save Tweak
categories: Skill
comments: true
---



# Background
Alipay group voice. Recently finished reading "iOS Application Reverse Engineering" this book, thought I could try writing a tweak to save voices in chats.

# Environment

1. iPhone 5, iOS 8.3, jailbroken.
2. Alipay 9.3.

Using iPhone 5 mainly because the CPU is 32-bit, 32-bit arm assembly. IDA free version can't disassemble 64-bit programs. Also, I'm a beginner, and the examples in this book are all 32-bit assembly, simpler for me.

<!-- more -->

# Remove Protection

## Get AppBundleIdentifier

Enter AlipayWallet.app directory,

~~~
everettjfs-iPhone:/var/mobile/Containers/Bundle/Application/9DB7CE45-3B4C-42A3-9D4D-49A3A5122903/AlipayWallet.app root# cat Info.plist | grep com.
    <string>com.alipay.iphoneclient</string>
~~~

## Remove ptrace and __RESTRICT section Two Protections

See: <https://everettjf.github.io/2015/12/28/simple-ios-antidebugging-and-antiantidebugging/>

After breaking the protection, can use cycript.


# Analysis

## Decrypt
Using dumpdecrypted

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


## Find Voice Corresponding UITableViewCell

Open Alipay, switch to chat interface. Keep chat with the other party having voice messages.

~~~
everettjfs-iPhone:~ root# cycript -p AlipayWallet
cy# ?expand
expand == true
cy# [[UIApp keyWindow] recursiveDescription]
@"<UIWindow: 0x2db3ae0; frame = (0 0; 320 568); gestureRecognizers = <NSArray: 0x2db3f60>; layer = <UIWindowLayer: 0x2db3c30>>
   | <UILayoutContainerView: 0xb4662d0; frame ....
   ......
~~~

Can use voice duration as keyword, for example search `1''`, can find:

~~~
<UILabel: 0xe2a1900; frame = (141 65.316; 15 14); text = '1'''; userInteractionEnabled = NO; layer = <_UILabelLayer: 0xe2a19e0>>
~~~

Then can find the corresponding UITableViewCell:

~~~
<CTMessageCell: 0x39ecc00; baseClass = UITableViewCell; frame = (0 285; 320 99); ......
~~~

So, find CTMessageCell header file from class-dump files:
Now need sharp eyes. Find the following information:

~~~
@property(retain, nonatomic) APChatMedia *voiceObj; // @synthesize voiceObj=_voiceObj;
@property(copy, nonatomic) NSString *timeLine; // @synthesize timeLine=_timeLine;

- (void)playAudio;
~~~

Can directly call in cycript to verify if the data is what we're looking for.

This APChatMedia is interesting. Look at the header file.

~~~
@interface APChatMedia : NSObject
@property(retain, nonatomic) NSData *data; // @synthesize data=_data;
@property(retain, nonatomic) NSString *url; // @synthesize url=_url;
~~~

url can get a string. Initially seeing url I was happy, could it be this simple, could this be the URL to download the voice file? Unfortunately not)

~~~
cy# [#0x3022400 voiceObj]
#"<APChatMedia: 0xb226710>"
cy# [#0xb226710 url]
@"ww4fd1rfRDShBo_4K6rqfwAAACMAAQED"
~~~

Also saw APChatMedia's data, could this be the voice data? Unfortunately this value is always nil.

Looks like need to find another way, let's look at the playAudio method.

## Use lldb and IDA

In lldb, find CTMessageCell playAudio's address, set breakpoint, click a voice, sure enough breaks.

Analyzing playAudio's code, internally calls APPlayManager's play:FinishCallback.

![playFinishCallback](http://d.pr/i/1jTaR+)

APChatMedia is passed in as the first parameter.

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

Looking at APPlayManager's play:FinishCallback, found it gets audio data from VoiceCache.

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

Actually, at this point, queryVoiceDataForKey's returned NSData is the audio data we want to get. Save it and get it to the computer.

## Step Summary

1. CTMessageCell.playAudio
2. APPlayManager.playFinishCallback  (param : [CTMessageCell voiceObj])
3. APVoiceManager.playAudioWithCloudId:resumeActive:downLoadHandler:playHandler:
4. VoiceCache.queryVoiceDataForKey:formatType:


## How to Get Voice Timestamp

With voice data, how to save with an appropriate name. Because sharing will have many voices, need to distinguish the order of voices (Alipay's favorites feature has poor UX).

So look at CTMessageCell's header file, then look at parent class PKCell, can see there's chat partner information,

~~~
@property(retain, nonatomic) APContactInfo *contactInfo; // @synthesize contactInfo=_contactInfo;
~~~

Then look at parent class PKBaseCell, will find there's

~~~
@property(retain, nonatomic) NSDictionary *chatDataSource; // @synthesize chatDataSource=_chatDataSource;
~~~

Print in cycript:

~~~
chatDataSource
cy# [#0x319c400 chatDataSource]
@{"alignmentType":0,"templateData":@{"l":12,"v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED"},"id":"12","originId":"12","data":@{"displayName":"everettjf","sessionId":"2088002664597371","bizImage":"Local_Image_CHAT.left","hintName":"everettjf","timeLine":#"2015-12-24 15:56:27 +0000","HeadIcon":"http://tfs.alipayobjects.com/images/partner/T1IJphXc4XXXXXXXXX_160X160","action":"0","seed":"2088002664597371@145097258940385","cellSelected":"0","userType":"1","userID":"2088122631212590","v":"FGAegsGqTTaAB3n80shI_gAAACMAAQED","bizMemo":"[\xe8\xaf\xad\xe9\x9f\xb3]","fromUId":"2088002664597371","l":12,"fromLoginId":"eve***@outlook.com","bizType":"CHAT","bizRemind":"","toUId":"2088122631212590","clientMsgID":"2088002664597371@145097258940385","link":"","msgID":151224235627370001,"toLoginId":"","localId":6},"headerText":"Thursday 11:56 PM","msgType":0}
~~~

Can see `timeLine` is this message's timestamp.


# Source Code

Alright, mission accomplished, write a tweak.

Put the save code in the favorite button. Hook the favorite method `- (void)collectMenu:(id)arg1`.

See code:

[https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver](https://github.com/everettjf/Yolobroccoli/AlipayWalletChatVoiceSaver)

# Additions

## Audio Format
Voice format, after copying out the voice, open with binary editor iHex, can see it's wav format.

## Auto Download Voice on WiFi

Above we always get audio data from VoiceCache, should be because on WiFi, voices automatically download, after downloading automatically put into VoiceCache.

Can add breakpoint in APVoiceManager's following method, will find it always auto downloads, won't analyze in detail.

~~~
- (void)downLoadAudioWithCloudId:(id)arg1 downLoadHandler:(CDUnknownBlockType)arg2;
~~~


# Summary

Although far from as complex as the example in the last chapter of "iOS Application Reverse Engineering", this serves as a small period after finishing this book, both a period and a new starting point. This book's content only guides me into the door of iOS reverse engineering, just getting started.

Looking forward to the future...

