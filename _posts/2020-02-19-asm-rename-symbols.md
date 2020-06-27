---
layout: post
title: "使用 __asm__ 重命名符号"
categories:
  - 
tags:
  - 
comments: true
---

objc 源码中有如下代码 `__asm__("_objc_retain")`，这个`__asm__`是啥来？

<!-- more -->

## 发现

源码中如下

![](/media/15820819662136.jpg)

> objc 源码下载 https://opensource.apple.com/tarballs/objc4/

搜索一番，发现是可以rename symbol，写个测试代码：

```
#include <stdio.h>
void foo(void) __asm__("_objc_release");
void foo(void)  {
    printf("hello world");
}
int main(int argc, const char * argv[]) {
    foo();
    return 0;
}
```


调试看下

![](/media/15820826016870.jpg)

从上图可知，callstack中的symbol不是 foo，而是 _objc_release。

## 变量

从下面的链接又可知，还可以rename变量的symbol。

```
int counter __asm__("counter_v1") = 0;
```

> http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0491f/Cacgegch.html



## 总结

似乎可以拿来给dylib做个简单的export symbol混淆？

![](/media/15820829854361.jpg)



## 参考

- http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.kui0097a/armcc_bcfggcdh.htm
- http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0491f/Cacgegch.html
- https://stackoverflow.com/questions/1034852/adding-leading-underscores-to-assembly-symbols-with-gcc-on-win32

## 交流群

是的，我又创建交流群了～一个人探索这些偏底层的技术细节，独乐乐不如众乐乐，大家一起探索一起交流。如果群满了，加我微信 everettjf，备注：加群。

![](/media/15817739945151.jpg)


广告时间到。

抖音团队招iOS开发，初级、中级、高级开发都有需要，欢迎随时联系我（ 微信：everettjf ），`北京、深圳`可以直接来我的部门，`上海`可以推荐到同事部门。工作内容就是`抖音iOS App的业务、性能、稳定性等方方面面`的开发。`入职后的方向看你的兴趣`。

如果不好意思联系我，可以直接扫描下面的二维码选择职位投递。

![](/media/15814340338261.jpg)