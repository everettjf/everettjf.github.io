---
layout: post
title: "Rename Symbols Using __asm__"
tags:
  - assembly
  - symbol
  - obfuscation
  - C
  - low-level

comments: true
---

objc source code has code below `__asm__("_objc_retain")`, what is this `__asm__`?

<!-- more -->

## Discovery

Source code as below

![](/media/15820819662136.jpg)

> objc source code download https://opensource.apple.com/tarballs/objc4/

After searching, discovered can rename symbol, write test code:

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


Debug to see

![](/media/15820826016870.jpg)

From figure above can know, symbol in callstack is not foo, but _objc_release.

## Variables

From link below also can know, can rename variable's symbol.

```
int counter __asm__("counter_v1") = 0;
```

> http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0491f/Cacgegch.html



## Summary

Seems can use to do simple export symbol obfuscation for dylib?

![](/media/15820829854361.jpg)



## References

- http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.kui0097a/armcc_bcfggcdh.htm
- http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0491f/Cacgegch.html
- https://stackoverflow.com/questions/1034852/adding-leading-underscores-to-assembly-symbols-with-gcc-on-win32


---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
