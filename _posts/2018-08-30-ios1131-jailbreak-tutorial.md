---
layout: post
title: "iOS 11.3.1 越狱步骤笔记"
categories:
  - 越狱
tags:
  - 逆向
comments: true
---

逆向工程可以让我们对系统的原理理解的更深刻，也可以让我们去窥视感兴趣的App，很好玩，也可能很邪恶。

目前（2018年8月30日）普通人能接触到的最新的可越狱的iOS版本是iOS11.3.1，可以在 <https://canijailbreak.com/> 上看到，这篇文章就简单讲下iOS11.3.1的越狱步骤，为未来我们以性能优化为目的的逆向工作做铺垫。

<!-- more -->

# 环境

今天刚拿到了一部 iPhone6S iOS11.3.1。理论上这篇文章对 iOS11.2 到 iOS11.3.1 都适用。

# 工具准备

## 工具1:越狱IPA

首先在 <https://canijailbreak.com/> 找到对应系统的工具，点击 Electra，打开越狱工具 Electra 的官方网站。
![](/media/15355597001462.jpg)

<https://coolstar.org/electra/>


![](/media/15355599519362.jpg)

这里有两个版本的工具都可以完成越狱，看起来是利用的系统漏洞不同，但最终效果应该是一样的（具体有什么区别，我还没深究）。点击 Download（Dev Account），会下载下来 Electra1131-1.0.3-mptcp.ipa 。


## 工具2:重签名

重签名工具很多种，这里使用<https://dantheman827.github.io/ios-app-signer/>

![](/media/15355603167027.jpg)

## 工具3:安装IPA

将IPA安装到iPhone的方法也多种多样，这里使用苹果官方的 Apple Configurator 2 <https://itunes.apple.com/us/app/apple-configurator-2/id1037126344?mt=12>

![8207AF94-1095-4428-9DF6-AD65C214D07B](/media/8207AF94-1095-4428-9DF6-AD65C214D07B.png)

# 开始越狱

由于我们选择的Electra需要 com.apple.developer.networking.multipath 权限，以前安装IPA使用的Impactor不会自动添加这个权限到bundle id，因此我们需要手动来操作。

## 证书创建
打开开发者网站，https://developer.apple.com/，创建一个Distribution证书。创建过程就不多说了。
![](/media/15355608373060.jpg)

## 创建App IDs
![](/media/15355609710371.jpg)

注意选择Multipath
![](/media/15355609398145.jpg)


## 设备UDID加入

设备UDID可通过iTunes获取。

![](/media/15355609992836.jpg)

## 生产ProvisioningProfile

可以创建AdHoc类型。

![](/media/15355610949442.jpg)

得到 myios11iphone6s.mobileprovision。

## 重签名

![](/media/15355612353562.jpg)

## 安装IPA

打开Apple Configurator，连接手机，把IPA拖入即可。
![8207AF94-1095-4428-9DF6-AD65C214D07B](/media/8207AF94-1095-4428-9DF6-AD65C214D07B-1.png)


## 执行越狱

点击Enable Jailbreak，等设备重启后，再点击一次。等设备重启后，再点击一次。
需要重启两次。

![](/media/15355613983264.jpg)


最后桌面上就有Cydia，可以打开了。


![](/media/15355616161428.jpg)

# 简单玩耍

1. 安装Frida，参考 <https://www.frida.re/docs/ios/#with-jailbreak> 安装Frida。
2. 安装passionfruit，有node环境后直接 `npm install -g passionfruit`
 。参考 <https://github.com/chaitin/passionfruit>。

连接手机，运行passionfruit就可以看到下图了。

![](/media/15355618057348.jpg)

点开微信看看，passionfruit真 Niubility。

![](/media/15355619106082.jpg)



# 参考

- https://canijailbreak.com/
- https://www.reddit.com/r/jailbreak/
- https://www.reddit.com/r/jailbreak/comments/8wtivo/tutorial_how_to_install_electra_1131_multi_path/
- https://www.reddit.com/r/jailbreak/comments/8woubo/tutorial_how_to_get_electra_working_1131_multipath/


# 总结

有了这台越狱设备，能玩耍的事情就多了，对探索性能优化的方法可以起到辅助作用。



欢迎关注订阅号《性能优化很有趣》：
![bukuzao](https://everettjf.github.io/images/fun.jpg)

