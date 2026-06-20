---
layout: post
title: "The Simplest Model for Categorizing and Scheduling iOS App Launch Tasks"
title_zh: "iOS 应用启动任务分类与调度的最简模型"
lang_original: zh
categories:
  - 性能优化
tags:
  - 简单
comments: true
---

For an "aging" app, the work done during launch keeps piling up, the code in didFinishLaunchingWithOptions gets longer and longer, and the line count of AppDelegate.m keeps growing. It's time to categorize and organize them.

<!-- more -->

The tasks during app launch can be simply divided into the following categories:

1. Tasks that must be initialized on the main thread as early as possible
2. Tasks that can be executed on a background thread
3. Main-thread tasks that can run in parallel with the tasks in category 2
4. Tasks that can be executed on a background thread after the home page is shown

So we can define four categories of Task:

```
@interface TKKTaskList : NSObject

+ (NSArray<NSString*>*)basicTasks;
+ (NSArray<NSString*>*)syncTasks;
+ (NSArray<NSString*>*)asyncTasks;
+ (NSArray<NSString*>*)asyncTasksAfterLaunch;

@end
```

Each category contains multiple Task names. Each Task corresponds to a class.

Assume each Task class has a +run method.

```
@interface Task : NSObject
@end
@implementation Task
+(void)run{
    // todo
}
@end
```


To execute this batch of Tasks, create two serial queues.

```
        _async_queue = dispatch_queue_create("com.everettjf.asynctask", DISPATCH_QUEUE_SERIAL);
        _async_queue_after_launch = dispatch_queue_create("com.everettjf.asynctaskafterlaunch", DISPATCH_QUEUE_SERIAL);
```

Then invoke them on the corresponding queues.

```

- (void)runBasicTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList basicTasks] queue:0];
}

- (void)runAsyncTasks
{
    dispatch_async(_async_queue, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:1];
    });
}


- (void)runSyncTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList syncTasks] queue:0];
}

- (void)runAsyncTasksAfterLaunch
{
    dispatch_async(_async_queue_after_launch, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:2];
    });
}

+ (void)executeTasks:(NSArray<NSString*>*) tasks queue:(int)queueType
{
    for(NSString *className in tasks){

        Class cls = NSClassFromString(className);
        if([cls respondsToSelector:@selector(run)]){
            [cls run];
        }else{
            NSLog(@"no +run for %@", className);
        }
    }
}

```

For demonstration, you can define a bunch of Tasks:

```
#define TaskDeclare(TaskName) \
@interface TaskName : NSObject \
@end \
@implementation TaskName \
+(void)run{ usleep(arc4random() % 4 * 1000 *1000 + 1000*1000); } \
@end

@interface TTHookTask : NSObject
@end
@implementation TTHookTask
+(void)run{
    usleep(arc4random() % 4 * 1000 *1000 + 1000*1000);
}
@end


TaskDeclare(TTObserveTask)

TaskDeclare(TTAppleTask)
TaskDeclare(TTBananaTask)
TaskDeclare(TTPearTask)

TaskDeclare(TTLoginTask)
TaskDeclare(TTPrepareTask)
TaskDeclare(TTPrefetchTask)
TaskDeclare(TTProcessTask)
TaskDeclare(TTCompletionTask)
TaskDeclare(TTDoneTask)

TaskDeclare(TTDownloadTask)
TaskDeclare(TTRenderTask)

```


Finally, using os_signpost (for os_signpost see the article https://everettjf.github.io/2018/08/13/os-signpost-tutorial/ ), you can see:

![](/media/15350423765697.jpg)


Sample code:

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/TaskSample/TaskSample/Task/TKKTaskManager.m>

In summary,

Through simple categorization and reflective invocation, you can store tasks in different files by category, making them easier to maintain and easier to adjust the execution order of tasks.

This article really couldn't be any simpler. Bit of a filler. Ha.



Welcome to follow the WeChat official account "客户端技术评论":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)

<!--ZH-->

一个“有年头”的App，启动中要做的工作不断的累加，didFinishLaunchingWithOptions中的代码越来越长，AppDelegate.m文件的行数也越来越多。那么是时候分类存放了。

<!-- more -->

App启动中的任务可以简单分为下面几类：

1. 必须最早在主线程初始化的任务
2. 可以子线程执行的任务
3. 可以与2中的任务并行执行的主线程任务
4. 可以在首页显示后子线程执行的任务

那么可以定义四类Task：

```
@interface TKKTaskList : NSObject

+ (NSArray<NSString*>*)basicTasks;
+ (NSArray<NSString*>*)syncTasks;
+ (NSArray<NSString*>*)asyncTasks;
+ (NSArray<NSString*>*)asyncTasksAfterLaunch;

@end
```

每个类别包含多个Task名称。每个Task对应一个类。

假设每个Task类都有一个+run方法。

```
@interface Task : NSObject
@end
@implementation Task
+(void)run{
    // todo
}
@end
```


为了执行这堆Task，创建两个串型queue。

```
        _async_queue = dispatch_queue_create("com.everettjf.asynctask", DISPATCH_QUEUE_SERIAL);
        _async_queue_after_launch = dispatch_queue_create("com.everettjf.asynctaskafterlaunch", DISPATCH_QUEUE_SERIAL);
```

然后在对应的queue调用。

```

- (void)runBasicTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList basicTasks] queue:0];
}

- (void)runAsyncTasks
{
    dispatch_async(_async_queue, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:1];
    });
}


- (void)runSyncTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList syncTasks] queue:0];
}

- (void)runAsyncTasksAfterLaunch
{
    dispatch_async(_async_queue_after_launch, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:2];
    });
}

+ (void)executeTasks:(NSArray<NSString*>*) tasks queue:(int)queueType
{
    for(NSString *className in tasks){

        Class cls = NSClassFromString(className);
        if([cls respondsToSelector:@selector(run)]){
            [cls run];
        }else{
            NSLog(@"no +run for %@", className);
        }
    }
}

```

为了演示，可以定义一堆Task：

```
#define TaskDeclare(TaskName) \
@interface TaskName : NSObject \
@end \
@implementation TaskName \
+(void)run{ usleep(arc4random() % 4 * 1000 *1000 + 1000*1000); } \
@end

@interface TTHookTask : NSObject
@end
@implementation TTHookTask
+(void)run{
    usleep(arc4random() % 4 * 1000 *1000 + 1000*1000);
}
@end


TaskDeclare(TTObserveTask)

TaskDeclare(TTAppleTask)
TaskDeclare(TTBananaTask)
TaskDeclare(TTPearTask)

TaskDeclare(TTLoginTask)
TaskDeclare(TTPrepareTask)
TaskDeclare(TTPrefetchTask)
TaskDeclare(TTProcessTask)
TaskDeclare(TTCompletionTask)
TaskDeclare(TTDoneTask)

TaskDeclare(TTDownloadTask)
TaskDeclare(TTRenderTask)

```


最后，使用os_signpost （os_signpost可以参考文章 https://everettjf.github.io/2018/08/13/os-signpost-tutorial/ ）可以看到：

![](/media/15350423765697.jpg)


示例代码见：

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/TaskSample/TaskSample/Task/TKKTaskManager.m>

总结，

通过简单的分类和反射调用，可以把任务分类存放在不同的文件中，便于维护，也便于调整任务的先后执行顺序。

这篇文章确实简单的不能再简单了。有点水。哈。



欢迎关注订阅号「客户端技术评论」：
![happyhackingstudio](https://everettjf.github.io/images/fun.png)
