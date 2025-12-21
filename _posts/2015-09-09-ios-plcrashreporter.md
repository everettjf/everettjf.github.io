---
layout: post
title: iOS Crash Collection and Analysis
categories: Skill
comments: true
---



# Introduction
After an app goes live, if it crashes, can you only stare blankly? It's impossible to get users' phones to import crash logs through Organizer, so you need to automatically collect crash logs when the program crashes and upload them to the server when the program starts again.

1. Crash logs need to be associated with code from a specific revision (if using svn). (Generally using continuous integration Jenkins, you can indirectly associate with code through Jenkins's BuildNumber).
2. Corresponding version's dSYM symbol file. (Can be configured to generate during linking)
<!-- more -->

# Directly Call System Functions to Get Stack Information at Crash Time

This method can get simple crash information, but cannot work with dSYM files to locate specific lines of code. Also, the types of crashes that can be obtained are limited. If you want to get more information, more work is needed (the open-source plcrashreporter mentioned below has already done this).

- signal to catch error signals
- NSSetUncaughtExceptionHandler for uncaught OC exceptions

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
    NSArray *arr = [exception callStackSymbols];//Get current call stack information
    NSString *reason = [exception reason];//Very important, the reason for the crash
    NSString *name = [exception name];//Exception type
}

void SignalHandler(int code)
{
    NSLog(@"signal handler = %d",code);
}

void InitCrashReport()
{
    // 1 Catch Linux error signals
    for (int i = 0; i < s_fatal_signal_num; ++i) {
        signal(s_fatal_signals[i], SignalHandler);
    }
    
    // 2 Catch uncaught Objective-C exceptions
    NSSetUncaughtExceptionHandler(&UncaughtExceptionHandler);
}
int main(int argc, char * argv[]) {
    @autoreleasepool {
        InitCrashReport();

        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
}

~~~ 

# Using PLCrashReporter

## Official Website 
<https://www.plcrashreporter.org/>

## Installation
Can be installed using CocoaPods:
~~~ 
pod 'PLCrashReporter', '~> 1.2'
~~~ 

## Example
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

## Working with dSYM Files

~~~ 
     crashData = [crashReporter loadPendingCrashReportDataAndReturnError: &error];
~~~ 
The returned NSData is in plcrashreporter's private format. It can be converted to standard Apple crash logs using the official `plcrashutil` tool.

For example:

1- Open the example project, Command + R to run, then exit the program.

2- Run plcrashreporter2 separately through the simulator. Click Exception to trigger a crash.

3- Open the App again, and the App will automatically record the crash log as d.plcrash.

4- Open Xcode menu, Window -> Projects, click the small arrow to the right of Derived Data, enter /Users/everettjf/Library/Developer/Xcode/DerivedData/plcrashreportertest2-aoaojvrcqilsxqcarfmgulsddpvc/

5- Manually enter the directory Build/Products/Debug-iphonesimulator, which contains plcrashreportertest2.app.dSYM and plcrashreportertest2.app files. (For convenience of demonstration) Copy these two files to the desktop. (Note: When archiving for product release, corresponding dSYM files will also be generated in another directory. These directories can actually be configured. Some tools like shenzhen or gym in fastlane will automatically package the dSYM folder into a zip.) (Another note: dSYM is a folder)

6- Copy out the d.plcrash file. On my machine it's at this path 
`/Users/everettjf/Library/Developer/CoreSimulator/Devices/319973DD-0853-494A-8688-DC73E733019D/data/Containers/Data/Application/D85F4320-1826-4EDD-8167-1197BFA5ACBA/Documents/` 
(You can see the terminal output) (The final folder is different for different simulators) Also copy to desktop.

7- Convert to Apple log format

~~~ 
$ plcrashutil convert --format=ios d.plcrash > apple.log
~~~ 

8- dwarfdump to view uuid

~~~ 
$ dwarfdump --uuid plcrashreportertest2.app/plcrashreportertest2
UUID: B1020E4A-07DD-35E4-B3F0-71E3B7CA49BB (x86_64) plcrashreportertest2.app/plcrashreportertest2
$ dwarfdump --uuid plcrashreportertest2.app.dSYM
UUID: B1020E4A-07DD-35E4-B3F0-71E3B7CA49BB (x86_64) plcrashreportertest2.app.dSYM/Contents/Resources/DWARF/plcrashreportertest2
~~~ 

9- View crashlog's uuid

~~~ 
Binary Images:
       0x107d23000 -        0x107d4efff +plcrashreportertest2 x86_64  <b1020e4a07dd35e4b3f071e3b7ca49bb> ......

~~~ 

10- If the three uuids match, you can analyze.

11- symbolicatecrash tool

~~~ 
    - Just copy this deeply hidden tool out.

Xcode 7.2 and earlier:
/Applications/Xcode.app/Contents/SharedFrameworks/DTDeviceKitBase.framework/Versions/A/Resources/symbolicatecrash

Xcode 7.3
/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/symbolicatecrash

cd /Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/
cp symbolicatecrash ~/Desktop
    - Set DEVELOPER_DIR.
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
    - Export.
$ ./symbolicatecrash apple.log plcrashreportertest2.app.dSYM > result.log
~~~ 

12- Finally, atos, where 0x107d23000 can be seen after Binary Images:. 0x0000000107d24c3e is in Last Exception Backtrace.

~~~ 
$ xcrun atos -o plcrashreportertest2.app/plcrashreportertest2 -l 0x107d23000
0x0000000107d24c3e
-[ViewController exceptionTouchUp:] (in plcrashreportertest2) (ViewController.m:84)
~~~ 


# Conclusion
This atos still requires manually entering each one, which is troublesome. I don't know if there's a tool like windbg on Windows for Mac or iOS. I'll add it when I find out.

# Other Open Source Projects
- KSCrash
  <https://github.com/kstenerud/KSCrash>

# References
- <http://www.jamiegrove.com/software/fixing-bugs-using-os-x-crash-logs-and-atos-to-symbolicate-and-find-line-numbers>



