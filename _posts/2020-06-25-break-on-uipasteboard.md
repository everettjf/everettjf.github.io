---
layout: post
title: "LLDB 断点 UIPasteboard 的所有方法"
categories:
  - lldb
tags:
  - iOS14
comments: true
---

iOS14 新增了一个保护隐私的功能，当前App读取其他App复制到剪贴板中的内容时，会有个短暂的提示。如下图：
![-w431](/media/15930990964673.jpg)


可以通过断点 UIPasteboard 的所有方法来检查App中与剪贴板有关的所有行为。

断点一个UIPasteboard的所有方法可以用如下命令：

```
breakpoint set -r '\[UIPasteboard .*\]$'
```

先断点到main，然后lldb终端输入以上命令。

![-w728](/media/15930999653054.jpg)

（上图只截图了一部分UIPasteboard的方法）


## 总结

嗯，大家小试一下～ 会发现除了我们自己调用，系统也偶尔会触发UIPasteboard相关调用。

很有趣～

最后，由于之前的iOS探索的群满了，但还是陆陆续续有好多盆友要加入。准备把几乎不说话的一个老群重新利用起来，如需加入，订阅号回复：wap 或者 WasmPatch （如果过期或者群满，可以加我wx）

抖音基础技术团队、抖音社交团队招iOS开发（北京、深圳、成都），如果想面试字节跳动其他岗位，都可以找我内推。如果想进一步了解岗位，也欢迎随时来聊（wx: everettjf ）

