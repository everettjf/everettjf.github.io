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


---

大家喜欢的话，就关注下订阅号，以示鼓励：

![](/images/fun.png)
