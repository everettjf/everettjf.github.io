---
layout: post
title: "一种 hook C++ static initializers 的方法"
categories:
  - Skill
tags:
  - performance
  - hook
comments: true
---



先补充：标题中 static initializers 其实应该叫做 `C++ static initializers and C/C++ __attribute__(constructor) functions`。


使用 MachOView 打开一个MachO文件，多数情况下会看到这个section `__mod_init_func` 。

![](/media/15029043382372.jpg)


<!-- more -->

# 这个section的用途是什么呢？

从名字大概猜测，module initializer functions，模块初始化函数，大概就是这个意思。

从dyld的源码中可以找到mod_init_func相关字样：

```
typedef void (*Initializer)(int argc, const char* argv[], const char* envp[], const char* apple[]);

extern const Initializer  inits_start  __asm("section$start$__DATA$__mod_init_func");
extern const Initializer  inits_end    __asm("section$end$__DATA$__mod_init_func");


static void runDyldInitializers(const struct macho_header* mh, intptr_t slide, int argc, const char* argv[], const char* envp[], const char* apple[])
{
	for (const Initializer* p = &inits_start; p < &inits_end; ++p) {
		(*p)(argc, argv, envp, apple);
	}
}
```

注意注意：调试时会发现，dyld并没有通过调用 runDyldInitializers 来执行所有Initializer，而是通过 `void ImageLoaderMachO::doModInitFunctions(const LinkContext& context)` 来执行的。但上面的代码在首次搜索时，可以让我们对mod_init_func有个大概的印象。


通过其他资料，可以知道有很多途径可以让代码产生对应的一个Initializer。


# 有哪些方法可以产生Initializer？

## 1. __attribute((constructor))

```
__attribute__((constructor)) void myentry(){
    NSLog(@"constructor");
}
```

## 2. 全局变量的初始化需要执行代码


这里主要是对于C++来说（或者Objective C++）源文件扩展名是.cpp .cxx 或.mm 。这里说的全局变量包括static修饰的作用域仅在当前文件的，也包括不被static修饰的。

全局变量的初始化如果涉及以下情况，则会在mod_init_func中产生对应的条目：

（1）需要执行C函数

```
bool initBar(){
    int i = 0;
    ++i;
    return i == 1;
}

static bool globalBar = initBar();
bool globalBar2 = initBar();
```

（2）需要执行C++类的构造函数

```
class FooObject{
public:
    FooObject(){
        // do somthing
        NSLog(@"in fooobject");
    }
    
};

static FooObject globalObj = FooObject();
FooObject globalObj2 = FooObject();
```


（3）需要构造Objective-C 类

```
static NSDictionary * dictObject = @{@"one":@"1"};
NSDictionary * dictObject2 = @{@"one":@"1", @"two":@"2"};
```

（4）struct对于C++来说也可以说是一种类

这种代码其实就执行了CGRect的构造函数，很隐蔽呀~防不胜防啊~

```
CGRect globalRect = CGRectZero;
```

（5）间接导致运行函数

下面的代码间接导致了初始化globalArray时运行了description方法。

```
NSString *description(const char *str){
    return [NSString stringWithFormat:@"hello %s",str];
}

#define E(str) description(str)


NSString* globalArray[] = {
    E("hello"),
    E("hello"),
    E("hello"),
    E("hello"),
    E("hello"),
    E("hello"),
};

NSString *globalString = E("world");
```

（6）其他

还有各式各样其他的姿势。


# 为什么要关注这些

由于目前iOS App多数都只是在使用静态库，大量第三方或内部C++写的代码需要静态链接，上面这些代码间接增加了主程序在main函数之前的执行时间。

如果是动态库，且是启动阶段加载，那这些代码依然对启动性能有影响。


# 再看backtrace

加断点后backtrace，可以看到dyld的调用堆栈：

![](/media/15029043722431.jpg)


# 编译器合并规律


同一个文件中的所有initializer会自动产生一个Initializer，类似于把一个文件中的所有初始化工作交给一个新创建的函数。

如果在一个文件中初始化大量的全局变量，可以发现：最终在mod_init_func段中只产生了一项。而且这一项的符号是下面这样：

