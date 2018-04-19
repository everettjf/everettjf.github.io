---
layout: post
title: 简单的 AntiDebugging 和 AntiAntiDebugging
categories: Skill
comments: true
---





最近学习完了《iOS应用逆向工程》第二版，抓紧实战几个App。结果遇到少数App有反调试的代码，总结两个简单的反调试方法及去掉方法。
<!-- more -->

# ptrace

## 保护

可以在main函数中先调用ptrace。

~~~
#import <mach-o/dyld.h>
#import <dlfcn.h>

int main(int argc, char * argv[]) {

#ifndef DEBUG
    typedef int (*ptrace_type)(int request, pid_t pid,caddr_t addr,int data);
    void *handle = dlopen(0, 0xA);
    ptrace_type pt = (ptrace_type)dlsym(handle, "ptrace");
    pt(31,0,0,0);
    dlclose(handle);
#endif

	//...
}	

~~~


## 去掉保护

参考文章 <https://everettjf.github.io/2015/12/20/amap-ios-client-kill-anti-debugging-protect/>


# RESTRICT section

学习完这本书，发现cycript太好用了，Objective-C这语言太灵活了……
但，有些程序无法使用。


## 保护

在Project的 `Other Linker Flags` 增加

~~~
-Wl,-sectcreate,__RESTRICT,__restrict,/dev/null
~~~


## 去掉保护

基本思路就是，

1. `ps -e | grep /var` 找到AppBinary路径
2. 把AppBinary复制出
3. 二进制编辑器（iHex等）修改__RESTRICT和__restrict为其他值。（比如：__RRRRRRRR和__rrrrrrrr。保证长度不变就行啦）
4. `ldid -S AppBinary` 重签名。
5. Cydia中安装 `AppSync`。


在这篇文章中 <http://www.iosre.com/t/tweak-app-app-tweak/438>


参考文章 

1. <http://www.iosre.com/t/tweak-app-app-tweak/438>
2. <http://www.samdmarshall.com/blog/blocking_code_injection_on_ios_and_os_x.html155>
3. <http://geohot.com/e7writeup.html50>
4. <http://www.opensource.apple.com/source/dyld/dyld-210.2.3/src/dyld.cpp42>
5. <https://theiphonewiki.com/wiki/Launchd.conf_untether17>
6. <http://navillezhang.me/>

