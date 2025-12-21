---
layout: post
title: "A Method to Hook C++ Static Initializers"
categories:
  - Skill
tags:
  - performance
  - hook
comments: true
---



First addition: static initializers in title should actually be called `C++ static initializers and C/C++ __attribute__(constructor) functions`.


Use MachOView to open a MachO file, in most cases will see this section `__mod_init_func` .

![](/media/15029043382372.jpg)


<!-- more -->

# What Is This Section's Purpose?

From name roughly guess, module initializer functions, roughly this meaning.

Can find mod_init_func related text in dyld's source code:

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

Note: When debugging will find, dyld doesn't execute all Initializers by calling runDyldInitializers, but through `void ImageLoaderMachO::doModInitFunctions(const LinkContext& context)` to execute. But code above when first searching, can let us have a rough impression of mod_init_func.


Through other materials, can know there are many ways to make code produce corresponding Initializer.


# What Methods Can Produce Initializer?

## 1. __attribute((constructor))

```
__attribute__((constructor)) void myentry(){
    NSLog(@"constructor");
}
```

## 2. Global Variable Initialization Needs to Execute Code


Here mainly for C++ (or Objective C++) source file extensions are .cpp .cxx or .mm . Global variables mentioned here include static modified with scope only in current file, also include not static modified.

Global variable initialization if involves following situations, will produce corresponding entry in mod_init_func:

(1) Need to execute C function

```
bool initBar(){
    int i = 0;
    ++i;
    return i == 1;
}

static bool globalBar = initBar();
bool globalBar2 = initBar();
```

(2) Need to execute C++ class constructor

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


(3) Need to construct Objective-C class

```
static NSDictionary * dictObject = @{@"one":@"1"};
NSDictionary * dictObject2 = @{@"one":@"1", @"two":@"2"};
```

(4) struct for C++ can also be considered a type of class

This code actually executes CGRect's constructor, very hidden~ hard to guard against~

```
CGRect globalRect = CGRectZero;
```

(5) Indirectly causes function execution

Code below indirectly causes running description method when initializing globalArray.

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

(6) Others

Various other postures.


# Why Care About These

Since currently most iOS Apps only use static libraries, large amounts of third-party or internal C++ code need static linking, code above indirectly increases main program's execution time before main function.

If dynamic library, and loaded at startup stage, these code still affect startup performance.


# Look at backtrace

After adding breakpoint backtrace, can see dyld's call stack:

![](/media/15029043722431.jpg)


# Compiler Merge Rules


All initializers in the same file automatically produce one Initializer, similar to handing all initialization work in a file to a newly created function.

If initializing many global variables in one file, can find: finally only produces one entry in mod_init_func segment. And this entry's symbol is like this:

```
frame #3: 0x00000001000b8854 ModFuncInitApp`_GLOBAL__sub_I_TestClass.mm + 24 at TestClass.mm:0
```

Similar to generating a function named `_GLOBAL__sub_I_TestClass.mm`.



# How to Hook, First Find Call Source

First look at call source,

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
    frame #10: 0x00000001001aa488 dyld`dyld::initializeMainExecutable() + 160
    frame #11: 0x00000001001ae8f4 dyld`dyld::_main(macho_header const*, unsigned long, int, char const**, char const**, char const**, unsigned long*) + 3892
    frame #12: 0x00000001001a9044 dyld`_dyld_start + 68
```



Through stack, can see dyld's doModInitFunctions will call each file's Initializer. Find this function from dyld's source code:


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

Note these three lines:

```
Initializer* inits = (Initializer*)(sect->addr + fSlide);
Initializer func = inits[i];
func(context.argc, context.argv, context.envp, context.apple, &context.programVars);

```

Can see each entry in mod_init_func is called as a function address, function type is Initializer. Then find Initializer's prototype:

```
	typedef void (*Initializer)(int argc, const char* argv[], const char* envp[], const char* apple[], const ProgramVars* vars);
```


# Think How to Hook

Since each address in mod_init_func is a function address, and prototypes are all the same. Then we find a way to replace all addresses in mod_init_func with our own function addresses.

First define our own function:

```
void myInitFunc_Initializer(int argc, const char* argv[], const char* envp[], const char* apple[], const struct MyProgramVars* vars){
    printf("my init func\n");

}
```

Then the question is, how to make dyld when reading mod_init_func's data, read our own myInitFunc_Initializer?

(1) First, notice `__mod_init_func section` is located in `__DATA segment`. __DATA segment is data segment, can be modified at runtime.
![](/media/15029047838257.jpg)

(2) Second, is find a timing, earlier than dyld reading these Initializers.

When using Objective C's +load method, notice documentation writes:

```
The order of initialization is as follows:

- All initializers in any framework you link to.
- All +load methods in your image.
- All C++ static initializers and C/C++ __attribute__(constructor) functions in your image.
- All initializers in frameworks that link to you.
```

`+load methods` are actually earlier. Then it's easy. In any +load method find mod_init_func segment's address in memory after process loads, change all data to myInitFunc_Initializer's address.



# How to Modify mod_init_func Data

Use getsectiondata function can get mod_init_func segment's memory address, directly modify.

Code:

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
        // Can save original address here
        
        memory[idx] = (MemoryType)myInitFunc_Initializer; // Replace with our own Initializer
    }
```



# How to Call Original Initializer?

Thought and thought, didn't think of way to add method to record corresponding original function address for myInitFunc_Initializer. Suddenly thought, don't care about call order, record all original function addresses, then each time myInitFunc_Initializer is called, call original functions one by one.

Still look at code.


```
static std::vector<MemoryType> *g_initializer; // Record each original function address
static int g_cur_index;
```

Then, in our own Initializer get each original function address one by one, call and calculate time.

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

Due to ASLR, can't only record function's address, also need to record ASLR's address. For later locating function address through symbol file.

ASLR offset (precisely, ASLR offset base address, thanks [Joy__](http://www.jianshu.com/u/9c51a213b02e) for pointing out) is variable `mhp` in code above (that is mach_header_64's dli_fbase).

# Fluctuating Logs Appear, How to Locate to File?

With symbol file, put app file and dsym in same directory, can locate to file.

```
atos -o Demo.app/Demo 0x100a1a47c -l 0x100018000

_GLOBAL__sub_I_XXXXX.cpp (in Demo) + 1

```


Detailed reference this article 

- <http://www.jamiegrove.com/software/fixing-bugs-using-os-x-crash-logs-and-atos-to-symbolicate-and-find-line-numbers>
or
- <https://everettjf.github.io/2015/09/09/ios-plcrashreporter#dsym>

# Code

<https://github.com/everettjf/Yolo/tree/master/HookCppInitilizers>


# Summary

Locating is indeed troublesome, but using this method can locate from logs those Initializers with large time fluctuations in real App usage.

Each Initializer takes very little time, but over time, various Initializers that don't need to execute at App startup stage quietly came in. The power of the masses is great.




