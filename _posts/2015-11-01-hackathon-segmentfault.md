---
layout: post
title: SegmentFault Hackathon 2015 北京站总结
categories: Essay
comments: true
---






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


