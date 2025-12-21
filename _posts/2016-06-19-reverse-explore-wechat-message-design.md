---
layout: post
title: WeChat Chat UI Logic Implementation
categories: Skill
comments: true
---





# Background

At work I'm responsible for IM feature development, usually do a lot of research and learning on WeChat.
This article mainly focuses on WeChat iOS client interface implementation's "chat message interface" implementation.

Purpose of writing this article:
- Share WeChat's chat interface implementation method.
- Show reverse engineering main process.

PS: Initially was to solve a [small issue](https://everettjf.github.io/2016/06/18/little-chat-ui-bug-resolve) in the project that I reverse engineered WeChat.
<!-- more -->

# Preparation

Device: iPhone5 iOS 8.4 jailbroken

usbmuxd

```
➜  python-client python tcprelay.py -t 22:2222
Forwarding local port 2222 to remote port 22
......
```

ssh

```
ssh root@localhost -p 2222
```

Find executable:

```
everettjfs-iPhone:~ root# ps aux | grep /App
mobile   38363   4.4  8.5   776400  88748   ??  Ss    8:55PM   0:52.96 /var/mobile/Containers/Bundle/Application/25FB096A-8122-49B5-9304-5FDB9080D9B0/WeChat.app/WeChat
```

Sandbox path:

```
everettjfs-iPhone:~ root# cycript -p WeChat
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask]
@[#"file:///var/mobile/Containers/Data/Application/F36BD1C1-1C39-4C83-AD4B-6D9F2B976330/Documents/"]
```

Decrypt:

```
everettjfs-iPhone:~ root# clutch -i
everettjfs-iPhone:~ root# clutch -b com.tencent.xin
Finished dumping com.tencent.xin to /var/tmp/clutch/5F6CA026-C176-4FB0-9569-90F2DD251385
```

Export headers:

Here don't use class-dump-z because class-dump-z can't recognize many UIKit classes.

```
[everettjf@e w ]$ class-dump -s -S -H WeChat -o headers
```

# Initial Exploration

## Locate Controller

Open WeChat, enter a conversation with someone (that is the "chat message interface" this article studies)

```
everettjfs-iPhone:~ root# cycript -p WeChat
cy# [[[UIWindow keyWindow] rootViewController] _printHierarchy].toString()
<MMTabBarController 0x18265240>, state: appeared, view: <UILayoutContainerView 0x18265ac0>
   | <MMUINavigationController 0x1800f230>, state: appeared, view: <UILayoutContainerView 0x180cd0e0>
   |    | <NewMainFrameViewController 0x179a2400>, state: disappeared, view: <MMUIHookView 0x1827f980> not in the window
   |    | <BaseMsgContentViewController 0x179b3800>, state: appeared, view: <UIView 0x16e36c30>
   | <MMUINavigationController 0x181a40a0>, state: disappeared, view: <UILayoutContainerView 0x181a4400> not in the window
   |    | <ContactsViewController 0x17162800>, state: disappeared, view:  (view not loaded)
   | <MMUINavigationController 0x181adb10>, state: disappeared, view: <UILayoutContainerView 0x181ade00> not in the window
   |    | <FindFriendEntryViewController 0x179aec00>, state: disappeared, view:  (view not loaded)
   | <MMUINavigationController 0x18003e00>, state: disappeared, view: <UILayoutContainerView 0x18008cc0> not in the window
   |    | <MoreViewController 0x179ad400>, state: disappeared, view:  (view not loaded)
```

WeChat main interface is an MMTabBarController, has four TabBarItems, each corresponds to an MMUINavigationController. Corresponding RootViewControllers:

- WeChat NewMainFrameViewController
- Contacts ContactsViewController
- Discover FindFriendEntryViewController
- Me MoreViewController

The "chat message interface" we're focusing on is BaseMsgContentViewController (state: appeared).

## Observe Views

### Reveal

Send various types of messages in the interface, here first send: text, image, location, voice.
Use Reveal to observe, as shown:

![img](https://everettjf.github.io/stuff/eimkit/1465648981061.png)

![img](https://everettjf.github.io/stuff/eimkit/1465649157982.png)

### MMTableView

From these two images:

The entire message list is essentially an MMTableView (we ourselves generally do it this way too). From class-dumped header files can know, MMTableView is a subclass of UITableView.

```
@interface MMTableView : UITableView <MMDelegateCenterExt>
```

TableView's Cell has only one type, MultiSelectTableViewCell. **When I first saw this, I was very curious. Why not use the traditional one message one Cell method?**

```
@interface MultiSelectTableViewCell : UITableViewCell
```

### MessageNodeView

Cells are all MultiSelectTableViewCell, what distinguishes different messages is the contentView's content.

- Text message: TextMessageNodeView
- Image message: ImageMessageNodeView
- Location message: LocationMessageNodeView
- Voice message: VocieMessageNodeView (not visible in screenshot above)

Additionally, time between messages is also MultiSelectTableViewCell, just contentView is a Label about time.

### Simple Summary

Understood the basic structure of message UI, next step is finding how to create these MessageNodeViews. **Here it's easy to have a question, all messages are MultiSelectTableViewCell, how is Cell reuse implemented?** Continue exploring.


## Observe Controller

Find BaseMsgContentViewController class in class-dumped header files. Can find BaseMsgContentViewController.h file, this header file has 614 lines, shows this class's complexity. (Guess WeChat development early didn't consider later large number of requirements being added, so became today's Massive View Controller)

Here refine this action's purpose: want to know how each message in chat is created and displayed.

Observing class implementation, found some related variables and methods:

```
// Literally, should be array storing MessageNodes
NSMutableArray *m_arrMessageNodeData;
// Should be storing all supported MessageNode Class types
struct vector<Class, std::__1::allocator<Class>> m_messageNodeClass;
// This is mainly the TableView
MMTableView *m_tableView;

// Pre-create messages, interesting, will study carefully later
- (void)preCreateMessageContentNode:(id)arg1;
- (void)preCreateMessageSplitNode:(id)arg1;
- (void)preCreateMessageTimeNode:(id)arg1;

// Initialize Classes
- (void)initMessageNodeClass;
- (id)newMessageNodeViewForMessageWrap:(id)arg1 contact:(id)arg2 chatContact:(id)arg3;


// Get node count
- (unsigned int)getMsgNodeCount;
// Get node at specified index
- (id)getNodeDataByIndex:(unsigned int)arg1;
// Get message node array
- (id)GetMessageNodeDataArray;

// Add
- (void)addMessageNode:(id)arg1 layout:(BOOL)arg2 addMoreMsg:(BOOL)arg3;
- (void)addReceiveMessageNode:(id)arg1;
- (id)addSplitNode:(id)arg1 addMoreMsg:(BOOL)arg2;
- (void)addTimeNode:(id)arg1 layout:(BOOL)arg2 addMoreMsg:(BOOL)arg3;
// Remove
- (void)removeAllObjectsFromMessageNodeDatas;
- (void)removeObjectsFromMessageNodeDatas:(id)arg1;
// Update
- (void)updateMessageNodeImageLoadingPercent:(unsigned long)arg1 percent:(unsigned long)arg2;
- (void)updateMessageNodeStatus:(id)arg1;
- (void)updateMessageNodeViewForOrientation:(id)arg1;

// Some NodeView events
- (void)tagLink:(id)arg1 messageWrap:(id)arg2;
- (void)tapAppNodeView:(id)arg1;
- (void)tapFriendCard_NodeView:(id)arg1 WithContact:(id)arg2 WithMsg:(id)arg3;
- (void)tapImage_NodeView:(id)arg1;
- (void)tapLocation_NodeView:(id)arg1;
- (void)tapPushContact_NodeView:(id)arg1;
- (void)tapPushMail_NodeView:(id)arg1 withPushMailWrap:(id)arg2;
- (void)tapReader_NodeView:(id)arg1;
- (void)tapStatus_NodeView:(id)arg1;
- (void)tapText_NodeView:(id)arg1;
- (void)tapVideoStatus_NodeView:(id)arg1;
```

### NSMutableArray *m_arrMessageNodeData;

Print in cycript

```
cy# v = #0x15067600
#"<BaseMsgContentViewController: 0x15067600>"
cy# v->m_arrMessageNodeData
@[#"<CMessageNodeData: 0x15b95260>",#"<CMessageNodeData: 0x15adf260>",#"<CMessageNodeData: 0x15a4abb0>",#"<CMessageNodeData: 0x1580f190>",#"<CMessageNodeData: 0x15a49930>",#"<CMessageNodeData: 0x1589b8a0>",#"<CMessageNodeData: 0x15a41410>",#"<CMessageNodeData: 0x158783e0>",#"<CMessageNodeData: 0x15a4a3b0>",#"<CMessageNodeData: 0x15aa14f0>",#"<CMessageNodeData: 0x1475ce50>",#"<CMessageNodeData: 0x15bf9960>",#"<CMessageNodeData: 0x15b53f40>",#"<CMessageNodeData: 0x147ad9f0>",#"<CMessageNodeData: 0x15b6d240>",#"<CMessageNodeData: 0x15ba04b0>",#"<CMessageNodeData: 0x15b90050>",#"<CMessageNodeData: 0x15be7ba0>",#"<CMessageNodeData: 0x15b84eb0>"]
cy# v->m_arrMessageNodeData.count
19
```

*Prerequisite, chat messages with the other party already has many* When first opening chat message interface with the other party, can see WeChat only loads 19 messages by default.

What is CMessageNodeData?

```
@interface CMessageNodeData : NSObject
{
    int m_eMsgNodeType;
    CMessageWrap *m_msgWrap;
    UIView *m_view;
    unsigned long m_uCreateTime;
}
```

**Note, there's a UIView here**

```
@interface CMessageWrap : MMObject <IAppMsgPathMgr, ISysNewXmlMsgExtendOperation, IMsgExtendOperation, NSCopying>
{
    BOOL m_bIsSplit;
    BOOL m_bNew;
    unsigned long m_uiMesLocalID;
    long long m_n64MesSvrID;
    NSString *m_nsFromUsr;
    NSString *m_nsToUsr;
    unsigned long m_uiMessageType;
    NSString *m_nsContent;
    unsigned long m_uiStatus;
    unsigned long m_uiImgStatus;
    //.............omitting many fields.............
```

CMessageWrap is naturally the encapsulation of message data.

CMessageNodeData has a UIView *m_view variable, see what it is:

```
y# d = v->m_arrMessageNodeData
@[#"<CMessageNodeData: 0x15b95260>",#"<CMessageNodeData: 0x15adf260>",#"<CMessageNodeData: 0x15a4abb0>",#"<CMessageNodeData: 0x1580f190>",#"
.....omitting....
cy# var x = []; for(var i = 0; i < d.count;i++) x.push([d objectAtIndex:i].m_view); x
[#"<UIView: 0x1592f9c0; frame = (0 10; 320 28); layer = <CALayer: 0x147e6cc0>>",#"<TextMessageNodeView: 0x1582cca0; frame = (251 0; 60 59); layer = <CALayer: 0x158b1350>>",#"<TextMessageNodeView: 0x15a58d60; frame = (251 0; 60 59); layer = <CALayer: 0x15a3cdf0>>",#"<TextMessageNodeView: 0x15a3ba10; frame = (251 0; 60 59); layer = <CALayer: 0x15ab9ab0>>",#"<TextMessageNodeView: 0x15a31610; frame = (251 0; 60 59); layer = <CALayer: 0x15a31760>>",#"<TextMessageNodeView: 0x15a57dc0; frame = (251 0; 60 59); layer = <CALayer: 0x15a547b0
.....omitting.......
odeView: 0x159ee260; frame = (186 0; 125 59); layer = <CALayer: 0x159ee3b0>>",#"<ImageMessageNodeView: 0x15b91cd0; frame = (179.5 0; 131.5 150); layer = <CALayer: 0x15b6e8e0>>",#"<UIView: 0x15b675d0; frame = (0 10; 320 28); layer = <CALayer: 0x15be5fa0>>",#"<LocationMessageNodeView: 0x15bdaee0; frame = (50 0; 261 139); layer = <CALayer: 0x15b7d290>>",#"<TextMessageNodeView: 0x15bbf400; frame = (144 0; 167 59); layer = <CALayer: 0x15be6770>>"]
```

Can see, m_view is the UIView under MultiSelectTableViewCell's contentView.

**Here again a question: Cells displayed on screen are actually only 4, why do these CMessageNodeData's m_view all have values (not nil), did they not implement reuse? Yes, currently I found, they indeed didn't implement reuse.**

To verify, I randomly sent hundreds of various messages, then output all m_view.

```
 cy# d.count
419
cy# var x = []; for(var i = 0; i < d.count;i++) x.push([d objectAtIndex:i].m_view); x
[#"<UIView: 0x15c91540; frame = (0 10; 320 28); layer = <CALayer: 0x16096bb0>>",#"<AppUrlMessageNodeView: 0x160977e0; frame = (0 0; 327 149); layer = <CALayer: 0x16098f50>>",#"<UIView: 0x16098d70; frame = (0 10; 320 28); layer = <CALayer: 0x16099bd0>>",#"<ImageMessageNodeView: 0x1609b000; frame = (179.5 0; 131.5 150); layer = <CALayer: 0x1609a840>>",#"<ImageMessageNodeView: 0x160a3d80; frame = (
// ........omitting..................
cy# x.length
419
```

Alright, indeed all 419 m_view are not nil.

**My goodness, how can this work. But observe memory usage, and think more carefully, this solution is still acceptable. Details below.**

Reasons I thought of:

- Memory usage won't be too much (specific data below).
- Chat interface appearing with too many m_view situations are not many. And when appearing, since memory usage is acceptable, it doesn't matter.

### struct vector<Class, std::__1::allocator<Class>> m_messageNodeClass;

Here can see BaseMsgContentViewController's implementation file is BaseMsgContentViewController.mm, that is written in Objective C++.

m_messageNodeClass is related to the following method:
```
- (void)initMessageNodeClass;
```

Use Hopper to disassemble WeChat's binary:

![img](https://everettjf.github.io/stuff/eimkit/1465664951065.png)

Disassemble to C code:

```
void -[BaseMsgContentViewController initMessageNodeClass](void * self, void * _cmd) {
    r7 = &arg_C;
    sp = sp - 0xb4;
    r11 = self;
    r6 = *objc_ivar_offset_BaseMsgContentViewController_m_messageNodeClass;
    r5 = *(r11 + r6);
    r0 = *(r11 + 0xa4);
    if (r0 != r5) {
            do {
                    *(r11 + 0xa4) = r0 - 0x4;
                    r0 = *(r0 + 0xfffffffffffffffc);
                    [r0 release];
                    r0 = *(r11 + 0xa4);
            } while (r0 != r5);
            r6 = *objc_ivar_offset_BaseMsgContentViewController_m_messageNodeClass;
    }
    r8 = @selector(class);
    r0 = [MultiColumnReaderMessageNodeView class];
    r7 = r7;
    r0 = [r0 retain];
    r1 = r6 + 0x4;
    arg_B0 = r0;
    r2 = r6 + r11;
    r3 = *(r11 + r1);
    if (r3 < *(r2 + 0x8)) {
            arg_B0 = 0x0;
            *r3 = r0;
            *(r11 + r1) = *(r11 + r1) + 0x4;
    }
    else {
            void std::__1::vector<objc_class* __strong, std::__1::allocator<objc_class* __strong> >::__push_back_slow_path<objc_class* __strong>();
            [arg_B0 release];
    }
    r4 = *objc_ivar_offset_BaseMsgContentViewController_m_messageNodeClass;
    r0 = [ImageTextReaderMessageNodeView class];
	//.....omitting......
```

Is pushing all supported MessageNode Classes into this vector.

**Here can see all message types WeChat supports for display**

Manually organize pseudo code:

```
std::vector<Class> m_messageNodeClass;
m_messageNodeClass.push_back([MultiColumnReaderMessageNodeView class]);
m_messageNodeClass.push_back([ImageTextReaderMessageNodeView class]);
m_messageNodeClass.push_back([HeadImgReaderMessageNodeaView class]);
m_messageNodeClass.push_back([MessageSysNodeView class]);
m_messageNodeClass.push_back([AttributedReaderMessageNodeaView class]);
m_messageNodeClass.push_back([ReaderNewMessageNodeView class]);
m_messageNodeClass.push_back([MultiReaderMessageNodeView class]);
m_messageNodeClass.push_back([MailMessageNodeView class]);
m_messageNodeClass.push_back([MassSendMessageNodeView class]);
m_messageNodeClass.push_back([ImageMessageNodeView class]);
m_messageNodeClass.push_back([VoiceMessageNodeView class]);
m_messageNodeClass.push_back([ShortVideoMessageNodeView class]);
m_messageNodeClass.push_back([VideoMessageNodeView class]);
m_messageNodeClass.push_back([ShareCardMessageNodeView class]);
m_messageNodeClass.push_back([EmoticonMessageNodeView class]);
m_messageNodeClass.push_back([GameMessageNodeView class]);
m_messageNodeClass.push_back([VoipContentNodeView class]);
m_messageNodeClass.push_back([AppTextMessageNodeView class]);
m_messageNodeClass.push_back([AppImageMessageNodeView class]);
m_messageNodeClass.push_back([AppEmoticonMessageNodeView class]);
m_messageNodeClass.push_back([AppFileMessageNodeView class]);
m_messageNodeClass.push_back([AppUrlMessageNodeView class]);
m_messageNodeClass.push_back([AppShakeMessageNodeView class]);
m_messageNodeClass.push_back([VoiceReminderConfirmNodeView class]);
m_messageNodeClass.push_back([VoiceReminderRemindNodeView class]);
m_messageNodeClass.push_back([AppProductMessageNodeView class]);
m_messageNodeClass.push_back([AppEmoticonSharedMessageNodeView class]);
m_messageNodeClass.push_back([AppWCProductMessageNodeView class]);
m_messageNodeClass.push_back([AppWCCardMessageNodeView class]);
m_messageNodeClass.push_back([AppTVMessageNodeView class]);
m_messageNodeClass.push_back([AppTrackRoomMessageNodeView class]);
m_messageNodeClass.push_back([AppRecordMessageNodeView class]);
m_messageNodeClass.push_back([AppNoteMessageNodeView class]);
m_messageNodeClass.push_back([AppHardWareRankMessageNode class]);
m_messageNodeClass.push_back([AppHardWareLikeNotifyMessageNode class]);
m_messageNodeClass.push_back([MultiTalkMessageNodeView class]);
m_messageNodeClass.push_back([WCPayTransferMessageNodeView class]);
m_messageNodeClass.push_back([WCPayTransferAcceptedMessageNodeView class]);
m_messageNodeClass.push_back([WCPayTransferRejectedMessageNodeView class]);
m_messageNodeClass.push_back([WCPayMessageBaseNodeView class]);
m_messageNodeClass.push_back([WCPayC2CMessageNodeView class]);
m_messageNodeClass.push_back([WCPayC2CFestivalMsgNodeView class]);
m_messageNodeClass.push_back([AppDefaultMessageNodeView class]);
m_messageNodeClass.push_back([TextMessageNodeView class]);
```

Can see, WeChat is really a huge project, supports so many message types (WeChat version I used: 6.3.19).

Look at a message, for example:
MessageSysNodeView
Inherits from BaseMessageNodeView then MMUIView


### - (void) preCreateMessageXXXXNode


```
- (void)preCreateMessageContentNode:(id)arg1;
- (void)preCreateMessageSplitNode:(id)arg1;
- (void)preCreateMessageTimeNode:(id)arg1;
```

From these three preCreateMessage methods, can guess MultiSelectTableViewCell's contentView's first layer subviews have three types:

- Specific content ContentNode
- Separator Node
- Time Node

Hopper disassembly finds corresponding code:

![img](https://everettjf.github.io/stuff/eimkit/1465666569528.png)

#### TimeNode

To go step by step, first study TimeNode's preCreate:

Since internally has code getting arg2.m_view, can basically guess arg2 is CMessageNodeData type. (Can confirm with lldb later)

Key code lines and pseudo code roughly:

```
void -[BaseMsgContentViewController preCreateMessageTimeNode:](void * self, void * _cmd, void * arg2) {
messageNodeData = arg2
if(messageNodeData.m_view == nil){
	// Fill m_view

	// Get time Node height from MMThemeManager
    r5 = [[MMThemeManager sharedThemeManager] retain];
    [[r5 getValueOfProperty:@"message_node_timeNode_height" inRuleSet:@"#message_node_view"] retain];

	UIView *timeRoot = [][UIView alloc]initWithFrame:....];

    r11 = [[MMUILabel alloc] init];
	// Various label properties

	r10 = [[UIImageView alloc] init];
	// Set ImageView various properties
}

```

Finally forms this:

![img](https://everettjf.github.io/stuff/eimkit/1465836652040.png)



#### ContentNode

Knowing how TimeNode preCreates, ContentNode is similar, just more code.

```
void -[BaseMsgContentViewController preCreateMessageContentNode:](void * self, void * _cmd, void * arg2) {

messageNodeData = arg2
if(messageNodeData.m_view == nil){
	// Still fill m_view

	// Check if message sent by self
    r5 = [[r11 m_msgWrap] retain];
    arg_14 = [CMessageWrap isSenderFromMsgWrap:r5];

	If other party's message
	r0 = [r8 newMessageNodeViewForMessageWrap:r4 contact:r5 chatContact:STK-1];
	If message sent by me
	r0 = [r8 newMessageNodeViewForMessageWrap:r6 contact:0x0 chatContact:STK-1];

	Set m_view

	//Calculate frame

	//GameNode special handling
	//Voice special handling	r2 = [VoiceMessageNodeView class];

}

```
PS: This method was very long in previous versions, current version optimized. Added newMessageNodeViewForMessageWrap method.

```
void * -[BaseMsgContentViewController newMessageNodeViewForMessageWrap:contact:chatContact:](void * self, void * _cmd, void * arg2, void * arg3, void * arg4) {

	// Here loop through each class in vector, let each class check if it's its own type
    r0 = r5->m_messageNodeClass;

	for(Class in r0){

	// First check if can create
    r4 = *(r0 + r11 * 0x4);
    if (([r4 canCreateMessageNodeViewInstanceWithMessageWrap: r2] & 0xff) != 0x0) goto loc_1609718;

	// Create
    r0 = [r4 alloc];
    r4 = arg_8;
    r6 = arg_4;
    var_0 = r6;
    r5 = [r0 initWithMessageWrap:arg_C Contact:r4 ChatContact:STK-1];

	}
}
```

#### canCreateMessageNodeViewInstanceWithMessageWrap

Look at canCreateMessageNodeViewInstanceWithMessageWrap method,

```
char +[BaseMessageNodeView canCreateMessageNodeViewInstanceWithMessageWrap:](void * self, void * _cmd, void * arg2) {
    return 0x0;
}
```
First look at all NodeViews' base class BaseMessageNodeView, default returns 0x0, that is NO. (BOOL is char in 32-bit, here returns a BOOL type)

Then look at any child NodeView class, for example: MessageSysNodeView

```
char +[MessageSysNodeView canCreateMessageNodeViewInstanceWithMessageWrap:](void * self, void * _cmd, void * arg2) {
    r4 = [arg2 retain];
    r5 = @selector(m_uiMessageType);
    if ([r4 m_uiMessageType] == 0x2710) {
            r5 = 0x1;
    }
    else {
            r0 = [r4 m_uiMessageType];
            r5 = 0x0;
            asm{ it         eq };
            if (r0 == 0x2712) {
                    r5 = 0x1;
            }
    }
    [r4 release];
    r0 = r5;
    return r0;
}

```

Can see. If m_uiMessageType (CMessageNodeData's CMessageWrap's member) is 0x2710 or 0x2712, then consider it this message type.

Then look at ImageMessageNodeView:

```
char +[ImageMessageNodeView canCreateMessageNodeViewInstanceWithMessageWrap:](void * self, void * _cmd, void * arg2) {
    r4 = [arg2 retain];
    r5 = @selector(m_uiMessageType);
    if (([r4 m_uiMessageType] == 0x3) || ([r4 m_uiMessageType] == 0xd)) {
            r5 = 0x1;
    }
    else {
            r0 = [r4 m_uiMessageType];
            r5 = 0x0;
            asm{ it         eq };
            if (r0 == 0x27) {
                    r5 = 0x1;
            }
    }
    [r4 release];
    r0 = r5;
    return r0;
}

```

Can know 0x3, 0xd, 0x27 are all images.

Many more messages, won't list all.

Finally look at TextMessageNodeView:

```
char +[TextMessageNodeView canCreateMessageNodeViewInstanceWithMessageWrap:](void * self, void * _cmd, void * arg2) {
    return 0x1;
}
```


Directly returns YES. Can see, if all messages don't match, then handle as text message. TextMessageNodeView is also the last one pushed into m_messageNodeClass.

#### initWithMessageWrap

First look at BaseMessageNodeView:


```
void * -[BaseMessageNodeView initWithMessageWrap:Contact:ChatContact:](void * self, void * _cmd, void * arg2, void * arg3, void * arg4) {
	omitting……
```

Then look at TextMessageNodeView's initWithMessageWrap:Contact:ChatContact.
Code more or less, no key code.

Just configure various View properties based on CMessageWrap.


# Continue Research

Below find way to find preCreate call source.

## Preparation

usbmuxd

```
➜  python-client python tcprelay.py -t 22:2222 1234:1234
Forwarding local port 2222 to remote port 22
Forwarding local port 1234 to remote port 1234
......
```

ssh

```
ssh root@localhost -p 2222
```

debugserver

```
everettjfs-iPhone:~ root# debugserver *:1234 -a WeChat
debugserver-@(#)PROGRAM:debugserver  PROJECT:debugserver-320.2.89
 for armv7.
Attaching to process WeChat...
Listening to port 1234 for a connection from *...
Waiting for debugger instructions for process 0.
```

lldb

```
[everettjf@e ~ ]$ lldb
(lldb) process connect connect://localhost:1234
Process 67776 stopped
* thread #1: tid = 0x214590, 0x31ef4474 libsystem_kernel.dylib`mach_msg_trap + 20, queue = 'com.apple.main-thread', stop reason = signal SIGSTOP
    frame #0: 0x31ef4474 libsystem_kernel.dylib`mach_msg_trap + 20
libsystem_kernel.dylib`mach_msg_trap:
->  0x31ef4474 <+20>: pop    {r4, r5, r6, r8}
    0x31ef4478 <+24>: bx     lr

libsystem_kernel.dylib`mach_msg_overwrite_trap:
    0x31ef447c <+0>:  mov    r12, sp
    0x31ef4480 <+4>:  push   {r4, r5, r6, r8}
```

Find offset address

```
(lldb) image list -o -f
[  0] 0x000e7000 /private/var/mobile/Containers/Bundle/Application/25FB096A-8122-49B5-9304-5FDB9080D9B0/WeChat.app/WeChat(0x00000000000eb000)
[  1] 0x031c7000 /Library/MobileSubstrate/MobileSubstrate.dylib(0x00000000031c7000)
```

See offset address after image list -o -f: 0x000e7000


## History Messages

First look at default loaded history messages when chat message interface appears.

hopper finds BaseMsgContentViewController::preCreateMessageContentNode: file offset address: 0x0160a444
![img](https://everettjf.github.io/stuff/eimkit/1465992949249.png)

Calculate real offset address (I like using ipython as calculator):

```
In [1]: hex(0x000e7000+0x0160a444)
Out[1]: '0x16f1444'
```

Set breakpoint:

```
(lldb) br s -a 0x16f1444
Breakpoint 1: where = WeChat`___lldb_unnamed_function80337$$WeChat, address = 0x016f1444
```

Then click a conversation, enter message interface. Will hit breakpoint.

Since breakpoint hit, also check preCreateMessageContentNode's parameter type:

```
(lldb) po $r0
<BaseMsgContentViewController: 0x17127c00>

(lldb) po (char*)$r1
"preCreateMessageContentNode:"

(lldb) po $r2
<CMessageNodeData: 0x1789bfb0>
```

Back to topic, use bt command to view call stack:

```
(lldb) bt
* thread #1: tid = 0x214590, 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
  * frame #0: 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat
    frame #1: 0x016f2516 WeChat`___lldb_unnamed_function80343$$WeChat + 990
    frame #2: 0x016f2bfe WeChat`___lldb_unnamed_function80345$$WeChat + 590
    frame #3: 0x016f397e WeChat`___lldb_unnamed_function80355$$WeChat + 690
    frame #4: 0x01708ac0 WeChat`___lldb_unnamed_function80565$$WeChat + 1416
    frame #5: 0x26c54b8e UIKit`-[UIViewController loadViewIfRequired] + 602
    frame #6: 0x26c548fc UIKit`-[UIViewController view] + 24
    omitting
```

Can see these methods are all called on main thread. frame#0 is preCreateMessageContentNode method. frame #1 is the method calling preCreateMessageContentNode. Let's find frame#1's method.
From memory address 0x016f2516 subtract offset address 0x000e7000 to get file offset address:

```
In [4]: hex(0x016f2516-0x000e7000)
Out[4]: '0x160b516'
```

hopper finds this method:
![img](https://everettjf.github.io/stuff/eimkit/1466097350949.png)

Find method:
![img](https://everettjf.github.io/stuff/eimkit/1466097381889.png)

This method:

```
void -[BaseMsgContentViewController addMessageNode:layout:addMoreMsg:](void * self, void * _cmd, void * arg2, char arg3, char arg4) {
```

Set breakpoint to this method's first address 0x16f2138 = 0x000e7000 + 0x0160b138: (first clear previous breakpoint)

```
In [6]: hex(0x000e7000 + 0x0160b138)
Out[6]: '0x16f2138'
```

```
(lldb) br l
Current breakpoints:
1: address = WeChat[0x0160a444], locations = 1, resolved = 1, hit count = 1
  1.1: where = WeChat`___lldb_unnamed_function80337$$WeChat, address = 0x016f1444, resolved, hit count = 1
(lldb) br delete 1
1 breakpoints deleted; 0 breakpoint locations disabled.

(lldb) br s -a 0x16f2138
Breakpoint 3: where = WeChat`___lldb_unnamed_function80343$$WeChat, address = 0x016f2138
```

Check parameters:

```
(lldb) po $r0
<BaseMsgContentViewController: 0x17127c00>
(lldb) po (char*)$r1
"addMessageNode:layout:addMoreMsg:"
(lldb) po $r2
{m_uiMesLocalID=384, m_ui64MesSvrID=7606243121581773106, m_nsFromUsr=wxi*h12~19, m_nsToUsr=wxi*t21~19, m_uiStatus=2, type=1, msgSource="(null)"}
(lldb) po [$r2 class]
CMessageWrap
(lldb) p $r3
(unsigned int) $13 = 0
(lldb) p $r4
(unsigned int) $14 = 40
```

That is BaseMsgContentViewController addMessageNode:layout:addMoreMsg method's first parameter is CMessageWrap, layout is 0, addMoreMsg is 40.

Same steps, look at remaining methods in call stack, summarize together:

```
void -[BaseMsgContentViewController preCreateMessageContentNode:](void * self, void * _cmd, void * arg2) {
void -[BaseMsgContentViewController addMessageNode:layout:addMoreMsg:](void * self, void * _cmd, void * arg2, char arg3, char arg4) {
void -[BaseMsgContentViewController initHistroyMessageNodeData](void * self, void * _cmd) {
void -[BaseMsgContentViewController initData](void * self, void * _cmd) {
void -[BaseMsgContentViewController viewDidLoad](void * self, void * _cmd) {

```

Use hopper's disassembly to look at these methods, we also found, initView and a series of init functions. For example: initTableView initializes tableView, and calls reloadData. (initData first, initView later)

## History Message Source

Look carefully

```
void -[BaseMsgContentViewController initHistroyMessageNodeData](void * self, void * _cmd) {
...
            arg_1C = r8;
            r0 = [r5 GetMessageArray];
            r7 = r7;
```

Find [r5 GetMessageArray] this line's assembly code line 0x0160bb20.

![img](https://everettjf.github.io/stuff/eimkit/1466104472059.png)

Set breakpoint at this line, then output $r0.

```
(lldb) br s -a 0x163db20 (Here I changed machines, restarted Weixin, memory offset became 0x00032000, so hex(0x0160BB20 + 0x00032000)=0x163db20)
(lldb) po $r0
<WeixinContentLogicController: 0x1582ad20>
(lldb) po (char*)$r1
"GetMessageArray"
(lldb) n
omitting
(lldb) po $r0
<__NSArrayM 0x1584bf30>(
{m_uiMesLocalID=382, m_ui64MesSvrID=4946812604026242266, m_nsFromUsr=wxi*h12~19, m_nsToUsr=wxi*t21~19, m_uiStatus=2, type=1, msgSource="(null)"} ,
{m_uiMesLocalID=383, m_ui64MesSvrID=145730894416135475, m_nsFromUsr=wxi*h12~19, m_nsToUsr=wxi*t21~19, m_uiStatus=2, type=1, msgSource="(null)"} ,
omitting
)
(lldb) po [[$r0 firstObject]class]
CMessageWrap
```

After single step execution, can also see return value $r0, that is all messages CMessageWrap.

Can know is WeixinContentLogicController class, look at this class:

```
@interface WeixinContentLogicController : BaseMsgContentLogicController
```

hopper look at WeixinContentLogicController's GetMessageArray method, found it's not there. Then it's in parent class BaseMsgContentLogicController.

```
- BaseMsgContentLogicController GetMessageArray
```

Internally calls WeixinContentLogicController GetMsg:FromID:Limit:LeftCount:LeftUnreadCount:

```
- WeixinContentLogicController GetMsg:FromID:Limit:LeftCount:LeftUnreadCount:

    r0 = [MMServiceCenter defaultCenter];
    arg_30 = 0xffffffff;
    r0 = [r0 retain];
    arg_24 = r0;
    arg_30 = 0x2;
    r2 = [CMessageMgr class];
    arg_30 = 0x3;
    r0 = [arg_24 getService:r2];
    arg_30 = 0xffffffff;
    arg_28 = [r0 retain];
    [arg_24 release];
    arg_30 = 0x4;
    asm{ stm.w      sp, {r3, r5, r6} };
    r0 = [arg_28 GetMsgByCreateTime:arg_20 FromID:arg_1C FromCreateTime:STK1 Limit:STK0 LeftCount:STK-1];
```

Roughly is get CMessageMgr from MMServiceCenter, then call CMessageMgr's GetMsgByCreateTime:arg_20 FromID:arg_1C FromCreateTime:STK1 Limit:STK0 LeftCount:STK-1 method.

There are two methods:

```
- (id)GetMsgByCreateTime:(id)arg1 FromID:(unsigned long)arg2 FromCreateTime:(unsigned long)arg3 Limit:(unsigned long)arg4 LeftCount:(unsigned int *)arg5;
- (id)GetMsgByCreateTime:(id)arg1 FromID:(unsigned long)arg2 FromCreateTime:(unsigned long)arg3 Limit:(unsigned long)arg4 LeftCount:(unsigned int *)arg5 FromSequence:(unsigned long)arg6;
```

First calls second with FromSequence method, hopper look at second method:

```
  r0 = *objc_ivar_offset_CMessageMgr_m_oMsgDB;
    r2 = *(r7 + 0x14);
    r0 = *(r6 + r0);
    arg_C = r2;
    arg_4 = r5 + 0x5;
    r5 = *(r7 + 0x10);
    arg_8 = r5;
    var_0 = r8;
    r0 = [r0 GetMsgByCreateTime:r10 FromID:arg_24 FromCreateTime:STK2 Limit:STK1 LeftCount:STK0 FromSequence:STK-1];
    r7 = r7;
    r4 = [r0 retain];
    r1 = @selector(HandleMsgList:MsgList:);
    [r6 HandleMsgList:r2 MsgList:STK3];
```

objc_ivar_offset_CMessageMgr_m_oMsgDB is     CMessageDB *m_oMsgDB;
That is calls CMessageDB's GetMsgByCreateTime:r10

PS:
![img](https://everettjf.github.io/stuff/eimkit/1466141798790.png)
>   In hopper can see many log messages, and clearly states current implementation file's filename.
Suffix is .mm, of course not just this one, WeChat has many classes implemented in Objective C++. Including message main interface's BaseMsgContentViewController.mm, and many classes in CMessageMgr below. (Guess, WeChat's early developers did a lot of Windows C++ client development. Classes starting with C...)

This CMessageMgr is also developed in Objective C++. But hopper can see GetMsgByCreateTime: internally calls

```
int -[CMessageDB GetMsg:Where:order:Limit:](int arg0) {
```

Internally calls:

```
   r11 = *objc_ivar_offset_CMessageDB_m_oMMDB;
    r0 = *(r6 + r11);
    r3 = *0x26b20d8;
    asm{ stmeq.w    sp, {r4, r10} };
    arg_8 = r5;
    r5 = r8;
    r0 = [r0 GetMessagesByChatName:r5 onProperty:r3 where:STK1 order:STK0 limit:STK-1];
```

Calls member CMMDB's GetMessagesByChatName method.

```
@interface CMessageDB : NSObject
{
    CMMDB *m_oMMDB;
}

```

CMMDB's GetMessagesByChatName method internally:

```
    res = [arg0 GetMessageTable:r11];
    r0 = [res getObjectsWhere:r10 onProperties:r4 orderBy:STK0 limit:STK-1];

```

That is calls getObjectsWhere method on CMMDB::GetMessageTable's return value.

```
void * -[CMMDB GetMessageTable:](void * self, void * _cmd, void * arg2) {
    r4 = [[CMMDB messageTableName:arg2] retain];
    r5 = [[self m_db] retain];
    r3 = [DBMessage class];
    r6 = [[r5 getTable:r4 withClass:r3] retain];
    r0 = loc_215a20c(r6, @selector(getTable:withClass:));

```

Calls m_db(    WCDataBase *m_db;)   's getTable:withClass method. Looking further is returns WCDataBaseTable type.

Look at CMMDB's header file

```

@interface CMMDB : NSObject <WCDataBaseEventDelegate>
{
    NSRecursiveLock *m_lockMMDB;
    NSMutableSet *m_setMessageCreatedTable;
    NSMutableSet *m_setMessageExtCreatedTable;
    OpLogDB *m_oplogWcdb;
    WCDataBase *m_db;
    WCDataBaseTable *m_tableContact;
    WCDataBaseTable *m_tableContactExt;
    WCDataBaseTable *m_tableContactMeta;
    WCDataBaseTable *m_tableQQContact;
    WCDataBaseTable *m_tableSendMsg;
    WCDataBaseTable *m_tableUploadVoice;
    WCDataBaseTable *m_tableDownloadVoice;
    WCDataBaseTable *m_tableRevokeMsg;
    WCDataBaseTable *m_tableEmoticon;
    WCDataBaseTable *m_tableEmoticonUpload;
    WCDataBaseTable *m_tableEmoticonDownload;
    WCDataBaseTable *m_tableEmoticonPackage;
    WCDataBaseTable *m_tableBottle;
    WCDataBaseTable *m_tableBottleContact;
    WCDataBaseTable *m_tableMassSendContact;
}
```

Is get corresponding WCDataBaseTable instance based on table type to get (here is DBMessage class), used to operate a table.

PS:
WCDataBase is encapsulation of sqlite.

```
@interface WCDataBase : NSObject <WCDBCorruptReportInterface, WCDBHandlesPoolProtocol>
{
    WCDBHandlesPool *m_handlesPool;
    struct sqlite3 *m_dbHandle;
    NSData *m_dbEncryptKey;
    BOOL m_isMemoryOnly;
    NSString *m_nsDBPath;
    NSString *m_nsDBFilePath;
    NSString *m_nsDBName;
    NSRecursiveLock *m_oLock;
    unsigned int m_databaseID;
    unsigned int m_initTime;
    id <WCDataBaseEventDelegate> m_eventDelegate;
    WCDBCorruptReport *m_corruptReport;
}

```

Further tracking calls, will reach:

```
int -[WCDataBase getObjectsOfClass:fromTable:onProperties:where:orderBy:limit:getError:](? arg0) {

```

Here is local sqlite query.

Stop here, know the general flow. But seems there's a problem, this whole chain is all done on main thread, but seems fast enough.

PS: WeChat's local sqlite database design and Objective C++ encapsulation can be studied when there's time.


## New Messages

Above found call stack when loading history chat messages when first opening chat interface.

I also want to know, call stack when new messages arrive in conversation interface. Then enter chat interface, set breakpoint again, then use another phone to send message to this account (can send to self too), then look at call stack.

First enter chat message page, then set breakpoint again to preCreateMessageContentNode method.

```
(lldb) br s -a 0x16f1444
Breakpoint 4: where = WeChat`___lldb_unnamed_function80337$$WeChat, address = 0x016f1444
(lldb) c
error: Process is running.  Use 'process interrupt' to pause execution.
Process 67776 stopped
* thread #1: tid = 0x214590, 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat, queue = 'com.apple.main-thread', stop reason = breakpoint 4.1
    frame #0: 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat
WeChat`___lldb_unnamed_function80337$$WeChat:
->  0x16f1444 <+0>: push   {r4, r5, r6, r7, lr}
    0x16f1446 <+2>: add    r7, sp, #0xc
    0x16f1448 <+4>: push.w {r8, r10, r11}
    0x16f144c <+8>: sub.w  r4, sp, #0x20
(lldb) bt
* thread #1: tid = 0x214590, 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat, queue = 'com.apple.main-thread', stop reason = breakpoint 4.1
  * frame #0: 0x016f1444 WeChat`___lldb_unnamed_function80337$$WeChat
    frame #1: 0x016f2516 WeChat`___lldb_unnamed_function80343$$WeChat + 990
    frame #2: 0x018df210 WeChat`___lldb_unnamed_function87462$$WeChat + 472
    frame #3: 0x018df44e WeChat`___lldb_unnamed_function87463$$WeChat + 398
    frame #4: 0x01f6e3a2 WeChat`___lldb_unnamed_function115325$$WeChat + 1242
    frame #5: 0x2433e5ce Foundation`__NSThreadPerformPerform + 386
    frame #6: 0x235c5fae CoreFoundation`__CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__ + 14
```

Using method above can get call stack:

```
void -[BaseMsgContentViewController preCreateMessageContentNode:](void * self, void * _cmd, void * arg2) {
void -[BaseMsgContentViewController addMessageNode:layout:addMoreMsg:](void * self, void * _cmd, void * arg2, char arg3, char arg4) {
void -[BaseMsgContentLogicController DidAddMsg:](void * self, void * _cmd, void * arg2) {
void -[BaseMsgContentLogicController OnAddMsg:MsgWrap:](void * self, void * _cmd, void * arg2, void * arg3) {
void -[CMessageMgr MainThreadNotifyToExt:](void * self, void * _cmd, void * arg2) {
__NSThreadPerformPerform
__CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__
```

Based on call stack, roughly know CMessageMgr MainThreadNotifyToExt dispatches messages. Back to CMessageMgr class.

Previous method is __NSThreadPerformPerform, can know is from other thread using perform. (perform to main thread will be added to main thread's RunLoop)

Look at MainThreadNotifyToExt's parameters. Set breakpoint at first line of code:

![img](https://everettjf.github.io/stuff/eimkit/1466238259094.png)

lldb check:

```
(lldb) po $r0
po<CMessageMgr: 0x147afbe0>

(lldb) po $r0
<CMessageMgr: 0x147afbe0>

(lldb) po (char*)$r1
"MainThreadNotifyToExt:"

(lldb) po $r2
{
    1 = 1;
    2 = "wxid_pamzqdzakikt21";
    3 = "{m_uiMesLocalID=394, m_ui64MesSvrID=8508546064571928607, m_nsFromUsr=wxi*t21~19, m_nsToUsr=wxi*h12~19, m_uiStatus=3, type=1, msgSource=\"\"} ";
}

(lldb) po [$r2 class]
__NSDictionaryM
(lldb) po [[$r2 objectForKey:@"3"] class]
CMessageWrap

(lldb) po [[$r2 objectForKey:@"2"] class]
__NSCFString

(lldb) po [[$r2 objectForKey:@"1"] class]
__NSCFString
```

Can know parameter is an NSDictionary, keys are strings 1 2 3, respectively NSString NSString and CMessageWrap.

Can know CMessageWrap is prepared on background thread.

hopper can see general flow:

```
center = [MMServiceCenter defaultCenter]
service = getService:[MMExtensionCenter class]
IMsgExt ext = service getExtension:[IMsgExt class]
Then use IMsgExt to dispatch messages.
```

IMsgExt protocol:

```
@protocol IMsgExt

@optional
- (void)OnAddMsg:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnAddMsgForSpecialSession:(NSString *)arg1 MsgList:(NSArray *)arg2;
- (void)OnAddMsgListForSession:(NSDictionary *)arg1 NotifyUsrName:(NSSet *)arg2;
- (void)OnBeginDownloadAppData:(CMessageWrap *)arg1;
- (void)OnBeginDownloadImage:(CMessageWrap *)arg1;
- (void)OnBeginDownloadVideo:(CMessageWrap *)arg1;
- (void)OnChangeMsg:(NSString *)arg1 OpCode:(unsigned long)arg2;
- (void)OnDelMsg:(NSString *)arg1;
- (void)OnDelMsg:(NSString *)arg1 DelAll:(BOOL)arg2;
- (void)OnDelMsg:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnGetNewXmlMsg:(NSString *)arg1 Type:(NSString *)arg2 MsgWrap:(CMessageWrap *)arg3;
- (void)OnModMsg:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgDownloadAppAttachExpiredFail:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgDownloadThumbFail:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgDownloadThumbOK:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgDownloadVideoExpiredFail:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgNotAddDBNotify:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnMsgNotAddDBSession:(NSString *)arg1 MsgList:(NSArray *)arg2;
- (void)OnPreAddMsg:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
- (void)OnReceiveSight:(CMessageWrap *)arg1;
- (void)OnRevokeMsg:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2 ResultCode:(unsigned long)arg3 ResultMsg:(NSString *)arg4 EducationMsg:(NSString *)arg5;
- (void)OnSendSight:(NSString *)arg1;
- (void)OnShowPush:(CMessageWrap *)arg1;
- (void)OnUnReadCountChange:(NSString *)arg1;
- (void)OnUpdateVideoStatus:(NSString *)arg1 MsgWrap:(CMessageWrap *)arg2;
@end

```

Specific details won't continue analyzing. Roughly know the flow related to UI.


# Other

## Memory Usage

WeChat's method of pre-creating message views into entities and not destroying them. Not destroying means: won't destroy when exiting interface conversation; continuously pulling down messages will continuously create. At first glance feels unreasonable, look at WeChat memory usage.

First, kill WeChat process, reopen.
![img](https://everettjf.github.io/stuff/eimkit/1466242953914.png)

In this state check memory:

![img](https://everettjf.github.io/stuff/eimkit/1466240808797.png)

RSIZE=52M

Then, enter chat interface:

![img](https://everettjf.github.io/stuff/eimkit/1466240901871.png)

RSIZE=56M

Then, send messages hard (images, text various messages), 400+ messages, pull all down.

![img](https://everettjf.github.io/stuff/eimkit/1466241021593.png)

RSIZE=81M

This way, since probability of opening many messages in one conversation is low, and memory usage is acceptable. 81M usage feels relatively low. This solution seems relatively reliable.

This solution also has performance advantages, that is don't need to repeatedly set message View's content (because preCreated), sacrifices memory, improves performance.

## ViewController

WeChat will cache ViewControllers, that is opening the same user's messages twice, ViewController's address is the same.

Should have a caching strategy, will study when there's time.


## QQ and Other Implementation Methods

To support IM interface's multiple type message display, first thought is definitely using multiple Cells. For example: TextCell, ImageCell, etc. Classic QQ, actually uses this method. Can use Reveal to see.

![img](https://everettjf.github.io/stuff/eimkit/1466241507427.png)

## Issue with Changing frame in cellForRowAtIndexPath

If using QQ's Cell method, there's a UI detail issue to note. [See this article](https://everettjf.github.io/2016/06/18/little-chat-ui-bug-resolve).


# Demo

Based on WeChat's message interface implementation above, I implemented a very simple similar mechanism interface Demo [https://github.com/everettjf/Yolo/tree/master/WeChatLikeMessageDemo](https://github.com/everettjf/Yolo/tree/master/WeChatLikeMessageDemo) .

During implementation found this mechanism has a benefit, that is when preCreating messages, can know cell's height in advance (before heightForRowAtIndexPath), very conveniently solves the Cell dynamic height issue.


# Summary

Reverse engineering lets us understand an App's implementation method (especially excellent unopen-sourced Apps), learning these excellent Apps can assist forward development.

Recommend "iOS Application Reverse Engineering" this book, and <http://iosre.com> forum.
