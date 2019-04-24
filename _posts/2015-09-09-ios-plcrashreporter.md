---
layout: post
title: iOS崩溃收集与分析
categories: Skill
comments: true
---









# 简介
App上线后，如果崩溃，难道只能干瞪眼？不可能拿到用户的手机来通过Organizer导入崩溃日志，因此需要在程序崩溃时自动收集崩溃的日志，并在程序再次启动时，将崩溃日志上传到服务器。

1. 崩溃日志要关联到某一个revision的代码（如果是svn）。（一般使用持续集成Jenkins，可以通过Jenkins的BuildNumber间接关联到代码）。
2. 对应版本的dSYM符号文件。（链接时可配置生成）
<!-- more -->

# 直接调用系统函数获取崩溃时的栈信息

这种方式，能获取到简单的崩溃信息，但无法配合dSYM文件，定位到具体的哪行代码。且能获取到的崩溃类型种类有限，如果要获取更多的信息还需要更多的工作（下文中的开源的plcrashreporter已经做好了）。

- signal 进行错误信号的捕获
- NSSetUncaughtExceptionHandler 未捕获的OC异常

~~~ c

static int s_fatal_signals[] = {
    SIGABRT,
    SIGBUS,
    SIGFPE,
    SIGILL,
    SIGSEGV,
    SIGTRAP,
    SIGTERM,
    SIGKILL,
};


static int s_fatal_signal_num = sizeof(s_fatal_signals) / sizeof(s_fatal_signals[0]);

void UncaughtExceptionHandler(NSException *exception) {
    NSArray *arr = [exception callStackSymbols];//得到当前调用栈信息
    NSString *reason = [exception reason];//非常重要，就是崩溃的原因
    NSString *name = [exception name];//异常类型
}

void SignalHandler(int code)
{
    NSLog(@"signal handler = %d",code);
}

void InitCrashReport()
{
    // 1 linux错误信号捕获
    for (int i = 0; i < s_fatal_signal_num; ++i) {
        signal(s_fatal_signals[i], SignalHandler);
    }
    
    // 2 objective-c未捕获异常的捕获
    NSSetUncaughtExceptionHandler(&UncaughtExceptionHandler);
}
int main(int argc, char * argv[]) {
    @autoreleasepool {
        InitCrashReport();

        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
}

~~~ 

# 使用PLCrashReporter

## 官网 
<https://www.plcrashreporter.org/>

## 安装
可使用CocoaPods安装：
~~~ 
pod 'PLCrashReporter', '~> 1.2'
~~~ 

## 示例
~~~ c

//
 // Called to handle a pending crash report.
 //
- (void) handleCrashReport {
     PLCrashReporter *crashReporter = [PLCrashReporter sharedReporter];
     NSData *crashData;
     NSError *error;

     // Try loading the crash report
     crashData = [crashReporter loadPendingCrashReportDataAndReturnError: &error];
     if (crashData == nil) {
         NSLog(@"Could not load crash report: %@", error);
         [crashReporter purgePendingCrashReport];
         return;
     }
    
    [crashData writeToFile:[self crashDataPath] atomically:YES];

     // We could send the report from here, but we'll just print out
     // some debugging info instead
     PLCrashReport *report = [[PLCrashReport alloc] initWithData: crashData error: &error];
     if (report == nil) {
         NSLog(@"Could not parse crash report");
         [crashReporter purgePendingCrashReport];
         return;
     }

     NSLog(@"Crashed on %@", report.systemInfo.timestamp);
     NSLog(@"Crashed with signal %@ (code %@, address=0x%" PRIx64 ")", report.signalInfo.name,
           report.signalInfo.code, report.signalInfo.address);
    
    NSString *humanText = [PLCrashReportTextFormatter stringValueForCrashReport:report withTextFormat:PLCrashReportTextFormatiOS];
    
    [self WriteContent:humanText];
    
     // Purge the report
     [crashReporter purgePendingCrashReport];
    
     return;
 }

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    PLCrashReporter *crashReporter = [PLCrashReporter sharedReporter];
    NSError *error;
    
    // Check if we previously crashed
    if ([crashReporter hasPendingCrashReport])
        [self handleCrashReport];

    // Enable the Crash Reporter
    if (![crashReporter enableCrashReporterAndReturnError: &error])
        NSLog(@"Warning: Could not enable crash reporter: %@", error);
    
    return YES;
}

