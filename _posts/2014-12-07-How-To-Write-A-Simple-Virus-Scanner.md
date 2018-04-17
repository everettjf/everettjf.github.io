---
layout: post
title: "如何编写简易病毒扫描程序"
tags: Security
categories: Skill
comments: true
---


- 2014年12月7日，开源中国济南城市圈活动[技术分享](http://city.oschina.net/jinan/event/194933)
- 第一次公开场合技术分享
- 将此次分享的内容整理成简单的教程

# 面向读者
- 对病毒分析感兴趣的新手

# 主要内容
- 什么是计算机病毒
- 反病毒技术的发展
- 分析计算机病毒
- 编写简易的病毒扫描程序
<!-- more -->

# 什么是计算机病毒

### 计算机病毒的定义
1. 1949年，冯诺依曼在论文《Theory of self-reproducing automata》中就第一次给出了病毒的定义：
`“能够实际复制自身的自动机”。`
1. wikipedia：计算机病毒是一种在*人为或非人为*的情况下产生的、在*用户不知情或未批准*下，能*自我复制或运行*的电脑程序。
[参考](https://en.wikipedia.org/wiki/Computer_virus)

### 第一个计算机病毒
1. 19世纪60年代，贝尔实验室3个人，在磁芯存储器上实现了2个程序，这2个程序想办法复制自身并让杀掉对方的程序，称为“磁芯大战”的游戏。

1. 公认的第一个病毒1971年诞生，叫做Creeper的程序。
[参考](https://en.wikipedia.org/wiki/Creeper_(program)).

1. Reaper是用来清除掉Creeper的类似病毒的程序。

### 病毒的主要特征
1. 传播性
1. 隐蔽性
1. 感染性
1. 潜伏性
1. 可激发性
1. 表现性
1. 破坏性
1. 变异性

### 病毒的分类

1. 木马、僵尸网络（僵尸或称肉鸡，DDOS）
1. 有害软件（蠕虫、间谍软件、流氓软件、恶作剧软件）
1. 脚本病毒（宏病毒）
1. 文件型病毒（感染文件，寄宿在可执行文件等）

此外，也可以参考开源杀毒软件[ClamAntiVirus](http://www.clamav.net/)的病毒特征的分类，如图：

![alt text](/stuff/2014/clamav_signature.png 'ClamAV Signature')

当然，以上分类并不严格，也没有一个分类标准。我认为，可以统称为*“恶意程序”*。

### 病毒的危害
1. 冲击波蠕虫
  * 2003年8月
  * DDOS攻击windowsupdate.com
  * 利用系统rpc漏洞，自动传播
  * 造成系统重启、崩溃
  * 后期产生很多变种

`病毒作者很有意思，把自己的名字Parson也写到病毒中了，于是就被抓了。`

1. 恶作剧病毒
  * 女鬼病毒
  * 2000年
  * 台湾地区发作时，曾经使人因为惊吓过度送往医院救治后身亡

1. 火焰、震网、毒区
  * 国家安全级别
  * 火焰的目标位伊朗石油部门商业情报，可追朔到2007年，2012年才被卡巴斯基发现。程序很大。
  * 震网的目标是伊朗核设施
  * 毒区的目标是伊朗工业控制数据
  * 据说伊朗某个火箭发射基地出现的一次爆炸就是病毒所致，只不过官方不承认。
  * [参考](http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1052240)

# 反病毒技术的发展

### 反病毒软件的组成

- 扫描器
- 病毒库
- 虚拟机（主要目的脱壳）

### 基于文件的第一代扫描技术

- 字符串扫描技术
- 通配符扫描技术

### 基于文件的第二代扫描技术

1. 智能扫描法
1. 近似精确匹配法
  * 多套特征
  * 校验和，分块校验，密码校验等
1. 骨架扫描法
1. 精确识别法

> ClamAV Hash-based & Body-based

### 基于内存

1. 内存特征
  * 为了应对加壳程序

### 基于行为

1. 行为特征
  * 例如：“一个程序将自己复制到system32目录下，然后自启动，最后删除自己"，这个行为就是个可疑行为。
2. 主动防御
  * 微点
  * 360安全卫士

### 云查杀

1. 利用服务器能力
2. 大量客户端上报可疑文件

### 多引擎

* 360的QVM、云引擎、小红伞、BitDefender

> 这个只是业务的组合，并没有实质性的改变。

### 人工智能
- 机器学习、神经网络等
- 360QVM(Qihoo Support Vector Machine)
- 海量的白名单及病毒样本
- [专利链接](http://www.sumobrain.com/patents/wipo/Method-system-program-identification-based/WO2012071989.html)

# 分析计算机病毒

### PE文件
- 可移植的可执行文件
- Portable Executable
- PE由Unix中的Common Object File Format（COFF）格式修改而来

![alt text](/stuff/2014/pe.png 'pe')

> * Windows  PE
> * Linux  ELF
> * MacOS  Mach-O


### 基本概念
1. IMAGE_DOS_HEADER
  * MZ
  * MS-DOS最初的架构师Mark Zbikowski
1. 导入表 Import Address Table
1. 导出表
1. 程序入口点
  * IMAGE_NT_HEADERS
1. 节
  * IMAGE_SECTION_HEADERS
1. ...

> 参考 winnt.h

### 加壳
- 可执行程序资源压缩
- 本意为保护文件
- 特殊的算法
- 在内存中解压
- 例如：UPX壳

### 在线自动分析工具

- [金山火眼](https://fireeye.ijinshan.com/)
- [VirusScan](http://www.virscan.org/)

### 静态分析

IDA Pro
PEView
PEiD
Sysinternals - string , autorun …
Dependency Walker
…

### 动态分析

OllyDbg
Windbg
WireShark
…

### 其他
- [看雪学院](http://www.pediy.com/)
- [工具分享](http://pan.baidu.com/s/1mgEduGC)

# 编写简易病毒扫描程序

### 目标
- 简易
- 扫描
- 基于文件

### 基于特征（feature-based）
1. File Size
1. Import Address Table(IAT)
1. Section
1. Resource (Version, Company)
1. Packer

### 思想

如果把“PE文件与操作系统”的关系，比作“人与世界”的关系。

1. 导入函数的类比
  * 导入函数中包含CreateFile可以看做一个人拿着一支笔，人对世界没有什么危害。
  * 导入函数CreateService就像人拿着一把小刀，对世界有了一点危害，但也不是那么大。
  * 导入函数SetWindowsHook或CreateRemoteThread就像人拿着一把枪了，对世界危害就大了。
2. 节的类比
  * .text .rdata .data .rsrc .reloc就像一个穿着正常的好人。
  ![alt text](/stuff/2014/goodman.png 'good man')
  * .upx .upx1 就像是一个坏人了。
  ![alt text](/stuff/2014/badman.png 'bad man')

### 机器学习
- SVM - Support Vector Machine 支持向量机
- 监督学习算法
- libsvm
- svm-toy.exe 简单实用

### 获取病毒样本

[virussign](http://www.virussign.com/)

卡饭或吾爱破解上也都提供了很多样本。

### 开始开发

1. 开发语言 Ruby
1. 基于三个库 rb-libsvm , pedump , sqlite3
  可以通过下面这样安装

~~~
  > gem install rb-libsvm
  > gem intall pedump
  > gem install sqlite3
~~~

### pedump获取文件属性
1. imports : string list
1. sections : string list
1. packer : string
1. version : string
1. company : string

### 将文件属性转换为向量（vector）

1. 将packer转换为vector
有packer为1，否则为0

1. version和company同上。

1. 将导入函数（imports）和节（sections）转换为向量（vector）

~~~
> 可以这样，
> 首先获取一个干净无毒的系统的system32下的所有文件的导入函数集合set(A)
> 再获取一堆病毒（例如从virussign上获取到的病毒）的所有导入函数集合set(B)
> set(C) = set(A) & set(B)
> set(D) = set(A) - set(B)
> set(E) = set(B) - set(A)
> 这样，set(C)set(D)set(E)给予不同的权值。
~~~

1. 最后将所有属性按照顺序组合成一个PE文件的vector

- 可以通过下面的命令获取到存储imports和sections的数据库。

~~~
ruby rvsfetchiat.rb --health C:/Windows/System32
ruby rvsfetchiat.rb --virus E:/train_virus/files
ruby rvsfetchiat.rb --merge
~~~

- 通过下面的命令获取一个文件的属性

~~~
ruby rvsfetchiat.rb --file C:/Windows/System32/notepad.exe
~~~

### 训练模型
指定存储要训练的正常文件的文件夹和病毒文件的文件夹。

~~~
ruby rvsscan.rb --train /Users/everettjf/Virus/train/train_health /Users/everettjf/Virus/train/train_virus
~~~

### 测试模型

~~~
ruby rvsscan.rb --scan /Users/everettjf/Virus/train/train_virus
ruby rvsscan.rb --scan /Users/everettjf/Virus/train/train_health
ruby rvsscan.rb --scan /Users/everettjf/Virus/train/test_virus
ruby rvsscan.rb --scan /Users/everettjf/Virus/train/test_health
~~~

### 剩余问题
- 训练大量的样本
- 调整参数，降低误报率
- 加入更多关键的特征，例如OEP是否被修改。
- 自学习

### 源码
[source in github](https://github.com/everettjf/RubySVMVirusScanner)

### 以上想法的来源
QVM -> xiao70 -> me(everettjf)

### 相关书籍
- 《加密与解密》
- 《计算机病毒防范艺术》
- 《病毒分析实战》
- 《黑客免杀攻防》

- 《集体智慧编程》
- 《模式分类》

---

### 资料下载

[演示文稿下载](/stuff/2014/HowToWriteASimpleVirusScanner.key)

---

### 个人总结

此次分享存在以下问题：

- 时间估计不足。
前期由于对内容多少没有把握，且讲解的时间没有经验，估计了30分钟，但结果却超过了1个小时。
- 互动不足。
几乎没有互动环节，没有与听众进行互动。
- 内容侧重点不足。
前期铺垫知识过多，导致前期时间占用较多。最后的“机器学习实现”部分讲解时间不够充分。

总体来说，相信这次分享加深了大家对病毒的了解。相信再有机会还会进行分享，为济南营造好的程序员氛围做出努力哈。


