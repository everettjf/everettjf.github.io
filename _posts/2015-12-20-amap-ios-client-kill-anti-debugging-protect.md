---
layout: post
title: Anti ptrace 一种反调试
categories: Skill
comments: true
---




学习了 <http://www.iosre.com/t/7-2-0-ios/770> 和 <http://bbs.iosre.com/t/ptrace/371> 两篇文章后，上手操作了下。
发现高德地图7.5.4版本已经没有了sub函数，而是直接在start中加入了ptrace的动态加载。如下图：

<!-- more -->

![code](http://7xibfi.com1.z0.glb.clouddn.com/uploads/default/original/2X/3/36d0c61b45367ad359fcd472574bc6da38529425.png)

想来可以直接hook dlsym，当第二个参数为"ptrace"时，返回一个假的ptrace函数。

图中可以看到高德地图并没有判断ptrace的返回值。

关键代码：

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

自己已测试，还蛮好用。
这是代码，可参考：
<https://github.com/everettjf/iOSREPractise/tree/master/AMap754/amaptest>

---

2015年12月28日补充：

上面hook dlsym是一种途径，其实直接hook ptrace更直接啦。

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

ptrace 的第一个参数当是31时，会detach调试器。所以，newptrace中可以直接返回0，也可以判断第一个参数request等于31时，更改下request的参数值。

再总结下思路：

1. 当程序运行后，使用 `debugserver *:1234 -a BinaryName` 附加进程出现 `segmentfault 11` 时，一般说明程序内部调用了ptrace 。
2. 为验证是否调用了ptrace 可以 `debugserver -x backboard *:1234 /BinaryPath` （这里是完整路径），然后下符号断点 `b ptrace`，`c` 之后看ptrace第一行代码的位置，然后 `p $lr` 找到函数返回地址，再根据 `image list -o -f` 的ASLR偏移，计算出原始地址。最后在 IDA 中找到调用ptrace的代码，分析如何调用的ptrace。
3. 开始hook ptrace。

PS：发现高德、支付宝都只是简单的调用ptrace(31,0,0,0)，并没有处理返回值。（返回值并无法带来有作用的意义）