```
frame #3: 0x00000001000b8854 ModFuncInitApp`_GLOBAL__sub_I_TestClass.mm + 24 at TestClass.mm:0
```

类似于生成了一个 名称是 `_GLOBAL__sub_I_TestClass.mm` 的函数。



# 如何 Hook，先找调用来源

先看调用来源，

```
(lldb) bt
* thread #1: tid = 0x47250, 0x00000001000b87c8 ModFuncInitApp`FooObject::FooObject(this=0x00000001000bd2d8) + 20 at TestClass.mm:15, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
  * frame #0: 0x00000001000b87c8 ModFuncInitApp`FooObject::FooObject(this=0x00000001000bd2d8) + 20 at TestClass.mm:15
    frame #1: 0x00000001000b879c ModFuncInitApp`FooObject::FooObject(this=0x00000001000bd2d8) + 28 at TestClass.mm:13
    frame #2: 0x00000001000b8804 ModFuncInitApp`::__cxx_global_var_init() + 24 at TestClass.mm:20
    frame #3: 0x00000001000b8854 ModFuncInitApp`_GLOBAL__sub_I_TestClass.mm + 24 at TestClass.mm:0
    frame #4: 0x00000001000b93e8 ModFuncInitApp`myInitFunc_Initializer(argc=1, argv=0x000000016fd4bab8, envp=0x000000016fd4bac8, apple=0x000000016fd4bb48, vars=0x00000001001d9918) + 140 at hook_cpp_init.mm:64
    frame #5: 0x00000001001bd95c dyld`ImageLoaderMachO::doModInitFunctions(ImageLoader::LinkContext const&) + 372
    frame #6: 0x00000001001bdb84 dyld`ImageLoaderMachO::doInitialization(ImageLoader::LinkContext const&) + 36
    frame #7: 0x00000001001b8f2c dyld`ImageLoader::recursiveInitialization(ImageLoader::LinkContext const&, unsigned int, char const*, ImageLoader::InitializerTimingList&, ImageLoader::UninitedUpwards&) + 368
    frame #8: 0x00000001001b7f50 dyld`ImageLoader::processInitializers(ImageLoader::LinkContext const&, unsigned int, ImageLoader::InitializerTimingList&, ImageLoader::UninitedUpwards&) + 140
    frame #9: 0x00000001001b8004 dyld`ImageLoader::runInitializers(ImageLoader::LinkContext const&, ImageLoader::InitializerTimingList&) + 84
    frame #10: 0x00000001001aa488 dyld`dyld::initializeMainExecutable() + 220
    frame #11: 0x00000001001ae8f4 dyld`dyld::_main(macho_header const*, unsigned long, int, char const**, char const**, char const**, unsigned long*) + 3892
    frame #12: 0x00000001001a9044 dyld`_dyld_start + 68
```



通过堆栈，能看到 dyld 的 doModInitFunctions 会调用每个文件中的Initializer。从dyld的源码中找到这个函数：


```
void ImageLoaderMachO::doModInitFunctions(const LinkContext& context)
{
	if ( fHasInitializers ) {
		const uint32_t cmd_count = ((macho_header*)fMachOData)->ncmds;
		const struct load_command* const cmds = (struct load_command*)&fMachOData[sizeof(macho_header)];
		const struct load_command* cmd = cmds;
		for (uint32_t i = 0; i < cmd_count; ++i) {
			if ( cmd->cmd == LC_SEGMENT_COMMAND ) {
				const struct macho_segment_command* seg = (struct macho_segment_command*)cmd;
				const struct macho_section* const sectionsStart = (struct macho_section*)((char*)seg + sizeof(struct macho_segment_command));
				const struct macho_section* const sectionsEnd = &sectionsStart[seg->nsects];
				for (const struct macho_section* sect=sectionsStart; sect < sectionsEnd; ++sect) {
					const uint8_t type = sect->flags & SECTION_TYPE;
					if ( type == S_MOD_INIT_FUNC_POINTERS ) {
						Initializer* inits = (Initializer*)(sect->addr + fSlide);
						const size_t count = sect->size / sizeof(uintptr_t);
						for (size_t i=0; i < count; ++i) {
							Initializer func = inits[i];
							// <rdar://problem/8543820&9228031> verify initializers are in image
							if ( ! this->containsAddress((void*)func) ) {
								dyld::throwf("initializer function %p not in mapped image for %s\n", func, this->getPath());
							}
							if ( context.verboseInit )
								dyld::log("dyld: calling initializer function %p in %s\n", func, this->getPath());
							func(context.argc, context.argv, context.envp, context.apple, &context.programVars);
						}
					}
				}
			}
			cmd = (const struct load_command*)(((char*)cmd)+cmd->cmdsize);
		}
	}
}
```

注意看这三句：

```
Initializer* inits = (Initializer*)(sect->addr + fSlide);
Initializer func = inits[i];
func(context.argc, context.argv, context.envp, context.apple, &context.programVars);

```

可以看到mod_init_func中的每一项，都作为一个函数地址调用，函数类型是 Initializer。那我们找到 Initializer 的原型：

```
	typedef void (*Initializer)(int argc, const char* argv[], const char* envp[], const char* apple[], const ProgramVars* vars);
