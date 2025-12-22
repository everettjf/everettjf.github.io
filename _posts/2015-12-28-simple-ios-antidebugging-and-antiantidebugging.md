---
layout: post
title: AntiDebugging and AntiAntiDebugging
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---



Recently finished learning "iOS Application Reverse Engineering" 2nd edition, quickly tried a few Apps. Encountered a few Apps with anti-debugging code, summarizing two simple anti-debugging methods and how to remove them.
<!-- more -->

# ptrace

## Protection

Can call ptrace first in the main function.

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


## Remove Protection

Reference article <https://everettjf.github.io/2015/12/20/amap-ios-client-kill-anti-debugging-protect/>


# RESTRICT section

After learning this book, found cycript is so useful, Objective-C is so flexible...
But, some programs can't use it.


## Protection

Add to Project's `Other Linker Flags`

~~~
-Wl,-sectcreate,__RESTRICT,__restrict,/dev/null
~~~


## Remove Protection

Basic approach:

1. `ps -e | grep /var` find AppBinary path
2. Copy out AppBinary
3. Binary editor (iHex, etc.) modify __RESTRICT and __restrict to other values. (For example: __RRRRRRRR and __rrrrrrrr. Just make sure the length stays the same)
4. `ldid -S AppBinary` re-sign.
5. Install `AppSync` in Cydia.


In this article <http://www.iosre.com/t/tweak-app-app-tweak/438>


References 

1. <http://www.iosre.com/t/tweak-app-app-tweak/438>
2. <http://www.samdmarshall.com/blog/blocking_code_injection_on_ios_and_os_x.html155>
3. <http://geohot.com/e7writeup.html50>
4. <http://www.opensource.apple.com/source/dyld/dyld-210.2.3/src/dyld.cpp42>
5. <https://theiphonewiki.com/wiki/Launchd.conf_untether17>
6. <http://navillezhang.me/>
