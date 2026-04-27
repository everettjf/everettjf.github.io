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
