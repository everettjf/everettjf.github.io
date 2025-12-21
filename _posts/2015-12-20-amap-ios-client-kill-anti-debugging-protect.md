---
layout: post
title: Anti ptrace - An Anti-Debugging Method
categories: Skill
comments: true
---



After learning from <http://www.iosre.com/t/7-2-0-ios/770> and <http://bbs.iosre.com/t/ptrace/371> two articles, I tried it out.
Found that Amap (Gaode Map) version 7.5.4 no longer has a sub function, but directly adds ptrace dynamic loading in start. As shown below:

<!-- more -->

![code](http://7xibfi.com1.z0.glb.clouddn.com/uploads/default/original/2X/3/36d0c61b45367ad359fcd472574bc6da38529425.png)

I thought we could directly hook dlsym, when the second parameter is "ptrace", return a fake ptrace function.

As can be seen in the image, Amap doesn't check ptrace's return value.

Key code:

~~~
#import <substrate.h>
#import <mach-o/dyld.h>
#import <dlfcn.h>


int fake_ptrace(int request, pid_t pid, caddr_t addr, int data){
	return 0;
}

void *(*old_dlsym)(void *handle, const char *symbol);

void *my_dlsym(void *handle, const char *symbol){
	if(strcmp(symbol,"ptrace") == 0){
		return (void*)fake_ptrace;
	}

	return old_dlsym(handle,symbol);
}

%ctor{
	MSHookFunction((void*)dlsym,(void*)my_dlsym,(void**)&old_dlsym);
}

~~~

I've tested it myself, works quite well.
Here's the code for reference:
<https://github.com/everettjf/iOSREPractise/tree/master/AMap754/amaptest>

---

Added on December 28, 2015:

Hooking dlsym above is one approach, but directly hooking ptrace is more direct.

~~~
static int (*oldptrace)(int request, pid_t pid, caddr_t addr, int data);
static int newptrace(int request, pid_t pid, caddr_t addr, int data){
	return 0; // just return zero
/*
	// or return oldptrace with request -1
	if (request == 31) {
		request = -1;
	}
	return oldptrace(request,pid,addr,data);
*/
}


%ctor {
	MSHookFunction((void *)MSFindSymbol(NULL,"_ptrace"), (void *)newptrace, (void **)&oldptrace);
}

~~~

When ptrace's first parameter is 31, it will detach the debugger. So, in newptrace you can directly return 0, or check if the first parameter request equals 31, then change the request parameter value.

Summary of the approach:

1. When the program runs, using `debugserver *:1234 -a BinaryName` to attach to the process results in `segmentfault 11`, generally indicates the program internally calls ptrace.
2. To verify if ptrace is called, you can use `debugserver -x backboard *:1234 /BinaryPath` (here is the full path), then set a symbol breakpoint `b ptrace`, after `c` see ptrace's first line of code location, then `p $lr` to find the function return address, then calculate the original address based on `image list -o -f`'s ASLR offset. Finally, find the code calling ptrace in IDA, analyze how ptrace is called.
3. Start hooking ptrace.

PS: Found that Amap and Alipay only simply call ptrace(31,0,0,0), and don't handle the return value. (The return value doesn't provide meaningful information)