~~~ 

## 配合dSYM文件

~~~ 
     crashData = [crashReporter loadPendingCrashReportDataAndReturnError: &error];
~~~ 
返回的NSData是plcrashreporter私有的格式，通过官方提供的`plcrashutil`工具可转换为标准的苹果崩溃日志。

例如：

1- 打开示例工程，Command + R 运行，然后退出程序。

2- 单独通过模拟器运行plcrashreporter2。点击 Exception 触发崩溃。

3- 再次打开App，App将自动把崩溃日志记录为d.plcrash。

4- 打开Xcode菜单，Window -> Projects ，点击Derived Data右侧的小箭头，进入 /Users/everettjf/Library/Developer/Xcode/DerivedData/plcrashreportertest2-aoaojvrcqilsxqcarfmgulsddpvc/

5- 再手动进入目录 Build/Products/Debug-iphonesimulator，这里保存着 plcrashreportertest2.app.dSYM 和 plcrashreportertest2.app 文件，（为方便演示）将这两个文件复制到桌面。（注：产品发布的Archive时，也会生成对应的dSYM文件，会在另一个目录。这些目录其实都是可以配置的，一些工具例如：shenzhen或fastlane中的gym都会自动将dSYM文件夹打包成zip。）(再注：dSYM是个文件夹）

6- 复制出d.plcrash文件。我机器上在这个路径 
`/Users/everettjf/Library/Developer/CoreSimulator/Devices/319973DD-0853-494A-8688-DC73E733019D/data/Containers/Data/Application/D85F4320-1826-4EDD-8167-1197BFA5ACBA/Documents/` 
（可以看终端的输出）（不同模拟器最后的文件夹不同）也复制到桌面。

7- 转换为苹果日志格式

~~~ 
$ plcrashutil convert --format=ios d.plcrash > apple.log
~~~ 

8- dwarfdump 查看uuid

~~~ 
$ dwarfdump --uuid plcrashreportertest2.app/plcrashreportertest2
UUID: B1020E4A-07DD-35E4-B3F0-71E3B7CA49BB (x86_64) plcrashreportertest2.app/plcrashreportertest2
$ dwarfdump --uuid plcrashreportertest2.app.dSYM
UUID: B1020E4A-07DD-35E4-B3F0-71E3B7CA49BB (x86_64) plcrashreportertest2.app.dSYM/Contents/Resources/DWARF/plcrashreportertest2
~~~ 

9- 查看crashlog的uuid

~~~ 
Binary Images:
       0x107d23000 -        0x107d4efff +plcrashreportertest2 x86_64  <b1020e4a07dd35e4b3f071e3b7ca49bb> ......

~~~ 

10- 三个uuid一致，则可以分析了。

11- symbolicatecrash工具

~~~ 
    - 干脆把这个藏得这么深得工具也复制一份出来。

Xcode7.2 及以前：
/Applications/Xcode.app/Contents/SharedFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash

Xcode 7.3
/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash

cd /Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/
cp symbolicatecrash ~/Desktop
    - 设置DEVELOPER_DIR。
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
    - 导出。
$ ./symbolicatecrash apple.log plcrashreportertest2.app.dSYM > result.log
~~~ 

12- 最后，atos，其中0x107d23000可在 Binary Images:后看到。0x0000000107d24c3e是Last Exception Backtrace 中。

~~~ 
$ xcrun atos -o plcrashreportertest2.app/plcrashreportertest2 -l 0x107d23000
0x0000000107d24c3e
-[ViewController exceptionTouchUp:] (in plcrashreportertest2) (ViewController.m:84)
~~~ 


# 结语
最后这个atos还需要手动逐个输入，较麻烦。不知道Mac或iOS下有没有像windows下windbg一样的神器，以后知道了补上。

# 其他开源项目
- KSCrash
  <https://github.com/kstenerud/KSCrash>

# 参考文章
- <http://www.jamiegrove.com/software/fixing-bugs-using-os-x-crash-logs-and-atos-to-symbolicate-and-find-line-numbers>




