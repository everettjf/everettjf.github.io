---
layout: post
title: "WasmPatch开源，又一个iOS热修复框架"
categories:
  - WasmPatch
tags:
  - Patch
  - WebAssembly
  - Wasm
comments: true
---



WasmPatch 实现了 Objective-C 和 WebAssembly 相互调用，通过 把 C 代码编译为 WebAssembly, 然后App在运行时动态执行WebAssembly，间接实现了C代码动态调用和修复Objective-C方法。

目前WasmPatch只能算是一个**DEMO**，未来会进一步优化。

<!-- more -->

## 源码

源码地址：
https://github.com/everettjf/WasmPatch

具体使用方法可以先看README，详细的中文使用方法介绍后续文章再写啦。


## 如何工作

![](https://user-gold-cdn.xitu.io/2020/7/6/1732464dc1f61840?w=1330&h=754&f=png&s=195009)


断断续续写完了7篇简短的文章，计划中还有3篇，后续慢慢完成啦。

1. [第零篇/前言](https://mp.weixin.qq.com/s/U0q4n71VhIe6AawPtNVTzg)
2. [第一篇/WebAssembly快速上手](https://mp.weixin.qq.com/s/YGY7M1PjXEujAKoIOnCWtQ)
3. [第二篇/移动端动态执行WebAssembly](https://mp.weixin.qq.com/s/-sDjxWe5_Iau3fdtrTL_VQ)
4. [第三篇/动态调用ObjC方法](https://mp.weixin.qq.com/s/tVB7vdsqg4v-7T0j8BdvEQ)
5. [第四篇/动态替换ObjC方法](https://mp.weixin.qq.com/s/g3dMb8zngrYQIF5RZaIlXQ)
6. [第五篇/WasmPatch设计思路](https://mp.weixin.qq.com/s/39asXlS3Vyw8vHu7s8b2mQ)
7. 第六篇/WasmPatch关键源码解析 : TODO
8. 第七篇/WasmPatch使用方法 : TODO
9. 第八篇/WasmPatch未来规划 : TODO


## 例子

可以直接去看代码
https://github.com/everettjf/WasmPatch/blob/master/TestCase/WasmPatch-TestCase/Assets/script.bundle/objc.c

### 调用方法

```
// method call - class method
call_class_method_0("CallMe", "sayHi");
    
WAPObject word = new_objc_nsstring("I am from c program");
call_class_method_1("CallMe", "sayWord:", word);
dealloc_object(word);

// method call - instance method
WAPObject call = alloc_objc_class("CallMe");
call_instance_method_0(call,"sayHi");
dealloc_object(call);

WAPObject call1 = alloc_objc_class("CallMe");
word = new_objc_nsstring("I am from c program");
call_instance_method_1(call1,"sayWord:", word);
dealloc_object(word);
dealloc_object(call1);
```

### 替换方法

```

int my_class_ReplaceMe_request(WAPObject self, const char * cmd) {
    print_string("replaced + ReplaceMe request");
    return 0;
}

int my_class_ReplaceMe_requestfromto(WAPObject self, const char * cmd, WAPArray parameters) {
    print_string("replaced + ReplaceMe requestFrom:Two to:One");
    return 0;
}
int my_instance_ReplaceMe_request(WAPObject self, const char * cmd) {
    print_string("replaced - ReplaceMe request");
    return 0;
}

int my_instance_ReplaceMe_requestfromto(WAPObject self, const char * cmd, WAPArray parameters) {
    print_string("replaced - ReplaceMe requestFrom:Two to:One");
    return 0;
}

int entry() {
    // method replace
    replace_class_method("ReplaceMe", "request", "my_class_ReplaceMe_request");
    replace_class_method("ReplaceMe", "requestFrom:to:", "my_class_ReplaceMe_requestfromto");

    replace_instance_method("ReplaceMe", "request", "my_instance_ReplaceMe_request");
    replace_instance_method("ReplaceMe", "requestFrom:to:", "my_instance_ReplaceMe_requestfromto");
}
```

### 调用多个参数的方法

```
// many arguments
WAPArray params = alloc_array();
append_array(params, alloc_int32(10));
append_array(params, alloc_int64(666));
append_array(params, alloc_float(7.77));
append_array(params, alloc_double(200.2222));
append_array(params, new_objc_nsstring("excellent"));
append_array(params, alloc_string("WebAssembly"));
call_class_method_param("CallMe", "callWithManyArguments:p1:p2:p3:p4:p5:", params);
dealloc_array(params);
```

### 环境

- iOS/macOS.
- Tested: arm64/arm64e/x86_64 , Should work: armv7/armv7s/i386.
- C++17 standard.

## 快速体验Demo

先pod install 两个demo工程

```
cd Demo && sh podinstall_all.sh
```

- iOS demo: 打开 `Demo/WasmPatch-iOS/WasmPatch-iOS.xcworkspace`
- macOS demo: 打开 `Demo/WasmPatch-macOS/WasmPatch-macOS.xcworkspace`

## 使用方法

### 把 C 编译为 WebAssembly

我们需要安装llvm套件

```
brew update
brew install llvm
```

### 运行Demo

这是patch的C代码例子：

```
TestCase/WasmPatch-TestCase/Assets/script.bundle/objc.c
```

运行 `compile-testcase.sh` 可以把这个例子C代码编译为WebAssembly

```
cd TestCase && sh compile-testcase.sh
```

这个shell脚本内部是通过调用`Tool/c2wasm.sh`实现的。

然后 Pod install两个例子工程（iOS 和 macOS demo工程）

```
cd Demo && sh podinstall_all.sh
```

这是iOS工程 `Demo/WasmPatch-iOS/WasmPatch-iOS.xcworkspace` ，这是macOS工程 `Demo/WasmPatch-macOS/WasmPatch-macOS.xcworkspace`。


### 编译C代码为WebAssembly

```
./Tool/c2wasm.sh input.c output.wasm
```

### 加载WebAssembly

```
// header file
#import <WasmPatch/WasmPatch.h>

// ...

// call wap_load_file to load wasm file
NSString *scriptPath = [scriptBundlePath stringByAppendingPathComponent:@"objc.wasm"];
bool result = wap_load_file(scriptPath.UTF8String);
if (!result) {
    NSLog(@"failed load file %@", scriptPath);
    return;
}
```


## 安装方式

### CocoaPods集成

```
// local pod
pod 'WasmPatch', :path => '../../'

// online pod
pod 'WasmPatch'
```

### 手动集成

Drag `WasmPatch` directory into project, and configure `Header Search Path` to `WasmPatch/Classes/wap/depend/libffi/include`



## 感谢这三个项目

- wasm3 https://github.com/wasm3/wasm3
- libffi https://github.com/libffi/libffi
- JSPatch https://github.com/bang590/JSPatch

## 声明

由于热修复是个有点敏感的话题，在此再声明几点：
- 仅研究交流目的。
- 仅验证可行性。
- 不保证审核通过。
- 不保证代码稳定性。
- 不要对此项目有过高期望。

详细声明请见「第零篇/前言」哈～


## 总结

很有趣～

本文探索了WebAssembly实现iOS热修复的第一步，后续完善到上架还有很多路要走，就当抛砖啦～

