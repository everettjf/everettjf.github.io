---
layout: post
title: "Summary of the SegmentFault Hackathon 2015 Beijing Stop"
title_zh: "SegmentFault Hackathon 2015 北京站总结"
lang_original: zh
categories: Essay
comments: true
---




# Beginning
On October 24, 2015, I took part in the [SegmentFault Hackathon 2015 Beijing](http://segmentfault.com/e/1160000003736572) event.

Let me start with a picture:
![hackathon](http://d.pr/i/1c2on+)

<!-- more -->

This was the second time I participated in a hackathon.

# Looking Back at the Past

The previous time was probably around 2013, when Microsoft's Windows 8 had just come out. As a member of the Microsoft camp at the time, even though I was in Jinan (and hadn't seen much of the world), I still traveled a thousand miles to Beijing at my own expense, just to experience Microsoft Research Asia in person, just to feel Beijing's development atmosphere.

Let me briefly summarize a few things from that previous Windows 8 development hackathon that left a deep impression on me:
	
- Sitting at the same table was a programmer in his sixties, already retired, who nevertheless coded all through the night with us (though he went back to rest the next morning and didn't stay until the end of the competition — that's already very impressive). I think my purpose in coming to Beijing was fulfilled: to feel this kind of love for programming.
- The me of the past had always been a "language purist," obsessed with C++ and disdainful of other languages. Because of that, I had a soft spot for Microsoft's C++/CX and worked hard to master it, yet at the event I rarely saw anyone using C++/CX. (Most used C#, a few used Javascript. I met a fellow doing game development who used C++/CX, and we exchanged QQ contacts.)
- This Windows 8 hackathon allowed you to develop in advance, and it wasn't required to submit the app before the two-day event ended. The app I was making, I didn't keep developing all the way to submission either (a matter of perseverance, and of fooling around too much). I came to deeply understand that taking an app from idea to reality is not a simple process.

# This Competition

I learned about this competition from my friend circle a month in advance, and there was even a Jinan division. I figured, since I was already in Beijing, I'd join the Beijing one. I mentioned it to my friend M (also a colleague and former classmate), and after thinking it over, my friend said if we're going to do it, let's do it for real. So this time our team had 5 people in total.

We arrived at AngelCrunch on Zhongguancun Innovation Street. A few experts explained the spirit of the hackathon and the content of the event one by one, and then the competition began.

## Skills

- M, team leader, Android
- G, audio/video processing, NDK
- J, Android
- X, UI
- Me, Windows, iOS, Flask

The competition required the work to be submitted before 12:00 noon the next day. After discussing together, we initially settled on two points:

- Make a mobile product, only developing the Android version (which means I could only do the server side)
- We must decide what to make before 1 PM. (The event explanation finished around 10 AM)

## What to Make
We mainly came up with the following apps:

- Photo wall, a tool to conveniently make photo walls
- Voice tasks, team voice tasks
- Multi-person travel AA split payment, to conveniently calculate who paid more and who paid less
- A social mini-game, two virtual characters, adding all kinds of animation effects
- A mini-game for kids to play (I forget the specifics)

After discussion, we settled on a travel app, with the following features:

- Create travel groups.
- Use voice instead of typing.
- Each person can record expenses by voice (User A spent 100 yuan), and at the end of the trip, calculate who owes whom how much based on average spending.
- Create voice reminders (remind everyone to gather somewhere at 9 o'clock)
- Create voice diaries (one sentence per person, finally exported and merged into a single audio file)

## Division of Labor

- M, implement voice recording and recognition into text.
- G, implement merging multiple voice files.
- J, implement all the screens.
- X, several screen effects and image slicing.
- Me, server side (login, group management, voice message management, voice upload/download, calling the voice merge, etc.)

## Getting to Work

### Settle the Layout Together
We quickly sketched the basic layout of a few screens on scratch paper, and then everyone started working separately.

### Source Code Management
Collaborating among multiple people requires source code management. Except for UI, the four of us used a repository on [http://git.oschina.net/](http://git.oschina.net/).

### Everyone Working
- M found the iFlytek voice recognition SDK, hit all kinds of pitfalls in the middle, and finally got it done.
- G started with his most familiar ffmpeg development, wrote an so file, and also got the python calling example working.
- J cranked out the screens — that fast.
- X was quite skilled too.
- Me, getting things going with Flask and MongoDB. (Same as developing mostlike.link)

## Lessons Learned

- M and J ran into some problems setting up their environments, one using Android Studio and one using Eclipse. The build kept failing because some files weren't committed.
- M found lots of pitfalls in the iFlytek SDK — the parameters don't follow the usual conventions and crash easily.
- On the server side, I had long admired the name Celery but had never really used it. This time I considered using it when merging voice files. As a result, it kept showing an error message (I haven't yet found the time to study it), and after burning a huge amount of time I gave up. (Worked on it from 3 AM to 6 AM and still couldn't figure it out, so I just gave up. For the live demo, the voice clips weren't long, so the blocking merge was still tolerable.)


## The Demo

Near 9 AM the next morning, all the features finally passed (the voice reminder was abandoned due to time constraints). I lay on the table and took a short nap.
The demos started in the afternoon.

A few things that left a deep impression:

- The very first demo shocked the whole room: augmented reality, where the real-time camera video could walk you step by step through replacing the fan in a MacBook. The exploded view of the MacBook was very cool.
- Many demos in the middle were about social products. According to the judges' later summary, the judges were no longer very interested in those kinds of products.
- The demo presentation itself is also an area to control well. Some spent a lot of time at the beginning talking about their own feelings and so on and so forth, with nearly 2 minutes gone by (in principle each team had a total of 3 minutes to present). Some even talked about their life story, their indissoluble bond with programming, and the like. Others didn't control their time well and rambled too much. Some didn't know how to liven up the room (of course this is just my impression — I'm not great at livening things up either).
- I personally felt our team controlled the presentation time very well. The voice synthesis effect at the end was nice, the main features we made were shown off just right, and we inserted a little joke to liven up the room.

## An Unexpected Award

First place was the augmented-reality computer-repair work (I later learned they used Qualcomm's Vuforia SDK together with Unity3D).

Second place was voice-controlled computer use, helping disabled people operate computers. Very heartwarming, very practical. (Voice recognition, plus sending various Windows window messages.)

Several judges took turns explaining the works that left a deep impression on them, and not one mentioned us. But when the final scores came out, third prize! Everyone was very happy (classmate X went home to sleep and didn't stay until the final awards).

# Summary

I should study this [http://developer.vuforia.com/](http://developer.vuforia.com/) — very cool effects.


<!--ZH-->




# 开始
2015年10月24日参加了 [SegmentFault Hackathon 2015 北京](http://segmentfault.com/e/1160000003736572) 活动。

先上一张图片哈：
![hackathon](http://d.pr/i/1c2on+)

<!-- more -->

这是我第二次参加黑客马拉松活动。

# 回忆下过去

上一次参加大概是2013年，微软 Windows 8 刚刚出炉，当时作为微软阵营的一员，虽身处济南（没见过世面），但还是不远千里自费跑到北京，只为身临其境微软亚洲研究院，只为感受下北京的开发氛围。

简单总结下这上一次Windows 8开发黑客马拉松让我印象深刻的几件事：
	
- 有坐在同一桌有一位六旬老程序员，已经退休，但也一起通宵写了一晚上程序（不过第二天早上就回去休息了，没有等到比赛结束，已经很厉害了）。我想来北京这次的目的达到了，就是要感受这种对编程的热爱。
- 曾经的我一直属于语言派，执迷于C++，对其他语言不屑于顾。因此对微软搞的C++/CX情有独钟，苦心练剑，却在开发现场很少见到有用C++/CX的。（多数都是C#，少数Javascript。遇到一位做游戏开发的哥们使用C++/CX，互留了下QQ。）
- 这次 Windows 8 黑客马拉松是可以提前开发，且不需要两天的活动结束前提交App。自己做的App也没有坚持开发到提交（毅力问题，瞎折腾问题）。深刻理解了App的开发从想法到落实不是简单的过程。

# 这次比赛

提前1个月从朋友圈知道这次比赛了，而且济南也有赛区，想想既然来了北京就参加北京的吧，给朋友M（也是同事兼曾经同学）一说，朋友一想，要来就来真的。于是，这次比赛我们队伍共5个人。

来到中关村创业大街的天使汇。几个大牛逐个讲解黑客马拉松的精神和这次活动内容等，然后比赛就开始了。

## 技能

- M，队长，Android
- G，音视频处理，NDK
- J，Android
- X，UI
- 我，Windows，iOS，Flask

比赛要求第二天中午12点之前必须提交作品，大家一起讨论后初步确定两点：

- 做一款移动产品，只开发Android版本（只能做服务端了）
- 下午1点之前必须确定做什么。（上午10点左右活动讲解就结束了）

## 做什么
大概主要想到以下几个App：

- 照片墙，工具，方便制作照片墙
- 语音任务，团队语音任务
- 多人旅行AA付款，方便计算出谁出钱多，谁出钱少
- 社交小游戏，两个虚拟人物，增加各种动画效果
- 儿童玩的小游戏（具体忘记了）

经过讨论，确定一款旅行App，功能描述如下：

- 建立旅行群组。
- 使用语音代替打字。
- 每个人可以使用语音记账（用户A出了100元），旅行结束后，根据平均消费计算出谁该给谁多少钱。
- 创建语音提醒（提醒所有人9点到哪集合）
- 创建语音日记（每人一句话，最后导出合并为一个音频文件）

## 分工

- M，实现语音录制及识别为文字。
- G，实现多个语音合并。
- J，实现各个界面。
- X，几个见面效果及切图。
- 我，服务端（登录、群组管理、语音消息管理、语音上传下载、语音合并的调用等）

## 开工

### 界面布局一起确定
草稿纸上简单画了下几个界面的基本布局，就各自开工了。

### 源代码管理
多人合作少不了源代码管理，除UI外，我们四个使用了[http://git.oschina.net/](http://git.oschina.net/)的仓库。

### 各自开工
- M，找到了讯飞语音识别SDK，中间各种坑，终于搞定。
- G，开始了自己最熟悉的ffmpeg开发，写了个so文件，把python调用例子也搞定了。
- J，撸起界面来那个快啊。
- X，也是相当熟练了。
- 我，基于Flask和MongoDB搞起来。（与开发mostlike.link一样）

## 教训

- M和J开始搭建环境遇到些问题，一个Android Studio 一个Eclipse，由于少提交部分文件导致编译一直失败。
- M发现讯飞SDK中好多坑，参数不按套路来，容易导致崩溃。
- 服务端，以前一直是久仰Celery大名，没怎么用过，这次考虑在合并语音文件时使用。结果总是提示个错误信息（还没有抽出时间来研究），耗费了大量时间后放弃。（从凌晨3点搞到6点，还是没搞明白，就放弃了）（现场演示，语音不长，阻塞的合并还可忍受）


## 演示

第二天上午接近9点，终于所有功能通过（语音提醒由于时间原因放弃了开发）。趴桌子上睡了一小觉。
下午开始演示。

印象深刻的几件事：

- 第一个演示，就震惊了全场，虚拟现实，实时摄像头视频中可以一步一步叫你怎么给MacBook更换风扇。MacBook的展开效果图很炫。
- 中间很多演示，关于社交产品较多，根据后来评委总结，评委们对这种产品都不太感兴趣了。
- 演示的讲解也是需要把控的地方，有的开头讲解了很多自己的情怀啊、啥啊、啥啊，接近2分钟过去了（原则上每个队伍共3分钟讲解时间），有的甚至讲解起自己的身世、与编程的不解之缘啥的，有的则时间把控不好太过啰嗦。有的不会调动下现场气氛等（当然只是感觉，我也不怎么会调动气氛哈）。
- 自我感觉我们队的讲解时间把控很好，最后的语音合成效果不错，把做的主要功能展示的恰好，简单插入了点笑话，调动下现场气氛。

## 意外获奖

第一名，就是通过虚拟现实维修电脑的作品（后来了解到使用的是高通的Vuforia SDK，配合Unity3D）。

第二名，语音控制电脑，辅助残障人士操作电脑。很有爱，很实用。（语音识别，加各种Windows窗口的消息发送）

几个评委轮番讲解对自己印象深刻的作品，没有一个提到我们。但最后的评分出来，三等奖哈。大家都很高兴（X同学回家睡觉了，没有等到最后的颁奖）。

# 总结

研究下这个[http://developer.vuforia.com/](http://developer.vuforia.com/)哈，很炫的效果。