```


# 想想如何hook

既然mod_init_func中的每个地址都是一个函数地址，且原型也都是一样的。那我们就想办法把mod_init_func中的所有地址都替换为我们自己的函数地址。

先定义一个自己的函数：

```
void myInitFunc_Initializer(int argc, const char* argv[], const char* envp[], const char* apple[], const struct MyProgramVars* vars){
    printf("my init func\n");

}
```

那么问题来了，如何让dyld在读取mod_init_func中的数据时，读到的是我们自己的myInitFunc_Initializer呢？

（1）首先，注意到 `__mod_init_func section` 位于 `__DATA segment`。__DATA segment是数据段，是可以在运行时修改的。
![](/media/15029047838257.jpg)

（2）其次，就是找个时机，要早于dyld读取这些Initializer。

平时在使用Objective C的+load方法时，注意到文档这么写：

```
The order of initialization is as follows:

- All initializers in any framework you link to.
- All +load methods in your image.
- All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
- All initializers in frameworks that link to you.
```

`+load methods` 竟然要更早。那就好办了。在任意一个+load方法中找到进程加载后，mod_init_func段在内存中的地址，把数据都改为 myInitFunc_Initializer 的地址。



# 如何修改mod_init_func数据

使用 getsectiondata 函数可以获取mod_init_func段的内存地址，直接修改就行了。

代码如下：

```
#ifndef __LP64__
    typedef uint32_t MemoryType;
#else /* defined(__LP64__) */
    typedef uint64_t MemoryType;
#endif /* defined(__LP64__) */

    Dl_info info;
    dladdr((const void *)hookModInitFunc, &info);
    
#ifndef __LP64__
    const struct mach_header *mhp = (struct mach_header*)info.dli_fbase;
    unsigned long size = 0;
    MemoryType *memory = (uint32_t*)getsectiondata(mhp, "__DATA", "__mod_init_func", & size);
#else /* defined(__LP64__) */
    const struct mach_header_64 *mhp = (struct mach_header_64*)info.dli_fbase;
    unsigned long size = 0;
    MemoryType *memory = (uint64_t*)getsectiondata(mhp, "__DATA", "__mod_init_func", & size);
#endif /* defined(__LP64__) */
    for(int idx = 0; idx < size/sizeof(void*); ++idx){
        MemoryType original_ptr = memory[idx];
        // 这里可以保存原来的地址
        
        memory[idx] = (MemoryType)myInitFunc_Initializer; // 替换为我们自己的Initializer
    }
```



# 怎么调用原来的Initializer？

想来想去，没想到办法给myInitFunc_Initializer增加记录对应的原函数地址的方法。突然一想，不用管调用顺序，把所有的原函数地址记录下来，然后每调用一次 myInitFunc_Initializer 就逐个调用原函数就行了。

还是看代码吧。


```
static std::vector<MemoryType> *g_initializer; // 记录每一个原函数地址
static int g_cur_index;
```

然后，在自己的Initializer中逐个获取每一个原函数地址，调用并计算耗时。

```

typedef void (*OriginalInitializer)(int argc, const char* argv[], const char* envp[], const char* apple[], const MyProgramVars* vars);

void myInitFunc_Initializer(int argc, const char* argv[], const char* envp[], const char* apple[], const struct MyProgramVars* vars){
    printf("my init func\n");
    
    ++g_cur_index;
    OriginalInitializer func = (OriginalInitializer)g_initializer->at(g_cur_index);
    
    CFTimeInterval start = CFAbsoluteTimeGetCurrent();
    
    func(argc,argv,envp,apple,vars);
    
    CFTimeInterval end = CFAbsoluteTimeGetCurrent();
}
```

# ASLR

由于ASLR的存在，不能只记录函数的地址，还需要记录ASLR的地址。用于后续通过符号文件定位出函数地址。

ASLR偏移（准确的说是，ASLR偏移后的基地址，感谢 [Joy__](http://www.jianshu.com/u/9c51a213b02e)指出）就是上面代码中的变量 `mhp`（也就是 mach_header_64 的dli_fbase）。

# 浮动的日志出来了，怎么再定位到文件？

有了符号文件，把app文件和dsym放在同一个目录下，就可以定位到文件啦。

```
atos -o Demo.app/Demo 0x100a1a47c -l 0x100018000

_GLOBAL__sub_I_XXXXX.cpp (in Demo) + 1

```


详细参考这篇文章 

- <http://www.jamiegrove.com/software/fixing-bugs-using-os-x-crash-logs-and-atos-to-symbolicate-and-find-line-numbers>
或者
- <https://everettjf.github.io/2015/09/09/ios-plcrashreporter#dsym>

# 代码

<https://github.com/everettjf/Yolo/tree/master/HookCppInitilizers>


# 总结

定位起来确实麻烦，但使用这个方法能从日志中定位到真实使用App的过程中那些耗时浮动较大的Initializer。

每个Initializer都耗时很少，但长期以来，各种不需要在App启动阶段执行的Initializer都悄无声息的进来了。群众的力量大啊。







